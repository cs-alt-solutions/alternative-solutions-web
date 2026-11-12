/* src/components/dashboard/storefronts/manager/StorefrontTable.tsx */
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Globe, Eye, EyeOff, User, ArrowUpDown, 
  ChevronUp, ChevronDown, Clock, Mail, Loader2, CheckCircle2, FlaskConical, Users 
} from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { sendPortalNudge } from '@/app/actions/storefront_applications'; 
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

interface TableProps {
  processedData: any[];
  requestSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleRowUpdate: (id: string, field: string, value: any) => void;
  masterIndustries: { id: string; label: string }[];
  isPrototypeView?: boolean;
}

export default function StorefrontTable({ 
  processedData, requestSort, sortConfig, handleRowUpdate, masterIndustries, isPrototypeView = false 
}: TableProps) {
  const [nudgingId, setNudgingId] = useState<string | null>(null);
  const [nudgedSuccessId, setNudgedSuccessId] = useState<string | null>(null);
  const copy = STOREFRONT_MANAGER_COPY.TABLE;

  const handleNudgeClient = async (id: string, email: string, businessName: string) => {
    if (!window.confirm(`${copy.NUDGE_CONFIRM_PREFIX} ${email}?`)) return;
    
    setNudgingId(id);
    try {
      const result = await sendPortalNudge(id, email, businessName);
      if (result.success) {
        setNudgedSuccessId(id);
        setTimeout(() => setNudgedSuccessId(null), 3000);
      } else {
        alert(result.error || copy.NUDGE_ERROR);
      }
    } catch (err) {
      alert(copy.NUDGE_SYS_ERROR);
    } finally {
      setNudgingId(null);
    }
  };

  const handleTogglePrototype = (store: any) => {
    const nextIsTemplate = !store.is_template;
    const msg = nextIsTemplate ? copy.CONVERT_CONFIRM_PROTOTYPE : copy.CONVERT_CONFIRM_CLIENT;
    if (!window.confirm(msg)) return;
    handleRowUpdate(store.id, 'is_template', nextIsTemplate);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={12} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-cyan-400" /> : <ChevronDown size={14} className="text-cyan-400" />;
  };

  const getRowStyle = (status: string, isOffline: boolean, isTemplate: boolean) => {
    if (isTemplate) return 'bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.05] border-l-2 border-l-fuchsia-500/40';
    if (isOffline) return 'opacity-60 hover:bg-white/5 border-l-2 border-l-transparent';
    
    switch(status) {
      case 'ACTIVE': 
      case 'LIVE': return 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] border-l-2 border-l-emerald-500/50';
      case 'IN_REVIEW': return 'bg-cyan-500/[0.02] hover:bg-cyan-500/[0.05] border-l-2 border-l-cyan-500/50';
      case 'CONTENT_ASSEMBLY': return 'bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] border-l-2 border-l-indigo-500/50';
      case 'BUILDING_CORE': return 'bg-fuchsia-500/[0.02] hover:bg-fuchsia-500/[0.05] border-l-2 border-l-fuchsia-500/50';
      case 'AWAITING_ASSETS': return 'bg-violet-500/[0.02] hover:bg-violet-500/[0.05] border-l-2 border-l-violet-500/50';
      case 'ONBOARDING': return 'bg-amber-500/[0.02] hover:bg-amber-500/[0.05] border-l-2 border-l-amber-500/50';
      case 'ON_HOLD': return 'bg-rose-500/[0.02] hover:bg-rose-500/[0.05] border-l-2 border-l-rose-500/50';
      case 'PENDING_BUILD': return 'bg-zinc-500/[0.02] hover:bg-zinc-500/[0.05] border-l-2 border-l-zinc-500/50';
      default: return 'hover:bg-white/5 border-l-2 border-l-transparent';
    }
  };

  const getCategoryLabel = (rawCat: string) => {
    if (!rawCat) return copy.EMPTY_CELL;
    const match = masterIndustries.find(
      c => c.id.toLowerCase() === rawCat.toLowerCase() || c.label.toLowerCase() === rawCat.toLowerCase()
    );
    return match ? match.label : rawCat;
  };

  const getStageTiming = (store: any) => {
    const notes = Array.isArray(store.audit_notes) ? store.audit_notes : [];
    const lastAuditTimestamp = notes.length > 0 ? notes[notes.length - 1]?.timestamp : null;
    const rawStageDate = lastAuditTimestamp || store.updated_at || store.created_at;

    const stageDate = new Date(rawStageDate);
    const createdDate = new Date(store.created_at);

    const daysInStage = Math.max(0, Math.floor((Date.now() - stageDate.getTime()) / (1000 * 60 * 60 * 24)));
    const stageBadgeText = daysInStage === 0 ? copy.TODAY : daysInStage === 1 ? copy.DAY_1 : `${daysInStage}${copy.DAYS_IN_STAGE_SUFFIX}`;

    const formattedCreated = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedStageDate = stageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return { daysInStage, stageBadgeText, formattedCreated, formattedStageDate };
  };

  // Shared Action Buttons helper (DRY across Mobile Card & Desktop Row)
  const renderActionButtons = (store: any, rawStatus: string, isLive: boolean, isStrictlyActiveClient: boolean) => (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
      {rawStatus === 'ONBOARDING' && !store.is_template && (
        <button 
          type="button"
          onClick={() => handleNudgeClient(store.id, store.contact_email, store.business_name)}
          disabled={nudgingId === store.id || nudgedSuccessId === store.id}
          className={`p-2 sm:p-1.5 rounded-md transition-all flex items-center justify-center cursor-pointer shadow-sm ${
            nudgedSuccessId === store.id
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
              : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
          }`}
          title={copy.NUDGE_TITLE}
        >
          {nudgingId === store.id ? <Loader2 size={14} className="animate-spin" /> 
            : nudgedSuccessId === store.id ? <CheckCircle2 size={14} /> 
            : <Mail size={14} />}
        </button>
      )}

      {!isStrictlyActiveClient && (
        <button
          type="button"
          onClick={() => handleTogglePrototype(store)}
          title={store.is_template ? copy.CONVERT_TO_CLIENT_TITLE : copy.CONVERT_TO_PROTOTYPE_TITLE}
          className={`p-2 sm:p-1.5 rounded-md border transition-all flex items-center justify-center cursor-pointer ${
            store.is_template
              ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20'
              : 'text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-500/20'
          }`}
        >
          {store.is_template ? <Users size={14} /> : <FlaskConical size={14} />}
        </button>
      )}

      {!store.is_template && (
        <Link 
          href={`/portal/${store.id}`}
          target="_blank"
          className="p-2 sm:p-1.5 rounded-md text-fuchsia-400 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/20 transition-all flex items-center justify-center"
          title={copy.PORTAL_TITLE}
        >
          <User size={14} />
        </Link>
      )}

      <a 
        href={`https://storefronts.alternativesolutions.io/${store.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`p-2 sm:p-1.5 rounded-md transition-all flex items-center justify-center ${
          isLive || store.is_published
            ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20' 
            : 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20'
        }`}
        title={isLive || store.is_published ? copy.LIVE_SITE_TITLE : copy.STAGING_PREVIEW_TITLE}
      >
        {isLive || store.is_published ? <Globe size={14} /> : <Eye size={14} />}
      </a>

      <Link 
        href={`/dashboard/storefronts/${store.id}`}
        className="p-2 sm:p-1.5 rounded-md text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-all flex items-center justify-center"
        title={copy.COMMAND_HUB_TITLE}
      >
        <Settings size={14} />
      </Link>
    </div>
  );

  // Shared Status / Exposure Pill helper
  const renderStatusPill = (store: any, config: any, isStrictlyActiveClient: boolean, daysInStage: number, stageBadgeText: string) => {
    if (store.is_template) {
      return (
        <button
          type="button"
          onClick={() => handleRowUpdate(store.id, 'is_published', !store.is_published)}
          title={copy.TOGGLE_PUBLIC_TITLE}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
            store.is_published
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
          }`}
        >
          {store.is_published ? <><Eye size={12} /> {copy.PUBLIC_VISIBLE}</> : <><EyeOff size={12} /> {copy.PUBLIC_HIDDEN}</>}
        </button>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${config.badgeColor}`}>
          {config.label}
        </span>

        {!isStrictlyActiveClient && (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-sans font-bold tracking-normal border ${
            daysInStage >= 7
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-zinc-900 text-zinc-300 border-zinc-800'
          }`}>
            <Clock size={11} className={daysInStage >= 7 ? 'text-amber-400' : 'text-zinc-500'} />
            <span>{stageBadgeText}</span>
          </span>
        )}
      </div>
    );
  };

  if (processedData.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800/50 bg-zinc-950/50">
        <div className="p-10 text-center flex flex-col items-center justify-center">
          <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{copy.EMPTY_QUEUE}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* MOBILE CARD STACK (<768px) — Zero Horizontal Scrolling! */}
      <div className="md:hidden space-y-2.5">
        {processedData.map((store) => {
          const rawStatus = (store.status || 'PENDING_BUILD') as string;
          const status = rawStatus as StorefrontStatus;
          const config = STOREFRONT_LIFECYCLE[status] || { label: rawStatus, badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
          const isOffline = rawStatus === 'MAINTENANCE' || rawStatus === 'HIDDEN' || rawStatus === 'CANCELED' || rawStatus === 'ON_HOLD';
          const isLive = ['ACTIVE', 'MAINTENANCE', 'HIDDEN', 'AWAITING_ASSETS', 'IN_REVIEW', 'LIVE'].includes(rawStatus);
          const isStrictlyActiveClient = !store.is_template && (rawStatus === 'ACTIVE' || rawStatus === 'LIVE');
          const rawCategory = store.industry_tag || store.category || store.industry || '';
          const { daysInStage, stageBadgeText } = getStageTiming(store);

          return (
            <div
              key={store.id}
              className={`rounded-xl border border-zinc-800/70 bg-zinc-950/80 p-3.5 flex flex-col gap-3 transition-colors ${getRowStyle(rawStatus, isOffline, !!store.is_template)}`}
            >
              {/* Top Row: Logo + Business Name on left, Action Buttons on right */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                    {store.brand_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={store.brand_logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-zinc-600 uppercase">{store.business_name?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white tracking-tight truncate">{store.business_name}</span>
                    <span className="text-[10px] font-mono text-zinc-500 truncate">/{store.slug}</span>
                  </div>
                </div>

                {renderActionButtons(store, rawStatus, isLive, isStrictlyActiveClient)}
              </div>

              {/* Bottom Row: Status + Day Pill on left, Category on right */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-800/50">
                {renderStatusPill(store, config, isStrictlyActiveClient, daysInStage, stageBadgeText)}
                <span className="text-[10px] font-medium text-zinc-400 truncate max-w-[120px]">
                  {getCategoryLabel(rawCategory)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLET & DESKTOP TABLE (>=768px) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-800/50 bg-zinc-950/50">
        <table className="w-full text-left border-collapse whitespace-nowrap select-none">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className="px-4 sm:px-6 py-4 cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('business_name')}>
                <div className="flex items-center gap-2">{copy.COL_CLIENT} {getSortIcon('business_name')}</div>
              </th>
              <th className="px-4 sm:px-6 py-4 cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('category')}>
                <div className="flex items-center gap-2">{copy.COL_CATEGORY} {getSortIcon('category')}</div>
              </th>
              {!isPrototypeView && (
                <th className="px-4 sm:px-6 py-4 hidden lg:table-cell cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('plan_tier')}>
                  <div className="flex items-center gap-2">{copy.COL_PLAN} {getSortIcon('plan_tier')}</div>
                </th>
              )}
              <th className="px-4 sm:px-6 py-4 cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('status')}>
                <div className="flex items-center gap-2">
                  {isPrototypeView ? copy.COL_PROTOTYPE_VISIBILITY : copy.COL_STATUS} {getSortIcon('status')}
                </div>
              </th>
              <th className="px-4 sm:px-6 py-4 hidden xl:table-cell cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('created_at')}>
                <div className="flex items-center gap-2">{copy.COL_TIMELINE} {getSortIcon('created_at')}</div>
              </th>
              <th className="px-4 sm:px-6 py-4 text-right">{copy.COL_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {processedData.map((store) => {
              const rawStatus = (store.status || 'PENDING_BUILD') as string;
              const status = rawStatus as StorefrontStatus;
              const config = STOREFRONT_LIFECYCLE[status] || { label: rawStatus, badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
              const isOffline = rawStatus === 'MAINTENANCE' || rawStatus === 'HIDDEN' || rawStatus === 'CANCELED' || rawStatus === 'ON_HOLD';
              const isLive = ['ACTIVE', 'MAINTENANCE', 'HIDDEN', 'AWAITING_ASSETS', 'IN_REVIEW', 'LIVE'].includes(rawStatus);
              const isStrictlyActiveClient = !store.is_template && (rawStatus === 'ACTIVE' || rawStatus === 'LIVE');

              const rawCategory = store.industry_tag || store.category || store.industry || '';
              const { daysInStage, stageBadgeText, formattedCreated, formattedStageDate } = getStageTiming(store);

              return (
                <tr key={store.id} className={`transition-colors border-b border-zinc-800/50 ${getRowStyle(rawStatus, isOffline, !!store.is_template)}`}>
                  
                  {/* 1. CLIENT / BUSINESS */}
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                        {store.brand_logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={store.brand_logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-sm text-zinc-600 uppercase">{store.business_name?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-white tracking-tight truncate max-w-[180px] lg:max-w-xs">{store.business_name}</span>
                        <span className="text-[10px] font-mono text-zinc-500 truncate mt-0.5">/{store.slug}</span>
                      </div>
                    </div>
                  </td>

                  {/* 2. FULL INDUSTRY CATEGORY */}
                  <td className="px-4 sm:px-6 py-4 text-xs font-medium text-zinc-300">
                    {getCategoryLabel(rawCategory)}
                  </td>

                  {/* 3. PLAN TIER */}
                  {!isPrototypeView && (
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <span className="text-[10px] font-black text-zinc-300 bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700/50 uppercase tracking-widest">
                        {store.plan_tier || store.selected_plan || copy.EMPTY_CELL}
                      </span>
                    </td>
                  )}

                  {/* 4. CURRENT STATUS + CLEAN DAY COUNTER */}
                  <td className="px-4 sm:px-6 py-4">
                    {renderStatusPill(store, config, isStrictlyActiveClient, daysInStage, stageBadgeText)}
                  </td>

                  {/* 5. KEY DATES */}
                  <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 text-[11px] font-sans">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{copy.STAGE_SINCE_PREFIX}</span>
                        <span className="text-zinc-200 font-semibold">{formattedStageDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-sans">
                        <span className="text-zinc-600 uppercase font-bold tracking-wider">{copy.CREATED_PREFIX}</span>
                        <span className="text-zinc-500">{formattedCreated}</span>
                      </div>
                    </div>
                  </td>

                  {/* 6. SYSTEM ACTIONS */}
                  <td className="px-4 sm:px-6 py-4 text-right">
                    {renderActionButtons(store, rawStatus, isLive, isStrictlyActiveClient)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}