'use client';

import React, { Suspense } from 'react';
import StorefrontTerminal from '@/components/sandbox/apps/division/storefront/StorefrontTerminal';
import { divisionConfig } from '@/config/clients/division';

function WarehouseLoader() {
  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center text-emerald-500 font-black tracking-widest uppercase">
      <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
      Establishing Secure Connection...
    </div>
  );
}

export default function DivisionWarehousePage() {
  return (
    <Suspense fallback={<WarehouseLoader />}>
      <StorefrontTerminal 
        clientConfig={divisionConfig} 
        onExit={() => window.location.href = '/'} 
      />
    </Suspense>
  );
}