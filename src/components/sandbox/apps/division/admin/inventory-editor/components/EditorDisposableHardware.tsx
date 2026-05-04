import React from 'react';
import { Cpu } from 'lucide-react';

export default function EditorDisposableHardware({ updatedItem, setUpdatedItem }: any) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Cpu size={16} className="text-emerald-500" />
        <h3 className="text-xs font-black text-zinc-300 tracking-widest uppercase">Hardware Configuration</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Chambers / Tanks
          </label>
          <select
            value={updatedItem?.tankCount || 1}
            onChange={(e) => setUpdatedItem({ ...updatedItem, tankCount: parseInt(e.target.value) })}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm font-bold rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          >
            <option value={1}>1 - Single Tank</option>
            <option value={2}>2 - Dual Chamber</option>
            <option value={3}>3 - Tri-Tank Switch</option>
            <option value={4}>4 - Quad-Core</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 justify-end">
          <label className="flex items-center gap-2.5 cursor-pointer p-2 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors h-10.5">
            <input
              type="checkbox"
              checked={updatedItem?.includesPreRoll || false}
              onChange={(e) => setUpdatedItem({ ...updatedItem, includesPreRoll: e.target.checked })}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-0.5">+ Pre-Roll</span>
          </label>
        </div>

        <div className="flex flex-col gap-1.5 justify-end">
          <label className="flex items-center gap-2.5 cursor-pointer p-2 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors h-10.5">
            <input
              type="checkbox"
              checked={updatedItem?.includesGummy || false}
              onChange={(e) => setUpdatedItem({ ...updatedItem, includesGummy: e.target.checked })}
              className="accent-fuchsia-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest mt-0.5">+ Gummy</span>
          </label>
        </div>
      </div>
    </div>
  );
}