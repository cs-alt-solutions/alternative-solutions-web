import React from 'react';
import { LayoutTemplate, Palette, Columns } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'industrial', label: 'Industrial', vibe: 'bg-zinc-950 border-cyan-500 text-cyan-400 font-mono uppercase' },
  { value: 'neo', label: 'Neo-Brutalist', vibe: 'bg-yellow-400 border-2 border-black text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' },
  { value: 'cyberpunk', label: 'Cyberpunk', vibe: 'bg-black border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] text-fuchsia-400 font-mono' },
  { value: 'minimal', label: 'Minimalist', vibe: 'bg-white border-zinc-200 text-zinc-900 font-sans tracking-tight' },
  { value: 'elegant', label: 'Elegant', vibe: 'bg-[#FAFAFA] border border-amber-700/30 text-amber-900 font-serif' },
  { value: 'organic', label: 'Organic', vibe: 'bg-[#F4F1EA] border border-[#2C3B2D] text-[#2C3B2D] font-serif rounded-tl-xl rounded-br-xl' },
  { value: 'editorial', label: 'Editorial', vibe: 'bg-[#EAE8E3] border-y-2 border-black text-black font-serif font-bold uppercase tracking-widest' }
];

const BRAND_COLORS = [
  { name: 'Cyan', value: 'cyan-500', twBg: 'bg-cyan-500' },
  { name: 'Fuchsia', value: 'fuchsia-500', twBg: 'bg-fuchsia-500' },
  { name: 'Emerald', value: 'emerald-500', twBg: 'bg-emerald-500' },
  { name: 'Amber', value: 'amber-500', twBg: 'bg-amber-500' },
  { name: 'Rose', value: 'rose-500', twBg: 'bg-rose-500' },
  { name: 'Indigo', value: 'indigo-500', twBg: 'bg-indigo-500' },
  { name: 'Zinc', value: 'zinc-500', twBg: 'bg-zinc-500' }
];

// 🚨 THE MASTER CONSTRAINT MATRIX
const THEME_CONSTRAINTS: Record<string, { hero: string[], content: string[] }> = {
  industrial: { hero: ['center', 'split-left', 'split-right', 'cinematic'], content: ['classic', 'bento', 'sticky', 'accordion', 'editorial'] },
  neo: { hero: ['center', 'split-left', 'split-right'], content: ['classic', 'bento', 'accordion'] },
  cyberpunk: { hero: ['center', 'split-left', 'split-right', 'cinematic'], content: ['classic', 'bento', 'sticky', 'accordion'] },
  minimal: { hero: ['center', 'split-left', 'split-right'], content: ['classic', 'sticky', 'accordion'] },
  elegant: { hero: ['center', 'split-left', 'split-right'], content: ['classic', 'sticky', 'accordion', 'editorial'] },
  organic: { hero: ['center', 'split-left', 'split-right'], content: ['classic', 'bento', 'accordion'] },
  editorial: { hero: ['center', 'split-left', 'split-right'], content: ['classic', 'editorial', 'accordion'] }
};

