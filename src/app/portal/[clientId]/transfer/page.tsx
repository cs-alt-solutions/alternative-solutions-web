/* src/app/portal/[clientId]/transfer/page.tsx */
import SecureTransfer from '@/components/portal/core/SecureTransfer';

export default async function TransferPage({ 
  params 
}: { 
  params: Promise<{ clientId: string }> 
}) {
  // Await the params correctly for Next.js 15+
  const { clientId } = await params;

  return (
    <div className="p-8 h-full">
      {/* We pass the raw clientId straight to your permanent portal component */}
      <SecureTransfer clientId={clientId} />
    </div>
  );
}