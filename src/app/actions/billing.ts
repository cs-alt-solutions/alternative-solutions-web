/* src/app/actions/billing.ts */
'use server';

import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-02-25.clover',
});

const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  process.env.ADMIN_EMAIL,
  'courtney@alternativesolutions.io',
]
  .filter(Boolean)
  .map((e) => String(e).toLowerCase());

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error('Unauthorized: Active session required.');
  }

  return {
    supabase,
    user,
    isAdmin: ADMIN_EMAILS.includes(user.email.toLowerCase()),
  };
}

async function verifyBillingAccess({
  storefrontId,
  customerId,
  adminOnly = false,
}: {
  storefrontId?: string;
  customerId?: string;
  adminOnly?: boolean;
}) {
  const { supabase, user, isAdmin } = await getAuthenticatedUser();
  if (isAdmin) return true;
  if (adminOnly) throw new Error('Unauthorized: Admin clearance required.');

  let query = supabase.from('storefronts').select('id, contact_email');
  if (storefrontId) {
    query = query.eq('id', storefrontId);
  } else if (customerId) {
    query = query.eq('stripe_customer_id', customerId);
  } else {
    throw new Error('Unauthorized: Missing billing target.');
  }

  const { data: store } = await query.maybeSingle();
  if (!store || store.contact_email?.toLowerCase() !== user.email!.toLowerCase()) {
    throw new Error('Unauthorized: You do not have access to this billing record.');
  }

  return true;
}

async function resolveAppOrigin() {
  const headersList = await headers();
  return (
    headersList.get('origin') ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.alternativesolutions.io'
  );
}

