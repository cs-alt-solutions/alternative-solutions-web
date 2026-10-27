/* src/app/actions/storefront_applications.ts */
'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';
import { createStorefrontCheckout } from '@/app/actions/billing';

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

    const emailStr = formData.get('email')?.toString() || formData.get('applicant_email')?.toString() || 'missing@email.com';

    const payload = {
      applicant_name: formData.get('name')?.toString() || '',
      applicant_email: emailStr, 
      applicant_phone: formData.get('phone')?.toString() || '',
      business_name: businessName,
      business_description: formData.get('description')?.toString() || '',
      social_handles: JSON.parse(formData.get('socials')?.toString() || '{}'),
      selected_vibe: formData.get('selectedVibe')?.toString() || 'clueless',
      selected_plan: formData.get('selectedPlan')?.toString() || 'standard',
      wants_custom: formData.get('wantsCustom') === 'true',
      existing_domain: formData.get('existingDomain')?.toString() || '',
      is_priority: formData.get('priorityQueue') === 'true',
      status: 'PENDING',
      contact_email: emailStr,
      logo_url: logoUrl,
      hero_image_url: bgUrl,
      about_image_url: aboutUrl
    };

    const { error } = await supabase.from('storefront_applications').insert([payload]);
    if (error) {
      console.error("Supabase Insert Error Payload:", payload);
      throw error;
    }

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
            socials: formData.get('socials')?.toString() || 'None provided',
            businessName: payload.business_name
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

// 🚀 REPLACED: Now skips Stripe entirely and sends them directly to the Brain Dump Portal intercept
export async function approveAndSendCheckout(id: string, overrides?: any) {
  const supabase = await createClient();
  
  try {
    const { data: app, error: fetchError } = await supabase
      .from('storefront_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !app) throw new Error('Application not found');

    let baseSlug = overrides?.slug || (app.business_name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let finalSlug = baseSlug;

    const { data: existing } = await supabase.from('storefronts').select('slug').eq('slug', finalSlug);
    if (existing && existing.length > 0) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const finalVibe = overrides?.vibe || app.selected_vibe || 'industrial';
    const finalColor = overrides?.brandColor || app.brand_color || 'cyan';
    const finalHero = overrides?.hero || app.hero_structure || 'centered';
    const finalStory = overrides?.story || app.story_structure || 'split';
    const finalFlow = overrides?.flow || app.content_flow || 'classic';
    const finalPlan = overrides?.plan || app.selected_plan || 'standard';

    const initialLogs = [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        author: "SYSTEM",
        type: "APPLICATION_RECEIVED",
        message: "Client application successfully processed."
      },
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        author: "ADMIN",
        type: "AWAITING_PAYMENT",
        message: "Application approved. Portal provisioned for Brain Dump onboarding."
      }
    ];

    // 1. Initialize Storefront in AWAITING_PAYMENT (This triggers the Brain Dump intercept)
    const { data: newStore, error: insertError } = await supabase.from('storefronts').insert([{
      business_name: app.business_name,
      contact_email: app.contact_email || app.applicant_email, 
      status: 'AWAITING_PAYMENT',
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
      gallery_items: [],
      audit_notes: initialLogs
    }]).select().single();
    
    if (insertError) throw new Error("Storefront Creation Blocked by Database: " + insertError.message);

    // 2. Initialize Client Portal
    const { error: clientError } = await supabase.from('clients').insert([{
      id: finalSlug,
      name: app.business_name,
      primary_contact: app.applicant_name,
      email: app.contact_email || app.applicant_email,
      status: 'active'
    }]);

    if (clientError) console.error('Failed to initialize client portal:', clientError);

    // 🚀 3. GENERATE AUTHENTICATED MAGIC LINK
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';
    
    // We start with a fallback URL, but we will immediately try to upgrade it to a Magic Link
    let magicLinkUrl = `${origin}/portal/${newStore.id}`;

    try {
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string 
      );

      // Generate the passwordless login URL directly into their portal
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: app.applicant_email,
        options: {
          redirectTo: `${origin}/portal/${newStore.id}`
        }
      });

      if (linkData?.properties?.action_link) {
        magicLinkUrl = linkData.properties.action_link; // Overwrite fallback with secure token
        
        // Make sure their profile natively exists in the database so the Magic Link succeeds
        if (linkData.user?.id) {
          await supabaseAdmin.from('profiles').upsert({
            id: linkData.user.id,
            email: app.applicant_email,
            full_name: app.applicant_name,
            role: 'CLIENT_OWNER',
            workspace_id: newStore.id
          }, { onConflict: 'id' });
        }
      }
    } catch (adminErr) {
      console.error("Failed to generate admin magic link:", adminErr);
    }

    // 4. Send the Handoff Email with the Secure Magic Link
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Courtney <hello@alternativesolutions.io>",
        to: [app.applicant_email],
        subject: `Application Approved: Workspace Ready for ${app.business_name}`,
        html: `
          <div style="font-family: sans-serif; background-color: #09090b; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #27272a; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">You're Approved!</h2>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">I reviewed your application for <strong>${app.business_name}</strong> and everything looks solid. I am super pumped to get this off the ground.</p>
            
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6; margin-top: 24px;">I've provisioned your private Client Portal. Log in below to complete your initial Brain Dump so I know exactly what we're working with before I lay down the groundwork.</p>
            
            <div style="margin: 32px 0;">
              <a href="${magicLinkUrl}" style="display: inline-block; background-color: #22d3ee; color: #000000; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Enter Your Workspace</a>
            </div>
            
            <div style="margin-top: 48px; border-top: 1px solid #27272a; padding-top: 24px;">
              <p style="color: #71717a; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Let's get this thing built,</p>
              <p style="color: #22d3ee; font-size: 14px; font-weight: bold; margin: 8px 0 0 0;">Courtney</p>
              <p style="color: #52525b; font-size: 10px; font-family: monospace; margin: 4px 0 0 0;">Alternative Solutions</p>
            </div>
          </div>
        `
      });
    }

    // 5. Update application record status
    await supabase
      .from('storefront_applications')
      .update({ 
        status: 'APPROVED',
        ...(overrides?.plan && { selected_plan: overrides.plan }),
        ...(overrides?.vibe && { selected_vibe: overrides.vibe })
      })
      .eq('id', id);

    revalidatePath('/dashboard/storefronts');
    revalidatePath('/dashboard/clients');
    revalidatePath('/dashboard'); 
    return { success: true };
  } catch (error: any) {
    console.error('APPROVAL ERROR:', error);
    return { success: false, error: error.message || 'Failed to approve application' };
  }
}

