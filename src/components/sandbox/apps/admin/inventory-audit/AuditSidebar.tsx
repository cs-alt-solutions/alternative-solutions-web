import React from 'react';
import { Filter, CheckCircle, Flame, ImageOff, AlertTriangle, Tag } from 'lucide-react';

export default function AuditSidebar({
  reportType, setReportType,
  categoryFilter, setCategoryFilter,
  subCategoryFilter, setSubCategoryFilter,
  brandFilter, setBrandFilter,
  mainCategories, availableSubs, availableBrands
}: any) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 h-fit sticky top-6">
      
      {/* Quick Reports */}
      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
        <Filter size={14}/> Report Type
      </h3>
      <div className="space-y-2 mb-8">
        <button onClick={() => setReportType('ALL')} className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'ALL' ? 'bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
          Complete Warehouse <CheckCircle size={14} className={reportType === 'ALL' ? 'opacity-100' : 'opacity-0'} />
        </button>
        <button onClick={() => setReportType('PROMO')} className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'PROMO' ? 'bg-pink-500/10 border-pink-500/50 text-pink-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
          Active Promos <Flame size={14} className={reportType === 'PROMO' ? 'opacity-100' : 'opacity-0'} />
        </button>
        <button onClick={() => setReportType('MISSING_ASSETS')} className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'MISSING_ASSETS' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
          Missing Images <ImageOff size={14} className={reportType === 'MISSING_ASSETS' ? 'opacity-100' : 'opacity-0'} />
        </button>
        <button onClick={() => setReportType('LOW_STOCK')} className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'LOW_STOCK' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
          Low Stock (1-15) <AlertTriangle size={14} className={reportType === 'LOW_STOCK' ? 'opacity-100' : 'opacity-0'} />
        </button>
        <button onClick={() => setReportType('OOS')} className={`w-full flex items-center justify-between p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'OOS' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
          Out of Stock <AlertTriangle size={14} className={reportType === 'OOS' ? 'opacity-100' : 'opacity-0'} />
        </button>
      </div>

      {/* Deep Filters */}
      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
        <Tag size={14}/> Deep Filters
      </h3>
      <div className="space-y-4">
         <div>
           <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Category</label>
           <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setSubCategoryFilter('All'); }} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none focus:border-fuchsia-500/50">
             <option value="All">All Categories</option>
             {mainCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
           </select>
         </div>
         
         {categoryFilter !== 'All' && availableSubs.length > 0 && (
           <div className="animate-in fade-in slide-in-from-top-2">
             <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Subcategory</label>
             <select value={subCategoryFilter} onChange={(e) => setSubCategoryFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-fuchsia-400 outline-none focus:border-fuchsia-500/50">
               <option value="All">All {categoryFilter}</option>
               {availableSubs.map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
             </select>
           </div>
         )}

         <div>
           <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Brand</label>
           <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 outline-none focus:border-emerald-500/50">
             <option value="All">All Brands</option>
             {(availableBrands as string[]).map(b => <option key={b} value={b}>{b}</option>)}
           </select>
         </div>
      </div>
    </div>
  );
}