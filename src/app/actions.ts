/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
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
  const { data, error } = await supabase
    .from('ideas_ledger')
    .select('*')
    .eq('status', 'IN_PROGRESS') 
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export async function getActiveProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });
    
  if (error) return [];
  return data;
}

export async function toggleAnonymity(id: string, currentDisplayName: string, originalName: string | null) {
  const newName = currentDisplayName === 'Anonymous' ? (originalName || 'Anonymous Builder') : 'Anonymous';
  const { error } = await supabase.from('supporters').update({ display_name: newName }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/dashboard/foundation');
  revalidatePath('/blueprint');
  return { success: true };
}