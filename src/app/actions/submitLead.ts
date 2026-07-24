// src/actions/submitLead.ts
'use server';

import { supabase } from '@/utils/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface LeadPayload {
  storefrontSlug: string;
  businessName: string;
  contactEmail: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
}

export async function submitStorefrontLead(payload: LeadPayload) {
  try {
    // 1. DUAL-WRITE STEP A: Store in Supabase
    const { error: dbError } = await supabase
      .from('storefront_leads')
      .insert([
        {
          storefront_slug: payload.storefrontSlug,
          client_name: payload.name,
          client_email: payload.email,
          client_phone: payload.phone || 'Not provided',
          project_details: payload.details,
          status: 'new',
        },
      ]);

    if (dbError) {
      console.error('Database Insertion Failed:', dbError);
      throw new Error('Failed to record inquiry in system ledger.');
    }

    // 2. DUAL-WRITE STEP B: Dispatch Notification via Centralized Domain
    const recipientEmail = payload.contactEmail || process.env.FALLBACK_LEADS_EMAIL || 'support@alternativesolutions.io';

    const { error: mailError } = await resend.emails.send({
      from: `${payload.businessName} Leads <leads@notify.alternativesolutions.io>`,
      to: [recipientEmail],
      replyTo: payload.email,
      subject: `New Inquiry: ${payload.name} via Storefront`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-bottom: 16px;">New Direct Inquiry</h2>
          <p style="color: #475569; font-size: 14px;">You have received a new quote request from your customized web storefront:</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p><strong>Client Name:</strong> ${payload.name}</p>
          <p><strong>Email Address:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
          <p><strong>Phone Number:</strong> ${payload.phone || 'Not provided'}</p>
          <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 16px;">
            <p style="margin: 0; font-weight: bold; color: #334155; font-size: 12px; text-transform: uppercase;">Project Details:</p>
            <p style="margin-top: 8px; color: #0f172a; white-space: pre-wrap;">${payload.details}</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0 12px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">Powered by Alternative Solutions Infrastructure</p>
        </div>
      `,
    });

    if (mailError) {
      console.error('Resend Dispatch Failed:', mailError);
      return { success: true, warning: 'Lead logged to database, but email dispatch was delayed.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Lead Pipeline Error:', error);
    return { success: false, error: 'Transmission failed. Please try again.' };
  }
}