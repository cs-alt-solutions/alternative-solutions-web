export const ACCESS_HOOK = { 
  FIELDS: { NAME: "What's your name?", EMAIL: "Email Address", PHONE: "Phone Number (Optional)" }, 
  BTN_SUBMIT: "SUBMIT PROJECT DETAILS", 
  SUCCESS_MSG: "ACCESS GRANTED. WELCOME TO THE BUILD.", 
  AUTO_SIGNUP: "HEY, YOU WEREN'T ON THE LIST YET—BUT I SIGNED YOU UP. WELCOME IN." 
};

export const JOIN_PAGE = { 
  SUCCESS_MSG: "YOU'RE ON THE LIST. STAY TUNED.", 
  HYPE: { 
    PODCAST_TITLE: "THE ARCHITECT'S PODCAST", 
    PODCAST_DESC: "Listen to the development journey.", 
    AUDIO_PLAYER: { PREFIX: "EPISODE •", STREAMING: "STREAMING...", ENCRYPTED: "ENCRYPTED" }, 
    REALITY_CHECK: { TITLE: "THE REALITY CHECK", TEXT: "You started this to create, not to be an accountant." }, 
    FAQ: [{ q: "When does the Beta start?", a: "Rollouts begin late Q1 2026." }, { q: "Is it free?", a: "Beta testers get free access for feedback." }] 
  } 
};

export const SUPPORT_MODULE = { 
  TITLE: "FUEL THE ENGINE", 
  DESC: "I'm building independent software without a dime of VC funding. Your support goes directly into server costs and keeps me from having to pick up extra inventory shifts.", 
  STRIPE_LINK: "https://support.alternativesolutions.io/b/00wdR981ReCK4AZ2Zn97G00", 
  BTN_TEXT: "CONTRIBUTE" 
};

export const FOUNDING_MEMBER = { 
  TITLE: "BECOME A FOUNDING MEMBER", 
  DESC: "This is an early-access beta. Secure your spot at the legacy rate forever.", 
  FUTURE_PRICE: "$49.00", 
  FUTURE_LABEL: "V1.0 PUBLIC RELEASE", 
  MIN_WARNING: "Minimum contribution is $5.00/month.", 
  STRIPE_LINK: "https://support.alternativesolutions.io/b/bJefZh81R1PY7Nb8jH97G02", 
  BTN_TEXT: "SECURE MY SPOT", 
  LOCKED_LABEL: "LOCKED LEGACY RATE", 
  BILLING_CYCLE: "RECURRING MONTHLY", 
  SUCCESS: { 
    TITLE: "ACCESS GRANTED.", 
    DESC: "Welcome to the engine.", 
    BTN_ENTER: "INITIALIZE STUDIO", 
    STUDIO_URL: "https://studio.alternativesolutions.io" 
  },
  DISCLAIMER: {
    TITLE: "BEFORE YOU SUBSCRIBE.",
    DESC: "Alternative Solutions is a one-person lab. Before you lock in your legacy rate, I need to make sure you know exactly what you're getting into:",
    POINTS: [
      "I acknowledge this is a recurring $5/month subscription (and I'm stoked to lock this rate in forever instead of paying $49 later).",
      "I understand the app isn't live yet. I am joining as an 'Early Funder' to help pay for servers and unlock exclusive 'First 20' perks before the beta even drops.",
      "I understand that when the V1 Beta does launch, it will be clunky. I will definitely encounter bugs, missing features, and friction.",
      "I know I am here to help test and shape the final product, not just consume a finished app."
    ],
    BTN_CANCEL: "NOPE, I'M OUT",
    BTN_CONFIRM: "I'M READY. LET'S BUILD."
  }
};