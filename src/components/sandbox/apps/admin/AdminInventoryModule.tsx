// sandbox/apps/admin/AdminInventoryModule.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Download, X, Package } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { supabase } from '@/utils/supabase';

import AdminInventoryCategoryManager from './AdminInventoryCategoryManager';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import AdminInventoryHeader from './AdminInventoryHeader';
import AdminInventoryToolbar from './AdminInventoryToolbar';
import AdminInventoryTable from './AdminInventoryTable';
import AdminInventoryAudit from './inventory-audit/AdminInventoryAudit';

export default function AdminInventoryModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig, jumpToEditItem, clearJumpToEdit }: any) {
  
  // 🚀 THE FILE IS LAW: Direct read from index.ts. NO BROWSER CACHING.
  const mainCategories = clientConfig?.categories || ['Flower & Prerolls', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Healthcare & Topicals', 'Merch & Extras'];
  const subCategories = clientConfig?.subCategories || {};
  
  // We still use state for standardTiers if you want them editable, but we'll bump the cache key just in case.
  const [standardTiers, setStandardTiers] = useStickyState<string[]>(clientConfig?.pricingTiers || [], `inv_tiers_v8_${clientConfig?.id || 'division'}`);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCats, setIsManagingCats] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All'); 
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const [rawInventory, setRawInventory] = useState<any[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);

  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '', brand: '', lineage: '', strainType: 'Hybrid', 
    descBase: '', descFeels: '', descTaste: '', descUses: '', descFact: '',
    mainCategory: mainCategories[0], subCategory: subCategories[mainCategories[0]]?.[0] || 'Uncategorized',
    price: 0, onHand: 0, 
    isTopShelf: false, isChefsReserve: false, isNewDrop: false, isReturned: false, isClearance: false,
    dailyDeal: false, dealType: 'One-Shot', dealText: '', dealDays: [], 
    iconName: 'Leaf', options: [], 
    dealConfig: { type: 'DISCOUNT', discountType: 'PERCENT', discountValue: 15, unit: 'UNITS' },
    sizes: [{ id: `sz-${Date.now()}-1`, label: 'Standard', price: 0, bundleQty: 1, promoLabel: '', promoPrice: '' }],
    status: 'active'
  });

  const openEditor = (item?: any) => {
    if (item) {
      setEditingItem({ 
        ...getBlankItem(), ...item,
        descBase: item.descBase || '', descFeels: item.descFeels || '', descTaste: item.descTaste || '',
        descUses: item.descUses || '', descFact: item.descFact || ''
      });
      setIsAdding(false);
    } else {
      setEditingItem(getBlankItem());
      setIsAdding(true);
    }
  };

  useEffect(() => {
    if (jumpToEditItem) {
      openEditor(jumpToEditItem);
      if (clearJumpToEdit) clearJumpToEdit();
    }
  }, [jumpToEditItem, clearJumpToEdit]);

  // 🚀 DATABASE SYNC
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const { data: invData, error: invErr } = await supabase.from('client_inventory').select('payload').eq('client_id', clientConfig.id);
        if (invErr) throw invErr;
        if (invData) setRawInventory(invData.map(row => row.payload));
      } catch (err) { console.error("Market Sync Error:", err); } 
      finally { setIsLoadingInventory(false); }
    };
    fetchStoreData();
  }, [clientConfig.id]);

  const handleSaveProduct = async (itemToSave: any, isNew: boolean) => {
    setNotification("Syncing with Warehouse...");
    try {
      const { error } = await supabase.from('client_inventory').upsert(
          { client_id: clientConfig.id || 'division', item_id: itemToSave.id, payload: itemToSave, updated_at: new Date().toISOString() },
          { onConflict: 'client_id, item_id' }
      );
      if (error) throw error;
      setRawInventory(prev => {
        if (isNew) return [itemToSave, ...prev];
        return prev.map(i => i.id === itemToSave.id ? itemToSave : i);
      });
      setNotification(isNew ? `Added: ${itemToSave.name}` : `Updated: ${itemToSave.name}`);
      setEditingItem(null);
      setIsAdding(false);
    } catch (err) {
      setNotification(`Failed to save to master database.`);
    }
  };

  const handleToggleArchive = async (item: any) => {
    const newStatus = item.status === 'archived' ? 'active' : 'archived';
    const updatedItem = { ...item, status: newStatus };
    if (newStatus === 'active') { updatedItem.isReturned = true; updatedItem.isNewDrop = false; }
    
    setNotification(newStatus === 'archived' ? `Deactivating ${item.name}...` : `Restoring ${item.name}...`);
    try {
      const { error } = await supabase.from('client_inventory').upsert(
          { client_id: clientConfig.id || 'division', item_id: updatedItem.id, payload: updatedItem, updated_at: new Date().toISOString() },
          { onConflict: 'client_id, item_id' }
      );
      if (error) throw error;
      setRawInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
      setNotification(newStatus === 'archived' ? `${item.name} moved to Inactive Roster.` : `${item.name} Restored to Active Roster.`);
    } catch (err) { setNotification(`Failed to change roster status.`); }
  };

  const handleDeleteProduct = async (itemId: string) => {
    try {
      const { error } = await supabase.from('client_inventory').delete().match({ client_id: clientConfig.id || 'division', item_id: itemId });
      if (error) throw error;
      setRawInventory(prev => prev.filter(item => item.id !== itemId));
      setEditingItem(null);
      setIsAdding(false);
      setNotification(`Product Nuked from Warehouse.`);
    } catch (err) { setNotification(`Failed to delete product.`); }
  };

  const handleExportBackup = () => {
    try {
      const cid = clientConfig?.id || 'division';
      const fileContent = `// MASTER Warehouse BACKUP - ${new Date().toLocaleString()}\n\nexport const divisionInventory = ${JSON.stringify(rawInventory, null, 2)};\n`;
      const blob = new Blob([fileContent], { type: "application/typescript" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `Warehouse_backup_${cid}_${new Date().toISOString().split('T')[0]}.ts`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setNotification("Warehouse Exported!");
      setShowBackupModal(false);
    } catch (err) { setNotification("Export Failed."); }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const processedInventory = useMemo(() => {
    let result = [...rawInventory];

    if (viewMode === 'active') result = result.filter(i => i.status !== 'archived');
    else result = result.filter(i => i.status === 'archived');

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(i => i.name?.toLowerCase().includes(lowerTerm) || i.id?.toLowerCase().includes(lowerTerm) || i.brand?.toLowerCase().includes(lowerTerm));
    }
    if (categoryFilter !== 'All') result = result.filter(i => i.mainCategory === categoryFilter);
    if (subCategoryFilter !== 'All') result = result.filter(i => i.subCategory === subCategoryFilter);
    if (statusFilter !== 'All') {
      if (statusFilter === 'Active Promo') result = result.filter(i => i.dailyDeal);
      if (statusFilter === 'Top Shelf') result = result.filter(i => i.isTopShelf);
      if (statusFilter === 'Chef\'s Reserve') result = result.filter(i => i.isChefsReserve);
      if (statusFilter === 'New Arrival') result = result.filter(i => i.isNewDrop);
      if (statusFilter === 'Returned') result = result.filter(i => i.isReturned);
      if (statusFilter === 'Smoky Steals') result = result.filter(i => i.isClearance);
      if (statusFilter === 'Low Stock' || statusFilter === 'Out of Stock') {
        result = result.filter(i => {
          const hasVariants = i.options && i.options.length > 0 && i.options[0].label !== 'Standard';
          const stockNum = hasVariants ? i.options.reduce((s:number, o:any) => s + (Number(o.stock)||0), 0) : (i.onHand || 0);
          return statusFilter === 'Low Stock' ? (stockNum > 0 && stockNum <= 15) : stockNum <= 0;
        });
      }
    }

    result.sort((a, b) => {
      let aVal: any = 0; let bVal: any = 0;
      if (sortConfig.key === 'name') { aVal = a.name?.toLowerCase() || ''; bVal = b.name?.toLowerCase() || ''; }
      else if (sortConfig.key === 'category') { aVal = a.mainCategory || ''; bVal = b.mainCategory || ''; }
      else if (sortConfig.key === 'subCategory') { aVal = a.subCategory || ''; bVal = b.subCategory || ''; }
      else if (sortConfig.key === 'stock') { 
         const aHasVar = a.options && a.options.length > 0 && a.options[0].label !== 'Standard';
         const bHasVar = b.options && b.options.length > 0 && b.options[0].label !== 'Standard';
         aVal = aHasVar ? a.options.reduce((s:number, o:any) => s + (Number(o.stock)||0), 0) : (a.onHand || 0); 
         bVal = bHasVar ? b.options.reduce((s:number, o:any) => s + (Number(o.stock)||0), 0) : (b.onHand || 0); 
      }
      else if (sortConfig.key === 'price') {
        aVal = a.price || (a.sizes?.length > 0 ? Math.min(...a.sizes.map((s: any) => s.price || 0)) : 0);
        bVal = b.price || (b.sizes?.length > 0 ? Math.min(...b.sizes.map((s: any) => s.price || 0)) : 0);
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [rawInventory, searchTerm, categoryFilter, subCategoryFilter, statusFilter, sortConfig, viewMode]);

  if (isLoadingInventory) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="animate-pulse flex flex-col items-center">
           <Package size={40} className="text-cyan-400 mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
           <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Syncing Warehouse...</span>
        </div>
      </div>
    );
  }

  if (isAuditing) return <AdminInventoryAudit stock={rawInventory} setStock={setRawInventory} setNotification={setNotification} clientConfig={clientConfig} onClose={() => setIsAuditing(false)} />;
  
  if (isManagingCats) return <AdminInventoryCategoryManager clientConfig={clientConfig} mainCategories={mainCategories} subCategories={subCategories} setStandardTiers={setStandardTiers} setNotification={setNotification} onClose={() => setIsManagingCats(false)} />;
  
  if (editingItem) return (
    <AdminInventoryEditor 
      initialItem={editingItem} isAdding={isAdding} 
      mainCategories={mainCategories} subCategories={subCategories} 
      onSave={handleSaveProduct} onDelete={handleDeleteProduct} onCancel={() => { setEditingItem(null); setIsAdding(false); }} 
      client_id={clientConfig.id} setNotification={setNotification}
    />
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in pb-20">
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-4xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowBackupModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-rose-400"><X size={20} /></button>
            <h3 className="text-xl font-black text-zinc-100 uppercase mb-4">Warehouse Backup</h3>
            <p className="text-sm text-zinc-400 mb-8">Export current stock as a hardcopy snapshot.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBackupModal(false)} className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-400 py-3 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleExportBackup} className="flex-1 bg-cyan-500 text-zinc-950 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"><Download size={14} /> Export</button>
            </div>
          </div>
        </div>
      )}

      <AdminInventoryHeader onOpenAudit={() => setIsAuditing(true)} onBackup={() => setShowBackupModal(true)} onManageCats={() => setIsManagingCats(true)} onAddProduct={() => openEditor()} />

      <div className="flex items-center gap-6 mb-6 px-2 border-b border-zinc-800/50">
        <button onClick={() => setViewMode('active')} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${viewMode === 'active' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Active Roster
          {viewMode === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />}
        </button>
        <button onClick={() => setViewMode('archived')} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${viewMode === 'archived' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
          Inactive Roster
          {viewMode === 'archived' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
        </button>
      </div>

      <AdminInventoryToolbar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} mainCategories={mainCategories}
        subCategoryFilter={subCategoryFilter} setSubCategoryFilter={setSubCategoryFilter} subCategories={subCategories}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

      <AdminInventoryTable processedInventory={processedInventory} handleSort={handleSort} openEditor={openEditor} mainCategories={mainCategories} subCategories={subCategories} onQuickSave={handleSaveProduct} onToggleArchive={handleToggleArchive} />
    </div>
  );
}