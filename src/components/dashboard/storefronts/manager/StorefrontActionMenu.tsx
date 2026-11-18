/* src/components/dashboard/storefronts/manager/StorefrontActionMenu.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, Globe, Eye, User, Mail, Loader2, 
  CheckCircle2, FlaskConical, Users, MoreVertical, X 
} from 'lucide-react';
import { sendPortalNudge } from '@/app/actions/storefront_applications';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

interface ActionMenuProps {
  store: any;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  handleRowUpdate: (id: string, field: string, value: any) => void;
  mode: 'mobile-button' | 'mobile-tray' | 'desktop-popover';
}

export default function StorefrontActionMenu({
  store,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  handleRowUpdate,
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

  // 1. Mobile Toggle Button Only
  if (mode === 'mobile-button') {
    return (
      <button
        type="button"
        onClick={onToggleMenu}
        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
          isMenuOpen
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
        }`}
        title={copy.MORE_ACTIONS_TITLE}
      >
        {isMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
      </button>
    );
  }

  // 2. Mobile Inline Action Tray
  if (mode === 'mobile-tray') {
    if (!isMenuOpen) return null;
    return (
      <div className="px-3 pb-3 pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
        <Link
          href={`/dashboard/storefronts/${store.id}`}
          onClick={onCloseMenu}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[10px] font-black uppercase tracking-wider"
        >
          <Settings size={13} className="shrink-0" />
          <span className="truncate">{copy.COMMAND_HUB_TITLE}</span>
        </Link>

        <a
          href={`https://storefronts.alternativesolutions.io/${store.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCloseMenu}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-[10px] font-black uppercase tracking-wider ${
            isLive || store.is_published
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
          }`}
        >
          {isLive || store.is_published ? <Globe size={13} className="shrink-0" /> : <Eye size={13} className="shrink-0" />}
          <span className="truncate">{isLive || store.is_published ? copy.LIVE_SITE_TITLE : copy.STAGING_PREVIEW_TITLE}</span>
        </a>

        {!store.is_template && (
          <Link
            href={`/portal/${store.id}`}
            target="_blank"
            onClick={onCloseMenu}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-black uppercase tracking-wider"
          >
            <User size={13} className="shrink-0" />
            <span className="truncate">{copy.PORTAL_TITLE}</span>
          </Link>
        )}

        {rawStatus === 'ONBOARDING' && !store.is_template && (
          <button
            type="button"
            onClick={handleNudgeClient}
            disabled={isNudging || nudgeSuccess}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider cursor-pointer"
          >
            {isNudging ? <Loader2 size={13} className="animate-spin shrink-0" /> : nudgeSuccess ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> : <Mail size={13} className="shrink-0" />}
            <span className="truncate">{nudgeSuccess ? copy.NUDGE_SENT : copy.NUDGE_TITLE}</span>
          </button>
        )}

        {!isStrictlyActiveClient && (
          <button
            type="button"
            onClick={handleTogglePrototype}
            className="col-span-2 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            {store.is_template ? <Users size={13} className="text-amber-400 shrink-0" /> : <FlaskConical size={13} className="text-fuchsia-400 shrink-0" />}
            <span className="truncate">{store.is_template ? copy.CONVERT_TO_CLIENT_TITLE : copy.CONVERT_TO_PROTOTYPE_TITLE}</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Desktop Popover Menu
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={onToggleMenu}
        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
          isMenuOpen
            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
        title={copy.MORE_ACTIONS_TITLE}
      >
        {isMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-zinc-950 border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
          <Link
            href={`/dashboard/storefronts/${store.id}`}
            onClick={onCloseMenu}
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-violet-500/15 hover:text-violet-300 transition-colors"
          >
            <Settings size={14} className="text-violet-400 shrink-0" />
            <span>{copy.COMMAND_HUB_TITLE}</span>
          </Link>

          <a
            href={`https://storefronts.alternativesolutions.io/${store.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCloseMenu}
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-zinc-200 hover:bg-cyan-500/15 hover:text-cyan-300 transition-colors"
          >
            {isLive || store.is_published ? <Globe size={14} className="text-emerald-400 shrink-0" /> : <Eye size={14} className="text-cyan-400 shrink-0" />}
            <span>{isLive || store.is_published ? copy.LIVE_SITE_TITLE : copy.STAGING_PREVIEW_TITLE}</span>
          </a>

          {!store.is_template && (
            <Link
              href={`/portal/${store.id}`}
              target="_blank"
              onClick={onCloseMenu}
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-zinc-200 hover:bg-fuchsia-500/15 hover:text-fuchsia-300 transition-colors"
            >
              <User size={14} className="text-fuchsia-400 shrink-0" />
              <span>{copy.PORTAL_TITLE}</span>
            </Link>
          )}

          {rawStatus === 'ONBOARDING' && !store.is_template && (
            <button
              type="button"
              onClick={handleNudgeClient}
              disabled={isNudging || nudgeSuccess}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/15 transition-colors cursor-pointer text-left"
            >
              {isNudging ? <Loader2 size={14} className="animate-spin shrink-0" /> : nudgeSuccess ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <Mail size={14} className="shrink-0" />}
              <span>{nudgeSuccess ? copy.NUDGE_SENT : copy.NUDGE_TITLE}</span>
            </button>
          )}

          {!isStrictlyActiveClient && (
            <div className="border-t border-zinc-800/80 mt-1 pt-1">
              <button
                type="button"
                onClick={handleTogglePrototype}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer text-left"
              >
                {store.is_template ? <Users size={14} className="text-amber-400 shrink-0" /> : <FlaskConical size={14} className="text-fuchsia-400 shrink-0" />}
                <span>{store.is_template ? copy.CONVERT_TO_CLIENT_TITLE : copy.CONVERT_TO_PROTOTYPE_TITLE}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}