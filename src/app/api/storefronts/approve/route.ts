// src/app/api/storefronts/approve/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { sendCheckoutEmail } from '@/app/actions/emails';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storefrontIdentifier = searchParams.get('id');

  if (!storefrontIdentifier) {
    return NextResponse.json({ error: 'Missing storefront identifier' }, { status: 400 });
  }

  try {
    // 🚨 THE FIX: Use Admin Client. The client clicking this from an email is unauthenticated!
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Bulletproof UUID vs Slug Check
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storefrontIdentifier);
    const queryColumn = isUUID ? 'id' : 'slug';

    // 2. Fetch the storefront to get client details & audit notes
    const { data: store, error: fetchError } = await supabaseAdmin
      .from('storefronts')
      .select('*')
      .eq(queryColumn, storefrontIdentifier)
      .single();

    if (fetchError || !store) throw new Error("Storefront not found in database");

    // 3. Append to the Audit Ledger
    const approvalLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      author: "CLIENT",
      type: "APPROVED",
      message: "Client verified architecture. Build locked and approved."
    };

    const updatedLogs = [...(store.audit_notes || []), approvalLog];

    // 4. Change status to APPROVED & save ledger using Admin Client
    await supabaseAdmin
      .from('storefronts')
      .update({ 
        status: 'APPROVED',
        audit_notes: updatedLogs
      })
      .eq('id', store.id);

    // 5. Generate the Stripe Checkout Link
    const checkoutResponse = await createStorefrontCheckout(store.id, store.contact_email || '');
    
    if (checkoutResponse.url) {
       // 6. Send the Subscription Activation Email
       await sendCheckoutEmail(
           store.contact_email,
           store.client_name || 'Client',
           store.business_name || 'Storefront',
           checkoutResponse.url
       );

       // 7. BOOM: Standard browser redirect to Stripe
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