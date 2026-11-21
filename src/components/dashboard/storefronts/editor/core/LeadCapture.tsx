/* src/components/dashboard/storefronts/editor/core/LeadCapture.tsx */
import React, { useState } from 'react';
import { MessageSquareText, HelpCircle } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

const TooltipLabel = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-2">
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    <HelpCircle size={11} className="text-zinc-600 hover:text-white cursor-help transition-colors" />
    <div className="absolute top-full left-0 mt-1.5 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
      <p className="text-[10px] text-fuchsia-400 normal-case tracking-normal font-medium leading-relaxed">
        {tooltip}
      </p>
    </div>
  </div>
);

export default function LeadCapture({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const selectedInquiries = formData.lead_inquiry_types || ['General Inquiry', 'Request a Quote'];

  const toggleInquiryType = (type: string) => {
    let updated = [...selectedInquiries];
    if (updated.includes(type)) updated = updated.filter((t: string) => t !== type);
    else updated.push(type);
    setFormData((prev: any) => ({ ...prev, lead_inquiry_types: updated }));
  };

  const progress = selectedInquiries.length > 0 ? 100 : 0;

  return (
    <EditorAccordion
      title={copy.LEAD_ACCORDION}
      icon={MessageSquareText}
      accentColor="fuchsia"
      progress={progress}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div>
        <TooltipLabel label={copy.LEAD_LABEL} tooltip={copy.LEAD_TOOLTIP} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {copy.STANDARD_INQUIRY_TYPES.map((type: string) => {
            const isChecked = selectedInquiries.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleInquiryType(type)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md cursor-pointer transition-all border text-left ${
                  isChecked
                    ? 'bg-fuchsia-500/10 border-fuchsia-500/35'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-sm flex items-center justify-center border transition-all shrink-0 ${
                    isChecked ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-black border-zinc-600'
                  }`}
                >
                  {isChecked && <div className="w-1.5 h-1.5 bg-black rounded-xs" />}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider truncate ${
                    isChecked ? 'text-fuchsia-300' : 'text-zinc-400'
                  }`}
                >
                  {type}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </EditorAccordion>
  );
}