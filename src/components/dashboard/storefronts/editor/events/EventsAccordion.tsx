/* src/components/dashboard/storefronts/editor/events/EventsAccordion.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { CalendarDays, Plus, Sparkles, ChevronDown } from 'lucide-react';
import {
  EDITOR_WORKSPACE_COPY,
  StorefrontEvent,
  getEventPresets,
} from '@/config/dashboard/editor';
import EventItemCard from './EventItemCard';

function isEventPast(dateStr?: string): boolean {
  if (!dateStr) return false;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return false;
  const eventDay = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDay < today;
}

interface EventsAccordionProps {
  formData: any;
  setFormData: any;
  blueprintId: string;
}

export default function EventsAccordion({
  formData,
  setFormData,
  blueprintId,
}: EventsAccordionProps) {
  const copy = EDITOR_WORKSPACE_COPY.EVENTS_TAB;
  const events: StorefrontEvent[] = Array.isArray(formData.events) ? formData.events : [];
  const [sectionOpen, setSectionOpen] = useState(events.length > 0);
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const presets = getEventPresets(blueprintId);

  const vaultImages = useMemo(() => {
    const raw = Array.isArray(formData.gallery_items) ? formData.gallery_items : [];
    return raw
      .filter((item: any) => item && typeof item === 'object' && item.imageUrl)
      .map((item: any, idx: number) => ({
        url: item.imageUrl as string,
        label: item.title?.trim() || `${item.category || 'Photo'} #${idx + 1}`,
      }));
  }, [formData.gallery_items]);

  const upcomingCount = events.filter((e) => e.isVisible !== false && !isEventPast(e.date)).length;
  const pastCount = events.filter((e) => isEventPast(e.date)).length;

  const appendEvent = (template?: Omit<StorefrontEvent, 'id'>) => {
    const id = `evt-${Date.now()}`;
    const next: StorefrontEvent = template
      ? { id, ...template }
      : { id, title: '', date: '', startTime: '', endTime: '', location: '', category: 'special', isVisible: true };

    setFormData((prev: any) => ({
      ...prev,
      events: [...(Array.isArray(prev.events) ? prev.events : []), next],
    }));
    setSectionOpen(true);
    setOpenEventId(id);
  };

  const updateEvent = (id: string, patch: Partial<StorefrontEvent>) => {
    setFormData((prev: any) => ({
      ...prev,
      events: (prev.events || []).map((ev: StorefrontEvent) => (ev.id === id ? { ...ev, ...patch } : ev)),
    }));
  };

  const removeEvent = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      events: (prev.events || []).filter((ev: StorefrontEvent) => ev.id !== id),
    }));
    if (openEventId === id) setOpenEventId(null);
  };

  return (
    <div className="pt-4 border-t border-zinc-800 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSectionOpen(!sectionOpen)}
          className="flex items-center gap-2 text-left min-w-0 cursor-pointer"
        >
          <CalendarDays className="w-4 h-4 text-emerald-400 shrink-0" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white truncate">
            {copy.HEADING}
          </h3>
          {events.length > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-[9px] font-mono text-emerald-300 shrink-0">
              {upcomingCount} {copy.BADGE_LIVE_SUFFIX}
              {pastCount > 0 ? ` · ${pastCount} ${copy.BADGE_PAST_SUFFIX}` : ''}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-zinc-500 transition-transform ${sectionOpen ? 'rotate-180 text-white' : ''}`}
          />
        </button>

        <button
          type="button"
          onClick={() => appendEvent()}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3 h-3" /> {copy.ADD_BTN}
        </button>
      </div>

      {sectionOpen && (
        <div className="space-y-3">
          <p className="text-[11px] text-zinc-500 leading-relaxed">{copy.HELPER_TEXT}</p>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 flex items-center gap-1 mr-0.5">
              <Sparkles size={10} className="text-emerald-400" /> {copy.QUICK_ADD_LABEL}
            </span>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => appendEvent(preset.template)}
                className="px-2 py-1 rounded-md bg-zinc-900/80 hover:bg-emerald-500/15 border border-zinc-800 hover:border-emerald-500/40 text-[10px] font-semibold text-zinc-300 hover:text-emerald-200 transition-colors cursor-pointer"
              >
                + {preset.label}
              </button>
            ))}
          </div>

          {events.length === 0 ? (
            <div className="p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 text-center">
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                {copy.EMPTY_STATE}
              </span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {events.map((event) => (
                <EventItemCard
                  key={event.id}
                  event={event}
                  isExpired={isEventPast(event.date)}
                  isOpen={openEventId === event.id}
                  vaultImages={vaultImages}
                  onToggle={() => setOpenEventId(openEventId === event.id ? null : event.id)}
                  onUpdate={(patch) => updateEvent(event.id, patch)}
                  onRemove={() => removeEvent(event.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}