/* src/components/dashboard/storefronts/editor/media/IntegrationsSection.tsx */
'use client';

import React from 'react';
import { Unplug, MapPin, Utensils } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import EditorAccordion from '../shared/EditorAccordion';
import MediaTooltipLabel from './MediaTooltipLabel';

interface IntegrationsSectionProps {
  formData: any;
  showOrderingUrl: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function IntegrationsSection({
  formData,
  showOrderingUrl,
  isOpen,
  onToggle,
  onChange,
}: IntegrationsSectionProps) {
  const copy = EDITOR_WORKSPACE_COPY.CORE_TAB;

  return (
    <EditorAccordion
      title={copy.INTEGRATIONS_HEADING}
      icon={Unplug}
      accentColor="emerald"
      hidePercentage={true}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        <div>
          <MediaTooltipLabel
            label={copy.MAPS_LABEL}
            icon={MapPin}
            iconColor="text-emerald-500/70"
            tooltip={copy.MAPS_TOOLTIP}
            tooltipColor="text-emerald-400"
          />
          <input
            name="map_embed_url"
            value={formData.map_embed_url || ''}
            onChange={onChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700"
            placeholder={copy.MAPS_PLACEHOLDER}
          />
        </div>

        {showOrderingUrl && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <MediaTooltipLabel
              label={copy.ORDERING_LABEL}
              icon={Utensils}
              iconColor="text-emerald-500/70"
              tooltip={copy.ORDERING_TOOLTIP}
              tooltipColor="text-emerald-400"
            />
            <input
              name="ordering_url"
              value={formData.ordering_url || ''}
              onChange={onChange}
              className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700"
              placeholder={copy.ORDERING_PLACEHOLDER}
            />
          </div>
        )}
      </div>
    </EditorAccordion>
  );
}