'use server';

import { createClient } from '@/utils/supabase/server'; 
import { redirect } from 'next/navigation';

export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: 'Invalid credentials. Access denied.' };
  }
  redirect('/dashboard');
}