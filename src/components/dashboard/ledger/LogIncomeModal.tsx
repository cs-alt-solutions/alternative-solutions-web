/* src/components/dashboard/foundation/LogIncomeModal.tsx */
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

  // Live Math
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-bg-surface-100 border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
            <DollarSign className="text-emerald-400" size={20} /> Log Income
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className={isBenefit ? "text-blue-400" : "text-slate-500"} />
              <span className="text-xs font-mono uppercase text-slate-300">Is this a benefit? (SNAP/EBT)</span>
            </div>
            <input 
              type="checkbox" 
              checked={isBenefit} 
              onChange={(e) => setIsBenefit(e.target.checked)}
              className="w-5 h-5 accent-brand-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Source</label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Amount ($)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm">
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
               <span className="text-slate-400">Personal Survival:</span>
               <span className="text-white font-bold">${personal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xs font-mono">
               <span className="text-slate-400">Business Fuel:</span>
               <span className="text-white font-bold">${business.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xs font-mono">
               <span className="text-slate-400">The Vault:</span>
               <span className="text-white font-bold">${vault.toFixed(2)}</span>
             </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Syncing...' : 'Deploy Funds'}
          </button>
        </form>
      </div>
    </div>
  );
}