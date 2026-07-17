'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; 
import { Resend } from 'resend';
import { logPulse } from './pulse';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hello@alternativesolutions.io';

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

    const { error: resendError } = await resend.emails.send({
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

export async function publishAudioLog(formData: FormData) {
  const file = formData.get('audioFile') as File;
  const title = formData.get('title') as string;

  if (!file) return { success: false, error: 'NO_FILE' };
  const fileName = `${Date.now()}-${file.name}`;

  const supabase = await createClient();

  const { error: storageError } = await supabase.storage
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

export { logPulse };
