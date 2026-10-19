'use client';

import React, { useState } from 'react';
import { SYSTEM_CONFIG } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { X, DollarSign, Wallet, ShieldCheck } from 'lucide-react';

interface LogIncomeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LogIncomeModal({ onClose, onSuccess }: LogIncomeModalProps) {
  const matrix = SYSTEM_CONFIG.PAYROLL_MATRIX;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [source, setSource] = useState('Doobie Division Group');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash App');
  const [isBenefit, setIsBenefit] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const personal = isBenefit ? numAmount : numAmount * matrix.PERSONAL;
  const business = isBenefit ? 0 : numAmount * matrix.BUSINESS;
  const vault = isBenefit ? 0 : numAmount * matrix.VAULT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('external_income').insert([{
        source_name: source,
        gross_amount: numAmount,
        payment_method: method,
        is_benefit: isBenefit,
        personal_share: personal,
        business_share: business,
        vault_share: vault,
        description: isBenefit ? 'Government Benefit' : 'Side Hustle Income'
      }]);
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <DollarSign className="text-emerald-400" size={20} /> Log Income
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors cursor-pointer"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className={isBenefit ? "text-blue-400" : "text-zinc-500"} />
              <span className="text-xs font-mono uppercase text-zinc-400">Is this a benefit? (SNAP/EBT)</span>
            </div>
            <input 
              type="checkbox" 
              checked={isBenefit} 
              onChange={(e) => setIsBenefit(e.target.checked)}
              className="w-5 h-5 accent-brand-primary cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-2">Source</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-primary outline-none transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-2">Amount ($)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white font-mono focus:border-emerald-500 outline-none transition-colors" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-2">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:border-brand-primary outline-none transition-colors cursor-pointer">
                <option>Cash App</option>
                <option>Cash</option>
                <option>EBT</option>
                <option>Venmo</option>
              </select>
            </div>
          </div>

          {/* REAL-TIME PREVIEW */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
             <p className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest">Calculated Routing:</p>
             <div className="flex justify-between text-xs font-mono">
               <span className="text-zinc-400">Personal Survival:</span>
               <span className="text-white font-bold">${personal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xs font-mono">
               <span className="text-zinc-400">Business Fuel:</span>
               <span className="text-white font-bold">${business.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xs font-mono">
               <span className="text-zinc-400">The Vault:</span>
               <span className="text-white font-bold">${vault.toFixed(2)}</span>
             </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 cursor-pointer">
            {isSubmitting ? 'Syncing...' : 'Deploy Funds'}
          </button>
        </form>
      </div>
    </div>
  );
}