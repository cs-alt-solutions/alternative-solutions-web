import React, { useState, useMemo } from 'react';
import { Download, X } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { createClient } from '@supabase/supabase-js';

import AdminInventoryCategoryManager from './AdminInventoryCategoryManager';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import AdminInventoryHeader from './AdminInventoryHeader';
import AdminInventoryToolbar from './AdminInventoryToolbar';
import AdminInventoryTable from './AdminInventoryTable';

export default function AdminInventoryModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  
  const mainCategories = clientConfig.categories || ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'];
  const defaultSubCats = clientConfig.subCategories || {};
  const defaultTiers = clientConfig.pricingTiers || [];

  const [subCategories, setSubCategories] = useStickyState<Record<string, string[]>>(defaultSubCats, `inv_subcats_v2_${clientConfig?.id || 'division'}`);
  const [standardTiers, setStandardTiers] = useStickyState<string[]>(defaultTiers, `inv_tiers_v2_${clientConfig?.id || 'division'}`);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCats, setIsManagingCats] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', brand: '', lineage: '', strainType: 'Hybrid', 
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
      
      // We parse the single description into granular fields if necessary
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
        ...getBlankItem(), ...item, sizes: defaultSizes, name: item.name || '', brand: item.brand || '', lineage: item.lineage || '', strainType: item.strainType || 'Hybrid',
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
          { client_id: clientConfig.id || 'division', item_id: itemToSave.id, payload: itemToSave },
          { onConflict: 'client_id, item_id' }
        );
      if (error) throw error;
      setNotification(isNew ? `Added: ${itemToSave.name} to DB` : `Updated DB: ${itemToSave.name}`);
    } catch (err) {
      console.error("DB Write Error:", err);
      setNotification(`Failed to save ${itemToSave.name} to master database.`);
    }
  };

  const handleDeleteProduct = async (itemId: string) => {
    setStock((prev: any[]) => prev.filter((item: any) => item.id !== itemId));
    setEditingItem(null);
    setIsAdding(false);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      if (!supabaseUrl || !supabaseKey) return;
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase
        .from('client_inventory')
        .delete()
        .match({ client_id: clientConfig.id || 'division', item_id: itemId });
        
      if (error) throw error;
      setNotification(`Product Nuked from Database.`);
    } catch (err) {
      console.error("DB Delete Error:", err);
      setNotification(`Failed to delete product from master database.`);
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
      let printHtml = `<!DOCTYPE html><html><head><title>Inventory Audit</title><style>@page{size:landscape;margin:10mm;}body{font-family:system-ui,-apple-system,sans-serif;color:#18181b;}table{border-collapse:collapse;width:100%;font-size:11px;}th,td{border:1px solid #e4e4e7;text-align:left;padding:10px;}th{background-color:#f4f4f5;font-weight:700;color:#18181b;}.missing{color:#dc2626;font-weight:bold;}.good{color:#16a34a;}</style></head><body><h2>${clientConfig.name} - Inventory Audit Report</h2><p>Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>System ID</th><th>Product Name</th><th>Brand</th><th>Main Category</th><th>Sub Category</th><th>Base Price</th><th>Stock</th><th>Image</th></tr></thead><tbody>`;
      stock.forEach((item: any) => {
        const hasImage = item.imageUrl ? '<span class="good">YES</span>' : '<span class="missing">NO</span>';
        const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        const basePrice = item.price || (item.sizes?.length > 0 ? Math.min(...item.sizes.map((s: any) => s.price || 0)) : 0);
        printHtml += `<tr><td style="font-family:monospace;color:#71717a;">${item.id}</td><td><strong>${item.name || 'Unnamed'}</strong></td><td>${item.brand || ''}</td><td>${item.mainCategory || ''}</td><td>${item.subCategory || ''}</td><td>$${basePrice}</td><td>${totalStock}</td><td>${hasImage}</td></tr>`;
      });
      printHtml += `</tbody></table><script>window.onload=()=>{window.print();};</script></body></html>`;
      const printWindow = window.open('', '_blank');
      if (printWindow) { printWindow.document.write(printHtml); printWindow.document.close(); setNotification("Preparing PDF..."); } else { setNotification("Pop-up blocked."); }
    } catch (err) { setNotification("PDF Generation Failed."); }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedInventory = useMemo(() => {
    let result = [...inventoryMatrix];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(i => i.name?.toLowerCase().includes(lowerTerm) || i.id?.toLowerCase().includes(lowerTerm) || i.brand?.toLowerCase().includes(lowerTerm));
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
      onDelete={handleDeleteProduct}
      onCancel={() => { setEditingItem(null); setIsAdding(false); }} 
      inventoryMatrix={inventoryMatrix}
      client_id={clientConfig.id || 'division'}
      setNotification={setNotification}
    />
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      {/* Backup Modal */}
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

      {/* RENDER NEW COMPONENTS */}
      <AdminInventoryHeader 
        onExportAudit={handleExportAuditPDF}
        onBackup={() => setShowBackupModal(true)}
        onManageCats={() => setIsManagingCats(true)}
        onAddProduct={() => openEditor()}
      />

      <AdminInventoryToolbar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} mainCategories={mainCategories}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

      <AdminInventoryTable 
        processedInventory={processedInventory}
        handleSort={handleSort}
        openEditor={openEditor}
        mainCategories={mainCategories}
        subCategories={subCategories}
        onQuickSave={handleSaveProduct}
      />

    </div>
  );
}