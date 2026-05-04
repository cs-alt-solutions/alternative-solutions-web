import React from 'react';
import { ListPlus, Plus, Trash2 } from 'lucide-react';

export default function EditorDynamicDetails({ updatedItem, setUpdatedItem }: any) {
  const dynamicDetails = updatedItem.smartDetails || updatedItem.edibleDetails || (updatedItem.descBase ? [{ id: Date.now(), type: 'description', text: updatedItem.descBase }] : []);

  const handleDetailChange = (index: number, field: string, val: string) => {
     const newDetails = [...dynamicDetails];
     newDetails[index] = { ...newDetails[index], [field]: val };
     const fallbackDesc = newDetails.filter((d: any) => d.type === 'description').map((d: any) => d.text).join('\n\n');
     setUpdatedItem({ ...updatedItem, smartDetails: newDetails, edibleDetails: newDetails, descBase: fallbackDesc });
  };

  const addDetail = (e: any) => {
     e.preventDefault();
     const newDetails = [...dynamicDetails, { id: Date.now(), type: 'description', text: '' }];
     setUpdatedItem({ ...updatedItem, smartDetails: newDetails, edibleDetails: newDetails });
  };

  const removeDetail = (index: number, e: any) => {
     e.preventDefault();
     const newDetails = [...dynamicDetails];
     newDetails.splice(index, 1);
     const fallbackDesc = newDetails.filter((d: any) => d.type === 'description').map((d: any) => d.text).join('\n\n');
     setUpdatedItem({ ...updatedItem, smartDetails: newDetails, edibleDetails: newDetails, descBase: fallbackDesc });
  };

  return (
    <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 md:p-6">
       <div className="flex items-center justify-between mb-4 border-b border-zinc-800/80 pb-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
             <ListPlus size={14} className="text-emerald-400" /> Descriptions & Disclaimers
          </label>
          <button onClick={addDetail} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 active:scale-95">
             <Plus size={12} /> Add Block
          </button>
       </div>

       <div className="space-y-3">
          {dynamicDetails.length === 0 && (
             <div className="text-center py-6 text-zinc-600 text-xs font-bold uppercase tracking-widest italic border border-dashed border-zinc-800 rounded-xl">
               No details added
             </div>
          )}
          {dynamicDetails.map((detail: any, index: number) => (
             <div key={detail.id || index} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-3 group focus-within:border-emerald-500/30 transition-colors">
               <div className="flex flex-col gap-2 shrink-0">
                   <select 
                     value={detail.type} 
                     onChange={(e) => handleDetailChange(index, 'type', e.target.value)}
                     className={`bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[9px] font-black uppercase tracking-widest outline-none w-32 cursor-pointer ${detail.type === 'disclaimer' ? 'text-rose-400' : 'text-zinc-300'}`}
                   >
                     <option value="description">Description</option>
                     <option value="disclaimer">Disclaimer</option>
                   </select>
               </div>
               <textarea 
                 value={detail.text}
                 onChange={(e) => handleDetailChange(index, 'text', e.target.value)}
                 rows={2}
                 placeholder={`Enter ${detail.type} text...`}
                 className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none pt-1.5 min-w-0"
               />
               <button onClick={(e) => removeDetail(index, e)} className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-0.5">
                  <Trash2 size={16} />
               </button>
             </div>
          ))}
       </div>
    </div>
  );
}