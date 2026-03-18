/* src/components/dashboard/foundation/CampaignCard.tsx */
import React from 'react';
import Link from 'next/link';
import { Target, Users, Code, ArrowRight } from 'lucide-react';

interface CampaignProps {
  campaign: {
    id: string;
    clientName: string;
    projectName: string;
    targetAmount: number;
    raisedAmount: number;
    backerCount: number;
    status: 'FUNDING' | 'BUILDING' | 'DEPLOYED';
  };
  copy: any;
}

export default function CampaignCard({ campaign, copy }: CampaignProps) {
  // Calculate progress percentage securely
  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
  
  // Status-based styling
  const isFunded = progress >= 100;
  const themeColor = isFunded ? 'text-emerald-400' : 'text-brand-primary';
  const themeBg = isFunded ? 'bg-emerald-500/10' : 'bg-brand-primary/10';
  const themeBorder = isFunded ? 'border-emerald-500/30' : 'border-brand-primary/30';

  return (
    <div className={`bg-bg-surface-200/50 border ${themeBorder} rounded-2xl p-6 relative overflow-hidden group hover:bg-black/40 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]`}>
      {/* Background Glow */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 ${themeBg} rounded-full blur-[50px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100`} />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
            {campaign.clientName}
          </h4>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {campaign.projectName}
          </h3>
        </div>
        <div className={`px-2 py-1 rounded text-[9px] font-mono uppercase tracking-widest border ${themeBorder} ${themeColor} ${themeBg}`}>
          {campaign.status}
        </div>
      </div>

      {/* Progress Telemetry */}
      <div className="space-y-4 mb-8 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{copy.RAISED || "CAPITAL SECURED"}</div>
            <div className="text-2xl font-black text-white tracking-tighter">
              ${campaign.raisedAmount.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{copy.TARGET || "FUNDING TARGET"}</div>
            <div className="text-sm font-mono text-white/60">
              ${campaign.targetAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* The Progress Bar */}
        <div className="w-full h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isFunded ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-linear-to-r from-brand-primary to-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <Users size={12} className={themeColor} /> {campaign.backerCount} {copy.BACKERS || "COMMUNITY BACKERS"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-6 border-t border-white/5 relative z-10">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-xs font-mono text-white/60 uppercase tracking-widest transition-all">
          <Code size={14} /> Widget
        </button>
        <Link 
          href={`/dashboard/foundation/campaign/${campaign.id}`}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono uppercase tracking-widest font-bold transition-all group/btn ${isFunded ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-black' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/30 hover:bg-brand-primary hover:text-black'}`}
        >
          {copy.BTN_MANAGE || "MANAGE"} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}