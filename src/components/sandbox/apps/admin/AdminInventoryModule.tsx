import React, { useState, useMemo } from 'react';
import { Edit3, Plus, Boxes, Tag, Star, Package, ChevronDown, Leaf, Flame, Box, Image as ImageIcon, Award, FoldVertical, UnfoldVertical, Download, X, AlertTriangle, Printer, MapPinned } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import AdminInventoryCategoryManager from './AdminInventoryCategoryManager';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import { createClient } from '@supabase/supabase-js';

export default function AdminInventoryModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  
  const mainCategories = clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
  const defaultSubCats = clientConfig.subCategories || {};
  const defaultTiers = clientConfig.pricingTiers || [];

  const [subCategories, setSubCategories] = useStickyState<Record<string, string[]>>(defaultSubCats, `inv_subcats_v2_${clientConfig?.id || 'dev'}`);
  const [standardTiers, setStandardTiers] = useStickyState<string[]>(defaultTiers, `inv_tiers_v2_${clientConfig?.id || 'dev'}`);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCats, setIsManagingCats] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', lineage: '', strainType: 'Hybrid', 
    descBase: '', descFeels: '', descTaste: '', descUses: '', descFact: '',
    mainCategory: mainCategories[0], subCategory: subCategories[mainCategories[0]]?.[0] || 'Uncategorized',
    price: 0, onHand: 0, featured: false, isTopShelf: false, dailyDeal: false,
    dealType: 'Daily Deal', dealText: '', dealDays: [], iconName: 'Leaf', options: [], 
    sizes: [
      { id: `sz-${Date.now()}-1`, label: '3.5g (Eighth)', price: 35.00, bundleQty: 1, promoLabel: '', promoPrice: '' },
      { id: `sz-${Date.now()}-2`, label: '7g (Quarter)', price: 60.00, bundleQty: 1, promoLabel: '', promoPrice: '' }
    ] 
  });

  const openEditor = (item?: any) => {
    if (item) {
      const defaultSizes = item.sizes && item.sizes.length > 0 ? item.sizes.map((s: any) => ({ ...s, promoLabel: s.promoLabel || '', promoPrice: s.promoPrice ?? '' })) : [{ id: `sz-${Date.now()}`, label: 'Standard', price: item.price || 0, bundleQty: 1, promoLabel: '', promoPrice: '' }];
      
      let descBase = ''; let descFeels = ''; let descTaste = ''; let descUses = ''; let descFact = '';
      if (item.description) {
         const feelsMatch = item.description.match(/Feels:\s*([^.]*)/i);
         const tasteMatch = item.description.match(/Taste:\s*([^.]*)/i);
         const usesMatch = item.description.match(/Uses:\s*([^.]*)/i);
         const factMatch = item.description.match(/Fun Fact:\s*(.*)/i);
         
         descBase = item.description.split(/(Feels:|Taste:|Uses:|Fun Fact:)/i)[0].trim();
         descFeels = feelsMatch ? feelsMatch[1].trim() : '';
         descTaste = tasteMatch ? tasteMatch[1].trim() : '';
         descUses = usesMatch ? usesMatch[1].trim() : '';
         descFact = factMatch ? factMatch[1].trim() : '';
      }

      setEditingItem({ 
        ...getBlankItem(), ...item, sizes: defaultSizes, name: item.name || '', lineage: item.lineage || '', strainType: item.strainType || 'Hybrid',
        descBase, descFeels, descTaste, descUses, descFact, mainCategory: item.mainCategory || mainCategories[0], subCategory: item.subCategory || item.category || 'Uncategorized', 
        dealType: item.dealType || 'Daily Deal', dealText: item.dealText || '', dealDays: item.dealDays || [] 
      });
      setIsAdding(false);
    } else {
      setEditingItem(getBlankItem());
      setIsAdding(true);
    }
  };

  const handleSaveProduct = async (itemToSave: any, isNew: boolean) => {
    setStock((prev: any[]) => isNew ? [itemToSave, ...prev] : prev.map((item: any) => item.id === itemToSave.id ? itemToSave : item));
    setEditingItem(null);
    setIsAdding(false);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase
        .from('client_inventory')
        .upsert(
          { client_id: clientConfig.id, item_id: itemToSave.id, payload: itemToSave },
          { onConflict: 'client_id, item_id' }
        );
      if (error) throw error;
      setNotification(isNew ? `Added: ${itemToSave.name} to DB` : `Updated DB: ${itemToSave.name}`);
    } catch (err) {
      console.error("DB Write Error:", err);
      setNotification(`Failed to save ${itemToSave.name} to master database.`);
    }
  };

  const groupedItems = mainCategories.map((cat: string) => ({ category: cat, items: inventoryMatrix.filter((i: any) => i.mainCategory === cat) })).filter((group: any) => group.items.length > 0);
  const assignedIds = new Set(groupedItems.flatMap((g: any) => g.items.map((i:any) => i.id)));
  const unassignedItems = inventoryMatrix.filter((i: any) => !assignedIds.has(i.id));
  if (unassignedItems.length > 0) groupedItems.push({ category: 'Other / Uncategorized', items: unassignedItems });

  const isAllCollapsed = groupedItems.every((g: any) => collapsedCats[g.category]);
  const handleGlobalToggle = () => {
    if (isAllCollapsed) { setCollapsedCats({}); } else {
      const allCollapsed: Record<string, boolean> = {};
      groupedItems.forEach((g: any) => allCollapsed[g.category] = true);
      setCollapsedCats(allCollapsed);
    }
  };

  const handleExportBackup = () => {
    try {
      const cid = clientConfig?.id || 'division';
      const getLocal = (key: string, fallback: any) => {
        if (typeof window === 'undefined') return fallback;
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      };

      const liveStoreHours = getLocal(`store_hours_${cid}`, clientConfig.storeHours);
      const liveShiftChange = getLocal(`store_shift_change_${cid}`, clientConfig.shiftChange);
      const liveWeeklySchedule = getLocal(`store_weekly_hours_${cid}`, clientConfig.weeklySchedule);
      const liveCategories = getLocal(`inv_cats_${cid}`, clientConfig.categories);
      const liveSubCategories = getLocal(`inv_subcats_v2_${cid}`, clientConfig.subCategories);
      const liveTiers = getLocal(`inv_tiers_v2_${cid}`, clientConfig.pricingTiers);

      const fileContent = `// MASTER VAULT BACKUP - ${new Date().toLocaleString()}\n\nexport const divisionSettings = {\n  categories: ${JSON.stringify(liveCategories, null, 2)},\n  subCategories: ${JSON.stringify(liveSubCategories, null, 2)},\n  pricingTiers: ${JSON.stringify(liveTiers, null, 2)},\n  storeHours: ${JSON.stringify(liveStoreHours, null, 2)},\n  shiftChange: ${JSON.stringify(liveShiftChange, null, 2)},\n  weeklySchedule: ${JSON.stringify(liveWeeklySchedule, null, 2)}\n};\n\nexport const divisionInventory = ${JSON.stringify(stock, null, 2)};\n`;

      const blob = new Blob([fileContent], { type: "application/typescript" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `doobie_master_backup_${new Date().toISOString().split('T')[0]}.ts`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setNotification("Master Vault Exported! Check your downloads.");
      setShowBackupModal(false);
    } catch (err) {
      console.error("Export failed", err);
      setNotification("Export Failed.");
    }
  };

  const handleExportAuditPDF = () => {
    try {
      let printHtml = `<!DOCTYPE html><html><head><title>Inventory Audit</title><style>@page{size:landscape;margin:10mm;}body{font-family:system-ui,-apple-system,sans-serif;color:#18181b;}table{border-collapse:collapse;width:100%;font-size:11px;}th,td{border:1px solid #e4e4e7;text-align:left;padding:10px;}th{background-color:#f4f4f5;font-weight:700;color:#18181b;}.missing{color:#dc2626;font-weight:bold;}.good{color:#16a34a;}</style></head><body><h2>${clientConfig.name} - Inventory Audit Report</h2><p>Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>System ID</th><th>Product Name</th><th>Main Category</th><th>Sub Category</th><th>Base Price</th><th>Stock</th><th>Image</th><th>Description</th></tr></thead><tbody>`;
      stock.forEach((item: any) => {
        const hasImage = item.imageUrl ? '<span class="good">YES</span>' : '<span class="missing">NO</span>';
        const hasDesc = (item.description || item.descBase) ? '<span class="good">YES</span>' : '<span class="missing">NO</span>';
        const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        const basePrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
        printHtml += `<tr><td style="font-family:monospace;color:#71717a;">${item.id}</td><td><strong>${item.name || 'Unnamed'}</strong></td><td>${item.mainCategory || ''}</td><td>${item.subCategory || ''}</td><td>$${basePrice}</td><td>${totalStock}</td><td>${hasImage}</td><td>${hasDesc}</td></tr>`;
      });
      printHtml += `</tbody></table><script>window.onload=()=>{window.print();};</script></body></html>`;
      const printWindow = window.open('', '_blank');
      if (printWindow) { printWindow.document.write(printHtml); printWindow.document.close(); setNotification("Preparing PDF..."); } else { setNotification("Pop-up blocked."); }
    } catch (err) { setNotification("PDF Generation Failed."); }
  };

  if (isManagingCats) return <AdminInventoryCategoryManager mainCategories={mainCategories} subCategories={subCategories} setSubCategories={setSubCategories} standardTiers={standardTiers} setStandardTiers={setStandardTiers} setNotification={setNotification} onClose={() => setIsManagingCats(false)} />;
  
  if (editingItem) return (
    <AdminInventoryEditor 
      initialItem={editingItem} 
      isAdding={isAdding} 
      mainCategories={mainCategories} 
      subCategories={subCategories} 
      standardTiers={standardTiers} 
      onSave={handleSaveProduct} 
      onCancel={() => { setEditingItem(null); setIsAdding(false); }} 
      inventoryMatrix={inventoryMatrix}
      client_id={clientConfig.id}
      setNotification={setNotification}
    />
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-4xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setShowBackupModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-rose-400 transition-colors"><X size={20} /></button>
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-6"><Download size={24} /></div>
            <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tight mb-2">Vault Backup Protocol</h3>
            <div className="space-y-5 mb-8">
              <p className="text-sm font-medium text-zinc-400 leading-relaxed">This creates a local structural snapshot of your current Supabase DB state.</p>
              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-inner">
                <ul className="text-xs text-zinc-300 font-medium space-y-3">
                  <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <span>This creates a hardcopy backup for emergency synchronization. Send this to Courtney daily.</span></li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowBackupModal(false)} className="flex-1 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Cancel</button>
              <button onClick={handleExportBackup} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 flex items-center justify-center gap-2"><Download size={14} /> Export</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-zinc-800/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-4 rounded-3xl border border-amber-500/30 text-amber-400 shadow-lg"><Boxes size={32} /></div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Master Vault</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Live Database <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /></div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleGlobalToggle} className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest py-3.5 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-inner active:scale-95">
            {isAllCollapsed ? <><UnfoldVertical size={16} /> Expand All</> : <><FoldVertical size={16} /> Collapse All</>}
          </button>
          
          <div className="w-px h-8 bg-zinc-800 mx-1 hidden sm:block"></div>

          <button onClick={handleExportAuditPDF} className="bg-zinc-900 hover:bg-zinc-800 text-fuchsia-400 border border-fuchsia-900/50 font-black uppercase tracking-widest py-3.5 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-fuchsia-400/50 active:scale-95">
            <Printer size={16} /> Audit Report
          </button>

          <button onClick={() => setShowBackupModal(true)} className="bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-900/50 font-black uppercase tracking-widest py-3.5 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-cyan-400/50 active:scale-95">
            <Download size={16} /> Backup System
          </button>

          <button onClick={() => setIsManagingCats(true)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl text-[11px] transition-all flex items-center gap-2 shadow-lg hover:border-amber-500/30 hover:scale-105 active:scale-95">
            <MapPinned size={16} /> Map Settings
          </button>
          
          <button onClick={() => openEditor()} className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border border-emerald-900/30 font-black uppercase tracking-widest py-3.5 px-6 rounded-2xl text-[11px] transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        {groupedItems.map((group: any) => {
          const isCollapsed = collapsedCats[group.category];
          const topShelfCount = group.items.filter((i: any) => i.isTopShelf).length;
          const featuredCount = group.items.filter((i: any) => i.featured).length;
          const promoCount = group.items.filter((i: any) => i.dailyDeal).length;
          
          return (
            <div key={group.category} className="animate-in fade-in slide-in-from-bottom-4">
              <div onClick={() => toggleCategory(group.category)} className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl cursor-pointer hover:bg-zinc-900 transition-colors group/header shadow-inner select-none overflow-hidden">
                 <div className="flex items-center gap-4 flex-wrap">
                   <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest">{group.category}</h3>
                   <div className="flex items-center gap-2">
                     <span className="bg-zinc-950 border border-zinc-800 text-zinc-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-inner">{group.items.length} Items</span>
                     {topShelfCount > 0 && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1"><Award size={10} /> {topShelfCount} Top Shelf</span>}
                     {featuredCount > 0 && <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1"><Star size={10} /> {featuredCount} Featured</span>}
                     {promoCount > 0 && <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1"><Flame size={10} /> {promoCount} Active Promo</span>}
                   </div>
                 </div>
                 <div className={`p-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-500 transition-transform duration-300 ml-4 shrink-0 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}><ChevronDown size={14} /></div>
              </div>
              
              <div className={`grid grid-cols-1 gap-3 mt-3 transition-all ${isCollapsed ? 'hidden' : 'block'}`}>
                {group.items.map((item: any) => {
                  const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
                  const displayStock = item.onHand || (item.options?.length > 0 ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
                  const displayPrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
                  const isAbundant = displayStock >= 15;

                  return (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/50 transition-all group shadow-sm relative overflow-hidden">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-700 shrink-0 shadow-inner overflow-hidden group-hover:border-amber-500/30 transition-colors">
                           {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <ItemIcon size={20} className="group-hover:text-amber-400 transition-colors" />}
                         </div>
                         <div className="flex flex-col">
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className={`font-black text-lg tracking-tight leading-none ${item.isTopShelf ? 'text-amber-400' : 'text-zinc-100'}`}>{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</h3>
                             {item.isTopShelf && <Award size={14} className="text-amber-400" />}
                             {item.featured && <Star size={14} className="text-cyan-400" />}
                             {item.dailyDeal && <Flame size={14} className="text-rose-400" />}
                           </div>
                           <div className="flex flex-wrap items-center gap-2">
                             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{item.subCategory || 'General'}</span>
                             {item.strainType && item.strainType !== 'N/A' && <><span className="w-1 h-1 rounded-full bg-zinc-700" /><span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{item.strainType}</span></>}
                           </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-end">
                           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1"><Package size={10}/> Stock</span>
                           <span className={`text-xl font-black leading-none ${displayStock <= 0 ? 'text-rose-500' : isAbundant && !item.dailyDeal ? 'text-cyan-400' : 'text-emerald-400'}`}>{displayStock}{item.mainCategory === 'Flower & Plants' ? 'g' : ''}</span>
                         </div>
                         <div className="w-px h-8 bg-zinc-800 hidden sm:block"></div>
                         <div className="hidden sm:flex flex-col items-end w-16">
                           <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 flex items-center gap-1"><Tag size={10}/> Base</span>
                           <span className="text-xl font-black leading-none text-zinc-300 font-mono">${displayPrice.toFixed(0) || '0'}</span>
                         </div>
                         <button onClick={() => openEditor(item)} className="ml-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-amber-400 hover:border-amber-400/50 transition-all shadow-inner active:scale-95">
                           <Edit3 size={18} />
                         </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}