// src/app/api/storefronts/approve/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { sendCheckoutEmail } from '@/app/actions/emails';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storefrontIdentifier = searchParams.get('id');

  if (!storefrontIdentifier) {
    return NextResponse.json({ error: 'Missing storefront identifier' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // 1. Bulletproof UUID vs Slug Check
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storefrontIdentifier);
    const queryColumn = isUUID ? 'id' : 'slug';

    // 2. Fetch the storefront to get client details
    const { data: store, error: fetchError } = await supabase
      .from('storefronts')
      .select('*')
      .eq(queryColumn, storefrontIdentifier)
      .single();

    if (fetchError || !store) throw new Error("Storefront not found in database");

    // 3. Change the status to APPROVED
    await supabase
      .from('storefronts')
      .update({ status: 'APPROVED' })
      .eq('id', store.id);

    // 4. Generate the Stripe Checkout Link
    const checkoutResponse = await createStorefrontCheckout(store.id, store.contact_email || '');
    
    if (checkoutResponse.url) {
       // 5. Send the Subscription Activation Email
       await sendCheckoutEmail(
           store.contact_email, 
           store.client_name || 'Client', 
           store.business_name || 'Storefront',
           checkoutResponse.url
       );

       // 6. BOOM: Bulletproof standard browser redirect
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