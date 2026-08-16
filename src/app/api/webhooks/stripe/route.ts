import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 
import Stripe from 'stripe';
import { Resend } from 'resend';
import * as React from 'react';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';

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
    .maybeSingle();

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
    
    // THE GOLD STANDARD: Look for the Storefront ID/Slug in the URL reference
    let targetIdentifier = session.client_reference_id || session.metadata?.storefront_id;
    
    if (!targetIdentifier && session.subscription) {
       const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
       targetIdentifier = subscription.metadata?.storefront_id;
    }

    // ------------------------------------------------------------------
    // PATH A: THE STOREFRONT SAAS ENGINE 
    // ------------------------------------------------------------------
    if (targetIdentifier) {
      console.log(`💳 Processing SaaS Payment for Storefront: ${targetIdentifier}`);
      
      // Bulletproof UUID vs Slug Check
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetIdentifier);
      const queryColumn = isUUID ? 'id' : 'slug';

      // 1. Fetch the existing storefront to grab the current audit_notes
      const { data: storeData, error: fetchError } = await supabaseAdmin
        .from('storefronts')
        .select('audit_notes, contact_email, business_name, contact_name')
        .eq(queryColumn, targetIdentifier)
        .single();

      if (fetchError) {
        console.error("Storefront Database Fetch Failed:", fetchError);
        return new NextResponse('Database Error', { status: 500 });
      }

      const clientEmail = session.customer_details?.email || storeData?.contact_email;

      // 2. Create the new Payment Log
      const paymentLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        author: "SYSTEM",
        type: "PAYMENT_CLEARED",
        message: `Subscription activated via Stripe. Payment cleared for ${clientEmail}. System upgraded to ACTIVE.`
      };

      const currentLogs = storeData?.audit_notes || [];
      const updatedLogs = [...currentLogs, paymentLog];

      // 3. Update the Storefront with the new status and the log
      const { error: storeError } = await supabaseAdmin
        .from('storefronts')
        .update({ 
          status: 'ACTIVE', 
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          audit_notes: updatedLogs
        })
        .eq(queryColumn, targetIdentifier); 

      if (storeError) {
        console.error("Storefront Database Update Failed:", storeError);
        return new NextResponse('Database Error', { status: 500 });
      } 
      
      // ------------------------------------------------------------------
      // 4. THE MAGIC LINK GENERATOR & PORTAL INVITE DISPATCH
      // ------------------------------------------------------------------
      if (clientEmail) {
        try {
          // Generate the passwordless login URL directly into their portal
          const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: clientEmail,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/portal/${targetIdentifier}`
            }
          });

          if (linkError) throw linkError;

          if (linkData?.properties?.action_link) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            // Dispatch the sleek invite email with the Magic Link attached
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
              to: [clientEmail],
              subject: `Welcome to your Workspace: ${storeData.business_name || 'Storefront'}`,
              react: React.createElement(PortalInviteEmail, {
                workspaceName: storeData.business_name || 'Your Storefront',
                magicLink: linkData.properties.action_link,
                clientName: storeData.contact_name || 'Client',
              })
            });
            console.log(`✉️ Portal Invite with Magic Link dispatched to ${clientEmail}`);

            // 🚨 2. NEW: DISPATCH THE HYPE EMAIL TO YOU (THE ADMIN) 🚨
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "portal@alternativesolutions.io",
              to: [process.env.ADMIN_EMAIL || 'courtney@alternativesolutions.io'], // Sends to your admin email
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
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://alternativesolutions.io'}/dashboard/storefronts" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #10b981; color: #000; text-decoration: none; font-weight: bold; border-radius: 6px; text-transform: uppercase;">Open Command Center</a>
                </div>
              `
            });
            console.log(`🚨 Admin Alert dispatched to HQ for ${storeData.business_name}`);
          }
        } catch (emailErr) {
          // We catch this so an email failure doesn't crash the Stripe 200 OK response
          console.error("Failed to generate or send Magic Link:", emailErr);
        }
      }

      console.log(`✅ Storefront [${targetIdentifier}] successfully activated and logged!`);
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
        .maybeSingle();

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