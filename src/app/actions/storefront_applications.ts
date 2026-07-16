'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitStorefrontApplication(formData: FormData) {
  const supabase = await createClient();

  try {
    const payload = {
      business_name: formData.get('projectName')?.toString() || 'Unnamed Project',
      
      // THE FIX: We are now sending the email to BOTH columns just to be safe 
      // and satisfy the database's strict "NOT NULL" rule.
      applicant_email: formData.get('email')?.toString() || '', 
      contact_email: formData.get('email')?.toString() || '',   
      
      status: 'PENDING',
      application_data: {
        applicant_name: formData.get('name')?.toString() || '',
        applicant_phone: formData.get('phone')?.toString() || '',
        business_description: formData.get('description')?.toString() || '',
        selected_plan: formData.get('selectedPlan')?.toString() || 'foundation',
        selected_vibe: formData.get('selectedVibe')?.toString() || 'clueless',
        wants_custom_domain: formData.get('wantsCustom') === 'true',
        existing_domain: formData.get('existingDomain')?.toString() || '',
        is_priority: formData.get('priorityQueue') === 'true',
        socials: JSON.parse(formData.get('socials')?.toString() || '{}')
      }
    };

    const { error } = await supabase.from('storefront_applications').insert([payload]);
    if (error) throw error;

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
        contact_email: app.contact_email,
        status: 'BUILDING',
        slug: finalSlug, 
        plan_tier: app.application_data?.selected_plan || 'foundation'
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