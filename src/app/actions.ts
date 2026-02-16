/* src/app/actions.ts */
'use server';

import { MOCK_DB, WaitlistEntry } from '@/data/store';
import { revalidatePath } from 'next/cache';

export async function joinWaitlist(formData: FormData) {
  const email = formData.get('email') as string;
  const source = (formData.get('source') as 'Home' | 'Shift Studio') || 'Home';

  if (!email) {
    return { error: 'Email is required' };
  }

  // 1. Construct the new lead entry
  const newEntry: WaitlistEntry = {
    id: `w-${Date.now()}`,
    email,
    date: new Date().toISOString().split('T')[0], // Formats as YYYY-MM-DD
    status: 'Pending',
    source,
  };

  // 2. Push to our database (currently MOCK_DB, eventually Postgres/Firebase)
  MOCK_DB.waitlist.unshift(newEntry); // unshift puts the newest lead at the top

  // 3. Command Next.js to refresh the dashboard instantly
  revalidatePath('/dashboard/waitlist');

  return { success: true };
}