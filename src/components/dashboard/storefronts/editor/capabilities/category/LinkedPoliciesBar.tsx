/* src/components/dashboard/storefronts/editor/capabilities/category/LinkedPoliciesBar.tsx */
'use client';

import React from 'react';
import { Scale } from 'lucide-react';

interface LinkedPoliciesBarProps {
  categoryTitle?: string;
  operationalTerms?: any[];
}

export default function LinkedPoliciesBar({
  categoryTitle,
  operationalTerms = [],
}: LinkedPoliciesBarProps) {
  const safeTerms = Array.isArray(operationalTerms)
    ? operationalTerms.filter((t) => t && t.title?.trim())
    : [];

  const normalizedTitle = (categoryTitle || '').trim().toLowerCase();

  const specificRules = safeTerms.filter(
    (t) => normalizedTitle && t.appliesTo && t.appliesTo !== 'ALL' && t.appliesTo.trim().toLowerCase() === normalizedTitle
  );
  const storewideRules = safeTerms.filter((t) => !t.appliesTo || t.appliesTo === 'ALL');

  return (
    <div className="pt-2.5 border-t border-zinc-800/60 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <Scale size={11} className="text-indigo-400" />
          Linked Policies ({specificRules.length + storewideRules.length})
        </span>
        <span className="text-[9px] font-mono text-zinc-600">Managed in Logistics</span>
      </div>

      {specificRules.length === 0 && storewideRules.length === 0 ? (
        <p className="text-[10px] text-zinc-600 italic">
          No policies attached yet. Assign rules from the Logistics tab.
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {specificRules.map((rule, idx) => (
            <span
              key={`spec-${idx}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-[10px] text-indigo-300 font-medium"
            >
              <span>{rule.title}</span>
              {rule.fees?.length > 0 && (
                <span className="font-mono text-[9px] opacity-75">· {rule.fees.length}</span>
              )}
            </span>
          ))}

          {storewideRules.map((rule, idx) => (
            <span
              key={`all-${idx}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
              title="Storewide rule (applies to all)"
            >
              <span>{rule.title}</span>
              <span className="font-mono text-[8px] uppercase text-zinc-500">All</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}