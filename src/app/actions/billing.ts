// src/app/actions/billing.ts
'use server';

import Stripe from 'stripe';

// Initialize the Stripe engine securely on the server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', // Updated to match your installed SDK version
});

export async function createStorefrontCheckout(storefrontId: string, clientEmail: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: clientEmail, // Pre-fills the form to reduce friction
      line_items: [
        {
          // We will put your actual $5/mo Stripe Price ID in your .env file
          price: process.env.STRIPE_PRICE_ID_FOUNDATION, 
          quantity: 1,
        },
      ],
      // 🚨 THE HANDSHAKE: This is the most important part of the architecture 🚨
      // By nesting the metadata inside 'subscription_data', Stripe will permanently 
      // stamp this specific Storefront ID onto the recurring subscription object.
      subscription_data: {
        metadata: {
          storefront_id: storefrontId, 
        },
      },
      // Where they go after they pay (or if they back out)
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/storefronts?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/storefronts?payment=canceled`,
    });

    // Return the secure Stripe URL so the frontend can route the user there
    return { url: session.url };

  } catch (error: any) {
    console.error('STRIPE CHECKOUT ERROR:', error);
    return { error: error.message };
  }
}