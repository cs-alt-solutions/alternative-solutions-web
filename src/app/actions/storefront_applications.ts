/* src/app/actions/storefront_applications.ts */
'use server';

import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitStorefrontApplication(formData: FormData) {
  const supabase = await createClient();

  // 1. Extract and cast/fallback
const applicationData = {
  applicant_name: formData.get('name')?.toString() || '',
  applicant_email: formData.get('email')?.toString() || '',
  applicant_phone: formData.get('phone')?.toString() || '',
  business_name: formData.get('projectName')?.toString() || '',
  business_description: formData.get('description')?.toString() || '',
  selected_plan: formData.get('selectedPlan')?.toString() || 'foundation',
  is_priority: formData.get('priorityQueue') === 'true',
};

  try {
    // 2. Insert into the database
    const { data, error } = await supabase
      .from('storefront_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;

    // 3. Trigger the confirmation email
    await resend.emails.send({
      from: 'Courtney <hello@alternativesolutions.io>',
      to: [applicationData.applicant_email],
      subject: 'Application Received // Alternative Solutions',
      react: StorefrontConfirmationEmail({ 
        name: applicationData.applicant_name as string,
        projectName: applicationData.business_name as string 
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: 'Transmission failed' };
  }
}