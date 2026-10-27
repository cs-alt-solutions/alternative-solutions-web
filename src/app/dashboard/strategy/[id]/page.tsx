/* src/app/dashboard/strategy/[id]/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DiscoveryWorkspace from '@/components/dashboard/strategy/DiscoveryWorkspace';

export const dynamic = 'force-dynamic';

export default async function DiscoveryBoardPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 🚀 THE FIX: Pull ALL storefront data (*) so we get the emails, phones, and socials from the intake form
  const { data: board } = await supabase
    .from('ideas_ledger')
    .select('*, storefronts(*)')
    .eq('id', id)
    .single();

  if (!board) redirect('/dashboard/strategy');

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full h-full overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <Link 
          href="/dashboard/strategy" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Strategy Hub
        </Link>
      </div>
      
      <DiscoveryWorkspace initialBoard={board} />
    </div>
  );
}