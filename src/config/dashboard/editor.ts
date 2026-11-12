/* src/config/dashboard/editor.ts */

export const THEME_FAMILIES = [
  { id: 'industrial', label: 'Industrial', default: 'industrial', dark: 'industrial', light: 'industrial-light', vibe: 'bg-zinc-950 border-cyan-500 text-cyan-400 font-mono uppercase' },
  { id: 'neo', label: 'Neo-Brutalist', default: 'neo', dark: 'neo-dark', light: 'neo', vibe: 'bg-yellow-400 border-2 border-black text-black font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' },
  { id: 'cyberpunk', label: 'Cyberpunk', default: 'cyberpunk', dark: 'cyberpunk', light: 'cyberpunk-light', vibe: 'bg-black border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] text-fuchsia-400 font-mono' },
  { id: 'minimal', label: 'Minimalist', default: 'minimal', dark: null, light: 'minimal', vibe: 'bg-white border-zinc-200 text-zinc-900 font-sans tracking-tight' },
  { id: 'elegant', label: 'Elegant', default: 'elegant', dark: null, light: 'elegant', vibe: 'bg-[#FAFAFA] border border-amber-700/30 text-amber-900 font-serif' },
  { id: 'organic', label: 'Organic', default: 'organic', dark: null, light: 'organic', vibe: 'bg-[#F4F1EA] border border-[#2C3B2D] text-[#2C3B2D] font-serif rounded-tl-xl rounded-br-xl' },
  { id: 'editorial', label: 'Editorial', default: 'editorial', dark: null, light: 'editorial', vibe: 'bg-[#EAE8E3] border-y-2 border-black text-black font-serif font-bold uppercase tracking-widest' },
  { id: 'midnight', label: 'Midnight Onyx', default: 'midnight', dark: 'midnight', light: null, vibe: 'bg-zinc-950 border-zinc-800 text-white font-sans tracking-tight shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' }
];

export const BRAND_COLORS = [
  { name: 'Cyan', value: 'cyan-500', twBg: 'bg-cyan-500' },
  { name: 'Fuchsia', value: 'fuchsia-500', twBg: 'bg-fuchsia-500' },
  { name: 'Emerald', value: 'emerald-500', twBg: 'bg-emerald-500' },
  { name: 'Amber', value: 'amber-500', twBg: 'bg-amber-500' },
  { name: 'Rose', value: 'rose-500', twBg: 'bg-rose-500' },
  { name: 'Indigo', value: 'indigo-500', twBg: 'bg-indigo-500' },
  { name: 'Zinc', value: 'zinc-500', twBg: 'bg-zinc-500' }
];

export const ALL_HEROS = ['center', 'split-left', 'split-right', 'cinematic', 'glass'];
export const ALL_CONTENTS = ['classic', 'bento', 'sticky', 'accordion', 'editorial', 'menu', 'lookbook', 'hub'];
export const ALL_ABOUTS = ['split', 'editorial', 'minimal', 'card'];

export const THEME_CONSTRAINTS: Record<string, { hero: string[], content: string[], about: string[] }> = {
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
  midnight: { hero: ALL_HEROS, content: ALL_CONTENTS, about: ALL_ABOUTS }
};

// FUTURE-READY SYSTEM ADMIN INDUSTRY BLUEPRINT MATRIX
export interface IndustryBlueprint {
  id: string;
  label: string;
  tabLabel: string;
  sectionHeading: string;
  addPrimaryBtn: string;
  emptyPrimaryText: string;
  titlePlaceholder: string;
  pricePlaceholder: string;
  deliverablesLabel: string;
  deliverablePlaceholder: string;
  addDeliverableBtn: string;
  optionsLabel: string;
  optionPlaceholder: string;
  addOptionBtn: string;
  showOrderingUrl: boolean;
  defaultContentLayout: string;
}

