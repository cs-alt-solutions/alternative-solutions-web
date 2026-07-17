'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'; 
import { logPulse } from './pulse';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = formData.get('source') as string || 'Workshop';
  
  if (!email) {
    return { success: false, error: 'Email is required', isNew: false };
  }

  try {
    const supabase = await createClient();
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

export async function toggleAnonymity(id: string, currentDisplayName: string, originalName: string | null) {
  const supabase = await createClient();
  const newName = currentDisplayName === 'Anonymous' ? (originalName || 'Anonymous Builder') : 'Anonymous';
  const { error } = await supabase.from('supporters').update({ display_name: newName }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/dashboard/foundation');
  revalidatePath('/blueprint');
  return { success: true };
}