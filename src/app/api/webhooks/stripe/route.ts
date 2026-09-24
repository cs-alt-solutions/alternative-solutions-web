import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';
import * as React from 'react';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';

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
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
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

  // 3. IDEMPOTENCY CHECK
  const { data: existingWebhook } = await supabaseAdmin
    .from('processed_webhooks')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();

  if (existingWebhook) {
    console.log(`Duplicate webhook ignored: ${event.id}`);
    return NextResponse.json({ received: true });
  }

  await supabaseAdmin.from('processed_webhooks').insert([
    { id: event.id, event_type: event.type }
  ]);

  // ====================================================================
  // THE TRAFFIC DIRECTOR
  // ====================================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // THE GOLD STANDARD: Look for the Storefront ID/Slug in the URL reference
    let targetIdentifier = session.client_reference_id || session.metadata?.storefront_id;
    
    if (!targetIdentifier && session.subscription) {
       const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
       targetIdentifier = subscription.metadata?.storefront_id;
    }

    // ------------------------------------------------------------------
    // THE STOREFRONT SAAS ENGINE
    // ------------------------------------------------------------------
    if (targetIdentifier) {
      console.log(`💳 Processing SaaS Payment for Storefront: ${targetIdentifier}`);
      
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetIdentifier);
      const queryColumn = isUUID ? 'id' : 'slug';

      const { data: storeData, error: fetchError } = await supabaseAdmin
        .from('storefronts')
        .select('id, audit_notes, contact_email, business_name, contact_name')
        .eq(queryColumn, targetIdentifier)
        .single();

      if (fetchError) {
        console.error("Storefront Database Fetch Failed:", fetchError);
        return new NextResponse('Database Error', { status: 500 });
      }

      const clientEmail = session.customer_details?.email || storeData?.contact_email;
      const clientName = storeData?.contact_name || session.customer_details?.name || 'Operator';
      const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://alternativesolutions.io';

      try {
        await supabaseAdmin
          .from('storefronts')
          .update({ 
             status: 'ACTIVE',
             stripe_customer_id: session.customer as string,
             stripe_subscription_id: session.subscription as string 
          })
          .eq('id', storeData.id);

        const magicLinkResponse = await supabaseAdmin.auth.admin.generateLink({
           type: 'magiclink',
           email: clientEmail,
           options: { redirectTo: `${origin}/api/auth/callback` }
        });

        const magicLink = magicLinkResponse.data?.properties?.action_link || `${origin}/login`;

        if (magicLinkResponse.data?.user?.id) {
          await supabaseAdmin.from('profiles').upsert({
            id: magicLinkResponse.data.user.id,
            email: clientEmail,
            full_name: clientName,
            role: 'CLIENT_OWNER',
            workspace_id: storeData.id
          }, { onConflict: 'id' });
        }

        await resend.emails.send({
          from: process.env.EMAIL_FROM_ADDRESS || 'Alternative Solutions <system@alternativesolutions.io>',
          to: clientEmail,
          subject: 'Access Granted: Secure Workspace',
          react: React.createElement(PortalInviteEmail, {
            clientName: clientName,
            workspaceName: storeData.business_name || 'Your Workspace',
            magicLink: magicLink,
            role: 'Client Owner'
          })
        });

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
          to: [process.env.ADMIN_EMAIL || 'courtney@alternativesolutions.io'],
          subject: `💰 NEW SUBSCRIBER: ${storeData.business_name || 'A Client'} just paid!`,
          html: `
            <div style="font-family: monospace; background-color: #09090b; color: #10b981; padding: 30px; border-radius: 10px; border: 1px solid #047857;">
              <h1 style="color: #34d399; text-transform: uppercase;">Payment Cleared!</h1>
              <p style="color: #a1a1aa; font-size: 16px;">Hell yes. <strong>${storeData.business_name}</strong> (${clientEmail}) just locked in their subscription.</p>
              <ul style="color: #d4d4d8; padding-left: 20px;">
                <li><strong>Status:</strong> Upgraded to ACTIVE</li>
                <li><strong>Portal:</strong> Unlocked & Magic Link Sent</li>
                <li><strong>Action Required:</strong> Log into your Admin Dashboard and begin final deployment prep.</li>
              </ul>
              <a href="${origin}/dashboard/storefronts" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #10b981; color: #000; text-decoration: none; font-weight: bold; border-radius: 6px; text-transform: uppercase;">Open Command Center</a>
            </div>
          `
        });

        console.log(`🚨 Admin Alert dispatched to HQ for ${storeData.business_name}`);
      } catch (emailErr) {
        console.error("Failed to generate or send Magic Link:", emailErr);
      }

      console.log(`✅ Storefront [${targetIdentifier}] successfully activated and logged!`);
      return NextResponse.json({ received: true });
    }

    // ------------------------------------------------------------------
    // UNMATCHED PAYMENTS (THE FIX: Path B Gutted)
    // ------------------------------------------------------------------
    console.log(`⚠️ Unmatched Checkout: Stripe checkout completed, but no Storefront ID was attached. Ignoring record.`);
  }

  return NextResponse.json({ received: true });
}