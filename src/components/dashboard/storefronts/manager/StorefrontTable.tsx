/* src/components/dashboard/storefronts/manager/StorefrontTable.tsx */
import React from 'react';
import Link from 'next/link';
import { Settings, Globe, Eye, User, ArrowUpDown, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';

interface TableProps {
  processedData: any[];
  requestSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  isEditMode: boolean;
  handleRowUpdate: (id: string, field: string, value: string) => void;
  availableStatuses: string[];
  availableCategories: string[];
}

export default function StorefrontTable({ 
  processedData, requestSort, sortConfig, isEditMode, handleRowUpdate, availableStatuses, availableCategories
}: TableProps) {

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={12} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-cyan-400" /> : <ChevronDown size={14} className="text-cyan-400" />;
  };

  const getRowStyle = (status: string, isOffline: boolean) => {
    if (isEditMode) return 'bg-amber-500/[0.02] hover:bg-amber-500/[0.05] border-l-2 border-l-amber-500/50';
    if (isOffline) return 'opacity-60 hover:bg-white/5 border-l-2 border-l-transparent';
    switch(status) {
      case 'ACTIVE': return 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] border-l-2 border-l-emerald-500/50';
      case 'IN_REVIEW': return 'bg-cyan-500/[0.02] hover:bg-cyan-500/[0.05] border-l-2 border-l-cyan-500/50';
      case 'CONTENT_ASSEMBLY': return 'bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] border-l-2 border-l-indigo-500/50';
      case 'BUILDING_CORE': return 'bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.05] border-l-2 border-l-fuchsia-500/50';
      case 'AWAITING_ASSETS': return 'bg-violet-500/[0.02] hover:bg-violet-500/[0.05] border-l-2 border-l-violet-500/50';
      case 'AWAITING_PAYMENT': return 'bg-amber-500/[0.02] hover:bg-amber-500/[0.05] border-l-2 border-l-amber-500/50';
      case 'ON_HOLD': return 'bg-rose-500/[0.02] hover:bg-rose-500/[0.05] border-l-2 border-l-rose-500/50';
      case 'PENDING_BUILD': return 'bg-zinc-500/[0.02] hover:bg-zinc-500/[0.05] border-l-2 border-l-zinc-500/50';
      default: return 'hover:bg-white/5 border-l-2 border-l-transparent';
    }
  };

  if (processedData.length === 0) {
    return (
      <div className="overflow-x-auto rounded-lg border border-zinc-800/50 bg-zinc-950/50">
        <div className="p-10 text-center flex flex-col items-center justify-center">
          <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Queue clear.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800/50 bg-zinc-950/50">
      <table className="w-full text-left border-collapse whitespace-nowrap select-none">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <th className="px-6 py-4 cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('business_name')}>
              <div className="flex items-center gap-2">Client / Business {getSortIcon('business_name')}</div>
            </th>
            <th className="px-6 py-4 hidden md:table-cell cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('category')}>
              <div className="flex items-center gap-2">Category {getSortIcon('category')}</div>
            </th>
            <th className="px-6 py-4 hidden lg:table-cell cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('plan_tier')}>
              <div className="flex items-center gap-2">Plan Tier {getSortIcon('plan_tier')}</div>
            </th>
            <th className="px-6 py-4 cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('status')}>
              <div className="flex items-center gap-2">Current Status {getSortIcon('status')}</div>
            </th>
            <th className="px-6 py-4 hidden xl:table-cell cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('created_at')}>
              <div className="flex items-center gap-2">Timeline {getSortIcon('created_at')}</div>
            </th>
            <th className="px-6 py-4 text-right">System Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {processedData.map((store) => {
            const rawStatus = (store.status || 'PENDING_BUILD') as string;
            const status = rawStatus as StorefrontStatus;
            const config = STOREFRONT_LIFECYCLE[status] || { label: rawStatus, badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
            const isOffline = rawStatus === 'MAINTENANCE' || rawStatus === 'HIDDEN' || rawStatus === 'CANCELED' || rawStatus === 'ON_HOLD';
            
            // 🚀 THE FIX: Awaiting Assets and In Review are real, LIVE websites. 
            const isLive = ['ACTIVE', 'MAINTENANCE', 'HIDDEN', 'AWAITING_ASSETS', 'IN_REVIEW'].includes(rawStatus);

            const createdDate = new Date(store.created_at);
            const formattedDate = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const daysActive = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <tr key={store.id} className={`transition-colors border-b border-zinc-800/50 ${getRowStyle(rawStatus, isOffline)}`}>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                      {store.brand_logo ? (
                        <img src={store.brand_logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-sm text-zinc-600 uppercase">{store.business_name?.charAt(0) || '?'}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      {isEditMode ? (
                        <input 
                          type="text" 
                          defaultValue={store.business_name} 
                          onBlur={(e) => handleRowUpdate(store.id, 'business_name', e.target.value)}
                          className="bg-zinc-950 border border-zinc-700 text-white text-sm font-bold tracking-tight rounded px-2 py-1 w-full max-w-[200px] focus:border-amber-500 outline-none"
                        />
                      ) : (
                        <span className="text-sm font-bold text-white tracking-tight truncate max-w-50 md:max-w-xs">{store.business_name}</span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">/{store.slug}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 hidden md:table-cell text-xs font-medium text-zinc-400 capitalize">
                  {isEditMode ? (
                    <select 
                      value={store.industry_tag || store.category || store.industry || ''} 
                      onChange={(e) => handleRowUpdate(store.id, 'category', e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded px-2 py-1.5 focus:border-amber-500 outline-none cursor-pointer w-full max-w-[150px]"
                    >
                      <option value="" disabled>Select Category</option>
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : (
                    store.industry_tag || store.category || store.industry || '--'
                  )}
                </td>

                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-[10px] font-black text-zinc-300 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/50 uppercase tracking-widest">
                    {store.plan_tier || store.selected_plan || '--'}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {isEditMode ? (
                    <select 
                      value={rawStatus} 
                      onChange={(e) => handleRowUpdate(store.id, 'status', e.target.value)}
                      className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded px-2 py-1.5 focus:border-amber-500 outline-none cursor-pointer"
                    >
                      {availableStatuses.map(s => (
                        <option key={s} value={s}>{STOREFRONT_LIFECYCLE[s as StorefrontStatus]?.label || s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${config.badgeColor}`}>
                      {config.label}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 hidden xl:table-cell">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-300 font-mono">{formattedDate}</span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {daysActive === 0 ? 'Day 1' : `${daysActive} Days`}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    
                    <Link 
                      href={`/portal/${store.id}`}
                      target="_blank"
                      className="p-1.5 rounded-md text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all flex items-center justify-center"
                      title="Enter Client Portal (Impersonate)"
                    >
                      <User size={14} />
                    </Link>

                    {/* 🚀 THE FIX: It now correctly assigns the Emerald Globe to these Live sites */}
                    <a 
                      href={`https://storefronts.alternativesolutions.io/${store.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                        isLive 
                          ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20' 
                          : 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20'
                      }`}
                      title={isLive ? "View Live Site" : "View Staging Preview"}
                    >
                      {isLive ? <Globe size={14} /> : <Eye size={14} />}
                    </a>

                    <Link 
                      href={`/dashboard/storefronts/${store.id}`}
                      className="p-1.5 rounded-md text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-all flex items-center justify-center"
                      title="Open Command Hub"
                    >
                      <Settings size={14} />
                    </Link>

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}