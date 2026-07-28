import { NextResponse } from "next/server";
import { Resend } from "resend";
import StagingAuditReceiptEmail, { 
  StagingAuditReceiptEmailProps 
} from "@/components/emails/StagingAuditReceiptEmail";

// Initialize Resend with our environment variable (Single Source of Truth)
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the exact shape of your Supabase table ground truth
interface StagingAuditRecord {
  id: string;
  created_at?: string;
  storefront_slug: string;
  business_name: string;
  client_email: string;
  audit_notes?: string | Record<string, any> | null;
  status: string;
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

    // 2. Unpack the JSON payload stored inside the audit_notes column
    let auditData: Record<string, any> = {};
    if (typeof record.audit_notes === "string") {
      try {
        auditData = JSON.parse(record.audit_notes);
      } catch (e) {
        console.error("Failed to parse audit_notes JSON string:", e);
      }
    } else if (typeof record.audit_notes === "object" && record.audit_notes !== null) {
      auditData = record.audit_notes;
    }

    // 3. Extract your exact variables from the parsed JSON and database columns
    const businessName = record.business_name || "Your Empire";
    const clientName = auditData.contact_name || "Founder";
    const planTier = auditData.plan_tier || "Standard Starter";
    const completedSteps = Array.isArray(auditData.verified_checkpoints) 
      ? auditData.verified_checkpoints 
      : [0, 1, 2, 3];
    
    // Extract the section notes object: { "0": "needs fixing", "1": "", ... }
    const sectionNotes: Record<number, string> = auditData.client_notes || {};

    // 4. Smart Approval Logic: Evaluate if ANY section has logged adjustments
    const hasNotes = Object.values(sectionNotes).some(
      note => Boolean(note && String(note).trim().length > 0)
    );
    
    const status: "APPROVED" | "CHANGES_REQUESTED" = hasNotes 
      ? "CHANGES_REQUESTED" 
      : "APPROVED";
    
    const statusLabel = hasNotes ? "Adjustments Logged" : "Approved & Locked";

    // 5. Prepare Shared Email Props (Single Source of Truth)
    const sharedEmailProps: Omit<StagingAuditReceiptEmailProps, "recipientType"> = {
      name: clientName,
      businessName: businessName,
      clientEmail: record.client_email,
      status: status,
      completedSteps: completedSteps,
      sectionNotes: sectionNotes,
      planTier: planTier,
    };

    // Define sender and admin target addresses from environment variables
    const fromEmail = process.env.RESEND_FROM_EMAIL || "staging@alternativesolutions.io";
    const adminEmail = process.env.ADMIN_EMAIL || "courtneysulenski@gmail.com";

    // 6. Dual-Dispatch: Fire both emails simultaneously via Promise.all
    const [clientResult, adminResult] = await Promise.all([
      // Dispatch 1: Client Facing Receipt
      resend.emails.send({
        from: fromEmail,
        to: [record.client_email],
        subject: `Staging Review Receipt: ${businessName} (${statusLabel})`,
        react: StagingAuditReceiptEmail({
          ...sharedEmailProps,
          recipientType: "client",
        }),
      }),

      // Dispatch 2: Internal Admin Alert (With strict uppercase [ADMIN ALERT])
      resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `[ADMIN ALERT] Staging Review: ${businessName} (${statusLabel})`,
        react: StagingAuditReceiptEmail({
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

    // 7. Return success so Supabase marks the webhook delivery as complete
    return NextResponse.json(
      { 
        success: true, 
        clientEmailId: clientResult.data?.id,
        adminEmailId: adminResult.data?.id,
        statusEvaluated: status,
        businessNameEvaluated: businessName
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