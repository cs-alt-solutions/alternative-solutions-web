import React from 'react';
import { Plus, Trash2, List, X } from 'lucide-react';

export default function ServicesTab({ formData, updateForm }: { formData: any, updateForm: any }) {
  
  const addService = () => {
    updateForm({ capabilities: [...formData.capabilities, { title: '', description: '', bullets: [] }] });
  };

  const updateService = (index: number, field: 'title' | 'description', value: string) => {
    const newCaps = [...formData.capabilities];
    newCaps[index][field] = value;
    updateForm({ capabilities: newCaps });
  };

  const addBullet = (serviceIndex: number) => {
    const newCaps = [...formData.capabilities];
    if (!newCaps[serviceIndex].bullets) newCaps[serviceIndex].bullets = [];
    newCaps[serviceIndex].bullets.push('');
    updateForm({ capabilities: newCaps });
  };

  const updateBullet = (serviceIndex: number, bulletIndex: number, value: string) => {
    const newCaps = [...formData.capabilities];
    newCaps[serviceIndex].bullets[bulletIndex] = value;
    updateForm({ capabilities: newCaps });
  };

  const removeBullet = (serviceIndex: number, bulletIndex: number) => {
    const newCaps = [...formData.capabilities];
    newCaps[serviceIndex].bullets.splice(bulletIndex, 1);
    updateForm({ capabilities: newCaps });
  };

  const removeService = (index: number) => {
    const newCaps = formData.capabilities.filter((_: any, i: number) => i !== index);
    updateForm({ capabilities: newCaps });
  };

  return (
    <div className="space-y-6">
      {formData.capabilities.map((service: any, index: number) => {
        const bullets = service.bullets || [];

        return (
          <div key={index} className="bg-black/40 border border-amber-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative group">
            <button 
              onClick={() => removeService(index)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-rose-400 transition-colors"
              title="Delete Service"
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

              {/* Dynamic Bullets Section */}
              <div className="pt-2 border-t border-zinc-800/50">
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                    <List size={12} /> Detail Bullets
                  </label>
                </div>

                <div className="space-y-2 mb-3">
                  {bullets.map((bullet: string, bIndex: number) => (
                    <div key={bIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 shrink-0 mt-0.5" />
                      <input 
                        value={bullet}
                        onChange={(e) => updateBullet(index, bIndex, e.target.value)}
                        placeholder="Detail or feature..."
                        className="flex-1 bg-transparent border-b border-zinc-800 focus:border-amber-500/50 py-1.5 text-xs text-zinc-300 focus:outline-none transition-colors"
                      />
                      <button 
                        onClick={() => removeBullet(index, bIndex)}
                        className="text-zinc-600 hover:text-rose-400 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => addBullet(index)}
                  className="text-[10px] font-bold text-zinc-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={12} /> Add Bullet Point
                </button>
              </div>

            </div>
          </div>
        );
      })}

      <button 
        onClick={addService}
        className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 hover:text-amber-400 transition-colors text-xs font-bold uppercase tracking-widest"
      >
        <Plus size={16} /> Add Service Offering
      </button>
    </div>
  );
}