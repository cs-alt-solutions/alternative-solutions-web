'use server';

import { createClient } from '@/utils/supabase/server'; 
import { Resend } from 'resend';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';
import { logPulse } from './pulse';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hello@alternativesolutions.io';

export async function submitSectorZeroIntake(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const businessName = formData.get('businessName') as string;
  const socialFacebook = formData.get('socialFacebook') as string;
  const socialTiktok = formData.get('socialTiktok') as string;
  const website = formData.get('website') as string;
  const projectScope = formData.get('projectScope') as string;

  try {
    const supabase = await createClient();
    
    const uniqueHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const appId = `SZ-${uniqueHash}`;

    const { error: dbError } = await supabase.from('sector_zero_leads').insert([{
      app_id: appId,
      name: name,
      email: email.toLowerCase().trim(),
      business_name: businessName,
      social_facebook: socialFacebook,
      social_tiktok: socialTiktok,
      website: website,
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
        name,
        email,
        socials: [socialFacebook, socialTiktok].filter(Boolean).join(' | '),
        existingWebsite: website,
        projectScope,
      })
    });

    await resend.emails.send({
      from: `Courtney | Alternative Solutions <${fromEmail}>`,
      replyTo: 'courtney@alternativesolutions.io',
      to: [email], 
      subject: `🚀 Website Application Received [${appId}]`,
      html: `
        <div style="background-color: #050505; padding: 40px 20px; font-family: sans-serif; color: #e2e8f0; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);">
            <div style="background-color: #111827; padding: 30px; border-bottom: 2px solid #06b6d4; text-align: center;">
              <h2 style="color: #06b6d4; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">Website Application Received</h2>
              <p style="color: #94a3b8; font-size: 11px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Sector Zero Foundation</p>
            </div>
            <div style="padding: 30px;">
              <p>Hey ${name.split(' ')[0]},</p>
              <p>Thanks for submitting your application for a new website build! I am super pumped to read through your project scope and see what we can create together.</p>
              <p style="margin: 25px 0; padding: 15px; background-color: rgba(217, 70, 239, 0.1); border: 1px solid rgba(217, 70, 239, 0.3); border-radius: 8px; text-align: center;">
                <strong>Your official Application ID is: <span style="color: #d946ef; font-family: monospace; font-size: 18px; letter-spacing: 1px;">${appId}</span></strong>
              </p>
              <p>Just a quick heads-up on how I operate: I am a solo architect. There is no giant corporate team behind a curtain reading these—it's literally just me. I review every single submission personally to make sure this foundation is the exact right fit for your business.</p>
              <p>Because of that, my standard turnaround time is <strong style="color: #06b6d4;">3 business days (72 business hours)</strong>. (So, if you're sending this on a Friday, Monday counts as Day 1!). I really appreciate you bearing with me while I get through the queue and process your details.</p>
              <div style="background-color: #111827; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #d946ef;">
                <h4 style="margin-top: 0; color: #f8fafc; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">What you sent over:</h4>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong>Business:</strong> ${businessName}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong>Scope:</strong><br/> <span style="color: #94a3b8;">${projectScope}</span></p>
              </div>
              <p>If you realize you forgot a detail or need to update a link, no sweat—just reply directly to this email and include your Application ID.</p>
              <p style="margin-top: 30px;">Talk soon,</p>
              <p style="margin-top: 10px;">
                <strong style="color: #f8fafc;">Courtney M. Sulenski</strong><br/>
                <span style="color: #06b6d4; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Lead Solutions Architect | Alternative Solutions</span>
              </p>
            </div>
          </div>
        </div>
      `
    });

    await logPulse('SECTOR_ZERO', `App ${appId} logged for ${businessName || name}`);
    
    return { success: true };

  } catch (err) {
    console.error("System Error during intake:", err);
    return { success: false, error: "System failure." };
  }
}