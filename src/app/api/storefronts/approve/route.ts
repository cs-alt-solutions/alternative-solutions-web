// src/app/api/storefronts/approve/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { sendCheckoutEmail } from '@/app/actions/emails';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storefrontId = searchParams.get('id');

  if (!storefrontId) {
    return NextResponse.json({ error: 'Missing storefront ID' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // 1. Fetch the storefront to get client details
    const { data: store, error: fetchError } = await supabase
      .from('storefronts')
      .select('*')
      .eq('id', storefrontId)
      .single();

    if (fetchError || !store) throw new Error("Storefront not found");

    // 2. Change the status to APPROVED
    await supabase
      .from('storefronts')
      .update({ status: 'APPROVED' })
      .eq('id', storefrontId);

    // 3. Generate the Stripe Checkout Link
    const checkoutResponse = await createStorefrontCheckout(store.id, store.contact_email || '');
    
    if (checkoutResponse.url) {
       // 4. Send the Subscription Activation Email
       await sendCheckoutEmail(
           store.contact_email, 
           store.client_name || 'Client', 
           store.business_name || 'Storefront',
           checkoutResponse.url
       );

       // 5. BOOM: Instantly redirect the client directly to the Stripe Payment page!
       return NextResponse.redirect(checkoutResponse.url);
    } else {
       throw new Error("Failed to generate Stripe link");
    }

  } catch (error) {
    console.error("Approval Automation Failed:", error);
    // If something fails, redirect them to a safe fallback page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/portal?error=approval_failed`);
  }
}