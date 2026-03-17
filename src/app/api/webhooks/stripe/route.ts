/* src/app/api/webhooks/stripe/route.ts */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('CRITICAL: STRIPE_SECRET_KEY is missing.');
    return new NextResponse('Configuration Error', { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2026-02-25.clover',
  });

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing Stripe signature or webhook secret.');
    }
    
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email?.toLowerCase().trim();
    const customerName = session.customer_details?.name;
    const amountTotal = (session.amount_total || 0) / 100;
    const mode = session.mode;

    if (customerEmail) {
      // 1. Determine the New Tier
      let newTier = 'OBSERVER';
      if (mode === 'subscription') {
        newTier = amountTotal === 5 ? 'BUILDER' : 'BACKER';
      } else if (mode === 'payment') {
        newTier = 'BOOST';
      }

      // 2. Fetch existing user to see if they have an origin_tier
      const { data: existingUser } = await supabase
        .from('supporters')
        .select('origin_tier')
        .eq('email', customerEmail)
        .single();

      // 3. Upsert with Promotion Logic
      const { error } = await supabase
        .from('supporters')
        .upsert({
          email: customerEmail,
          name: customerName || null,
          tier: newTier,
          status: 'ACTIVE',
          amount: amountTotal,
          // Only set origin_tier if they are a brand new user
          origin_tier: existingUser?.origin_tier || newTier
        }, { onConflict: 'email' });

      if (error) {
        console.error('Error logging to Supabase:', error);
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }

  return new NextResponse('Webhook Received', { status: 200 });
}