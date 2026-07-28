// src/app/api/webhooks/staging-audit/route.ts (MAIN REPOSITORY ONLY!)
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import StagingAuditReceiptEmail from '@/components/emails/StagingAuditReceiptEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // 1. Catch the incoming webhook payload from Supabase
    const payload = await req.json();
    const record = payload.record || payload; 

    if (!record || !record.business_name) {
      return NextResponse.json({ error: 'Invalid webhook payload received.' }, { status: 400 });
    }

    const isApproved = record.status === 'APPROVED_PENDING_BILLING';
    const auditTrail = typeof record.audit_notes === 'string' 
      ? JSON.parse(record.audit_notes) 
      : record.audit_notes;

    const clientEmail = record.client_email || process.env.FALLBACK_LEADS_EMAIL || 'support@alternativesolutions.io';
    const adminEmail = process.env.FALLBACK_LEADS_EMAIL || 'support@alternativesolutions.io';

    // ⚡ Lint Fix: using [, note] instead of [_, note] to satisfy ESLint unused-vars
    const formattedNotes = Object.entries(auditTrail.client_notes || {})
      .filter(([, note]) => Boolean(note && String(note).trim()))
      .map(([step, note]) => `• Section ${Number(step) + 1}: "${note}"`)
      .join('\n') || (isApproved ? 'No specific adjustments requested. Build approved as-is!' : 'No written notes provided.');

    // 2. Fire Email #1 -> To the Client using our Centralized React Email Template!
    const { data: clientData, error: clientError } = await resend.emails.send({
      from: `Alternative Solutions Launchpad <staging@alternativesolutions.io>`,
      to: [clientEmail],
      subject: isApproved 
         ? `🚀 Awesome, this is it! Next steps to launch ${record.business_name}` 
         : `🛠️ Got it, I hear you! Let's make those corrections for ${record.business_name}`,
      react: StagingAuditReceiptEmail({
        name: auditTrail.contact_name || 'Founder',
        businessName: record.business_name,
        status: isApproved ? 'APPROVED' : 'CHANGES_REQUESTED',
        completedSteps: auditTrail.verified_checkpoints || [],
        sectionNotes: auditTrail.client_notes || {},
        planTier: auditTrail.plan_tier || 'Standard Starter'
      })
    });

    if (clientError) {
      console.error('❌ Webhook: Resend rejected client email:', clientError);
      return NextResponse.json({ error: clientError.message }, { status: 500 });
    }

    // 3. Fire Email #2 -> Internal Admin Alert to Courtney
    await resend.emails.send({
      from: `Staging Alert <staging@alternativesolutions.io>`,
      to: [adminEmail],
      subject: isApproved 
         ? `🚀 APPROVED: ${record.business_name} (${record.storefront_slug})` 
         : `⚠️ CORRECTIONS REQUESTED: ${record.business_name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111827;">
          <h2>${isApproved ? '✨ Client Walkthrough Approved!' : '🛠️ Client Requested Build Corrections'}</h2>
          <p><strong>Client Name:</strong> ${record.business_name}</p>
          <p><strong>Storefront Slug:</strong> ${record.storefront_slug}</p>
          <p><strong>Status:</strong> ${record.status}</p>
          <p><strong>Client Email:</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
          <hr />
          <h3>Logged Notes / Adjustments:</h3>
          <pre style="background: #f3f4f6; padding: 16px; border-radius: 6px; font-family: monospace;">${formattedNotes}</pre>
        </div>
      `
    });

    console.log('✅ Webhook successfully processed and emails dispatched!', clientData);
    return NextResponse.json({ success: true, id: clientData?.id }, { status: 200 });

  // ⚡ Lint Fix: replaced 'any' with 'unknown' to satisfy @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('❌ Staging Audit Webhook Fatal Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}