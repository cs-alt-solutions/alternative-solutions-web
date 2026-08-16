/* src/app/portal/[clientId]/settings/page.tsx */
import React from 'react';
import SettingsModule from '@/components/portal/settings/SettingsModule';

export default async function SettingsPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto">
      <SettingsModule clientId={clientId} />
    </div>
  );
}