/* src/app/actions/billing.ts */
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
    console.log(`\n=== 🔎 STRIPE INVOICE WIRETAP ===`);
    console.log(`REQUESTED CUSTOMER ID: ${customerId}`);
    
    if (!customerId) {
      console.log(`❌ ERROR: The Customer ID is undefined or empty!`);
      return { success: false, error: "No Customer ID provided." };
    }

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 12, 
    });

    console.log(`✅ STRIPE REPLY: Found ${invoices.data.length} invoices for this ID.`);

    const formattedInvoices = invoices.data.map(inv => {
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

export async function getUpcomingInvoice(customerId: string) {
  try {
    console.log(`\n=== 🔮 STRIPE UPCOMING PREDICTOR ===`);
    
    const upcoming = await (stripe.invoices as any).retrieveUpcoming({
      customer: customerId,
    });

    const targetDate = upcoming.created || upcoming.period_end;

    const formattedDate = new Date(targetDate * 1000).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    console.log(`✅ PREDICTION: $${(upcoming.amount_due / 100).toFixed(2)} on ${formattedDate}`);
    console.log(`=================================\n`);

    return { 
      success: true, 
      amount: (upcoming.amount_due / 100).toFixed(2),
      date: formattedDate
    };
  } catch (error: any) {
    console.log(`ℹ️ No upcoming invoice found (or subscription canceled). Error: ${error.message}`);
    console.log(`=================================\n`);
    return { success: false, error: error.message };
  }
}

// 🚀 NEW: Fetch Master Global Invoices for The Ledger
export async function getGlobalInvoices() {
  try {
    // 1. Ask Stripe for the last 100 successful payments globally.
    // We expand the subscription object so we can read the metadata!
    const invoices = await stripe.invoices.list({
      limit: 100,
      status: 'paid', 
      expand: ['data.customer', 'data.subscription'], 
    });

    // 2. THE BULLETPROOF METADATA FILTER
    // We cast 'inv' to 'any' to bypass strict TS definitions that forget 'subscription' is expanded
    const filteredInvoices = invoices.data.filter((inv: any) => {
      return inv.subscription?.metadata?.storefront_id !== undefined;
    });

    // Slice it back down to a clean 50 for the UI
    const recentStorefrontInvoices = filteredInvoices.slice(0, 50);

    const formattedInvoices = recentStorefrontInvoices.map((inv: any) => {
      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: (inv.amount_paid / 100).toFixed(2),
        status: inv.status,
        customerEmail: inv.customer?.email || 'Unknown Client',
        customerName: inv.customer?.name || 'No Name',
        pdfUrl: inv.invoice_pdf, // The magic secure download link
      };
    });

    return { success: true, invoices: formattedInvoices };
    
  } catch (error: any) {
    console.error("❌ STRIPE GLOBAL API ERROR:", error);
    return { success: false, error: error.message };
  }
}