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
    logo_size: 'large',
    industry_tag: formData.get('industry_tag') || 'General', // 🟢 ADDED HERE
    audit_notes: [] 
  };

  const { error } = await supabase.from('storefronts').insert(storefrontData);
  if (error) throw new Error("Failed to create storefront.");
  
  revalidatePath('/dashboard/storefronts', 'layout');
  revalidatePath('/', 'layout'); 
}

export async function updateStorefrontCore(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const updateData: any = {};

  // 🟢 WE ADDED 'industry_tag' TO THE ALLOWED FIELDS ARRAY
  const fields = [
    'business_name', 'slug', 'tagline', 'subtext', 'primary_cta', 'secondary_cta',
    'brand_color', 'theme_style', 'hero_layout', 'content_layout', 'about_layout',
    'about_heading', 'about_bio', 'capabilities_heading', 'gallery_heading', 'contact_email',
    'logo_size', 'industry_tag'
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
  
  if (logoSize) updateData.logo_size = logoSize;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase.from('storefronts').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  }

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

  // 1. Fetch current audit logs so we can append to them
  const { data: storeData } = await supabase
    .from('storefronts')
    .select('audit_notes')
    .eq('id', id)
    .single();

  const dispatchLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    author: "ADMIN",
    type: "REVIEW_DISPATCHED",
    message: "Staging architecture link securely transmitted to client for verification."
  };

  const updatedLogs = [...(storeData?.audit_notes || []), dispatchLog];

  // 2. Update the status and write the log
  const { error: dbError } = await supabase
    .from('storefronts')
    .update({ 
      status: 'IN REVIEW',
      audit_notes: updatedLogs 
    })
    .eq('id', id);

  if (dbError) {
    throw new Error(`Database update failed: ${dbError.message}`);
  }

  // Hardcoded to strictly point to the Template Engine subdomain
  const previewUrl = `https://storefronts.alternativesolutions.io/${slug}`;

  const emailResult = await dispatchSystemEmail({
    to: contactEmail,
    subject: `Staging Ready • Review Your Blueprint: ${businessName}`,
    type: 'STAGING_REVIEW',
    data: {
      name: businessName,
      businessName: businessName,
      previewUrl: previewUrl,
      planTier: planTier || 'Foundation Plan', 
      storefrontId: id 
    }
  });

  if (!emailResult.success) {
    throw new Error(emailResult.error || 'Failed to dispatch review email.');
  }

  revalidatePath('/dashboard/storefronts', 'layout');
  revalidatePath('/dashboard', 'layout');
  return { success: true };
}
export async function quickUpdateStorefrontStatus(id: string, newStatus: string, logEntry?: any) {
  const supabase = await createClient();
  
  // If a log entry was passed, we need to fetch the existing logs first to append it
  let updatePayload: any = { status: newStatus };
  
  if (logEntry) {
    const { data } = await supabase.from('storefronts').select('audit_notes').eq('id', id).single();
    const currentLogs = data?.audit_notes || [];
    updatePayload.audit_notes = [...currentLogs, logEntry];
  }
  
  const { error } = await supabase
    .from('storefronts')
    .update(updatePayload)
    .eq('id', id);
    
  if (error) throw new Error(error.message);
  
  revalidatePath('/dashboard/storefronts', 'layout');
  return { success: true };
}