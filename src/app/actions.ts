"use server";

import { WEBSITE_COPY } from '@/utils/glossary';
import { revalidatePath } from 'next/cache';

/**
 * Lead Capture Engine
 * This action handles waitlist submissions and ensures the dashboard
 * stays in sync without a manual refresh.
 */
export async function joinWaitlist(email: string) {
  const { API } = WEBSITE_COPY;

  // Validation Check
  if (!email || !email.includes('@')) {
    return { success: false, message: API.WAITLIST.ERR_INVALID };
  }

  try {
    // PIPELINE LOGIC:
    // Once Supabase is ready, we'll insert this directly into our 'waitlist' table.
    // For now, we log the lead to the server console and trigger a UI update.
    console.log(`>>> LEAD CAPTURED: ${email} | Timestamp: ${new Date().toISOString()}`);

    // This tells Next.js to dump the old cache of the dashboard
    // so the next time you look at it, it's fresh.
    revalidatePath('/dashboard/waitlist');

    return { 
      success: true, 
      message: API.WAITLIST.SUCCESS 
    };
  } catch (error) {
    console.error('Waitlist Pipe Failure:', error);
    return { 
      success: false, 
      message: API.WAITLIST.ERR_SERVER 
    };
  }
}