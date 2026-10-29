/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';
import BrainDump from '@/components/portal/onboarding/BrainDump';
import { hasPortalAccess } from '@/config/lifecycle';

export const dynamic = 'force-dynamic';

export default async function ClientDashboardHome({ 
  params,
  searchParams
}: { 
  params: Promise<{ clientId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { clientId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('storefronts')
    .select('status, contact_email')
    .eq('id', clientId)
    .single();

  if (!store) {
    redirect('/portal');
  }

  let currentStatus = store.status;

  const isReturningFromStripe = 
    resolvedSearchParams?.payment === 'success' || 
    Boolean(resolvedSearchParams?.session_id);

  // Auto-promote to PENDING_BUILD after checkout to skip the BrainDump loop
  if (currentStatus === 'ONBOARDING' && isReturningFromStripe) {
    try {
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string
      );
      await supabaseAdmin
        .from('storefronts')
        .update({ status: 'PENDING_BUILD' })
        .eq('id', clientId);

      currentStatus = 'PENDING_BUILD';
    } catch (err) {
      console.error('Failed to auto-promote storefront status after checkout:', err);
    }
  }

  // 🚀 THE INTERCEPT: Force them into Brain Dump during ONBOARDING
  if (currentStatus === 'ONBOARDING') {
    return <BrainDump clientId={clientId} contactEmail={store.contact_email} />;
  }

  if (!hasPortalAccess(currentStatus)) {
    redirect('/portal');
  }

  return <DashboardModule clientId={clientId} />;
}