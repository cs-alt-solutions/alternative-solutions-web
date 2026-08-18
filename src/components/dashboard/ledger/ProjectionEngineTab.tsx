'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { SYSTEM_CONFIG } from '@/utils/glossary';
import { Calculator, Target, Flame, Briefcase, Loader2, Zap, Landmark } from 'lucide-react';

export default function ProjectionEngineTab() {
  const matrix = SYSTEM_CONFIG.PAYROLL_MATRIX;
  const foundationRate = 5.00; 
  const proRate = 15.00;

  // --- STATE: REALITY (Fetched from DB) ---
  const [liveStorefronts, setLiveStorefronts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE: THE BURN RATE (Categorized for future taxes) ---
  const [rent, setRent] = useState(1000);
  const [utilities, setUtilities] = useState(200);
  const [dependentCare, setDependentCare] = useState(300); 
  const [bizOverhead, setBizOverhead] = useState(150); 

  // --- STATE: THE LEVERS (Projections on top of reality) ---
  const [partTimeHours, setPartTimeHours] = useState(20);
  const [partTimeRate, setPartTimeRate] = useState(18); // Adjusted for typical Doobie wage
  const [otherExternalFuel, setOtherExternalFuel] = useState(0); // Random side hustles/gigs
  
  const [newFoundationGoal, setNewFoundationGoal] = useState(0);
  const [newProGoal, setNewProGoal] = useState(0);
  const [clientBuilds, setClientBuilds] = useState(0);
  const [supportIncome, setSupportIncome] = useState(400); // Child support, non-taxable

  // --- FETCH REALITY ---
  useEffect(() => {
    const fetchBedrockData = async () => {
      setIsLoading(true);
      const { count } = await supabase
        .from('storefronts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['ACTIVE', 'LIVE'])
        .not('stripe_subscription_id', 'is', null);

      if (count) setLiveStorefronts(count);
      setIsLoading(false);
    };

    fetchBedrockData();
  }, []);

  // --- THE MATH ENGINE ---
  const totalBurn = rent + utilities + dependentCare + bizOverhead;

  // Real Money (Assuming current live are foundation for the baseline)
  const realMrr = liveStorefronts * foundationRate;

  // Projected Money
  const projectedW2 = partTimeHours * partTimeRate * 4; // 4 weeks in a month
  const projectedNewFoundation = newFoundationGoal * foundationRate;
  const projectedNewPro = newProGoal * proRate;
  
  // Total Taxable Gross (What you actually pay taxes on)
  const taxableGross = realMrr + projectedW2 + otherExternalFuel + projectedNewFoundation + projectedNewPro + clientBuilds;
  
  // Total Gross Income
  const totalGross = taxableGross + supportIncome;

  // Applying the 50/30/20 Matrix
  const survivalWallet = (taxableGross * matrix.PERSONAL) + supportIncome;
  const bizWallet = (taxableGross * matrix.BUSINESS);
  const vaultWallet = (taxableGross * matrix.VAULT);

  // The Verdict
  const netSurvival = survivalWallet - (rent + utilities + dependentCare);
  const isSurviving = netSurvival >= 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="bg-bg-surface-200/50 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.05)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight uppercase">
          <Calculator size={24} className="text-purple-400" />
          The Sandbox
        </h2>
        <p className="text-slate-400 font-mono text-sm">Blend real telemetry with future projections to fund your month.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE VARIABLES */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Reality Baseline */}
          <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-6">
             <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Zap size={14} /> Locked Reality (Current Baseline)
             </h3>
             {isLoading ? (
               <div className="text-zinc-500 font-mono text-xs flex items-center gap-2 uppercase">
                 <Loader2 size={12} className="animate-spin" /> Fetching Network Data...
               </div>
             ) : (
               <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-lg">
                 <div>
                   <p className="text-sm font-bold text-white">Live Storefronts (MRR)</p>
                   <p className="text-[10px] font-mono text-slate-500 uppercase">{liveStorefronts} Active Sites</p>
                 </div>
                 <span className="text-xl font-black text-emerald-400">+${realMrr.toFixed(2)}/mo</span>
               </div>
             )}
          </div>

          {/* Section 2: The Burn Rate (Granular for Taxes) */}
          <div className="bg-black/40 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Flame size={14} /> Itemized Burn Rate
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Rent (Total per month)</label>
                <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Utilities (Electric/Water/Net)</label>
                <input type="number" value={utilities} onChange={(e) => setUtilities(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-purple-400">Dependent Care (Camp/School)</label>
                <input type="number" value={dependentCare} onChange={(e) => setDependentCare(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-brand-primary">Business Overhead (Servers/Domains)</label>
                <input type="number" value={bizOverhead} onChange={(e) => setBizOverhead(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Total Fixed Burn</span>
              <span className="text-xl font-black text-orange-400">${totalBurn}</span>
            </div>
          </div>

          {/* Section 3: The Income Levers */}
          <div className="bg-black/40 border border-brand-primary/20 rounded-xl p-6">
            <h3 className="text-xs font-mono text-brand-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Projection Levers
            </h3>
            <div className="space-y-6">
              
              {/* Doobie Division Toggle */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white">Doobie Division (Weekly Hrs)</label>
                  <span className="text-brand-primary font-mono text-sm">+${projectedW2}/mo</span>
                </div>
                <input type="range" min="0" max="40" value={partTimeHours} onChange={(e) => setPartTimeHours(Number(e.target.value))} className="w-full accent-brand-primary" />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0 hrs</span>
                  <span>{partTimeHours} hrs @ ${partTimeRate}/hr</span>
                  <span>40 hrs</span>
                </div>
              </div>

              {/* Foundation Storefronts Target */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-emerald-400">New Foundation Sites ($5/mo)</label>
                  <span className="text-emerald-400 font-mono text-sm">+${projectedNewFoundation}/mo</span>
                </div>
                <input type="range" min="0" max="50" value={newFoundationGoal} onChange={(e) => setNewFoundationGoal(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0</span>
                  <span>Goal: {newFoundationGoal} Sales</span>
                  <span>50</span>
                </div>
              </div>

              {/* Professional Storefronts Target */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-cyan-400">New Professional Sites ($15/mo)</label>
                  <span className="text-cyan-400 font-mono text-sm">+${projectedNewPro}/mo</span>
                </div>
                <input type="range" min="0" max="50" value={newProGoal} onChange={(e) => setNewProGoal(Number(e.target.value))} className="w-full accent-cyan-500" />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0</span>
                  <span>Goal: {newProGoal} Sales</span>
                  <span>50</span>
                </div>
              </div>

              {/* Other Custom Fuel Inputs */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Custom Client Builds</label>
                  <input type="number" value={clientBuilds} onChange={(e) => setClientBuilds(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-full focus:border-brand-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Other Hustles / Barter</label>
                  <input type="number" value={otherExternalFuel} onChange={(e) => setOtherExternalFuel(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-full focus:border-brand-primary outline-none transition-all" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE REALITY CHECK */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-bg-surface-200 border border-white/5 rounded-xl p-6 sticky top-8">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Target size={14} /> The Reality Check
            </h3>
            
            <div className="space-y-6">
              {/* Gross vs Survival */}
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Total Projected Gross</p>
                <p className="text-3xl font-black text-white mb-4">${totalGross.toFixed(2)}</p>
                
                <div className="p-4 bg-black/40 rounded-lg border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">Survival Wallet ({(matrix.PERSONAL * 100)}%)</span>
                    <span className="text-sm font-bold text-white">${survivalWallet.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400">Business Fuel ({(matrix.BUSINESS * 100)}%)</span>
                    <span className="text-sm font-bold text-brand-primary">${bizWallet.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1"><Landmark size={10} /> IRS Tax Vault ({(matrix.VAULT * 100)}%)</span>
                    <span className="text-xs font-bold text-emerald-500">${vaultWallet.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* The Verdict */}
              <div className={`p-6 rounded-xl border ${isSurviving ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isSurviving ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {isSurviving ? 'Systems Nominal: Fully Funded' : 'Warning: Survival Deficit'}
                </p>
                <p className="text-2xl font-black text-white">
                  {isSurviving ? '+' : ''}{netSurvival.toFixed(2)}
                </p>
                <p className="text-xs font-mono text-slate-500 mt-2">
                  {isSurviving 
                    ? "Your survival wallet comfortably covers your rent, utilities, and dependent care based on this projection."
                    : "Your survival wallet falls short of your fixed life costs. Adjust the levers to find your gap."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}