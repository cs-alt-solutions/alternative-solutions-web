// src/config/wizard.ts

export const WIZARD_COPY = {
  PROGRESS_BAR: [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Network' },
    { num: 3, label: 'Scope' }
  ],

  STEP_1: {
    HEADER: {
      TITLE_MAIN: "Let's Build",
      TITLE_PUNCT: ".",
      SUBTITLE: "I'm stoked you're ready to get this off the ground. First things first—I just need to grab a few basic details to see where you're at, and then I'll take it from there."
    },
    LABELS: {
      NAME: "Name",
      BUSINESS: "Business Name",
      EMAIL: "Email Address",
      PHONE: "Phone Number"
    },
    PLACEHOLDERS: {
      NAME: "John Doe",
      BUSINESS: "e.g. Acme Corp",
      EMAIL: "john@example.com",
      PHONE: "(555) 555-5555"
    },
    ACTIONS: {
      NEXT: "Continue"
    }
  },

  STEP_2: {
    TITLE_MAIN: "Your ",
    TITLE_HIGHLIGHT: "Network",
    SUBTITLE: "Select the platforms where your brand lives.",
    DISCLAIMER: {
      TITLE: "Digital Recon Authorization",
      DESC: "Consider this giving me official permission to digitally stalk your brand in a good way. I will snoop through your pages to pull photos, logos, and your vibe for the initial draft."
    },
    MOBILE_HINT: "📱 On mobile? Just tap 'Share Profile → Copy Link' in your app and paste the whole URL below. I will clean it up for you automatically.",
    PLACEHOLDERS: {
      SOCIAL: "@username or profile link",
      OTHER: "https://yourwebsite.com"
    },
    ACTIONS: {
      NEXT: "Continue",
      BACK: "Back"
    }
  },

  STEP_3: {
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Scope.",
    SUBTITLE_START: "Last step! Review the infrastructure plans below. ",
    SUBTITLE_HIGHLIGHT: "You are not paying for anything today.",
    SUBTITLE_END: " I'm just getting a feel for what you want to establish. I will build a prototype, and you don't pay a dime until you see it and say, 'Yeah, this is pretty cool. Let's go.'",
    EMPTY_PLANS: "No active plans found in the database.",
    
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
        description: "Everyone starts at Standard. I will email you when this unlocks.",
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
      PLACEHOLDER: "e.g., myawesomebrand.com"
    },
    PRIORITY: {
      BADGE: "Not Needed",
      TITLE: "Priority Build Queue",
      DESC: "Fast-track your setup for just $1. I will jump your file to the front of the line."
    },

    // 🚀 NEW: The embedded Pledge Pillars
    PILLARS_TITLE: "Rules of Engagement",
    PILLARS: [
      {
        title: "Zero Upfront Cost",
        body: "You don't pay today. Once I review your details, I'll build a working preview. We only lock in your subscription when you look at it and say, <em>'Yeah, this is pretty cool. Let's go.'</em>"
      },
      {
        title: "The Reality Check",
        body: "Alternative Solutions is an active, evolving tech lab. These are the beginning stages—things might be a little clunky or have some digital dust at first. Bear with me; it works, and if something looks wonky, I fix it immediately."
      },
      {
        title: "The Forever Rate",
        body: "Once you approve your prototype, your legacy pricing is locked in forever. As long as your subscription remains active, your monthly rate for your selected plan will never increase."
      }
    ],

    PLEDGE: {
      CHECKBOX_LABEL: "I understand I'm not paying anything today, and I'm ready to see a prototype."
    },
    ACTIONS: {
      BACK: "Back",
      SUBMIT_LOADING: "Transmitting...",
      SUBMIT: "Send It"
    },
    ALERTS: {
      SUCCESS: "Sweet! Your application is locked in. I'm taking over the heavy lifting.",
      ERROR: "Whoops, transmission failed. Check the console."
    }
  },

  SUCCESS: {
    TITLE_START: "All right, cool. ",
    TITLE_HIGHLIGHT: "Locked in.",
    DESCRIPTION: "I have your details and am taking over the heavy lifting. Hang back while I prep your file.",
    BUTTON: "Go to Homepage Now",
    REDIRECT: "Auto-redirecting shortly..."
  }
};