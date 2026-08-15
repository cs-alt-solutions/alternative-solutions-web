// src/config/wizard.ts

export const WIZARD_COPY = {
  // 🚀 The Progress Bar labels live in the central brain!
  PROGRESS_BAR: [
    { num: 1, label: 'The Basics' },
    { num: 2, label: 'Network' },
    { num: 3, label: 'Vibe' },
    { num: 4, label: 'Scope' },
    { num: 5, label: 'Pledge' }
  ],

  STEP_1: {
    CONVERSATION: {
      STEPS: [
        { 
          TITLE: "Let's Build.", 
          SUBTITLE: "First things first. Who am I talking to?" 
        },
        { 
          TITLE: "The Business.", 
          SUBTITLE: "Nice to meet you, {name}. What am I calling your digital storefront?" 
        },
        { 
          TITLE: "Comms.", 
          SUBTITLE: "Got it. How can I get in touch when things are ready for review?" 
        },
        { 
          TITLE: "The Brain Dump.", 
          SUBTITLE: "Give me the raw vision. What do you do? Why do you do it? Don't worry about making it sound perfect. I genuinely want to know—I'm truly inspired by everyday entrepreneurship, and this is fun for me. I get to help be a part of your success, so this is my chance to hear your story." 
        },
        { 
          TITLE: "The Hook.", 
          SUBTITLE: "Do you know what you want to say, or is this something you want me to write?" 
        }
      ]
    },
    LABELS: {
      NAME: "Your Name",
      BUSINESS: "Business Name",
      EMAIL: "Email Address",
      PHONE: "Phone Number",
      TAGLINE: "Elevator Pitch / Tagline",
      TAGLINE_HELPER: "The first words people read when they land on your page.",
      SUBTEXT: "Supporting Subtext",
      SUBTEXT_HELPER: "A simple sentence explaining what you actually sell or offer."
    },
    PLACEHOLDERS: {
      NAME: "Type your full name...",
      BUSINESS: "Type your business name...",
      EMAIL: "courtney@example.com",
      PHONE: "(555) 123-4567",
      TAGLINE: "e.g., We specialize in shadow work and ethically unearthed minerals. Give me the full pitch...",
      SUBTEXT: "e.g., We specialize in shadow work and ethically unearthed minerals...",
    },
    STORY: {
      LABEL: "Tell Me Your Story",
      BADGE: "Required",
      HELPER: "What do you do? Why do you do it? Give me the raw brain-dump of your business so I can architect the right foundation for your brand.",
      PLACEHOLDER: "Start typing your vision here..."
    },
    COMMS_PREF: {
      LABEL: "How do you prefer to be reached?",
      EMAIL: "Email Me",
      PHONE: "Text / Call"
    },
    VALIDATION: {
      INVALID_EMAIL: "Invalid Format",
      INCOMPLETE_PHONE: "Incomplete"
    },
    HOOK_TOGGLE: {
      TITLE: "Got a Headline?",
      SUBTITLE: "Do you have exact words ready to drop, or should I write something for you?",
      BTN_YES_LABEL: "I Have My Headline",
      BTN_YES_DESC: "I know exactly what I want my site to say.",
      BTN_NO_LABEL: "You Write The Copy",
      BTN_NO_DESC: "I have no clue. Just make it sound badass.",
      DELEGATED_BADGE: "Hell yeah. I'll extract the best parts of your story and write something that actually slaps."
    },
    ACTIONS: {
      CANCEL: "Cancel",
      NEXT: "Continue"
    }
  },

  STEP_2: {
    // 🚀 RESTORED MISSING STRINGS
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Network.",
    SUBTITLE: "Drop your active handles below. Consider this giving me official permission to digitally stalk your brand—in a good way! I will snoop through your pages to pull photos, logos, and your vibe for the initial draft so you don't have to upload a million files. We can always tweak and swap specific assets later.",
    
    CONVERSATION: {
      STEPS: [
        {
          TITLE: "The Network.",
          SUBTITLE: "Do you have any of these? Select the platforms where your brand is currently active."
        },
        {
          TITLE: "Sweet.",
          SUBTITLE: "Drop your usernames below. I'll snoop through your pages to pull photos and get a feel for your overall vibe."
        },
        {
          TITLE: "The Badass Brag.",
          SUBTITLE: "I love to hear the story. You stepped out of the corporate rat race to build your own business, and that takes serious grit. Tell me why you started and what makes your brand kick ass."
        }
      ]
    },
    LABELS: {
      OTHER_LINK: "Other Website or Link",
    },
    PLACEHOLDERS: {
      SOCIAL: "username (no URLs)",
      OTHER: "https://yourwebsite.com",
      STORY: "e.g., I got tired of bosses who didn't know their ass from their elbow, so I started Ducky's Obsidian Apothecary to do things on my own terms..."
    },
    ACTIONS: {
      NEXT: "Continue",
      FINISH: "Lock It In"
    }
  },

  STEP_3: {
    TITLE_MAIN: "Set The ",
    TITLE_HIGHLIGHT: "Vibe.",
    SUBTITLE: "This is your mini storefront engine. Pick your visual aesthetic, click your primary brand injection color, and structure your layout flow.",
    
    VIBE_SELECT: {
      TITLE: "1. Foundational Aesthetic",
      SUBTITLE: "Select the primary visual language for your storefront."
    },
    
    COLOR_SELECT: {
      TITLE: "2. Brand Injection Color",
      SUBTITLE: "Click the primary color accent you want woven into your buttons, borders, and highlights.",
      SWATCHES: [
        { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-400', ring: 'ring-cyan-400', glow: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]' },
        { id: 'fuchsia', label: 'Fuchsia', bg: 'bg-fuchsia-500', ring: 'ring-fuchsia-500', glow: 'shadow-[0_0_20px_rgba(217,70,239,0.4)]' },
        { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-400', ring: 'ring-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.4)]' },
        { id: 'amber', label: 'Amber', bg: 'bg-amber-400', ring: 'ring-amber-400', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]' },
        { id: 'rose', label: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-500', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]' },
        { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.4)]' },
        { id: 'zinc', label: 'Zinc', bg: 'bg-zinc-400', ring: 'ring-zinc-400', glow: 'shadow-[0_0_20px_rgba(161,161,170,0.4)]' }
      ]
    },

    STRUCTURE_TOGGLE: {
      TITLE: "3. Layout Architecture",
      SUBTITLE: "Do you want to custom-select your layout structures, or should I architect the best flow for your aesthetic?",
      BTN_DELEGATE_LABEL: "You Architect The Flow",
      BTN_DELEGATE_DESC: "I picked my aesthetic and color. You choose the best layout structures.",
      BTN_CUSTOM_LABEL: "Let Me Custom Build",
      BTN_CUSTOM_DESC: "I want to preview and pick my exact hero, story, and content flow layouts.",
      DELEGATED_BADGE: "Locked in. I will pair your aesthetic and color with the highest-converting architecture for your industry."
    },

    HERO_SELECT: {
      TITLE: "Hero Structure",
      SUBTITLE: "How should the top of your homepage greet visitors?",
      OPTIONS: [
        { id: 'centered', label: 'Centered', desc: 'Big bold headline dead-center with clean action buttons below.' },
        { id: 'split-left', label: 'Split Left', desc: 'Headline and punchy copy on the left, high-impact imagery on the right.' },
        { id: 'split-right', label: 'Split Right', desc: 'Hero imagery on the left, bold messaging anchored on the right.' },
        { id: 'cinematic', label: 'Cinematic', desc: 'Full edge-to-edge backdrop immersion with overlaid typography.' },
        { id: 'glass-center', label: 'Glass Center', desc: 'Translucent frosted card hovering over deep background depth.' }
      ]
    },
    STORY_SELECT: {
      TITLE: "Story & About Layout",
      SUBTITLE: "How should I frame your origin story and brand background?",
      OPTIONS: [
        { id: 'classic-split', label: 'Classic Split', desc: 'Clean two-column balance between your narrative and visual proof.' },
        { id: 'editorial', label: 'Editorial', desc: 'Magazine-style typography with an asymmetrical staggered layout.' },
        { id: 'minimal-center', label: 'Minimal Center', desc: 'Focused, distraction-free narrative block anchored dead-center.' },
        { id: 'glass-card', label: 'Glass Card', desc: 'Sleek frosted container that elevates your story off the background.' }
      ]
    },
    FLOW_SELECT: {
      TITLE: "Content Flow (Services & Gallery)",
      SUBTITLE: "How should I display your core offerings, packages, or portfolio?",
      OPTIONS: [
        { id: 'stacked', label: 'Stacked', desc: 'Clean vertical progression of your core services and details.' },
        { id: 'bento-grid', label: 'Bento Grid', desc: 'Modern, multi-sized modular boxes for dynamic visual impact.' },
        { id: 'sticky-scroll', label: 'Sticky Scroll', desc: 'Split layout where imagery locks in place while your descriptions flow.' },
        { id: 'editorial-hover', label: 'Editorial Hover', desc: 'Sleek interactive list rows that reveal rich visuals when hovered.' },
        { id: 'accordion', label: 'Accordion', desc: 'Expandable interactive drawers that pack deep details without clutter.' }
      ]
    },

    CLUELESS: {
      HEADER: "I've got you covered.",
      SUBTEXT: "If you are paralyzed by choices, pick this and I will engineer a custom look that fits you perfectly."
    },
    ACTIONS: {
      NEXT: "Dope. Time to talk scope 🚀"
    }
  },

  STEP_4: {
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Scope.",
    SUBTITLE_START: "Last step! Choose your infrastructure plan. ",
    SUBTITLE_HIGHLIGHT: "This isn't a discounted deal; this is the new standard.",
    SUBTITLE_END: " Quality web architecture shouldn't cost an arm and a leg. It should be accessible to anybody building a business, not just those with capital to burn.",
    EMPTY_PLANS: "No active plans found in the database.",
    PLAN: {
      FALLBACK_NAME: "Plan Option",
      FALLBACK_DESC: "Standard plan tier.",
      CURRENCY_SYMBOL: "$",
      MONTHLY_SUFFIX: " a month",
      VIEW_SCOPE: "View Scope",
      HIDE_DETAILS: "Hide Details"
    },
    
    PLANS: [
      {
        id: 'standard',
        name: "The Standard",
        price: "$5",
        suffix: " a month",
        description: "The complete storefront engine. Built to scale your business.",
        features: [
          "Pre-engineered Next.js multi-page architecture",
          "Direct lead routing straight to your email",
          "Curated brand accents & layout frameworks",
          "Forever Legacy Rate Lock guarantee"
        ],
        available: true,
        recommended: true
      },
      {
        id: 'professional',
        name: "The Professional",
        price: "$15",
        suffix: " a month",
        description: "Everyone starts at Standard. We will email you when this unlocks.",
        features: [
          "Everything in The Standard",
          "Custom Domain Connection (yourname.com)",
          "Priority support queue"
        ],
        available: false,
        comingSoonText: "Under Construction"
      }
    ],

    DOMAIN: {
      TITLE: "Domain Connection",
      CHECKBOX: "I already have a custom domain",
      PLACEHOLDER: "e.g., myawesomebrand.com"
    },
    PRIORITY: {
      BADGE: "Not Needed",
      TITLE: "Priority Build Queue",
      DESC: "Fast-track your setup for just $1. I will jump your file to the front of the line."
    },
    FINAL_NOTES: {
      TITLE: "Anything Else?",
      SUBTITLE: "Any extra context, feature ideas, or websites whose style you love?",
      LABEL: "Final Brain-Dump (Optional)",
      PLACEHOLDER: "Drop any raw thoughts or specific functionality you need before I review your file..."
    },
    ACTIONS: {
      NEXT: "Review & Lock It In 🚀",
      SUBMIT_LOADING: "Transmitting...",
      SUBMIT: "Send It"
    }
  },

  STEP_5: {
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Pledge.",
    SUBTITLE: "No agency bloat. Zero friction. Before we initiate the build sequence, please review the standard operating agreement. These are the rules of engagement.",
    PILLARS: [
      {
        title: "The Standard",
        body: "I don't do rigid templates or standard corporate setups. I build custom, high-performance ecosystems. To get your custom engine running, we either agree on a simple, flat-rate build fee, or we set up a value-trade (bartering your goods/services). After that, it's just a flat monthly subscription for the enterprise infrastructure."
      },
      {
        title: "The Reality Check",
        body: "Alternative Solutions is an active, independent tech lab. This is a living, evolving engine—not a static, perfect-out-of-the-box product. Because this is an active build, you might occasionally see digital dust. If something looks wonky, it will be resolved; you have my direct line and I will fix it immediately."
      },
      {
        title: "The Forever Rate",
        body: "Your legacy pricing is locked in forever, but <strong>only for the specific tier you select today</strong>. As long as your subscription remains active and uninterrupted, your monthly rate for that specific plan will never increase."
      },
      {
        title: "The Hard Boundaries",
        body: "Open communication is mandatory—you and I build this together as partners. Second, if you choose to upgrade your plan later (e.g., transitioning from Standard to Professional), you will be subject to the <strong>current market pricing</strong> of that new tier. Lock in your advanced features now."
      }
    ],
    AGREEMENT: {
      CHECKBOX_LABEL: "I understand the boundaries and I am ready to build."
    },
    ACTIONS: {
      BACK: "Back to Scope",
      SUBMIT: "Dope. Let's Build 🤘",
      SUBMITTING: "Sending..."
    },
    ALERTS: {
      SUCCESS: "Sweet! Your application is locked in. I'm taking over the heavy lifting.",
      ERROR: "Whoops, transmission failed. Check the console."
    }
  },

  VIBES_LIST: [
    { id: 'brutalist', title: 'Brutalist', desc: 'Raw, unapologetic, high-contrast borders with bold typography.' },
    { id: 'neon', title: 'Neon Cyberpunk', desc: 'Dark obsidian backgrounds with glowing fuchsia and cyan accents.' },
    { id: 'minimal', title: 'Clean Minimalist', desc: 'Generous whitespace, crisp sans-serif fonts, and ultra-clean layouts.' },
    { id: 'organic', title: 'Flowy & Organic', desc: 'Earthy stone tones, soft rounded borders, and natural typography.' },
    { id: 'onyx', title: 'Midnight Onyx', desc: 'Sleek modern luxury with deep blacks, subtle zinc borders, and sharp contrast.' },
    { id: 'retro', title: 'Retro Sunset', desc: 'Warm nostalgic tones, vintage typography, and groovy laid-back energy.' },
    { id: 'corporate', title: 'Modern Enterprise', desc: 'Trustworthy slate blues, structured grid lines, and crisp professional polish.' },
    { id: 'editorial', title: 'High Fashion Editorial', desc: 'Stark black and white contrast with oversized, dramatic serif headlines.' }
  ],
  VIBES_META: {
    CLUELESS_ID: 'clueless',
    CLUELESS_TITLE: 'No Fucking Clue',
    CLUELESS_DESC: 'I trust you. Just build something badass.'
  },
  VIBES: {
    CLUELESS_ID: 'clueless',
    CLUELESS_TITLE: 'No Fucking Clue',
    CLUELESS_DESC: 'I trust you. Just build something badass.'
  },
  SUCCESS: {
    TITLE_START: "All right, cool. ",
    TITLE_HIGHLIGHT: "Locked in.",
    DESCRIPTION: "I have your details and am taking over the heavy lifting. Hang back while I prep your file.",
    BUTTON: "Go to Homepage Now",
    REDIRECT: "Auto-redirecting shortly..."
  }
};