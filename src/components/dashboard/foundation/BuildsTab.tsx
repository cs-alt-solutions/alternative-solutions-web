/* src/components/dashboard/foundation/BuildsTab.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import CampaignCard from './CampaignCard';
import NewBuildModal from './NewBuildModal';
import { WEBSITE_COPY } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { Plus } from 'lucide-react';

interface BuildRow {
  id: string;
  title: string;
  client_name: string | null;
  build_type: 'CLIENT' | 'SAAS';
  status: 'ACTIVE' | 'FUNDED' | 'BUILDING' | 'SHIPPED' | 'ARCHIVED';
  target_amount: number;
  raised_amount: number;
  backer_count: number;
  platform_fee_percentage: number;
}

export default function BuildsTab() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.BUILDS;

  const [activeBuilds, setActiveBuilds] = useState<BuildRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // NEW STATE

  const fetchBuilds = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('builds')
        .select('*')
        .neq('status', 'ARCHIVED')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setActiveBuilds(data || []);
    } catch (err: any) {
      console.error('Failed to fetch builds:', err.message);
      setError('System anomaly: Failed to connect to the Supabase vault.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER WITH ACTION BUTTON */}
      <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-2xl p-4">
         <p className="text-sm font-mono text-slate-400">Total Active: <span className="text-white font-bold">{activeBuilds.length}</span></p>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black border border-brand-primary/30 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all"
         >
           <Plus size={16} /> New Build
         </button>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center py-20 animate-pulse">
          <span className="text-brand-primary font-mono text-sm tracking-widest uppercase">Syncing with vault...</span>
        </div>
      ) : error ? (
        <div className="w-full flex justify-center py-20 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <span className="text-orange-400 font-mono text-sm tracking-widest">{error}</span>
        </div>
      ) : activeBuilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-black/40 border border-white/5 rounded-2xl">
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">{copy.EMPTY_STATE}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeBuilds.map(build => (
            <CampaignCard 
              key={build.id} 
              id={build.id}
              title={build.title}
              client={build.client_name || undefined}
              targetAmount={Number(build.target_amount)}
              raisedAmount={Number(build.raised_amount)}
              backerCount={Number(build.backer_count)}
              status={build.status}
              buildType={build.build_type}
              platformFeePercentage={Number(build.platform_fee_percentage)}
            />
          ))}
        </div>
      )}

      {/* RENDER THE MODAL IF OPEN */}
      {isModalOpen && (
        <NewBuildModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchBuilds} // Refresh data automatically!
        />
      )}

    </div>
  );
}