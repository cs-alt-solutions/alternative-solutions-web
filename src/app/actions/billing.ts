'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize the Stripe engine securely on the server
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover', // Updated to match your installed SDK version
});

export async function createStorefrontCheckout(storefrontId: string, customerEmail: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          // We will put your actual $5/mo Stripe Price ID in your .env file
          price: process.env.STRIPE_PRICE_ID_FOUNDATION, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      
      // 🚨 THE HANDSHAKE: This is the most important part of the architecture 🚨
      // By nesting the metadata inside 'subscription_data', Stripe will permanently
      // stamp this specific Storefront ID onto the recurring subscription object.
      subscription_data: {
        metadata: {
          storefront_id: storefrontId,
          tier: 'FOUNDATION'
        },
      },
      
      // Where they go after they pay (or if they back out)
      success_url: `${origin}/portal/${storefrontId}?payment=success`,
      cancel_url: `${origin}/portal/${storefrontId}?payment=canceled`,
      
      // Allow promotion codes so you can use your 100% off promotion
      allow_promotion_codes: true, 
    });

    // Return the secure Stripe URL so the frontend can route the user there
    return { url: session.url };
    
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { error: error.message };
  }
}