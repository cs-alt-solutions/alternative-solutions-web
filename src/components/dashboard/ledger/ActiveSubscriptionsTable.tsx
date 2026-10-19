import React, { useState } from 'react';
import { CalendarClock, ChevronDown, ChevronUp, Receipt, Eye } from 'lucide-react';

const formatCurrency = (val: any) => {
  if (val === null || val === undefined) return '0.00';
  const num = Number(val);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function ActiveSubscriptionsTable({ storefronts, isLoading, onViewReceipt }: any) {
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>(null);

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/50 shrink-0">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <CalendarClock size={14} className="text-emerald-500" /> Active Subscriptions
        </h3>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-zinc-800/50 bg-black/40">
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Client / Storefront</th>
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Tier</th>
              <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">LTV</th>
              <th className="p-4 text-[10px] font-mono text-emerald-400 uppercase tracking-widest text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  Loading Subscriptions...
                </td>
              </tr>
            ) : storefronts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  No active storefronts found.
                </td>
              </tr>
            ) : (
              storefronts.map((store: any) => {
                const isExpanded = expandedStoreId === store.id;

                return (
                  <React.Fragment key={store.id}>
                    <tr 
                      onClick={() => setExpandedStoreId(isExpanded ? null : store.id)}
                      className={`transition-colors group cursor-pointer ${isExpanded ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'}`}
                    >
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-white font-bold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse shrink-0" />
                            {store.business_name}
                          </span>
                          {store.contact_email && (
                            <span className="text-[10px] font-mono text-zinc-500 ml-5">{store.contact_email}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-zinc-400 capitalize">{store.displayTier}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest">
                          ${formatCurrency(store.ltv)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {store.isPromo ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm text-emerald-400 font-bold">
                                ${formatCurrency(store.actualPaid)} <span className="text-[10px] text-zinc-500 font-normal">/mo</span>
                              </span>
                              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                                PROMO
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-emerald-400 font-bold">
                              ${formatCurrency(store.actualPaid)} <span className="text-[10px] text-zinc-500 font-normal">/mo</span>
                            </span>
                          )}
                          {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500 group-hover:text-cyan-400" />}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-black/40 border-b border-zinc-800/80 animate-in fade-in slide-in-from-top-2">
                        <td colSpan={4} className="p-0">
                          <div className="p-4 md:p-6 bg-zinc-950 shadow-inner">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Receipt size={12}/> Invoice Ledger
                            </h4>
                            {store.invoices.length === 0 ? (
                              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest p-4 border border-dashed border-zinc-800 rounded-xl text-center">
                                No invoices generated yet.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {store.invoices.map((inv: any) => (
                                  <div key={inv.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                                    <div className="flex items-center gap-4">
                                      <span className="text-xs font-mono text-zinc-400">{inv.date}</span>
                                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                        {inv.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm font-bold text-emerald-400">${formatCurrency(inv.amount)}</span>
                                      {inv.hostedUrl && (
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); onViewReceipt(inv.hostedUrl); }} 
                                          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                          <Eye size={12}/> View
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}