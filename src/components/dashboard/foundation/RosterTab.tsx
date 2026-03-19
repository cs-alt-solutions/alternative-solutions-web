/* src/components/dashboard/foundation/RosterTab.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { WEBSITE_COPY, SYSTEM_CONFIG } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { Briefcase, Plus, DollarSign, Clock, Users, Calendar, Wallet } from 'lucide-react';
import LogShiftModal from './LogShiftModal';
// import LogIncomeModal from './LogIncomeModal'; // We build this next!

interface ShiftRow {
  id: string;
  client_name: string;
  shift_date: string;
  hours_worked: number;
  hourly_rate: number;
  status: string;
}

interface IncomeRow {
  id: string;
  source_name: string;
  description: string;
  payout_date: string;
  payment_method: string;
  gross_amount: number;
}

export default function RosterTab() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;
  const fuelCopy = copy.EXTERNAL_FUEL;
  const matrix = SYSTEM_CONFIG.PAYROLL_MATRIX;

  const [shifts, setShifts] = useState<ShiftRow[]>([]);
  const [income, setIncome] = useState<IncomeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Edit States
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftRow | null>(null);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      
      const { data: shiftData } = await supabase
        .from('external_shifts')
        .select('*')
        .order('shift_date', { ascending: true });

      const { data: incomeData } = await supabase
        .from('external_income')
        .select('*')
        .order('payout_date', { ascending: false });

      setShifts(shiftData || []);
      setIncome(incomeData || []);
    } catch (err) {
      console.error('Vault Sync Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Payroll Matrix Logic
  const totalGross = income.reduce((sum, item) => sum + Number(item.gross_amount), 0);
  const totalPersonal = totalGross * matrix.PERSONAL;
  const totalBusiness = totalGross * matrix.BUSINESS;
  const totalVault = totalGross * matrix.VAULT;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20 animate-pulse">
        <span className="text-brand-primary font-mono text-sm tracking-widest uppercase">Syncing Life Ledger...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* SECTION 1: EXTERNAL FUEL & PAYROLL MATRIX */}
      <div className="bg-bg-surface-200/50 border border-brand-primary/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.05)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-3 tracking-tight uppercase">
              <Briefcase size={24} className="text-brand-primary" />
              Life & Side Income
            </h2>
            <p className="text-slate-400 font-mono text-sm">{fuelCopy.DESC}</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => {
                 setSelectedShift(null);
                 setIsShiftModalOpen(true);
               }}
               className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all"
             >
               <Calendar size={16} /> Log Shift
             </button>
             <button 
               onClick={() => setIsIncomeModalOpen(true)}
               className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-black border border-brand-primary/30 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all"
             >
               <Plus size={16} /> Log Income
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COL: SHIFT SCHEDULE (EDITABLE) */}
          <div className="lg:col-span-4 space-y-4">
             <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Clock size={14} /> Upcoming Schedule
             </h3>
             <div className="space-y-3">
               {shifts.length === 0 ? (
                 <p className="text-xs font-mono text-slate-600 italic px-2">No shifts on the horizon.</p>
               ) : (
                 shifts.map(shift => (
                   <button 
                     key={shift.id} 
                     onClick={() => {
                        setSelectedShift(shift);
                        setIsShiftModalOpen(true);
                     }}
                     className="w-full text-left bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-brand-primary/30 transition-colors"
                   >
                      <div>
                        <p className="text-white font-bold uppercase tracking-tight group-hover:text-brand-primary transition-colors">{shift.client_name}</p>
                        <p className="text-xs font-mono text-slate-500 mt-1">{shift.shift_date}</p>
                      </div>
                      <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${
                        shift.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                        shift.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {shift.status}
                      </span>
                   </button>
                 ))
               )}
             </div>
          </div>

          {/* RIGHT COL: PAYROLL MATRIX & LEDGER */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* Master Split Routing */}
             <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={14} /> Global Fund Routing
                  </h3>
                  <span className="text-xl font-bold text-emerald-400">+${totalGross.toLocaleString(undefined, {minimumFractionDigits: 2})} Gross</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-l-2 border-emerald-500 pl-4 bg-white/5 py-3 rounded-r-lg hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{fuelCopy.BUCKETS.PERSONAL} ({(matrix.PERSONAL * 100).toFixed(0)}%)</p>
                    <p className="text-lg font-bold text-white">${totalPersonal.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="border-l-2 border-brand-primary pl-4 bg-white/5 py-3 rounded-r-lg hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{fuelCopy.BUCKETS.BUSINESS} ({(matrix.BUSINESS * 100).toFixed(0)}%)</p>
                    <p className="text-lg font-bold text-white">${totalBusiness.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="border-l-2 border-fuchsia-500 pl-4 bg-white/5 py-3 rounded-r-lg hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{fuelCopy.BUCKETS.VAULT} ({(matrix.VAULT * 100).toFixed(0)}%)</p>
                    <p className="text-lg font-bold text-white">${totalVault.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
                </div>
             </div>
             
             {/* Income Ledger */}
             <div className="bg-black/20 border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-black/40">
                      <th className="py-3 pl-4 font-medium">Source</th>
                      <th className="py-3 font-medium">Date</th>
                      <th className="py-3 font-medium">Method</th>
                      <th className="py-3 text-right pr-4 font-medium">Gross</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono text-slate-300">
                    {income.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-600 italic">Awaiting first payout log...</td>
                      </tr>
                    ) : (
                      income.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                          <td className="py-4 pl-4 font-bold text-white">
                             {item.source_name}
                             <span className="block text-[10px] text-slate-500 font-normal">{item.description}</span>
                          </td>
                          <td className="py-4 text-slate-500">{item.payout_date}</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] uppercase tracking-tighter">{item.payment_method}</span>
                          </td>
                          <td className="py-4 text-right pr-4 font-bold text-emerald-400 group-hover:scale-105 transition-transform origin-right">+${Number(item.gross_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PLATFORM BACKERS (SECONDARY) */}
      <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl p-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users size={18} className="text-slate-400" /> {copy.ROSTER_TITLE}
        </h2>
        <div className="flex flex-col items-center justify-center py-12 bg-black/40 border border-white/5 rounded-xl border-dashed">
          <Users size={24} className="text-slate-600 mb-2 animate-pulse" />
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">Stripe Synchronization Pending</p>
        </div>
      </div>

      {/* MODALS */}
      {isShiftModalOpen && (
        <LogShiftModal 
          onClose={() => {
            setIsShiftModalOpen(false);
            setSelectedShift(null);
          }} 
          onSuccess={fetchFinancialData} 
          initialData={selectedShift}
        />
      )}
      
      {/* We can wire up the LogIncomeModal next! */}
      {/* {isIncomeModalOpen && (
        <LogIncomeModal 
          onClose={() => setIsIncomeModalOpen(false)} 
          onSuccess={fetchFinancialData} 
        />
      )} */}

    </div>
  );
}