export const INDUSTRY_BLUEPRINTS: Record<string, IndustryBlueprint> = {
  Culinary: {
    id: 'Culinary',
    label: 'Culinary & Hospitality',
    tabLabel: 'Menu',
    sectionHeading: 'Culinary Categories & Collections',
    addPrimaryBtn: 'Add Category',
    emptyPrimaryText: 'No culinary categories or collections defined.',
    titlePlaceholder: 'Category / Collection Name (e.g., Morning Pastries, Starters)',
    pricePlaceholder: 'Starting Price / Timeframe (Optional)',
    deliverablesLabel: 'Included Varieties & Examples',
    deliverablePlaceholder: 'Variety or item example (e.g., Seasonal Scones, GF Muffins)...',
    addDeliverableBtn: 'Add Variety / Example',
    optionsLabel: 'Flavor, Dietary & Custom Inquiry Options',
    optionPlaceholder: 'Option (e.g., Gluten-Free, Vegan, Custom Preorder)',
    addOptionBtn: 'Add Dietary / Custom Option',
    showOrderingUrl: true,
    defaultContentLayout: 'menu'
  },
  Creative: {
    id: 'Creative',
    label: 'Creative & Media',
    tabLabel: 'Portfolio',
    sectionHeading: 'Core Packages & Collections',
    addPrimaryBtn: 'Add Package',
    emptyPrimaryText: 'No creative packages defined.',
    titlePlaceholder: 'Package Name (e.g., Commercial Shoot, Wedding Collection)',
    pricePlaceholder: 'Starting Price (e.g., $1,500)',
    deliverablesLabel: 'Package Deliverables',
    deliverablePlaceholder: 'Deliverable (e.g., 2.5 Hours, 30 Edited Photos)...',
    addDeliverableBtn: 'Add Deliverable',
    optionsLabel: 'Inquiry Options & Upgrades',
    optionPlaceholder: 'Option (e.g., Second Shooter, Rush Delivery)',
    addOptionBtn: 'Add Inquiry Option',
    showOrderingUrl: false,
    defaultContentLayout: 'lookbook'
  },
  DEFAULT: {
    id: 'General',
    label: 'General / Services',
    tabLabel: 'Services',
    sectionHeading: 'Core Services & Packages',
    addPrimaryBtn: 'Add Service',
    emptyPrimaryText: 'No core services or packages defined.',
    titlePlaceholder: 'Service / Package Name',
    pricePlaceholder: 'Price / Rate (Optional)',
    deliverablesLabel: 'Service Scope & Deliverables',
    deliverablePlaceholder: 'Scope item or deliverable...',
    addDeliverableBtn: 'Add Scope Item',
    optionsLabel: 'Inquiry Options & Selections',
    optionPlaceholder: 'Option (e.g., Emergency Service, Extended Warranty)',
    addOptionBtn: 'Add Inquiry Option',
    showOrderingUrl: false,
    defaultContentLayout: 'classic'
  },
  HUB_OVERRIDE: {
    id: 'Hub',
    label: 'Multi-Department Hub',
    tabLabel: 'Departments',
    sectionHeading: 'Storefront Departments',
    addPrimaryBtn: 'Add Department',
    emptyPrimaryText: 'No departments defined yet.',
    titlePlaceholder: 'Department Name (e.g., Custom Cakes, Goat Brush Clearing)',
    pricePlaceholder: 'Starting Price / Tag (Optional)',
    deliverablesLabel: 'Department Highlights & Offerings',
    deliverablePlaceholder: 'Highlight or offering...',
    addDeliverableBtn: 'Add Highlight',
    optionsLabel: 'Department Inquiry Options',
    optionPlaceholder: 'Specific inquiry topic for this department...',
    addOptionBtn: 'Add Department Option',
    showOrderingUrl: false,
    defaultContentLayout: 'hub'
  }
};

export function getActiveBlueprint(industryTag?: string, engineMode?: string): IndustryBlueprint {
  if (engineMode === 'hub') return INDUSTRY_BLUEPRINTS.HUB_OVERRIDE;
  if (industryTag && INDUSTRY_BLUEPRINTS[industryTag]) return INDUSTRY_BLUEPRINTS[industryTag];
  return INDUSTRY_BLUEPRINTS.DEFAULT;
}

