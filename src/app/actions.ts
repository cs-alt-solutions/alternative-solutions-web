/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';
import { Directive } from '@/utils/glossary';

// --- SYSTEM COMMAND: PULSE ---
export async function logPulse(eventType: string, message: string) {
  await supabase.from('pulse_log').insert([{ event_type: eventType, message }]);
  revalidatePath('/dashboard');
}

// --- OPERATIONS: WAITLIST ---
export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = formData.get('source') as string || 'Workshop';
  if (!email) return { error: 'Email is required', success: false };

  const { error } = await supabase.from('waitlist').insert([{ email, source, status: 'PENDING' }]);
  if (error) return { error: error.message, success: false };

  await logPulse('BETA_REQUEST', `New request from ${email}`);
  revalidatePath('/dashboard');
  return { success: true };
}

// --- STUDIO: BROADCAST ---
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

// --- NEW DATA FETCHERS FOR THE DASHBOARD ---

export async function getActiveDirectives() {
  const { data, error } = await supabase
    .from('ideas_ledger')
    .select('*')
    // We only want to see things that are actively being worked on
    .eq('status', 'IN_PROGRESS') 
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Fetch Error (Directives):', error);
    return [];
  }
  return data;
}

export async function getActiveProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Fetch Error (Projects):', error);
    return [];
  }
  return data;
}