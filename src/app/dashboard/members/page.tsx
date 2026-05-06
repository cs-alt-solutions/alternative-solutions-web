import React from 'react';
import MembersAccessTab from '@/components/dashboard/members/MembersAccessTab';
import { Key } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

// Force live data fetch on every request so you never see stale permissions
export const dynamic = 'force-dynamic';

export default async function MembersPage() {
  // SSR Database Fetching (Adhering to ARCHITECTURE.md)
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Key size={20} />
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Members & Access</h1>
        </div>
        <p className="text-sm font-mono text-purple-400/70 mt-2 pl-12">Identity verification and role-based clearance.</p>
      </div>
      
      {/* Pass the server-fetched data into the interactive client module */}
      <MembersAccessTab initialProfiles={profiles || []} />
    </div>
  );
}