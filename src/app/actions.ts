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

  if (!email) {
    return { error: 'Email is required', success: false };
  }

  const { error } = await supabase
    .from('waitlist') 
    .insert([{ email, source, status: 'PENDING' }]);

  if (error) {
    if (error.code === '23505') return { success: true, isNew: false };
    console.error("CRITICAL: Waitlist Join Failure", error);
    return { error: 'Failed to join the waitlist. Please try again.', success: false };
  }

  return { success: true, isNew: true };
}

/**
 * STRATEGIC BUILD PLANNER
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
  try { phases = JSON.parse(phasesRaw || '[]'); } catch (e) { phases = []; }

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
 * BROADCAST HUB: CREATE TEXT TRANSMISSION (LAZY INIT)
 * If an episode for the current week doesn't exist, it creates it instantly.
 */
export async function createTextBroadcast(formData: FormData) {
  const content = formData.get('description') as string;
  if (!content) return { success: false, error: 'NO_CONTENT' };

  // 1. Calculate the current week's Monday
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const currentWeekTitle = `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  // 2. Check if this week's draft already exists
  const { data: existingDrafts } = await supabase
    .from('audio_logs')
    .select('id')
    .eq('title', currentWeekTitle)
    .limit(1);

  let activeDraftId;

  // 3. LAZY CREATION: If it doesn't exist, build it silently.
  if (!existingDrafts || existingDrafts.length === 0) {
    const { data: newDraft, error: createError } = await supabase
      .from('audio_logs')
      .insert([{ 
        title: currentWeekTitle, 
        description: 'Auto-Generated Weekly Log', 
        category: 'BUILD', 
        status: 'DRAFT',
        duration: '00:00',
        audio_url: '' 
      }])
      .select('id');
      
    if (createError) {
      console.error("CRITICAL: Lazy Episode Creation Failed", createError);
      return { success: false };
    }
    activeDraftId = newDraft[0].id;
  } else {
    activeDraftId = existingDrafts[0].id;
  }

  // 4. Attach the transmission
  const { error } = await supabase
    .from('transmissions')
    .insert([{ episode_id: activeDraftId, content }]);

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
 */
export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) return { success: false, error: 'NO_FILE' };

  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `transmissions/${fileName}`;

  const { error } = await supabase.storage
    .from('workshop_media')
    .upload(filePath, file);

  if (error) {
    console.error("CRITICAL: Media Upload Failure", error);
    return { success: false, message: error.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from('workshop_media')
    .getPublicUrl(filePath);

  return { success: true, url: publicUrlData.publicUrl };
}
/**
 * BROADCAST HUB: PUBLISH AUDIO LOG
 * Handles the full sequence: Storage Upload -> Database Entry
 */
export async function publishAudioLog(formData: FormData) {
  const file = formData.get('audioFile') as File;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const duration = formData.get('duration') as string;

  if (!file) return { success: false, error: 'NO_FILE_PROVIDED' };

  // 1. Upload to Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `episodes/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('workshop_media')
    .upload(filePath, file);

  if (uploadError) {
    console.error("CRITICAL: Audio Upload Failure", uploadError);
    return { success: false, error: 'UPLOAD_FAILED' };
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('workshop_media')
    .getPublicUrl(filePath);

  // 3. Create Database Entry
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

  if (dbError) {
    console.error("CRITICAL: DB Entry Failure", dbError);
    return { success: false, error: 'DATABASE_ERROR' };
  }

  revalidatePath('/dashboard/broadcast');
  revalidatePath('/dashboard/tasks');
  return { success: true };
}