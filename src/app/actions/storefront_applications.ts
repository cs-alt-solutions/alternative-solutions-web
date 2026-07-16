'use server';

import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitStorefrontApplication(formData: FormData) {
  const supabase = await createClient();

  const businessName = formData.get('projectName')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const applicantName = formData.get('name')?.toString() || '';

  const payload = {
    business_name: businessName,
    contact_email: email,
    status: 'PENDING',
    application_data: {
      applicant_name: applicantName,
      applicant_phone: formData.get('phone')?.toString() || '',
      business_description: formData.get('description')?.toString() || '',
      selected_plan: formData.get('selectedPlan')?.toString() || 'foundation',
      is_priority: formData.get('priorityQueue') === 'true',
    }
  };

  try {
    const { error } = await supabase
      .from('storefront_applications') 
      .insert([payload]);

    if (error) throw error;

    await resend.emails.send({
      from: 'Alternative Solutions <hello@alternativesolutions.io>',
      to: [email],
      subject: 'Application Received // Alternative Solutions',
      react: StorefrontConfirmationEmail({ name: applicantName, projectName: businessName }),
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: 'Transmission failed' };
  }
}

export async function updateApplicationStatus(id: string, status: 'BUILDING' | 'CANCELED') {
  const supabase = await createClient();
  
  try {
    // 1. Fetch the application details
    const { data: app, error: fetchError } = await supabase
      .from('storefront_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 2. If approved, promote to 'storefronts' table
    if (status === 'BUILDING') {
      const { error: insertError } = await supabase
        .from('storefronts')
        .insert([{
          business_name: app.business_name,
          contact_email: app.contact_email,
          status: 'BUILDING',
          slug: app.business_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 
          plan_tier: app.application_data?.selected_plan || 'Starter ($5/mo)'
        }]);

      if (insertError) {
        console.error("Promotion Insert Error:", insertError);
        throw insertError;
      }
    }

    // 3. Update the intake application status to 'DONE' (or 'PROMOTED')
    const { error: updateError } = await supabase
      .from('storefront_applications')
      .update({ status: 'DONE' })
      .eq('id', id);

    if (updateError) throw updateError;

    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error) {
    console.error('Promotion error:', error);
    return { success: false, error: 'Failed to promote application' };
  }
}