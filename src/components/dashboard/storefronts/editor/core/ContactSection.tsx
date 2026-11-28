/* src/components/dashboard/storefronts/editor/core/ContactSection.tsx */
import React, { useState } from 'react';
import { MousePointerClick, HelpCircle } from 'lucide-react';
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
      <p className="text-[10px] text-indigo-400 normal-case tracking-normal font-medium leading-relaxed">
        {tooltip}
      </p>
    </div>
  </div>
);

export default function ContactSection({
  formData,
  handleChange,
  embedded = false,
}: {
  formData: any;
  handleChange: any;
  embedded?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;

  const fields = [
    formData.capabilities_heading,
    formData.gallery_heading,
    formData.primary_cta,
    formData.secondary_cta,
  ];
  const progress = Math.round((fields.filter((f) => f && f.trim() !== '').length / 4) * 100);

  const content = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
        <div>
          <TooltipLabel label={copy.CONTACT_HEADING_LABEL} tooltip={copy.CONTACT_HEADING_TOOLTIP} />
          <input
            name="primary_cta"
            value={formData.primary_cta || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
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
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.CONTACT_BTN_PLACEHOLDER}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
        <div>
          <TooltipLabel label={copy.SERVICES_HEADING_LABEL} tooltip={copy.SERVICES_HEADING_TOOLTIP} />
          <input
            name="capabilities_heading"
            value={formData.capabilities_heading || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.SERVICES_HEADING_PLACEHOLDER}
          />
        </div>

        <div>
          <TooltipLabel
            label={copy.GALLERY_HEADING_LABEL}
            tooltip={copy.GALLERY_HEADING_TOOLTIP}
            alignRight={true}
          />
          <input
            name="gallery_heading"
            value={formData.gallery_heading || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-indigo-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.GALLERY_HEADING_PLACEHOLDER}
          />
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <EditorAccordion
      title={copy.CONTACT_ACCORDION}
      icon={MousePointerClick}
      accentColor="indigo"
      progress={progress}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      {content}
    </EditorAccordion>
  );
}