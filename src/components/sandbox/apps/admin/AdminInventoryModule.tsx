'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { supabase } from '@/utils/supabase';

import AdminInventoryCategoryManager from './AdminInventoryCategoryManager';
import AdminInventoryEditor from './inventory-editor/AdminInventoryEditor';
import AdminInventoryHeader from './AdminInventoryHeader';
import AdminInventoryToolbar from './AdminInventoryToolbar';
import AdminInventoryTable from './AdminInventoryTable';

export default function AdminInventoryModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig, jumpToEditItem, clearJumpToEdit }: any) {
  
  const mainCategories = clientConfig.categories || ['Flower & Prerolls', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Healthcare & Topicals', 'Merch & Extras'];
  const defaultSubCats = clientConfig.subCategories || {};
  const defaultTiers = clientConfig.pricingTiers || [];

  const [subCategories, setSubCategories] = useStickyState<Record<string, string[]>>(defaultSubCats, `inv_subcats_v2_${clientConfig?.id || 'division'}`);
  const [standardTiers, setStandardTiers] = useStickyState<string[]>(defaultTiers, `inv_tiers_v2_${clientConfig?.id || 'division'}`);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCats, setIsManagingCats] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All'); // NEW FILTER STATE
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

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
        ...getBlankItem(), 
        ...item,
        descBase: item.descBase || '',
        descFeels: item.descFeels || '',
        descTaste: item.descTaste || '',
        descUses: item.descUses || '',
        descFact: item.descFact || ''
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

  const handleSaveProduct = async (itemToSave: any, isNew: boolean) => {
    setNotification("Syncing with Vault...");
    try {
      const { error } = await supabase
        .from('client_inventory')
        .upsert(
          { 
            client_id: clientConfig.id || 'division', 
            item_id: itemToSave.id, 
            payload: itemToSave,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'client_id, item_id' }
        );
      if (error) throw error;
      setStock((prev: any[]) => {
        if (isNew) return [itemToSave, ...prev];
        return prev.map((i: any) => i.id === itemToSave.id ? itemToSave : i);
      });
      setNotification(isNew ? `Added: ${itemToSave.name}` : `Updated: ${itemToSave.name}`);
      setEditingItem(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Vault Write Error:", err);
      setNotification(`Failed to save to master database.`);
    }
  };

  const handleToggleArchive = async (item: any) => {
    const newStatus = item.status === 'archived' ? 'active' : 'archived';
    const updatedItem = { ...item, status: newStatus };
    
    if (newStatus === 'active') {
       updatedItem.isReturned = true;
       updatedItem.isNewDrop = false;
    }

    setNotification(newStatus === 'archived' ? `Archiving ${item.name}...` : `Restoring ${item.name}...`);
    try {
      const { error } = await supabase
        .from('client_inventory')
        .upsert(
          { 
            client_id: clientConfig.id || 'division', 
            item_id: updatedItem.id, 
            payload: updatedItem,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'client_id, item_id' }
        );
      if (error) throw error;
      setStock((prev: any[]) => prev.map((i: any) => i.id === updatedItem.id ? updatedItem : i));
      setNotification(newStatus === 'archived' ? `${item.name} moved to Archive.` : `${item.name} Restored to Active (Marked as Returned).`);
    } catch (err) {
      console.error("Vault Write Error:", err);
      setNotification(`Failed to change archive status.`);
    }
  };

  const handleDeleteProduct = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('client_inventory')
        .delete()
        .match({ client_id: clientConfig.id || 'division', item_id: itemId });
      if (error) throw error;
      setStock((prev: any[]) => prev.filter((item: any) => item.id !== itemId));
      setEditingItem(null);
      setIsAdding(false);
      setNotification(`Product Nuked from Vault.`);
    } catch (err) {
      console.error("Vault Delete Error:", err);
      setNotification(`Failed to delete product.`);
    }
  };

  const handleExportBackup = () => {
    try {
      const cid = clientConfig?.id || 'division';
      const fileContent = `// MASTER VAULT BACKUP - ${new Date().toLocaleString()}\n\nexport const divisionInventory = ${JSON.stringify(stock, null, 2)};\n`;
      const blob = new Blob([fileContent], { type: "application/typescript" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `vault_backup_${cid}_${new Date().toISOString().split('T')[0]}.ts`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setNotification("Vault Exported!");
      setShowBackupModal(false);
    } catch (err) {
      setNotification("Export Failed.");
    }
  };

  const handleExportAuditPDF = () => {
    try {
      let printHtml = `<!DOCTYPE html><html><head><title>Inventory Audit</title><style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f4f4f5;}</style></head><body><h2>${clientConfig.name} Audit</h2><table><thead><tr><th>Name</th><th>Category</th><th>Stock</th></tr></thead><tbody>`;
      stock.forEach((item: any) => {
        printHtml += `<tr><td>${item.name}</td><td>${item.mainCategory}</td><td>${item.onHand || 0}</td></tr>`;
      });
      printHtml += `</tbody></table></body></html>`;
      const win = window.open('', '_blank');
      win?.document.write(printHtml);
      win?.document.close();
      win?.print();
    } catch (err) {
      setNotification("Audit Failed.");
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedInventory = useMemo(() => {
    let result = [...inventoryMatrix];

    // Status Mode Filter
    if (viewMode === 'active') {
      result = result.filter(i => i.status !== 'archived');
    } else {
      result = result.filter(i => i.status === 'archived');
    }

    // Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(i => i.name?.toLowerCase().includes(lowerTerm) || i.id?.toLowerCase().includes(lowerTerm) || i.brand?.toLowerCase().includes(lowerTerm));
    }
    
    // Main Category Filter
    if (categoryFilter !== 'All') {
      result = result.filter(i => i.mainCategory === categoryFilter);
    }

    // NEW: Subcategory Filter
    if (subCategoryFilter !== 'All') {
       result = result.filter(i => i.subCategory === subCategoryFilter);
    }
    
    // Promotional/Stock Status Filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Active Promo') result = result.filter(i => i.dailyDeal);
      if (statusFilter === 'Top Shelf') result = result.filter(i => i.isTopShelf);
      if (statusFilter === 'Chef\'s Reserve') result = result.filter(i => i.isChefsReserve);
      if (statusFilter === 'New Arrival') result = result.filter(i => i.isNewDrop);
      if (statusFilter === 'Returned') result = result.filter(i => i.isReturned);
      if (statusFilter === 'Smoky Steals') result = result.filter(i => i.isClearance);

      if (statusFilter === 'Low Stock') result = result.filter(i => {
        const hasVariants = i.options && i.options.length > 0 && i.options[0].label !== 'Standard';
        const stockNum = hasVariants ? i.options.reduce((s:number, o:any) => s + (Number(o.stock)||0), 0) : (i.onHand || 0);
        return stockNum > 0 && stockNum <= 15;
      });
      if (statusFilter === 'Out of Stock') result = result.filter(i => {
        const hasVariants = i.options && i.options.length > 0 && i.options[0].label !== 'Standard';
        const stockNum = hasVariants ? i.options.reduce((s:number, o:any) => s + (Number(o.stock)||0), 0) : (i.onHand || 0);
        return stockNum <= 0;
      });
    }

    // Sorter
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
  }, [inventoryMatrix, searchTerm, categoryFilter, subCategoryFilter, statusFilter, sortConfig, viewMode]); // Added subCategoryFilter dependency

  if (isManagingCats) return <AdminInventoryCategoryManager clientConfig={clientConfig} mainCategories={mainCategories} subCategories={subCategories} setSubCategories={setSubCategories} standardTiers={standardTiers} setStandardTiers={setStandardTiers} setNotification={setNotification} onClose={() => setIsManagingCats(false)} />;
  
  if (editingItem) return (
    <AdminInventoryEditor 
      initialItem={editingItem} 
      isAdding={isAdding} 
      mainCategories={mainCategories} 
      subCategories={subCategories} 
      onSave={handleSaveProduct} 
      onDelete={handleDeleteProduct}
      onCancel={() => { setEditingItem(null); setIsAdding(false); }} 
      client_id={clientConfig.id} 
      setNotification={setNotification}
    />
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in pb-20">
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-4xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowBackupModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-rose-400"><X size={20} /></button>
            <h3 className="text-xl font-black text-zinc-100 uppercase mb-4">Vault Backup</h3>
            <p className="text-sm text-zinc-400 mb-8">Export current stock as a hardcopy snapshot.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBackupModal(false)} className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-400 py-3 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleExportBackup} className="flex-1 bg-cyan-500 text-zinc-950 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"><Download size={14} /> Export</button>
            </div>
          </div>
        </div>
      )}

      <AdminInventoryHeader 
        onExportAudit={handleExportAuditPDF}
        onBackup={() => setShowBackupModal(true)}
        onManageCats={() => setIsManagingCats(true)}
        onAddProduct={() => openEditor()}
      />

      <div className="flex items-center gap-6 mb-6 px-2 border-b border-zinc-800/50">
        <button 
          onClick={() => setViewMode('active')}
          className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${viewMode === 'active' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Active Roster
          {viewMode === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />}
        </button>
        <button 
          onClick={() => setViewMode('archived')}
          className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${viewMode === 'archived' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          The Archive
          {viewMode === 'archived' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
        </button>
      </div>

      <AdminInventoryToolbar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} mainCategories={mainCategories}
        subCategoryFilter={subCategoryFilter} setSubCategoryFilter={setSubCategoryFilter} subCategories={subCategories}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

      <AdminInventoryTable 
        processedInventory={processedInventory}
        handleSort={handleSort} openEditor={openEditor}
        mainCategories={mainCategories} subCategories={subCategories}
        onQuickSave={handleSaveProduct}
        onToggleArchive={handleToggleArchive}
      />
    </div>
  );
}