/* src/app/portal/[clientId]/transfer/page.tsx */
import { SANDBOX_CLIENTS } from '@/utils/glossary';
import AssetHubTerminal from '@/components/sandbox/shared/AssetHubTerminal';

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
    <div className="-m-8 bg-zinc-950 min-h-[calc(100vh-4rem)]">
      {/* We use -m-8 to break out of the portal's padding, and min-h to fill the screen */}
      <AssetHubTerminal clientConfig={clientConfig} />
    </div>
  );
}