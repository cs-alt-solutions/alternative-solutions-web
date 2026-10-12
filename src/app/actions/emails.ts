/* src/app/actions/emails.ts */
'use server';

import { Resend } from 'resend';
import React from 'react';

import StagingReviewEmail from '@/components/emails/StagingReviewEmail';
import StagingAuditReceiptEmail from '@/components/emails/StagingAuditReceiptEmail';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';
import SubscriptionActivationEmail from '@/components/emails/SubscriptionActivationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_IDENTITY = 'Courtney | Alternative Solutions <hello@alternativesolutions.io>'; 

type EmailType = 
  | 'STAGING_REVIEW' 
  | 'STAGING_AUDIT_RECEIPT' 
  | 'STOREFRONT_CONFIRMATION' 
  | 'ADMIN_INTAKE'
  | 'PORTAL_INVITE';

interface DispatchPayload {
  to: string | string[];
  subject: string;
  type: EmailType;
  data: any; 
}

export async function dispatchSystemEmail({ to, subject, type, data }: DispatchPayload) {
  try {
    let emailComponent: React.ReactElement;

    // 🚀 THE INTERCEPTOR: Overrides the 'to' address if running locally
    const isLocal = process.env.NODE_ENV === 'development';
    const testEmail = process.env.LOCAL_TEST_EMAIL;
    const finalRecipient = (isLocal && testEmail) ? testEmail : to;

    switch (type) {
      case 'STAGING_REVIEW':
        emailComponent = React.createElement(StagingReviewEmail, data);
        break;
      case 'STAGING_AUDIT_RECEIPT':
        emailComponent = React.createElement(StagingAuditReceiptEmail, data);
        break;
      case 'STOREFRONT_CONFIRMATION':
        emailComponent = React.createElement(StorefrontConfirmationEmail, data);
        break;
      case 'ADMIN_INTAKE':
        emailComponent = React.createElement(AdminIntakeEmail, data);
        break;
      case 'PORTAL_INVITE':
        emailComponent = React.createElement(PortalInviteEmail, data);
        break;
      default:
        throw new Error('Invalid email template type requested.');
    }

    const { data: resendData, error } = await resend.emails.send({
      from: SENDER_IDENTITY,
      to: finalRecipient, // Uses the intercepted address
      subject: isLocal ? `[TEST] ${subject}` : subject, // Tags the subject line so you know it's a test
      react: emailComponent,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: resendData?.id };

  } catch (err: any) {
    console.error('Critical Email Dispatch Failure:', err);
    return { success: false, error: err.message };
  }
}

export async function sendCheckoutEmail(email: string, clientName: string, projectName: string, checkoutUrl: string) {
  try {
    const isLocal = process.env.NODE_ENV === 'development';
    const testEmail = process.env.LOCAL_TEST_EMAIL;
    const finalRecipient = (isLocal && testEmail) ? testEmail : email;

    const { data, error } = await resend.emails.send({
      from: SENDER_IDENTITY,
      to: finalRecipient,
      subject: isLocal ? '[TEST] Action Required: Activate Your Storefront' : 'Action Required: Activate Your Storefront',
      react: React.createElement(SubscriptionActivationEmail, {
        clientName,
        projectName,
        checkoutUrl,
        planName: "Foundation Plan",
        price: "$5.00/mo"
      })
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Failed to dispatch checkout email:", error);
    return { success: false, error: error.message };
  }
}