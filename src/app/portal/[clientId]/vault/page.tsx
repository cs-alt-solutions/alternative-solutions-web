/* src/app/portal/[clientId]/vault/page.tsx */
import React from 'react';
import MediaVaultModule from '@/components/portal/media-vault/MediaVaultModule';

export default async function MediaVaultPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  return <MediaVaultModule clientId={clientId} />;
}