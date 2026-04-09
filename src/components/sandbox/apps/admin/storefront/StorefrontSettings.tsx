'use client';

import React from 'react';
import { X, Clock, Save, Settings } from 'lucide-react';

export const DAYS_OF_WEEK = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' }
];

export default function StorefrontSettings({ 
  isOpen, 
  onClose, 
  weeklySchedule, 
  handleScheduleChange, 
  shiftChange, 
  setShiftChange, 
  handleSaveHours 
}: any) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-4xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
               <Settings size={18} />
             </div>
             <div>
               <h2 className="text-lg font-black text-zinc-100 uppercase tracking-widest">Master Schedule</h2>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Operating Hours & Shift Cutoffs</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors border border-zinc-800">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {DAYS_OF_WEEK.map((day) => {
              const sched = weeklySchedule[day.id] || { open: '08:00', close: '17:00', isClosed: true };
              return (
                <div key={day.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${sched.isClosed ? 'bg-zinc-950/50 border-zinc-800/50 opacity-60' : 'bg-zinc-950 border-zinc-800 shadow-inner'}`}>
                  <div className="flex items-center gap-3 w-28">
                    <button 
                      onClick={() => handleScheduleChange(day.id, 'isClosed', !sched.isClosed)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${sched.isClosed ? 'bg-rose-500/20 border border-rose-500/50' : 'bg-emerald-500/20 border border-emerald-500/50'}`}
                    >
                      <div className={`w-3 h-3 rounded-full absolute top-0.5 transition-all ${sched.isClosed ? 'left-0.5 bg-rose-400' : 'left-5 bg-emerald-400'}`} />
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{day.label.substring(0,3)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <input 
                      type="time" value={sched.open || ''} onChange={(e) => handleScheduleChange(day.id, 'open', e.target.value)} disabled={sched.isClosed}
                      className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 p-2 rounded-lg outline-none disabled:opacity-50"
                    />
                    <span className="text-zinc-600 text-[10px]">TO</span>
                    <input 
                      type="time" value={sched.close || ''} onChange={(e) => handleScheduleChange(day.id, 'close', e.target.value)} disabled={sched.isClosed}
                      className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 p-2 rounded-lg outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-zinc-800/50">
             <div className="flex-1 flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-inner w-full">
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5"><Clock size={12}/> Shift Change Cutoff</h4>
                 <p className="text-[9px] font-bold text-zinc-500">Time when Shift A transitions to Shift B</p>
               </div>
               <input 
                 type="time" value={shiftChange || ''} onChange={(e) => setShiftChange(e.target.value)}
                 className="bg-zinc-900 border border-amber-500/30 text-sm font-mono text-amber-400 p-2.5 rounded-xl outline-none focus:border-amber-400"
               />
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/50">
           <button onClick={handleSaveHours} className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-zinc-950 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
             <Save size={16} /> Commit Settings
           </button>
        </div>

      </div>
    </div>
  );
}