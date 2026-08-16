/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';

export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  // 🚀 FIXED: We completely removed the local watermark block from here!
  // It now relies 100% on the one we put in the layout.tsx file.
  return <DashboardModule clientId={clientId} />;
}