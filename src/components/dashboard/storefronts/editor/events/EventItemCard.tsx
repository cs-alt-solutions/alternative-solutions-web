/* src/components/dashboard/storefronts/editor/events/EventItemCard.tsx */
'use client';

import React from 'react';
import {
  ChevronDown,
  Star,
  Eye,
  EyeOff,
  Trash2,
  MapPin,
  Link2,
  Image as ImageIcon,
  Sprout,
  Sparkles,
  Store,
  Truck,
  Camera,
  Music,
  Calendar,
} from 'lucide-react';
import {
  EDITOR_WORKSPACE_COPY,
  EVENT_CATEGORIES,
  EventCategory,
  StorefrontEvent,
} from '@/config/dashboard/editor';

const EVENT_CATEGORY_ICONS: Record<EventCategory, React.ElementType> = {
  festival: Sprout,
  appearance: Sparkles,
  popup: Store,
  truck: Truck,
  session: Camera,
  live: Music,
  special: Calendar,
};

function formatStubDate(dateStr?: string): string {
  if (!dateStr) return 'TBD';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  return new Date(parts[0], parts[1] - 1, parts[2])
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();
}

interface EventItemCardProps {
  event: StorefrontEvent;
  isExpired: boolean;
  isOpen: boolean;
  vaultImages: { label: string; url: string }[];
  onToggle: () => void;
  onUpdate: (patch: Partial<StorefrontEvent>) => void;
  onRemove: () => void;
}

export default function EventItemCard({
  event,
  isExpired,
  isOpen,
  vaultImages,
  onToggle,
  onUpdate,
  onRemove,
}: EventItemCardProps) {
  const copy = EDITOR_WORKSPACE_COPY.EVENTS_TAB;
  const Icon = EVENT_CATEGORY_ICONS[event.category || 'special'] || Calendar;
  const hidden = event.isVisible === false;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isExpired
          ? 'bg-zinc-950/60 border-zinc-800/60 opacity-75'
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold shrink-0 ${
              isExpired
                ? 'bg-zinc-800 text-zinc-500'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
            }`}
          >
            {formatStubDate(event.date)}
          </span>
          <Icon size={12} className="text-zinc-400 shrink-0" />
          <span className="text-xs font-bold text-white truncate">
            {event.title?.trim() || copy.UNTITLED_EVENT}
          </span>
          {event.isFeatured && <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isExpired && (
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-mono uppercase text-zinc-400">
              {copy.BADGE_PAST_SUFFIX}
            </span>
          )}
          {hidden && !isExpired && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-[8px] font-mono uppercase text-amber-400">
              {copy.BADGE_HIDDEN}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 pt-2 border-t border-zinc-800/70 space-y-2.5">
          <div className="space-y-2">
            <input
              value={event.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder={copy.TITLE_PLACEHOLDER}
              className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-white text-xs focus:border-emerald-500 outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  {copy.DATE_LABEL}
                </label>
                <input
                  type="date"
                  value={event.date || ''}
                  onChange={(e) => onUpdate({ date: e.target.value })}
                  className="w-full bg-zinc-950 px-2 py-1.5 rounded-lg border border-zinc-800 text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  {copy.CATEGORY_LABEL}
                </label>
                <select
                  value={event.category || 'special'}
                  onChange={(e) => onUpdate({ category: e.target.value as EventCategory })}
                  className="w-full bg-zinc-950 px-2 py-1.5 rounded-lg border border-zinc-800 text-zinc-200 text-xs focus:border-emerald-500 outline-none"
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                value={event.startTime || ''}
                onChange={(e) => onUpdate({ startTime: e.target.value })}
                placeholder={copy.START_TIME_PLACEHOLDER}
                className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-200 text-xs focus:border-emerald-500 outline-none"
              />
              <input
                value={event.endTime || ''}
                onChange={(e) => onUpdate({ endTime: e.target.value })}
                placeholder={copy.END_TIME_PLACEHOLDER}
                className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-200 text-xs focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <MapPin size={12} className="absolute left-2.5 top-2 text-zinc-500" />
                <input
                  value={event.location || ''}
                  onChange={(e) => onUpdate({ location: e.target.value })}
                  placeholder={copy.LOCATION_PLACEHOLDER}
                  className="w-full bg-zinc-950 pl-7 pr-2.5 py-1.5 rounded-lg border border-zinc-800 text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>
              <input
                value={event.address || ''}
                onChange={(e) => onUpdate({ address: e.target.value })}
                placeholder={copy.ADDRESS_PLACEHOLDER}
                className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 text-[11px] focus:border-emerald-500 outline-none"
              />
            </div>

            <textarea
              rows={2}
              value={event.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder={copy.DESC_PLACEHOLDER}
              className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 text-xs focus:border-emerald-500 outline-none resize-none"
            />

            <div>
              <div className="relative">
                <Link2 size={12} className="absolute left-2.5 top-2 text-zinc-500" />
                <input
                  value={event.linkUrl || ''}
                  onChange={(e) => onUpdate({ linkUrl: e.target.value })}
                  placeholder={copy.LINK_PLACEHOLDER}
                  className="w-full bg-zinc-950 pl-7 pr-2.5 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 text-[11px] focus:border-emerald-500 outline-none"
                />
              </div>
              <p className="text-[9px] text-zinc-600 mt-1">{copy.LINK_HELPER}</p>
            </div>

            {vaultImages.length > 0 && (
              <div className="flex items-center gap-2">
                <ImageIcon size={12} className="text-zinc-500 shrink-0" />
                <select
                  value={event.imageUrl || ''}
                  onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                  className="flex-1 bg-zinc-950 px-2 py-1.5 rounded-lg border border-zinc-800 text-zinc-300 text-[11px] focus:border-emerald-500 outline-none"
                >
                  <option value="">{copy.VAULT_NONE_OPTION}</option>
                  {vaultImages.map((img, i) => (
                    <option key={i} value={img.url}>
                      {copy.VAULT_PREFIX} {img.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdate({ isFeatured: !event.isFeatured })}
                className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 border cursor-pointer transition-colors ${
                  event.isFeatured
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Star size={11} className={event.isFeatured ? 'fill-amber-400' : ''} /> {copy.SPOTLIGHT_BTN}
              </button>

              <button
                type="button"
                onClick={() => onUpdate({ isVisible: hidden })}
                className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 border cursor-pointer transition-colors ${
                  hidden
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-500'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {hidden ? <EyeOff size={11} /> : <Eye size={11} />}
                {hidden ? copy.HIDDEN_BTN : copy.VISIBLE_BTN}
              </button>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
              title={copy.DELETE_TITLE}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}