export const VISUAL_ARCH_COPY = {
  ACCORDIONS: {
    VIBE: 'Foundation Vibe',
    HERO: 'Hero Structure & Content',
    CONTENT: 'Content Flow Layout',
    STORY: 'Story & About Section',
    COLORS: 'Brand Color Mapping'
  },
  VIBE: {
    MODE: 'Color Mode',
    LIGHT: 'Light',
    DARK: 'Dark'
  },
  COLORS: {
    PRIMARY: 'Primary Brand Accent',
    SECONDARY: 'Secondary Accent',
    PRESET: 'Preset Token',
    CUSTOM_HEX: 'Custom Hex',
    HEX_PLACEHOLDER: 'HEX CODE',
    PICK_TITLE: 'Pick a custom color'
  },
  LAYOUTS: {
    LOCK_BG: 'Lock Hero Background',
    LOCK_BG_TITLE: 'Lock the background image in place on scroll',
    ADVANCED_SHOW: 'Show Advanced Layouts',
    ADVANCED_HIDE: 'Hide Advanced Layouts',
    LABELS: {
      CENTERED: 'Centered Focus',
      SPLIT_LEFT: 'Bold Left Split',
      SPLIT_RIGHT: 'Bold Right Split',
      CINEMATIC: 'Full Cinematic',
      GLASS: 'Frosted Glass',
      CLASSIC_SPLIT: 'Classic Split',
      EDITORIAL: 'Editorial Overlap',
      MINIMAL: 'Clean Minimal',
      GLASS_CARD: 'Glass Card',
      STACKED: 'Standard Stack',
      BENTO: 'Bento Grid',
      STICKY: 'Sticky Scroll',
      ACCORDION: 'Accordion Flow',
      MENU: 'Culinary Menu',
      LOOKBOOK: 'Lookbook Grid',
      HUB: 'Department Hub'
    }
  }
};

