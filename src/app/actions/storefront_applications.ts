'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitStorefrontApplication(formData: FormData) {
  const supabase = await createClient();

  try {
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

    const { error } = await supabase.from('storefront_applications').insert([payload]);
    if (error) throw error;

    try {
      const { error: emailError } = await resend.emails.send({
        from: 'Courtney <hello@alternativesolutions.io>', 
        to: payload.applicant_email,
        subject: `Application received: ${payload.business_name}`,
        react: StorefrontConfirmationEmail({ 
          name: payload.applicant_name, 
          projectName: payload.business_name 
        })
      });

      if (emailError) console.error('Resend API Error:', emailError);
    } catch (emailDispatchError) {
      console.error('CRITICAL EMAIL DISPATCH FAILED:', emailDispatchError);
    }

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
    const { data: app, error: updateError } = await supabase
      .from('storefront_applications')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (newStatus === 'BUILDING' && app) {
      let baseSlug = (app.business_name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let finalSlug = baseSlug;

      const { data: existing } = await supabase.from('storefronts').select('slug').eq('slug', finalSlug);
      if (existing && existing.length > 0) {
        finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // 🚨 THE FIX: Providing ALL layout defaults so Supabase never saves a null column
      const { error: insertError } = await supabase.from('storefronts').insert([{
        business_name: app.business_name,
        contact_email: app.contact_email || app.applicant_email, 
        status: 'BUILDING',
        slug: finalSlug, 
        plan_tier: app.selected_plan || 'foundation',
        theme_style: app.selected_vibe || 'industrial',
        tagline: app.business_description ? app.business_description.substring(0, 50) + '...' : 'Welcome to our new digital storefront.',
        subtext: app.business_description || 'We are getting our operations online. Stay tuned.',
        hero_layout: 'center',
        content_layout: 'classic',
        about_layout: 'split', // <--- FIXED: Initializing to split instead of null!
        is_template: false,
        hero_image: 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE',
        about_image: 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE',
        primary_cta: 'Get Started',
        secondary_cta: 'Learn More',
        about_heading: 'About Us',
        about_bio: 'We are a local business dedicated to providing top-tier services and products to our community. Check out our gallery to see our recent work!',
        social_url: 'https://facebook.com',
        gallery_items: []
      }]);
      
      if (insertError) console.error('Failed to initialize storefront:', insertError);
    }

    revalidatePath('/dashboard/storefronts');
    revalidatePath('/dashboard'); 
    return { success: true };
  } catch (error: any) {
    console.error('STATUS UPDATE ERROR:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}