/* src/app/api/webhooks/stripe/route.ts */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is missing.');
    return new NextResponse('Configuration Error', { status: 500 });
  }

  // 1. Initialize Stripe
  const stripe = new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover',
  });

  // 2. Initialize a secure Supabase Admin connection (Bypasses RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing Stripe signature or webhook secret.');
    }
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Idempotency: Ignore duplicate Stripe deliveries
  const { data: existingWebhook } = await supabaseAdmin
    .from('processed_webhooks')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();

  if (existingWebhook) {
    return NextResponse.json({ received: true });
  }

  await supabaseAdmin.from('processed_webhooks').insert([
    { id: event.id, event_type: event.type }
  ]);

  // ====================================================================
  // 1. INITIAL CHECKOUT (Client Pays Upfront)
  // ====================================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    let targetIdentifier = session.client_reference_id || session.metadata?.storefront_id;
    let currentPeriodEnd = null;

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      if (!targetIdentifier) targetIdentifier = subscription.metadata?.storefront_id;
      
      currentPeriodEnd = new Date((subscription as any).current_period_end * 1000).toISOString();
    }

    if (targetIdentifier) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetIdentifier);
      const queryColumn = isUUID ? 'id' : 'slug';

      const { data: storeData } = await supabaseAdmin
        .from('storefronts')
        .select('*')
        .eq(queryColumn, targetIdentifier)
        .single();

      if (storeData) {
        const clientEmail = session.customer_details?.email || storeData.contact_email;
        const requestedTier = session.metadata?.tier || storeData.plan_tier || 'Standard';

        // Update Storefront: Advance to Work Queue (PENDING_BUILD)
        await supabaseAdmin
          .from('storefronts')
          .update({
            status: 'PENDING_BUILD',
            plan_tier: requestedTier,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            current_period_end: currentPeriodEnd, 
            updated_at: new Date().toISOString()
          })
          .eq(queryColumn, targetIdentifier);

        // Send Welcome Magic Link to Client
        if (clientEmail) {
          try {
            // Generate link WITHOUT the redirectTo option so we can capture the raw hashed_token
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
              type: 'magiclink',
              email: clientEmail,
            });

            if (linkError) throw linkError;

            if (linkData?.properties?.hashed_token) {
              const origin = process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io';
              
              // Construct the secure route manually to bypass the Hash Fragment trap
              const secureLink = `${origin}/api/auth/callback?token_hash=${linkData.properties.hashed_token}&type=magiclink`;

              await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
                to: [clientEmail],
                subject: `Workspace Activated: ${storeData.business_name}`,
                html: `
                  <div style="font-family: sans-serif; background-color: #09090b; color: #ffffff; padding: 32px; border-radius: 12px;">
                    <h2 style="color: #22d3ee; margin-top: 0;">Payment Cleared!</h2>
                    <p style="color: #a1a1aa;">Your subscription for <strong>${storeData.business_name}</strong> is confirmed and your build is officially in the queue.</p>
                    <a href="${secureLink}" style="display: inline-block; background-color: #22d3ee; color: #000000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">Enter Your Workspace</a>
                  </div>
                `
              });
            }
          } catch (e) {
            console.error('Magic link dispatch error:', e);
          }
        }

        // Notify Admin: Telemetry Alert
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
          to: [process.env.ADMIN_EMAIL || 'courtney@alternativesolutions.io'],
          subject: `🚨 PAID INTAKE: ${storeData.business_name} ($${session.amount_total ? session.amount_total / 100 : '5'}/mo)`,
          html: `
            <div style="font-family: monospace; background-color: #09090b; color: #10b981; padding: 24px; border-radius: 8px; border: 1px solid #059669;">
              <h2 style="color: #34d399; margin: 0 0 12px 0;">New Paid Client in Work Queue</h2>
              <p><strong>Business:</strong> ${storeData.business_name}</p>
              <p><strong>Client:</strong> ${storeData.primary_contact || clientEmail}</p>
              <p><strong>Tier:</strong> ${requestedTier}</p>
              <p><strong>Status:</strong> PENDING_BUILD</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io'}/dashboard/storefronts" style="display: inline-block; margin-top: 16px; background-color: #10b981; color: #000000; font-weight: bold; padding: 10px 20px; border-radius: 6px; text-decoration: none;">View Work Queue</a>
            </div>
          `
        });
      }
      return NextResponse.json({ received: true });
    }
  }

  // ====================================================================
  // 2. SUBSCRIPTION UPDATES (Tier Switches: $5 -> $15, Cancellations)
  // ====================================================================
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const { data: store } = await supabaseAdmin
      .from('storefronts')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (store) {
      const priceId = subscription.items.data[0]?.price.id;
      const isProfessional = priceId === process.env.STRIPE_PRICE_ID_PROFESSIONAL;
      const updatedPlan = isProfessional ? 'Professional' : 'Standard';

      const isCanceled = event.type === 'customer.subscription.deleted' || subscription.status === 'canceled';
      const updatedStatus = isCanceled ? 'CANCELED' : store.status;
      
      const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000).toISOString();

      await supabaseAdmin
        .from('storefronts')
        .update({
          plan_tier: updatedPlan,
          status: updatedStatus,
          current_period_end: currentPeriodEnd,
          updated_at: new Date().toISOString()
        })
        .eq('id', store.id);

      if (store.plan_tier !== updatedPlan || isCanceled) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
          to: [process.env.ADMIN_EMAIL || 'courtney@alternativesolutions.io'],
          subject: isCanceled 
            ? `🛑 CANCELLATION: ${store.business_name} canceled subscription`
            : `📈 TIER CHANGE: ${store.business_name} switched to ${updatedPlan}`,
          html: `<p>Subscription update for <strong>${store.business_name}</strong>. Current Status: ${updatedStatus}, Tier: ${updatedPlan}.</p>`
        });
      }
    }
    return NextResponse.json({ received: true });
  }

  // ====================================================================
  // 3. THE RECOVERY (invoice.payment_succeeded)
  // ====================================================================
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;
    
    if ((invoice as any).subscription) {
      const { data: store } = await supabaseAdmin
        .from('storefronts')
        .select('*')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();
  
      if (store && (store.status === 'MAINTENANCE' || store.status === 'CANCELED')) {
        await supabaseAdmin
          .from('storefronts')
          .update({
            status: 'ACTIVE',
            updated_at: new Date().toISOString()
          })
          .eq('id', store.id);
  
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
          to: [process.env.ADMIN_EMAIL || 'courtney@alternativesolutions.io'],
          subject: `🟢 RECOVERY: ${store.business_name} Paid!`,
          html: `<p>Payment successfully cleared for <strong>${store.business_name}</strong>. The system has automatically removed the MAINTENANCE lock and restored them to ACTIVE status.</p>`
        });
      }
    }
    return NextResponse.json({ received: true });
  }

  // ====================================================================
  // 4. FAILED CHARGES (Declined Cards / Past Due)
  // ====================================================================
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    const { data: store } = await supabaseAdmin
      .from('storefronts')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (store) {
      await supabaseAdmin
        .from('storefronts')
        .update({
          status: 'MAINTENANCE',
          updated_at: new Date().toISOString()
        })
        .eq('id', store.id);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
        to: [process.env.ADMIN_EMAIL || 'courtney@alternativesolutions.io'],
        subject: `⚠️ FAILED PAYMENT: ${store.business_name}`,
        html: `<p>Payment failed for <strong>${store.business_name}</strong>. System placed site into MAINTENANCE mode.</p>`
      });
    }
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}