export const EDITOR_WORKSPACE_COPY = {
  CANVAS: {
    INDUSTRY_LABEL: 'Industry Category',
    ARCHITECTURE_LABEL: 'Architecture Tier',
    TIER_CORE: 'Standard Core (Single-Page)',
    TIER_HUB: 'Department Hub (Multi-Page)',
    TABS: {
      CORE: 'Core',
      CONTENT: 'Content',
      LOGISTICS: 'Logistics'
    },
    COLLAPSE_CONTROLS: 'Collapse Controls',
    EXPAND_CONTROLS: 'Expand Controls',
    REFRESH_CANVAS: 'Refresh Live Canvas'
  },
  CORE_TAB: {
    IDENTITY_HEADING: 'Global Identity',
    BUSINESS_NAME_LABEL: 'Business Name',
    BUSINESS_NAME_PLACEHOLDER: 'e.g. Division Bakery & Co.',
    SLUG_LABEL: 'Routing Slug',
    EMAIL_LABEL: 'Public Email',
    EMAIL_PLACEHOLDER: 'hello@example.com',
    INDUSTRY_LABEL: 'Industry Category',
    VIBE_HEADING: 'Foundation Vibe & Colors',
    INTEGRATIONS_HEADING: 'Integrations',
    MAPS_LABEL: 'Google Maps Embed',
    MAPS_TOOLTIP: "Leave blank if you operate remotely or don't have a public headquarters.",
    MAPS_PLACEHOLDER: 'Paste <iframe src="..."> here',
    ORDERING_LABEL: 'Online Ordering URL',
    ORDERING_TOOLTIP: "If provided, an 'Order Online' button will display on the storefront to funnel customers directly to external checkout.",
    ORDERING_PLACEHOLDER: 'https://order.toasttab.com/...',
    VISUALS_HEADING: 'Brand Visuals',
    HERO_BG_LABEL: 'Hero Background Image',
    POSITIONS: {
      CENTER: 'Center',
      TOP: 'Top (Headroom)',
      BOTTOM: 'Bottom (Floor)',
      LEFT: 'Left Aligned',
      RIGHT: 'Right Aligned'
    },
    LOGO_LABEL: 'Brand Logo',
    LOGO_SIZES: {
      SMALL: 'Small & Subtle',
      MEDIUM: 'Medium',
      LARGE: 'Large & Bold',
      MASSIVE: 'Massive (Heroic)'
    },
    ABOUT_IMG_LABEL: 'About Image',
    SAVE_MEDIA_BTN: 'SAVE MEDIA ASSETS',
    UPLOADING_BTN: 'UPLOADING...'
  },
  CONTENT_TAB: {
    HERO_ACCORDION: 'Hero Content & Structure',
    HERO_LAYOUT_SUBHEADING: 'Hero Layout Structure',
    TAGLINE_LABEL: 'Primary Hook (H1 Tagline)',
    TAGLINE_TOOLTIP: 'The massive headline at the very top of your site.',
    TAGLINE_PLACEHOLDER: 'Enter your main headline here...',
    SUBTEXT_LABEL: 'Supporting Subtext',
    SUBTEXT_TOOLTIP: 'The paragraph right below your main headline.',
    SUBTEXT_PLACEHOLDER: 'Briefly explain your value proposition...',
    HERO_CTA_LABEL: 'Hero Button Text',
    HERO_CTA_TOOLTIP: "The button directly under your hero text. (Usually 'View Gallery' or 'Explore')",
    HERO_CTA_PLACEHOLDER: 'e.g. Explore Collections',
    STORY_ACCORDION: 'Story & Architecture',
    STORY_LAYOUT_SUBHEADING: 'Story Layout Structure',
    ABOUT_HEADING_LABEL: 'About Heading',
    ABOUT_HEADING_PLACEHOLDER: 'e.g. Our Story',
    ABOUT_BIO_LABEL: 'About Bio',
    ABOUT_BIO_PLACEHOLDER: 'Tell your story here...',
    SOCIALS_HEADING: 'Social Connections',
    HQ_ROUTING_BADGE: 'HQ Routing Active',
    CONTACT_ACCORDION: 'Bottom Contact & Section Titles',
    CONTACT_HEADING_LABEL: 'Contact Block Heading',
    CONTACT_HEADING_TOOLTIP: "The massive text at the bottom of your site. (e.g. 'Contact Us!')",
    CONTACT_HEADING_PLACEHOLDER: 'e.g. Contact Us!',
    CONTACT_BTN_LABEL: 'Contact Button Text',
    CONTACT_BTN_TOOLTIP: "The actual button at the very bottom of the page. (e.g. 'Request Custom Order')",
    CONTACT_BTN_PLACEHOLDER: 'e.g. Inquire Now',
    SERVICES_HEADING_LABEL: 'Services / Offerings Heading',
    SERVICES_HEADING_TOOLTIP: 'The massive title directly above your packages, menu, or capabilities grid.',
    SERVICES_HEADING_PLACEHOLDER: 'e.g. Seasonal Collections',
    GALLERY_HEADING_LABEL: 'Gallery Heading',
    GALLERY_HEADING_TOOLTIP: 'The massive title directly above your project portfolio grid.',
    GALLERY_HEADING_PLACEHOLDER: 'e.g. Featured Creations',
    LEAD_ACCORDION: 'Lead Capture Form',
    LEAD_LABEL: 'Form Routing Options',
    LEAD_TOOLTIP: "Select the inquiry options you want to appear in this storefront's lead capture modal dropdown.",
    STANDARD_INQUIRY_TYPES: [
      'General Inquiry',
      'Request a Quote',
      'Custom Order / Preorder',
      'Event / Booking Inquiry',
      'Job Application / Hiring',
      'Other'
    ]
  },
  SERVICES_TAB: {
    FLOW_ACCORDION: 'Content Flow Architecture',
    FLOW_HELPER: 'Select how your offerings and gallery items render on the live storefront.',
    ADDONS_HEADING: 'Flexible Upgrades (Quick Add-ons)',
    ADD_ADDON_BTN: 'Add-on',
    EMPTY_ADDONS: 'No quick add-ons defined.',
    ADDON_NAME_PLACEHOLDER: 'Add-on Name (e.g., Rush Order, Gift Box)',
    ADDON_PRICE_PLACEHOLDER: '$25',
    ADDON_DESC_PLACEHOLDER: 'Short description (optional)',
    REMOVE_ADDON_TITLE: 'Remove Add-on',
    UNTITLED_ADDON: 'Untitled Add-on',
    UNTITLED_CATEGORY: 'Untitled Category',
    UNTITLED_PACKAGE: 'Untitled Offering',
    ADDON_BADGE: 'Add-on',
    CARDS_COUNT_SUFFIX: 'Cards',
    SHORT_DESC_PLACEHOLDER: 'Short description...',
    MENU_CARDS_LABEL: 'Menu Cards',
    ADD_BLANK_CARD_BTN: 'Add Blank Card',
    EMPTY_MENU_CARDS: 'No menu cards added yet. Click above to create one.',
    COVER_PHOTO_LABEL: 'Category / Package Cover Photo',
    UPLOAD_COVER_BTN: 'Upload Cover',
    AVAILABILITY_OPTIONS: [
      'All Day',
      'Seasonal',
      'Preorder Only',
      'Breakfast',
      'Brunch',
      'Lunch',
      'Dinner',
      'Late Night',
      'Happy Hour'
    ],
    CARD_EDITOR: {
      ADD_PHOTO_LINE_1: 'Add',
      ADD_PHOTO_LINE_2: 'Photo',
      BROWSE_VAULT_TITLE: 'Browse Drop Vault',
      NAME_PLACEHOLDER: 'Item Name',
      PRICE_PLACEHOLDER: 'Price (Opt)',
      DESC_PLACEHOLDER: 'Description, flavors, or dietary notes...',
      OPTIONS_LABEL: 'Options, Sizes & Varieties',
      ADD_OPTION_BTN: 'Add Option',
      OPTION_NAME_PLACEHOLDER: 'e.g. Dozen, Gluten-Free, or Add Bacon',
      OPTION_PRICE_PLACEHOLDER: '12 or +2',
      MOVE_LABEL: 'Move:',
      REMOVE_CATEGORY_OPTION: '-- Remove --',
      RAW_WARNING_BTN: 'Raw Warning',
      RAW_WARNING_TITLE: 'Flag as Raw/Undercooked',
      VISIBLE_BTN: 'Visible',
      HIDDEN_BTN: 'Hidden',
      VISIBLE_TITLE: 'Currently Visible (Click to Hide)',
      HIDDEN_TITLE: 'Currently Hidden (Click to Show)',
      DETACH_TITLE: 'Detach Image',
      DELETE_TITLE: 'Delete Item',
      DELETE_CONFIRM: 'Remove this item entirely?',
      VAULT_MODAL_TITLE: 'Select from Vault',
      VAULT_MODAL_SUBTITLE: 'Showing unassigned Drop Vault media',
      VAULT_SCANNING: 'Scanning Vault...',
      VAULT_EMPTY: 'No unassigned images found in the vault.',
      VAULT_SELECT_BADGE: 'Select'
    }
  },
  LOGISTICS_TAB: {
    HEADING: 'Logistics & Operational Terms',
    ADD_RULE_BTN: 'Add Rule',
    HELPER_TEXT: 'Configure universal terms like preorder lead times, travel radii, deposit policies, and allergy disclaimers. Attach multiple rate tiers inside any rule.',
    EMPTY_STATE: 'No logistical rules defined.',
    DELETE_RULE_TITLE: 'Delete Entire Rule',
    RULE_TITLE_LABEL: 'Rule Title',
    RULE_TITLE_PLACEHOLDER: 'e.g., Custom Order Lead Times & Deposits',
    RATES_LABEL: 'Attached Rates / Tiers',
    ADD_FEE_BTN: 'Add Fee Line',
    EMPTY_FEES: 'No specific fees attached.',
    FEE_NAME_PLACEHOLDER: 'e.g., 72-Hour Minimum Notice or 50% Deposit',
    FEE_PRICE_PLACEHOLDER: 'Required',
    REMOVE_FEE_TITLE: 'Remove Fee',
    CAVEATS_LABEL: 'Caveats & Policy Details',
    CAVEATS_PLACEHOLDER: 'e.g., All custom cake and pastry orders require 72 hours notice...'
  },
  COMMAND_HUB: {
    INITIALIZING: 'Initializing Hub...',
    NOT_FOUND: 'Tenant not found.',
    BADGE: 'Tenant Hub',
    SAVED_MSG: 'SYSTEM SAVED',
    SAVE_ERR: 'SAVE ERROR',
    SYNCING_BTN: 'SYNCING...',
    SAVE_BTN: 'SAVE STATE',
    LIVE_TELEMETRY: 'Live Telemetry',
    NAV_CANVAS: 'The Canvas',
    NAV_GRID: 'The Grid',
    NAV_VAULT: 'Drop Vault',
    ARCH_TIER_LABEL: 'Architecture Tier:',
    TIER_CORE: 'Standard Core (Single-Page)',
    TIER_HUB: 'Department Hub (Multi-Page)'
  },
  GRID_TAB: {
    LOCKED_PREFIX: 'SYSTEM LOCKED:',
    LOCKED_MID: 'Project is currently in',
    LOCKED_SUFFIX: 'mode. Switch status back to "Building" to make architectural edits.',
    INFRASTRUCTURE: {
      TITLE: 'Infrastructure & Classification',
      DOMAIN_LABEL: 'Edge Network Domain',
      DOMAIN_PREFIX: 'https://',
      DOMAIN_PLACEHOLDER: 'client-domain.com',
      ARCH_TITLE: 'Architecture Tier',
      ARCH_SUBTITLE: 'Single-Page Core vs. Multi-Department Hub',
      TEMPLATE_TITLE: 'Template Engine',
      TEMPLATE_SUBTITLE: 'Classify as Reusable Architecture',
      DIRECTORY_TITLE: 'Directory Exposure',
      DIRECTORY_SUBTITLE: 'Showcase on Live Public Grid'
    },
    DANGER_ZONE: {
      TITLE: 'Danger Zone — Storefront Termination',
      HEADING: 'Purge Storefront Instance',
      DESCRIPTION: 'Once executed, this action is irreversible. All associated configurations and database records will be scrubbed.',
      INPUT_PLACEHOLDER: 'Type DELETE',
      CONFIRM_WORD: 'DELETE',
      ALERT_TEXT: "Please type 'DELETE' to confirm storefront termination.",
      BTN_PURGE: 'Purge Node'
    },
    AUDIT_LEDGER: {
      TITLE: 'Project Timeline',
      LEGEND_TITLE: 'Timeline Legend',
      EMPTY_STATE: 'No events logged yet.',
      STATUS_LEGEND_HEADING: 'Status Legend',
      APPROVED_TITLE: 'Approved',
      APPROVED_DESC: 'Client verified architecture.',
      CHANGES_TITLE: 'Changes Requested',
      CHANGES_DESC: 'Client revisions logged and pending.',
      PAYMENT_TITLE: 'Payment Cleared',
      PAYMENT_DESC: 'Subscription active. System Live.'
    },
    LIFECYCLE: {
      TITLE: 'Deployment Pipeline',
      TIER_SUFFIX: 'TIER',
      STEP_1: 'Queue & Payment',
      STEP_2: 'Core Architecture',
      STEP_3: 'Client Verification',
      STEP_4: 'Content Assembly',
      STEP_5: 'Live Production',
      GENERATING_BTN: 'Generating...',
      RESEND_CHECKOUT_BTN: 'Resend Checkout Link',
      PAYMENT_CLEARED_NOTE: 'Payment cleared. Awaiting build trigger.',
      INIT_BUILD_BTN: 'Initialize Build',
      TRANSMITTING_BTN: 'Transmitting...',
      TRANSMIT_REVIEW_BTN: 'Transmit Review Link',
      AWAITING_VERIFICATION_NOTE: 'Awaiting client sign-off or revision notes...',
      RESEND_LINK_BTN: 'Resend Link',
      FORCE_ASSEMBLE_BTN: 'Force Assemble',
      PAUSED_ASSETS_NOTE: 'Project paused. Awaiting client assets.',
      SENDING_BTN: 'Sending...',
      SEND_NUDGE_BTN: 'Send Nudge',
      RESUME_BTN: 'Resume',
      INJECTING_NOTE: 'Injecting vault data, copy, and media.',
      WAIT_ASSETS_BTN: 'Wait for Client Assets',
      PUBLISH_BTN: 'Publish & Go Live',
      LIVE_NOTE: 'Storefront is active on the network.'
    }
  }
};