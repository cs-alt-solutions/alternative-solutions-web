'use server';

import { createClient } from '@/utils/supabase/server'; 
import { Resend } from 'resend';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import { logPulse } from './pulse';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hello@alternativesolutions.io';

export async function submitStorefrontIntake(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const businessName = formData.get('businessName') as string;
  const socialFacebook = formData.get('socialFacebook') as string;
  const socialTiktok = formData.get('socialTiktok') as string;
  const projectScope = formData.get('projectScope') as string;

  try {
    const supabase = await createClient();
    
    const uniqueHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const appId = `SF-${uniqueHash}`;

    const { error: dbError } = await supabase.from('sector_zero_leads').insert([{
      app_id: appId,
      name: name,
      email: email.toLowerCase().trim(),
      business_name: businessName,
      social_facebook: socialFacebook,
      social_tiktok: socialTiktok,
      project_scope: projectScope,
      status: 'PENDING'
    }]);

    if (dbError) {
      if (dbError.code === '23505') {
        return { success: false, error: "An application with this email is already in the queue." };
      }
      return { success: false, error: "Database error. Please try again." };
    }

    await resend.emails.send({
      from: `Alternative Solutions <${fromEmail}>`, 
      to: ['courtney@alternativesolutions.io'], 
      subject: `🚨 INTAKE [${appId}]: ${businessName || name}`,
      react: AdminIntakeEmail({
        name: name || 'N/A',
        email: email || 'N/A',
        socials: [socialFacebook, socialTiktok].filter(Boolean).join(' | ') || 'None provided',
        businessName: businessName || name || 'Unnamed Project',
      })
    });

    await resend.emails.send({
      from: `Courtney | Alternative Solutions <${fromEmail}>`,
      replyTo: 'courtney@alternativesolutions.io',
      to: [email], 
      subject: `🚀 Website Application Received [${appId}]`,
      react: StorefrontConfirmationEmail({
        name: name || 'Founder',
        projectName: businessName || name || 'Your Empire',
      })
    });

    await logPulse('STOREFRONT', `App ${appId} logged for ${businessName || name}`);
    
    return { success: true };

  } catch (err) {
    console.error("System Error during intake:", err);
    return { success: false, error: "System failure." };
  }
}