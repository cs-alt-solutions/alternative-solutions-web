/* src/app/dashboard/layout.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardMobileHeader from '@/components/dashboard/DashboardMobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleCollapse = (e: any) => setIsCollapsed(e.detail.isCollapsed);
    window.addEventListener('sidebar-collapse', handleCollapse);
    return () => window.removeEventListener('sidebar-collapse', handleCollapse);
  }, []);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-app w-screen">
      {/* Explicitly passing props to satisfy SidebarProps */}
      <Sidebar isOpen={isMobileOpen} closeMenu={closeMobileMenu} />
      
      <main className="flex-1 h-full overflow-hidden w-full transition-all duration-300 bg-black flex flex-col">
        <DashboardMobileHeader isOpen={isMobileOpen} toggleMenu={toggleMobileMenu} />
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}