import { SANDBOX_CLIENTS } from '@/utils/glossary';
import AssetHubTerminal from '@/components/sandbox/shared/AssetHubTerminal';

export default async function TransferPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  // 1. Unwrap params for Next.js 15+
  const resolvedParams = await params;
  const clientId = resolvedParams.clientId;

  // 2. Fetch the client's specific config
  const clientConfig = SANDBOX_CLIENTS[clientId as keyof typeof SANDBOX_CLIENTS];

  // 3. Fallback if config is missing
  if (!clientConfig) {
    return <div className="p-8 text-rose-500">Error: Client configuration not found.</div>;
  }

  return (
    <div className="w-full h-full -mt-8 -mx-8">
      {/* 
        We use negative margins here to let the terminal fill the padding 
        of the main PortalLayout wrapper seamlessly. 
      */}
      <AssetHubTerminal 
        clientConfig={clientConfig} 
        onExit={() => console.log("Exit handled by sidebar now")} 
      />
    </div>
  );
}