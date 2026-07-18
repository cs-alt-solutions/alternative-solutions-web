/* src/config/wizard.ts */

export const WIZARD_COPY = {
  STEP_1: {
    TITLE_MAIN: "Let's Build",
    TITLE_PUNCT: ".",
    SUBTITLE: "Hey, what's up guys? If you're ready for a custom website, you're in the right place. Let me get the boring stuff out of the way first so I can get to the fun stuff.",
    LABELS: {
      NAME: "Who am I talking to?",
      BUSINESS: "What is your business name?",
      EMAIL: "Best email to reach you?",
      PHONE: "Best phone number?",
    },
    PLACEHOLDERS: {
      NAME: "Your Name",
      BUSINESS: "Acme Corp",
      EMAIL: "john@example.com",
      PHONE: "(555) 123-4567",
      DESCRIPTION: "Give me the rundown on your vision..."
    },
    VALIDATION: {
      INVALID_EMAIL: "Invalid Format",
      INCOMPLETE_PHONE: "Incomplete"
    },
    CANVAS: {
      TITLE: "The Blank Canvas.",
      SUBTITLE: "What are you selling, offering, or showcasing?"
    },
    ACTIONS: {
      CANCEL: "Cancel Application",
      NEXT: "Got it. Ready to link up 🔗"
    }
  },
  STEP_2: {
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Network.",
    SUBTITLE: "Which platforms are you active on? Select a network and drop your link so I can wire them up.",
    LABELS: {
      OTHER_LINK: "Other Link"
    },
    PLACEHOLDERS: {
      SOCIAL: "@username or URL",
      OTHER: "https://yourlink.com"
    },
    COMMUNICATION: {
      TITLE: "How I communicate",
      BODY: "I will route all project updates and credential links straight to your email. This keeps everything in one searchable place."
    },
    ACTIONS: {
      NEXT: "Sweet. Bring on the visuals 🎨"
    }
  },
  STEP_3: {
    TITLE_MAIN: "Set the ",
    TITLE_HIGHLIGHT: "Vibe.",
    SUBTITLE: "This is where you tell me what kind of energy your brand gives off. Pick the style that speaks to you, and I’ll take care of the rest.",
    CLUELESS: {
      HEADER: "Fuck yeah. I'll engineer a custom look that fits you perfectly.",
      SUBTEXT: "(If you're paralyzed by choices, don't sweat it. Pick this, and I'll handle the design.)"
    },
    ACTIONS: {
      NEXT: "Dope. Time to talk scope 🚀"
    }
  },
  STEP_4: {
    TITLE_MAIN: "The ",
    TITLE_HIGHLIGHT: "Scope.",
    SUBTITLE_START: "Last step! Choose the package that fits your setup. ",
    SUBTITLE_HIGHLIGHT: "Put your wallet away—you aren't paying a single dime today.",
    SUBTITLE_END: " I just need to get the specs lined up.",
    EMPTY_PLANS: "No active plans found in the database.",
    PLAN: {
      FALLBACK_NAME: "Plan Option",
      FALLBACK_DESC: "Standard plan tier.",
      CURRENCY_SYMBOL: "$",
      MONTHLY_SUFFIX: "/mo",
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
    ACTIONS: {
      SUBMIT_LOADING: "Transmitting...",
      SUBMIT: "Send It"
    }
  },
  VIBES: {
    CLUELESS_ID: 'clueless',
    CLUELESS_TITLE: 'No Fucking Clue',
    CLUELESS_DESC: 'I trust you. Just build something badass.'
  },
  SUCCESS: {
    TITLE_START: "All right, cool. ",
    TITLE_HIGHLIGHT: "Locked in.",
    DESCRIPTION: "I've got your details and I'm taking over the heavy lifting. No sweat, hang back while I prep your file.",
    BUTTON: "Go to Homepage Now",
    REDIRECT: "Auto-redirecting shortly..."
  }
};