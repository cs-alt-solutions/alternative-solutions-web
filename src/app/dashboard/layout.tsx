/* src/app/dashboard/layout.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardMobileHeader from '@/components/dashboard/DashboardMobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem('sidebar-collapsed') === 'true';
    setIsCollapsed(storedState);
    
    window.dispatchEvent(new CustomEvent('sidebar-collapse', { 
      detail: { isCollapsed: storedState } 
    }));

    const handleCollapse = (e: any) => setIsCollapsed(e.detail.isCollapsed);
    window.addEventListener('sidebar-collapse', handleCollapse);
    return () => window.removeEventListener('sidebar-collapse', handleCollapse);
  }, []);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-app w-full">
      <Sidebar isOpen={isMobileOpen} closeMenu={closeMobileMenu} />
      
      <main className="flex-1 h-full min-w-0 overflow-hidden bg-black flex flex-col relative transition-all duration-300">
        <DashboardMobileHeader isOpen={isMobileOpen} toggleMenu={toggleMobileMenu} />
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          {/* THE FLUID LAYOUT FIX: Changed from max-w-[1600px] mx-auto to w-full. 
              Now the layout will span 100% of the screen horizontally on EVERY tab. */}
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}