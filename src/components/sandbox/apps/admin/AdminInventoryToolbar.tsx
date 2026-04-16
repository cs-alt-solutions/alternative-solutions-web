import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function AdminInventoryToolbar({ 
  searchTerm, setSearchTerm, 
  categoryFilter, setCategoryFilter, mainCategories, 
  subCategoryFilter, setSubCategoryFilter, subCategories, // NEW PROPS
  statusFilter, setStatusFilter 
}: any) {
  
  // Get the available subs for the currently selected main category
  const availableSubs = categoryFilter !== 'All' ? (subCategories[categoryFilter] || []) : [];

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
      <div className="flex flex-wrap w-full md:w-auto gap-3">
        
        {/* Main Category Dropdown */}
        <div className="relative flex-1 min-w-[140px]">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select 
            value={categoryFilter} 
            onChange={(e) => {
               setCategoryFilter(e.target.value);
               setSubCategoryFilter('All'); // Reset sub filter when main cat changes
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {mainCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
        </div>

        {/* NEW: Subcategory Dropdown (Only shows if a main cat is selected and has subs) */}
        {categoryFilter !== 'All' && availableSubs.length > 0 && (
          <div className="relative flex-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
            <select 
              value={subCategoryFilter} 
              onChange={(e) => setSubCategoryFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-4 pr-4 text-[10px] font-black uppercase tracking-widest text-cyan-400 outline-none appearance-none cursor-pointer focus:border-cyan-500/50 transition-colors"
            >
              <option value="All">All {categoryFilter}</option>
              {availableSubs.map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-600 pointer-events-none" />
          </div>
        )}

        {/* Status Dropdown */}
        <div className="relative flex-1 min-w-[140px]">
           <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none appearance-none cursor-pointer"
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