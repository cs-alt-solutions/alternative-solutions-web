'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Printer, FileText, Download, Smartphone, PackagePlus, History } from 'lucide-react';
import AuditSidebar from './AuditSidebar';
import AuditTable from './AuditTable';
import LiveAuditSession from './LiveAuditSession';
import LiveIntakeSession from './LiveIntakeSession';
import AuditHistoryLogs from './AuditHistoryLogs';
import { getCalculatedStock, handlePrintManifest, handleExportCSV } from './audit-utils';

export default function AdminInventoryAudit({ stock, setStock, setNotification, clientConfig, onClose }: any) {
  // --- FILTER & SORT STATE ---
  const [reportType, setReportType] = useState<'ALL' | 'LOW_STOCK' | 'OOS' | 'MISSING_ASSETS' | 'PROMO'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // --- TRI-STATE LOGISTICS TOGGLES ---
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [isIntakeSession, setIsIntakeSession] = useState(false);
  const [showLedger, setShowLedger] = useState(false);

  // --- DYNAMIC DATA MAPPING ---
  const mainCategories = clientConfig.categories || [];
  const subCategoriesMap = clientConfig.subCategories || {};
  const availableSubs = categoryFilter !== 'All' ? (subCategoriesMap[categoryFilter] || []) : [];
  
  const availableBrands = useMemo(() => {
    const brands = stock.map((i: any) => i.brand?.trim()).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [stock]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const auditData = useMemo(() => {
    let filtered = [...stock].filter((i: any) => i.status !== 'archived');

    if (reportType === 'LOW_STOCK') {
      filtered = filtered.filter((i: any) => {
        const s = getCalculatedStock(i);
        return s > 0 && s <= 15;
      });
    } else if (reportType === 'OOS') {
      filtered = filtered.filter((i: any) => getCalculatedStock(i) <= 0);
    } else if (reportType === 'MISSING_ASSETS') {
      filtered = filtered.filter((i: any) => !i.imageUrl && !i.iconUrl);
    } else if (reportType === 'PROMO') {
      filtered = filtered.filter((i: any) => i.dailyDeal);
    }

    if (categoryFilter !== 'All') filtered = filtered.filter((i: any) => i.mainCategory === categoryFilter);
    if (subCategoryFilter !== 'All') filtered = filtered.filter((i: any) => i.subCategory === subCategoryFilter);
    if (brandFilter !== 'All') filtered = filtered.filter((i: any) => i.brand === brandFilter);

    filtered.sort((a: any, b: any) => {
      let aVal: any = 0; let bVal: any = 0;
      if (sortConfig.key === 'name') { aVal = a.name?.toLowerCase() || ''; bVal = b.name?.toLowerCase() || ''; }
      else if (sortConfig.key === 'brand') { aVal = a.brand?.toLowerCase() || ''; bVal = b.brand?.toLowerCase() || ''; }
      else if (sortConfig.key === 'taxonomy') { aVal = `${a.mainCategory} ${a.subCategory}`.toLowerCase(); bVal = `${b.mainCategory} ${b.subCategory}`.toLowerCase(); }
      else if (sortConfig.key === 'stock') { aVal = getCalculatedStock(a); bVal = getCalculatedStock(b); }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [stock, reportType, categoryFilter, subCategoryFilter, brandFilter, sortConfig]);

  const filtersAppliedStr = [
    categoryFilter !== 'All' ? `Cat: ${categoryFilter}` : null,
    subCategoryFilter !== 'All' ? `Sub: ${subCategoryFilter}` : null,
    brandFilter !== 'All' ? `Brand: ${brandFilter}` : null
  ].filter(Boolean).join(' | ');

  // --- ROUTING RENDER LOGIC ---
  if (isLiveSession) {
    return (
      <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto">
        <LiveAuditSession 
           stock={stock} 
           clientConfig={clientConfig} 
           setStock={setStock} 
           setNotification={setNotification} 
           onCancel={() => setIsLiveSession(false)} 
        />
      </div>
    );
  }

  if (isIntakeSession) {
    return (
      <div className="p-4 md:p-8 pb-32 max-w-4xl mx-auto">
        <LiveIntakeSession 
           stock={stock} 
           clientConfig={clientConfig} 
           setStock={setStock} 
           setNotification={setNotification} 
           onCancel={() => setIsIntakeSession(false)} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom-8 pb-32">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 pb-6 border-b border-zinc-800/50 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors active:scale-95 shrink-0">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <FileText size={24} className="text-fuchsia-400" /> Logistics Terminal
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Audit, Receive, & Export Data</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowLedger(!showLedger)} className={`font-black uppercase tracking-widest py-3 px-5 rounded-xl text-[10px] transition-all flex items-center gap-2 shadow-lg active:scale-95 ${showLedger ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}>
            <History size={14} /> Ledger
          </button>
          <div className="w-px h-8 bg-zinc-800 hidden sm:block mx-1"></div>
          <button onClick={() => setIsIntakeSession(true)} className="bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 font-black uppercase tracking-widest py-3 px-5 rounded-xl text-[10px] transition-all flex items-center gap-2 shadow-lg active:scale-95">
            <PackagePlus size={14} /> Receive Intake
          </button>
          <button onClick={() => setIsLiveSession(true)} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-3 px-6 rounded-xl text-[10px] sm:text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95">
            <Smartphone size={16} /> Digital Audit
          </button>
        </div>
      </div>

      {/* BODY ROUTING */}
      {showLedger ? (
         <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-black text-zinc-300 uppercase tracking-widest mb-6 border-b border-zinc-800/50 pb-4">Immutable Warehouse Ledger</h3>
            <AuditHistoryLogs clientConfig={clientConfig} />
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1">
             <AuditSidebar 
               reportType={reportType} setReportType={setReportType}
               categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
               subCategoryFilter={subCategoryFilter} setSubCategoryFilter={setSubCategoryFilter}
               brandFilter={brandFilter} setBrandFilter={setBrandFilter}
               mainCategories={mainCategories} availableSubs={availableSubs} availableBrands={availableBrands}
             />
             <div className="mt-6 space-y-3">
                <button onClick={() => handleExportCSV(auditData)} className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-black uppercase tracking-widest py-3 px-5 rounded-xl text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                  <Download size={14} /> Export CSV
                </button>
                <button onClick={() => handlePrintManifest(auditData, clientConfig, reportType, filtersAppliedStr)} className="w-full bg-fuchsia-500/10 border border-fuchsia-500/50 hover:bg-fuchsia-500/20 text-fuchsia-400 font-black uppercase tracking-widest py-3 px-5 rounded-xl text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                  <Printer size={14} /> Print Paper Manifest
                </button>
             </div>
          </div>
          <div className="lg:col-span-3">
             <AuditTable auditData={auditData} handleSort={handleSort} />
          </div>
        </div>
      )}
    </div>
  );
}