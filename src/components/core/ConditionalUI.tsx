'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // If the URL starts with /division or /sandbox, hide the marketing navigation
  const isAppRoute = pathname?.startsWith('/division') || pathname?.startsWith('/sandbox');

  return (
    <>
      {!isAppRoute && <Navbar />}
      {children}
      {!isAppRoute && <Footer />}
    </>
  );
}