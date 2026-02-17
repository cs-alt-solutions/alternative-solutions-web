/* src/app/actions.ts */
'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';
import { ACTION_MESSAGES } from '@/utils/glossary';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  
  // STRICT TYPING: Only accepts our defined pathways. 
  const source = (formData.get('source') as string) || 'Shift Studio';

  if (!email) {
    return { error: ACTION_MESSAGES.WAITLIST.ERRORS.EMAIL_REQUIRED };
  }

  // 1. Push to our live Supabase database
  const { error } = await supabase
    .from('waitlist')
    .insert([
      { 
        email, 
        source, 
        status: 'Pending' 
      }
    ]);

  // 2. Error Handling & Glossary Routing
  if (error) {
    console.error("Database Error:", error.message);
    
    // Postgres unique constraint violation (User already applied)
    if (error.code === '23505') {
      return { error: ACTION_MESSAGES.WAITLIST.ERRORS.EMAIL_DUPLICATE };
    }
    
    // Catch-all failure
    return { error: ACTION_MESSAGES.WAITLIST.ERRORS.GENERIC_FAIL };
  }

  // 3. Command Next.js to refresh the dashboard instantly
  revalidatePath('/dashboard/waitlist');

  return { success: true };
}