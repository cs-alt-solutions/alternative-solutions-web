import NetworkModule from '@/components/portal/network/NetworkModule';

export default async function NetworkPage({
  params,
}: {
  params: Promise<{ clientId: string }> | { clientId: string };
}) {
  // Await the params object to ensure compatibility across Next.js versions
  const resolvedParams = await params;
  
  return <NetworkModule clientId={resolvedParams.clientId} />;
}