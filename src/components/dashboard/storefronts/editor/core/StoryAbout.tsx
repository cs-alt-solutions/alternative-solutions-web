/* src/components/dashboard/storefronts/editor/core/StoryAbout.tsx */
import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Youtube,
  Sparkles,
  RefreshCw,
  LayoutTemplate,
} from 'lucide-react';
import { ALT_SOLUTIONS_HQ } from '@/config/agency';
import EditorAccordion from '../shared/EditorAccordion';
import { AboutSelector } from './VisualArchitecture/LayoutSelectors';
import { EDITOR_WORKSPACE_COPY, THEME_CONSTRAINTS } from '@/config/dashboard/editor';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', icon: Instagram, placeholder: 'instagram' },
  { id: 'facebook', icon: Facebook, placeholder: 'facebook' },
  { id: 'twitter', icon: Twitter, placeholder: 'x / twitter' },
  { id: 'linkedin', icon: Linkedin, placeholder: 'linkedin' },
  { id: 'youtube', icon: Youtube, placeholder: 'youtube' },
  { id: 'telegram', icon: Send, placeholder: 'telegram' },
];

export default function StoryAbout({
  formData,
  handleChange,
  setFormData,
  allowedLayouts,
  isClientPortal = false,
}: {
  formData: any;
  handleChange: any;
  setFormData: any;
  allowedLayouts?: any;
  isClientPortal?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.CONTENT_TAB;
  const safeLayouts =
    allowedLayouts || THEME_CONSTRAINTS[formData.theme_style || 'industrial'] || THEME_CONSTRAINTS['industrial'];

  useEffect(() => {
    if (formData.is_template) {
      setFormData((prev: any) => {
        const currentSocials = prev.social_links || {};
        const needsInjection = Object.entries(ALT_SOLUTIONS_HQ).some(
          ([key]) => !currentSocials[key] || currentSocials[key] === ''
        );
        if (needsInjection) {
          return { ...prev, social_links: { ...ALT_SOLUTIONS_HQ, ...currentSocials } };
        }
        return prev;
      });
    }
  }, [formData.is_template, setFormData]);

  const handleSocialChange = (platformId: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), [platformId]: value } }));
  };

  const forceSyncHQ = () => {
    setFormData((prev: any) => ({ ...prev, social_links: { ...(prev.social_links || {}), ...ALT_SOLUTIONS_HQ } }));
  };

  const storyFields = [formData.about_heading, formData.about_bio];
  const socialsFilled = Object.values(formData.social_links || {}).filter((v) => v !== '').length > 0 ? 1 : 0;
  const progress = Math.round(((storyFields.filter((f) => f && f.trim() !== '').length + socialsFilled) / 3) * 100);

  return (
    <EditorAccordion
      title={copy.STORY_ACCORDION}
      icon={BookOpen}
      accentColor="rose"
      progress={progress}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-3">
        {!isClientPortal && (
          <div className="pb-3.5 border-b border-zinc-800/70 space-y-2.5">
            <div className="flex items-center gap-1.5 text-rose-400">
              <LayoutTemplate size={11} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {copy.STORY_LAYOUT_SUBHEADING}
              </span>
            </div>
            <AboutSelector formData={formData} setFormData={setFormData} allowedLayouts={safeLayouts} />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
            {copy.ABOUT_HEADING_LABEL}
          </label>
          <input
            type="text"
            name="about_heading"
            value={formData.about_heading || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white focus:border-rose-500 outline-none transition-all text-xs placeholder:text-zinc-700"
            placeholder={copy.ABOUT_HEADING_PLACEHOLDER}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
            {copy.ABOUT_BIO_LABEL}
          </label>
          <textarea
            name="about_bio"
            value={formData.about_bio || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950 px-2.5 py-2 rounded-md border border-zinc-800 text-white h-24 resize-none focus:border-rose-500 outline-none transition-all text-xs leading-relaxed placeholder:text-zinc-700"
            placeholder={copy.ABOUT_BIO_PLACEHOLDER}
          />
        </div>

        <div className="pt-3 border-t border-zinc-800/60 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              {copy.SOCIALS_HEADING}
            </h4>

            {formData.is_template && (
              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md w-fit">
                <Sparkles size={10} className="text-rose-400 shrink-0" />
                <span className="text-[8px] font-black uppercase tracking-widest text-rose-300">
                  {copy.HQ_ROUTING_BADGE}
                </span>
                <button
                  type="button"
                  onClick={forceSyncHQ}
                  className="p-0.5 rounded hover:bg-rose-500/20 text-rose-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw size={10} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SOCIAL_PLATFORMS.map((p) => {
              const val = formData.social_links?.[p.id] || '';
              const isHQLink = val && Object.values(ALT_SOLUTIONS_HQ).includes(val);

              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-zinc-950 border transition-all ${
                    isHQLink
                      ? 'border-rose-500/40 bg-rose-500/5'
                      : val
                        ? 'border-emerald-500/40'
                        : 'border-zinc-800'
                  }`}
                >
                  <p.icon
                    size={13}
                    className={`shrink-0 ${
                      isHQLink ? 'text-rose-400' : val ? 'text-emerald-400' : 'text-zinc-600'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder={p.placeholder}
                    value={val}
                    onChange={(e) => handleSocialChange(p.id, e.target.value)}
                    className={`w-full min-w-0 bg-transparent text-[11px] outline-none font-mono placeholder:text-zinc-700 ${
                      isHQLink ? 'text-rose-200 font-bold' : 'text-white'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </EditorAccordion>
  );
}