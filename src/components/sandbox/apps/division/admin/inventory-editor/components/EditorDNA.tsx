// sandbox/apps/admin/inventory-editor/components/EditorDNA.tsx
import React from 'react';
import { BookText } from 'lucide-react';
import EditorDynamicDetails from './EditorDynamicDetails';
import EditorDisposableHardware from './EditorDisposableHardware';
import EditorEdibleData from './EditorEdibleData';
import EditorStandardDNA from './EditorStandardDNA';

export default function EditorDNA(props: any) {
  // Removed isEdible from destructuring so we don't blindly trust the parent prop
  const { updatedItem, showDNA } = props;
  
  const activeCat = updatedItem?.mainCategory?.toLowerCase() || '';
  const activeSubCat = updatedItem?.subCategory?.toLowerCase() || '';
  const itemName = updatedItem?.name?.toLowerCase() || '';
  
  // 🚀 THE FIX: Strict View Mode hierarchy. A product can only be ONE of these things.
  let viewMode = 'STANDARD';

  if (activeSubCat.includes('disposable') || activeSubCat.includes('vape') || activeSubCat.includes('pen') || itemName.includes('disposable')) {
    viewMode = 'DISPOSABLE';
  } else if (activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt')) {
    viewMode = 'PREROLL';
  } else if (activeCat.includes('edible') || activeSubCat.includes('gummy') || props.isEdible) {
    viewMode = 'EDIBLE';
  }

  return (
    <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
       <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
         <BookText size={16} className="text-emerald-400" /> 
         {viewMode === 'EDIBLE' ? 'Product Facts & Dosing' : 
          viewMode === 'DISPOSABLE' ? 'Hardware & Device Details' : 
          viewMode === 'PREROLL' ? 'Pre-Roll Details & Warnings' : 
          showDNA ? 'Product DNA & Description' : 'Product Description'}
       </h2>

       {/* 1. VAPES & DISPOSABLES ONLY */}
       {viewMode === 'DISPOSABLE' && (
         <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <EditorDisposableHardware updatedItem={updatedItem} setUpdatedItem={props.setUpdatedItem} />
           <EditorDynamicDetails updatedItem={updatedItem} setUpdatedItem={props.setUpdatedItem} />
         </div>
       )}
       
       {/* 2. EDIBLES ONLY */}
       {viewMode === 'EDIBLE' && (
         <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <EditorEdibleData updatedItem={updatedItem} setUpdatedItem={props.setUpdatedItem} />
            <EditorDynamicDetails updatedItem={updatedItem} setUpdatedItem={props.setUpdatedItem} />
         </div>
       )}

       {/* 3. PRE-ROLLS & BLUNTS ONLY */}
       {viewMode === 'PREROLL' && (
         <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <EditorDynamicDetails updatedItem={updatedItem} setUpdatedItem={props.setUpdatedItem} />
         </div>
       )}

       {/* 4. STANDARD FLOWER / EXTRACTS ONLY */}
       {viewMode === 'STANDARD' && (
         <EditorStandardDNA {...props} />
       )}
    </section>
  );
}