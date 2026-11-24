/* src/components/dashboard/storefronts/editor/capabilities/category/DepartmentFaqsEditor.tsx */
'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, X, ChevronDown } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

export interface DepartmentFaq {
  question: string;
  answer: string;
}

interface DepartmentFaqsEditorProps {
  faqs: DepartmentFaq[];
  onChange: (updated: DepartmentFaq[]) => void;
}

export default function DepartmentFaqsEditor({ faqs, onChange }: DepartmentFaqsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB.FAQ_EDITOR;

  const handleAdd = () => {
    setIsOpen(true);
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdate = (idx: number, field: keyof DepartmentFaq, val: string) => {
    onChange(faqs.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));
  };

  const handleRemove = (idx: number) => {
    onChange(faqs.filter((_, i) => i !== idx));
  };

  return (
    <div className="pt-2.5 border-t border-zinc-800/60 space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <span className="text-[9px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
          <HelpCircle size={11} className="text-amber-400" />
          {copy.LABEL} ({faqs.length})
        </span>
        <ChevronDown
          size={12}
          className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <p className="text-[10px] text-zinc-500 leading-relaxed">{copy.HELPER}</p>

          {faqs.length > 0 && (
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      value={faq.question || ''}
                      onChange={(e) => handleUpdate(idx, 'question', e.target.value)}
                      placeholder={copy.QUESTION_PLACEHOLDER}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-[11px] font-semibold text-white focus:border-amber-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="text-zinc-600 hover:text-rose-400 cursor-pointer shrink-0"
                      title={copy.REMOVE_TITLE}
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer || ''}
                    onChange={(e) => handleUpdate(idx, 'answer', e.target.value)}
                    placeholder={copy.ANSWER_PLACEHOLDER}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-[11px] text-zinc-300 focus:border-amber-400 outline-none resize-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="text-[9px] font-bold text-zinc-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
          >
            <Plus size={10} /> {copy.ADD_BTN}
          </button>
        </div>
      )}
    </div>
  );
}