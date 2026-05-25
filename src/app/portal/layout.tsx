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
      {/* The Universal Sidebar */}
      <PortalSidebar clientId={clientId} />

      {/* The Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* The Universal Header */}
        <PortalHeader clientId={clientId} />
        
        {/* The Dynamic Switchboard Content Goes Here */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}