/* src/app/dashboard/layout.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardMobileHeader from '@/components/dashboard/DashboardMobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Check local storage so the sidebar remembers its state on refresh
    const storedState = localStorage.getItem('sidebar-collapsed') === 'true';
    setIsCollapsed(storedState);
    
    // Broadcast state to children components immediately
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
    // Uses w-full instead of w-screen to prevent horizontal scrollbar layout shifts
    <div className="flex h-screen overflow-hidden bg-bg-app w-full">
      <Sidebar isOpen={isMobileOpen} closeMenu={closeMobileMenu} />
      
      {/* min-w-0 ensures this container perfectly absorbs remaining space alongside the sidebar */}
      <main className="flex-1 h-full min-w-0 overflow-hidden bg-black flex flex-col relative transition-all duration-300">
        <DashboardMobileHeader isOpen={isMobileOpen} toggleMenu={toggleMobileMenu} />
        
        {/* overflow-x-hidden guarantees no horizontal scrolling forces a gap */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
          {/* THE FLUID LAYOUT: w-full spans 100% of the screen horizontally on EVERY tab */}
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}