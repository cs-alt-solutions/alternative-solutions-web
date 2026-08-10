// src/app/actions/storefront_applications.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

async function uploadApplicationAsset(file: File | null, pathPrefix: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  try {
    const supabase = await createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `applications/${fileName}`;
    
    const { error } = await supabase.storage.from('storefront-assets').upload(filePath, file);
    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }
    
    const { data: publicUrlData } = supabase.storage.from('storefront-assets').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Failed to process asset:", err);
    return null;
  }
}

export async function submitStorefrontApplication(formData: FormData) {
  const supabase = await createClient();

  try {
    const businessName = formData.get('projectName')?.toString() || 'Unnamed Project';
    const safeProjectPrefix = businessName.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    const logoFile = formData.get('logo_file') as File | null;
    const bgFile = formData.get('bg_file') as File | null;
    const aboutFile = formData.get('about_file') as File | null;

    const logoUrl = await uploadApplicationAsset(logoFile, `${safeProjectPrefix}-logo`);
    const bgUrl = await uploadApplicationAsset(bgFile, `${safeProjectPrefix}-hero`);
    const aboutUrl = await uploadApplicationAsset(aboutFile, `${safeProjectPrefix}-about`);

    const payload = {
      applicant_name: formData.get('name')?.toString() || '',
      applicant_email: formData.get('email')?.toString() || '',
      applicant_phone: formData.get('phone')?.toString() || '',
      business_name: businessName,
      business_description: formData.get('description')?.toString() || '',
      social_handles: JSON.parse(formData.get('socials')?.toString() || '{}'),
      selected_vibe: formData.get('selectedVibe')?.toString() || 'clueless',
      selected_plan: formData.get('selectedPlan')?.toString() || 'foundation',
      wants_custom: formData.get('wantsCustom') === 'true',
      existing_domain: formData.get('existingDomain')?.toString() || '',
      is_priority: formData.get('priorityQueue') === 'true',
      status: 'PENDING',
      contact_email: formData.get('email')?.toString() || '',
      logo_url: logoUrl,
      hero_image_url: bgUrl,
      about_image_url: aboutUrl
    };

    const { error } = await supabase.from('storefront_applications').insert([payload]);
    if (error) throw error;

    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'Courtney <hello@alternativesolutions.io>',
          to: payload.applicant_email,
          subject: `Application received: ${payload.business_name}`,
          react: StorefrontConfirmationEmail({ 
            name: payload.applicant_name, 
            projectName: payload.business_name 
          })
        });

        await resend.emails.send({
          from: 'System <system@alternativesolutions.io>',
          to: process.env.ADMIN_EMAIL || 'hello@alternativesolutions.io',
          subject: `🚨 NEW LEAD: ${payload.business_name}`,
          react: AdminIntakeEmail({
            name: payload.applicant_name,
            email: payload.applicant_email,
            phone: payload.applicant_phone,
            socials: formData.get('socials')?.toString() || '',
            existingWebsite: payload.existing_domain,
            projectScope: payload.business_description,
            businessName: payload.business_name,
            selectedPlan: payload.selected_plan,
            selectedVibe: payload.selected_vibe,
            wantsCustom: payload.wants_custom,
            isPriority: payload.is_priority
          })
        });
      }
    } catch (emailDispatchError) {
      console.error('EMAIL DISPATCH FAILED:', emailDispatchError);
    }

    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error: any) {
    console.error('CRITICAL SUBMISSION ERROR:', error);
    return { success: false, error: error.message || 'Transmission failed: Database or Auth Error' };
  }
}

export async function updateApplicationStatus(id: string, newStatus: 'BUILDING' | 'CANCELED', overrides?: any) {
  const supabase = await createClient();
  
  try {
    const { data: app, error: updateError } = await supabase
      .from('storefront_applications')
      .update({ 
        status: newStatus,
        ...(overrides?.plan && { selected_plan: overrides.plan }),
        ...(overrides?.vibe && { selected_vibe: overrides.vibe })
      })
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

      // Read overrides from your UI, or fall back to their original choices
      const finalVibe = overrides?.vibe || app.selected_vibe || 'industrial';
      const finalColor = overrides?.brandColor || app.brand_color || 'cyan';
      const finalHero = overrides?.hero || app.hero_structure || 'centered';
      const finalStory = overrides?.story || app.story_structure || 'split';
      const finalFlow = overrides?.flow || app.content_flow || 'classic';
      const finalPlan = overrides?.plan || app.selected_plan || 'foundation';

      // 1. Create the storefront (Removed the timeline_events column injection)
      const { error: insertError } = await supabase.from('storefronts').insert([{
        business_name: app.business_name,
        contact_email: app.contact_email || app.applicant_email, 
        status: 'BUILDING',
        slug: finalSlug, 
        plan_tier: finalPlan,
        theme_style: finalVibe,
        brand_color: finalColor,
        hero_layout: finalHero,
        content_layout: finalFlow,
        about_layout: finalStory,
        tagline: app.tagline && app.tagline !== 'ARCHITECT_DELEGATED' ? app.tagline : 'Welcome to your new digital storefront.',
        subtext: app.business_description || 'Getting operations online. Stay tuned.',
        is_template: false,
        hero_image: app.hero_image_url || 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE',
        about_image: app.about_image_url || 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE',
        logo_url: app.logo_url || null,
        primary_cta: 'Get Started',
        secondary_cta: 'Learn More',
        about_heading: 'About Us',
        about_bio: app.business_description || 'Dedicated to providing top-tier services and products to the community. Check out the gallery to see recent work!',
        social_url: app.existing_domain || '',
        gallery_items: []
      }]);
      
      if (insertError) throw new Error("Storefront Creation Blocked by Database: " + insertError.message);

      // 2. THE FIX: Inject the historical timeline directly into your Audit Ledger table!
      // (Using empty objects for audit_notes prevents your JSON.parse from crashing)
      const initialAudits = [
        {
          storefront_slug: finalSlug,
          status: 'Application Received',
          audit_notes: {} 
        },
        {
          storefront_slug: finalSlug,
          status: 'APPROVED', // This triggers the nice green "Client Approved" icon in your UI
          audit_notes: {}
        },
        {
          storefront_slug: finalSlug,
          status: 'Engineering Commenced',
          audit_notes: {}
        }
      ];

      const { error: auditError } = await supabase.from('storefront_audits').insert(initialAudits);
      if (auditError) console.error('Failed to initialize audit ledger:', auditError);

      // 3. Create the Client Profile
      const { error: clientError } = await supabase.from('clients').insert([{
        id: finalSlug,
        name: app.business_name,
        primary_contact: app.applicant_name,
        email: app.contact_email || app.applicant_email,
        status: 'active'
      }]);

      if (clientError) console.error('Failed to initialize client portal:', clientError);
    }

    revalidatePath('/dashboard/storefronts');
    revalidatePath('/dashboard/clients');
    revalidatePath('/dashboard'); 
    return { success: true };
  } catch (error: any) {
    console.error('STATUS UPDATE ERROR:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}