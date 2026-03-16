/* src/components/shift-studio/xlg/RoiCalculator.tsx */
'use client';
import React, { useState, useMemo } from 'react';
import { WEBSITE_COPY, SYSTEM_CONFIG, AppTool, HourTier } from '@/utils/glossary';
import { Calculator, DollarSign } from 'lucide-react';

export default function RoiCalculator() {
  const { ROI } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE;
  
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<number>(ROI.HOUR_TIERS[1].value);
  const [laborRate, setLaborRate] = useState<number>(SYSTEM_CONFIG.RATES.LABOR);
  
  const toggleApp = (appId: string) => {
    setSelectedApps(prev => prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]);
  };

  const auditData = useMemo(() => {
    const categoryKeys = Object.keys(ROI.CATEGORIES) as Array<keyof typeof ROI.CATEGORIES>;
    const appLineItems: { name: string; cost: number; isCustom: boolean }[] = [];
    let totalMonthlyApps = 0;

    categoryKeys.forEach(catKey => {
      const appsInCat = ROI.APPS.filter((a: AppTool) => a.category === catKey);
      const selectedInCat = appsInCat.filter((a: AppTool) => selectedApps.includes(a.id));

      if (selectedInCat.length > 0) {
        selectedInCat.forEach((app: AppTool) => {
          appLineItems.push({ name: app.name, cost: app.cost, isCustom: true });
          totalMonthlyApps += app.cost;
        });
      } else {
        const cheapest = appsInCat.reduce((min: AppTool, p: AppTool) => p.cost < min.cost ? p : min, appsInCat[0]);
        appLineItems.push({ name: `${cheapest.name} (Baseline)`, cost: cheapest.cost, isCustom: false });
        totalMonthlyApps += cheapest.cost;
      }
    });

    const monthlyTimeValue = selectedHours * 4.33 * laborRate;
    const yearlyTimeValue = selectedHours * 52 * laborRate;
    
    // Calculate Monthly Net
    const monthlyNet = totalMonthlyApps + monthlyTimeValue - SYSTEM_CONFIG.RATES.PUBLIC;
    // Calculate Yearly Net
    const yearlyNet = (totalMonthlyApps * 12) + yearlyTimeValue - (SYSTEM_CONFIG.RATES.PUBLIC * 12);

    return { 
      appLineItems, 
      monthly: { app: totalMonthlyApps, time: monthlyTimeValue, studio: SYSTEM_CONFIG.RATES.PUBLIC, net: monthlyNet }, 
      yearly: { app: totalMonthlyApps * 12, time: yearlyTimeValue, studio: SYSTEM_CONFIG.RATES.PUBLIC * 12, net: yearlyNet } 
    };
  }, [selectedApps, selectedHours, laborRate, ROI]);

  return (
    <div className="bg-bg-surface-100/90 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] w-full">
      
      <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/10">
        <div className="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-xl shadow-inner">
          <Calculator className="text-brand-primary" size={32} />
        </div>
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tight text-white">{ROI.TITLE}</h3>
          <p className="text-sm text-text-muted mt-2">{ROI.SUBTITLE}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* INPUTS (LEFT) */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-tight">{ROI.STEP_1_LABEL}</h4>
            <div className="space-y-4">
              {(Object.keys(ROI.CATEGORIES) as Array<keyof typeof ROI.CATEGORIES>).map((catKey) => (
                <div key={catKey.toString()} className="bg-bg-surface-200 border border-white/5 rounded-2xl p-5 shadow-sm">
                  <span className="text-xs font-medium text-brand-primary/70 mb-3 block">{ROI.CATEGORIES[catKey]}</span>
                  <div className="flex flex-wrap gap-2">
                    {ROI.APPS.filter((a: AppTool) => a.category === catKey).map((app: AppTool) => (
                      <button 
                        key={app.id} 
                        onClick={() => toggleApp(app.id)} 
                        className={`px-5 py-2 rounded-full border text-xs font-bold transition-all duration-200 shadow-xs ${
                          selectedApps.includes(app.id) 
                          ? 'bg-brand-primary border-brand-primary text-black scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                          : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white tracking-tight">{ROI.STEP_2_LABEL}</h4>
              <div className="grid grid-cols-2 gap-3">
                {ROI.HOUR_TIERS.map((tier: HourTier) => (
                  <button 
                    key={tier.label} 
                    onClick={() => setSelectedHours(tier.value)} 
                    className={`py-3 rounded-full border text-xs font-bold transition-all duration-200 shadow-xs ${
                      selectedHours === tier.value 
                      ? 'bg-brand-primary border-brand-primary text-black scale-105 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                      : 'bg-bg-surface-200 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white tracking-tight">{ROI.STEP_3_LABEL}</h4>
              <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary opacity-50" />
                <input 
                  type="number" 
                  value={laborRate} 
                  onChange={(e) => setLaborRate(Number(e.target.value))} 
                  className="w-full bg-bg-surface-200 border border-white/5 rounded-full py-3 pl-10 text-white font-bold text-sm outline-none focus:border-brand-primary/50 transition-colors shadow-inner" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* RECEIPT BREAKDOWN (RIGHT) */}
        <div className="lg:col-span-7 bg-bg-surface-200 border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-primary via-transparent to-transparent opacity-30"></div>
          
          <h4 className="text-sm font-mono text-brand-primary uppercase tracking-[0.3em] text-center mb-10">{ROI.BREAKDOWN_TITLE}</h4>
          
          <div className="grid grid-cols-12 gap-6 mb-6 pb-4 border-b border-white/10 opacity-50">
            <div className="col-span-6"></div>
            <div className="col-span-3 text-center text-[10px] font-mono uppercase tracking-widest">{ROI.MONTHLY_HEAD}</div>
            <div className="col-span-3 text-center text-[10px] font-mono uppercase tracking-widest">{ROI.YEARLY_HEAD}</div>
          </div>

          <div className="space-y-8 grow">
            
            {/* SECTION 1: THE DEBT (No Plus Signs, Just Facts) */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-4 border-b border-white/5 pb-2">{ROI.APPS_LABEL}</span>
              {auditData.appLineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-6 items-center">
                  <span className={`col-span-6 text-sm ${!item.isCustom ? 'text-white/40 italic' : 'text-white font-medium'}`}>{item.name}</span>
                  <span className="col-span-3 text-center text-sm font-mono text-white/60">${item.cost}</span>
                  <span className="col-span-3 text-center text-sm font-mono text-white/60">${(item.cost * 12).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* SECTION 2: THE EQUATION (+ and -) */}
            <div className="space-y-5 pt-8 mt-4 border-t border-white/10">
              
              {/* Apps Saved */}
              <div className="grid grid-cols-12 gap-6 items-center text-white">
                <span className="col-span-6 text-[10px] font-mono uppercase tracking-widest text-white/80">{ROI.STACK_SUBTOTAL}</span>
                <span className="col-span-3 text-center text-sm font-mono font-bold text-white">
                  +${auditData.monthly.app.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
                <span className="col-span-3 text-center text-sm font-mono font-bold text-white">
                  +${auditData.yearly.app.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
              </div>

              {/* Time Recovered */}
              <div className="grid grid-cols-12 gap-6 items-center text-white">
                <span className="col-span-6 text-[10px] font-mono uppercase tracking-widest text-white/80">{ROI.TIME_LABEL}</span>
                <span className="col-span-3 text-center text-sm font-mono font-bold text-white">
                  +${auditData.monthly.time.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
                <span className="col-span-3 text-center text-sm font-mono font-bold text-white">
                  +${auditData.yearly.time.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
              </div>

              {/* Shift Studio Investment */}
              <div className="grid grid-cols-12 gap-6 items-center text-orange-400 pt-2 border-t border-white/5">
                <span className="col-span-6 text-[10px] font-mono uppercase tracking-widest text-white/80">{ROI.COST_LABEL}</span>
                <span className="col-span-3 text-center text-sm font-mono">
                  -${auditData.monthly.studio}
                </span>
                <span className="col-span-3 text-center text-sm font-mono drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">
                  -${auditData.yearly.studio.toLocaleString()}
                </span>
              </div>

            </div>
          </div>

          {/* DUAL DISPLAY FINAL TOTALS */}
          <div className="mt-12 pt-8 border-t border-brand-primary/20 bg-brand-primary/5 -mx-8 -mb-8 p-10 shadow-[inset_0_0_30px_rgba(6,182,212,0.05)]">
            <span className="text-xs font-mono text-white/60 uppercase tracking-[0.2em] mb-8 block text-center">{ROI.OUTPUT_LABEL}</span>
            
            <div className="grid grid-cols-2 gap-4 divide-x divide-white/10">
               <div className="text-center">
                  <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 block">Monthly</span>
                  <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(6,182,212,0.4)] tracking-tighter">${auditData.monthly.net.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
               </div>
               <div className="text-center">
                  <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 block">Yearly</span>
                  <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(6,182,212,0.4)] tracking-tighter">${auditData.yearly.net.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
               </div>
            </div>
            
            <p className="text-[10px] font-mono text-brand-primary/70 uppercase mt-8 max-w-sm mx-auto leading-relaxed text-center">{ROI.OUTPUT_SUBTEXT}</p>
          </div>
        </div>

      </div>
    </div>
  );
}