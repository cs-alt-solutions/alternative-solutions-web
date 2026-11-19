/* src/components/dashboard/storefronts/editor/grid/InfrastructurePanel.tsx */
'use client';

import React from 'react';
import { Globe, Server, Code, Eye, ExternalLink } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

export default function InfrastructurePanel({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const copy = EDITOR_WORKSPACE_COPY.GRID_TAB.INFRASTRUCTURE;

  const cleanDomain = (formData.custom_domain || '').replace(/^https?:\/\//, '').trim();
  const targetUrl = cleanDomain
    ? `https://${cleanDomain}`
    : formData.slug
      ? `https://storefronts.alternativesolutions.io/${formData.slug}`
      : '';

  return (
    <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700">
            <Server size={14} className="text-zinc-300" />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
            {copy.TITLE}
          </h3>
        </div>

        {targetUrl && (
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            Open URL <ExternalLink size={11} />
          </a>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3.5">
        {/* Module 1: Domain Routing */}
        <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
          <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
            <Globe size={12} className="text-cyan-400" /> {copy.DOMAIN_LABEL}
          </label>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xs font-mono pointer-events-none">
              {copy.DOMAIN_PREFIX}
            </span>
            <input
              type="text"
              value={formData.custom_domain || ''}
              onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
              placeholder={copy.DOMAIN_PLACEHOLDER}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md pl-16 pr-3 py-2 text-xs text-cyan-400 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Module 2: Template Engine Toggle */}
        <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-md border transition-colors ${
                  formData.is_template
                    ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300'
                    : 'bg-zinc-800/70 border-zinc-700 text-zinc-400'
                }`}
              >
                <Code size={14} />
              </div>
              <div>
                <span className="block text-[11px] font-black text-white uppercase tracking-wider mb-0.5">
                  {copy.TEMPLATE_TITLE}
                </span>
                <span className="block text-[9px] font-mono text-zinc-400 uppercase">
                  {copy.TEMPLATE_SUBTITLE}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer group shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.is_template || false}
                onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
              />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-zinc-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fuchsia-500/25 peer-checked:border-fuchsia-400 peer-checked:after:bg-fuchsia-400 border border-zinc-700 group-hover:border-zinc-500" />
            </label>
          </div>
        </div>

        {/* Module 3: Directory Visibility */}
        <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-md border transition-colors ${
                  formData.is_published
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-800/70 border-zinc-700 text-zinc-400'
                }`}
              >
                <Eye size={14} />
              </div>
              <div>
                <span className="block text-[11px] font-black text-white uppercase tracking-wider mb-0.5">
                  {copy.DIRECTORY_TITLE}
                </span>
                <span className="block text-[9px] font-mono text-zinc-400 uppercase">
                  {copy.DIRECTORY_SUBTITLE}
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer group shrink-0">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.is_published || false}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-zinc-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/25 peer-checked:border-emerald-400 peer-checked:after:bg-emerald-400 border border-zinc-700 group-hover:border-zinc-500" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}