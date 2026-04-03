import React, { useState } from 'react';
import { ArrowUpDown, Boxes, Leaf, Flame, Box, Image as ImageIcon, Award, Star, Edit3, Zap, Check, X } from 'lucide-react';

export default function AdminInventoryTable({ processedInventory, handleSort, openEditor, mainCategories, subCategories, onQuickSave }: any) {
  
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditForm, setQuickEditForm] = useState<any>({});

  const startQuickEdit = (item: any) => {
    setQuickEditId(item.id);
    const displayPrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
    const displayStock = item.onHand || 0;
    
    setQuickEditForm({
      ...item,
      quickPrice: displayPrice,
      quickStock: displayStock
    });
  };

  const saveQuickEdit = () => {
    const updated = {
      ...quickEditForm,
      price: Number(quickEditForm.quickPrice) || 0,
      onHand: Number(quickEditForm.quickStock) || 0,
    };
    
    if (updated.sizes && updated.sizes.length > 0) {
       updated.sizes[0].price = Number(quickEditForm.quickPrice) || 0;
    }

    onQuickSave(updated, false);
    setQuickEditId(null);
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-inner">
      <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800">
              <th onClick={() => handleSort('name')} className="py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group">
                <div className="flex items-center gap-2">Identity <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100 shrink-0" /></div>
              </th>
              <th onClick={() => handleSort('category')} className="hidden sm:table-cell py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group">
                <div className="flex items-center gap-2">Category <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100 shrink-0" /></div>
              </th>
              <th onClick={() => handleSort('subCategory')} className="py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group">
                <div className="flex items-center gap-2">Sub-Class <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100 shrink-0" /></div>
              </th>
              <th className="hidden md:table-cell py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Tags
              </th>
              <th className="py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Promo Status
              </th>
              <th onClick={() => handleSort('price')} className="py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group text-right">
                <div className="flex items-center justify-end gap-2">Base <span className="hidden lg:inline">Price</span> <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100 shrink-0" /></div>
              </th>
              <th onClick={() => handleSort('stock')} className="py-3 px-3 sm:px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group text-right">
                <div className="flex items-center justify-end gap-2">Vault <span className="hidden lg:inline">Stock</span> <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100 shrink-0" /></div>
              </th>
              <th className="py-3 px-3 sm:px-4 text-right text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {processedInventory.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <Boxes size={32} className="mx-auto text-zinc-700 mb-3" />
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">No products match your filters</p>
                </td>
              </tr>
            ) : processedInventory.map((item: any) => {
              
              if (quickEditId === item.id) {
                 return (
                    <tr key={`edit-${item.id}`} className="bg-cyan-500/5 border-b border-cyan-500/20 shadow-inner">
                       <td className="py-3 px-3 sm:px-4">
                         <div className="flex flex-col gap-1.5">
                            <input type="text" value={quickEditForm.name} onChange={e => setQuickEditForm({...quickEditForm, name: e.target.value})} placeholder="Name..." className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs font-bold text-zinc-100 outline-none focus:border-cyan-500/50" />
                            <input type="text" value={quickEditForm.brand || ''} onChange={e => setQuickEditForm({...quickEditForm, brand: e.target.value})} placeholder="Brand / Maker..." className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-1.5 text-[10px] font-bold text-emerald-400 outline-none focus:border-cyan-500/50" />
                         </div>
                       </td>
                       <td className="hidden sm:table-cell py-3 px-3 sm:px-4">
                         <select value={quickEditForm.mainCategory} onChange={e => setQuickEditForm({...quickEditForm, mainCategory: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-[10px] font-bold text-zinc-300 outline-none">
                           {mainCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                         </select>
                       </td>
                       <td className="py-3 px-3 sm:px-4">
                         <select value={quickEditForm.subCategory} onChange={e => setQuickEditForm({...quickEditForm, subCategory: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-[10px] font-bold text-zinc-300 outline-none">
                           {subCategories[quickEditForm.mainCategory]?.map((s: string) => <option key={s} value={s}>{s}</option>) || <option value="Uncategorized">Uncategorized</option>}
                         </select>
                       </td>
                       <td className="hidden md:table-cell py-3 px-3 sm:px-4">
                          <div className="flex gap-1.5 flex-wrap">
                             <button onClick={()=>setQuickEditForm({...quickEditForm, isTopShelf: !quickEditForm.isTopShelf})} className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition-colors ${quickEditForm.isTopShelf ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-amber-500/30'}`}>Top Shelf</button>
                             <button onClick={()=>setQuickEditForm({...quickEditForm, featured: !quickEditForm.featured})} className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition-colors ${quickEditForm.featured ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-cyan-500/30'}`}>Featured</button>
                          </div>
                       </td>
                       <td className="py-3 px-3 sm:px-4">
                          <button onClick={()=>setQuickEditForm({...quickEditForm, dailyDeal: !quickEditForm.dailyDeal, dealType: !quickEditForm.dailyDeal ? 'Daily Deal' : quickEditForm.dealType})} className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition-colors ${quickEditForm.dailyDeal ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-rose-500/30'}`}>Promo Active</button>
                       </td>
                       <td className="py-3 px-3 sm:px-4 text-right">
                         <input type="number" value={quickEditForm.quickPrice} onChange={e => setQuickEditForm({...quickEditForm, quickPrice: e.target.value})} className="w-16 bg-zinc-950 border border-amber-500/30 rounded-lg p-2 text-xs font-mono font-bold text-amber-400 outline-none text-right focus:border-amber-500" />
                       </td>
                       <td className="py-3 px-3 sm:px-4 text-right">
                         <input type="number" value={quickEditForm.quickStock} onChange={e => setQuickEditForm({...quickEditForm, quickStock: e.target.value})} className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs font-mono font-bold text-zinc-100 outline-none text-right focus:border-cyan-500/50" />
                       </td>
                       <td className="py-3 px-3 sm:px-4 text-right">
                         <div className="flex justify-end gap-1.5">
                           <button onClick={saveQuickEdit} className="p-2 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400 rounded-lg text-zinc-950 shadow-md transition-colors"><Check size={14}/></button>
                           <button onClick={()=>setQuickEditId(null)} className="p-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors"><X size={14}/></button>
                         </div>
                       </td>
                    </tr>
                 );
              }

              const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
              const displayStock = item.onHand || (item.options?.length > 0 ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
              const displayPrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
              const isAbundant = displayStock >= 15;

              return (
                <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors group">
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden text-zinc-600">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ItemIcon size={16} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`font-black text-xs sm:text-sm truncate ${item.isTopShelf ? 'text-amber-400' : 'text-zinc-100'}`}>{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim() || 'Unnamed Item'}</span>
                        {item.brand && <span className="text-[8px] font-bold text-emerald-500/70 uppercase tracking-widest truncate mt-0.5">BY {item.brand}</span>}
                        <span className="text-[8px] font-mono text-zinc-600 mt-0.5 truncate">{item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell py-3 px-3 sm:px-4">
                    <span className="text-[9px] sm:text-[10px] font-bold text-zinc-300 uppercase tracking-widest break-words">{item.mainCategory}</span>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[8px] font-bold text-zinc-500 uppercase text-center">{item.subCategory || 'Gen'}</span>
                      {item.strainType && item.strainType !== 'N/A' && <span className="px-1.5 py-0.5 bg-emerald-500/5 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-400/80 uppercase text-center">{item.strainType}</span>}
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-3 px-3 sm:px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.isTopShelf && <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-0.5"><Award size={8}/> Top Shelf</span>}
                      {item.featured && <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-0.5"><Star size={8}/> Featured</span>}
                      {!item.isTopShelf && !item.featured && <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">—</span>}
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {item.dailyDeal ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md">
                          <Flame size={10} className="shrink-0" /> {item.dealLogic && item.dealLogic !== 'STANDARD' ? item.dealLogic : 'Active'}
                        </span>
                        <span className="text-[8px] font-bold text-zinc-500 line-clamp-2 leading-tight">{item.dealText || item.dealType}</span>
                      </div>
                    ) : (
                      <span className="text-[8px] sm:text-[9px] font-bold text-zinc-600 uppercase tracking-widest">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right">
                    <span className="text-xs sm:text-sm font-black text-zinc-300 font-mono">${displayPrice.toFixed(0) || '0'}</span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right">
                    <span className={`text-xs sm:text-sm font-black font-mono ${displayStock <= 0 ? 'text-rose-500' : isAbundant && !item.dailyDeal ? 'text-cyan-400' : 'text-emerald-400'}`}>
                      {displayStock}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                       <button onClick={() => startQuickEdit(item)} className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-all shadow-inner active:scale-95 inline-flex" title="Quick Edit">
                         <Zap size={14} />
                       </button>
                       <button onClick={() => openEditor(item)} className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-amber-400 hover:border-amber-400/50 transition-all shadow-inner active:scale-95 inline-flex" title="Full Editor">
                         <Edit3 size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-zinc-950/80 border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Displaying {processedInventory.length} items</span>
        <span className="text-[10px] font-mono text-zinc-600">DB_SYNC_ACTIVE</span>
      </div>
    </div>
  );
}