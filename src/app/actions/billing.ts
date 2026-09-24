/* src/app/actions/billing.ts */
'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover',
});

export async function createStorefrontCheckout(storefrontId: string, customerEmail: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: [{ price: process.env.STRIPE_PRICE_ID_FOUNDATION, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        metadata: { storefront_id: storefrontId, tier: 'FOUNDATION' },
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

export async function createProTierCheckout(storefrontId: string, customerEmail: string, customDomain: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail || undefined,
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PROFESSIONAL, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        metadata: { storefront_id: storefrontId, tier: 'PROFESSIONAL', custom_domain: customDomain },
      },
      success_url: `${origin}/portal/${storefrontId}?payment=success`,
      cancel_url: `${origin}/portal/${storefrontId}?payment=canceled`,
      allow_promotion_codes: true,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("STRIPE PRO CHECKOUT ERROR:", error);
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
    if (!customerId) return { success: false, error: "No Customer ID provided." };

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 12, 
    });

    const formattedInvoices = invoices.data.map(inv => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: (inv.amount_paid / 100).toFixed(2),
      status: inv.status,
      pdfUrl: inv.invoice_pdf, 
    }));

    return { success: true, invoices: formattedInvoices };
  } catch (error: any) {
    console.error("STRIPE API ERROR:", error);
    return { success: false, error: error.message };
  }
}

export async function getUpcomingInvoice(customerId: string) {
  try {
    const upcoming = await (stripe.invoices as any).retrieveUpcoming({
      customer: customerId,
    });

    const targetDate = upcoming.created || upcoming.period_end;
    const formattedDate = new Date(targetDate * 1000).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    return { 
      success: true, 
      amount: (upcoming.amount_due / 100).toFixed(2),
      date: formattedDate
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 🚀 Fetch Master Global Invoices
export async function getGlobalInvoices() {
  try {
    const invoices = await stripe.invoices.list({
      limit: 100,
      // Removed status: 'paid' so you can see pending/open invoices too if Stripe is lagging
    });

    const formattedInvoices = invoices.data.map((inv: any) => {
      // 🚀 RESTORED THE MISSING DATA
      const lineItemDesc = inv.lines?.data?.[0]?.description || 'Storefront Subscription';
      
      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: (inv.amount_paid / 100).toFixed(2),
        subtotal: (inv.subtotal / 100).toFixed(2), // Fixed missing subtotal for promo math!
        status: inv.status,
        customerEmail: inv.customer_email || 'Unknown Client',
        customerName: inv.customer_name || 'No Name',
        customerId: typeof inv.customer === 'string' ? inv.customer : inv.customer?.id || '',
        subscriptionId: typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id || '',
        pdfUrl: inv.invoice_pdf,
        lineItem: lineItemDesc // Restored Line Item Text
      };
    });

    return { success: true, invoices: formattedInvoices };
  } catch (error: any) {
    console.error("STRIPE GLOBAL API ERROR:", error);
    return { success: false, error: error.message };
  }
}