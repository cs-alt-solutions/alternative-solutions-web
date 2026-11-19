/* src/components/dashboard/storefronts/editor/grid/ClientBillingCard.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Receipt,
  Calendar,
} from 'lucide-react';
import {
  getClientBillingOverview,
  createStorefrontCheckout,
  createCustomerPortalSession,
} from '@/app/actions/billing';

export default function ClientBillingCard({ formData }: { formData: any }) {
  const [billing, setBilling] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [copiedCheckout, setCopiedCheckout] = useState(false);

  useEffect(() => {
    if (formData?.is_template) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const loadBilling = async () => {
      setIsLoading(true);
      const res = await getClientBillingOverview(
        formData?.stripe_customer_id,
        formData?.stripe_subscription_id
      );
      if (isMounted) {
        setBilling(res);
        setIsLoading(false);
      }
    };

    loadBilling();
    return () => {
      isMounted = false;
    };
  }, [formData?.stripe_customer_id, formData?.stripe_subscription_id, formData?.is_template]);

  if (formData?.is_template) return null;

  const handleCopyCheckout = async () => {
    setIsActionLoading(true);
    try {
      const res = await createStorefrontCheckout(
        formData.id,
        formData.contact_email || '',
        formData.stripe_customer_id || undefined
      );
      if (res.url) {
        await navigator.clipboard.writeText(res.url);
        setCopiedCheckout(true);
        setTimeout(() => setCopiedCheckout(false), 2000);
      } else {
        alert(res.error || 'Could not generate checkout link.');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenStripePortal = async () => {
    if (!formData?.stripe_customer_id) return;
    setIsActionLoading(true);
    try {
      const res = await createCustomerPortalSession(formData.stripe_customer_id, formData.id);
      if (res.url) {
        window.open(res.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(res.error || 'Could not open Stripe portal.');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const sub = billing?.subscription;
  const lastInvoice = billing?.lastInvoice;
  const upcoming = billing?.upcomingInvoice;
  const hasIssue = Boolean(billing?.hasPaymentIssue);

  return (
    <div
      className={`bg-zinc-900/70 rounded-xl overflow-hidden shadow-xl border ${
        hasIssue ? 'border-rose-500/50' : 'border-zinc-700/60'
      }`}
    >
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-md border ${
              hasIssue
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            <CreditCard size={14} />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
            Billing & Subscription
          </h3>
        </div>

        <Link
          href="/dashboard/ledger"
          className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          Ledger <ExternalLink size={11} />
        </Link>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 size={18} className="text-cyan-400 animate-spin" />
          </div>
        ) : (
          <>
            {hasIssue && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertTriangle size={15} className="text-rose-400 shrink-0" />
                <span>Payment attention needed — subscription is past due or has an unpaid invoice.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Plan & Status
                </span>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-sm font-black text-white">
                    {sub ? `$${sub.planAmount}/${sub.interval}` : formData.plan_tier || 'Unbilled'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                      sub?.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : hasIssue
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {sub ? sub.status.replace(/_/g, ' ') : 'No Sub'}
                  </span>
                </div>
              </div>

              <div className="bg-black/40 border border-zinc-800 rounded-lg p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Next Renewal
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 text-sm font-bold text-zinc-200">
                  <Calendar size={13} className="text-cyan-400 shrink-0" />
                  <span>
                    {upcoming
                      ? `$${upcoming.amount} • ${upcoming.date}`
                      : sub?.cancelAtPeriodEnd
                        ? `Ends ${sub.currentPeriodEnd}`
                        : 'Not Scheduled'}
                  </span>
                </div>
              </div>
            </div>

            {lastInvoice && (
              <div className="flex items-center justify-between bg-black/40 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Receipt size={13} className="text-zinc-500" />
                  <span>
                    Last Invoice:{' '}
                    <strong className="text-white">
                      ${lastInvoice.status === 'paid' ? lastInvoice.amountPaid : lastInvoice.amountDue}
                    </strong>{' '}
                    ({lastInvoice.date})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      lastInvoice.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {lastInvoice.status}
                  </span>
                  {lastInvoice.hostedUrl && (
                    <a
                      href={lastInvoice.hostedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white"
                      title="View Stripe Invoice"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {!sub && (
                <button
                  type="button"
                  onClick={handleCopyCheckout}
                  disabled={isActionLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {copiedCheckout ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copiedCheckout ? 'Checkout Link Copied' : 'Copy Checkout Link'}
                </button>
              )}

              {formData?.stripe_customer_id && (
                <button
                  type="button"
                  onClick={handleOpenStripePortal}
                  disabled={isActionLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Stripe Billing Portal
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}