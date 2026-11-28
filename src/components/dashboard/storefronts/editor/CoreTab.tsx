/* src/components/dashboard/storefronts/editor/CoreTab.tsx */
/* Architecture Note: Renders the "Content" Tab with 3-Pill Sub-Navigation (Hero, Story, Leads & Contact) */
'use client';

import React, { useState } from 'react';
import { Type, BookOpen, MessageSquareText } from 'lucide-react';
import HeroContent from './core/HeroContent';
import StoryAbout from './core/StoryAbout';
import LeadCapture from './core/LeadCapture';
import { EDITOR_WORKSPACE_COPY, THEME_CONSTRAINTS } from '@/config/dashboard/editor';

type ContentSubTab = 'hero' | 'story' | 'leads';

export default function CoreTab({
  formData,
  setFormData,
  isClientPortal = false,
}: {
  formData: any;
  setFormData: any;
  onReload?: () => void;
  isClientPortal?: boolean;
}) {
  const [activeSubTab, setActiveSubTab] = useState<ContentSubTab>('hero');
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subTabs: {
    id: ContentSubTab;
    label: string;
    icon: React.ElementType;
    activeClass: string;
  }[] = [
    {
      id: 'hero',
      label: copy.SUB_TABS.HERO,
      icon: Type,
      activeClass: 'bg-amber-500/15 border-amber-500/50 text-amber-300',
    },
    {
      id: 'story',
      label: copy.SUB_TABS.STORY,
      icon: BookOpen,
      activeClass: 'bg-rose-500/15 border-rose-500/50 text-rose-300',
    },
    {
      id: 'leads',
      label: copy.SUB_TABS.LEADS,
      icon: MessageSquareText,
      activeClass: 'bg-fuchsia-500/15 border-fuchsia-500/50 text-fuchsia-300',
    },
  ];

  return (
    <div className="space-y-3 animate-in fade-in duration-300 pb-12 pt-3">
      {/* 3-PILL SUB-NAV BAR */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800/90 sticky top-0 z-20">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                isActive
                  ? tab.activeClass
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/70'
              }`}
            >
              <Icon size={12} className="shrink-0" />
              <span className="whitespace-nowrap leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ISOLATED ACTIVE WORKSPACE */}
      <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/70 animate-in fade-in duration-200">
        {activeSubTab === 'hero' && (
          <HeroContent
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            allowedLayouts={allowedLayouts}
            isClientPortal={isClientPortal}
            embedded={true}
          />
        )}

        {activeSubTab === 'story' && (
          <StoryAbout
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            allowedLayouts={allowedLayouts}
            isClientPortal={isClientPortal}
            embedded={true}
          />
        )}

        {activeSubTab === 'leads' && (
          <LeadCapture
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            embedded={true}
          />
        )}
      </div>
    </div>
  );
}