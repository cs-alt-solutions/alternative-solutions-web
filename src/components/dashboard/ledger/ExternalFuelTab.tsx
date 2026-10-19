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

  useEffect(() => {
    const fetchLedgerData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('external_income')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedData = data.map(item => ({
          id: item.id,
          type: 'INCOME', 
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

  const totalIncoming = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalBurn = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  const totalVault = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.vault_share, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* CASH FLOW SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/40 border border-emerald-500/20 rounded-xl p-4">
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ArrowDownRight size={12} /> Total Incoming
          </p>
          <p className="text-2xl font-black text-white">${totalIncoming.toFixed(2)}</p>
        </div>
        
        <div className="bg-zinc-900/40 border border-orange-500/20 rounded-xl p-4">
          <p className="text-[10px] font-mono text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ArrowUpRight size={12} /> Burn Rate (Expenses)
          </p>
          <p className="text-2xl font-black text-white">${totalBurn.toFixed(2)}</p>
        </div>
        
        <div className="bg-zinc-900/40 border border-brand-primary/20 rounded-xl p-4">
          <p className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-1 flex items-center gap-2">
            <Landmark size={12} /> IRS Tax Vault
          </p>
          <p className="text-2xl font-black text-brand-primary">${totalVault.toFixed(2)}</p>
          <p className="text-[9px] text-zinc-500 mt-1">Safe. Automated skim from 1099s.</p>
        </div>

        <div className="flex flex-col justify-center gap-2">
           <button className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer">
             <Plus size={16} /> Log Income
           </button>
           <button className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black border border-orange-500/30 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer">
             <Receipt size={16} /> Log Expense
           </button>
        </div>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg">
        
        <div className="flex border-b border-zinc-800/80">
          <button 
            onClick={() => setView('INCOME')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer ${view === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-zinc-500 hover:bg-zinc-900'}`}
          >
            Income History
          </button>
          <button 
            onClick={() => setView('EXPENSE')}
            className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer ${view === 'EXPENSE' ? 'bg-orange-500/10 text-orange-400 border-b-2 border-orange-500' : 'text-zinc-500 hover:bg-zinc-900'}`}
          >
            Expense History
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-black/40">
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Source / Vendor</th>
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Date</th>
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Classification</th>
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
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
                <tr key={t.id} className="hover:bg-zinc-900/50 transition-colors group">
                  <td className="p-4 text-sm text-white font-medium">{t.source}</td>
                  <td className="p-4 text-xs font-mono text-zinc-400">{t.date}</td>
                  <td className="p-4 text-xs font-mono text-zinc-500">{t.category}</td>
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