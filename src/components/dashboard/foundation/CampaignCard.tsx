/* src/components/dashboard/foundation/CampaignCard.tsx */
import React from 'react';
import { WEBSITE_COPY, SYSTEM_CONFIG } from '@/utils/glossary';
import { Target, Users, Code, Building2, Wallet } from 'lucide-react';
import Link from 'next/link';

interface BuildCardProps {
  id: string;
  title: string;
  client?: string;
  targetAmount?: number; 
  raisedAmount?: number; 
  backerCount?: number;  
  status: 'ACTIVE' | 'FUNDED' | 'BUILDING' | 'SHIPPED' | 'ARCHIVED';
  buildType?: 'CLIENT' | 'SAAS';
  platformFeePercentage?: number; // NEW: Pulled straight from Supabase!
}

export default function CampaignCard({ 
  id, 
  title, 
  client, 
  targetAmount = 0, 
  raisedAmount = 0, 
  backerCount = 0,  
  status, 
  buildType = 'CLIENT',
  platformFeePercentage
}: BuildCardProps) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.BUILDS.CARD;
  const types = WEBSITE_COPY.DASHBOARD.FOUNDATION.BUILDS.TYPES;
  
  const safeTarget = targetAmount > 0 ? targetAmount : 1;
  const progress = Math.min(Math.round((raisedAmount / safeTarget) * 100), 100);

  // FINANCIAL ENGINE: Use the DB's custom fee, or fallback to the global default
  const activeFee = platformFeePercentage !== undefined ? platformFeePercentage : SYSTEM_CONFIG.FEES.PLATFORM_CUT;
  const architectCut = raisedAmount * activeFee;
  const buildFunds = raisedAmount - architectCut;

  return (
    <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors group flex flex-col h-full">
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {buildType === 'SAAS' ? (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-mono tracking-widest uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                <Code size={10} /> {types.SAAS}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-mono tracking-widest uppercase bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30">
                <Building2 size={10} /> {types.CLIENT}
              </span>
            )}
            
            <span className={`px-2 py-1 rounded-md text-[9px] font-mono tracking-widest uppercase border ${
              status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              status === 'FUNDED' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
              status === 'BUILDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-white/10 text-white/40 border-white/20'
            }`}>
              {status}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{title}</h3>
          {client && <p className="text-sm text-slate-400 font-mono">{client}</p>}
        </div>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-slate-400">{copy.RAISED}</span>
          <span className="text-white font-bold">${raisedAmount.toLocaleString()} <span className="text-slate-500 font-normal">/ ${targetAmount.toLocaleString()}</span></span>
        </div>
        
        <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${buildType === 'SAAS' ? 'bg-brand-primary' : 'bg-fuchsia-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* The Split Breakdown */}
        <div className="grid grid-cols-2 gap-4 mt-4 p-3 rounded-xl bg-black/40 border border-white/5">
           <div>
             <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Build Budget</span>
             <span className="text-sm font-mono text-white/80">${buildFunds.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
           </div>
           <div className="border-l border-white/10 pl-4">
             <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-1 mb-1">
               <Wallet size={10} /> Architect Cut ({(activeFee * 100).toFixed(0)}%)
             </span>
             <span className="text-sm font-mono font-bold text-emerald-400">${architectCut.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
          <Users size={16} className={buildType === 'SAAS' ? 'text-brand-primary' : 'text-fuchsia-400'} />
          <span className="text-white font-bold">{backerCount}</span> {copy.BACKERS}
        </div>
        <Link 
          href={`/dashboard/foundation/campaign/${id}`}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold tracking-widest uppercase rounded-lg transition-colors border border-white/10"
        >
          {copy.BTN_MANAGE}
        </Link>
      </div>
    </div>
  );
}