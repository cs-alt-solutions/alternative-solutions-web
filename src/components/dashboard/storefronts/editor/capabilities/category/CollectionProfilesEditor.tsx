/* src/components/dashboard/storefronts/editor/capabilities/category/CollectionProfilesEditor.tsx */
'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Images,
  Sparkles,
} from 'lucide-react';

export interface CollectionProfile {
  name: string;
  subtitle?: string;
  bio?: string;
  highlights?: string[];
}

interface CollectionProfilesEditorProps {
  profiles: CollectionProfile[];
  deptCollections: Array<{ name: string; count: number }>;
  onChange: (updated: CollectionProfile[]) => void;
}

export default function CollectionProfilesEditor({
  profiles,
  deptCollections,
  onChange,
}: CollectionProfilesEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    profiles.length === 1 ? 0 : null
  );

  const photoCountByKey = new Map<string, number>();
  for (const col of deptCollections) {
    photoCountByKey.set(col.name.trim().toLowerCase(), col.count);
  }

  const unprofiledCollections = deptCollections.filter(
    (col) =>
      !profiles.some(
        (p) => p.name?.trim().toLowerCase() === col.name.trim().toLowerCase()
      )
  );

  const handleAddProfile = (prefillName = '') => {
    const next: CollectionProfile[] = [
      ...profiles,
      { name: prefillName, subtitle: '', bio: '', highlights: [] },
    ];
    onChange(next);
    setExpandedIndex(next.length - 1);
  };

  const handleUpdateProfile = (idx: number, patch: Partial<CollectionProfile>) => {
    onChange(profiles.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const handleRemoveProfile = (idx: number) => {
    onChange(profiles.filter((_, i) => i !== idx));
    if (expandedIndex === idx) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > idx) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleMoveProfile = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= profiles.length) return;
    const copy = [...profiles];
    const [moved] = copy.splice(idx, 1);
    copy.splice(target, 0, moved);
    onChange(copy);
    setExpandedIndex(target);
  };

  const handleAddHighlight = (pIdx: number) => {
    const current = profiles[pIdx]?.highlights || [];
    handleUpdateProfile(pIdx, { highlights: [...current, ''] });
  };

  const handleUpdateHighlight = (pIdx: number, hIdx: number, value: string) => {
    const current = profiles[pIdx]?.highlights || [];
    handleUpdateProfile(pIdx, {
      highlights: current.map((h, i) => (i === hIdx ? value : h)),
    });
  };

  const handleRemoveHighlight = (pIdx: number, hIdx: number) => {
    const current = profiles[pIdx]?.highlights || [];
    handleUpdateProfile(pIdx, {
      highlights: current.filter((_, i) => i !== hIdx),
    });
  };

  return (
    <div className="space-y-3 pb-4 border-b border-zinc-800/80">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers size={12} /> Artist / Project Groups ({profiles.length})
        </label>
        <button
          type="button"
          onClick={() => handleAddProfile('')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus size={11} /> Add Group
        </button>
      </div>

      {/* One-click setup pills for Drop Vault collections without a profile yet */}
      {unprofiledCollections.length > 0 && (
        <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/25 space-y-2">
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Drop Vault photo groups detected—tap to add their bio, role, and grouped highlights:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unprofiledCollections.map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => handleAddProfile(col.name)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 border border-cyan-500/40 hover:bg-cyan-500 hover:text-zinc-950 text-[10px] font-bold text-cyan-300 transition-colors cursor-pointer"
              >
                <Plus size={10} />
                <span>
                  Setup {col.name} ({col.count} photos)
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {profiles.length === 0 ? (
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Optional: Group bios, roles, and specialties per Artist or Project (matches Drop Vault collection tags). Leave empty for standard single-service departments.
        </p>
      ) : (
        <div className="space-y-2.5">
          {profiles.map((profile, pIdx) => {
            const isOpen = expandedIndex === pIdx;
            const trimmedName = profile.name?.trim() || '';
            const linkedPhotos = trimmedName
              ? photoCountByKey.get(trimmedName.toLowerCase()) || 0
              : 0;
            const hlCount = (profile.highlights || []).filter((h) => h?.trim()).length;

            return (
              <div
                key={pIdx}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/70 border-cyan-500/40'
                    : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Accordion Header */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isOpen ? null : pIdx)}
                    className="flex-1 min-w-0 text-left flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                      0{pIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {trimmedName || 'Untitled Group'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                        {profile.subtitle?.trim() && (
                          <span className="text-cyan-400/90 truncate max-w-44">
                            {profile.subtitle}
                          </span>
                        )}
                        <span className={linkedPhotos > 0 ? 'text-emerald-400 font-mono' : 'font-mono'}>
                          {linkedPhotos} {linkedPhotos === 1 ? 'photo' : 'photos'}
                        </span>
                        <span className="font-mono">{hlCount} highlights</span>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {profiles.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleMoveProfile(pIdx, 'up')}
                          disabled={pIdx === 0}
                          className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveProfile(pIdx, 'down')}
                          disabled={pIdx === profiles.length - 1}
                          className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveProfile(pIdx)}
                      className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      title="Delete Group"
                    >
                      <Trash2 size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isOpen ? null : pIdx)}
                      className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Profile Fields */}
                {isOpen && (
                  <div className="p-3 pt-2 border-t border-zinc-800/80 space-y-3 bg-zinc-950/50">
                    {/* Group Name + Photo Match Indicator */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Group / Collection Name
                        </label>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-mono ${
                            linkedPhotos > 0 ? 'text-emerald-400' : 'text-zinc-500'
                          }`}
                        >
                          <Images size={10} />
                          {linkedPhotos > 0
                            ? `${linkedPhotos} Drop Vault photos linked`
                            : 'Match Drop Vault tag to link photos'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={profile.name || ''}
                        onChange={(e) => handleUpdateProfile(pIdx, { name: e.target.value })}
                        placeholder="e.g., Amie Grant or '68 Panhead Tank"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 outline-none"
                      />
                    </div>

                    {/* Role / Subtitle */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                        Role / Subtitle (Optional)
                      </label>
                      <input
                        type="text"
                        value={profile.subtitle || ''}
                        onChange={(e) => handleUpdateProfile(pIdx, { subtitle: e.target.value })}
                        placeholder="e.g., Owner & Tattoo Artist · Blackwork & Symbolism"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-cyan-200 placeholder:text-zinc-600 focus:border-cyan-500 outline-none"
                      />
                    </div>

                    {/* Full Bio / Story */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                        Full Bio / Project Story
                      </label>
                      <textarea
                        value={profile.bio || ''}
                        onChange={(e) => handleUpdateProfile(pIdx, { bio: e.target.value })}
                        placeholder="Paste their full bio, artistic background, or build story here..."
                        rows={4}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 leading-relaxed placeholder:text-zinc-600 focus:border-cyan-500 outline-none resize-y"
                      />
                    </div>

                    {/* Grouped Highlights for THIS Artist / Project */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles size={11} className="text-cyan-400" />
                        <span>
                          Highlights for {trimmedName || 'This Group'} ({(profile.highlights || []).length})
                        </span>
                      </label>

                      {(profile.highlights || []).length > 0 && (
                        <div className="space-y-1.5">
                          {(profile.highlights || []).map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={hl}
                                onChange={(e) => handleUpdateHighlight(pIdx, hIdx, e.target.value)}
                                placeholder="e.g., Fine Line & Symbolic Work"
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveHighlight(pIdx, hIdx)}
                                className="p-1 text-zinc-600 hover:text-rose-400 cursor-pointer"
                                title="Remove Highlight"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddHighlight(pIdx)}
                        className="w-full py-1.5 rounded-lg border border-dashed border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/30 hover:bg-cyan-500/5 text-[10px] font-bold text-zinc-400 hover:text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus size={11} /> Add Highlight
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}