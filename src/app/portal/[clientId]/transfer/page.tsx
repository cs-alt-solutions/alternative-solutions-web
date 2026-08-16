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
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      {/* We pass the raw clientId straight to the newly redesigned asset hub */}
      <SecureTransfer clientId={clientId} />
    </div>
  );
}