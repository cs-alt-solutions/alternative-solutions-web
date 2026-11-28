/* src/components/dashboard/storefronts/editor/core/LeadCapture.tsx */
import React, { useState } from 'react';
import { MessageSquareText, HelpCircle } from 'lucide-react';
import EditorAccordion from '../shared/EditorAccordion';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

const TooltipLabel = ({
  label,
  tooltip,
  alignRight = false,
}: {
  label: string;
  tooltip: string;
  alignRight?: boolean;
}) => (
  <div className="flex items-center gap-1.5 relative group w-full mb-1">
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate">{label}</label>
    <HelpCircle size={11} className="text-zinc-600 hover:text-white cursor-help transition-colors shrink-0" />
    <div
      className={`absolute top-full mt-1.5 ${alignRight ? 'right-0' : 'left-0'} w-48 p-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none`}
    >
      <p className="text-[10px] text-fuchsia-400 normal-case tracking-normal font-medium leading-relaxed">
        {tooltip}
      </p>
    </div>
  </div>
);

export default function LeadCapture({
  formData,
  setFormData,
  handleChange,
  embedded = false,
}: {
  formData: any;
  setFormData: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  embedded?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const selectedInquiries = formData.lead_inquiry_types || copy.STANDARD_INQUIRY_TYPES.slice(0, 2);

  const onInputChange =
    handleChange ||
    ((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    });

  const toggleInquiryType = (type: string) => {
    const updated = selectedInquiries.includes(type)
      ? selectedInquiries.filter((t: string) => t !== type)
      : [...selectedInquiries, type];
    setFormData((prev: any) => ({ ...prev, lead_inquiry_types: updated }));
  };

  const progress = selectedInquiries.length > 0 ? 100 : 0;

  const content = (
    <div className="space-y-4">
      {/* BOTTOM CONTACT BLOCK COPY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end pb-4 border-b border-zinc-800/70">
        <div>
          <TooltipLabel label={copy.CONTACT_HEADING_LABEL} tooltip={copy.CONTACT_HEADING_TOOLTIP} />
          <input
            name="primary_cta"
            value={formData.primary_cta || ''}
            onChange={onInputChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-fuchsia-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.CONTACT_HEADING_PLACEHOLDER}
          />
        </div>

        <div>
          <TooltipLabel
            label={copy.CONTACT_BTN_LABEL}
            tooltip={copy.CONTACT_BTN_TOOLTIP}
            alignRight={true}
          />
          <input
            name="secondary_cta"
            value={formData.secondary_cta || ''}
            onChange={onInputChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-fuchsia-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.CONTACT_BTN_PLACEHOLDER}
          />
        </div>
      </div>

      {/* FORM ROUTING OPTIONS */}
      <div>
        <TooltipLabel label={copy.LEAD_LABEL} tooltip={copy.LEAD_TOOLTIP} />
        <div className="flex flex-col gap-2 mt-2">
          {copy.STANDARD_INQUIRY_TYPES.map((type: string) => {
            const isChecked = selectedInquiries.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleInquiryType(type)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border text-left ${
                  isChecked
                    ? 'bg-fuchsia-500/10 border-fuchsia-500/30'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all shrink-0 ${
                    isChecked ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-black border-zinc-600'
                  }`}
                >
                  {isChecked && <div className="w-1.5 h-1.5 bg-black rounded-sm" />}
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isChecked ? 'text-fuchsia-400' : 'text-zinc-400'
                  }`}
                >
                  {type}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <EditorAccordion
      title={copy.LEAD_ACCORDION}
      icon={MessageSquareText}
      accentColor="fuchsia"
      progress={progress}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      {content}
    </EditorAccordion>
  );
}