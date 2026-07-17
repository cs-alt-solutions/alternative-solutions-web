'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; 

export async function logPulse(eventType: string, message: string) {
  const supabase = await createClient();
  await supabase.from('pulse_log').insert([{ event_type: eventType, message }]);
  revalidatePath('/dashboard');
}