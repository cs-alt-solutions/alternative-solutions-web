'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ConditionalUI({ 
  children,
  navbar,
  footer
}: { 
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // If the URL starts with /division or /sandbox, hide the marketing navigation
  const isAppRoute = pathname?.startsWith('/division') || pathname?.startsWith('/sandbox');

  return (
    <>
      {!isAppRoute && navbar}
      {children}
      {!isAppRoute && footer}
    </>
  );
}