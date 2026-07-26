/* src/config/wizard.ts */

export const WIZARD_COPY = {
  STEP_1: {
    TITLE_MAIN: "Let's Build",
    TITLE_PUNCT: ".",
    SUBTITLE: "Answer what you know, leave what you don't. I will handle the heavy lifting.",
    LABELS: {
      NAME: "Your Name",
      BUSINESS: "Business Name",
      EMAIL: "Email Address",
      PHONE: "Phone Number",
      TAGLINE: "Main Headline",
      TAGLINE_HELPER: "The first words people read when they land on your page.",
      SUBTEXT: "Elevator Pitch",
      SUBTEXT_HELPER: "A simple sentence explaining what you actually sell or offer."
    },
    PLACEHOLDERS: {
      NAME: "e.g., Art Vandelay",
      BUSINESS: "e.g., Ducky's Obsidian Apothecary",
      EMAIL: "e.g., ducky@quack.com",
      PHONE: "(555) 867-5309",
      TAGLINE: "e.g., Dark arts. Good intentions. Fierce magic.",
      SUBTEXT: "e.g., We specialize in shadow work, protective talismans, and ethically unearthed minerals...",
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
      DELEGATED_BADGE: "Hell yeah. I'll snoop through your social links and write something that actually slaps."
    },
    ACTIONS: {
      CANCEL: "Cancel Application",
      NEXT: "Got it. Ready to link up 🔗"
    }
  },
  STEP_2: {
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Network.",
    SUBTITLE: "Drop your active handles below. Consider this giving me official permission to digitally stalk your brand—in a good way! I will snoop through your pages to pull photos, logos, and your vibe for the initial draft so you don't have to upload a million files. We can always tweak and swap specific assets later.",
    LABELS: {
      OTHER_LINK: "Other Website or Link",
      HANDLE_PREFIX: "@"
    },
    PLACEHOLDERS: {
      SOCIAL: "clean_username (no URLs)",
      OTHER: "https://yourwebsite.com or custom link"
    },
    ORIGIN_STORY: {
      TITLE: "Flex Your Origin Story",
      SUBTITLE: "I love to hear the story—I am all about the story. You stepped out of the corporate rat race to build your own empire, and that takes serious grit. Most people feel guilty bragging about themselves, but fuck yeah, fucking brag! You are actually doing this. Tell me why you started and what makes your business kick ass.",
      LABEL: "The Badass Brag (Required)",
      HELPER: "Whether this is just internal context for me to learn your vibe, or the exact words you want published to the world—let's hear it. You shouldn't have to stress over the annoying tech parts or learn things you don't care about. I actually enjoy building the engine; you just brag about your empire.",
      PLACEHOLDER: "e.g., I got tired of bosses who didn't know their ass from their elbow, so I started Ducky's Obsidian Apothecary to do things on my own terms and build something real..."
    },
    COMMUNICATION: {
      TITLE: "How I communicate",
      BODY: "I route all build updates and preview links straight to your email. One searchable place, zero clutter."
    },
    ACTIONS: {
      NEXT: "Sweet. Bring on the visuals 🎨"
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
      SUBTITLE: "How should we frame your origin story and brand background?",
      OPTIONS: [
        { id: 'classic-split', label: 'Classic Split', desc: 'Clean two-column balance between your narrative and visual proof.' },
        { id: 'editorial', label: 'Editorial', desc: 'Magazine-style typography with an asymmetrical staggered layout.' },
        { id: 'minimal-center', label: 'Minimal Center', desc: 'Focused, distraction-free narrative block anchored dead-center.' },
        { id: 'glass-card', label: 'Glass Card', desc: 'Sleek frosted container that elevates your story off the background.' }
      ]
    },
    FLOW_SELECT: {
      TITLE: "Content Flow (Services & Gallery)",
      SUBTITLE: "How should we display your core offerings, packages, or portfolio?",
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
    SUBTITLE_END: " Quality web architecture shouldn't cost an arm and a leg. It should be accessible to anybody building an empire, not just those with capital to burn.",
    EMPTY_PLANS: "No active plans found in the database.",
    PLAN: {
      FALLBACK_NAME: "Plan Option",
      FALLBACK_DESC: "Standard plan tier.",
      CURRENCY_SYMBOL: "$",
      MONTHLY_SUFFIX: " a month",
      VIEW_SCOPE: "View Scope",
      HIDE_DETAILS: "Hide Details"
    },
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
    // 🚀 RE-ENGINEERED FOR ACCORDION & STRICT RATE PARITY
    LEGACY_PLEDGE: {
      TITLE: "THE FOUNDER'S PLEDGE • LEGACY RATE AGREEMENT",
      SUBTITLE: "Before we deploy your build, here is what you are guaranteed, why things might occasionally look wonky, and exactly how your rate lock works.",
      SECTIONS: [
        {
          heading: "THE STANDARD",
          body: "Professional, custom-coded web architecture shouldn't be gatekept by massive price tags. You get enterprise hosting, direct lead routing, and a clean custom build that scales with your empire."
        },
        {
          heading: "THE REALITY CHECK",
          body: "Alternative Solutions is an active, independent tech lab. As I push platform upgrades and build out new features, you might occasionally see digital dust or temporary wonkiness. You aren't just buying a static site; we are building an evolving engine. If the system gets sassy, you have my direct line and I fix it immediately."
        },
        {
          heading: "THE FOREVER RATE LOCK & UPGRADES",
          body: "Your rate is locked in for life FOR THE TIER YOU SELECT TODAY. When public pricing increases for new clients, your foundational price stays untouched. However, if you start on a baseline tier and later decide to upgrade to a premium tier packed with new features, you will upgrade at that tier's current market rate—no hopping to premium tiers for baseline prices!"
        },
        {
          heading: "THE HARD BOUNDARIES",
          body: "Two simple rules: Open communication is mandatory—we build this together as partners. Second, your legacy rate lock requires an active, uninterrupted subscription to remain valid."
        }
      ],
      CHECKBOX_LABEL: "I understand that active development means occasional digital dust, I agree to communicate openly, and I acknowledge the rate-lock upgrade rules to secure my founder's pricing forever."
    },
    ACTIONS: {
      SUBMIT_LOADING: "Transmitting...",
      SUBMIT: "Send It"
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