export default function VisualArchitecture({ formData, handleVisualSelect, setFormData }: { formData: any, handleVisualSelect: any, setFormData: any }) {
  
  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  // Smart Theme Switcher: Auto-corrects clashing layouts
  const handleThemeSwitch = (newTheme: string) => {
    const constraints = THEME_CONSTRAINTS[newTheme];
    let newHero = formData.hero_layout;
    let newContent = formData.content_layout;

    if (!constraints.hero.includes(newHero)) newHero = constraints.hero[0];
    if (!constraints.content.includes(newContent)) newContent = constraints.content[0];

    setFormData((prev: any) => ({ 
      ...prev, 
      theme_style: newTheme, 
      hero_layout: newHero, 
      content_layout: newContent 
    }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-8 shadow-lg">
      <div className="mb-4 border-l-[3px] border-fuchsia-500/60 bg-linear-to-r from-fuchsia-500/10 to-transparent px-5 py-2">
        <h3 className="text-[10px] font-mono font-black text-fuchsia-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <LayoutTemplate className="w-3 h-3" /> Architecture & Vibe
        </h3>
      </div>
      
      {/* 4. DESIGN VIBE (Expanded Grid) */}
      <div className="space-y-3 pt-2">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">1. Set the Foundation Vibe</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {THEME_OPTIONS.map((theme) => (
            <button key={theme.value} type="button" onClick={() => handleThemeSwitch(theme.value)}
              className={`relative p-4 h-24 border-2 transition-all flex flex-col items-center justify-center rounded-lg ${currentTheme === theme.value ? 'border-emerald-500 ring-2 ring-emerald-500/20 z-10' : 'border-zinc-800 hover:border-zinc-600'} ${theme.vibe}`}>
              {/* 🚨 Fixed Text Wrapping */}
              <span className="text-center drop-shadow-sm px-1 text-xs md:text-sm leading-tight break-words whitespace-normal w-full">{theme.label}</span>
              {currentTheme === theme.value && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 1. HERO STRUCTURE */}
      <div className="space-y-3 pt-6 border-t border-zinc-800/50">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">2. Hero Structure</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <button disabled={!allowedLayouts.hero.includes('center')} onClick={() => handleVisualSelect('hero_layout', 'center')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'center' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex flex-col items-center justify-center gap-1.5 p-2 rounded">
              <div className="w-1/2 h-1 bg-zinc-600 rounded" />
              <div className="w-3/4 h-2 bg-zinc-400 rounded" />
              <div className="w-1/4 h-1.5 bg-fuchsia-500 rounded mt-1" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.hero_layout === 'center' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Centered</span>
          </button>

          <button disabled={!allowedLayouts.hero.includes('split-left')} onClick={() => handleVisualSelect('hero_layout', 'split-left')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'split-left' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex items-center p-1.5 gap-2 rounded">
              <div className="w-1/2 h-full flex flex-col justify-center gap-1 pl-1">
                 <div className="w-full h-1.5 bg-zinc-400 rounded" />
                 <div className="w-2/3 h-1 bg-zinc-600 rounded" />
                 <div className="w-1/2 h-1.5 bg-fuchsia-500 rounded mt-0.5" />
              </div>
              <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.hero_layout === 'split-left' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Split Left</span>
          </button>

          <button disabled={!allowedLayouts.hero.includes('split-right')} onClick={() => handleVisualSelect('hero_layout', 'split-right')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'split-right' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex items-center p-1.5 gap-2 rounded">
              <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
              <div className="w-1/2 h-full flex flex-col justify-center gap-1 pr-1">
                 <div className="w-full h-1.5 bg-zinc-400 rounded" />
                 <div className="w-2/3 h-1 bg-zinc-600 rounded" />
                 <div className="w-1/2 h-1.5 bg-fuchsia-500 rounded mt-0.5" />
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.hero_layout === 'split-right' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Split Right</span>
          </button>

          <button disabled={!allowedLayouts.hero.includes('cinematic')} onClick={() => handleVisualSelect('hero_layout', 'cinematic')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.hero_layout === 'cinematic' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-12 border border-zinc-700 bg-zinc-700 mb-3 flex items-end p-2 relative overflow-hidden rounded">
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
              <div className="relative z-10 w-full flex flex-col gap-1 pr-4">
                 <div className="w-full h-1.5 bg-white rounded" />
                 <div className="w-1/2 h-1.5 bg-fuchsia-500 rounded" />
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.hero_layout === 'cinematic' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Cinematic</span>
          </button>
        </div>
      </div>

      {/* 2. CONTENT FLOW (THE NEW TOGGLES) */}
      <div className="space-y-3 pt-6 border-t border-zinc-800/50">
        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Columns size={12} /> 3. Content Flow (Services & Gallery)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <button disabled={!allowedLayouts.content.includes('classic')} onClick={() => handleVisualSelect('content_layout', 'classic')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'classic' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
             <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex flex-col p-1.5 gap-1.5 rounded">
                <div className="w-full h-3 bg-zinc-600 rounded-sm" />
                <div className="w-full h-3 bg-zinc-600 rounded-sm" />
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.content_layout === 'classic' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Stacked</span>
          </button>

          <button disabled={!allowedLayouts.content.includes('bento')} onClick={() => handleVisualSelect('content_layout', 'bento')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'bento' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
             <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 grid grid-cols-2 gap-1 p-1.5 rounded">
                <div className="w-full h-full bg-fuchsia-500/50 rounded-sm" />
                <div className="w-full h-full bg-zinc-600 rounded-sm" />
                <div className="w-full h-full bg-zinc-600 rounded-sm" />
                <div className="w-full h-full bg-fuchsia-500/50 rounded-sm" />
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.content_layout === 'bento' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Bento Grid</span>
          </button>

          <button disabled={!allowedLayouts.content.includes('sticky')} onClick={() => handleVisualSelect('content_layout', 'sticky')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'sticky' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
             <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex p-1.5 gap-1.5 rounded">
                <div className="w-1/3 h-full bg-fuchsia-500/50 rounded-sm" />
                <div className="w-2/3 h-full flex flex-col gap-1">
                  <div className="w-full h-1/2 bg-zinc-600 rounded-sm" />
                  <div className="w-full h-1/2 bg-zinc-600 rounded-sm" />
                </div>
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.content_layout === 'sticky' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Sticky Scroll</span>
          </button>

          <button disabled={!allowedLayouts.content.includes('editorial')} onClick={() => handleVisualSelect('content_layout', 'editorial')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'editorial' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
             <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex flex-col items-center justify-center gap-1 rounded relative">
                <div className="w-3/4 h-1.5 bg-fuchsia-500/80 rounded-sm z-10" />
                <div className="w-1/2 h-1.5 bg-zinc-600 rounded-sm z-10" />
                <div className="w-2/3 h-1.5 bg-zinc-600 rounded-sm z-10" />
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.content_layout === 'editorial' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Editorial Hover</span>
          </button>

          <button disabled={!allowedLayouts.content.includes('accordion')} onClick={() => handleVisualSelect('content_layout', 'accordion')} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'accordion' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
             <div className="w-full h-12 border border-zinc-700 bg-zinc-900 mb-3 flex flex-col p-2 gap-1.5 rounded">
                <div className="w-full h-2 bg-fuchsia-500/50 rounded-sm" />
                <div className="w-full h-2 bg-zinc-600 rounded-sm" />
                <div className="w-full h-2 bg-zinc-600 rounded-sm" />
             </div>
             <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.content_layout === 'accordion' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>Accordion</span>
          </button>

        </div>
      </div>

      {/* 3. BRAND COLOR */}
      <div className="space-y-3 pt-6 border-t border-zinc-800/50">
        <div className="flex items-center gap-3">
           <Palette className="w-4 h-4 text-emerald-400" />
           <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">4. Brand Injection Color</label>
        </div>
        <div className="flex gap-3">
          {BRAND_COLORS.map((c) => (
            <button key={c.value} type="button" onClick={() => setFormData((p: any) => ({...p, brand_color: c.value}))}
              className={`w-10 h-10 rounded-full border-4 shadow-lg transition-all ${formData.brand_color === c.value ? 'border-white scale-110 shadow-white/20' : 'border-zinc-800/50 hover:scale-105'} ${c.twBg}`} 
              title={c.name}
            />
          ))}
        </div>
      </div>

    </div>
  );
}