/* src/app/actions/storefront_applications.ts */
'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { Resend } from 'resend';
import StorefrontConfirmationEmail from '@/components/emails/StorefrontConfirmationEmail';
import AdminIntakeEmail from '@/components/emails/AdminIntakeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to get the Service Role client so RLS never blocks admin pipeline actions
function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

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
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('CRITICAL SUBMISSION ERROR:', error);
    return { success: false, error: error.message || 'Transmission failed: Database or Auth Error' };
  }
}

// Helper to reliably flip application status out of PENDING
async function markApplicationProcessed(
  supabaseAdmin: ReturnType<typeof getAdminSupabase>,
  id: string,
  targetStatus: 'APPROVED' | 'CANCELED',
  extraFields: Record<string, any> = {}
) {
  const { error: err1 } = await supabaseAdmin
    .from('storefront_applications')
    .update({ status: targetStatus, ...extraFields })
    .eq('id', id);

  if (!err1) return;

  console.warn(`Primary status '${targetStatus}' rejected by DB (${err1.message}). Trying legacy fallback...`);

  const fallbackStatuses = targetStatus === 'APPROVED' ? ['BUILDING', 'REVIEWED', 'ARCHIVED'] : ['ARCHIVED', 'REVIEWED'];
  for (const fallback of fallbackStatuses) {
    const { error: fallbackErr } = await supabaseAdmin
      .from('storefront_applications')
      .update({ status: fallback, ...extraFields })
      .eq('id', id);
    if (!fallbackErr) {
      console.log(`Successfully updated application ${id} status using fallback '${fallback}'`);
      return;
    }
  }

  console.error(`All status updates failed for application ${id}. Removing from pending queue.`);
  await supabaseAdmin.from('storefront_applications').delete().eq('id', id);
}

// 🚀 Approves application, provisions Storefront in AWAITING_PAYMENT, and sends Brain Dump Magic Link
export async function approveAndSendCheckout(id: string, overrides?: any) {
  const supabaseAdmin = getAdminSupabase();
  
  try {
    const { data: app, error: fetchError } = await supabaseAdmin
      .from('storefront_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !app) throw new Error('Application not found');

    if (app.status && app.status !== 'PENDING') {
      revalidatePath('/dashboard');
      revalidatePath('/dashboard/storefronts');
      return { success: true, message: 'Already processed' };
    }

    const targetEmail = app.contact_email || app.applicant_email;
    let baseSlug = overrides?.slug || (app.business_name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let finalSlug = baseSlug;

    const { data: existingStoreForLead } = await supabaseAdmin
      .from('storefronts')
      .select('*')
      .eq('business_name', app.business_name)
      .eq('contact_email', targetEmail)
      .eq('is_template', false)
      .limit(1)
      .maybeSingle();

    let newStore = existingStoreForLead;

    if (!newStore) {
      const { data: slugCollision } = await supabaseAdmin
        .from('storefronts')
        .select('slug')
        .eq('slug', finalSlug);

      if (slugCollision && slugCollision.length > 0) {
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

      const { data: createdStore, error: insertError } = await supabaseAdmin
        .from('storefronts')
        .insert([{
          business_name: app.business_name,
          contact_email: targetEmail, 
          status: 'ONBOARDING',
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
        }])
        .select()
        .single();
      
      if (insertError) throw new Error("Storefront Creation Blocked by Database: " + insertError.message);
      newStore = createdStore;

      const { error: clientError } = await supabaseAdmin.from('clients').upsert([{
        id: finalSlug,
        name: app.business_name,
        primary_contact: app.applicant_name,
        email: targetEmail,
        status: 'active'
      }], { onConflict: 'id' });

      if (clientError) console.error('Failed to initialize client portal:', clientError);
    }

    await markApplicationProcessed(supabaseAdmin, id, 'APPROVED', {
      ...(overrides?.plan && { selected_plan: overrides.plan }),
      ...(overrides?.vibe && { selected_vibe: overrides.vibe })
    });

    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';
    
    let magicLinkUrl = `${origin}/portal/${newStore.id}`;

    try {
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: app.applicant_email,
        options: {
          redirectTo: `${origin}/api/auth/callback?next=/portal/${newStore.id}`
        }
      });

      if (linkData?.properties?.action_link) {
        magicLinkUrl = linkData.properties.action_link; 
        
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

    revalidatePath('/dashboard/storefronts');
    revalidatePath('/dashboard/clients');
    revalidatePath('/dashboard'); 
    return { success: true, storefrontId: newStore.id };
  } catch (error: any) {
    console.error('APPROVAL ERROR:', error);
    return { success: false, error: error.message || 'Failed to approve application' };
  }
}

// 🚀 REJECT/CANCEL FALLBACK
export async function updateApplicationStatus(id: string, newStatus: 'CANCELED') {
  const supabaseAdmin = getAdminSupabase();
  try {
    await markApplicationProcessed(supabaseAdmin, id, newStatus);

    revalidatePath('/dashboard/storefronts');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('STATUS UPDATE ERROR:', error);
    return { success: false, error: error.message || 'Failed to update status' };
  }
}

// 🚀 THE NEW PORTAL LOGIN NUDGE
export async function sendPortalNudge(id: string, contactEmail: string, businessName: string) {
  const supabaseAdmin = getAdminSupabase();

  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.alternativesolutions.io';

    // 1. Generate the secure Magic Link directly
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: contactEmail,
    });

    if (linkError) throw linkError;

    let magicLinkUrl = `${origin}/login`;
    if (linkData?.properties?.hashed_token) {
      magicLinkUrl = `${origin}/api/auth/callback?token_hash=${linkData.properties.hashed_token}&type=magiclink`;
    }

    // 2. Dispatch the Handoff/Nudge Email
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Courtney <hello@alternativesolutions.io>",
        to: [contactEmail],
        subject: `Action Required • Workspace Access: ${businessName}`,
        html: `
          <div style="font-family: sans-serif; background-color: #09090b; color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #27272a; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">Workspace Reminder</h2>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Hey! I noticed you haven't jumped into your workspace for <strong>${businessName}</strong> yet.</p>
            <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Your private Client Portal is provisioned and waiting for you to complete your initial Brain Dump. Once that's done, I can lay down the groundwork for your build.</p>
            
            <div style="margin: 32px 0;">
              <a href="${magicLinkUrl}" style="display: inline-block; background-color: #22d3ee; color: #000000; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Enter Your Workspace</a>
            </div>
            
            <p style="color: #71717a; font-size: 12px; margin-top: 24px;">If you have any questions, just reply to this email. Talk soon!</p>
          </div>
        `
      });
    }

    // 3. Log the action to the Storefront Ledger
    const { data: storeData } = await supabaseAdmin.from('storefronts').select('audit_notes').eq('id', id).single();
    
    const nudgeLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      author: "ADMIN",
      type: "PORTAL_REMINDER_SENT",
      message: "Portal access reminder and fresh magic link transmitted to client."
    };

    const updatedLogs = [...(storeData?.audit_notes || []), nudgeLog];

    await supabaseAdmin.from('storefronts').update({ audit_notes: updatedLogs }).eq('id', id);

    revalidatePath('/dashboard/storefronts');
    return { success: true };
  } catch (error: any) {
    console.error('PORTAL NUDGE ERROR:', error);
    return { success: false, error: error.message || 'Failed to send portal nudge' };
  }
}