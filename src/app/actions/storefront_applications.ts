'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';

// Initialize Resend
// IMPORTANT: Ensure you have RESEND_API_KEY in your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitStorefrontApplication(formData: FormData) {
  const supabase = await createClient();

  try {
    // 1. Map the data strictly to your SQL schema's top-level columns
    const payload = {
      applicant_name: formData.get('name')?.toString() || '',
      applicant_email: formData.get('email')?.toString() || '',
      applicant_phone: formData.get('phone')?.toString() || '',
      business_name: formData.get('projectName')?.toString() || 'Unnamed Project',
      business_description: formData.get('description')?.toString() || '',
      social_handles: JSON.parse(formData.get('socials')?.toString() || '{}'),
      selected_vibe: formData.get('selectedVibe')?.toString() || 'clueless',
      selected_plan: formData.get('selectedPlan')?.toString() || 'foundation',
      wants_custom: formData.get('wantsCustom') === 'true',
      existing_domain: formData.get('existingDomain')?.toString() || '',
      is_priority: formData.get('priorityQueue') === 'true',
      status: 'PENDING',
      contact_email: formData.get('email')?.toString() || ''
    };

    // 2. SAVE TO DATABASE (Your confirmed working step)
    const { error } = await supabase.from('storefront_applications').insert([payload]);
    if (error) throw error;

    // 3. THE IGNITION: DISPATCH THE EMAIL
    try {
      const { data, error: emailError } = await resend.emails.send({
        from: 'Courtney <hello@alternativesolutions.io>', // Update this to your verified sending domain
        to: payload.applicant_email,
        subject: `Application received: ${payload.business_name}`,
        react: StorefrontConfirmationEmail({ 
          name: payload.applicant_name, 
          projectName: payload.business_name 
        })
      });

      if (emailError) {
        console.error('Resend API Error:', emailError);
      } else {
        console.log(`Success: Application confirmation dispatched to ${payload.applicant_email}`);
      }
    } catch (emailDispatchError) {
      console.error('CRITICAL EMAIL DISPATCH FAILED:', emailDispatchError);
      // We intentionally do not throw here. The user's application was saved to the database.
      // We don't want to show them an error screen just because an email bounced.
    }

    // 4. REVALIDATE AND RETURN
    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error: any) {
    console.error('CRITICAL SUBMISSION ERROR:', error);
    return { success: false, error: error.message || 'Transmission failed: Database or Auth Error' };
  }
}

export async function updateApplicationStatus(id: string, newStatus: 'BUILDING' | 'CANCELED') {
  const supabase = await createClient();
  
  try {
    // 1. Update the application status
    const { data: app, error: updateError } = await supabase
      .from('storefront_applications')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. If approved (BUILDING), automatically initialize the storefront
    if (newStatus === 'BUILDING' && app) {
      let baseSlug = (app.business_name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let finalSlug = baseSlug;

      // Ensure slug uniqueness
      const { data: existing } = await supabase.from('storefronts').select('slug').eq('slug', finalSlug);
      if (existing && existing.length > 0) {
        finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Insert into the active storefronts table
      const { error: insertError } = await supabase.from('storefronts').insert([{
        business_name: app.business_name,
        contact_email: app.contact_email || app.applicant_email, 
        status: 'BUILDING',
        slug: finalSlug, 
        plan_tier: app.selected_plan || 'foundation' 
      }]);
      
      if (insertError) {
        console.error('Failed to initialize storefront:', insertError);
        // We log the error but don't fail the whole action so the status still updates
      }
    }

    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error: any) {
    console.error('STATUS UPDATE ERROR:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}