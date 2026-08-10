// src/app/actions/storefronts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; 
import { dispatchSystemEmail } from '@/app/actions/emails';

export async function createStorefront(formData: FormData) {
  const supabase = await createClient(); 
  
  const slug = formData.get('slug') as string;
  if (!slug) throw new Error("Slug is required");

  async function uploadFile(file: File | null, prefix: string) {
    if (!file || file.size === 0) return null;
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${slug}/${prefix}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
    if (error) return null;

    const { data: publicUrlData } = supabase.storage.from('client-assets').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  }

  const heroFile = formData.get('hero_file') as File;
  const aboutFile = formData.get('about_file') as File;

  const heroUrl = await uploadFile(heroFile, 'hero') || 'https://placehold.co/1920x1080/18181b/a1a1aa?text=NO+HERO+IMAGE';
  const aboutUrl = await uploadFile(aboutFile, 'about') || 'https://placehold.co/800x800/18181b/a1a1aa?text=NO+ABOUT+IMAGE';

  const storefrontData = {
    business_name: formData.get('business_name'),
    slug: slug,
    tagline: formData.get('tagline'),
    brand_color: formData.get('brand_color'),
    theme_style: formData.get('theme_style') || 'industrial',
    hero_layout: formData.get('hero_layout') || 'center',
    content_layout: formData.get('content_layout') || 'classic',
    about_layout: formData.get('about_layout') || 'split',
    is_template: formData.get('is_template') === 'true',
    hero_image: heroUrl, 
    about_image: aboutUrl,
    subtext: 'Welcome to our new digital storefront.',
    contact_email: `hello@${slug}.com`,
    primary_cta: 'Get Started',
    secondary_cta: 'Learn More',
    about_heading: 'About Us',
    about_bio: 'We are a local business dedicated to providing top-tier services and products to our community. Check out our gallery to see our recent work!',
    social_url: 'https://facebook.com',
    gallery_items: [],
    logo_size: 'large' // Ensures new deployments always have a default size
  };

  const { error } = await supabase.from('storefronts').insert(storefrontData);
  if (error) throw new Error("Failed to create storefront.");
  
  // THE FIX: 'layout' forces a deep purge of this path and all its children
  revalidatePath('/dashboard/storefronts', 'layout');
  revalidatePath('/', 'layout'); 
}

export async function updateStorefrontCore(id: string, formData: FormData) {
  const supabase = await createClient();
  
  // THE FIX: We dynamically build the update payload. 
  // If a field is not in the form (like logo_size when saving the Design tab), 
  // it is ignored, preventing the "Null Wipeout" bug.
  const updateData: any = {};

  const fields = [
    'business_name', 'slug', 'tagline', 'subtext', 'primary_cta', 'secondary_cta',
    'brand_color', 'theme_style', 'hero_layout', 'content_layout', 'about_layout',
    'about_heading', 'about_bio', 'capabilities_heading', 'gallery_heading', 'contact_email',
    'logo_size' // Catch it gracefully if it is passed
  ];

  fields.forEach(field => {
    if (formData.has(field)) {
      updateData[field] = formData.get(field);
    }
  });

  if (formData.has('capabilities')) {
    updateData.capabilities = JSON.parse(formData.get('capabilities') as string);
  }

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase.from('storefronts').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  }

  // THE FIX: Deep Cache Purge
  revalidatePath('/dashboard/storefronts', 'layout');
}

export async function updateStorefrontMedia(id: string, slug: string, formData: FormData) {
  const supabase = await createClient();
  
  async function uploadFile(file: File | null, prefix: string) {
    if (!file || file.size === 0) return null;
    const fileExt = file.name.split('.').pop();
    const filePath = `${slug}/${prefix}-${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
    if (error) return null;
    
    const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
    return data.publicUrl;
  }

  const heroFile = formData.get('hero_file') as File;
  const aboutFile = formData.get('about_file') as File;
  const logoFile = formData.get('logo_file') as File;
  
  const logoSize = formData.get('logo_size') as string;

  const heroUrl = await uploadFile(heroFile, 'hero');
  const aboutUrl = await uploadFile(aboutFile, 'about');
  const logoUrl = await uploadFile(logoFile, 'logo');

  const updateData: any = {};
  if (heroUrl) updateData.hero_image = heroUrl;
  if (aboutUrl) updateData.about_image = aboutUrl;
  if (logoUrl) updateData.brand_logo = logoUrl;
  
  // Bind the logo size to the update payload
  if (logoSize) updateData.logo_size = logoSize;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase.from('storefronts').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  }

  // THE FIX: Deep Cache Purge to prevent the "Reverting to Small" trap
  revalidatePath('/dashboard/storefronts', 'layout');
}

export async function updateStorefrontCapabilities(id: string, capabilities: any[]) {
  const supabase = await createClient();
  const { error } = await supabase.from('storefronts').update({ capabilities }).eq('id', id);
  if (error) throw new Error(error.message);
  
  revalidatePath('/dashboard/storefronts', 'layout');
}

export async function updateStorefrontGallery(id: string, slug: string, formData: FormData) {
  const supabase = await createClient();
  const files = formData.getAll('images') as File[];
  
  if (files.length === 0) return;

  const uploadedUrls = [];

  for (const file of files) {
    const filePath = `${slug}/gallery/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
    const { error } = await supabase.storage.from('client-assets').upload(filePath, file);
    
    if (!error) {
      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }
  }

  const { data: currentStore } = await supabase.from('storefronts').select('gallery_items').eq('id', id).single();
  const existingItems = currentStore?.gallery_items || [];
  
  const { error: updateError } = await supabase.from('storefronts')
    .update({ gallery_items: [...existingItems, ...uploadedUrls] })
    .eq('id', id);

  if (updateError) throw new Error("Database sync failed");

  revalidatePath('/dashboard/storefronts', 'layout');
}

