'use client';

import React, { useState } from 'react';
import { Search, X, Package, ChevronRight } from 'lucide-react';

export default function InventorySelectorModal({ isOpen, onClose, inventoryMatrix, onSelect, context }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = (inventoryMatrix || []).filter((item: any) => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.mainCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // FIXED: Changed z-[60] to z-60
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-4xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Package size={18} className="text-emerald-400" /> Select Vault Target
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Assigning to: <span className="text-emerald-400">{context?.lane}</span> on Day {context?.dayId}
              </p>
            </div>
            <button onClick={onClose} className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors border border-zinc-800">
              <X size={16} />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by product name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-bold placeholder:text-zinc-600 pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-2">
          {filteredItems.length > 0 ? filteredItems.map((item: any) => {
             const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
             return (
               <button 
                 key={item.id} 
                 onClick={() => { setSearchTerm(''); onSelect(item); }}
                 className="w-full flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-emerald-500/50 rounded-2xl transition-all group active:scale-[0.98] text-left"
               >
                 <div>
                   <h4 className="text-xs font-black text-zinc-200 group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">{item.mainCategory}</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="text-right">
                     <span className="block text-[8px] font-black uppercase tracking-widest text-emerald-500/50 mb-0.5">Stock</span>
                     <span className="text-xs font-mono font-black text-zinc-300">{totalStock}</span>
                   </div>
                   <ChevronRight size={16} className="text-zinc-600 group-hover:text-emerald-400" />
                 </div>
               </button>
             );
          }) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600">
              <Package size={32} className="mb-2 opacity-20" />
              <span className="text-[10px] font-black uppercase tracking-widest">No products found</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}