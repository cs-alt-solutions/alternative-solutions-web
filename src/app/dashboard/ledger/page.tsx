/* src/app/dashboard/ledger/page.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { SYSTEM_CONFIG } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { Wallet, ShieldCheck, Zap, Home, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react';

interface SurvivalCost {
  id: string;
  label: string;
  category: string;
  amount: number;
}

interface IncomeRow {
  gross_amount: number;
  is_benefit: boolean;
}

export default function LedgerPage() {
  const matrix = SYSTEM_CONFIG.PAYROLL_MATRIX;
  
  const [costs, setCosts] = useState<SurvivalCost[]>([]);
  const [income, setIncome] = useState<IncomeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLedgerData() {
      try {
        setIsLoading(true);
        // Fetch all monthly bills
        const { data: costData } = await supabase.from('survival_costs').select('*');
        // Fetch all income for the current month
        const { data: incomeData } = await supabase.from('external_income').select('gross_amount, is_benefit');

        setCosts(costData || []);
        setIncome(incomeData || []);
      } catch (err) {
        console.error('Ledger Sync Error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLedgerData();
  }, []);

  // MASTER MATH ENGINE
  const totalCashIncome = income.filter(i => !i.is_benefit).reduce((sum, i) => sum + Number(i.gross_amount), 0);
  const totalBenefits = income.filter(i => i.is_benefit).reduce((sum, i) => sum + Number(i.gross_amount), 0);

  const personalShare = (totalCashIncome * matrix.PERSONAL) + totalBenefits;
  const businessShare = totalCashIncome * matrix.BUSINESS;
  const vaultShare = totalCashIncome * matrix.VAULT;

  const totalBills = costs.reduce((sum, c) => sum + Number(c.amount), 0);
  const coveragePercent = Math.min(Math.round((personalShare / totalBills) * 100), 100);

  if (isLoading) return <div className="p-20 text-center font-mono text-brand-primary animate-pulse uppercase">Syncing Master Ledger...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">The Ledger</h1>
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mt-1">Life & Business Financial Hub</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
          <TrendingUp className="text-emerald-400" size={20} />
          <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-widest">
            Survival Coverage: {coveragePercent}%
          </span>
        </div>
      </div>

      {/* THE MASTER TRIAD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-surface-200 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Personal Survival</p>
          <span className="text-4xl font-black text-white block">${personalShare.toLocaleString()}</span>
          <p className="text-xs text-slate-400 font-mono mt-2">Includes Side-Pay + Benefits</p>
        </div>

        <div className="bg-bg-surface-200 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Business Fuel</p>
          <span className="text-4xl font-black text-brand-primary block">${businessShare.toLocaleString()}</span>
          <p className="text-xs text-slate-400 font-mono mt-2">Allocated for Alt Solutions</p>
        </div>

        <div className="bg-bg-surface-200 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">The Vault</p>
          <span className="text-4xl font-black text-fuchsia-400 block">${vaultShare.toLocaleString()}</span>
          <p className="text-xs text-slate-400 font-mono mt-2">Rainy Day / Growth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SURVIVAL TRACKER */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} />
              Active Bill Coverage
            </h3>
            
            <div className="space-y-6">
              {costs.map(cost => {
                const isGroceries = cost.category === 'GROCERIES';
                const colorClass = isGroceries ? 'bg-blue-500' : 'bg-emerald-500';
                
                return (
                  <div key={cost.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-widest">
                      <span className="text-slate-400">{cost.label}</span>
                      <span className="text-white">${Number(cost.amount).toFixed(0)}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                       <div 
                        className={`h-full ${colorClass} rounded-full transition-all duration-1000`} 
                        style={{ width: `${coveragePercent}%` }} 
                       />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bg-surface-200 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 text-center">Benefit Integration</h3>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="text-blue-400" size={18} />
                <span className="text-sm font-bold text-white">SNAP / EBT</span>
              </div>
              <p className="text-2xl font-black text-blue-400">${totalBenefits.toFixed(2)}</p>
              <p className="text-[10px] font-mono text-blue-400/60 uppercase mt-2">100% Routed to Personal Survival</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}