// 🚀 REJECT/CANCEL FALLBACK
export async function updateApplicationStatus(id: string, newStatus: 'CANCELED') {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('storefront_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error: any) {
    console.error('STATUS UPDATE ERROR:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}

export async function sendPaymentNudge(id: string, contactEmail: string, businessName: string) {
  const supabase = await createClient();

  try {
    const checkout = await createStorefrontCheckout(id, contactEmail);
    
    if (!checkout?.url) throw new Error('Failed to generate fresh checkout link');

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Courtney <hello@alternativesolutions.io>",
        to: [contactEmail],
        subject: `Build Status • Queue Check-In: ${businessName}`,
        html: `
          <div style="font-family: sans-serif; background-color: #09090b; color: #ffffff; padding: 32px; border-radius: 12px;">
            <h2 style="color: #f59e0b; margin-top: 0;">Queue Check-In</h2>
            <p style="color: #d4d4d8;">Hey! I noticed your build application for <strong>${businessName}</strong> has been sitting in the "Awaiting Payment" queue for a bit.</p>
            <p style="color: #d4d4d8;">My active drafting table is pretty packed right now, so I do routine sweeps to clear out inactive files and make room for the next founder on the waitlist.</p>
            <p style="color: #d4d4d8;">I wanted to check in personally before I archive your project: Are you still wanting to lock in your foundation and get this built?</p>
            
            <div style="margin: 24px 0;">
              <a href="${checkout.url}" style="display: inline-block; background-color: #22d3ee; color: #000000; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-right: 12px;">Yes, Start My Build ($5/mo)</a>
            </div>
            
            <p style="color: #71717a; font-size: 12px; margin-top: 24px;">If I don't hear back, I'll go ahead and archive the file so we can clear the slot. Talk soon!</p>
          </div>
        `
      });
    }

    const { data: storeData } = await supabase.from('storefronts').select('audit_notes').eq('id', id).single();
    
    const nudgeLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      author: "ADMIN",
      type: "PAYMENT_REMINDER_SENT",
      message: "Payment reminder and fresh checkout link transmitted to client."
    };

    const updatedLogs = [...(storeData?.audit_notes || []), nudgeLog];

    await supabase.from('storefronts').update({ audit_notes: updatedLogs }).eq('id', id);

    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error: any) {
    console.error('NUDGE ERROR:', error);
    return { success: false, error: error.message || 'Failed to send payment nudge' };
  }
}