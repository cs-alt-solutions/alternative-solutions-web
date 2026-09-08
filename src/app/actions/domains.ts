// src/app/actions/domains.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function addCustomDomainToVercel(clientId: string, domain: string) {
  try {
    // 1. Validate environment variables
    const projectId = process.env.VERCEL_PROJECT_ID;
    const authToken = process.env.VERCEL_AUTH_TOKEN;

    if (!projectId || !authToken) {
      throw new Error("Missing Vercel API credentials in environment variables.");
    }

    // 2. Format the domain to strip any https:// or trailing slashes
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();

    // 3. Command Vercel to attach the domain
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${projectId}/domains`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: cleanDomain }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to attach domain to Vercel network.");
    }

    // 4. If Vercel succeeds, lock it into the client's Supabase record
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from('storefronts')
      .update({ custom_domain: cleanDomain })
      .eq('id', clientId);

    if (dbError) {
      throw new Error("Domain attached to network, but failed to save to database.");
    }

    return { success: true, data: cleanDomain };
  } catch (error: any) {
    console.error("Vercel Domain Pipeline Error:", error);
    return { success: false, error: error.message };
  }
}