// src/config/wizard.ts

export const WIZARD_COPY = {
  PROGRESS_BAR: [
    { num: 1, label: 'Basics' },
    { num: 2, label: 'Network' },
    { num: 3, label: 'Launch' }
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
    TITLE_HIGHLIGHT: "Launch.",
    SUBTITLE_START: "Last step! Choose your build lane. ",
    SUBTITLE_HIGHLIGHT: "Everyone gets the same high-performance engine.",
    SUBTITLE_END: " The only difference is how fast you want it.",
    EMPTY_PLANS: "No active plans found in the database.",
    
    LANES: [
      {
        id: 'standard',
        name: "The Prototype",
        price: "$0",
        suffix: " today",
        description: "I want to see a working draft before I pay anything. Put me in the standard build queue.",
        features: [
          "No upfront payment",
          "Standard queue priority",
          "Pay only after you approve the draft"
        ],
        available: true,
      },
      {
        id: 'priority',
        name: "The Fast-Track",
        price: "$5",
        suffix: " / mo",
        // 🚀 UPDATED: Set the 72-hour expectation for the checkout link
        description: "I'm ready to build. Jump me to the front of the line. I will receive a secure portal and checkout link within 72 hours.",
        features: [
          "Bypass the standard queue",
          "Portal setup within 72 hours",
          "Priority build turnaround"
        ],
        available: true,
        recommended: true
      }
    ],

    PILLARS_TITLE: "Rules of Engagement",
    PILLARS: [
      {
        title: "The Reality Check",
        body: "Alternative Solutions is an active, evolving tech lab. These are the beginning stages—things might be a little clunky or have some digital dust at first. Bear with me; it works, and if something looks wonky, I fix it immediately."
      },
      {
        title: "The Forever Rate",
        body: "Your legacy pricing is locked in forever for the specific tier you select today. As long as your subscription stays active, your foundational rate won't increase when public prices go up. (If you upgrade to a higher tier later or require massive database scaling, standard upgrade rates will apply to those new features)."
      },
      {
        title: "The Turnaround",
        body: "Fast-Track builds jump directly to the front of the line. Standard queue builds are processed as quickly as possible in the order they are received."
      }
    ],

    PLEDGE: {
      CHECKBOX_LABEL: "I understand the rules of engagement and I'm ready to build."
    },
    ACTIONS: {
      BACK: "Back",
      SUBMIT_STANDARD: "Submit Application",
      // 🚀 UPDATED: Changed from "Proceed to Checkout" to match the new logic
      SUBMIT_PRIORITY: "Request Fast-Track",
      SUBMIT_LOADING: "Transmitting..."
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