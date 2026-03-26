/* src/components/dashboard/foundation/LogShiftModal.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { X, Calendar, Briefcase, Trash2 } from 'lucide-react';

interface LogShiftModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; 
}

export default function LogShiftModal({ onClose, onSuccess, initialData }: LogShiftModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientName, setClientName] = useState(initialData?.client_name || 'Doobie Division Group');
  const [shiftDate, setShiftDate] = useState(initialData?.shift_date || new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState(initialData?.hours_worked?.toString() || '0');
  const [rate, setRate] = useState(initialData?.hourly_rate?.toString() || '20');
  const [status, setStatus] = useState(initialData?.status || 'CONFIRMED');

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      client_name: clientName,
      shift_date: shiftDate,
      hours_worked: parseFloat(hours),
      hourly_rate: parseFloat(rate),
      status: status
    };

    try {
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('external_shifts')
          .update(payload)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('external_shifts')
          .insert([payload]);
        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    setIsSubmitting(true);
    try {
      const { error: delError } = await supabase
        .from('external_shifts')
        .delete()
        .eq('id', initialData.id);
      if (delError) throw delError;
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-bg-surface-100 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* FIXED HEADER: Removed font-bold, kept font-black */}
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <h3 className="text-xl text-white flex items-center gap-2 uppercase tracking-tight font-black">
            <Calendar className="text-brand-primary" size={20} />
            {isEdit ? 'Edit Shift' : 'Log New Shift'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="text-red-400 text-[10px] font-mono p-3 bg-red-500/10 border border-red-500/20 rounded-lg uppercase">{error}</div>}

          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Company / Client</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1-2 text-slate-500" size={16} />
              <input 
                type="text" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all text-sm"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Shift Date</label>
              <input 
                type="date" 
                value={shiftDate} 
                onChange={(e) => setShiftDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all text-sm font-mono"
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary/50 outline-none transition-all text-sm font-mono appearance-none"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING TIME">PENDING TIME</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Est. Hours</label>
              <input 
                type="number" 
                step="0.5"
                value={hours} 
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-brand-primary/50 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 font-bold">Hourly Rate ($)</label>
              <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-brand-primary/50 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between gap-3">
            {isEdit && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30"
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button type="button" onClick={onClose} className="px-6 py-2 text-xs font-mono uppercase text-slate-500 hover:text-white transition-colors">Abort</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 bg-white text-black hover:bg-brand-primary rounded-lg text-xs font-mono uppercase tracking-widest font-black transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Shift' : 'Lock Shift'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}