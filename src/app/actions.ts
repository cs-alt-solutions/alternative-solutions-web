/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';
import { ACTION_MESSAGES } from '@/utils/glossary';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = (formData.get('source') as string) || 'Restricted Access';
  const name = formData.get('name') as string | null;
  const phone = formData.get('phone') as string | null;
  const sms_consent = formData.get('sms_consent') === 'on'; 

  if (!email) return { error: ACTION_MESSAGES.WAITLIST.ERRORS.EMAIL_REQUIRED };

  // 1. CHECK IF USER EXISTS
  const { data: existingUser } = await supabase
    .from('waitlist')
    .select('email, name')
    .eq('email', email)
    .single();

  // 2. RETURNING USER LOGIC
  if (existingUser) {
    // If they have a name, they are officially "in"
    if (existingUser.name) {
      return { success: true, returning: true };
    }
    // If they exist but name is missing, update them (Auto-Complete)
    if (name) {
      await supabase.from('waitlist').update({ name, phone, sms_consent }).eq('email', email);
      return { success: true };
    }
  }

  // 3. NEW USER / AUTO-SIGNUP LOGIC
  const payload: any = { 
    email, 
    source, 
    status: 'Pending',
    date: new Date().toISOString(),
    name: name || 'New Access Request', // Default name if they skipped via return button
    phone,
    sms_consent
  };

  const { error } = await supabase.from('waitlist').insert([payload]);

  if (error) {
    console.error("Database Error:", error.message);
    return { error: ACTION_MESSAGES.WAITLIST.ERRORS.GENERIC_FAIL };
  }

  revalidatePath('/dashboard/waitlist');
  return { success: true, isNew: !existingUser && !name };
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