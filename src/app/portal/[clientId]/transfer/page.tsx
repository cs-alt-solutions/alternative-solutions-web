/* src/app/portal/[clientId]/transfer/page.tsx */
import React from 'react';
import SecureTransfer from '@/components/portal/secure-transfer/SecureTransfer';

export default async function TransferPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return <SecureTransfer clientId={clientId} />;
}