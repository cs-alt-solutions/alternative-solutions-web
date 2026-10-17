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
    SUBTITLE_START: "Last step. ",
    SUBTITLE_HIGHLIGHT: "Review the rules of engagement.",
    SUBTITLE_END: " You are not paying for anything today. This is strictly an application to see if we are a good fit.",
    
    CAPACITY_BANNER: {
      STATUS: "LIVE ENGINE STATUS: AT CAPACITY",
      BODY: "My drafting table is currently full with active client builds. Please still submit your application! You will be placed in a brief wait queue, and I will pull your file the exact moment a build slot opens."
    },
    
    PILLARS_TITLE: "Rules of Engagement",
    PILLARS: [
      {
        title: "The Reality Check",
        body: "Alternative Solutions is an active, evolving tech lab. These are the beginning stages—things might be a little clunky or have some digital dust at first. Bear with me; it works, and if something looks wonky, I fix it immediately."
      },
      {
        title: "The Forever Rate",
        body: "If your application is approved, your legacy pricing is locked in forever. As long as your subscription stays active, your foundational rate won't increase when public prices go up."
      },
      {
        title: "The Waitlist & Capacity",
        body: "To ensure absolute quality, I strictly cap my active build queue. If my drafting table is currently full, your application will be placed on the waitlist until a slot opens."
      }
    ],
    PLEDGE: {
      CHECKBOX_LABEL: "I understand the rules of engagement and want to submit my project for review."
    },
    ACTIONS: {
      BACK: "Back",
      SUBMIT: "Submit Application",
      SUBMIT_LOADING: "Transmitting..."
    },
    ALERTS: {
      SUCCESS: "Sweet! Your application is in the queue. I'll review it and reach out shortly.",
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