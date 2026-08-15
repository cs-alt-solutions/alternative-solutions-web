// src/app/api/webhooks/staging-audit/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as React from "react"; 
import { createClient } from "@supabase/supabase-js";
import StagingAuditReceiptEmail, { 
  StagingAuditReceiptEmailProps 
} from "@/components/emails/StagingAuditReceiptEmail";

// Initialize Resend with our environment variable (Single Source of Truth)
const resend = new Resend(process.env.RESEND_API_KEY);

interface StagingAuditRecord {
  id: string;
  created_at?: string;
  client_name?: string;
  client_email: string;
  project_name?: string;
  business_name?: string; 
  notes?: string | null;
  plan_tier?: string;
}

interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: StagingAuditRecord;
  schema: string;
}

export async function POST(req: Request) {
  try {
    const payload: SupabaseWebhookPayload = await req.json();
    const { record } = payload;

    if (!record || !record.client_email) {
      return NextResponse.json(
        { error: "Missing client_email in webhook payload." },
        { status: 400 }
      );
    }

    const rawNotes = record.notes?.trim() || "";
    const hasNotes = rawNotes.length > 0;
    
    const status: "APPROVED" | "CHANGES_REQUESTED" = hasNotes 
      ? "CHANGES_REQUESTED" 
      : "APPROVED";
    
    const statusLabel = hasNotes ? "Adjustments Logged" : "Approved & Locked";
    const projectLabel = record.business_name || record.project_name || "Your Storefront";

    // ==========================================================
    // THE FIX: LOG THE NOTES TO THE STOREFRONT LEDGER
    // ==========================================================
    
    // We need the admin client to bypass row-level security for webhooks
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Find the storefront attached to this email
    const { data: storeData } = await supabaseAdmin
      .from('storefronts')
      .select('id, audit_notes')
      .eq('contact_email', record.client_email)
      .single();

    if (storeData) {
      // 2. Create the Ledger Entry
      const reviewLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        author: "CLIENT",
        type: status,
        message: hasNotes 
          ? `Client requests adjustments: "${rawNotes}"` 
          : "Client verified and approved the staging architecture. Zero changes requested."
      };

      const updatedLogs = [...(storeData.audit_notes || []), reviewLog];

      // 3. Save the log and update the storefront status
      await supabaseAdmin
        .from('storefronts')
        .update({ 
          status: status, 
          audit_notes: updatedLogs 
        })
        .eq('id', storeData.id);
    } else {
      console.warn(`Could not attach log: Storefront not found for email ${record.client_email}`);
    }
    // ==========================================================

    const sectionNotes: Record<number, string> = hasNotes ? { 0: rawNotes } : {};

    const sharedEmailProps: Omit<StagingAuditReceiptEmailProps, "recipientType"> = {
      name: record.client_name || "Founder",
      businessName: projectLabel,
      clientEmail: record.client_email,
      status: status,
      completedSteps: [0, 1, 2, 3],
      sectionNotes: sectionNotes,
      planTier: record.plan_tier || "Standard Starter",
    };

    const fromEmail = process.env.RESEND_FROM_EMAIL || "staging@alternativesolutions.io";
    const adminEmail = process.env.ADMIN_EMAIL || fromEmail;

    const [clientResult, adminResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [record.client_email],
        subject: `Staging Review Receipt: ${projectLabel} (${statusLabel})`,
        react: React.createElement(StagingAuditReceiptEmail, {
          ...sharedEmailProps,
          recipientType: "client",
        }),
      }),

      resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `[ADMIN ALERT] Staging Review: ${projectLabel} (${statusLabel})`,
        react: React.createElement(StagingAuditReceiptEmail, {
          ...sharedEmailProps,
          recipientType: "admin",
        }),
      }),
    ]);

    if (clientResult.error || adminResult.error) {
      console.error("Resend delivery failure:", {
        clientError: clientResult.error,
        adminError: adminResult.error,
      });
      
      const errorMessage = clientResult.error?.message || 
                           adminResult.error?.message || 
                           "Email delivery failed.";
                           
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json(
      { 
        success: true, 
        clientEmailId: clientResult.data?.id,
        adminEmailId: adminResult.data?.id,
        statusEvaluated: status 
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal server error processing staging audit webhook." },
      { status: 500 }
    );
  }
}