/* src/app/portal/[clientId]/layout.tsx */
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PortalSidebar from '@/components/portal/core/PortalSidebar';
import PortalHeader from '@/components/portal/core/PortalHeader';

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }> | { clientId: string };
}) {
  // Await params for Next.js 15+ compatibility
  const resolvedParams = await params;
  const clientId = resolvedParams.clientId;

  const supabase = await createClient();

  // 1. Grab the currently logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect('/login');
  }

  // 2. THE BOUNCER: Verify this exact user owns this exact storefront
  // We also check for admin emails so you (the architect) don't get locked out of client portals!
  const adminEmails = [
    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    'courtney@alternativesolutions.io'
  ].filter(Boolean);

  const isAdmin = adminEmails.includes(user.email);

  if (!isAdmin) {
    const { data: store } = await supabase
      .from('storefronts')
      .select('id')
      .eq('id', clientId)
      .eq('contact_email', user.email)
      .single();

    // If no match is found, they are snooping. Kick them to the curb.
    if (!store) {
      redirect('/portal');
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] overflow-hidden relative">
             
      {/* GLOBAL WATERMARK */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.07]">
        <img 
          src="/logo.png" 
          alt="Alternative Solutions Watermark" 
          className="w-150 h-150 md:w-250 md:h-250 object-contain grayscale max-w-none" 
        />
      </div>

      {/* The Universal Responsive Sidebar */}
      <PortalSidebar clientId={clientId} />

      {/* The Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full z-10">
                 
        {/* The Universal Header */}
        <div className="lg:pl-0 pl-14 transition-all">
          <PortalHeader clientId={clientId} />
        </div>
                 
        {/* The Dynamic Switchboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10">
          {children}
        </main>
               
      </div>
    </div>
  );
}