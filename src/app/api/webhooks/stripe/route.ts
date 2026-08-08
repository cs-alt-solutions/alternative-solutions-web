/* src/app/api/webhooks/stripe/route.ts */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // We need the raw client for Admin access
import Stripe from 'stripe';

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

  // 2. Initialize a secure Supabase Admin connection (Bypasses RLS to write background updates)
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
    
    // Cryptographically verify this actually came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // 3. IDEMPOTENCY CHECK: Prevent duplicate processing
  const { data: existingWebhook } = await supabaseAdmin
    .from('processed_webhooks')
    .select('id')
    .eq('id', event.id)
    .single();

  if (existingWebhook) {
    console.log(`Duplicate webhook ignored: ${event.id}`);
    return NextResponse.json({ received: true }); 
  }

  // Log the new webhook to lock it down
  await supabaseAdmin.from('processed_webhooks').insert([
    { id: event.id, event_type: event.type }
  ]);


  // 4. THE TRAFFIC DIRECTOR
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Attempt to find the hidden Storefront ID (either directly on the session or on the nested subscription)
    let storefrontId = session.metadata?.storefront_id;
    
    if (!storefrontId && session.subscription) {
       // If nested during the handshake, we fetch the actual subscription object to find it
       const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
       storefrontId = subscription.metadata?.storefront_id;
    }

    // ====================================================================
    // PATH A: THE STOREFRONT SAAS ENGINE
    // ====================================================================
    if (storefrontId) {
      console.log(`Processing SaaS Storefront Payment for ID: ${storefrontId}`);
      
      const { error } = await supabaseAdmin
        .from('storefronts')
        .update({ 
          subscription_status: 'active',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', storefrontId);

      if (error) {
        console.error("Storefront Database Update Failed:", error);
        return new NextResponse('Database Error', { status: 500 });
      } else {
        console.log(`Storefront ${storefrontId} successfully activated!`);
      }
      
      return NextResponse.json({ received: true }); // Done processing!
    }

    // ====================================================================
    // PATH B: GRASSROOTS FOUNDATION SUPPORTERS (Your Original Logic)
    // ====================================================================
    console.log(`Processing General Supporter Payment.`);
    
    // Extract Custom Fields
    const projectField = session.custom_fields?.find(f => f.key === 'project_name');
    const projectName = projectField?.text?.value || 'Organic';
    
    const displayField = session.custom_fields?.find(f => 
      f.label.custom?.toLowerCase().includes('display') || 
      f.label.custom?.toLowerCase().includes('anonymous')
    );
    const customDisplayName = displayField?.text?.value;

    const customerEmail = session.customer_details?.email?.toLowerCase().trim();
    const customerName = session.customer_details?.name;
    const amountTotal = (session.amount_total || 0) / 100;
    const isSubscription = session.mode === 'subscription';

    let finalDisplayName = 'Anonymous Builder';
    if (customDisplayName && customDisplayName.toLowerCase() !== 'anonymous') {
      finalDisplayName = customDisplayName;
    } else if (customDisplayName?.toLowerCase() === 'anonymous') {
      finalDisplayName = 'Anonymous';
    } else if (customerName) {
      finalDisplayName = customerName;
    }

    if (customerEmail) {
      // 1. Determine the New Tier
      let tier = isSubscription ? (amountTotal === 5 ? 'BUILDER' : 'BACKER') : 'BOOST';
      if (!isSubscription && projectField) {
        tier = 'CLIENT'; 
      }

      // 2. Fetch existing user 
      const { data: existingUser } = await supabaseAdmin
        .from('supporters')
        .select('origin_tier')
        .eq('email', customerEmail)
        .single();

      // 3. Upsert with Promotion Logic
      const { error } = await supabaseAdmin
        .from('supporters')
        .upsert({
          email: customerEmail,
          name: customerName || null,
          display_name: finalDisplayName,
          tier: tier,
          status: 'ACTIVE',
          amount: amountTotal,
          source: projectName,
          origin_tier: existingUser?.origin_tier || tier
        }, { onConflict: 'email' });

      if (error) {
        console.error('Error logging to Supabase supporters:', error);
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }

  return new NextResponse('Webhook Received', { status: 200 });
}