'use server';

import { revalidatePath } from 'next/cache';
import { Directive } from '@/utils/glossary';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hello@alternativesolutions.io';

// --- AUTH COMMANDS ---
export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // 1. Create a secure SERVER client for this specific request
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: 'Invalid credentials. Access denied.' };
  }
  redirect('/dashboard');
}

// --- SYSTEM COMMAND: PULSE ---
export async function logPulse(eventType: string, message: string) {
  const supabase = await createClient();
  await supabase.from('pulse_log').insert([{ event_type: eventType, message }]);
  revalidatePath('/dashboard');
}

// --- OPERATIONS: FOUNDATION COMMAND ---
export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = formData.get('source') as string || 'Workshop';
  
  if (!email) {
    return { success: false, error: 'Email is required', isNew: false };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('supporters')
      .upsert({ 
        email: email.toLowerCase().trim(),
        tier: 'OBSERVER',
        status: 'ACTIVE',
        amount: 0,
        source: source
      }, { 
        onConflict: 'email' 
      });

    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error: error.message, isNew: false };
    }

    await logPulse('BETA_REQUEST', `New request from ${email}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/foundation');
    
    return { success: true, isNew: true };
    
  } catch (error) {
    console.error('Action failed:', error);
    return { success: false, error: 'Internal Server Error', isNew: false };
  }
}

// --- STUDIO: BROADCAST (EMAIL COMMS) ---
export async function sendCampaignBlast(audience: string, subject: string, content: string) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY is missing from environment variables.' };
  }

  try {
    const supabase = await createClient();
    let query = supabase.from('supporters').select('email, display_name').eq('status', 'ACTIVE');
    
    if (audience === 'FOUNDERS') {
      query = query.eq('tier', 'BUILDER');
    } else if (audience === 'OBSERVERS') {
      query = query.eq('tier', 'OBSERVER');
    }

    const { data: recipients, error } = await query;

    if (error) throw error;
    if (!recipients || recipients.length === 0) return { success: false, error: 'No recipients found for this audience.' };

    const emailList = recipients.map(r => r.email);

    // Send the email batch via Resend
    const { data, error: resendError } = await resend.emails.send({
      from: `Alternative Solutions <${fromEmail}>`,
      to: emailList,
      subject: subject,
      html: `<div style="font-family: sans-serif; color: #1a1a1e; line-height: 1.6;">
               <p style="white-space: pre-wrap;">${content}</p>
             </div>`, 
    });

    if (resendError) throw resendError;

    await logPulse('EMAIL_BLAST', `Sent "${subject}" to ${emailList.length} ${audience}`);
    revalidatePath('/dashboard/broadcast');
    
    return { success: true, count: emailList.length };
  } catch (err: any) {
    console.error('Failed to send campaign:', err);
    return { success: false, error: err.message || 'Transmission failed.' };
  }
}

// --- STUDIO: BROADCAST (AUDIO) ---
export async function publishAudioLog(formData: FormData) {
  const file = formData.get('audioFile') as File;
  const title = formData.get('title') as string;

  if (!file) return { success: false, error: 'NO_FILE' };
  const fileName = `${Date.now()}-${file.name}`;

  const supabase = await createClient();

  const { data, error: storageError } = await supabase.storage
    .from('workshop_media')
    .upload(`episodes/${fileName}`, file);

  if (storageError) return { success: false, error: storageError.message };

  const { data: { publicUrl } } = supabase.storage.from('workshop_media').getPublicUrl(`episodes/${fileName}`);

  await supabase.from('audio_logs').insert([{
    title,
    audio_url: publicUrl,
    status: 'ACTIVE',
    date: new Date().toISOString()
  }]);

  await logPulse('NEW_LOG', `Broadcast Live: ${title}`);
  revalidatePath('/shift-studio');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

// --- PLANNER: DIRECTIVES ---
export async function logDirective(directive: Omit<Directive, 'id' | 'status'>) {
  const supabase = await createClient();
  const { error } = await supabase.from('ideas_ledger').insert([{
    title: directive.title,
    goal_id: directive.goalId,
    priority: directive.priority,
    classification: directive.classification,
    status: 'IN_PROGRESS'
  }]);

  if (!error) {
    await logPulse('BUILD_UPDATE', `New Directive: ${directive.title}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/tasks');
  }
  return { success: !error };
}

