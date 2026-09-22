/* src/components/core/ConditionalUI.tsx */
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

  // 🚀 FIXED: Purged dead '/division' and '/sandbox' routes. 
  // Now accurately targets your actual application environments.
  const isAppRoute = 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/portal') || 
    pathname?.startsWith('/login');

  return (
    <>
      {!isAppRoute && navbar}
      {children}
      {!isAppRoute && footer}
    </>
  );
}