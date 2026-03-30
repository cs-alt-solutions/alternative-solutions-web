import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';

export default function VariantsManager({ editingItem, setEditingItem, isFlower }: any) {
  
  const addVariantRow = () => { 
    setEditingItem({ 
      ...editingItem, 
      options: [...(editingItem.options || []), { id: `var-${Date.now()}`, strains: [{ name: '', type: 'N/A' }], stock: '' }] 
    }); 
  };

  const removeVariantRow = (id: string) => { 
    setEditingItem({ ...editingItem, options: editingItem.options.filter((opt: any) => opt.id !== id) }); 
  };

  const updateVariantStock = (id: string, val: any) => {
    setEditingItem({ ...editingItem, options: editingItem.options.map((opt: any) => opt.id === id ? { ...opt, stock: val } : opt) });
  };

  const updateStrainCount = (optId: string, count: number) => {
    setEditingItem({
      ...editingItem,
      options: editingItem.options.map((opt: any) => {
        if (opt.id !== optId) return opt;
        let newStrains = [...(opt.strains || [{ name: '', type: 'N/A' }])];
        if (count > newStrains.length) {
          while(newStrains.length < count) newStrains.push({ name: '', type: 'N/A' });
        } else {
          newStrains = newStrains.slice(0, count);
        }
        return { ...opt, strains: newStrains };
      })
    });
  };

  const updateStrainData = (optId: string, index: number, field: 'name' | 'type', value: string) => {
    setEditingItem({
      ...editingItem,
      options: editingItem.options.map((opt: any) => {
        if (opt.id !== optId) return opt;
        const newStrains = [...opt.strains];
        newStrains[index] = { ...newStrains[index], [field]: value };
        return { ...opt, strains: newStrains };
      })
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
            {isFlower ? 'Total Raw Grams by Strain' : 'Unit Inventory by Variant'}
        </label>
        <button type="button" onClick={addVariantRow} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10"><Plus size={14} /> Add Variant</button>
      </div>
      
      <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
        {editingItem.options.map((opt: any, vIndex: number) => {
          const strains = opt.strains || [{ name: '', type: 'N/A' }];
          const strainCount = strains.length;

          return (
            <div key={opt.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 shadow-inner">
              
              {/* VARIANT HEADER */}
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-[10px] font-black uppercase text-zinc-500">Variant {vIndex + 1}</span>
                <div className="flex items-center gap-3">
                  {!isFlower && (
                    <select 
                      value={strainCount}
                      onChange={(e) => updateStrainCount(opt.id, Number(e.target.value))}
                      className="bg-zinc-900 border border-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-1 rounded outline-none"
                    >
                      <option value={1}>Single Strain</option>
                      <option value={2}>Dual Chamber</option>
                      <option value={3}>Triple Tank</option>
                    </select>
                  )}
                  <button type="button" onClick={() => removeVariantRow(opt.id)} className="text-zinc-600 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              {/* STRAIN ROWS */}
              <div className="space-y-2">
                {strains.map((s: any, sIdx: number) => (
                  <div key={sIdx} className="flex gap-2 relative">
                    {strainCount > 1 && (
                       <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 border-l-2 border-t-2 border-b-2 border-zinc-800 rounded-l-md" />
                    )}
                    <input 
                      type="text" 
                      value={s.name} 
                      onChange={(e) => updateStrainData(opt.id, sIdx, 'name', e.target.value)} 
                      placeholder={`Strain Name ${strainCount > 1 ? `(${sIdx + 1})` : ''}...`} 
                      className={`flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 text-sm text-white font-medium outline-none focus:border-emerald-500/50 ${strainCount > 1 ? 'ml-2' : ''}`} 
                    />
                    <select 
                      value={s.type} 
                      onChange={(e) => updateStrainData(opt.id, sIdx, 'type', e.target.value)}
                      className="w-32 shrink-0 bg-zinc-900 border border-zinc-700 rounded-xl p-3.5 text-[10px] uppercase tracking-widest text-emerald-400 font-bold outline-none appearance-none cursor-pointer focus:border-emerald-500/50 transition-colors"
                    >
                       <option value="N/A">No Type</option>
                       <option value="Indica">Indica</option>
                       <option value="Sativa">Sativa</option>
                       <option value="Hybrid">Hybrid</option>
                       <option value="Indica-Dom">Indica-Dom</option>
                       <option value="Sativa-Dom">Sativa-Dom</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* STOCK ROW */}
              <div className="flex justify-end pt-2 border-t border-zinc-800/50 mt-1">
                 <div className="relative w-40">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                     {isFlower ? 'Grams' : 'Qty'}
                   </span>
                   <input 
                     type="number" step="0.1" 
                     value={opt.stock} 
                     onChange={(e) => updateVariantStock(opt.id, e.target.value === '' ? '' : parseFloat(e.target.value))} 
                     className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 pl-16 text-sm text-white font-bold outline-none text-right pr-4 focus:border-emerald-500/50" 
                   />
                 </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}