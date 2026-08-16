/* src/app/portal/[clientId]/page.tsx */
import React from 'react';
import DashboardModule from '@/components/portal/dashboard/DashboardModule';

export default async function ClientDashboardHome({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;

  return (
    <>
      {/* 🚀 GLOBAL WATERMARK: Fixed to the background so it stays centered when scrolling */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-5">
        <img 
          src="/logo.png" 
          alt="Alternative Solutions Watermark" 
          className="w-100 h-100 md:w-150 md:h-150 object-contain grayscale" 
        />
      </div>

      {/* Core Dashboard Content */}
      <div className="relative z-10 w-full h-full">
        <DashboardModule clientId={clientId} />
      </div>
    </>
  );
}