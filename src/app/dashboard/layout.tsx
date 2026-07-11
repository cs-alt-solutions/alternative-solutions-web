import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-bg-app overflow-hidden">
      {/* 1. THE NAVIGATION ENGINE */}
      <Sidebar />

      {/* 2. THE MAIN VIEWPORT */}
      {/* ADDED: pt-16 on mobile so content clears the hamburger button */}
      <main className="flex-1 relative overflow-y-auto bg-stardust p-4 pt-16 md:p-8 md:pt-8">
        
        {/* THE ENERGY GLOW */}
        <div className="fixed top-0 left-1/4 w-full h-full bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        {/* CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}