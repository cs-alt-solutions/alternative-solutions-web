/* src/components/dashboard/storefronts/manager/StorefrontTable.tsx */
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowUpDown, ChevronUp, ChevronDown, Clock, AlertTriangle } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';
import StorefrontObjectiveRadar from './StorefrontObjectiveRadar';
import StorefrontActionMenu from './StorefrontActionMenu';

interface TableProps {
  processedData: any[];
  requestSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleRowUpdate: (id: string, field: string, value: any) => void;
  masterIndustries: { id: string; label: string }[];
  tasks?: any[];
  ideas?: any[];
  onOpenTaskModal?: (storeId: string, taskToEdit?: any) => void;
  isPrototypeView?: boolean;
}

const STAGE_EVENT_TYPES = new Set([
  'BUILD_INITIALIZED',
  'REVIEW_DISPATCHED',
  'APPROVED',
  'APPROVED_PENDING_BILLING',
  'PAYMENT_CLEARED',
  'BRAIN_DUMP_COMPLETED',
  'CHANGES_REQUESTED',
]);

function getPaymentAlertState(store: any): { hasIssue: boolean; label: string } {
  const billingStatus = String(
    store?.billing_status || store?.payment_status || store?.subscription_status || ''
  ).toUpperCase();

  if (['PAST_DUE', 'FAILED', 'UNPAID', 'PAYMENT_FAILED', 'DELINQUENT'].includes(billingStatus)) {
    return { hasIssue: true, label: 'Payment Issue' };
  }

  const notes = Array.isArray(store?.audit_notes) ? store.audit_notes : [];
  const hasBillingNote = notes.some((n: any) => {
    const type = String(n?.type || '').toUpperCase();
    const msg = String(n?.message || n?.note || '').toLowerCase();
    return (
      type === 'PAYMENT_FAILED' ||
      msg.includes('payment failed') ||
      msg.includes('past due') ||
      msg.includes('charge failed')
    );
  });

  return hasBillingNote ? { hasIssue: true, label: 'Payment Issue' } : { hasIssue: false, label: '' };
}

function getRowAccent(status: string, isOffline: boolean, isTemplate: boolean, hasPaymentIssue: boolean) {
  if (hasPaymentIssue) return 'bg-rose-500/[0.05] border-l-2 border-l-rose-500';
  if (isTemplate) return 'bg-fuchsia-500/[0.02] border-l-2 border-l-fuchsia-500/40';
  if (isOffline) return 'bg-zinc-900/30 border-l-2 border-l-zinc-700/60';
  switch (status) {
    case 'ACTIVE':
    case 'LIVE': return 'bg-emerald-500/[0.02] border-l-2 border-l-emerald-500/50';
    case 'IN_REVIEW': return 'bg-cyan-500/[0.02] border-l-2 border-l-cyan-500/50';
    case 'CONTENT_ASSEMBLY': return 'bg-indigo-500/[0.02] border-l-2 border-l-indigo-500/50';
    case 'BUILDING_CORE': return 'bg-fuchsia-500/[0.02] border-l-2 border-l-fuchsia-500/50';
    case 'AWAITING_ASSETS': return 'bg-violet-500/[0.02] border-l-2 border-l-violet-500/50';
    case 'ONBOARDING': return 'bg-amber-500/[0.02] border-l-2 border-l-amber-500/50';
    case 'ON_HOLD': return 'bg-rose-500/[0.02] border-l-2 border-l-rose-500/50';
    default: return 'bg-zinc-500/[0.02] border-l-2 border-l-zinc-500/50';
  }
}

