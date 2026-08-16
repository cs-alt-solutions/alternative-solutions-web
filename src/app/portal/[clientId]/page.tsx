/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';

export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return <DashboardModule clientId={clientId} />;
}