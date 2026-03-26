'use client';

import React, { useState } from 'react';
import { SYSTEM_CONFIG } from '@/utils/glossary';
import { Calculator, Target, ArrowRight, Zap, Flame, Briefcase } from 'lucide-react';

export default function ProjectionEngineTab() {
  const matrix = SYSTEM_CONFIG.PAYROLL_MATRIX;
  const founderRate = SYSTEM_CONFIG.RATES.FOUNDER; // $5/mo

  // --- STATE: THE BURN RATE (Expenses) ---
  const [rentAndUtils, setRentAndUtils] = useState(1200);
  const [dependentCare, setDependentCare] = useState(300); // School/Camp
  const [bizOverhead, setBizOverhead] = useState(150); // Servers, Domains, etc.

  // --- STATE: THE LEVERS (Income Projections) ---
  const [partTimeHours, setPartTimeHours] = useState(20);
  const [partTimeRate, setPartTimeRate] = useState(15);
  const [founderCount, setFounderCount] = useState(10);
  const [clientBuilds, setClientBuilds] = useState(0);
  const [supportIncome, setSupportIncome] = useState(400); // Non-taxable external

  // --- THE MATH ENGINE ---
  const totalBurn = rentAndUtils + dependentCare + bizOverhead;

  // Gross Incomes
  const projectedW2 = partTimeHours * partTimeRate * 4; // Monthly estimate (4 weeks)
  const projectedPlatform = founderCount * founderRate;
  const projectedClient = clientBuilds;
  
  const totalGross = projectedW2 + projectedPlatform + projectedClient + supportIncome;

  // Applying the Matrix to see what actually hits your Survival Wallet
  // We assume external support (like child support) goes 100% to survival.
  const survivalWallet = (projectedW2 + projectedPlatform + projectedClient) * matrix.PERSONAL + supportIncome;
  const bizWallet = (projectedW2 + projectedPlatform + projectedClient) * matrix.BUSINESS;
  const vaultWallet = (projectedW2 + projectedPlatform + projectedClient) * matrix.VAULT;

  const netSurvival = survivalWallet - (rentAndUtils + dependentCare); // What's left after life bills
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
        <p className="text-slate-400 font-mono text-sm">Finagle the numbers. Find the exact path to fund your month.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE VARIABLES */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: The Burn Rate (Fixed Costs) */}
          <div className="bg-black/40 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Flame size={14} /> Monthly Burn Rate
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Rent & Utilities</label>
                <input type="number" value={rentAndUtils} onChange={(e) => setRentAndUtils(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-purple-400">Dependent Care (Camp/School)</label>
                <input type="number" value={dependentCare} onChange={(e) => setDependentCare(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-brand-primary">Business Overhead (Servers)</label>
                <input type="number" value={bizOverhead} onChange={(e) => setBizOverhead(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Total Burn Target</span>
              <span className="text-xl font-black text-orange-400">${totalBurn}</span>
            </div>
          </div>

          {/* Section 2: The Income Levers */}
          <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Income Levers
            </h3>
            <div className="space-y-6">
              
              {/* Part-Time Toggle */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white">Part-Time Shifts (Weekly Hours)</label>
                  <span className="text-emerald-400 font-mono text-sm">${projectedW2}/mo</span>
                </div>
                <input type="range" min="0" max="40" value={partTimeHours} onChange={(e) => setPartTimeHours(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0 hrs</span>
                  <span>{partTimeHours} hrs @ ${partTimeRate}/hr</span>
                  <span>40 hrs</span>
                </div>
              </div>

              {/* Platform Founders Toggle */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-brand-primary">Platform Founders ($5/mo)</label>
                  <span className="text-emerald-400 font-mono text-sm">${projectedPlatform}/mo</span>
                </div>
                <input type="range" min="0" max="100" value={founderCount} onChange={(e) => setFounderCount(Number(e.target.value))} className="w-full accent-brand-primary" />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0</span>
                  <span>{founderCount} Backers</span>
                  <span>100</span>
                </div>
              </div>

              {/* Client Work Input */}
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white">Custom Client Builds ($)</label>
                <input type="number" value={clientBuilds} onChange={(e) => setClientBuilds(Number(e.target.value))} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-right w-32 focus:border-brand-primary outline-none transition-all" />
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
                    ? "Your survival wallet covers your rent, utilities, and dependent care. You are clear to build."
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