export async function createStorefrontCheckout(
  storefrontId: string,
  customerEmail: string,
  existingCustomerId?: string
) {
  try {
    await verifyBillingAccess({ storefrontId });

    const priceId = process.env.STRIPE_PRICE_ID_FOUNDATION;
    if (!priceId) throw new Error('Missing STRIPE_PRICE_ID_FOUNDATION environment variable.');

    const origin = await resolveAppOrigin();

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      client_reference_id: storefrontId,
      metadata: { storefront_id: storefrontId, tier: 'FOUNDATION' },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        metadata: { storefront_id: storefrontId, tier: 'FOUNDATION' },
      },
      success_url: `${origin}/portal/${storefrontId}?payment=success`,
      cancel_url: `${origin}/portal/${storefrontId}?payment=canceled`,
      allow_promotion_codes: true,
    };

    if (existingCustomerId) {
      sessionConfig.customer = existingCustomerId;
    } else {
      sessionConfig.customer_email = customerEmail || undefined;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createProTierCheckout(
  storefrontId: string,
  customerEmail: string,
  customDomain: string,
  existingCustomerId?: string
) {
  try {
    await verifyBillingAccess({ storefrontId });

    const priceId = process.env.STRIPE_PRICE_ID_PROFESSIONAL;
    if (!priceId) throw new Error('Missing STRIPE_PRICE_ID_PROFESSIONAL environment variable.');

    const origin = await resolveAppOrigin();

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      client_reference_id: storefrontId,
      metadata: {
        storefront_id: storefrontId,
        tier: 'PROFESSIONAL',
        custom_domain: customDomain || '',
      },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          storefront_id: storefrontId,
          tier: 'PROFESSIONAL',
          custom_domain: customDomain || '',
        },
      },
      success_url: `${origin}/portal/${storefrontId}?payment=success`,
      cancel_url: `${origin}/portal/${storefrontId}?payment=canceled`,
      allow_promotion_codes: true,
    };

    if (existingCustomerId) {
      sessionConfig.customer = existingCustomerId;
    } else {
      sessionConfig.customer_email = customerEmail || undefined;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return { url: session.url };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createCustomerPortalSession(customerId: string, storefrontId: string) {
  try {
    await verifyBillingAccess({ storefrontId, customerId });
    const origin = await resolveAppOrigin();

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
    if (!customerId) return { success: false, error: 'No Customer ID provided.' };
    await verifyBillingAccess({ customerId });

    const invoices = await stripe.invoices.list({ customer: customerId, limit: 12 });

    const formattedInvoices = invoices.data.map((inv) => {
      const displayCents = inv.status === 'paid' ? inv.amount_paid : inv.amount_due;
      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        createdAt: new Date(inv.created * 1000).toISOString(),
        amount: (displayCents / 100).toFixed(2),
        amountPaid: (inv.amount_paid / 100).toFixed(2),
        amountDue: (inv.amount_due / 100).toFixed(2),
        status: inv.status,
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
      };
    });

    return { success: true, invoices: formattedInvoices };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUpcomingInvoice(customerId: string, subscriptionId?: string) {
  try {
    if (!customerId) return { success: false, error: 'No Customer ID provided.' };
    await verifyBillingAccess({ customerId });

    const upcoming = await stripe.invoices.createPreview({
      customer: customerId,
      ...(subscriptionId ? { subscription: subscriptionId } : {}),
    });

    const targetDate = upcoming.next_payment_attempt || upcoming.period_end || upcoming.created;
    const formattedDate = new Date(targetDate * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      success: true,
      amount: (upcoming.amount_due / 100).toFixed(2),
      date: formattedDate,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getClientBillingOverview(
  customerId?: string | null,
  subscriptionId?: string | null
) {
  try {
    await verifyBillingAccess({ customerId: customerId || undefined, adminOnly: !customerId });

    if (!customerId && !subscriptionId) {
      return {
        success: true,
        hasBilling: false,
        subscription: null,
        lastInvoice: null,
        upcomingInvoice: null,
        hasPaymentIssue: false,
      };
    }

    let sub: Stripe.Subscription | null = null;
    if (subscriptionId) {
      try {
        sub = await stripe.subscriptions.retrieve(subscriptionId);
      } catch {
        sub = null;
      }
    }

    if (!sub && customerId) {
      const subList = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 1,
      });
      sub = subList.data[0] || null;
    }

    let lastInvoice = null;
    let upcomingInvoice = null;

    if (customerId) {
      const invoices = await stripe.invoices.list({ customer: customerId, limit: 3 });
      const latest = invoices.data[0];
      if (latest) {
        lastInvoice = {
          id: latest.id,
          date: new Date(latest.created * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          amountPaid: (latest.amount_paid / 100).toFixed(2),
          amountDue: (latest.amount_due / 100).toFixed(2),
          status: latest.status,
          hostedUrl: latest.hosted_invoice_url || null,
          pdfUrl: latest.invoice_pdf || null,
        };
      }

      if (sub && ['active', 'trialing', 'past_due'].includes(sub.status)) {
        try {
          const preview = await stripe.invoices.createPreview({
            customer: customerId,
            subscription: sub.id,
          });
          const targetTs = preview.next_payment_attempt || preview.period_end || preview.created;
          upcomingInvoice = {
            amount: (preview.amount_due / 100).toFixed(2),
            date: new Date(targetTs * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          };
        } catch {
          upcomingInvoice = null;
        }
      }
    }

    const firstItem = sub?.items?.data?.[0];
    const periodEndTs =
      (sub as any)?.current_period_end || (firstItem as any)?.current_period_end || null;

    const formattedSub = sub
      ? {
          id: sub.id,
          status: sub.status,
          planAmount: ((firstItem?.price?.unit_amount || 0) / 100).toFixed(2),
          interval: firstItem?.price?.recurring?.interval || 'month',
          currentPeriodEnd: periodEndTs
            ? new Date(periodEndTs * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : null,
          cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
          tier: sub.metadata?.tier || 'FOUNDATION',
        }
      : null;

    const hasPaymentIssue = Boolean(
      (formattedSub && ['past_due', 'unpaid', 'incomplete'].includes(formattedSub.status)) ||
        (lastInvoice && lastInvoice.status === 'open')
    );

    return {
      success: true,
      hasBilling: Boolean(formattedSub || lastInvoice),
      subscription: formattedSub,
      lastInvoice,
      upcomingInvoice,
      hasPaymentIssue,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getGlobalInvoices() {
  try {
    await verifyBillingAccess({ adminOnly: true });
    const isTestMode = process.env.STRIPE_SECRET_KEY?.includes('sk_test');

    const invoices = await stripe.invoices.list({
      limit: 100,
      expand: ['data.customer', 'data.subscription'],
    });

    const formattedInvoices = invoices.data.map((inv: any) => {
      const rawLineItem = inv.lines?.data?.[0]?.description || 'Storefront Subscription';
      const cleanLineItem = rawLineItem.split(' (at')[0].replace(/^1\s*[xX]\s*/, '').trim();
      const displayCents = inv.status === 'paid' ? inv.amount_paid : inv.amount_due;

      return {
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        createdAt: new Date(inv.created * 1000).toISOString(),
        amount: (displayCents / 100).toFixed(2),
        amountPaid: (inv.amount_paid / 100).toFixed(2),
        amountDue: (inv.amount_due / 100).toFixed(2),
        subtotal: (inv.subtotal / 100).toFixed(2),
        status: inv.status,
        customerEmail: inv.customer_email || inv.customer?.email || 'Unknown Client',
        customerName: inv.customer_name || inv.customer?.name || 'No Name',
        customerId: typeof inv.customer === 'string' ? inv.customer : inv.customer?.id || '',
        subscriptionId:
          typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id || '',
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
        lineItem: cleanLineItem,
      };
    });

    return {
      success: true,
      invoices: formattedInvoices,
      diagnostics: {
        environment: isTestMode ? 'TEST MODE' : 'LIVE MODE',
        rawCount: invoices.data.length,
      },
    };
  } catch (error: any) {
    console.error('STRIPE GLOBAL API ERROR:', error);
    return { success: false, error: error.message };
  }
}