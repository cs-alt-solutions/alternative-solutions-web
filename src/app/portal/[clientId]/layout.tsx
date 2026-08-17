/* src/app/portal/[clientId]/layout.tsx */
'use client';

import { usePathname } from 'next/navigation';
import PortalSidebar from '@/components/portal/core/PortalSidebar';
import PortalHeader from '@/components/portal/core/PortalHeader';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract clientId from the URL (e.g., /portal/luckystrike -> luckystrike)
  const segments = pathname.split('/');
  const clientId = segments[2] || 'unknown';

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] overflow-hidden relative">
      
      {/* 🚀 GLOBAL WATERMARK: Massive scale so it peeks out around the cards */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.07]">
        <img 
          src="/logo.png" 
          alt="Alternative Solutions Watermark" 
          className="w-150 h-150 md:w-250 md:h-250 object-contain grayscale max-w-none" 
        />
      </div>

      {/* The Universal Responsive Sidebar */}
      <PortalSidebar clientId={clientId} />

      {/* The Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full z-10">
        
        {/* The Universal Header - Wrapped to add left padding on mobile for the hamburger button */}
        <div className="lg:pl-0 pl-14 transition-all">
          <PortalHeader clientId={clientId} />
        </div>
        
        {/* The Dynamic Switchboard Content Goes Here */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
          {children}
        </main>
        
      </div>
    </div>
  );
}