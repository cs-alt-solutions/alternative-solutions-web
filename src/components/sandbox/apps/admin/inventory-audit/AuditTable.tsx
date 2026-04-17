import React, { useState } from 'react';
import { FileText, ImageOff, ArrowUpDown, CornerDownRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getCalculatedStock } from './audit-utils';

export default function AuditTable({ auditData, handleSort }: any) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-inner">
      <div className="bg-zinc-900/80 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Manifest Preview</span>
        <span className="text-[10px] font-mono font-bold text-fuchsia-400 bg-fuchsia-500/10 border border-fuchsia-500/30 px-3 py-1 rounded-full">{auditData.length} Master Records</span>
      </div>
      
      <div className="max-h-[65vh] overflow-y-auto scrollbar-hide">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 border-b border-zinc-800">
            <tr>
              <th className="py-4 px-6 w-16"></th>
              <th onClick={() => handleSort('name')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group">
                <div className="flex items-center gap-1.5">Product Info <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100" /></div>
              </th>
              <th onClick={() => handleSort('taxonomy')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group">
                <div className="flex items-center gap-1.5">Taxonomy <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100" /></div>
              </th>
              <th onClick={() => handleSort('stock')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right cursor-pointer hover:text-zinc-300 transition-colors group">
                <div className="flex items-center justify-end gap-1.5">System Count <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {auditData.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <FileText size={32} className="mx-auto text-zinc-700 mb-4" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No records match current filters</span>
                </td>
              </tr>
            ) : auditData.map((item: any) => {
              const hasImg = item.imageUrl || item.iconUrl;
              const stockNum = getCalculatedStock(item);
              const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
              const isExpanded = expandedItems[item.id];

              return (
                <React.Fragment key={item.id}>
                  {/* MASTER ROW */}
                  <tr 
                    onClick={() => hasVariants && toggleExpand(item.id)}
                    className={`hover:bg-zinc-900/60 transition-colors bg-zinc-950/20 ${hasVariants ? 'cursor-pointer' : ''}`}
                  >
                    <td className="py-4 px-6 align-top">
                       {hasImg ? (
                          <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shadow-sm">
                             <img src={item.imageUrl || item.iconUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                       ) : (
                          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500" title="Missing Image">
                             <ImageOff size={16} />
                          </div>
                       )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-sm font-bold text-zinc-100">{item.name}</span>
                         {item.dailyDeal && <span className="bg-pink-500/20 text-pink-400 border border-pink-500/50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">Promo</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest">{item.brand || 'No Brand'}</span>
                        <span className="text-[9px] font-mono text-zinc-600 border-l border-zinc-700 pl-3">{item.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-black text-zinc-300 block uppercase tracking-widest">{item.mainCategory}</span>
                      <span className="text-[9px] font-medium text-zinc-500 block mt-1 uppercase tracking-wider">↳ {item.subCategory || 'General'}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`text-base font-mono font-black ${stockNum <= 0 ? 'text-rose-500' : stockNum <= 15 ? 'text-amber-500' : 'text-emerald-400'}`}>
                        {stockNum}
                      </span>
                      {hasVariants && (
                         <span className="flex items-center justify-end gap-1 mt-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors">
                           Total Stock {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                         </span>
                      )}
                    </td>
                  </tr>

                  {/* VARIANT SUB-ROWS (COLLAPSIBLE) */}
                  {hasVariants && isExpanded && item.options.map((opt: any) => (
                     <tr key={`${item.id}-${opt.id}`} className="bg-zinc-950/60 border-t-0">
                        <td className="py-2 px-6 border-l-2 border-zinc-800"></td>
                        <td colSpan={2} className="py-2 px-6">
                          <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                            <CornerDownRight size={14} className="text-zinc-600 shrink-0"/>
                            {opt.label}
                          </div>
                        </td>
                        <td className="py-2 px-6 text-right">
                          <span className={`text-xs font-mono font-bold ${opt.stock <= 0 ? 'text-rose-500/80' : 'text-zinc-300'}`}>{opt.stock || 0}</span>
                        </td>
                     </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}