// src/app/dashboard/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardMobileHeader from '@/components/dashboard/DashboardMobileHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // THE FIX: Check the browser's memory the exact millisecond the layout mounts
    const storedState = localStorage.getItem('sidebar-collapsed') === 'true';
    setIsCollapsed(storedState);
    
    // THE FIX: Instantly broadcast the state to the rest of the app.
    // Now, your Storefront Editor will catch this event on load and instantly 
    // drop the 64px gap without waiting for you to click the toggle!
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
    <div className="flex h-screen overflow-hidden bg-bg-app w-screen">
      {/* Explicitly passing props to satisfy SidebarProps */}
      <Sidebar isOpen={isMobileOpen} closeMenu={closeMobileMenu} />
      
      {/* THE FIX: We swapped 'w-full' for 'min-w-0 relative'. 
        w-full forces the box to be 100vw, which pushes content off-screen when the sidebar is open.
        min-w-0 tells the flexbox to perfectly absorb whatever space the sidebar leaves it.
        relative ensures your fullscreen Storefront Editor binds perfectly to this box.
      */}
      <main className="flex-1 h-full min-w-0 overflow-hidden bg-black flex flex-col relative transition-all duration-300">
        <DashboardMobileHeader isOpen={isMobileOpen} toggleMenu={toggleMobileMenu} />
        
        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}