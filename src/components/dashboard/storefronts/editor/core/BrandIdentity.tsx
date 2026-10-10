// src/components/dashboard/storefronts/editor/core/BrandIdentity.tsx
import React, { useState } from 'react';
import { Store, Link as LinkIcon, Mail, Tag, MessageSquareText, MapPin, Utensils, Unplug, ChevronDown, HelpCircle } from 'lucide-react';
import { STOREFRONT_EDITOR_COPY } from '@/config/dashboard';
import EditorAccordion from '../shared/EditorAccordion';

const STANDARD_INQUIRY_TYPES = ["General Inquiry", "Request a Quote", "Job Application / Hiring", "Other"];

// 🚀 NEW: Reusable Tooltip Label Component for Brand Identity
const TooltipLabel = ({ label, icon: Icon, tooltip, iconColor = "text-zinc-500", tooltipColor = "text-zinc-300" }: any) => (
  <div className="flex items-center gap-1.5 relative group w-fit mb-1.5">
    {Icon && <Icon size={10} className={iconColor} />}
    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">{label}</label>
    {tooltip && <HelpCircle size={12} className="text-zinc-600 hover:text-white cursor-help transition-colors ml-1" />}
    
    {tooltip && (
      <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none`}>
        <p className={`text-[10px] ${tooltipColor} normal-case tracking-normal font-medium leading-relaxed`}>
          {tooltip}
        </p>
      </div>
    )}
  </div>
);

export default function BrandIdentity({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  const [openSection, setOpenSection] = useState<'core' | 'integrations' | 'lead' | null>(null);

  const toggleSection = (section: 'core' | 'integrations' | 'lead') => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const selectedInquiries = formData.lead_inquiry_types || ["General Inquiry", "Request a Quote"];
  const isCulinary = formData.industry_tag === 'Culinary';

  const toggleInquiryType = (type: string) => {
    let updated = [...selectedInquiries];
    if (updated.includes(type)) updated = updated.filter((t: string) => t !== type);
    else updated.push(type);
    setFormData((prev: any) => ({ ...prev, lead_inquiry_types: updated }));
  };

  const getCoreProgress = () => {
    const fields = [formData.business_name, formData.slug, formData.contact_email];
    return Math.round((((fields.filter(f => f && f.trim() !== '').length) + 1) / 4) * 100);
  };

  const getIntegrationsProgress = () => {
    let fields = [formData.map_embed_url];
    if (isCulinary) fields.push(formData.ordering_url);
    return Math.round((fields.filter(f => f && f.trim() !== '').length / fields.length) * 100);
  };

  const getLeadProgress = () => selectedInquiries.length > 0 ? 100 : 0;

  return (
    <div className="space-y-4">
      <EditorAccordion title="Core Identity" icon={Store} accentColor="cyan" progress={getCoreProgress()} isOpen={openSection === 'core'} onToggle={() => toggleSection('core')}>
        <div className="flex flex-col gap-4">
          <div>
            <TooltipLabel label="Business Name" />
            <input name="business_name" value={formData.business_name || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. Blaze & Bloom" />
          </div>
          <div>
            <TooltipLabel label="Routing Slug" icon={LinkIcon} iconColor="text-cyan-500/70" />
            <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-cyan-400 font-mono text-xs outline-none focus:border-cyan-500 transition-colors" />
          </div>
          <div>
            <TooltipLabel label="Public Email" icon={Mail} iconColor="text-cyan-500/70" />
            <input name="contact_email" value={formData.contact_email || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors" placeholder="hello@example.com" />
          </div>
          <div>
            <TooltipLabel label="Industry Category" icon={Tag} iconColor="text-cyan-500/70" />
            <select name="industry_tag" value={formData.industry_tag || 'General'} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer">
              {STOREFRONT_EDITOR_COPY.INDUSTRIES.map((category: any) => (
                <option key={category.id} value={category.id} className="bg-zinc-900 text-white">{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </EditorAccordion>

      <EditorAccordion title="Integrations" icon={Unplug} accentColor="emerald" progress={getIntegrationsProgress()} isOpen={openSection === 'integrations'} onToggle={() => toggleSection('integrations')}>
        <div className="flex flex-col gap-4">
          <div>
            <TooltipLabel label="Google Maps Embed" icon={MapPin} iconColor="text-emerald-500/70" tooltip="Leave blank if you operate remotely or don't have a public headquarters." tooltipColor="text-emerald-400" />
            <input name="map_embed_url" value={formData.map_embed_url || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700" placeholder='Paste <iframe src="..."> here' />
          </div>
          {isCulinary && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <TooltipLabel label="Online Ordering URL" icon={Utensils} iconColor="text-emerald-500/70" tooltip="If provided, an 'Order Online' button will display on the storefront to funnel customers directly to external checkout." tooltipColor="text-emerald-400" />
              <input name="ordering_url" value={formData.ordering_url || ''} onChange={handleChange} className="w-full bg-zinc-950 px-3 py-2.5 rounded-lg border border-zinc-800 text-white text-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700" placeholder="https://order.toasttab.com/..." />
            </div>
          )}
        </div>
      </EditorAccordion>

      <EditorAccordion title="Lead Capture" icon={MessageSquareText} accentColor="fuchsia" progress={getLeadProgress()} isOpen={openSection === 'lead'} onToggle={() => toggleSection('lead')}>
        <div>
          <TooltipLabel label="Form Routing Options" tooltip="Select the options you want to appear in this storefront's lead capture modal dropdown." tooltipColor="text-fuchsia-400" />
          <div className="flex flex-col gap-2 mt-2">
            {STANDARD_INQUIRY_TYPES.map(type => {
              const isChecked = selectedInquiries.includes(type);
              return (
                <label key={type} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border ${isChecked ? 'bg-fuchsia-500/10 border-fuchsia-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${isChecked ? 'bg-fuchsia-500 border-fuchsia-500' : 'bg-black border-zinc-600'}`}>
                    {isChecked && <div className="w-1.5 h-1.5 bg-black rounded-sm" />}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isChecked ? 'text-fuchsia-400' : 'text-zinc-400'}`}>{type}</span>
                </label>
              );
            })}
          </div>
        </div>
      </EditorAccordion>
    </div>
  );
}