/* src/app/portal/[clientId]/prototypes/page.tsx */
import React from 'react';
import DeveloperToolsModule from '@/components/portal/developer-tools/DeveloperToolsModule';

export default async function DeveloperToolsPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto">
      <DeveloperToolsModule clientId={clientId} />
    </div>
  );
}