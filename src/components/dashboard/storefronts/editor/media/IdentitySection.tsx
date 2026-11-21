/* src/components/dashboard/storefronts/editor/media/IdentitySection.tsx */
'use client';

import React from 'react';
import { Store, Link as LinkIcon, Mail, Tag, ChevronDown } from 'lucide-react';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import EditorAccordion from '../shared/EditorAccordion';
import MediaTooltipLabel from './MediaTooltipLabel';

interface IdentitySectionProps {
  formData: any;
  isClientPortal: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function IdentitySection({
  formData,
  isClientPortal,
  isOpen,
  onToggle,
  onChange,
}: IdentitySectionProps) {
  const copy = EDITOR_WORKSPACE_COPY.CORE_TAB;
  const fields = [formData.business_name, formData.slug, formData.contact_email];
  const progress = Math.round(
    (fields.filter((f) => f && String(f).trim() !== '').length / 3) * 100
  );

  return (
    <EditorAccordion
      title={copy.IDENTITY_HEADING}
      icon={Store}
      accentColor="cyan"
      progress={progress}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <MediaTooltipLabel label={copy.BUSINESS_NAME_LABEL} />
            <input
              name="business_name"
              value={formData.business_name || ''}
              onChange={onChange}
              className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-700"
              placeholder={copy.BUSINESS_NAME_PLACEHOLDER}
            />
          </div>

          <div>
            <MediaTooltipLabel label={copy.SLUG_LABEL} icon={LinkIcon} iconColor="text-cyan-500/70" />
            <input
              name="slug"
              value={formData.slug || ''}
              onChange={onChange}
              disabled={isClientPortal}
              className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-cyan-400 font-mono text-xs outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <MediaTooltipLabel label={copy.EMAIL_LABEL} icon={Mail} iconColor="text-cyan-500/70" />
            <input
              name="contact_email"
              value={formData.contact_email || ''}
              onChange={onChange}
              className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-700"
              placeholder={copy.EMAIL_PLACEHOLDER}
            />
          </div>

          {!isClientPortal && (
            <div>
              <MediaTooltipLabel label={copy.INDUSTRY_LABEL} icon={Tag} iconColor="text-cyan-500/70" />
              <div className="relative">
                <select
                  name="industry_tag"
                  value={formData.industry_tag || 'General'}
                  onChange={onChange}
                  className="w-full bg-zinc-950 pl-2.5 pr-7 py-2 rounded-md border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                >
                  {STOREFRONT_EDITOR_COPY.INDUSTRIES?.map((category: any) => (
                    <option key={category.id} value={category.id} className="bg-zinc-900 text-white">
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </EditorAccordion>
  );
}