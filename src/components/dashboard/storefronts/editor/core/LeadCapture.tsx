/* src/components/dashboard/storefronts/editor/core/LeadCapture.tsx */
import React, { useState } from 'react';
import { MessageSquareText, HelpCircle } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';

const STANDARD_INQUIRY_TYPES = ["General Inquiry", "Request a Quote", "Job Application / Hiring", "Other"];

const TooltipLabel = ({ label, tooltip }: { label: string, tooltip: string }) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1.5">
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">{label}</label>
    <HelpCircle size={12} className="text-zinc-600 hover:text-white cursor-help transition-colors ml-1" />
    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
      <p className="text-[10px] text-fuchsia-400 normal-case tracking-normal font-medium leading-relaxed">
        {tooltip}
      </p>
    </div>
  </div>
);

export default function LeadCapture({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedInquiries = formData.lead_inquiry_types || ["General Inquiry", "Request a Quote"];

  const toggleInquiryType = (type: string) => {
    let updated = [...selectedInquiries];
    if (updated.includes(type)) updated = updated.filter((t: string) => t !== type);
    else updated.push(type);
    setFormData((prev: any) => ({ ...prev, lead_inquiry_types: updated }));
  };

  const progress = selectedInquiries.length > 0 ? 100 : 0;

  return (
    <EditorAccordion 
      title="Lead Capture Form" 
      icon={MessageSquareText} 
      accentColor="fuchsia" 
      progress={progress} 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div>
        <TooltipLabel label="Form Routing Options" tooltip="Select the options you want to appear in this storefront's lead capture modal dropdown." />
        <div className="flex flex-col gap-2 mt-2">
          {STANDARD_INQUIRY_TYPES.map(type => {
            const isChecked = selectedInquiries.includes(type);
            return (
              <label key={type} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${isChecked ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${isChecked ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-black border-zinc-600'}`}>
                  {isChecked && <div className="w-1.5 h-1.5 bg-black rounded-sm" />}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isChecked ? 'text-fuchsia-400' : 'text-zinc-400'}`}>{type}</span>
              </label>
            );
          })}
        </div>
      </div>
    </EditorAccordion>
  );
}