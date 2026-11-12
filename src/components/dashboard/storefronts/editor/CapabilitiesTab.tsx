/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
/* Architecture Note: Renders the "Services / Menu / Departments" Tab + Content Flow Selector */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Utensils, Trash2, Layers } from 'lucide-react';
import CategoryAccordion from './capabilities/CategoryAccordion';
import EditorAccordion from './shared/EditorAccordion';
import { ContentSelector } from './core/VisualArchitecture/LayoutSelectors';
import { 
  EDITOR_WORKSPACE_COPY, THEME_CONSTRAINTS, getActiveBlueprint 
} from '@/config/dashboard/editor';

export default function CapabilitiesTab({ 
  formData, setFormData, onReload, isClientPortal = false 
}: { 
  formData: any; setFormData: any; onReload?: () => void; isClientPortal?: boolean;
}) {
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(0);
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;
  const blueprint = getActiveBlueprint(formData?.industry_tag, formData?.engine_mode);
  const isMenuLayout = formData?.content_layout === 'menu';
  const isCulinary = formData?.industry_tag === 'Culinary';

  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  useEffect(() => {
    if (formData.capabilities) {
      const normalized = formData.capabilities.map((c: any) => 
        typeof c === 'string' ? { title: c, description: '', price: '', bullets: [], isAlaCarte: false } : { ...c, bullets: c.bullets || [] }
      );
      setLocalCaps(normalized);
    }
  }, [formData.capabilities]);

  const addPackage = () => {
    const updated = [{ 
      title: '', 
      description: '', 
      price: isMenuLayout ? 'All Day' : '', 
      bullets: [], 
      isAlaCarte: false 
    }, ...localCaps];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setOpenCapIndex(0);
  };

  const addAddon = () => {
    const updated = [...localCaps, { 
      title: '', 
      description: '', 
      price: '', 
      bullets: [], 
      isAlaCarte: true 
    }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const handleUpdateAddon = (index: number, field: string, value: string) => {
    const updated = [...localCaps];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCapability = (index: number) => {
    const updated = localCaps.filter((_, i) => i !== index);
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const packages = localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter(c => !c.isAlaCarte);
  const addons = localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.isAlaCarte);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      {/* 0. CONTENT FLOW SELECTOR (Admin Only) */}
      {!isClientPortal && (
        <EditorAccordion
          title={copy.FLOW_ACCORDION}
          icon={Layers}
          accentColor="emerald"
          hidePercentage={true}
          isOpen={isFlowOpen}
          onToggle={() => setIsFlowOpen(!isFlowOpen)}
        >
          <div className="space-y-3">
            <p className="text-[10px] text-zinc-400 leading-relaxed">{copy.FLOW_HELPER}</p>
            <ContentSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
          </div>
        </EditorAccordion>
      )}

      {/* 1. CORE OFFERINGS / CATEGORIES SECTION */}
      <div>
        <div className={`flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 ${isCulinary ? 'text-fuchsia-500' : 'text-cyan-500'}`}>
          <div className="flex items-center gap-2">
            {isCulinary ? <Utensils className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              {blueprint.sectionHeading}
            </h2>
          </div>
          
          <button 
            type="button" 
            onClick={addPackage} 
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer px-3 py-1.5 rounded-lg shadow-sm border ${isCulinary ? 'text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20 hover:bg-fuchsia-500/20' : 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20'}`}
          >
            <Plus className="w-3 h-3" /> {blueprint.addPrimaryBtn}
          </button>
        </div>

        <div className="space-y-4">
          {packages.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
              <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">{blueprint.emptyPrimaryText}</p>
            </div>
          ) : (
            packages.map((cap) => (
              <CategoryAccordion 
                key={cap.originalIndex}
                cap={cap}
                index={cap.originalIndex}
                isOpen={openCapIndex === cap.originalIndex}
                setOpenCapIndex={setOpenCapIndex}
                localCaps={localCaps}
                setLocalCaps={setLocalCaps}
                formData={formData}
                setFormData={setFormData}
                onReload={onReload}
              />
            ))
          )}
        </div>
      </div>

      {/* 2. FLAT ADD-ONS SECTION */}
      <div className="pt-6 border-t border-zinc-800/50">
        <div className="flex items-center justify-between pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-fuchsia-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">{copy.ADDONS_HEADING}</h2>
          </div>
          <button 
            type="button" 
            onClick={addAddon} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3 h-3" /> {copy.ADD_ADDON_BTN}
          </button>
        </div>

        <div className="space-y-3">
          {addons.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{copy.EMPTY_ADDONS}</p>
            </div>
          ) : (
            addons.map((addon) => (
              <div key={addon.originalIndex} className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col gap-3 group relative">
                <button 
                  onClick={() => removeCapability(addon.originalIndex)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title={copy.REMOVE_ADDON_TITLE}
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="flex items-start gap-3 pr-8">
                  <div className="flex-1">
                    <input 
                      value={addon.title} 
                      onChange={(e) => handleUpdateAddon(addon.originalIndex, 'title', e.target.value)}
                      placeholder={copy.ADDON_NAME_PLACEHOLDER} 
                      className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-white text-xs focus:border-fuchsia-500 outline-none"
                    />
                  </div>
                  <div className="w-24 shrink-0">
                    <input 
                      value={addon.price} 
                      onChange={(e) => handleUpdateAddon(addon.originalIndex, 'price', e.target.value)}
                      placeholder={copy.ADDON_PRICE_PLACEHOLDER} 
                      className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-fuchsia-400 font-mono font-bold text-xs focus:border-fuchsia-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input 
                    value={addon.description} 
                    onChange={(e) => handleUpdateAddon(addon.originalIndex, 'description', e.target.value)}
                    placeholder={copy.ADDON_DESC_PLACEHOLDER} 
                    className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-zinc-300 text-[11px] focus:border-fuchsia-500 outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}