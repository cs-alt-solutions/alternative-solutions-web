/* src/components/dashboard/storefronts/manager/StorefrontFilters.tsx */
import React from 'react';
import { Search, Users, FlaskConical, LayoutGrid, Filter } from 'lucide-react';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  activeTab: 'ALL' | 'CLIENTS' | 'PROTOTYPES';
  setActiveTab: (val: 'ALL' | 'CLIENTS' | 'PROTOTYPES') => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  planFilter: string;
  setPlanFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  availableCategories: string[];
  availablePlans: string[];
  availableStatuses: string[];
}

export default function StorefrontFilters({
  search, setSearch, activeTab, setActiveTab,
  categoryFilter, setCategoryFilter,
  planFilter, setPlanFilter,
  statusFilter, setStatusFilter,
  availableCategories, availablePlans, availableStatuses
}: FiltersProps) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          <button onClick={() => setActiveTab('CLIENTS')} className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'CLIENTS' ? 'bg-cyan-500/10 text-cyan-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><Users size={12} /> Active Clients</button>
          <button onClick={() => setActiveTab('PROTOTYPES')} className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'PROTOTYPES' ? 'bg-fuchsia-500/10 text-fuchsia-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><FlaskConical size={12} /> Prototypes</button>
          <button onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'ALL' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutGrid size={12} /> All</button>
        </div>
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input type="text" placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-medium placeholder:text-zinc-600 outline-none transition-all shadow-inner" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 pt-2">
        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full sm:w-44 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
            <option value="ALL">All Categories</option>
            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="w-full sm:w-40 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
            <option value="ALL">All Plans</option>
            {availablePlans.map(plan => <option key={plan} value={plan}>{plan.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="relative flex-1 sm:flex-none">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-40 bg-zinc-950/50 border border-zinc-800 focus:border-cyan-500/50 rounded-lg pl-8 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
            <option value="ALL">All Statuses</option>
            {availableStatuses.map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}