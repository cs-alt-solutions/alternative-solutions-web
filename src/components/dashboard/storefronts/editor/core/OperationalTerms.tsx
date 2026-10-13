import React, { useState } from 'react';
import { Map, Plus, Trash2 } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';

interface Term {
  title: string;
  description: string;
}

export default function OperationalTerms({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const terms: Term[] = Array.isArray(formData.operational_terms) ? formData.operational_terms : [];
  const progress = terms.length > 0 ? 100 : 0;

  const handleAddTerm = () => {
    setFormData((prev: any) => ({
      ...prev,
      operational_terms: [...(prev.operational_terms || []), { title: '', description: '' }]
    }));
  };

  const handleUpdateTerm = (index: number, field: keyof Term, value: string) => {
    const updated = [...terms];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleRemoveTerm = (index: number) => {
    const updated = terms.filter((_, i) => i !== index);
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  return (
    <EditorAccordion 
      title="Logistics & Terms" 
      icon={Map} 
      accentColor="indigo" 
      progress={progress} 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-zinc-400">Manage travel fees, deliverables, and booking rules.</p>
          <button 
            onClick={handleAddTerm}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-colors"
          >
            <Plus size={12} /> Add Rule
          </button>
        </div>

        {terms.length === 0 ? (
          <div className="p-6 border border-dashed border-zinc-700/50 rounded-xl text-center">
            <span className="text-xs text-zinc-500">No logistical terms added yet.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {terms.map((term, index) => (
              <div key={index} className="p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-xl relative group">
                <button 
                  onClick={() => handleRemoveTerm(index)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="space-y-3">
                  <div className="space-y-1.5 pr-8">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Rule Title</label>
                    <input 
                      value={term.title} 
                      onChange={(e) => handleUpdateTerm(index, 'title', e.target.value)} 
                      className="w-full bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
                      placeholder="e.g., Regional Travel (50+ miles)"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Details & Fees</label>
                    <textarea 
                      value={term.description} 
                      onChange={(e) => handleUpdateTerm(index, 'description', e.target.value)} 
                      className="w-full bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 text-white h-20 resize-none focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700 leading-relaxed"
                      placeholder="Explain the logistics or additional costs..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EditorAccordion>
  );
}