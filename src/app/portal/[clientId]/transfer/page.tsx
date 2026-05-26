/* src/app/portal/[clientId]/transfer/page.tsx */
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import AssetHubTerminal from '@/components/sandbox/shared/AssetHubTerminal';
import { redirect } from 'next/navigation';

export default async function TransferPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  const resolvedParams = await params;
  const clientId = resolvedParams.clientId;
  const clientConfig = SANDBOX_CLIENTS[clientId as keyof typeof SANDBOX_CLIENTS];

  if (!clientConfig) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="p-8 text-rose-500 bg-rose-500/10 rounded-xl border border-rose-500/20 font-mono text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.1)]">
          Error: System configuration not found for this workspace.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AssetHubTerminal 
        clientConfig={clientConfig} 
        onExit={async () => {
          'use server'; // Marking this as a server action
          redirect(`/portal/${clientId}`);
        }} 
      />
    </div>
  );
}