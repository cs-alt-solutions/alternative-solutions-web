// src/components/dashboard/storefronts/editor/core/VisualArchitecture/LayoutSelectors.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Columns } from 'lucide-react';
import { ALL_HEROS, ALL_CONTENTS, ALL_ABOUTS } from './constants';

const AdvancedToggle = ({ isOpen, onClick, count }: { isOpen: boolean, onClick: () => void, count: number }) => {
  if (count <= 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-800 rounded-lg text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-fuchsia-400 hover:border-fuchsia-900/50 hover:bg-fuchsia-950/20 transition-all"
    >
      {isOpen ? <><ChevronUp size={14} /> Hide Advanced Layouts</> : <><ChevronDown size={14} /> Explore Advanced Layouts ({count})</>}
    </button>
  );
};

export function HeroSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, hero_layout: val }));

  return (
    <div className="space-y-3 pt-6 border-t border-zinc-800/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">2. Hero Layout</label>
        <label className="flex items-center gap-2 cursor-pointer group" title="Lock the background image in place">
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${formData.is_hero_fixed ? 'text-fuchsia-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            Lock Background Image
          </span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={formData.is_hero_fixed || false} onChange={(e) => setFormData((prev: any) => ({ ...prev, is_hero_fixed: e.target.checked }))} />
            <div className={`block w-8 h-4 rounded-full transition-colors ${formData.is_hero_fixed ? 'bg-fuchsia-500' : 'bg-zinc-800 border border-zinc-700'}`}></div>
            <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${formData.is_hero_fixed ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button disabled={!allowedLayouts.hero.includes('center')} onClick={() => handleSelect('center')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'center' || !formData.hero_layout ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 p-1 rounded">
            <div className="w-1/2 h-0.5 bg-zinc-600 rounded" /><div className="w-3/4 h-1 bg-zinc-400 rounded" /><div className="w-1/4 h-1 bg-fuchsia-500 rounded mt-0.5" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.hero_layout === 'center' || !formData.hero_layout ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Centered</span>
        </button>
        <button disabled={!allowedLayouts.hero.includes('split-left')} onClick={() => handleSelect('split-left')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'split-left' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full flex flex-col justify-center gap-0.5 pl-0.5"><div className="w-full h-1 bg-zinc-400 rounded" /><div className="w-2/3 h-0.5 bg-zinc-600 rounded" /><div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" /></div>
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.hero_layout === 'split-left' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Split Left</span>
        </button>
        <button disabled={!allowedLayouts.hero.includes('split-right')} onClick={() => handleSelect('split-right')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'split-right' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
            <div className="w-1/2 h-full flex flex-col justify-center gap-0.5 pr-0.5"><div className="w-full h-1 bg-zinc-400 rounded" /><div className="w-2/3 h-0.5 bg-zinc-600 rounded" /><div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" /></div>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.hero_layout === 'split-right' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Split Right</span>
        </button>
        <button disabled={!allowedLayouts.hero.includes('cinematic')} onClick={() => handleSelect('cinematic')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'cinematic' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-700 mb-2 flex items-end p-1.5 relative overflow-hidden rounded">
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
            <div className="relative z-10 w-full flex flex-col gap-0.5 pr-2"><div className="w-full h-1 bg-white rounded" /><div className="w-1/2 h-1 bg-fuchsia-500 rounded" /></div>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.hero_layout === 'cinematic' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Cinematic</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button disabled={!allowedLayouts.hero.includes('glass')} onClick={() => handleSelect('glass')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'glass' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center justify-center p-1 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-800 opacity-20" />
              <div className="relative z-10 w-2/3 h-2/3 bg-zinc-500/30 border border-white/20 rounded-sm flex flex-col items-center justify-center gap-0.5"><div className="w-3/4 h-0.5 bg-white rounded" /><div className="w-1/2 h-px bg-zinc-300 rounded" /></div>
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.hero_layout === 'glass' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Frosted Glass</span>
          </button>
        </div>
      )}
      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_HEROS.length - 4} />
    </div>
  );
}

export function AboutSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, about_layout: val }));

  return (
    <div className="space-y-3 pt-6 border-t border-zinc-800/60">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><BookOpen size={10} /> 3. About Section</label>
      <div className="grid grid-cols-2 gap-3">
        <button disabled={!allowedLayouts.about.includes('split')} onClick={() => handleSelect('split')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.about_layout === 'split' || !formData.about_layout ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
             <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
             <div className="w-1/2 h-full flex flex-col gap-1 justify-center"><div className="w-3/4 h-1 bg-zinc-400 rounded" /><div className="w-full h-0.5 bg-zinc-600 rounded" /><div className="w-5/6 h-0.5 bg-zinc-600 rounded" /></div>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.about_layout === 'split' || !formData.about_layout ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Classic Split</span>
        </button>
        <button disabled={!allowedLayouts.about.includes('editorial')} onClick={() => handleSelect('editorial')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.about_layout === 'editorial' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center justify-center p-1 rounded relative">
             <div className="absolute left-1.5 top-1.5 w-1/2 h-6 bg-zinc-700 rounded-sm z-0" />
             <div className="absolute right-1.5 bottom-1.5 w-2/3 h-5 bg-zinc-800 border border-zinc-600 rounded-sm z-10 flex flex-col gap-0.5 p-1"><div className="w-full h-0.5 bg-zinc-400 rounded" /><div className="w-3/4 h-px bg-zinc-500 rounded" /></div>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.about_layout === 'editorial' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Editorial</span>
        </button>
        <button disabled={!allowedLayouts.about.includes('minimal')} onClick={() => handleSelect('minimal')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.about_layout === 'minimal' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 rounded">
             <div className="w-3 h-3 rounded-full bg-zinc-700" /><div className="w-1/2 h-0.5 bg-zinc-400 rounded" /><div className="w-3/4 h-px bg-zinc-600 rounded" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.about_layout === 'minimal' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Minimal</span>
        </button>
        <button disabled={!allowedLayouts.about.includes('card')} onClick={() => handleSelect('card')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.about_layout === 'card' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-800 mb-2 flex items-center justify-center p-1 rounded relative overflow-hidden">
             <div className="absolute inset-0 bg-zinc-600" />
             <div className="relative z-10 w-5/6 h-5/6 bg-zinc-950/60 border border-white/20 rounded-sm flex items-center p-1 gap-1"><div className="w-1/3 h-full bg-zinc-500/50 rounded-sm" /><div className="w-2/3 flex flex-col gap-0.5"><div className="w-full h-0.5 bg-zinc-300 rounded" /><div className="w-2/3 h-px bg-zinc-500 rounded" /></div></div>
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.about_layout === 'card' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Glass Card</span>
        </button>
      </div>
      {showAdvanced && ALL_ABOUTS.length > 4 && <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200"></div>}
      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_ABOUTS.length > 4 ? ALL_ABOUTS.length - 4 : 0} />
    </div>
  );
}

export function ContentSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, content_layout: val }));

  return (
    <div className="space-y-3 pt-6 border-t border-zinc-800/60">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Columns size={10} /> 4. Content Flow</label>
      <div className="grid grid-cols-2 gap-3">
        <button disabled={!allowedLayouts.content.includes('classic')} onClick={() => handleSelect('classic')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'classic' || !formData.content_layout ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-1 rounded"><div className="w-full h-2.5 bg-zinc-600 rounded-sm" /><div className="w-full h-2.5 bg-zinc-600 rounded-sm" /></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'classic' || !formData.content_layout ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Stacked</span>
        </button>
        <button disabled={!allowedLayouts.content.includes('bento')} onClick={() => handleSelect('bento')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'bento' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 grid grid-cols-2 gap-1 p-1 rounded"><div className="w-full h-full bg-fuchsia-500/50 rounded-sm" /><div className="w-full h-full bg-zinc-600 rounded-sm" /><div className="w-full h-full bg-zinc-600 rounded-sm" /><div className="w-full h-full bg-fuchsia-500/50 rounded-sm" /></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'bento' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Bento Grid</span>
        </button>
        <button disabled={!allowedLayouts.content.includes('sticky')} onClick={() => handleSelect('sticky')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'sticky' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded"><div className="w-1/3 h-full bg-fuchsia-500/50 rounded-sm" /><div className="w-2/3 h-full flex flex-col gap-0.5"><div className="w-full h-1/2 bg-zinc-600 rounded-sm" /><div className="w-full h-1/2 bg-zinc-600 rounded-sm" /></div></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'sticky' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Sticky Scroll</span>
        </button>
        <button disabled={!allowedLayouts.content.includes('editorial')} onClick={() => handleSelect('editorial')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'editorial' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 rounded relative"><div className="w-3/4 h-1 bg-fuchsia-500/80 rounded-sm z-10" /><div className="w-1/2 h-1 bg-zinc-600 rounded-sm z-10" /><div className="w-2/3 h-1 bg-zinc-600 rounded-sm z-10" /></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'editorial' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Editorial</span>
        </button>
      </div>
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button disabled={!allowedLayouts.content.includes('accordion')} onClick={() => handleSelect('accordion')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'accordion' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-0.5 rounded"><div className="w-full h-1.5 bg-fuchsia-500/50 rounded-sm" /><div className="w-full h-1 bg-zinc-600 rounded-sm" /><div className="w-full h-1 bg-zinc-600 rounded-sm" /><div className="w-full h-1 bg-zinc-600 rounded-sm" /></div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'accordion' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Accordion</span>
          </button>
        </div>
      )}
      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_CONTENTS.length - 4} />
    </div>
  );
}