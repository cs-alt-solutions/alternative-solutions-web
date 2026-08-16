/* src/app/portal/[clientId]/billing/page.tsx */
import React from 'react';
import BillingModule from '@/components/portal/billing-plans/BillingModule';

export default async function BillingPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return <BillingModule clientId={clientId} />;
}