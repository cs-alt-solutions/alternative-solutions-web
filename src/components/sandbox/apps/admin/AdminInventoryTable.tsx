// sandbox/apps/admin/AdminInventoryTable.tsx
import React, { useState } from 'react';
import { ArrowUpDown, Boxes, Leaf, Flame, Box, Image as ImageIcon, Award, Star, Edit3, Zap, Check, X, Archive, ArchiveRestore } from 'lucide-react';

export default function AdminInventoryTable({ processedInventory, handleSort, openEditor, mainCategories, subCategories, onQuickSave, onToggleArchive }: any) {
  
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditForm, setQuickEditForm] = useState<any>({});

  const startQuickEdit = (item: any) => {
    setQuickEditId(item.id);
    const displayPrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
    
    // STRICT VARIANT DETECTION
    const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
    let displayStock = 0;
    
    if (hasVariants) {
       displayStock = item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0);
    } else {
       displayStock = item.onHand !== undefined ? Number(item.onHand) : 0;
    }
    
    setQuickEditForm({
      ...item,
      quickPrice: displayPrice,
      quickStock: displayStock,
      hasVariants: hasVariants
    });
  };

  const saveQuickEdit = () => {
    const updated = {
      ...quickEditForm,
      price: Number(quickEditForm.quickPrice) || 0,
    };
    
    // Only update top-level onHand if this isn't a variant-driven item
    if (!quickEditForm.hasVariants) {
       updated.onHand = quickEditForm.quickStock === '' ? 0 : Number(quickEditForm.quickStock);
    }
    
    if (updated.sizes && updated.sizes.length > 0) {
       updated.sizes[0].price = Number(quickEditForm.quickPrice) || 0;
    }

    // Clean up our temporary quick edit keys so they don't bloat the database payload
    delete updated.quickPrice;
    delete updated.quickStock;
    delete updated.hasVariants;

    onQuickSave(updated, false);
    setQuickEditId(null);
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-inner">
      {/* Completely removed overflow-x-auto to ensure it behaves as a block */}
      <div className="w-full">
        {/* Set table-layout: fixed to force columns to respect constraints */}
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800">
              <th onClick={() => handleSort('name')} className="py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group w-1/3">
                <div className="flex items-center gap-1">Identity <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100 shrink-0 hidden sm:block" /></div>
              </th>
              <th onClick={() => handleSort('category')} className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group w-1/6">
                <div className="flex items-center gap-1">Category <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100 shrink-0 hidden sm:block" /></div>
              </th>
              <th onClick={() => handleSort('subCategory')} className="py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group w-1/6">
                <div className="flex items-center gap-1">Class <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100 shrink-0 hidden sm:block" /></div>
              </th>
              <th className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 w-1/12">
                Tags
              </th>
              <th className="hidden md:table-cell py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 w-1/12">
                Promo
              </th>
              <th onClick={() => handleSort('price')} className="py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group text-right w-1/12">
                <div className="flex items-center justify-end gap-1">Price <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100 shrink-0 hidden sm:block" /></div>
              </th>
              <th onClick={() => handleSort('stock')} className="py-2 sm:py-3 px-2 sm:px-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group text-right w-1/12">
                <div className="flex items-center justify-end gap-1">Stock <ArrowUpDown size={10} className="opacity-50 group-hover:opacity-100 shrink-0 hidden sm:block" /></div>
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-3 text-right text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500  sm:w-25">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {processedInventory.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <Boxes size={32} className="mx-auto text-zinc-700 mb-3" />
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">No products match your filters</p>
                </td>
              </tr>
            ) : processedInventory.map((item: any) => {
              
              if (quickEditId === item.id) {
                 return (
                    <tr key={`edit-${item.id}`} className="bg-cyan-500/5 border-b border-cyan-500/20 shadow-inner">
                       <td className="py-2 sm:py-3 px-2 sm:px-3">
                         <div className="flex flex-col gap-1">
                            <input type="text" value={quickEditForm.name} onChange={e => setQuickEditForm({...quickEditForm, name: e.target.value})} placeholder="Name..." className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-[10px] sm:text-xs font-bold text-zinc-100 outline-none focus:border-cyan-500/50" />
                            <input type="text" value={quickEditForm.brand || ''} onChange={e => setQuickEditForm({...quickEditForm, brand: e.target.value})} placeholder="Brand..." className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1 text-[8px] sm:text-[9px] font-bold text-emerald-400 outline-none focus:border-cyan-500/50" />
                         </div>
                       </td>
                       <td className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-3">
                         <select value={quickEditForm.mainCategory} onChange={e => setQuickEditForm({...quickEditForm, mainCategory: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-[9px] font-bold text-zinc-300 outline-none">
                           {mainCategories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                         </select>
                       </td>
                       <td className="py-2 sm:py-3 px-2 sm:px-3">
                         <select value={quickEditForm.subCategory} onChange={e => setQuickEditForm({...quickEditForm, subCategory: e.target.value})} className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-[9px] font-bold text-zinc-300 outline-none">
                           {subCategories[quickEditForm.mainCategory]?.map((s: string) => <option key={s} value={s}>{s}</option>) || <option value="Uncategorized">Uncategorized</option>}
                         </select>
                       </td>
                       <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-3">
                          <div className="flex flex-col gap-1">
                             <button onClick={()=>setQuickEditForm({...quickEditForm, isTopShelf: !quickEditForm.isTopShelf})} className={`w-full py-1 rounded text-[7px] font-black uppercase border transition-colors ${quickEditForm.isTopShelf ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'}`}>Top</button>
                             <button onClick={()=>setQuickEditForm({...quickEditForm, featured: !quickEditForm.featured})} className={`w-full py-1 rounded text-[7px] font-black uppercase border transition-colors ${quickEditForm.featured ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'}`}>Feat</button>
                          </div>
                       </td>
                       <td className="hidden md:table-cell py-2 sm:py-3 px-2 sm:px-3">
                          <button onClick={()=>setQuickEditForm({...quickEditForm, dailyDeal: !quickEditForm.dailyDeal, dealType: !quickEditForm.dailyDeal ? 'Daily Deal' : quickEditForm.dealType})} className={`w-full py-1 rounded text-[7px] font-black uppercase border transition-colors ${quickEditForm.dailyDeal ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'}`}>Promo</button>
                       </td>
                       <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                         <input type="number" value={quickEditForm.quickPrice} onChange={e => setQuickEditForm({...quickEditForm, quickPrice: e.target.value})} className="w-10 sm:w-12 bg-zinc-950 border border-amber-500/30 rounded-md p-1.5 text-[10px] sm:text-xs font-mono font-bold text-amber-400 outline-none text-right focus:border-amber-500" />
                       </td>
                       
                       {/* DYNAMIC STOCK EDIT COLUMN */}
                       <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                         {quickEditForm.hasVariants ? (
                           <div className="flex flex-col items-end gap-0.5">
                             <span className="text-[10px] sm:text-xs font-mono font-black text-zinc-500">{quickEditForm.quickStock}</span>
                             <span className="text-[6px] font-black text-amber-500 uppercase tracking-widest border border-amber-500/30 bg-amber-500/10 px-1 py-0.5 rounded">Editor</span>
                           </div>
                         ) : (
                           <input type="number" value={quickEditForm.quickStock} onChange={e => setQuickEditForm({...quickEditForm, quickStock: e.target.value})} className="w-10 sm:w-12 bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-[10px] sm:text-xs font-mono font-bold text-zinc-100 outline-none text-right focus:border-cyan-500/50" />
                         )}
                       </td>

                       <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                         <div className="flex flex-col sm:flex-row justify-end gap-1">
                           <button onClick={saveQuickEdit} className="p-1.5 sm:p-2 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400 rounded-md text-zinc-950 shadow-md transition-colors flex justify-center"><Check size={12}/></button>
                           <button onClick={()=>setQuickEditId(null)} className="p-1.5 sm:p-2 bg-zinc-950 border border-zinc-700 rounded-md text-zinc-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors flex justify-center"><X size={12}/></button>
                         </div>
                       </td>
                    </tr>
                 );
              }

              const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
              
              // STRICT VARIANT DETECTION FOR STANDARD DISPLAY
              const hasVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
              let displayStock = 0;
              if (hasVariants) {
                 displayStock = item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0);
              } else {
                 displayStock = item.onHand !== undefined ? Number(item.onHand) : 0;
              }

              const displayPrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
              const isAbundant = displayStock >= 15;

              return (
                <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors group">
                  <td className="py-2 sm:py-3 px-2 sm:px-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="hidden sm:flex w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-zinc-950 border border-zinc-800 items-center justify-center shrink-0 overflow-hidden text-zinc-600">
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ItemIcon size={12} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        {/* Allowed text to wrap naturally instead of truncating off-screen */}
                        <span className={`font-black text-[9px] sm:text-[11px] leading-tight wrap-break-word ${item.isTopShelf ? 'text-amber-400' : 'text-zinc-100'}`}>{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim() || 'Unnamed Item'}</span>
                        {item.brand && <span className="text-[6px] sm:text-[7px] font-bold text-emerald-500/70 uppercase tracking-widest wrap-break-word mt-0.5">BY {item.brand}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell py-2 sm:py-3 px-2 sm:px-3">
                    <span className="text-[7px] sm:text-[8px] font-bold text-zinc-400 uppercase tracking-widest wrap-break-word block leading-tight">{item.mainCategory}</span>
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[7px] sm:text-[8px] font-bold text-zinc-400 uppercase wrap-break-word block leading-tight">{item.subCategory || 'Gen'}</span>
                      {item.strainType && item.strainType !== 'N/A' && <span className="text-[6px] sm:text-[7px] font-bold text-emerald-400/80 uppercase">{item.strainType}</span>}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell py-2 sm:py-3 px-2 sm:px-3">
                    <div className="flex flex-col gap-1">
                      {item.isTopShelf && <span className="inline-flex w-max items-center gap-0.5 px-1 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[6px] sm:text-[7px] font-black uppercase tracking-widest rounded"><Award size={8}/> Top Shelf</span>}
                      {item.featured && <span className="inline-flex w-max items-center gap-0.5 px-1 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[6px] sm:text-[7px] font-black uppercase tracking-widest rounded"><Star size={8}/> Featured</span>}
                      {!item.isTopShelf && !item.featured && <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">—</span>}
                    </div>
                  </td>
                  <td className="hidden md:table-cell py-2 sm:py-3 px-2 sm:px-3">
                    {item.dailyDeal ? (
                      <span className="inline-flex w-max items-center gap-0.5 px-1 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[6px] sm:text-[7px] font-black uppercase tracking-widest rounded">
                        <Flame size={8} /> Promo
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">—</span>
                    )}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                    <span className="text-[9px] sm:text-[11px] font-black text-zinc-300 font-mono">${displayPrice.toFixed(0) || '0'}</span>
                  </td>
                  
                  {/* Warehouse STOCK DISPLAY */}
                  <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`text-[9px] sm:text-[11px] font-black font-mono ${displayStock <= 0 ? 'text-rose-500' : isAbundant && !item.dailyDeal ? 'text-cyan-400' : 'text-emerald-400'}`}>
                        {displayStock}
                      </span>
                      {hasVariants && (
                        <span className="text-[6px] sm:text-[7px] font-bold text-cyan-500/80 uppercase tracking-widest mt-0.5 text-right leading-tight">{item.options.length} Vars</span>
                      )}
                    </div>
                  </td>

                  <td className="py-2 sm:py-3 px-2 sm:px-3 text-right">
                    <div className="flex flex-row justify-end gap-1 flex-wrap">
                       <button 
                         onClick={() => onToggleArchive(item)} 
                         className={`p-1.5 bg-zinc-950 border border-zinc-800 rounded-md transition-all shadow-inner active:scale-95 inline-flex justify-center ${item.status === 'archived' ? 'text-amber-500 hover:text-emerald-400 hover:border-emerald-400/50' : 'text-zinc-500 hover:text-amber-400 hover:border-amber-400/50'}`} 
                         title={item.status === 'archived' ? "Restore" : "Archive"}
                       >
                         {item.status === 'archived' ? <ArchiveRestore size={10} className="sm:w-3 sm:h-3" /> : <Archive size={10} className="sm:w-3 sm:h-3" />}
                       </button>

                       <button onClick={() => startQuickEdit(item)} className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-all shadow-inner active:scale-95 inline-flex justify-center" title="Quick Edit">
                         <Zap size={10} className="sm:w-3 sm:h-3" />
                       </button>
                       <button onClick={() => openEditor(item)} className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-500 hover:text-amber-400 hover:border-amber-400/50 transition-all shadow-inner active:scale-95 inline-flex justify-center" title="Full Editor">
                         <Edit3 size={10} className="sm:w-3 sm:h-3" />
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
        <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Displaying {processedInventory.length} items</span>
        <span className="text-[8px] sm:text-[9px] font-mono text-zinc-600">DB_SYNC_ACTIVE</span>
      </div>
    </div>
  );
}