/* src/app/portal/[clientId]/layout.tsx */
'use client';

import { usePathname } from 'next/navigation';
import PortalSidebar from '@/components/portal/layout/PortalSidebar';
import PortalHeader from '@/components/portal/layout/PortalHeader';

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
    <div className="flex h-screen w-full bg-[#0B0F19] overflow-hidden">
      
      {/* The Universal Responsive Sidebar */}
      <PortalSidebar clientId={clientId} />

      {/* The Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        
        {/* The Universal Header - Wrapped to add left padding on mobile for the hamburger button */}
        <div className="lg:pl-0 pl-14 transition-all">
          <PortalHeader clientId={clientId} />
        </div>
        
        {/* The Dynamic Switchboard Content Goes Here */}
        {/* Adjusted padding for mobile screens */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}