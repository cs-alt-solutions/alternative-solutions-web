/* src/app/api/webhooks/stripe/route.ts */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import Stripe from 'stripe';

// Initialize the Stripe server client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', // Locked to the installed NPM package version
});

export async function POST(req: Request) {
  const body = await req.text();
  
  // FIX: Await the headers Promise before calling .get()
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing Stripe signature or webhook secret.');
    }
    
    // Verify the event came legitimately from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed.', error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle successful checkout sessions
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract the data we need
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const amountTotal = (session.amount_total || 0) / 100; // Convert cents to dollars
    const mode = session.mode; // 'payment' (one-time) or 'subscription' (recurring)

    if (customerEmail) {
      // Determine Tier Logic
      let tier = 'OBSERVER';
      if (mode === 'subscription') {
        tier = amountTotal === 5 ? 'BUILDER' : 'BACKER';
      } else if (mode === 'payment') {
        tier = 'BOOST';
      }

      // Upsert the data into your Supabase ledger
      const { error } = await supabase
        .from('supporters')
        .upsert({
          email: customerEmail,
          name: customerName || null,
          tier: tier,
          status: 'ACTIVE',
          amount: amountTotal,
        }, { onConflict: 'email' });

      if (error) {
        console.error('Error logging to Supabase:', error);
        return new NextResponse('Database Error', { status: 500 });
      }
    }
  }

  return new NextResponse('Webhook Received', { status: 200 });
}