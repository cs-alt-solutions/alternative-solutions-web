'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; 
import { Resend } from 'resend';
import StagingReviewEmail from '@/components/emails/StagingReviewEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const heroUrl = await uploadFile(heroFile, 'hero') || 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE';
  const aboutUrl = await uploadFile(aboutFile, 'about') || 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE';

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
    gallery_items: [] 
  };

  const { error } = await supabase.from('storefronts').insert(storefrontData);
  if (error) throw new Error("Failed to create storefront.");
  
  revalidatePath('/dashboard/storefronts');
  revalidatePath('/'); 
}

export async function updateStorefrontCore(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const updateData = {
    business_name: formData.get('business_name'),
    slug: formData.get('slug'),
    tagline: formData.get('tagline'),
    subtext: formData.get('subtext'),
    primary_cta: formData.get('primary_cta'),
    secondary_cta: formData.get('secondary_cta'),
    brand_color: formData.get('brand_color'),
    theme_style: formData.get('theme_style'),
    hero_layout: formData.get('hero_layout'),
    content_layout: formData.get('content_layout'),
    about_layout: formData.get('about_layout'),
    about_heading: formData.get('about_heading'),
    about_bio: formData.get('about_bio'),
    capabilities_heading: formData.get('capabilities_heading'),
    gallery_heading: formData.get('gallery_heading'),
    contact_email: formData.get('contact_email'),
    capabilities: formData.get('capabilities') ? JSON.parse(formData.get('capabilities') as string) : [],
  };

  const { error } = await supabase.from('storefronts').update(updateData).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/storefronts');
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

  const heroUrl = await uploadFile(heroFile, 'hero');
  const aboutUrl = await uploadFile(aboutFile, 'about');

  const updateData: any = {};
  if (heroUrl) updateData.hero_image = heroUrl;
  if (aboutUrl) updateData.about_image = aboutUrl;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase.from('storefronts').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  }
  revalidatePath('/dashboard/storefronts');
}

export async function updateStorefrontCapabilities(id: string, capabilities: any[]) {
  const supabase = await createClient();
  const { error } = await supabase.from('storefronts').update({ capabilities }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/storefronts');
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
  revalidatePath('/dashboard/storefronts');
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

  revalidatePath('/dashboard/storefronts');
  revalidatePath('/dashboard');
  revalidatePath('/');

  return { success: true };
}

// 🚀 STAGING REVIEW DISPATCH ENGINE
export async function dispatchStagingReview(id: string, slug: string, businessName: string, contactEmail: string, planTier: string) {
  const supabase = await createClient();

  // 1. Flip database status to IN_REVIEW
  const { error: dbError } = await supabase
    .from('storefronts')
    .update({ status: 'IN_REVIEW' })
    .eq('id', id);

  if (dbError) {
    throw new Error(`Database update failed: ${dbError.message}`);
  }

  // 2. Resolve dynamic staging URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://alternativesolutions.io';
  const previewUrl = `${baseUrl}/${slug}`;

  // 3. Dispatch personal architectural handoff letter
  try {
    const { error: emailError } = await resend.emails.send({
      from: 'Courtney <hello@alternativesolutions.io>',
      to: contactEmail,
      subject: `Staging Ready • Review Your Blueprint: ${businessName}`,
      react: StagingReviewEmail({
        name: businessName,
        businessName: businessName,
        previewUrl: previewUrl,
        planTier: planTier || 'Standard Starter'
      })
    });

    if (emailError) {
      console.error('Resend dispatch error:', emailError);
      throw new Error('Email failed to transmit through Resend.');
    }
  } catch (err: any) {
    console.error('CRITICAL EMAIL ERROR:', err);
    throw new Error(err.message || 'Failed to dispatch review email.');
  }

  revalidatePath('/dashboard/storefronts');
  revalidatePath('/dashboard');
  return { success: true };
}