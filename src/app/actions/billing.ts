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
      client_reference_id: storefrontId,
      metadata: { storefront_id: storefrontId },
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
      client_reference_id: storefrontId,
      metadata: { storefront_id: storefrontId },
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
    return { error: error.message };
  }
}

export async function getClientInvoices(customerId: string) {
  try {
    if (!customerId) return { success: false, error: "No Customer ID provided." };

    const invoices = await stripe.invoices.list({ customer: customerId, limit: 12 });

    const formattedInvoices = invoices.data.map(inv => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: (inv.amount_paid / 100).toFixed(2),
      status: inv.status,
      pdfUrl: inv.invoice_pdf, 
      hostedUrl: inv.hosted_invoice_url,
    }));

    return { success: true, invoices: formattedInvoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUpcomingInvoice(customerId: string) {
  try {
    const upcoming = await stripe.invoices.createPreview({ customer: customerId });
    const targetDate = upcoming.next_payment_attempt || upcoming.period_end || upcoming.created;
    const formattedDate = new Date(targetDate * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return { 
      success: true, 
      amount: (upcoming.amount_due / 100).toFixed(2),
      date: formattedDate
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getGlobalInvoices() {
  try {
    const isTestMode = process.env.STRIPE_SECRET_KEY?.includes('sk_test');
    
    // We grab all invoices so the Frontend bouncer can do the filtering
    const invoices = await stripe.invoices.list({
      limit: 100,
      expand: ['data.customer', 'data.subscription'], 
    });

    const formattedInvoices = invoices.data.map((inv: any) => {
      const rawLineItem = inv.lines?.data?.[0]?.description || 'Storefront Subscription';
      const cleanLineItem = rawLineItem.split(' (at')[0].replace(/^1\s*[xX]\s*/, '').trim();

      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: (inv.amount_paid / 100).toFixed(2),
        subtotal: (inv.subtotal / 100).toFixed(2), // 🚀 RESTORED
        status: inv.status,
        customerEmail: inv.customer_email || inv.customer?.email || 'Unknown Client',
        customerName: inv.customer_name || inv.customer?.name || 'No Name',
        customerId: typeof inv.customer === 'string' ? inv.customer : inv.customer?.id || '',
        subscriptionId: typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id || '',
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
        lineItem: cleanLineItem
      };
    });

    return { 
      success: true, 
      invoices: formattedInvoices,
      diagnostics: {
        environment: isTestMode ? 'TEST MODE' : 'LIVE MODE',
        rawCount: invoices.data.length
      }
    };
  } catch (error: any) {
    console.error("STRIPE GLOBAL API ERROR:", error);
    return { success: false, error: error.message };
  }
}