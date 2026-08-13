import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 
import Stripe from 'stripe';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is missing.');
    return new NextResponse('Configuration Error', { status: 500 });
  }

  // 1. Initialize Stripe
  const stripe = new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover', // Update this if your Stripe version differs
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

  // ====================================================================
  // THE TRAFFIC DIRECTOR
  // ====================================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // THE GOLD STANDARD: Look for the Storefront Slug in the URL reference
    let targetSlug = session.client_reference_id || session.metadata?.storefront_id;
    
    if (!targetSlug && session.subscription) {
       const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
       targetSlug = subscription.metadata?.storefront_id;
    }

    // ------------------------------------------------------------------
    // PATH A: THE STOREFRONT SAAS ENGINE 
    // ------------------------------------------------------------------
    if (targetSlug) {
      console.log(`💳 Processing SaaS Payment for Storefront Slug: ${targetSlug}`);
      
      // 1. Fetch the existing storefront to grab the current audit_notes
      const { data: storeData, error: fetchError } = await supabaseAdmin
        .from('storefronts')
        .select('audit_notes, contact_email')
        .eq('slug', targetSlug)
        .single();

      if (fetchError) {
        console.error("Storefront Database Fetch Failed:", fetchError);
        return new NextResponse('Database Error', { status: 500 });
      }

      // 2. Create the new Payment Log
      const paymentLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        author: "SYSTEM",
        type: "PAYMENT_CLEARED",
        message: `Subscription activated via Stripe. Payment cleared for ${session.customer_details?.email || storeData?.contact_email}. System upgraded to LIVE.`
      };

      const currentLogs = storeData?.audit_notes || [];
      const updatedLogs = [...currentLogs, paymentLog];

      // 3. Update the Storefront with the new status and the log
      const { error: storeError } = await supabaseAdmin
        .from('storefronts')
        .update({ 
          status: 'LIVE', // Upgraded from 'ACTIVE' to align with Dashboard UI
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          audit_notes: updatedLogs
        })
        .eq('slug', targetSlug); 

      if (storeError) {
        console.error("Storefront Database Update Failed:", storeError);
        return new NextResponse('Database Error', { status: 500 });
      } 
      
      console.log(`✅ Storefront [${targetSlug}] successfully activated and logged!`);
      return NextResponse.json({ received: true });
    }

    // ------------------------------------------------------------------
    // PATH B: GRASSROOTS FOUNDATION SUPPORTERS 
    // ------------------------------------------------------------------
    console.log(`🌱 Processing General Supporter Payment (No Storefront Slug found).`);
    
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
      let tier = isSubscription ? (amountTotal === 5 ? 'BUILDER' : 'BACKER') : 'BOOST';
      if (!isSubscription && projectField) {
        tier = 'CLIENT'; 
      }

      const { data: existingUser } = await supabaseAdmin
        .from('supporters')
        .select('origin_tier')
        .eq('email', customerEmail)
        .single();

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
      console.log(`✅ Supporter ${customerEmail} logged successfully!`);
    }
  }

  return new NextResponse('Webhook Received', { status: 200 });
}