export async function removeImageFromGallery(storeId: string, imageUrlToRemove: string) {
  const supabase = await createClient();

  const { data: store, error: fetchError } = await supabase
    .from('storefronts')
    .select('gallery_items')
    .eq('id', storeId)
    .single();

  if (fetchError || !store) throw new Error("Failed to find store data");

  const currentGallery = store.gallery_items || [];
  const updatedGallery = currentGallery.filter((url: string) => url !== imageUrlToRemove);

  const { error: updateError } = await supabase
    .from('storefronts')
    .update({ gallery_items: updatedGallery })
    .eq('id', storeId);

  if (updateError) throw new Error("Failed to delete image from gallery array.");

  revalidatePath('/dashboard/storefronts', 'layout');
  return { success: true };
}

export async function deleteStorefront(id: string) {
  const supabase = await createClient(); 
  
  const { data, error } = await supabase
    .from('storefronts')
    .delete()
    .eq('id', id)
    .select(); 

  if (error) {
    throw new Error(`Failed to delete storefront: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error("Delete BLOCKED by Supabase RLS.");
  }

  revalidatePath('/dashboard/storefronts', 'layout');
  revalidatePath('/dashboard', 'layout');
  revalidatePath('/', 'layout');

  return { success: true };
}

export async function dispatchStagingReview(id: string, slug: string, businessName: string, contactEmail: string, planTier: string) {
  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from('storefronts')
    .update({ status: 'IN REVIEW' })
    .eq('id', id);

  if (dbError) {
    throw new Error(`Database update failed: ${dbError.message}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io';
  const previewUrl = `${baseUrl}/${slug}`;

  const emailResult = await dispatchSystemEmail({
    to: contactEmail,
    subject: `Staging Ready • Review Your Blueprint: ${businessName}`,
    type: 'STAGING_REVIEW',
    data: {
      name: businessName,
      businessName: businessName,
      previewUrl: previewUrl,
      planTier: planTier || 'Foundation Plan', // Defaulting to your real plan name
      storefrontId: id // Ensure your StagingReviewEmail template receives this!
    }
  });

  if (!emailResult.success) {
    throw new Error(emailResult.error || 'Failed to dispatch review email.');
  }

  revalidatePath('/dashboard/storefronts', 'layout');
  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

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

    await dispatchSystemEmail({
      to: payload.applicant_email,
      subject: `Application received: ${payload.business_name}`,
      type: 'STOREFRONT_CONFIRMATION',
      data: { 
        name: payload.applicant_name, 
        projectName: payload.business_name,
        selectedPlan: payload.selected_plan,
        selectedVibe: payload.selected_vibe,
        originStory: payload.business_description
      }
    });

    await dispatchSystemEmail({
      to: process.env.ADMIN_EMAIL || 'hello@alternativesolutions.io',
      subject: `🚨 NEW LEAD: ${payload.business_name}`,
      type: 'ADMIN_INTAKE',
      data: {
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
      }
    });

    revalidatePath('/dashboard/storefronts', 'layout');
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

      const { error: insertError } = await supabase.from('storefronts').insert([{
        business_name: app.business_name,
        contact_email: app.contact_email || app.applicant_email, 
        status: 'BUILDING',
        slug: finalSlug, 
        plan_tier: app.selected_plan || 'foundation',
        theme_style: app.selected_vibe || 'industrial',
        tagline: app.business_description ? app.business_description.substring(0, 50) + '...' : 'Welcome to your new digital storefront.',
        subtext: app.business_description || 'Getting operations online. Stay tuned.',
        hero_layout: 'center',
        content_layout: 'classic',
        about_layout: 'split',
        is_template: false,
        hero_image: 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE',
        about_image: 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE',
        primary_cta: 'Get Started',
        secondary_cta: 'Learn More',
        about_heading: 'About Us',
        about_bio: 'Dedicated to providing top-tier services and products to the community. Check out the gallery to see recent work!',
        social_url: 'https://facebook.com',
        gallery_items: []
      }]);
      
      if (insertError) console.error('Failed to initialize storefront:', insertError);

      const { error: clientError } = await supabase.from('clients').insert([{
        id: finalSlug,
        name: app.business_name,
        primary_contact: app.applicant_name,
        email: app.contact_email || app.applicant_email,
        status: 'active'
      }]);

      if (clientError) console.error('Failed to initialize client portal:', clientError);
    }

    revalidatePath('/dashboard/storefronts', 'layout');
    revalidatePath('/dashboard/clients', 'layout');
    revalidatePath('/dashboard', 'layout'); 
    return { success: true };
  } catch (error: any) {
    console.error('STATUS UPDATE ERROR:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}