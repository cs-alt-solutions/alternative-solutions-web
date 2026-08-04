import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as React from "react"; // 🚨 CRITICAL: Required for compiling React Email templates in a .ts API route
import StagingAuditReceiptEmail, { 
  StagingAuditReceiptEmailProps 
} from "@/components/emails/StagingAuditReceiptEmail";

// Initialize Resend with our environment variable (Single Source of Truth)
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the expected shape of the Supabase record
interface StagingAuditRecord {
  id: string;
  created_at?: string;
  client_name?: string;
  client_email: string;
  project_name?: string;
  notes?: string | null;
  plan_tier?: string;
}

// Define the incoming Supabase Webhook payload structure
interface SupabaseWebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: StagingAuditRecord;
  schema: string;
}

export async function POST(req: Request) {
  try {
    // 1. Parse the incoming JSON payload from Supabase
    const payload: SupabaseWebhookPayload = await req.json();
    const { record } = payload;

    // Safety check: ensure we actually have an email to send to
    if (!record || !record.client_email) {
      return NextResponse.json(
        { error: "Missing client_email in webhook payload." },
        { status: 400 }
      );
    }

    // 2. Smart Approval Logic: Evaluate if the user left notes
    const rawNotes = record.notes?.trim() || "";
    const hasNotes = rawNotes.length > 0;
    
    // Lock in strict type matching for our email component interface
    const status: "APPROVED" | "CHANGES_REQUESTED" = hasNotes 
      ? "CHANGES_REQUESTED" 
      : "APPROVED";
    
    const statusLabel = hasNotes ? "Adjustments Logged" : "Approved & Locked";
    const projectLabel = record.project_name || "Your Empire";

    // Map DB string into our required Record<number, string> format
    const sectionNotes: Record<number, string> = hasNotes ? { 0: rawNotes } : {};

    // 3. Prepare Shared Email Props (Single Source of Truth for both dispatches)
    const sharedEmailProps: Omit<StagingAuditReceiptEmailProps, "recipientType"> = {
      name: record.client_name || "Founder",
      businessName: projectLabel,
      clientEmail: record.client_email,
      status: status,
      completedSteps: [0, 1, 2, 3],
      sectionNotes: sectionNotes,
      planTier: record.plan_tier || "Standard Starter",
    };

    // Define sender and admin target addresses from environment variables
    const fromEmail = process.env.RESEND_FROM_EMAIL || "staging@alternativesolutions.io";
    const adminEmail = process.env.ADMIN_EMAIL || fromEmail;

    // 4. Dual-Dispatch: Fire both emails simultaneously via Promise.all
    const [clientResult, adminResult] = await Promise.all([
      // Dispatch 1: Client Facing Receipt
      resend.emails.send({
        from: fromEmail,
        to: [record.client_email],
        subject: `Staging Review Receipt: ${projectLabel} (${statusLabel})`,
        // 🚨 ARCHITECTURE FIX: Securely create the React element to prevent compiler crashes
        react: React.createElement(StagingAuditReceiptEmail, {
          ...sharedEmailProps,
          recipientType: "client",
        }),
      }),

      // Dispatch 2: Internal Admin Alert
      resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `[ADMIN ALERT] Staging Review: ${projectLabel} (${statusLabel})`,
        // 🚨 ARCHITECTURE FIX: Securely create the React element to prevent compiler crashes
        react: React.createElement(StagingAuditReceiptEmail, {
          ...sharedEmailProps,
          recipientType: "admin",
        }),
      }),
    ]);

    // Check if either dispatch encountered an API failure
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

    // 5. Return success so Supabase marks the webhook delivery as complete
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