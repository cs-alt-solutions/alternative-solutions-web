/* src/config/dashboard/editor/themes.ts */

export const THEME_FAMILIES = [
  { id: 'industrial', label: 'Industrial', default: 'industrial', dark: 'industrial', light: 'industrial-light', vibe: 'bg-zinc-950 border-cyan-500 text-cyan-400 font-mono uppercase' },
  { id: 'neo', label: 'Neo-Brutalist', default: 'neo', dark: 'neo-dark', light: 'neo', vibe: 'bg-yellow-400 border-2 border-black text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' },
  { id: 'cyberpunk', label: 'Cyberpunk', default: 'cyberpunk', dark: 'cyberpunk', light: 'cyberpunk-light', vibe: 'bg-black border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] text-fuchsia-400 font-mono' },
  { id: 'minimal', label: 'Minimalist', default: 'minimal', dark: null, light: 'minimal', vibe: 'bg-white border-zinc-200 text-zinc-900 font-sans tracking-tight' },
  { id: 'elegant', label: 'Elegant', default: 'elegant', dark: null, light: 'elegant', vibe: 'bg-[#FAFAFA] border border-amber-700/30 text-amber-900 font-serif' },
  { id: 'organic', label: 'Organic', default: 'organic', dark: null, light: 'organic', vibe: 'bg-[#F4F1EA] border border-[#2C3B2D] text-[#2C3B2D] font-serif rounded-tl-xl rounded-br-xl' },
  { id: 'editorial', label: 'Editorial', default: 'editorial', dark: null, light: 'editorial', vibe: 'bg-[#EAE8E3] border-y-2 border-black text-black font-serif font-bold uppercase tracking-widest' },
  { id: 'midnight', label: 'Midnight Onyx', default: 'midnight', dark: 'midnight', light: null, vibe: 'bg-zinc-950 border-zinc-800 text-white font-sans tracking-tight shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' },
  { id: 'noir', label: 'Gilded Noir', default: 'noir', dark: 'noir', light: null, vibe: 'bg-[#0B0A09] border border-amber-500/40 text-[#F3EFE6] font-serif tracking-wide' },
];

export const BRAND_COLORS = [
  { name: 'Cyan', value: 'cyan-500', twBg: 'bg-cyan-500' },
  { name: 'Fuchsia', value: 'fuchsia-500', twBg: 'bg-fuchsia-500' },
  { name: 'Emerald', value: 'emerald-500', twBg: 'bg-emerald-500' },
  { name: 'Amber', value: 'amber-500', twBg: 'bg-amber-500' },
  { name: 'Rose', value: 'rose-500', twBg: 'bg-rose-500' },
  { name: 'Indigo', value: 'indigo-500', twBg: 'bg-indigo-500' },
  { name: 'Zinc', value: 'zinc-500', twBg: 'bg-zinc-500' },
];

export const MASTHEAD_FONTS = [
  { id: 'default', label: 'Theme Default' },
  { id: 'gothic', label: 'Old English' },
  { id: 'pirata', label: 'Tattoo Gothic' },
  { id: 'grenze', label: 'Dark Editorial' },
  { id: 'cinzel', label: 'Engraved' },
];

export const ALL_HEROS = [
  'center',
  'split-left',
  'split-right',
  'cinematic',
  'glass',
  'editorial-frame',
  'arch-spotlight',
  'bento-hero',
  'bottom-dock',
  'top-dock',
  'minimal-type',
  'masthead',
  'masthead--gothic',
  'masthead--pirata',
  'masthead--grenze',
  'masthead--cinzel',
  'masthead-wash',
  'masthead-wash--gothic',
  'masthead-wash--pirata',
  'masthead-wash--grenze',
  'masthead-wash--cinzel',
];

export const ALL_CONTENTS = ['classic', 'bento', 'sticky', 'accordion', 'editorial', 'menu', 'lookbook', 'hub'];

export const ALL_ABOUTS = [
  'split',
  'editorial',
  'minimal',
  'card',
  'manifesto',
  'wash',
  'plaque',
  'portrait',
];

export const THEME_CONSTRAINTS: Record<string, { hero: string[]; content: string[]; about: string[] }> = {
  industrial: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  'industrial-light': { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  neo: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  'neo-dark': { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  cyberpunk: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  'cyberpunk-light': { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  minimal: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  elegant: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  organic: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  editorial: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  midnight: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
  noir: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS },
};

export const VISUAL_ARCH_COPY = {
  ACCORDIONS: {
    VIBE: 'Foundation Vibe',
    HERO: 'Hero Structure & Content',
    CONTENT: 'Content Flow Layout',
    STORY: 'Story & About Section',
    COLORS: 'Brand Color Mapping',
  },
  VIBE: {
    MODE: 'Color Mode',
    LIGHT: 'Light',
    DARK: 'Dark',
  },
  COLORS: {
    PRIMARY: 'Primary Brand Accent',
    SECONDARY: 'Secondary Accent',
    PRESET: 'Preset Token',
    CUSTOM_HEX: 'Custom Hex',
    HEX_PLACEHOLDER: 'HEX CODE',
    PICK_TITLE: 'Pick a custom color',
  },
  LAYOUTS: {
    LOCK_BG: 'Lock Hero Background',
    LOCK_BG_TITLE: 'Lock the background image in place on scroll',
    ADVANCED_SHOW: 'Show Advanced Layouts',
    ADVANCED_HIDE: 'Hide Advanced Layouts',
    MASTHEAD_BACKDROP: 'Masthead Backdrop',
    MASTHEAD_PURE: 'Pure Wall',
    MASTHEAD_WASH: 'Faint Wash',
    MASTHEAD_FONT: 'Display Lettering',
    LABELS: {
      CENTERED: 'Centered Focus',
      SPLIT_LEFT: 'Bold Left Split',
      SPLIT_RIGHT: 'Bold Right Split',
      CINEMATIC: 'Full Cinematic',
      GLASS: 'Frosted Glass',
      EDITORIAL_FRAME: 'Editorial Frame',
      ARCH_SPOTLIGHT: 'Arch Spotlight',
      BENTO_HERO: 'Bento Collage',
      BOTTOM_DOCK: 'Bottom Dock',
      TOP_DOCK: 'Top Dock',
      MINIMAL_TYPE: 'Kinetic Type',
      MASTHEAD: 'Brand Masthead',
      CLASSIC_SPLIT: 'Classic Split',
      EDITORIAL: 'Editorial Overlap',
      MINIMAL: 'Clean Minimal',
      GLASS_CARD: 'Glass Card',
      MANIFESTO: 'Gallery Manifesto',
      WASH: 'Atmospheric Wash',
      PLAQUE: 'Framed Plaque',
      PORTRAIT: 'Gallery Portrait',
      STACKED: 'Standard Stack',
      BENTO: 'Bento Grid',
      STICKY: 'Sticky Scroll',
      ACCORDION: 'Accordion Flow',
      MENU: 'Culinary Menu',
      LOOKBOOK: 'Lookbook Grid',
      HUB: 'Department Hub',
    },
  },
};