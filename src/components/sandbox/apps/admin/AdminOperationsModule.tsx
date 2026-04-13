'use client';

import React, { useState } from 'react';
import { MapPin, ShieldAlert, Plus, Trash2, Truck, Info, MessageSquare } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

export const DEFAULT_ZONES = [
  { name: "Williamsburg Areas", minimum: 50 },
  { name: "Gloucester / Hayes / Yorktown", minimum: 75 },
  { name: "Newport News / Hampton", minimum: 75 },
  { name: "Quinton / Charles City Areas", minimum: 75 },
  { name: "West Point / Saluda Area", minimum: 75 },
  { name: "Richmond & Surrounding Areas", minimum: 100 },
  { name: "Southside Areas", minimum: 100 },
  { name: "Ashland & Surrounding Areas", minimum: 150 },
  { name: "Suffolk", minimum: 150 }
];

export const DEFAULT_TEAM = {
  dispatchers: ["@MisterDoobie", "@RedsRosin", "@JonSpliff", "@MrsDoobieDuo"],
  drivers: ["@balance0n1", "@Laylo757", "@King_Maso", "@MistrSandman", "@Roman_Empire145", "@true80skid", "@Thouzand420", "@KyleTheNewGuy"]
};

export const DEFAULT_WARRANTY = `ALL of our electronics/electronic devices come with a "DUD WARRANTY", meaning if it's not working, leaking, or clearly a "dud" reach out with 48 HOURS with said device and we WILL honor you with a replacement.\n\nWe Stand Behind EVERY Item!\nFor questions, concerns, or issues please contact @RedsRosin or @JonSpliff!`;

export const DEFAULT_POLICIES = [
  "Access codes are strictly for verified members. Sharing codes with unverified individuals will result in permanent removal.",
  "All sales are final once delivery is completed and verified.",
  "Drivers do not carry excess inventory. Exact change or digital payment is required."
];

