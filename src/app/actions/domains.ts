// src/app/actions/domains.ts
'use server';

export async function addCustomDomainToVercel(domain: string) {
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

    return { success: true, data };
  } catch (error: any) {
    console.error("Vercel Domain Pipeline Error:", error);
    return { success: false, error: error.message };
  }
}