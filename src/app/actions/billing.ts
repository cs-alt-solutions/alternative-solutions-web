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
      
      // 🚀 THE FIX: Attach the ID to the root session so the webhook catches it instantly
      client_reference_id: storefrontId,
      metadata: { storefront_id: storefrontId },

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
      console.log(`  -> Invoice: ${inv.id} | Status: ${inv.status} | Amount: $${(inv.amount_paid / 100).toFixed(2)}`);
      
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

// 🚀 THE FIX: Explicitly typing the return clears the "string | undefined" TS error
export async function getUpcomingInvoice(customerId: string): Promise<{ success: boolean; amount?: string; date?: string; error?: string }> {
  try {
    console.log(`\n=== 🔮 STRIPE UPCOMING PREDICTOR ===`);
    
    // 🚀 THE FIX: 'retrieveUpcoming' was deleted in the new SDK. We must use 'createPreview'.
    const upcoming = await stripe.invoices.createPreview({
      customer: customerId,
    });

    const targetDate = upcoming.next_payment_attempt || upcoming.period_end || upcoming.created;

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

// 🚀 Fetch Master Global Invoices for The Ledger (Now Strictly Filtered by Price ID)
export async function getGlobalInvoices() {
  try {
    const invoices = await stripe.invoices.list({
      limit: 100,
      status: 'paid', 
      expand: ['data.customer', 'data.subscription'], 
    });

    const targetPriceId = process.env.STRIPE_PRICE_ID_FOUNDATION;

    const filteredInvoices = invoices.data.filter((inv: any) => {
      // 1. Ensure the subscription contains your specific Storefront Metadata
      const hasStorefrontMeta = inv.subscription?.metadata?.storefront_id !== undefined;
      
      // 2. Ensure the invoice is explicitly paying for your $5 Foundation Price ID
      // This permanently sweeps out any old tests or random Stripe products
      const hasMatchingPrice = inv.lines?.data?.some((line: any) => line.price?.id === targetPriceId);

      return hasStorefrontMeta && hasMatchingPrice;
    });

    const recentStorefrontInvoices = filteredInvoices.slice(0, 50);

    const formattedInvoices = recentStorefrontInvoices.map((inv: any) => {
      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: (inv.amount_paid / 100).toFixed(2),
        status: inv.status,
        customerEmail: inv.customer?.email || 'Unknown Client',
        customerName: inv.customer?.name || 'No Name',
        pdfUrl: inv.invoice_pdf,
      };
    });

    return { success: true, invoices: formattedInvoices };
    
  } catch (error: any) {
    console.error("❌ STRIPE GLOBAL API ERROR:", error);
    return { success: false, error: error.message };
  }
}

export async function createProTierCheckout(storefrontId: string, customerEmail: string, customDomain: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      
      // 🚀 THE FIX: Attach the ID to the root session here as well
      client_reference_id: storefrontId,
      metadata: { storefront_id: storefrontId },

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PROFESSIONAL, // Your new $15 Live Key!
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          storefront_id: storefrontId,
          tier: 'PROFESSIONAL',
          // 🚨 We attach their requested domain directly to the Stripe receipt
          custom_domain: customDomain 
        },
      },
      success_url: `${origin}/portal/${storefrontId}?payment=success`,
      cancel_url: `${origin}/portal/${storefrontId}?payment=canceled`,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("PRO CHECKOUT ERROR:", error);
    return { error: error.message };
  }
}