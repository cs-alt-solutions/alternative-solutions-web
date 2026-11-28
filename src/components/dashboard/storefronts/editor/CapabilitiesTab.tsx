/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
/* Architecture Note: Renders the "Services / Menu / Departments" Tab with Visual List + Drill-In Focus Mode */
'use client';

import React, { useState, useMemo } from 'react';
import { Layers } from 'lucide-react';
import CategoryAccordion from './capabilities/CategoryAccordion';
import CapabilitiesToolbar from './capabilities/CapabilitiesToolbar';
import CapabilitiesDirectoryList from './capabilities/CapabilitiesDirectoryList';
import CapabilitiesAddonsList from './capabilities/CapabilitiesAddonsList';
import { ContentSelector } from './core/VisualArchitecture/LayoutSelectors';
import {
  EDITOR_WORKSPACE_COPY,
  THEME_CONSTRAINTS,
  getActiveBlueprint,
} from '@/config/dashboard/editor';

export default function CapabilitiesTab({
  formData,
  setFormData,
  onReload,
  isClientPortal = false,
}: {
  formData: any;
  setFormData: any;
  onReload?: () => void;
  isClientPortal?: boolean;
}) {
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'primary' | 'addons'>('primary');

  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;
  const contentCopy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const isMenuLayout = formData?.content_layout === 'menu';
  const isCulinary = formData?.industry_tag === 'Culinary';
  const effectiveSubTab = isHub ? 'primary' : activeSubTab;

  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  const localCaps = useMemo<any[]>(() => {
    if (!Array.isArray(formData.capabilities)) return [];
    return formData.capabilities.map((c: any) =>
      typeof c === 'string'
        ? { title: c, description: '', price: '', bullets: [], isAlaCarte: false }
        : { ...c, bullets: c.bullets || [] }
    );
  }, [formData.capabilities]);

  const normalizedGallery = useMemo<any[]>(() => {
    if (!Array.isArray(formData.gallery_items)) return [];
    return formData.gallery_items.map((item: any, i: number) =>
      typeof item === 'string'
        ? { id: `gal-${i}`, imageUrl: item, category: '', isVisible: true }
        : { ...item, id: item.id || `gal-${i}`, isVisible: item.isVisible !== false }
    );
  }, [formData.gallery_items]);

  const packages = useMemo(
    () => localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter((c) => !c.isAlaCarte),
    [localCaps]
  );

  const addons = useMemo(
    () => localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter((c) => c.isAlaCarte),
    [localCaps]
  );

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const addPackage = () => {
    const updated = [
      {
        title: '',
        description: '',
        price: isMenuLayout ? copy.DIRECTORY.ALL_DAY_DEFAULT : '',
        bullets: [],
        isAlaCarte: false,
      },
      ...localCaps,
    ];
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setActiveSubTab('primary');
    setOpenCapIndex(0);
  };

  const addAddon = () => {
    const updated = [
      ...localCaps,
      { title: '', description: '', price: '', bullets: [], isAlaCarte: true },
    ];
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setActiveSubTab('addons');
    setOpenCapIndex(null);
  };

  const handleUpdateAddon = (index: number, field: string, value: string) => {
    const updated = localCaps.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCapability = (index: number) => {
    const updated = localCaps.filter((_, i) => i !== index);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    if (openCapIndex === index) setOpenCapIndex(null);
    else if (openCapIndex !== null && openCapIndex > index) setOpenCapIndex(openCapIndex - 1);
  };

  const movePackage = (pkgPos: number, direction: 'up' | 'down') => {
    const targetPos = direction === 'up' ? pkgPos - 1 : pkgPos + 1;
    if (targetPos < 0 || targetPos >= packages.length) return;
    const fromIdx = packages[pkgPos].originalIndex;
    const toIdx = packages[targetPos].originalIndex;
    const updated = [...localCaps];
    [updated[fromIdx], updated[toIdx]] = [updated[toIdx], updated[fromIdx]];
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const focusedPkgPos =
    effectiveSubTab === 'primary' && openCapIndex !== null
      ? packages.findIndex((p) => p.originalIndex === openCapIndex)
      : -1;
  const focusedCap = focusedPkgPos >= 0 ? packages[focusedPkgPos] : null;

  // LEVEL 2: DRILL-IN FOCUS VIEW
  if (focusedCap) {
    return (
      <div className="animate-in fade-in slide-in-from-right-2 duration-200 pb-12 pt-2">
        <CategoryAccordion
          cap={focusedCap}
          index={focusedCap.originalIndex}
          displayNumber={focusedPkgPos + 1}
          totalPackages={packages.length}
          onBack={() => setOpenCapIndex(null)}
          onPrev={focusedPkgPos > 0 ? () => setOpenCapIndex(packages[focusedPkgPos - 1].originalIndex) : undefined}
          onNext={focusedPkgPos < packages.length - 1 ? () => setOpenCapIndex(packages[focusedPkgPos + 1].originalIndex) : undefined}
          onRemove={() => removeCapability(focusedCap.originalIndex)}
          localCaps={localCaps}
          formData={formData}
          setFormData={setFormData}
          onReload={onReload}
        />
      </div>
    );
  }

  // LEVEL 1: VISUAL DIRECTORY LIST VIEW
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-3">
      {!isClientPortal && (
        <div className="space-y-2 pb-3 border-b border-zinc-800/70">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Layers size={11} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {copy.FLOW_ACCORDION}
            </span>
          </div>
          <ContentSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
        </div>
      )}

      {/* SECTION HEADINGS (Shown directly alongside the content they label) */}
      {!isHub && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-3 border-b border-zinc-800/70">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block truncate">
              {contentCopy.SERVICES_HEADING_LABEL}
            </label>
            <input
              name="capabilities_heading"
              value={formData.capabilities_heading || ''}
              onChange={handleHeadingChange}
              placeholder={contentCopy.SERVICES_HEADING_PLACEHOLDER}
              className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-cyan-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            />
          </div>

          {!isMenuLayout && (
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block truncate">
                {contentCopy.GALLERY_HEADING_LABEL}
              </label>
              <input
                name="gallery_heading"
                value={formData.gallery_heading || ''}
                onChange={handleHeadingChange}
                placeholder={contentCopy.GALLERY_HEADING_PLACEHOLDER}
                className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-cyan-500 outline-none transition-all text-xs placeholder:text-zinc-700"
              />
            </div>
          )}
        </div>
      )}

      <CapabilitiesToolbar
        isHub={isHub}
        isCulinary={isCulinary}
        effectiveSubTab={effectiveSubTab}
        packagesCount={packages.length}
        addonsCount={addons.length}
        blueprint={blueprint}
        onSelectSubTab={setActiveSubTab}
        onAddPrimary={addPackage}
        onAddAddon={addAddon}
      />

      {effectiveSubTab === 'primary' ? (
        <CapabilitiesDirectoryList
          packages={packages}
          normalizedGallery={normalizedGallery}
          isMenuLayout={isMenuLayout}
          blueprint={blueprint}
          onAddPrimary={addPackage}
          onSelectIndex={setOpenCapIndex}
          onMovePackage={movePackage}
          onRemoveCapability={removeCapability}
        />
      ) : (
        <CapabilitiesAddonsList
          addons={addons}
          onAddAddon={addAddon}
          onUpdateAddon={handleUpdateAddon}
          onRemoveAddon={removeCapability}
        />
      )}
    </div>
  );
}