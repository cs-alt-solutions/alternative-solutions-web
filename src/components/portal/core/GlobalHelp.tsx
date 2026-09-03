/* src/components/portal/core/GlobalHelp.tsx */
'use client';

import React from 'react';
import { X, Store, FileUp, LifeBuoy, CreditCard, HelpCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PORTAL_COPY } from '@/config/clients/portal';
import { getPortalTheme } from './theme';

export default function GlobalHelp({ 
  isOpen, 
  onClose, 
  clientId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  clientId: string;
}) {
  const router = useRouter();
  const currentTheme = getPortalTheme(clientId);
  const copy = PORTAL_COPY.helpGuide;

  if (!isOpen) return null;

  const renderGuideIcon = (id: string) => {
    switch (id) {
      case 'storefront': return <Store size={18} className={currentTheme.text} />;
      case 'vault': return <FileUp size={18} className={currentTheme.text} />;
      case 'support': return <LifeBuoy size={18} className={currentTheme.text} />;
      case 'billing': return <CreditCard size={18} className={currentTheme.text} />;
      default: return <HelpCircle size={18} className={currentTheme.text} />;
    }
  };

  const handleShowMe = (id: string) => {
    onClose(); 
    
    const routeMap: Record<string, { navId: string, path: string }> = {
      'storefront': { navId: 'nav-storefront', path: `/portal/${clientId}/storefront` },
      'vault': { navId: 'nav-vault', path: `/portal/${clientId}/vault` },
      'support': { navId: 'nav-support', path: `/portal/${clientId}/support` },
      'billing': { navId: 'nav-billing', path: `/portal/${clientId}/billing` }
    };

    const target = routeMap[id];
    if (target) {
      router.push(target.path);
      
      setTimeout(() => {
        const el = document.getElementById(target.navId);
        if (el) {
          el.classList.add('ring-2', 'ring-cyan-500', 'bg-cyan-500/20', 'animate-pulse', 'scale-105');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-cyan-500', 'bg-cyan-500/20', 'animate-pulse', 'scale-105');
          }, 3000);
        }
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden">
        
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-50 ${currentTheme.bg}`} />

        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-zinc-900/30 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${currentTheme.border} ${currentTheme.bg}`}>
              <HelpCircle size={20} className={currentTheme.text} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">{copy.title}</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">{copy.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] custom-scrollbar relative z-10">
          <div className="relative pl-5 border-l border-zinc-800/80 pb-2 mb-8">
            <div className={`absolute w-2.5 h-2.5 ${currentTheme.bg.replace('/10', '')} rounded-full -left-[5.5px] top-1.5`} />
            <p className="text-sm text-zinc-300 leading-relaxed font-light">
              {copy.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copy.sections.map((section: any) => (
              <div key={section.id} className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col group hover:border-zinc-700 transition-colors shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg border border-transparent group-hover:${currentTheme.border.split(' ')[0]} transition-colors ${currentTheme.bg}`}>
                    {renderGuideIcon(section.id)}
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">{section.title}</h4>
                </div>
                {/* 🚀 FIXED: pl-10.5 instead of pl-[42px] */}
                <p className="text-xs text-zinc-400 leading-relaxed pl-10.5 mb-6 flex-1">
                  {section.desc}
                </p>
                {/* 🚀 FIXED: ml-10.5 instead of ml-[42px] */}
                <button 
                  onClick={() => handleShowMe(section.id)}
                  className={`mt-auto ml-10.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all w-max hover:translate-x-1 ${currentTheme.text} cursor-pointer`}
                >
                  Show Me <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}