// src/config/emails.ts

export const EMAIL_ASSETS = {
  LOGO_URL: 'https://alternativesolutions.io/logo.png', // Or your full CDN URL for production
};

export const BRAND_CLASSES = {
  // Centralizing our Tailwind classes for global consistency (No-Inline Policy)
  ACCENT_BORDER: 'border-b-2 border-cyan-400',
  QUOTE_BLOCK: 'bg-zinc-950 border-l-4 border-cyan-400 p-6 rounded-r-xl',
  BUTTON: 'bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl',
  TEXT_MUTED: 'text-zinc-500 text-xs text-center',
};

export const EMAIL_COPY = {
  STOREFRONT_CONFIRMATION: {
    HEADLINE: "Alternative Solutions",
    GREETING: "Hey",
    INTRO: "Thanks for reaching out! I’ve got the details for",
    INTRO_END: "and I’m definitely digging what you’ve got in mind.",
    BODY: "Just a heads-up—it’s just me over here running the show, so I’m the one who personally reviews every application. I’m going to look over what you sent, and I’ll be back in touch soon so I can outline the next steps. No hoops, no corporate fluff—just straight to the architecture.",
    SIGN_OFF: "Talk soon,",
    SIGNATURE: "Courtney"
  },
  
  ADMIN_INTAKE: {
    HEADER: 'New Project Application',
    SUBHEADER: 'Sector Zero Foundation',
    GREETING: 'System Alert,',
    INTRO: 'A new project application has been submitted to the queue. Review the dossier below and authorize the build inside the command center when ready.',
  },
  
  MAGIC_LINK: {
    HEADER: 'Welcome Back',
    SUBHEADER: 'Alternative Solutions',
    GREETING: 'Hey there,',
    INTRO: 'You requested a magic link to jump back into your portal.',
    BODY: "I don't do clunky passwords around here. Just click the button below to instantly authenticate your session, and let's make some magic.",
    CTA_BUTTON: 'Enter The Portal',
    SIGN_OFF: 'Talk soon,',
    SIGNATURE: 'Courtney'
  },

  PORTAL_INVITE: {
    HEADER: 'Workspace Access Granted',
    SUBHEADER: 'The Hub',
    GREETING: 'Hey',
    INTRO_START: 'The wait is over! Your ',
    INTRO_MID: ' workspace is officially live. I\'ve got your ',
    INTRO_END: ' access all set up, and I am super pumped to finally get this into your hands.',
    USE_SPACE_TITLE: 'How to use your space:',
    USE_SPACE_BODY: 'Consider this my direct pipeline to you. You can securely drop files, mess around with live prototypes, and watch your business infrastructure come to life in real-time. No more losing things in endless email threads.',
    HEADS_UP_TITLE: 'A quick heads-up:',
    HEADS_UP_BODY: 'The portal is fully functional, but I\'m actively in the trenches building and pushing updates. You might notice a little digital dust or a clunky button here and there. If the system gets sassy, just let me know!',
    CTA_TEXT: "Grab a coffee and let's build something awesome.",
    CTA_BUTTON: 'Enter The Hub',
    SIGN_OFF: 'Talk soon,',
    SIGNATURE: 'Courtney'
  },

  INVITE_SUBJECT: 'Access Granted: Secure Workspace',

};