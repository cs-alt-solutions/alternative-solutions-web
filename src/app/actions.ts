/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

/**
 * BETA COMMAND: WAITLIST
 */
export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = formData.get('source') as string || 'Unknown';
  if (!email) return { error: 'Email is required', success: false };

  const { error } = await supabase
    .from('waitlist') 
    .insert([{ email, source, status: 'PENDING' }]);

  if (error) {
    if (error.code === '23505') return { success: true, isNew: false };
    return { error: 'Failed to join.', success: false };
  }
  revalidatePath('/dashboard/waitlist');
  return { success: true, isNew: true };
}

/**
 * BROADCAST HUB: PUBLISH AUDIO LOG
 */
export async function publishAudioLog(formData: FormData) {
  const file = formData.get('audioFile') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const duration = formData.get('duration') as string;

  if (!file) return { success: false, error: 'NO_FILE' };

  const fileName = `${Date.now()}-${file.name}`;
  const { error: storageError } = await supabase.storage
    .from('workshop_media')
    .upload(`episodes/${fileName}`, file);

  if (storageError) return { success: false, error: storageError.message };

  const { data: { publicUrl } } = supabase.storage
    .from('workshop_media')
    .getPublicUrl(`episodes/${fileName}`);

  const { error: dbError } = await supabase
    .from('audio_logs')
    .insert([{
      title,
      description,
      category,
      duration,
      audio_url: publicUrl,
      status: 'ACTIVE'
    }]);

  if (dbError) return { success: false, error: dbError.message };

  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

/**
 * BROADCAST HUB: MEDIA INTERCEPTOR (FIXED MISSING EXPORT)
 */
export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'NO_FILE' };

  const fileName = `${Date.now()}-${file.name}`;
  const { error: storageError } = await supabase.storage
    .from('workshop_media')
    .upload(`transmissions/${fileName}`, file);

  if (storageError) return { success: false, error: storageError.message };

  const { data: { publicUrl } } = supabase.storage
    .from('workshop_media')
    .getPublicUrl(`transmissions/${fileName}`);

  return { success: true, url: publicUrl };
}

/**
 * BROADCAST HUB: CREATE TEXT TRANSMISSION
 */
export async function createTextBroadcast(formData: FormData) {
  const content = formData.get('description') as string;
  if (!content) return { success: false, error: 'NO_CONTENT' };

  const { error } = await supabase
    .from('transmissions')
    .insert([{ content }]);

  if (error) return { success: false };

  revalidatePath('/dashboard/tasks');
  return { success: true };
}

/**
 * STRATEGIC BUILD PLANNER: LOG DIRECTIVE
 */
export async function logIdeaDirective(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  if (!title) return { success: false, error: 'TITLE_REQUIRED' };

  const { error } = await supabase
    .from('ideas_ledger')
    .insert([{ title, description, status: 'BACKLOG' }]);

  if (error) return { success: false };

  revalidatePath('/dashboard/tasks');
  return { success: true };
}