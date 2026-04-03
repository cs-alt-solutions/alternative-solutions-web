import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function AdminInventoryToolbar({ 
  searchTerm, setSearchTerm, 
  categoryFilter, setCategoryFilter, mainCategories, 
  statusFilter, setStatusFilter 
}: any) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
      {/* Search */}
      <div className="relative w-full md:w-auto md:flex-1">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search by product name or ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex w-full md:w-auto gap-3">
        <div className="relative flex-1 md:w-48">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9 pr-4 text-xs font-bold text-zinc-300 outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {mainCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
        </div>

        <div className="relative flex-1 md:w-48">
           <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-zinc-300 outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active Promo">🔥 Active Promo</option>
            <option value="Top Shelf">🏆 Top Shelf</option>
            <option value="Featured">⭐ Featured</option>
            <option value="Low Stock">⚠️ Low Stock</option>
            <option value="Out of Stock">🚫 Out of Stock</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}