export async function getActiveDirectives() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ideas_ledger')
    .select('*')
    .eq('status', 'IN_PROGRESS') 
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export async function getActiveProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export async function toggleAnonymity(id: string, currentDisplayName: string, originalName: string | null) {
  const supabase = await createClient();
  const newName = currentDisplayName === 'Anonymous' ? (originalName || 'Anonymous Builder') : 'Anonymous';
  const { error } = await supabase.from('supporters').update({ display_name: newName }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/dashboard/foundation');
  revalidatePath('/blueprint');
  return { success: true };
}

export async function createNewClient(formData: FormData) {
  const supabase = await createClient();
  const clientName = formData.get('clientName') as string;
  
  // Convert "Luckystrike Designs" to "luckystrike-designs"
  const clientId = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabase.from('clients').insert([{
    id: clientId,
    name: clientName,
    status: 'ACTIVE'
  }]);

  if (!error) {
    await logPulse('NEW_CLIENT', `Provisioned HQ for: ${clientName}`);
    revalidatePath('/dashboard'); 
  }
  
  return { success: !error, clientId, error: error?.message };
}

// --- SECTOR ZERO: PROJECT INTAKE ---
export async function submitSectorZeroIntake(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const businessName = formData.get('businessName') as string;
  const socialFacebook = formData.get('socialFacebook') as string;
  const socialTiktok = formData.get('socialTiktok') as string;
  const website = formData.get('website') as string;
  const projectScope = formData.get('projectScope') as string;

  try {
    const supabase = await createClient();
    
    // Generate a slick, professional Application ID (e.g., SZ-8F4A2)
    const uniqueHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const appId = `SZ-${uniqueHash}`;

    // 1. ATTEMPT TO SAVE TO DATABASE (The Duplicate Guard)
    const { error: dbError } = await supabase.from('sector_zero_leads').insert([{
      app_id: appId,
      name: name,
      email: email.toLowerCase().trim(),
      business_name: businessName,
      social_facebook: socialFacebook,
      social_tiktok: socialTiktok,
      website: website,
      project_scope: projectScope,
      status: 'PENDING'
    }]);

    if (dbError) {
      // Postgres Error 23505 means a Unique constraint violation (duplicate email)
      if (dbError.code === '23505') {
        return { success: false, error: "An application with this email is already in the queue." };
      }
      console.error("Database Insert Failed:", dbError);
      return { success: false, error: "Database error. Please try again." };
    }

    // 2. Fire the internal alert directly to your inbox
    const { error: alertError } = await resend.emails.send({
      from: `Alternative Solutions <${fromEmail}>`, 
      to: ['courtney@alternativesolutions.io'], 
      subject: `🚨 INTAKE [${appId}]: ${businessName || name}`,
      html: `
        <div style="font-family: monospace; padding: 20px; background-color: #0a0a0a; color: #fff;">
          <h2 style="color: #06b6d4; text-transform: uppercase;">Sector Zero Application</h2>
          <p><strong>App ID:</strong> <span style="color: #06b6d4;">${appId}</span></p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Business Name:</strong> ${businessName}</p>
          <hr style="border-color: #333; margin: 20px 0;" />
          <h3 style="color: #06b6d4; text-transform: uppercase; margin-bottom: 10px;">Digital Footprint</h3>
          <p><strong>FB/IG:</strong> ${socialFacebook || 'None'}</p>
          <p><strong>TikTok:</strong> ${socialTiktok || 'None'}</p>
          <p><strong>Website:</strong> ${website || 'None'}</p>
          <hr style="border-color: #333; margin: 20px 0;" />
          <h3 style="color: #06b6d4; text-transform: uppercase; margin-bottom: 10px;">Project Scope</h3>
          <p style="white-space: pre-wrap; color: #ccc; line-height: 1.6;">${projectScope}</p>
        </div>
      `
    });

    // 3. Fire the auto-responder to the applicant
    const { error: autoRespondError } = await resend.emails.send({
      from: `Courtney | Alternative Solutions <${fromEmail}>`, 
      to: [email], 
      subject: `🚀 Website Application Received [${appId}]`,
      html: `
        <div style="background-color: #050505; padding: 40px 20px; font-family: sans-serif; color: #e2e8f0; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);">
            
            <!-- Header -->
            <div style="background-color: #111827; padding: 30px; border-bottom: 2px solid #06b6d4; text-align: center;">
              <h2 style="color: #06b6d4; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">Website Application Received</h2>
              <p style="color: #94a3b8; font-size: 11px; margin-top: 8px; text-transform: uppercase; letter-spacing: 2px;">Sector Zero Foundation</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px;">
              <p>Hey ${name.split(' ')[0]},</p>
              
              <p>Thanks for submitting your application for a new website build! I am super pumped to read through your project scope and see what we can create together.</p>
              
              <p style="margin: 25px 0; padding: 15px; background-color: rgba(217, 70, 239, 0.1); border: 1px solid rgba(217, 70, 239, 0.3); border-radius: 8px; text-align: center;">
                <strong>Your official Application ID is: <span style="color: #d946ef; font-family: monospace; font-size: 18px; letter-spacing: 1px;">${appId}</span></strong>
              </p>

              <p>Just a quick heads-up on how I operate: I am a solo architect. There is no giant corporate team behind a curtain reading these—it's literally just me. I review every single submission personally to make sure this foundation is the exact right fit for your business.</p>
              
              <p>Because of that, my standard turnaround time is <strong style="color: #06b6d4;">3 business days (72 business hours)</strong>. (So, if you're sending this on a Friday, Monday counts as Day 1!). I really appreciate you bearing with me while I get through the queue and process your details.</p>
              
              <!-- Review Box -->
              <div style="background-color: #111827; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #d946ef;">
                <h4 style="margin-top: 0; color: #f8fafc; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">What you sent over:</h4>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong>Business:</strong> ${businessName}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong>Scope:</strong><br/> <span style="color: #94a3b8;">${projectScope}</span></p>
              </div>

              <p>If you realize you forgot a detail or need to update a link, no sweat—just reply directly to this email and include your Application ID.</p>
              
              <p style="margin-top: 30px;">Talk soon,</p>
              <p style="margin-top: 10px;">
                <strong style="color: #f8fafc;">Courtney M. Sulenski</strong><br/>
                <span style="color: #06b6d4; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Lead Solutions Architect | Alternative Solutions</span>
              </p>
            </div>
          </div>
        </div>
      `
    });

    // Ping the dashboard telemetry
    await logPulse('SECTOR_ZERO', `App ${appId} logged for ${businessName || name}`);
    
    return { success: true };

  } catch (err) {
    console.error("System Error during intake:", err);
    return { success: false, error: "System failure." };
  }
}