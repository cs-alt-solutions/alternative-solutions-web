/* src/components/dashboard/storefronts/manager/StorefrontActionMenu.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Globe, Eye, User, Mail, Loader2, 
  CheckCircle2, FlaskConical, Users, MoreVertical, X, ListPlus, ArrowUpRight 
} from 'lucide-react';
import { sendPortalNudge } from '@/app/actions/storefront_applications';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

interface ActionMenuProps {
  store: any;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  handleRowUpdate: (id: string, field: string, value: any) => void;
  onOpenTaskModal?: (storeId: string, taskToEdit?: any) => void;
  mode: 'mobile-button' | 'mobile-tray' | 'desktop-popover';
}

export default function StorefrontActionMenu({
  store,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  handleRowUpdate,
  onOpenTaskModal,
  mode
}: ActionMenuProps) {
  const [isNudging, setIsNudging] = useState(false);
  const [nudgeSuccess, setNudgeSuccess] = useState(false);
  const copy = STOREFRONT_MANAGER_COPY.TABLE;

  const rawStatus = (store.status || 'PENDING_BUILD') as string;
  const isLive = ['ACTIVE', 'MAINTENANCE', 'HIDDEN', 'AWAITING_ASSETS', 'IN_REVIEW', 'LIVE'].includes(rawStatus);
  const isStrictlyActiveClient = !store.is_template && (rawStatus === 'ACTIVE' || rawStatus === 'LIVE');

  const handleNudgeClient = async () => {
    if (!window.confirm(`${copy.NUDGE_CONFIRM_PREFIX} ${store.contact_email}?`)) return;
    setIsNudging(true);
    try {
      const result = await sendPortalNudge(store.id, store.contact_email, store.business_name);
      if (result.success) {
        setNudgeSuccess(true);
        setTimeout(() => {
          setNudgeSuccess(false);
          onCloseMenu();
        }, 1500);
      } else {
        alert(result.error || copy.NUDGE_ERROR);
      }
    } catch {
      alert(copy.NUDGE_SYS_ERROR);
    } finally {
      setIsNudging(false);
    }
  };

  const handleTogglePrototype = () => {
    const nextIsTemplate = !store.is_template;
    const msg = nextIsTemplate ? copy.CONVERT_CONFIRM_PROTOTYPE : copy.CONVERT_CONFIRM_CLIENT;
    onCloseMenu();
    if (!window.confirm(msg)) return;
    handleRowUpdate(store.id, 'is_template', nextIsTemplate);
  };

  const handleSetObjective = () => {
    onCloseMenu();
    if (onOpenTaskModal) onOpenTaskModal(store.id, null);
  };

  if (mode === 'mobile-button') {
    return (
      <button
        type="button"
        onClick={onToggleMenu}
        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 opacity-100 ${
          isMenuOpen
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
            : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white'
        }`}
        title={copy.MORE_ACTIONS_TITLE}
      >
        {isMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
      </button>
    );
  }

  if (mode === 'mobile-tray') {
    if (!isMenuOpen) return null;
    return (
      <div className="px-3 pb-3 pt-2.5 border-t border-zinc-800 bg-zinc-950 opacity-100 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150 rounded-b-xl">
        <Link
          href={`/dashboard/storefronts/${store.id}`}
          onClick={onCloseMenu}
          className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-violet-400 text-white text-[10px] font-black uppercase tracking-wider"
        >
          <span className="w-6 h-6 rounded-md bg-violet-500/20 border border-violet-400/30 text-violet-300 flex items-center justify-center shrink-0">
            <Settings size={13} />
          </span>
          <span className="truncate">Command Hub</span>
        </Link>

        {!store.is_template && onOpenTaskModal && (
          <button
            type="button"
            onClick={handleSetObjective}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-cyan-400 text-white text-[10px] font-black uppercase tracking-wider cursor-pointer text-left"
          >
            <span className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
              <ListPlus size={13} />
            </span>
            <span className="truncate">Objective</span>
          </button>
        )}

        <a
          href={`https://storefronts.alternativesolutions.io/${store.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCloseMenu}
          className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-emerald-400 text-white text-[10px] font-black uppercase tracking-wider"
        >
          <span className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${
            isLive || store.is_published
              ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
              : 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
          }`}>
            {isLive || store.is_published ? <Globe size={13} /> : <Eye size={13} />}
          </span>
          <span className="truncate">{isLive || store.is_published ? 'Live Site' : 'Preview'}</span>
        </a>

        {!store.is_template && (
          <Link
            href={`/portal/${store.id}`}
            target="_blank"
            onClick={onCloseMenu}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-fuchsia-400 text-white text-[10px] font-black uppercase tracking-wider"
          >
            <span className="w-6 h-6 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center shrink-0">
              <User size={13} />
            </span>
            <span className="truncate">Portal</span>
          </Link>
        )}

        {rawStatus === 'ONBOARDING' && !store.is_template && (
          <button
            type="button"
            onClick={handleNudgeClient}
            disabled={isNudging || nudgeSuccess}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-amber-400 text-white text-[10px] font-black uppercase tracking-wider cursor-pointer text-left"
          >
            <span className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
              {isNudging ? <Loader2 size={13} className="animate-spin" /> : nudgeSuccess ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Mail size={13} />}
            </span>
            <span className="truncate">{nudgeSuccess ? 'Sent' : 'Nudge'}</span>
          </button>
        )}

        {!isStrictlyActiveClient && (
          <button
            type="button"
            onClick={handleTogglePrototype}
            className="col-span-2 flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-900 border border-fuchsia-500/40 hover:border-fuchsia-400 text-white text-[10px] font-black uppercase tracking-wider cursor-pointer"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center shrink-0">
                {store.is_template ? <Users size={13} /> : <FlaskConical size={13} />}
              </span>
              <span className="truncate">{store.is_template ? 'To Clients' : 'To Prototypes'}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-200 text-[8px] font-mono shrink-0">
              MOVE <ArrowUpRight size={10} />
            </span>
          </button>
        )}
      </div>
    );
  }

  // Desktop Popover Menu — Solid opaque card with visual icon badges & clear MOVE tag
  return (
    <div className="relative inline-block text-left opacity-100">
      <button
        type="button"
        onClick={onToggleMenu}
        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center opacity-100 ${
          isMenuOpen
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
            : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-500'
        }`}
        title={copy.MORE_ACTIONS_TITLE}
      >
        {isMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-bg-app opacity-100 border border-zinc-700 rounded-xl shadow-[0_14px_45px_rgba(0,0,0,0.98)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left space-y-1">
          <Link
            href={`/dashboard/storefronts/${store.id}`}
            onClick={onCloseMenu}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-white bg-zinc-900/90 hover:bg-violet-500/20 border border-zinc-800/80 hover:border-violet-400/50 transition-all"
          >
            <span className="w-6 h-6 rounded-md bg-violet-500/20 border border-violet-400/30 text-violet-300 flex items-center justify-center shrink-0">
              <Settings size={13} />
            </span>
            <span>Command Hub</span>
          </Link>

          {!store.is_template && onOpenTaskModal && (
            <button
              type="button"
              onClick={handleSetObjective}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-white bg-zinc-900/90 hover:bg-cyan-500/20 border border-zinc-800/80 hover:border-cyan-400/50 transition-all cursor-pointer text-left"
            >
              <span className="w-6 h-6 rounded-md bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
                <ListPlus size={13} />
              </span>
              <span>Set Objective</span>
            </button>
          )}

          <a
            href={`https://storefronts.alternativesolutions.io/${store.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCloseMenu}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-white bg-zinc-900/90 hover:bg-emerald-500/20 border border-zinc-800/80 hover:border-emerald-400/50 transition-all"
          >
            <span className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${
              isLive || store.is_published
                ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                : 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
            }`}>
              {isLive || store.is_published ? <Globe size={13} /> : <Eye size={13} />}
            </span>
            <span>{isLive || store.is_published ? 'Live Site' : 'Preview'}</span>
          </a>

          {!store.is_template && (
            <Link
              href={`/portal/${store.id}`}
              target="_blank"
              onClick={onCloseMenu}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-white bg-zinc-900/90 hover:bg-fuchsia-500/20 border border-zinc-800/80 hover:border-fuchsia-400/50 transition-all"
            >
              <span className="w-6 h-6 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center shrink-0">
                <User size={13} />
              </span>
              <span>Client Portal</span>
            </Link>
          )}

          {rawStatus === 'ONBOARDING' && !store.is_template && (
            <button
              type="button"
              onClick={handleNudgeClient}
              disabled={isNudging || nudgeSuccess}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-white bg-zinc-900/90 hover:bg-amber-500/20 border border-zinc-800/80 hover:border-amber-400/50 transition-all cursor-pointer text-left"
            >
              <span className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
                {isNudging ? <Loader2 size={13} className="animate-spin" /> : nudgeSuccess ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Mail size={13} />}
              </span>
              <span>{nudgeSuccess ? 'Sent' : 'Login Nudge'}</span>
            </button>
          )}

          {!isStrictlyActiveClient && (
            <div className="pt-1 mt-1 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleTogglePrototype}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold text-white bg-zinc-900 hover:bg-fuchsia-500/20 border border-fuchsia-500/40 hover:border-fuchsia-400 transition-all cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-300 flex items-center justify-center shrink-0">
                    {store.is_template ? <Users size={13} /> : <FlaskConical size={13} />}
                  </span>
                  <span className="truncate">{store.is_template ? 'Clients' : 'Prototypes'}</span>
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-fuchsia-500/25 text-fuchsia-200 text-[9px] font-mono font-black shrink-0">
                  MOVE <ArrowUpRight size={10} />
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}