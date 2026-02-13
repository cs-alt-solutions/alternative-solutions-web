"use server";

import { WEBSITE_COPY } from '@/utils/glossary';
import { revalidatePath } from 'next/cache';
import { MOCK_DB } from '@/data/store';

export async function joinWaitlist(email: string) {
  const { API } = WEBSITE_COPY;

  // 1. Basic Validation
  if (!email || !email.includes('@')) {
    return { success: false, message: API.WAITLIST.ERR_INVALID };
  }

  try {
    // 2. Duplicate Check
    // We check the existing waitlist in the MOCK_DB for a matching email.
    const isDuplicate = MOCK_DB.waitlist.some(
      (entry) => entry.email.toLowerCase() === email.toLowerCase()
    );

    if (isDuplicate) {
      return { 
        success: false, 
        message: API.WAITLIST.ERR_DUPLICATE // "Already on the list."
      };
    }

    // 3. Data Persistence
    MOCK_DB.waitlist.push({
      id: `w${MOCK_DB.waitlist.length + 1}`,
      email: email,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      source: 'Home'
    });

    console.log(`>>> LEAD STORED: ${email}`);

    // Refresh the dashboard data
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