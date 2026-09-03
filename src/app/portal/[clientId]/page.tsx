/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';

export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  // THE BOUNCER: Check if they actually have an active subscription
  const { data: store } = await supabase
    .from('storefronts')
    .select('status')
    .eq('id', clientId)
    .single();

  // If they are BUILDING, IN_REVIEW, or somehow bypassed the main gate, kick them out
  if (!store || (store.status !== 'ACTIVE' && store.status !== 'LIVE')) {
    redirect('/portal');
  }

  return <DashboardModule clientId={clientId} />;
}