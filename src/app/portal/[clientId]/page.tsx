/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';
import BrainDump from '@/components/portal/onboarding/BrainDump';
import { hasPortalAccess } from '@/config/lifecycle';

export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from('storefronts')
    .select('status, contact_email')
    .eq('id', clientId)
    .single();

  if (!store) {
    redirect('/portal');
  }

  // 🚀 THE INTERCEPT: If they haven't paid yet, force them into the Brain Dump
  if (store.status === 'AWAITING_PAYMENT') {
    return <BrainDump clientId={clientId} contactEmail={store.contact_email} />;
  }

  if (!hasPortalAccess(store.status)) {
    redirect('/portal');
  }

  return <DashboardModule clientId={clientId} />;
}