'use client';

import React from 'react';
import { Scale, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface Fee {
  name: string;
  price: string;
}

interface Term {
  title: string;
  description: string;
  fees?: Fee[];
}

export default function LogisticsTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  const terms: Term[] = Array.isArray(formData.operational_terms) ? formData.operational_terms : [];

  const handleAddTerm = () => {
    setFormData((prev: any) => ({
      ...prev,
      operational_terms: [...(prev.operational_terms || []), { title: '', description: '', fees: [] }]
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

  // Sub-Fee Management
  const handleAddFee = (termIndex: number) => {
    const updated = [...terms];
    const currentFees = updated[termIndex].fees || [];
    updated[termIndex].fees = [...currentFees, { name: '', price: '' }];
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleUpdateFee = (termIndex: number, feeIndex: number, field: keyof Fee, value: string) => {
    const updated = [...terms];
    const currentFees = [...(updated[termIndex].fees || [])];
    currentFees[feeIndex] = { ...currentFees[feeIndex], [field]: value };
    updated[termIndex].fees = currentFees;
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleRemoveFee = (termIndex: number, feeIndex: number) => {
    const updated = [...terms];
    const currentFees = (updated[termIndex].fees || []).filter((_, i) => i !== feeIndex);
    updated[termIndex].fees = currentFees;
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  // Reorder Sub-Fees
  const handleMoveFee = (termIndex: number, feeIndex: number, direction: 'up' | 'down') => {
    const updated = [...terms];
    const currentFees = [...(updated[termIndex].fees || [])];

    if (direction === 'up' && feeIndex > 0) {
      const temp = currentFees[feeIndex];
      currentFees[feeIndex] = currentFees[feeIndex - 1];
      currentFees[feeIndex - 1] = temp;
    } else if (direction === 'down' && feeIndex < currentFees.length - 1) {
      const temp = currentFees[feeIndex];
      currentFees[feeIndex] = currentFees[feeIndex + 1];
      currentFees[feeIndex + 1] = temp;
    }

    updated[termIndex].fees = currentFees;
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Scale className="w-4 h-4" />
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Logistics & Terms</h2>
        </div>
        <button 
          onClick={handleAddTerm}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3 h-3" /> Add Rule
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Configure universal terms like travel radii, licensing agreements, and overnight limits. You can attach multiple distinct price tiers directly inside a single rule.
        </p>

        {terms.length === 0 ? (
          <div className="p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-center">
            <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No logistical rules defined.</span>
          </div>
        ) : (
          <div className="space-y-6">
            {terms.map((term, index) => (
              <div key={index} className="p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl relative group">
                <button 
                  onClick={() => handleRemoveTerm(index)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                  title="Delete Entire Rule"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="space-y-4">
                  <div className="space-y-1.5 pr-8">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Rule Title</label>
                    <input 
                      value={term.title} 
                      onChange={(e) => handleUpdateTerm(index, 'title', e.target.value)} 
                      className="w-full bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
                      placeholder="e.g., Regional Travel & Assignments"
                    />
                  </div>

                  {/* MULTI-TIERED FEES */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Attached Rates / Tiers</label>
                      <button 
                        onClick={() => handleAddFee(index)}
                        className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={10} /> Add Fee Line
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {(!term.fees || term.fees.length === 0) ? (
                        <div className="p-3 border border-dashed border-zinc-800 rounded-lg text-center bg-zinc-950/50">
                          <span className="text-[10px] text-zinc-600 font-mono">No specific fees attached.</span>
                        </div>
                      ) : (
                        term.fees.map((fee, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 group/fee">
                            <input 
                              value={fee.name} 
                              onChange={(e) => handleUpdateFee(index, fIdx, 'name', e.target.value)}
                              placeholder="e.g., 51–150 miles" 
                              className="flex-1 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-white text-xs focus:border-indigo-500 outline-none"
                            />
                            <input 
                              value={fee.price} 
                              onChange={(e) => handleUpdateFee(index, fIdx, 'price', e.target.value)}
                              placeholder="$300" 
                              className="w-28 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-indigo-400 font-mono font-bold text-xs focus:border-indigo-500 outline-none"
                            />
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover/fee:opacity-100 transition-opacity">
                              <div className="flex flex-col">
                                <button 
                                  onClick={() => handleMoveFee(index, fIdx, 'up')}
                                  disabled={fIdx === 0}
                                  className="text-zinc-600 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-zinc-600 cursor-pointer"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button 
                                  onClick={() => handleMoveFee(index, fIdx, 'down')}
                                  disabled={fIdx === term.fees!.length - 1}
                                  className="text-zinc-600 hover:text-indigo-400 disabled:opacity-30 disabled:hover:text-zinc-600 cursor-pointer"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                              <button 
                                onClick={() => handleRemoveFee(index, fIdx)}
                                className="p-2 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove Fee"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-800/50">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Caveats & Description</label>
                    <textarea 
                      value={term.description} 
                      onChange={(e) => handleUpdateTerm(index, 'description', e.target.value)} 
                      className="w-full bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-white h-20 resize-none focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700 leading-relaxed custom-scrollbar"
                      placeholder="e.g., Tolls, parking, and overnight lodging are billed additionally..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}