/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';
import { ACTION_MESSAGES } from '@/utils/glossary';

// --- WAITLIST PIPELINE ---
export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = (formData.get('source') as string) || 'Shift Studio';

  if (!email) {
    return { error: ACTION_MESSAGES.WAITLIST.ERRORS.EMAIL_REQUIRED };
  }

  const { error } = await supabase
    .from('waitlist')
    .insert([{ email, source, status: 'Pending' }]);

  if (error) {
    console.error("Database Error:", error.message);
    if (error.code === '23505') {
      return { error: ACTION_MESSAGES.WAITLIST.ERRORS.EMAIL_DUPLICATE };
    }
    return { error: ACTION_MESSAGES.WAITLIST.ERRORS.GENERIC_FAIL };
  }

  revalidatePath('/dashboard/waitlist');
  return { success: true };
}

// --- AUDIO BROADCAST PIPELINES ---
export async function publishAudioLog(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const duration = formData.get('duration') as string;
  const category = (formData.get('category') as string) || 'PUBLIC';
  const audioFile = formData.get('audioFile') as File | null;

  if (!title || !description || !duration || !audioFile) {
    return { error: 'Missing required fields or audio file.' }; 
  }

  try {
    const fileExt = audioFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('audio-logs')
      .upload(fileName, buffer, {
          contentType: audioFile.type,
          cacheControl: '3600',
          upsert: false
      });

    if (uploadError) {
      console.error("Storage Error:", uploadError.message);
      return { error: 'Failed to upload audio file to server.' };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('audio-logs')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('audio_logs')
      .insert([{ 
        title, 
        description, 
        duration, 
        category, 
        audio_url: publicUrl, 
        status: 'ACTIVE' 
      }]);

    if (dbError) {
      console.error("Database Error:", dbError.message);
      return { error: 'Failed to broadcast transmission.' };
    }

    revalidatePath('/');
    revalidatePath('/shift-studio');
    revalidatePath('/dashboard/broadcast');
    return { success: true };

  } catch (err) {
    console.error("Unexpected pipeline failure:", err);
    return { error: 'CRITICAL: Transmission pipeline failure.' };
  }
}

export async function updateAudioLog(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  if (!id || !title || !description) return { error: 'Missing required fields' };

  const { error } = await supabase
    .from('audio_logs')
    .update({ title, description, category })
    .eq('id', id);

  if (error) {
    console.error("Update Error:", error.message);
    return { error: 'Failed to update transmission' };
  }

  revalidatePath('/');
  revalidatePath('/shift-studio');
  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

export async function toggleAudioLogStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const currentStatus = formData.get('currentStatus') as string;

  if (!id || !currentStatus) return { error: 'Missing log data' };

  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  const { error } = await supabase
    .from('audio_logs')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error("Toggle Error:", error.message);
    return { error: 'Failed to update visibility' };
  }

  revalidatePath('/');
  revalidatePath('/shift-studio');
  revalidatePath('/dashboard/broadcast');
  return { success: true };
}

export async function archiveAudioLog(formData: FormData) {
  const id = formData.get('id') as string;

  if (!id) return { error: 'Missing log ID' };

  const { error } = await supabase
    .from('audio_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Archive Error:", error.message);
    return { error: 'Failed to archive transmission' };
  }

  revalidatePath('/');
  revalidatePath('/shift-studio');
  revalidatePath('/dashboard/broadcast');
  return { success: true };
}