import React, { useState, useMemo } from 'react';
import { Edit3, Plus, Boxes, Tag, Star, Package, ChevronDown, Leaf, Flame, Box, Image as ImageIcon, Award, Download, X, AlertTriangle, Printer, MapPinned, Search, Filter, ArrowUpDown } from 'lucide-react';
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

  // --- DATA GRID STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

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

  // --- DATA GRID LOGIC ---
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedInventory = useMemo(() => {
    let result = [...inventoryMatrix];

    // 1. Filtering
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(i => i.name?.toLowerCase().includes(lowerTerm) || i.id?.toLowerCase().includes(lowerTerm));
    }
    if (categoryFilter !== 'All') {
      result = result.filter(i => i.mainCategory === categoryFilter);
    }
    if (statusFilter !== 'All') {
      if (statusFilter === 'Active Promo') result = result.filter(i => i.dailyDeal);
      if (statusFilter === 'Top Shelf') result = result.filter(i => i.isTopShelf);
      if (statusFilter === 'Featured') result = result.filter(i => i.featured);
      if (statusFilter === 'Low Stock') result = result.filter(i => {
        const stock = i.onHand || (i.options?.length > 0 ? i.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
        return stock > 0 && stock <= 15;
      });
      if (statusFilter === 'Out of Stock') result = result.filter(i => {
        const stock = i.onHand || (i.options?.length > 0 ? i.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
        return stock <= 0;
      });
    }

    // 2. Sorting
    result.sort((a, b) => {
      let aVal: any = 0; let bVal: any = 0;
      
      if (sortConfig.key === 'name') {
        aVal = a.name?.toLowerCase() || ''; bVal = b.name?.toLowerCase() || '';
      } else if (sortConfig.key === 'category') {
        aVal = a.mainCategory || ''; bVal = b.mainCategory || '';
      } else if (sortConfig.key === 'subCategory') {
        aVal = a.subCategory || ''; bVal = b.subCategory || '';
      } else if (sortConfig.key === 'stock') {
        aVal = a.onHand || (a.options?.length > 0 ? a.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
        bVal = b.onHand || (b.options?.length > 0 ? b.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
      } else if (sortConfig.key === 'price') {
        aVal = a.price || (a.sizes?.length > 0 ? Math.min(...a.sizes.map((s: any) => s.price || 0)) : 0);
        bVal = b.price || (b.sizes?.length > 0 ? Math.min(...b.sizes.map((s: any) => s.price || 0)) : 0);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [inventoryMatrix, searchTerm, categoryFilter, statusFilter, sortConfig]);


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

      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-4 rounded-3xl border border-amber-500/30 text-amber-400 shadow-lg"><Boxes size={32} /></div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Master Vault</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Live Database <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /></div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleExportAuditPDF} className="bg-zinc-900 hover:bg-zinc-800 text-fuchsia-400 border border-fuchsia-900/50 font-black uppercase tracking-widest py-3 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-fuchsia-400/50 active:scale-95">
            <Printer size={16} /> Audit Report
          </button>
          <button onClick={() => setShowBackupModal(true)} className="bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-900/50 font-black uppercase tracking-widest py-3 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-cyan-400/50 active:scale-95">
            <Download size={16} /> Backup System
          </button>
          <button onClick={() => setIsManagingCats(true)} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest py-3 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-amber-500/30 hover:text-amber-400 active:scale-95">
            <MapPinned size={16} /> Map Settings
          </button>
          <button onClick={() => openEditor()} className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border border-emerald-900/30 font-black uppercase tracking-widest py-3 px-6 rounded-2xl text-[11px] transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* COMMAND CENTER TOOLBAR */}
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

      {/* DATA GRID */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800">
                <th onClick={() => handleSort('name')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group whitespace-nowrap">
                  <div className="flex items-center gap-2">Identity <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th onClick={() => handleSort('category')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group whitespace-nowrap">
                  <div className="flex items-center gap-2">Category <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th onClick={() => handleSort('subCategory')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group whitespace-nowrap">
                  <div className="flex items-center gap-2">Sub-Class <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                  Tags
                </th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                  Promo Status
                </th>
                <th onClick={() => handleSort('price')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">Base Price <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th onClick={() => handleSort('stock')} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors group text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">Vault Stock <ArrowUpDown size={12} className="opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Actions</th>
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
                const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
                const displayStock = item.onHand || (item.options?.length > 0 ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
                const displayPrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
                const isAbundant = displayStock >= 15;

                return (
                  <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors group">
                    {/* Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4 w-48 lg:w-auto">
                        <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden text-zinc-600">
                          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ItemIcon size={16} />}
                        </div>
                        <div className="flex flex-col max-w-45">
                          <span className={`font-black text-sm truncate ${item.isTopShelf ? 'text-zinc-100' : 'text-zinc-300'}`}>{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim() || 'Unnamed Item'}</span>
                          <span className="text-[8px] font-mono text-zinc-600 mt-1 truncate">{item.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest whitespace-nowrap">{item.mainCategory}</span>
                    </td>

                    {/* Sub-Class */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-1.5 w-32 lg:w-auto">
                        <span className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[8px] font-bold text-zinc-500 uppercase whitespace-nowrap">{item.subCategory || 'Gen'}</span>
                        {item.strainType && item.strainType !== 'N/A' && <span className="px-1.5 py-0.5 bg-emerald-500/5 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-400/80 uppercase whitespace-nowrap">{item.strainType}</span>}
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-1.5 w-24 lg:w-auto">
                        {item.isTopShelf && <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-0.5 whitespace-nowrap"><Award size={8}/> Top Shelf</span>}
                        {item.featured && <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-0.5 whitespace-nowrap"><Star size={8}/> Featured</span>}
                        {!item.isTopShelf && !item.featured && <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">—</span>}
                      </div>
                    </td>

                    {/* Promo Status */}
                    <td className="py-4 px-6">
                      {item.dailyDeal ? (
                        <div className="flex flex-col items-start gap-1 w-32 lg:w-auto">
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md whitespace-nowrap">
                            <Flame size={10} /> {item.dealLogic && item.dealLogic !== 'STANDARD' ? item.dealLogic : 'Active'}
                          </span>
                          <span className="text-[8px] font-bold text-zinc-500 truncate max-w-30">{item.dealText || item.dealType}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">—</span>
                      )}
                    </td>

                    {/* Base Price */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-black text-zinc-300 font-mono">${displayPrice.toFixed(0) || '0'}</span>
                    </td>

                    {/* Vault Stock */}
                    <td className="py-4 px-6 text-right">
                      <span className={`text-sm font-black font-mono ${displayStock <= 0 ? 'text-rose-500' : isAbundant && !item.dailyDeal ? 'text-cyan-400' : 'text-emerald-400'}`}>
                        {displayStock}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => openEditor(item)} className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-amber-400 hover:border-amber-400/50 transition-all shadow-inner active:scale-95 inline-flex">
                        <Edit3 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Metrics */}
        <div className="bg-zinc-950/80 border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Displaying {processedInventory.length} items</span>
          <span className="text-[10px] font-mono text-zinc-600">DB_SYNC_ACTIVE</span>
        </div>
      </div>

    </div>
  );
}