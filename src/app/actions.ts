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
    // If the email is already in the database, this is a success for "Resume Access"
    if (error.code === '23505') {
      return { success: true, isNew: false };
    }
    console.error("CRITICAL: Waitlist Join Failure", error);
    return { error: 'Failed to join the waitlist. Please try again.', success: false };
  }

  // Successfully added a brand new email
  return { success: true, isNew: true };
}

/**
 * STRATEGIC BUILD PLANNER
 * Securely injects new directives (Features, Infra, Bugs) into the Ideas Ledger.
 */
export async function logIdeaDirective(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const priority = formData.get('priority') as string;
  const phasesRaw = formData.get('phases') as string;
  const scheduledDate = formData.get('scheduled_date') as string;

  // TITANIUM ARMOR: Validate Title
  if (!title) return { success: false, error: 'TITLE_REQUIRED' };

  // Parse structured phases
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
      // If no date provided, database defaults to NOW()
      scheduled_date: scheduledDate || new Date().toISOString()
    }]);

  if (error) {
    console.error("CRITICAL: Directive Logging Failure", error);
    return { success: false };
  }

  revalidatePath('/dashboard/tasks');
  return { success: true };
}

/**
 * BROADCAST HUB: MEDIA MANAGEMENT
 * Handles metadata updates for podcast episodes.
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
 * Switches episodes between ACTIVE and INACTIVE states.
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
 * Permanently removes an episode entry from the system.
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