/* src/app/portal/[clientId]/settings/page.tsx */
import React from 'react';
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import ClientProfile from '@/components/portal/core/ClientProfile';

export default async function SettingsPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const { clientId } = await params;
  const clientConfig = SANDBOX_CLIENTS[clientId as keyof typeof SANDBOX_CLIENTS];

  if (!clientConfig) {
    return (
      <div className="p-8 text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 font-mono text-sm uppercase tracking-widest">
        Error: System configuration not found for this workspace.
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <ClientProfile clientConfig={clientConfig} />
    </div>
  );
}