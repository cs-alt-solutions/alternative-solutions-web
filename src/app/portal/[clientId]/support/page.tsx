/* src/app/portal/[clientId]/support/page.tsx */
import React from 'react';
import SupportModule from '@/components/portal/support/SupportModule';

export default async function SupportPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto">
      <SupportModule clientId={clientId} />
    </div>
  );
}