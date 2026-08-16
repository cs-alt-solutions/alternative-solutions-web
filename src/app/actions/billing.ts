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
          price: process.env.STRIPE_PRICE_ID_FOUNDATION, 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          storefront_id: storefrontId,
          tier: 'FOUNDATION'
        },
      },
      success_url: `${origin}/portal/${storefrontId}?payment=success`,
      cancel_url: `${origin}/portal/${storefrontId}?payment=canceled`,
      allow_promotion_codes: true, 
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return { error: error.message };
  }
}

export async function createCustomerPortalSession(customerId: string, storefrontId: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io';

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/portal/${storefrontId}/billing`, 
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Stripe Portal Error:', error);
    return { error: error.message };
  }
}

export async function getClientInvoices(customerId: string) {
  try {
    // 🚨 WIRETAP 1: See exactly what ID the Dashboard passed to the Server
    console.log(`\n=== 🔎 STRIPE INVOICE WIRETAP ===`);
    console.log(`REQUESTED CUSTOMER ID: ${customerId}`);
    
    if (!customerId) {
      console.log(`❌ ERROR: The Customer ID is undefined or empty!`);
      return { success: false, error: "No Customer ID provided." };
    }

    // Ask Stripe for the invoices
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 12, 
    });

    // 🚨 WIRETAP 2: See exactly what Stripe replied with
    console.log(`✅ STRIPE REPLY: Found ${invoices.data.length} invoices for this ID.`);

    const formattedInvoices = invoices.data.map(inv => {
      // 🚨 WIRETAP 3: See the exact status of the fetched invoices
      console.log(`   -> Invoice: ${inv.id} | Status: ${inv.status} | Amount: $${(inv.amount_paid / 100).toFixed(2)}`);
      
      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: (inv.amount_paid / 100).toFixed(2),
        status: inv.status,
        pdfUrl: inv.invoice_pdf, 
      };
    });

    console.log(`=================================\n`);
    return { success: true, invoices: formattedInvoices };
    
  } catch (error: any) {
    console.error("❌ STRIPE API ERROR:", error);
    return { success: false, error: error.message };
  }
}