export default function AdminOperationsModule({ clientConfig, setNotification }: any) {
  const cid = clientConfig?.id || 'division';

  const [deliveryZones, setDeliveryZones] = useStickyState<any[]>(DEFAULT_ZONES, `ops_zones_${cid}`);
  const [team, setTeam] = useStickyState<any>(DEFAULT_TEAM, `ops_team_${cid}`);
  const [warranty, setWarranty] = useStickyState<string>(DEFAULT_WARRANTY, `ops_warranty_${cid}`);
  const [policies, setPolicies] = useStickyState<string[]>(DEFAULT_POLICIES, `ops_policies_${cid}`);

  const [activeTab, setActiveTab] = useState<'zones' | 'team' | 'policies'>('zones');

  // Temporary input state
  const [newDispatcher, setNewDispatcher] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newPolicy, setNewPolicy] = useState('');

  const updateZoneMin = (index: number, val: number) => {
    const newZones = [...deliveryZones];
    newZones[index].minimum = val;
    setDeliveryZones(newZones);
  };

  const addTeamMember = (role: 'dispatchers' | 'drivers', value: string, setter: any) => {
    if (!value.trim()) return;
    const handle = value.startsWith('@') ? value.trim() : `@${value.trim()}`;
    setTeam((prev: any) => ({ ...prev, [role]: [...prev[role], handle] }));
    setter('');
    setNotification(`${role === 'dispatchers' ? 'Dispatcher' : 'Driver'} added.`);
  };

  const removeTeamMember = (role: 'dispatchers' | 'drivers', index: number) => {
    setTeam((prev: any) => {
      const newArr = [...prev[role]];
      newArr.splice(index, 1);
      return { ...prev, [role]: newArr };
    });
  };

  const addPolicy = () => {
    if (!newPolicy.trim()) return;
    setPolicies((prev: string[]) => [...prev, newPolicy.trim()]);
    setNewPolicy('');
    setNotification('Policy added.');
  };

  const removePolicy = (index: number) => {
    setPolicies((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-4 rounded-3xl border border-indigo-500/30 text-indigo-400 shadow-lg">
            <Truck size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Operations & Logistics</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              Fleet & Policy Control <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 w-full md:w-fit shadow-inner mb-6">
        <button onClick={() => setActiveTab('zones')} className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'zones' ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>Delivery Zones</button>
        <button onClick={() => setActiveTab('team')} className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>Team Directory</button>
        <button onClick={() => setActiveTab('policies')} className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'policies' ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>Policies & Warranty</button>
      </div>

      {/* VIEW: ZONES */}
      {activeTab === 'zones' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4">
           <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
             <MapPin size={16} /> Regional Minimums
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {deliveryZones.map((zone: any, idx: number) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 leading-tight">{zone.name}</span>
                  <div className="relative mt-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 font-black">$</span>
                    <input 
                      type="number" 
                      value={zone.minimum} 
                      onChange={(e) => updateZoneMin(idx, Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2 pl-7 pr-3 text-sm font-mono font-bold text-indigo-400 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
             ))}
           </div>
        </div>
      )}

      {/* VIEW: TEAM */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
             <h3 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
               <MessageSquare size={16} /> Dispatchers
             </h3>
             <div className="space-y-2 mb-6">
               {team.dispatchers.map((handle: string, idx: number) => (
                 <div key={idx} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl group">
                   <span className="font-bold text-zinc-300 text-sm">{handle}</span>
                   <button onClick={() => removeTeamMember('dispatchers', idx)} className="text-zinc-600 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                 </div>
               ))}
             </div>
             <div className="flex gap-2">
               <input type="text" value={newDispatcher} onChange={e => setNewDispatcher(e.target.value)} placeholder="@Handle" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm font-bold text-cyan-400 outline-none" />
               <button onClick={() => addTeamMember('dispatchers', newDispatcher, setNewDispatcher)} className="bg-cyan-500 text-zinc-950 px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-cyan-400"><Plus size={16}/></button>
             </div>
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
             <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
               <Truck size={16} /> Fleet Drivers
             </h3>
             <div className="space-y-2 mb-6">
               {team.drivers.map((handle: string, idx: number) => (
                 <div key={idx} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl group">
                   <span className="font-bold text-zinc-300 text-sm">{handle}</span>
                   <button onClick={() => removeTeamMember('drivers', idx)} className="text-zinc-600 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                 </div>
               ))}
             </div>
             <div className="flex gap-2">
               <input type="text" value={newDriver} onChange={e => setNewDriver(e.target.value)} placeholder="@Handle" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm font-bold text-emerald-400 outline-none" />
               <button onClick={() => addTeamMember('drivers', newDriver, setNewDriver)} className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400"><Plus size={16}/></button>
             </div>
           </div>
        </div>
      )}

      {/* VIEW: POLICIES */}
      {activeTab === 'policies' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
             <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <ShieldAlert size={16} /> Warranty & Guarantee
             </h3>
             <textarea 
               value={warranty} 
               onChange={(e) => setWarranty(e.target.value)}
               rows={5}
               className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-zinc-300 outline-none focus:border-amber-500/50 resize-none"
             />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
             <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800/50 pb-4">
               <Info size={16} /> Market Rules
             </h3>
             <div className="space-y-3 mb-6">
               {policies.map((pol: string, idx: number) => (
                 <div key={idx} className="flex items-start justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-xl group gap-4">
                   <span className="font-bold text-zinc-300 text-sm leading-relaxed flex-1">{pol}</span>
                   <button onClick={() => removePolicy(idx)} className="text-zinc-600 hover:text-rose-500 transition-colors mt-1"><Trash2 size={16}/></button>
                 </div>
               ))}
             </div>
             <div className="flex gap-2">
               <input type="text" value={newPolicy} onChange={e => setNewPolicy(e.target.value)} placeholder="New rule..." className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-zinc-100 outline-none" />
               <button onClick={addPolicy} disabled={!newPolicy.trim()} className="bg-rose-500 text-zinc-950 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-rose-400 disabled:opacity-50"><Plus size={16}/></button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}