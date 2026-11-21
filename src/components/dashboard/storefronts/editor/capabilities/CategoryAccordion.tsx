/* src/components/dashboard/storefronts/editor/capabilities/CategoryAccordion.tsx */
'use client';

import React from 'react';
import { ChevronDown, Plus, Image as ImageIcon } from 'lucide-react';
import MenuCardEditor from './MenuCardEditor';
import CategoryRowHeader from './category/CategoryRowHeader';
import LinkedPoliciesBar from './category/LinkedPoliciesBar';
import StandardCategoryFields from './category/StandardCategoryFields';
import { EDITOR_WORKSPACE_COPY, getActiveBlueprint } from '@/config/dashboard/editor';

export default function CategoryAccordion({
  cap,
  index,
  isOpen,
  setOpenCapIndex,
  localCaps,
  setLocalCaps,
  formData,
  setFormData,
  onReload,
}: any) {
  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const isMenuMode = formData?.content_layout === 'menu';
  const isAlaCarte = !!cap.isAlaCarte;

  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') {
      return { id: `gal-${i}`, imageUrl: item, title: '', description: '', category: '', price: '', isVisible: true };
    }
    return { ...item, id: item.id || `gal-${i}`, isVisible: item.isVisible !== false };
  });

  const categoryImages = liveGallery.filter((img: any) => img.category === cap.title);

  const updateTitle = (newTitle: string) => {
    const oldTitle = localCaps[index]?.title;
    const updatedCaps = localCaps.map((item: any, i: number) =>
      i === index ? { ...item, title: newTitle } : item
    );
    setLocalCaps(updatedCaps);

    setFormData((prev: any) => {
      const updatedFormDataCaps = (prev.capabilities || []).map((item: any, i: number) =>
        i === index ? { ...item, title: newTitle } : item
      );

      const updatedGallery = (prev.gallery_items || []).map((item: any) =>
        oldTitle !== undefined && item.category === oldTitle ? { ...item, category: newTitle } : item
      );

      const updatedTerms = Array.isArray(prev.operational_terms)
        ? prev.operational_terms.map((term: any) =>
            oldTitle && term.appliesTo === oldTitle ? { ...term, appliesTo: newTitle } : term
          )
        : prev.operational_terms;

      return {
        ...prev,
        capabilities: updatedFormDataCaps,
        gallery_items: updatedGallery,
        operational_terms: updatedTerms,
      };
    });
  };

  const updateField = (field: string, value: any) => {
    const updated = localCaps.map((item: any, i: number) =>
      i === index ? { ...item, [field]: value } : item
    );
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCap = () => {
    const updated = localCaps.filter((_: any, i: number) => i !== index);
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    if (isOpen) setOpenCapIndex(null);
  };

  const moveItem = (direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localCaps.length) return;
    const updated = [...localCaps];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    if (isOpen) setOpenCapIndex(target);
  };

  const addBlankCard = () => {
    const newId = `card-${Date.now()}`;
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: [
        { id: newId, imageUrl: '', title: '', description: '', price: '', category: cap.title, isVisible: true },
        ...(prev.gallery_items || []),
      ],
    }));
  };

  const currentAvailability = isMenuMode ? cap.price || 'All Day' : cap.price || '';

  return (
    <div
      className={`flex flex-col rounded-lg relative overflow-hidden transition-all border ${
        isOpen
          ? isAlaCarte
            ? 'bg-zinc-950 border-fuchsia-500/40'
            : 'bg-zinc-950 border-zinc-700'
          : isAlaCarte
            ? 'bg-zinc-950/80 border-fuchsia-900/30 hover:border-fuchsia-500/30'
            : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <CategoryRowHeader
        title={cap.title}
        index={index}
        totalCount={localCaps.length}
        isOpen={isOpen}
        isMenuMode={isMenuMode}
        isAlaCarte={isAlaCarte}
        cardsCount={categoryImages.length}
        copy={copy}
        onToggle={() => setOpenCapIndex(isOpen ? null : index)}
        onMove={moveItem}
        onRemove={removeCap}
      />

      {isOpen && (
        <div className="p-3.5 border-t border-zinc-800/80 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="space-y-2.5">
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={cap.title || ''}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder={isAlaCarte ? copy.ADDON_NAME_PLACEHOLDER : blueprint.titlePlaceholder}
                className="flex-1 min-w-0 bg-black/50 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-cyan-500 transition-colors"
              />

              {isMenuMode ? (
                <div className="relative w-28 shrink-0">
                  <select
                    value={currentAvailability}
                    onChange={(e) => updateField('price', e.target.value)}
                    className="w-full bg-black/50 border border-zinc-800 rounded-md pl-2.5 pr-6 py-1.5 text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                  >
                    {copy.AVAILABILITY_OPTIONS.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-500/60 pointer-events-none" />
                </div>
              ) : !isHub ? (
                <input
                  type="text"
                  value={cap.price === 'All Day' ? '' : cap.price || ''}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder={blueprint.pricePlaceholder}
                  className="w-28 shrink-0 bg-black/50 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-fuchsia-400 font-bold outline-none focus:border-fuchsia-500 transition-colors"
                />
              ) : null}
            </div>

            <textarea
              value={cap.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder={copy.SHORT_DESC_PLACEHOLDER}
              rows={2}
              className="w-full bg-black/50 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {!isAlaCarte && (
            <LinkedPoliciesBar
              categoryTitle={cap.title}
              operationalTerms={formData.operational_terms}
            />
          )}

          {isMenuMode ? (
            <div className="space-y-3 pt-3 border-t border-zinc-800/60">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold text-fuchsia-500 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon size={11} /> {copy.MENU_CARDS_LABEL} ({categoryImages.length})
                </label>
                <button
                  type="button"
                  onClick={addBlankCard}
                  className="text-[9px] font-bold text-zinc-400 hover:text-fuchsia-400 uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={10} /> {copy.ADD_BLANK_CARD_BTN}
                </button>
              </div>

              {categoryImages.length === 0 ? (
                <p className="text-[10px] text-zinc-600 italic">{copy.EMPTY_MENU_CARDS}</p>
              ) : (
                <div className="space-y-2.5">
                  {categoryImages.map((img: any, i: number) => (
                    <MenuCardEditor
                      key={img.id || `gal-${i}`}
                      img={img}
                      index={i}
                      categoryImagesCount={categoryImages.length}
                      localCaps={localCaps}
                      isMenuMode={isMenuMode}
                      formData={formData}
                      setFormData={setFormData}
                      onReload={onReload}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            !isAlaCarte && (
              <StandardCategoryFields
  cap={cap}
  storefrontId={formData.id}
  galleryItems={formData.gallery_items || []}
  setFormData={setFormData}
  blueprint={blueprint}
  onUpdateField={updateField}
/>
            )
          )}
        </div>
      )}
    </div>
  );
}