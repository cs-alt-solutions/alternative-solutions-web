'use client';

import React, { useState, useEffect } from 'react';
import { SYSTEM_CONFIG } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { Plus, ArrowDownRight, ArrowUpRight, Receipt, Landmark, Loader2 } from 'lucide-react';

export default function ExternalFuelTab() {
  const matrix = SYSTEM_CONFIG.PAYROLL_MATRIX;
  const [view, setView] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from your logged income table
  useEffect(() => {
    const fetchLedgerData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('external_income')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Map to our unified ledger format
        const formattedData = data.map(item => ({
          id: item.id,
          type: 'INCOME', // Ready for expenses integration later
          category: item.is_benefit ? 'SUPPORT' : 'W2/1099',
          source: item.source_name,
          date: new Date(item.created_at).toISOString().split('T')[0],
          amount: item.gross_amount,
          vault_share: item.vault_share || 0
        }));
        setTransactions(formattedData);
      }
      setIsLoading(false);
    };

    fetchLedgerData();
  }, []);

  const filteredTransactions = transactions.filter(t => t.type === view);
  
  // Real-time calculated sums
  const totalIncoming = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalBurn = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  const totalVault = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.vault_share, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* CASH FLOW SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Incoming */}
        <div className="bg-bg-surface-200 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ArrowDownRight size={12} /> Total Incoming
          </p>
          <p className="text-2xl font-black text-white">${totalIncoming.toFixed(2)}</p>
        </div>
        {/* Total Burn Rate */}
        <div className="bg-bg-surface-200 border border-orange-500/20 rounded-xl p-4">
          <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ArrowUpRight size={12} /> Burn Rate (Expenses)
          </p>
          <p className="text-2xl font-black text-white">${totalBurn.toFixed(2)}</p>
        </div>
        {/* IRS Tax Vault */}
        <div className="bg-bg-surface-200 border border-brand-primary/20 rounded-xl p-4">
          <p className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-1 flex items-center gap-2">
            <Landmark size={12} /> IRS Tax Vault
          </p>
          <p className="text-2xl font-black text-brand-primary">${totalVault.toFixed(2)}</p>
          <p className="text-[9px] text-slate-500 mt-1">Safe. Automated skim from 1099s.</p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-2">
           <button className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all">
             <Plus size={16} /> Log Income
           </button>
           <button className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black border border-orange-500/30 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all">
             <Receipt size={16} /> Log Expense
           </button>
        </div>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden">
        
        {/* Ledger Tabs */}
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setView('INCOME')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${view === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:bg-white/5'}`}
          >
            Income History
          </button>
          <button 
            onClick={() => setView('EXPENSE')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${view === 'EXPENSE' ? 'bg-orange-500/10 text-orange-400 border-b-2 border-orange-500' : 'text-slate-500 hover:bg-white/5'}`}
          >
            Expense History
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-black/40">
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Source / Vendor</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Classification</th>
              <th className="p-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
               <tr>
                 <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                   <Loader2 size={16} className="animate-spin inline-block mr-2" /> Syncing Ledger...
                 </td>
               </tr>
            ) : filteredTransactions.length === 0 ? (
               <tr>
                 <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                   No {view.toLowerCase()} records found.
                 </td>
               </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-sm text-white font-medium">{t.source}</td>
                  <td className="p-4 text-xs font-mono text-slate-400">{t.date}</td>
                  <td className="p-4 text-xs font-mono text-slate-500">{t.category}</td>
                  <td className={`p-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}