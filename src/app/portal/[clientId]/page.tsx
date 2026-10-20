/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';
import { hasPortalAccess } from '@/config/lifecycle';

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

  // 🚀 THE FIX: If they don't have portal access based on our central config, kick them out
  if (!store || !hasPortalAccess(store.status)) {
    redirect('/portal');
  }

  return <DashboardModule clientId={clientId} />;
}