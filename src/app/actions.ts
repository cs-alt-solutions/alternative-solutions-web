"use server";

import { WEBSITE_COPY } from '@/utils/glossary';
import { revalidatePath } from 'next/cache';
import { MOCK_DB } from '@/data/store'; // We need to import the bucket!

export async function joinWaitlist(email: string) {
  const { API } = WEBSITE_COPY;

  if (!email || !email.includes('@')) {
    return { success: false, message: API.WAITLIST.ERR_INVALID };
  }

  try {
    // ACTUAL DATA PUSH
    // We're pushing a new entry into our mock data array
    MOCK_DB.waitlist.push({
      id: `w${MOCK_DB.waitlist.length + 1}`,
      email: email,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      source: 'Home'
    });

    console.log(`>>> LEAD STORED: ${email}`);

    // This triggers the dashboard to fetch the updated MOCK_DB
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