export default function StorefrontTable({
  processedData,
  requestSort,
  sortConfig,
  handleRowUpdate,
  masterIndustries,
  tasks = [],
  ideas = [],
  onOpenTaskModal,
  isPrototypeView = false,
}: TableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const copy = STOREFRONT_MANAGER_COPY.TABLE;

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key !== columnKey) {
      return <ArrowUpDown size={12} className="text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={14} className="text-cyan-400 shrink-0" />
      : <ChevronDown size={14} className="text-cyan-400 shrink-0" />;
  };

  const getCategoryLabel = (rawCat: string) => {
    if (!rawCat) return copy.EMPTY_CELL;
    const match = masterIndustries.find(
      (c) => c.id.toLowerCase() === rawCat.toLowerCase() || c.label.toLowerCase() === rawCat.toLowerCase()
    );
    return match ? match.label : rawCat;
  };

  const getStageTiming = (store: any) => {
    const notes = Array.isArray(store.audit_notes) ? store.audit_notes : [];
    const stageLogs = notes.filter((n: any) => {
      if (!n?.timestamp) return false;
      const type = String(n?.type || '').toUpperCase();
      if (type === 'BUILD_NOTE' || type === 'PORTAL_REMINDER_SENT') return false;
      return Boolean(n?.toStatus || STOREFRONT_LIFECYCLE[type as StorefrontStatus] || STAGE_EVENT_TYPES.has(type));
    });

    const lastStageLog = stageLogs.length > 0 ? stageLogs[stageLogs.length - 1] : null;
    const rawStageDate = lastStageLog?.timestamp || store.updated_at || store.created_at;

    const stageDate = new Date(rawStageDate);
    const createdDate = new Date(store.created_at);
    const daysInStage = Math.max(0, Math.floor((Date.now() - stageDate.getTime()) / (1000 * 60 * 60 * 24)));
    const stageBadgeText =
      daysInStage === 0 ? copy.TODAY : daysInStage === 1 ? copy.DAY_1 : `${daysInStage}${copy.DAYS_IN_STAGE_SUFFIX}`;

    return {
      daysInStage,
      stageBadgeText,
      stageTooltip: lastStageLog?.message || 'Days elapsed since entering this stage',
      formattedCreated: createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      formattedStageDate: stageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };

  const renderStatusPill = (
    store: any,
    config: any,
    isStrictlyActiveClient: boolean,
    daysInStage: number,
    stageBadgeText: string,
    stageTooltip: string,
    paymentAlert: { hasIssue: boolean; label: string }
  ) => {
    if (store.is_template) {
      return (
        <button
          type="button"
          onClick={() => handleRowUpdate(store.id, 'is_published', !store.is_published)}
          title={copy.TOGGLE_PUBLIC_TITLE}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
            store.is_published
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          {store.is_published ? <><Eye size={10} /> {copy.PUBLIC_VISIBLE}</> : <><EyeOff size={10} /> {copy.PUBLIC_HIDDEN}</>}
        </button>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${config.badgeColor}`}>
          {config.label}
        </span>

        {paymentAlert.hasIssue && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/40">
            <AlertTriangle size={10} className="text-rose-400 shrink-0" />
            <span>{paymentAlert.label}</span>
          </span>
        )}

        {!isStrictlyActiveClient && (
          <span
            title={stageTooltip}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans font-bold tracking-normal border ${
              daysInStage >= 7
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800'
            }`}
          >
            <Clock size={10} className={daysInStage >= 7 ? 'text-amber-400' : 'text-zinc-500'} />
            <span>{stageBadgeText}</span>
          </span>
        )}
      </div>
    );
  };

  if (processedData.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800/70 bg-zinc-950/60">
        <div className="p-6 text-center flex flex-col items-center justify-center">
          <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{copy.EMPTY_QUEUE}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {openMenuId && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setOpenMenuId(null)} />}

      {/* MOBILE LIST (<768px) */}
      <div className={`md:hidden space-y-2 relative ${openMenuId ? 'z-50' : 'z-10'}`}>
        {processedData.map((store) => {
          const rawStatus = (store.status || 'PENDING_BUILD') as string;
          const config = STOREFRONT_LIFECYCLE[rawStatus as StorefrontStatus] || {
            label: rawStatus,
            badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700',
          };
          const isOffline = ['MAINTENANCE', 'HIDDEN', 'CANCELED', 'ON_HOLD'].includes(rawStatus);
          const isStrictlyActiveClient = !store.is_template && (rawStatus === 'ACTIVE' || rawStatus === 'LIVE');
          const { daysInStage, stageBadgeText, stageTooltip } = getStageTiming(store);
          const paymentAlert = getPaymentAlertState(store);
          const isMenuOpen = openMenuId === store.id;

          return (
            <div
              key={store.id}
              className={`rounded-xl border transition-all ${
                isMenuOpen ? 'border-cyan-500/50 bg-zinc-900 shadow-lg' : 'border-zinc-800/80 bg-zinc-950/90'
              } ${getRowAccent(rawStatus, isOffline, !!store.is_template, paymentAlert.hasIssue)}`}
            >
              <div className="px-3 py-2.5 flex items-start justify-between gap-3">
                <div className={`flex items-start gap-3 min-w-0 flex-1 ${isOffline ? 'opacity-60' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                    {store.brand_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={store.brand_logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-sm text-zinc-600 uppercase">{store.business_name?.charAt(0) || '?'}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-sm font-bold text-white tracking-tight truncate">{store.business_name}</span>
                    {renderStatusPill(store, config, isStrictlyActiveClient, daysInStage, stageBadgeText, stageTooltip, paymentAlert)}
                    <StorefrontObjectiveRadar store={store} tasks={tasks} ideas={ideas} onOpenTaskModal={onOpenTaskModal} compact={true} />
                  </div>
                </div>

                <StorefrontActionMenu
                  store={store}
                  isMenuOpen={isMenuOpen}
                  onToggleMenu={() => setOpenMenuId(isMenuOpen ? null : store.id)}
                  onCloseMenu={() => setOpenMenuId(null)}
                  handleRowUpdate={handleRowUpdate}
                  onOpenTaskModal={onOpenTaskModal}
                  mode="mobile-button"
                />
              </div>

              <StorefrontActionMenu
                store={store}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setOpenMenuId(isMenuOpen ? null : store.id)}
                onCloseMenu={() => setOpenMenuId(null)}
                handleRowUpdate={handleRowUpdate}
                onOpenTaskModal={onOpenTaskModal}
                mode="mobile-tray"
              />
            </div>
          );
        })}
      </div>

      {/* TABLET & DESKTOP TABLE (>=768px) */}
      <div className={`hidden md:block overflow-visible rounded-lg border border-zinc-800/80 bg-zinc-950/70 relative ${openMenuId ? 'z-50' : 'z-10'}`}>
        <table className="w-full table-fixed text-left border-collapse select-none">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <th className={`${isPrototypeView ? 'w-[30%]' : 'w-[22%]'} px-4 sm:px-6 py-3.5 cursor-pointer hover:bg-zinc-800/50 transition-colors group`} onClick={() => requestSort('business_name')}>
                <div className="flex items-center gap-2 truncate">{copy.COL_CLIENT} {getSortIcon('business_name')}</div>
              </th>
              <th className={`${isPrototypeView ? 'w-[22%]' : 'w-[15%]'} px-4 sm:px-6 py-3.5 cursor-pointer hover:bg-zinc-800/50 transition-colors group`} onClick={() => requestSort('category')}>
                <div className="flex items-center gap-2 truncate">{copy.COL_CATEGORY} {getSortIcon('category')}</div>
              </th>
              {!isPrototypeView && (
                <th className="w-[29%] px-4 sm:px-6 py-3.5">
                  <div className="flex items-center gap-2 text-cyan-400/90 truncate">{copy.COL_OBJECTIVE}</div>
                </th>
              )}
              <th className={`${isPrototypeView ? 'w-[24%]' : 'w-[16%]'} px-4 sm:px-6 py-3.5 cursor-pointer hover:bg-zinc-800/50 transition-colors group`} onClick={() => requestSort('status')}>
                <div className="flex items-center gap-2 truncate">
                  {isPrototypeView ? copy.COL_PROTOTYPE_VISIBILITY : copy.COL_STATUS} {getSortIcon('status')}
                </div>
              </th>
              <th className="w-[12%] px-4 sm:px-6 py-3.5 hidden xl:table-cell cursor-pointer hover:bg-zinc-800/50 transition-colors group" onClick={() => requestSort('created_at')}>
                <div className="flex items-center gap-2 truncate">{copy.COL_TIMELINE} {getSortIcon('created_at')}</div>
              </th>
              <th className="w-[6%] px-4 sm:px-6 py-3.5 text-right">{copy.COL_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {processedData.map((store) => {
              const rawStatus = (store.status || 'PENDING_BUILD') as string;
              const config = STOREFRONT_LIFECYCLE[rawStatus as StorefrontStatus] || {
                label: rawStatus,
                badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700',
              };
              const isOffline = ['MAINTENANCE', 'HIDDEN', 'CANCELED', 'ON_HOLD'].includes(rawStatus);
              const isStrictlyActiveClient = !store.is_template && (rawStatus === 'ACTIVE' || rawStatus === 'LIVE');
              const paymentAlert = getPaymentAlertState(store);
              const isMenuOpen = openMenuId === store.id;
              const cellDim = isOffline ? 'opacity-60' : '';

              const rawCategory = store.industry_tag || store.category || store.industry || '';
              const { daysInStage, stageBadgeText, stageTooltip, formattedCreated, formattedStageDate } = getStageTiming(store);

              return (
                <tr
                  key={store.id}
                  className={`transition-colors border-b border-zinc-800/60 relative ${
                    isMenuOpen ? 'z-50 bg-zinc-900/80' : 'z-0'
                  } ${getRowAccent(rawStatus, isOffline, !!store.is_template, paymentAlert.hasIssue)}`}
                >
                  <td className={`px-4 sm:px-6 py-3.5 truncate ${cellDim}`}>
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
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
                  </td>

                  <td className={`px-4 sm:px-6 py-3.5 text-xs font-medium text-zinc-300 truncate ${cellDim}`}>
                    {getCategoryLabel(rawCategory)}
                  </td>

                  {!isPrototypeView && (
                    <td className={`px-4 sm:px-6 py-3.5 ${cellDim}`}>
                      <StorefrontObjectiveRadar store={store} tasks={tasks} ideas={ideas} onOpenTaskModal={onOpenTaskModal} />
                    </td>
                  )}

                  <td className={`px-4 sm:px-6 py-3.5 ${cellDim}`}>
                    {renderStatusPill(store, config, isStrictlyActiveClient, daysInStage, stageBadgeText, stageTooltip, paymentAlert)}
                  </td>

                  <td className={`px-4 sm:px-6 py-3.5 hidden xl:table-cell ${cellDim}`}>
                    <div className="flex flex-col gap-0.5 truncate">
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

                  {/* Actions cell never receives opacity dimming */}
                  <td className="px-4 sm:px-6 py-3.5 text-right">
                    <StorefrontActionMenu
                      store={store}
                      isMenuOpen={isMenuOpen}
                      onToggleMenu={() => setOpenMenuId(isMenuOpen ? null : store.id)}
                      onCloseMenu={() => setOpenMenuId(null)}
                      handleRowUpdate={handleRowUpdate}
                      onOpenTaskModal={onOpenTaskModal}
                      mode="desktop-popover"
                    />
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