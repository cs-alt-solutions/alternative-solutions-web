/* src/components/dashboard/storefronts/editor/media/MediaTooltipLabel.tsx */
'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface MediaTooltipLabelProps {
  label: string;
  icon?: React.ElementType;
  tooltip?: string;
  iconColor?: string;
  tooltipColor?: string;
}

export default function MediaTooltipLabel({
  label,
  icon: Icon,
  tooltip,
  iconColor = 'text-zinc-500',
  tooltipColor = 'text-zinc-300',
}: MediaTooltipLabelProps) {
  return (
    <div className="flex items-center gap-1.5 relative group w-fit mb-1">
      {Icon && <Icon size={10} className={iconColor} />}
      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      {tooltip && (
        <HelpCircle size={11} className="text-zinc-600 hover:text-white cursor-help transition-colors" />
      )}

      {tooltip && (
        <div className="absolute top-full left-0 mt-1.5 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
          <p className={`text-[10px] ${tooltipColor} normal-case tracking-normal font-medium leading-relaxed`}>
            {tooltip}
          </p>
        </div>
      )}
    </div>
  );
}