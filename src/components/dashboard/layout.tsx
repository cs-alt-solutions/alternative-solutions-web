/* src/app/dashboard/layout.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleCollapse = (e: any) => setIsCollapsed(e.detail.isCollapsed);
    window.addEventListener('sidebar-collapse', handleCollapse);
    return () => window.removeEventListener('sidebar-collapse', handleCollapse);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-app w-screen">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto w-full transition-all duration-300 bg-black">
        {children}
      </main>
    </div>
  );
}