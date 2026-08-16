import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ServicesTab({ formData, updateForm }: { formData: any, updateForm: any }) {
  
  const addService = () => {
    updateForm({ capabilities: [...formData.capabilities, { title: '', description: '' }] });
  };

  const updateService = (index: number, field: 'title' | 'description', value: string) => {
    const newCaps = [...formData.capabilities];
    newCaps[index][field] = value;
    updateForm({ capabilities: newCaps });
  };

  const removeService = (index: number) => {
    const newCaps = formData.capabilities.filter((_: any, i: number) => i !== index);
    updateForm({ capabilities: newCaps });
  };

  return (
    <div className="space-y-4">
      {formData.capabilities.map((service: any, index: number) => (
        <div key={index} className="bg-black/40 border border-amber-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative group">
          <button 
            onClick={() => removeService(index)}
            className="absolute top-4 right-4 text-zinc-600 hover:text-rose-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
          
          <div className="space-y-4 pr-6">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Service Title</label>
              <input 
                value={service.title}
                onChange={(e) => updateService(index, 'title', e.target.value)}
                placeholder="e.g., Shadow Work Consultation"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Description</label>
              <textarea 
                value={service.description}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                rows={2}
                placeholder="Briefly describe what this entails..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={addService}
        className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <Plus size={16} /> Add Service Offering
      </button>
    </div>
  );
}