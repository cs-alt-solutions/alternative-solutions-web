/* src/components/dashboard/storefronts/editor/grid/LifecycleStepActions.tsx */
'use client';

import React, { useState } from 'react';
import {
  Send,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Globe,
  PlayCircle,
  Clock,
  BellRing,
  Copy,
  Check,
} from 'lucide-react';
import { StorefrontStatus } from '@/config/lifecycle';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { dispatchStagingReview } from '@/app/actions/storefronts';
import { sendPortalNudge } from '@/app/actions/storefront_applications';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

interface StepActionsProps {
  stepIndex: number;
  currentStatus: StorefrontStatus;
  isPausedState: boolean;
  formData: any;
  setFormData: any;
  onStatusChange: (status: StorefrontStatus, message?: string, skipConfirm?: boolean) => void;
  onOpenPauseDrawer: () => void;
}

export default function LifecycleStepActions({
  stepIndex,
  currentStatus,
  isPausedState,
  formData,
  setFormData,
  onStatusChange,
  onOpenPauseDrawer,
}: StepActionsProps) {
  const copy = EDITOR_WORKSPACE_COPY.GRID_TAB.LIFECYCLE;
  const currentPlan = formData.plan_tier || formData.selected_plan || 'STANDARD';

  const [isSendingCheckout, setIsSendingCheckout] = useState(false);
  const [copiedCheckout, setCopiedCheckout] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const handleCopyCheckout = async () => {
    setIsSendingCheckout(true);
    try {
      const response = await createStorefrontCheckout(
        formData.id,
        formData.contact_email || '',
        formData.stripe_customer_id || undefined
      );
      if (response.url) {
        await navigator.clipboard.writeText(response.url);
        setCopiedCheckout(true);
        setTimeout(() => setCopiedCheckout(false), 2500);
      } else {
        alert(response.error || 'Failed to generate checkout link.');
      }
    } catch {
      alert('A critical error occurred while contacting Stripe.');
    } finally {
      setIsSendingCheckout(false);
    }
  };

  const handleTransmitReview = async (isResend = false) => {
    const msg = isResend
      ? `Resend the Staging Review email to ${formData.contact_email}?`
      : `Dispatch the official Staging Review link to ${formData.contact_email}?`;

    if (!window.confirm(msg)) return;
    setIsSendingReview(true);

    const prevFormData = formData;
    const now = new Date().toISOString();

    if (!isResend) {
      const reviewLog = {
        id: crypto.randomUUID(),
        author: 'ADMIN',
        type: 'REVIEW_DISPATCHED',
        fromStatus: currentStatus,
        toStatus: 'IN_REVIEW',
        message: 'Staging architecture link securely transmitted to client for verification.',
        timestamp: now,
      };
      setFormData({
        ...formData,
        status: 'IN_REVIEW',
        updated_at: now,
        audit_notes: [...(formData.audit_notes || []), reviewLog],
      });
    }

    try {
      await dispatchStagingReview(
        formData.id,
        formData.slug,
        formData.business_name || 'Your Storefront',
        formData.contact_email,
        formData.plan_tier || 'Standard',
        formData.primary_contact || 'Founder'
      );
      alert('Review email dispatched.');
    } catch (err: any) {
      alert(err?.message || 'Failed to send review email.');
      if (!isResend) setFormData(prevFormData);
    } finally {
      setIsSendingReview(false);
    }
  };

  const handleSendAssetReminder = async () => {
    if (!formData.contact_email) return alert('No contact email found for this client.');
    if (!window.confirm(`Send a portal & asset reminder email to ${formData.contact_email}?`)) return;

    setIsSendingReminder(true);
    try {
      const result = await sendPortalNudge(
        formData.id,
        formData.contact_email,
        formData.business_name || 'Your Storefront'
      );
      if (!result?.success) throw new Error(result?.error || 'Failed to send reminder.');

      const logEntry = {
        id: crypto.randomUUID(),
        author: 'ADMIN',
        type: 'PORTAL_REMINDER_SENT',
        message: `Asset & portal reminder dispatched to ${formData.contact_email}.`,
        timestamp: new Date().toISOString(),
      };
      setFormData({ ...formData, audit_notes: [...(formData.audit_notes || []), logEntry] });
      alert('Reminder email dispatched.');
    } catch (err: any) {
      alert(err?.message || 'Failed to send reminder.');
    } finally {
      setIsSendingReminder(false);
    }
  };

  if (stepIndex === 0) {
    const needsCheckout = currentStatus === 'ONBOARDING' || currentStatus === ('AWAITING_PAYMENT' as any);
    return (
      <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2.5">
        {!needsCheckout && <p className="text-[11px] text-zinc-400">{copy.PAYMENT_CLEARED_NOTE}</p>}
        <div className="flex flex-wrap gap-2">
          {needsCheckout && (
            <button
              type="button"
              onClick={handleCopyCheckout}
              disabled={isSendingCheckout}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              {copiedCheckout ? <><Check size={12} className="text-emerald-400" /> Link Copied</> : <><Copy size={12} /> {isSendingCheckout ? copy.GENERATING_BTN : 'Copy Checkout Link'}</>}
            </button>
          )}
          <button
            type="button"
            onClick={() => onStatusChange('BUILDING_CORE', 'Build manually initialized.')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            <PlayCircle size={12} /> {copy.INIT_BUILD_BTN}
          </button>
        </div>
      </div>
    );
  }

  if (stepIndex === 1) {
    return (
      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleTransmitReview(false)}
          disabled={isSendingReview}
          className="flex-1 flex items-center justify-center gap-2 bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-300 border border-fuchsia-500/40 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
        >
          {isSendingReview ? copy.TRANSMITTING_BTN : copy.TRANSMIT_REVIEW_BTN}
          {!isSendingReview && <Send size={12} />}
        </button>
        <button
          type="button"
          onClick={() => onStatusChange('CONTENT_ASSEMBLY', 'Core architecture complete. Moving directly to Content Assembly.')}
          className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
        >
          Skip to Assembly
        </button>
      </div>
    );
  }

  if (stepIndex === 2) {
    return (
      <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2.5">
        <p className="text-[11px] text-zinc-400">{copy.AWAITING_VERIFICATION_NOTE}</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleTransmitReview(true)}
            disabled={isSendingReview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={11} className={isSendingReview ? 'animate-spin' : ''} /> {copy.RESEND_LINK_BTN}
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('CONTENT_ASSEMBLY', 'Client verified architecture. Proceeding to Content Assembly.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[10px] font-bold text-indigo-300 uppercase tracking-wider cursor-pointer"
          >
            <AlertTriangle size={11} /> {copy.FORCE_ASSEMBLE_BTN}
          </button>
        </div>
      </div>
    );
  }

  if (stepIndex === 3) {
    return (
      <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2.5">
        <p className={`text-[11px] ${isPausedState ? 'text-amber-300' : 'text-zinc-400'}`}>
          {isPausedState ? copy.PAUSED_ASSETS_NOTE : copy.INJECTING_NOTE}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {isPausedState ? (
            <>
              <button
                type="button"
                onClick={handleSendAssetReminder}
                disabled={isSendingReminder}
                className="flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                {isSendingReminder ? copy.SENDING_BTN : copy.SEND_NUDGE_BTN} {!isSendingReminder && <BellRing size={12} />}
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('CONTENT_ASSEMBLY', 'Assets received. Resuming assembly.', true)}
                className="flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                {copy.RESUME_BTN} <PlayCircle size={12} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenPauseDrawer}
                className="flex items-center justify-center gap-1.5 bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                <Clock size={12} /> {copy.WAIT_ASSETS_BTN}
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('ACTIVE', 'Assembly complete. Site deployed to production.')}
                className="flex items-center justify-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                <Globe size={12} /> {copy.PUBLISH_BTN}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
      <p className="text-[11px] text-emerald-400 font-medium">{copy.LIVE_NOTE}</p>
      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-zinc-400 uppercase shrink-0">
        <CreditCard size={10} /> {currentPlan} {copy.TIER_SUFFIX}
      </span>
    </div>
  );
}