// src/app/api/storefronts/approve/route.ts
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createStorefrontCheckout } from '@/app/actions/billing';

// 🚨 CRITICAL: Must be 'export async function GET', absolutely NO 'default' keyword!
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const storefrontIdentifier = searchParams.get('id');

  if (!storefrontIdentifier) {
    return new Response(JSON.stringify({ error: 'Missing storefront identifier' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 🚨 THE FIX: Use Admin Client. The client clicking this is public/unauthenticated!
    // If we use standard cookies, Supabase RLS will block the database update.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Bulletproof UUID vs Slug Check
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storefrontIdentifier);
    const queryColumn = isUUID ? 'id' : 'slug';

    // 2. Fetch the storefront to get client details
    const { data: store, error: fetchError } = await supabaseAdmin
      .from('storefronts')
      .select('*')
      .eq(queryColumn, storefrontIdentifier)
      .single();

    if (fetchError || !store) throw new Error("Storefront not found in database");

    // 3. Change the status to APPROVED and append to the Audit Ledger
    const approvalLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      author: "CLIENT",
      type: "APPROVED",
      message: "Client verified architecture. Build locked and approved."
    };

    const updatedLogs = [...(store.audit_notes || []), approvalLog];

    await supabaseAdmin
      .from('storefronts')
      .update({ 
        status: 'APPROVED',
        audit_notes: updatedLogs 
      })
      .eq('id', store.id);

    // 🚨 THE STRIPE FIX: Stripe will crash if you send an empty string or 'No email provided'
    const safeEmail = store.contact_email && store.contact_email.includes('@') 
      ? store.contact_email 
      : undefined;

    // 4. Generate the Stripe Checkout Link
    const checkoutResponse = await createStorefrontCheckout(store.id, safeEmail as string);
    
    if (checkoutResponse.url) {
       // 5. EMAIL SILENCED: We bypass Resend here so they don't get redundant emails
       // 6. BOOM: Bulletproof standard browser redirect to Stripe
       return new Response(null, {
         status: 302,
         headers: {
           Location: checkoutResponse.url,
         },
       });
    } else {
       throw new Error("Failed to generate Stripe link");
    }

  } catch (error) {
    console.error("Approval Automation Failed:", error);
    
    // If something fails, safely route them back to your main site with an error flag
    const fallbackUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/dashboard?error=approval_failed'
      : 'https://alternativesolutions.io?error=approval_failed';
      
    return new Response(null, {
      status: 302,
      headers: {
        Location: fallbackUrl,
      },
    });
  }
}