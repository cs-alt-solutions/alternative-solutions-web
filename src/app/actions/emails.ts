// src/app/actions/emails.ts
'use server';

import { Resend } from 'resend';
import React from 'react';

// Import our Templates
import StagingReviewEmail from '@/components/emails/StagingReviewEmail';
import StagingAuditReceiptEmail from '@/components/emails/StagingAuditReceiptEmail';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';
import PortalInviteEmail from '@/components/emails/PortalInviteEmail';

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
      to,
      subject,
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