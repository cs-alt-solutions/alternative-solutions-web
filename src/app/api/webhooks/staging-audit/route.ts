/* src/app/api/webhooks/staging-audit/route.ts */
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as React from 'react';
import { createClient } from '@supabase/supabase-js';
import StagingAuditReceiptEmail, {
  StagingAuditReceiptEmailProps,
} from '@/components/emails/StagingAuditReceiptEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface StagingAuditRecord {
  id: string;
  created_at?: string;
  storefront_slug?: string;
  client_name?: string;
  client_email: string;
  project_name?: string;
  business_name?: string;
  notes?: string | null;
  audit_notes?: string | Record<string, unknown> | null;
  plan_tier?: string;
}

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: StagingAuditRecord;
  schema: string;
}

function parseAuditTrail(raw: StagingAuditRecord['audit_notes']) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw as Record<string, any>;
  try {
    return JSON.parse(raw) as Record<string, any>;
  } catch {
    return null;
  }
}

function formatTweakSummary(
  trailNotes: Record<number, string>,
  sectionLabels: Record<number, string>,
  fallbackNotes: string
): string {
  const entries = Object.entries(trailNotes).filter(([, text]) => text && text.trim());
  if (entries.length > 0) {
    return entries
      .map(([idx, text]) => {
        const label = sectionLabels[Number(idx)] || `Section ${Number(idx) + 1}`;
        return `[${label}]\n${text.trim()}`;
      })
      .join('\n\n');
  }
  return fallbackNotes.trim();
}

export async function POST(req: Request) {
  try {
    const payload: SupabaseWebhookPayload = await req.json();
    const { record } = payload;

    if (!record || (!record.client_email && !record.storefront_slug)) {
      return NextResponse.json(
        { error: 'Missing client_email and storefront_slug in webhook payload.' },
        { status: 400 }
      );
    }

    const trail = parseAuditTrail(record.audit_notes);
    const rawNotes = record.notes?.trim() || '';
    const trailNotes: Record<number, string> =
      trail?.client_notes && typeof trail.client_notes === 'object' ? trail.client_notes : {};
    const sectionLabels: Record<number, string> =
      trail?.section_labels && typeof trail.section_labels === 'object' ? trail.section_labels : {};

    const hasNotes = rawNotes.length > 0 || Object.keys(trailNotes).length > 0;
    const emailStatus: 'APPROVED' | 'CHANGES_REQUESTED' = hasNotes
      ? 'CHANGES_REQUESTED'
      : 'APPROVED';

    // Map cleanly to valid STOREFRONT_LIFECYCLE statuses
    const requestedStage = trail?.next_stage as string | undefined;
    const targetLifecycleStatus = hasNotes
      ? 'BUILDING_CORE'
      : requestedStage === 'ACTIVE'
        ? 'ACTIVE'
        : requestedStage === 'AWAITING_ASSETS'
          ? 'AWAITING_ASSETS'
          : 'CONTENT_ASSEMBLY';

    const statusLabel = hasNotes
      ? 'Adjustments Logged'
      : targetLifecycleStatus === 'ACTIVE'
        ? 'Approved — Live Production'
        : 'Approved — Content Assembly';

    const projectLabel = record.business_name || record.project_name || 'Your Storefront';
    const formattedTweaks = hasNotes
      ? formatTweakSummary(trailNotes, sectionLabels, rawNotes)
      : '';

    // 1. SYNC STOREFRONTS TABLE & TIMELINE LEDGER
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let storeData: { id: string; status?: string; audit_notes?: any[] } | null = null;
    if (record.storefront_slug) {
      const { data } = await supabaseAdmin
        .from('storefronts')
        .select('id, status, audit_notes')
        .eq('slug', record.storefront_slug)
        .maybeSingle();
      storeData = data;
    }
    if (!storeData && record.client_email) {
      const { data } = await supabaseAdmin
        .from('storefronts')
        .select('id, status, audit_notes')
        .eq('contact_email', record.client_email)
        .limit(1)
        .maybeSingle();
      storeData = data;
    }

    if (storeData) {
      const now = new Date().toISOString();
      const reviewLog = {
        id: crypto.randomUUID(),
        timestamp: now,
        author: 'CLIENT',
        type: emailStatus,
        fromStatus: storeData.status || 'IN_REVIEW',
        toStatus: targetLifecycleStatus,
        message: hasNotes
          ? `Client requested staging tweaks:\n${formattedTweaks}`
          : targetLifecycleStatus === 'ACTIVE'
            ? 'Client approved staging build and cleared it for Live Production.'
            : 'Client approved core architecture — moved to Content Assembly for final photos/content.',
      };

      await supabaseAdmin
        .from('storefronts')
        .update({
          status: targetLifecycleStatus,
          updated_at: now,
          audit_notes: [...(storeData.audit_notes || []), reviewLog],
        })
        .eq('id', storeData.id);

      // 2. AUTO-OPEN SUPPORT DESK TICKET ON TWEAKS (lights up Homepage Radar + Support Desk)
      if (hasNotes) {
        const { error: ticketError } = await supabaseAdmin.from('support_tickets').insert([
          {
            storefront_id: storeData.id,
            category: 'Staging Review',
            topic: `Staging Tweaks — ${projectLabel}`,
            details: formattedTweaks,
            status: 'OPEN',
          },
        ]);
        if (ticketError) {
          console.error('Failed to auto-create Support Desk ticket:', ticketError.message);
        }
      }
    }

    // 3. SEND RECEIPT + ADMIN ALERT
    const sectionNotes: Record<number, string> =
      Object.keys(trailNotes).length > 0 ? trailNotes : hasNotes ? { 0: rawNotes } : {};

    const completedSteps: number[] = Array.isArray(trail?.verified_checkpoints)
      ? trail.verified_checkpoints
      : [0, 1, 2, 3];

    const sharedEmailProps: Omit<StagingAuditReceiptEmailProps, 'recipientType'> = {
      name: record.client_name || 'Founder',
      businessName: projectLabel,
      clientEmail: record.client_email,
      status: emailStatus,
      completedSteps,
      sectionNotes,
      planTier: record.plan_tier || 'Standard',
    };

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'staging@alternativesolutions.io';
    const adminEmail = process.env.ADMIN_EMAIL || fromEmail;

    const [clientResult, adminResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [record.client_email],
        subject: `Staging Review Receipt: ${projectLabel} (${statusLabel})`,
        react: React.createElement(StagingAuditReceiptEmail, {
          ...sharedEmailProps,
          recipientType: 'client',
        }),
      }),
      resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `[ADMIN ALERT] Staging Review: ${projectLabel} (${statusLabel})`,
        react: React.createElement(StagingAuditReceiptEmail, {
          ...sharedEmailProps,
          recipientType: 'admin',
        }),
      }),
    ]);

    if (clientResult.error || adminResult.error) {
      return NextResponse.json({ error: 'Email delivery failed.' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, statusEvaluated: targetLifecycleStatus },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}