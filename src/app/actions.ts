/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

/**
 * BETA COMMAND: WAITLIST
 * Handles new beta access requests from the public site.
 */
export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = formData.get('source') as string || 'Unknown';

  if (!email) {
    return { error: 'Email is required' };
  }

  // Attempt to insert into the Supabase waitlist table
  const { error } = await supabase
    .from('waitlist') 
    .insert([
      { 
        email, 
        source, 
        status: 'PENDING' 
      }
    ]);

  if (error) {
    if (error.code === '23505') {
      return { success: true, isNew: false };
    }
    console.error("CRITICAL: Waitlist Join Failure", error);
    return { error: 'Failed to join the waitlist. Please try again.', success: false };
  }

  return { success: true, isNew: true };
}

/**
 * STRATEGIC BUILD PLANNER
 * Securely injects new directives (Features, Infra, Bugs) into the Ideas Ledger or Active Flow.
 */
export async function logIdeaDirective(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const priority = formData.get('priority') as string;
  const phasesRaw = formData.get('phases') as string;
  const scheduledDate = formData.get('scheduled_date') as string;

  if (!title) return { success: false, error: 'TITLE_REQUIRED' };

  let phases = [];
  try {
    phases = JSON.parse(phasesRaw || '[]');
  } catch (e) {
    phases = [];
  }

  const { error } = await supabase
    .from('ideas_ledger')
    .insert([{ 
      title, 
      description, 
      type: type || 'FEATURE', 
      priority: priority || 'LOW',
      status: 'BACKLOG',
      phases: phases,
      scheduled_date: scheduledDate ? scheduledDate : null 
    }]);

  if (error) {
    console.error("CRITICAL: Directive Logging Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/tasks');
  return { success: true };
}

/**
 * STRATEGIC BUILD PLANNER: TOGGLE TASK STATUS
 * Toggles a directive between DONE and BACKLOG.
 */
export async function toggleDirectiveStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const targetStatus = formData.get('targetStatus') as string;
  
  const { error } = await supabase
    .from('ideas_ledger')
    .update({ status: targetStatus })
    .eq('id', id);

  if (error) {
    console.error("CRITICAL: Directive Status Update Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/tasks');
  return { success: true };
}

/**
 * STRATEGIC BUILD PLANNER: TRIAGE / RESCHEDULE
 * Pushes an unfinished task to Today, or sends it back to the Ledger.
 */
export async function rescheduleDirective(formData: FormData) {
  const id = formData.get('id') as string;
  const target = formData.get('target') as string; 
  
  const newDate = target === 'TODAY' ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('ideas_ledger')
    .update({ scheduled_date: newDate })
    .eq('id', id);

  if (error) {
    console.error("CRITICAL: Directive Triage Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/tasks');
  return { success: true };
}

/**
 * BROADCAST HUB: CREATE TEXT TRANSMISSION
 * Saves a daily mindset or debrief directly to the broadcast feed.
 */
export async function createTextBroadcast(formData: FormData) {
  const description = formData.get('description') as string;

  if (!description) return { success: false, error: 'NO_CONTENT' };

  // Auto-generate a clean, standard title based on today's date
  const title = `Transmission // ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const { error } = await supabase
    .from('audio_logs')
    .insert([{ 
      title, 
      description, 
      category: 'MINDSET', 
      status: 'ACTIVE' 
    }]);

  if (error) {
    console.error("CRITICAL: Transmission Broadcast Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/tasks');
  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

/**
 * BROADCAST HUB: MEDIA MANAGEMENT
 */
export async function updateAudioLog(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  const { error } = await supabase
    .from('audio_logs')
    .update({ title, description, category })
    .eq('id', id);

  if (error) {
    console.error("CRITICAL: Audio Log Update Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

/**
 * BROADCAST HUB: VISIBILITY TOGGLE
 */
export async function toggleAudioLogStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const currentStatus = formData.get('currentStatus') as string;
  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  const { error } = await supabase
    .from('audio_logs')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error("CRITICAL: Visibility Toggle Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

/**
 * BROADCAST HUB: ARCHIVE
 */
export async function archiveAudioLog(formData: FormData) {
  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('audio_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("CRITICAL: Audio Archive Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/broadcast');
  return { success: true };
}
/**
 * BROADCAST HUB: MEDIA INTERCEPTOR
 * Catches pasted screenshots and routes them directly to Supabase Storage.
 */
export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'NO_FILE' };
  }

  // Generate a unique, clean filename
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `transmissions/${fileName}`;

  // Fire to the 'workshop_media' bucket
  const { error } = await supabase.storage
    .from('workshop_media')
    .upload(filePath, file);

  if (error) {
    console.error("CRITICAL: Media Upload Failure", error);
    return { success: false };
  }

  // Grab the public URL so we can render it in the feed
  const { data: publicUrlData } = supabase.storage
    .from('workshop_media')
    .getPublicUrl(filePath);

  return { success: true, url: publicUrlData.publicUrl };
}