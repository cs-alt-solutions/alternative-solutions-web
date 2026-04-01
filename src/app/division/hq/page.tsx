'use client';

import React, { Suspense } from 'react';
import AdminTerminal from '@/components/sandbox/apps/admin/AdminTerminal';
import { divisionConfig } from '@/config/clients/division';

export default function DivisionHQPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-zinc-950 flex items-center justify-center text-cyan-500 font-black tracking-widest uppercase">Loading Command Center...</div>}>
      <AdminTerminal 
        clientConfig={divisionConfig} 
        onExit={() => window.location.href = '/'} 
      />
    </Suspense>
  );
}