/* src/components/shift-studio/xlg/RoiCalculator.tsx */
'use client';
import React, { useState, useMemo } from 'react';
import { WEBSITE_COPY, SYSTEM_CONFIG, AppTool, HourTier } from '@/utils/glossary';
import { Calculator, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

export default function RoiCalculator() {
  const { ROI } =  WEBSITE_COPY.SHIFT_STUDIO_PAGE;
  
  const [auditMode, setAuditMode] = useState<'BASELINE' | 'CUSTOM'>('BASELINE');
  const [customCosts, setCustomCosts] = useState<Record<string, number>>({});
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<number>(ROI.HOUR_TIERS[1].value);
  const [laborRate, setLaborRate] = useState<number>(SYSTEM_CONFIG.RATES.LABOR);
  
  const toggleApp = (appId: string) => {
    setSelectedApps(prev => prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]);
  };

  const handleCustomCostChange = (category: string, value: string) => {
    setCustomCosts(prev => ({ ...prev, [category]: Number(value) || 0 }));
  };

  const auditData = useMemo(() => {
    const categoryKeys = Object.keys(ROI.CATEGORIES) as Array<keyof typeof ROI.CATEGORIES>;
    const appLineItems: { name: string; cost: number; isCustom: boolean }[] = [];
    let totalMonthlyApps = 0;

    categoryKeys.forEach(catKey => {
      if (auditMode === 'BASELINE') {
        const appsInCat = ROI.APPS.filter((a: AppTool) => a.category === catKey);
        const cheapest = appsInCat.reduce((min: AppTool, p: AppTool) => p.cost < min.cost ? p : min, appsInCat[0]);
        appLineItems.push({ name: `${cheapest.name}`, cost: cheapest.cost, isCustom: false });
        totalMonthlyApps += cheapest.cost;
      } else {
        const manualCost = customCosts[catKey] || 0;
        const appsInCat = ROI.APPS.filter((a: AppTool) => a.category === catKey);
        const selectedInCat = appsInCat.filter((a: AppTool) => selectedApps.includes(a.id));

        if (manualCost > 0) {
           appLineItems.push({ name: `Custom ${ROI.CATEGORIES[catKey]}`, cost: manualCost, isCustom: true });
           totalMonthlyApps += manualCost;
        } else if (selectedInCat.length > 0) {
          selectedInCat.forEach((app: AppTool) => {
            appLineItems.push({ name: app.name, cost: app.cost, isCustom: true });
            totalMonthlyApps += app.cost;
          });
        }
      }
    });

    const monthlyTimeValue = selectedHours * 4.33 * laborRate;
    const yearlyTimeValue = selectedHours * 52 * laborRate;
    const monthlyNet = totalMonthlyApps + monthlyTimeValue - SYSTEM_CONFIG.RATES.PUBLIC;
    const yearlyNet = (totalMonthlyApps * 12) + yearlyTimeValue - (SYSTEM_CONFIG.RATES.PUBLIC * 12);

    return { 
      appLineItems, 
      monthly: { app: totalMonthlyApps, time: monthlyTimeValue, studio: SYSTEM_CONFIG.RATES.PUBLIC, net: monthlyNet }, 
      yearly: { app: totalMonthlyApps * 12, time: yearlyTimeValue, studio: SYSTEM_CONFIG.RATES.PUBLIC * 12, net: yearlyNet } 
    };
  }, [selectedApps, selectedHours, laborRate, ROI, auditMode, customCosts]);

  return (
    <div className="w-full relative animate-in fade-in duration-700">
      
      {/* Sleek Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="text-brand-primary" size={24} />
            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">{ROI.TITLE}</h3>
          </div>
          <p className="text-base text-white/60 font-light leading-relaxed">{ROI.SUBTITLE}</p>
        </div>

        <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
          <button 
            onClick={() => setAuditMode('BASELINE')}
            className={`px-8 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${auditMode === 'BASELINE' ? 'bg-white text-black font-bold shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            {ROI.TOGGLES.BASELINE}
          </button>
          <button 
            onClick={() => setAuditMode('CUSTOM')}
            className={`px-8 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${auditMode === 'CUSTOM' ? 'bg-brand-primary text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-white/50 hover:text-white'}`}
          >
            {ROI.TOGGLES.CUSTOM}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* INPUTS (LEFT) */}
        <div className="lg:col-span-6 space-y-12">
          
          {auditMode === 'BASELINE' ? (
            <div className="h-full flex flex-col justify-center py-12 animate-in fade-in slide-in-from-bottom-4">
              <Sparkles className="text-brand-primary/50 mb-6" size={32} />
              <h4 className="text-3xl font-black text-white tracking-tight mb-4">{ROI.BASELINE_INFO.TITLE}</h4>
              <p className="text-lg text-white/50 font-light leading-relaxed mb-10 max-w-md">{ROI.BASELINE_INFO.DESC}</p>
              <button 
                onClick={() => setAuditMode('CUSTOM')}
                className="group w-fit flex items-center gap-4 text-brand-primary hover:text-white transition-colors"
              >
                <span className="text-xs font-mono uppercase tracking-widest font-bold">{ROI.BASELINE_INFO.PROMPT}</span> 
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all">
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-left-4">
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold font-mono">1</div>
                  <h4 className="text-lg font-medium text-white tracking-tight">{ROI.STEP_1_LABEL}</h4>
                </div>
                
                <div className="space-y-8 pl-4 border-l border-white/5 ml-3">
                  {(Object.keys(ROI.CATEGORIES) as Array<keyof typeof ROI.CATEGORIES>).map((catKey) => (
                    <div key={catKey.toString()} className="space-y-4">
                      <span className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.2em]">{ROI.CATEGORIES[catKey]}</span>
                      
                      <div className="flex flex-wrap gap-3">
                        {ROI.APPS.filter((a: AppTool) => a.category === catKey).map((app: AppTool) => (
                          <button 
                            key={app.id} 
                            onClick={() => toggleApp(app.id)} 
                            disabled={customCosts[catKey] > 0}
                            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${
                              selectedApps.includes(app.id) 
                              ? 'bg-brand-primary text-black shadow-[0_4px_20px_rgba(6,182,212,0.3)] -translate-y-0.5' 
                              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {app.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{ROI.MANUAL_INPUT_LABEL}</span>
                        <div className="relative w-32">
                          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                          <input 
                            type="number"
                            placeholder="0"
                            value={customCosts[catKey] || ''}
                            onChange={(e) => handleCustomCostChange(catKey.toString(), e.target.value)}
                            className="w-full bg-transparent border-b border-white/20 py-1 pl-8 text-white text-sm font-mono focus:border-brand-primary outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold font-mono">2</div>
                  <h4 className="text-lg font-medium text-white tracking-tight">{ROI.STEP_2_LABEL}</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-4 border-l border-white/5 ml-3">
                  {ROI.HOUR_TIERS.map((tier: HourTier) => (
                    <button 
                      key={tier.label} 
                      onClick={() => setSelectedHours(tier.value)} 
                      className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedHours === tier.value 
                        ? 'bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.2)] -translate-y-0.5' 
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold font-mono">3</div>
                  <h4 className="text-lg font-medium text-white tracking-tight">{ROI.STEP_3_LABEL}</h4>
                </div>
                <div className="pl-4 border-l border-white/5 ml-3">
                  <div className="relative max-w-50">
                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" />
                    <input 
                      type="number" 
                      value={laborRate} 
                      onChange={(e) => setLaborRate(Number(e.target.value))} 
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 text-white font-bold text-lg outline-none focus:border-brand-primary/50 transition-colors" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* THE GLASS RECEIPT (RIGHT) */}
        <div className="lg:col-span-6">
          <div className="sticky top-32 bg-linear-to-b from-white/5 to-transparent border border-white/10 rounded-4xl p-8 md:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Aesthetic Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-12">{ROI.BREAKDOWN_TITLE}</h4>
            
            <div className="space-y-8 relative z-10">
              
              {/* Line Items */}
              <div className="space-y-4">
                {auditData.appLineItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-white/70">
                    <span className={`text-sm ${!item.isCustom ? 'italic opacity-60' : 'font-medium text-white'}`}>{item.name}</span>
                    <div className="flex gap-8 text-sm font-mono">
                      <span className="w-16 text-right">${item.cost}</span>
                      <span className="w-20 text-right text-white/40">${(item.cost * 12).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* The Equation */}
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">{ROI.STACK_SUBTOTAL}</span>
                  <div className="flex gap-8 text-sm font-mono font-bold text-emerald-400">
                    <span className="w-16 text-right">+${auditData.monthly.app.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="w-20 text-right">+${auditData.yearly.app.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">{ROI.TIME_LABEL}</span>
                  <div className="flex gap-8 text-sm font-mono font-bold text-emerald-400">
                    <span className="w-16 text-right">+${auditData.monthly.time.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="w-20 text-right">+${auditData.yearly.time.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white pt-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{ROI.COST_LABEL}</span>
                  <div className="flex gap-8 text-sm font-mono text-white/60">
                    <span className="w-16 text-right">-${auditData.monthly.studio}</span>
                    <span className="w-20 text-right">-${auditData.yearly.studio.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Massive Final Output */}
              <div className="pt-12 mt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.2em] mb-6 block">{ROI.OUTPUT_LABEL}</span>
                
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
                   {/* Monthly */}
                   <div>
                      <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-white/70 tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        ${auditData.monthly.net.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </span>
                      <span className="text-sm font-mono text-white/40 ml-2 uppercase tracking-widest">/mo</span>
                   </div>
                   
                   {/* Yearly */}
                   <div className="pb-1 md:pb-2">
                      <span className="text-3xl md:text-5xl font-black text-brand-primary tracking-tighter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        ${auditData.yearly.net.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </span>
                      <span className="text-xs font-mono text-brand-primary/60 ml-2 uppercase tracking-widest">/yr</span>
                   </div>
                </div>
                
                <p className="text-[10px] font-mono text-white/30 uppercase mt-8 leading-relaxed max-w-sm">{ROI.OUTPUT_SUBTEXT}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}