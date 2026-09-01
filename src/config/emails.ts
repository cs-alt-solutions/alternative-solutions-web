// src/config/emails.ts

export const EMAIL_ASSETS = {
  LOGO_URL: 'https://alternativesolutions.io/logo.png', // Update to full CDN URL for production
};

export const BRAND_CLASSES = {
  ACCENT_BORDER: 'border-b-2 border-cyan-400',
  QUOTE_BLOCK: 'bg-zinc-950 border-l-4 border-cyan-400 p-6 rounded-r-xl',
  BUTTON: 'bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl',
  TEXT_MUTED: 'text-zinc-500 text-xs text-center',
};

// Single Source of Truth for the Sign-off
const STANDARD_SIGNATURE = {
  SIGN_OFF: "Talk soon,",
  NAME: "Courtney",
  TITLE: "Alternative Solutions"
};

export const EMAIL_COPY = {
  
  // 1. THE INTAKE PIPELINE
  STOREFRONT_CONFIRMATION: {
    HEADER: "Application Received",
    TITLE_START: "Let's build, ",
    BODY_START: "I've got your details for ",
    BODY_END: ". I'm diving in and starting to piece things together.",
    RECEIPT_TITLE: "Quick Summary",
    REC_INFRA: "Selected Plan:",
    PLEDGE_TITLE: "Just A Heads Up",
    PLEDGE_BODY: "As a reminder, you aren't paying for anything today. I'm going to build a working prototype based on the info you sent over. We only lock in your subscription when you review the draft and say, 'Yeah, this is pretty cool. Let's go.'",
    NEXT_TITLE: "What Happens Next?",
    NEXT_BODY: "Hang tight. I'm looking over your links and laying down the groundwork. I'll reach out shortly with a private link for you to check out.",
    ...STANDARD_SIGNATURE
  },
  
  ADMIN_INTAKE: {
    SUBJECT: "🚨 New Application: {businessName}",
    HEADER_TITLE: "NEW STOREFRONT INTAKE",
    GREETING: "A new prospect has submitted their basic details.",
    BODY: "Review their identity and footprint below before logging into the Command Center to initiate the discovery phase.",
    SECTIONS: {
      IDENTITY: "Identity & Routing",
      PRIORITY_WARNING: "⚠️ Priority Queue Fast-Track Requested ($1 Upgrade)"
    },
    LABELS: {
      BUSINESS_NAME: "Business Name:",
      CONTACT: "Point of Contact:",
      EMAIL: "Email Routing:",
      PHONE: "Phone Number:",
      TIER: "Requested Tier:",
      DOMAIN: "Existing Domain:",
      SOCIALS: "Digital Footprint & Socials:"
    }
  },

  // 2. THE ACCESS PIPELINE
  MAGIC_LINK: {
    HEADER: 'Secure Login',
    SUBHEADER: 'Alternative Solutions',
    GREETING: 'Hey there,',
    INTRO: 'You requested a secure magic link to jump back into your workspace.',
    BODY: "I don't do clunky passwords around here. Just click the button below to instantly log in, and let's get back to building.",
    CTA_BUTTON: 'Log In',
    ...STANDARD_SIGNATURE
  },

  PORTAL_INVITE: {
    HEADER: 'Workspace Ready',
    SUBHEADER: 'The Hub',
    GREETING: 'Hey',
    INTRO_START: 'The wait is over! Your ',
    INTRO_MID: ' workspace is officially live. I\'ve got your ',
    INTRO_END: ' access all set up, and I am super pumped to finally get this into your hands.',
    USE_SPACE_TITLE: 'How to use your space:',
    USE_SPACE_BODY: 'Consider this my direct pipeline to you. You can securely drop files, mess around with live prototypes, and watch your site come to life in real-time. No more losing things in endless email threads.',
    HEADS_UP_TITLE: 'A quick heads-up:',
    HEADS_UP_BODY: 'Your workspace is fully functional, but I\'m actively in the trenches building and pushing updates. You might notice a little digital dust or a clunky button here and there. If anything acts up, just let me know!',
    CTA_TEXT: "Grab a coffee and let's build something awesome.",
    CTA_BUTTON: 'Enter Your Workspace',
    ...STANDARD_SIGNATURE
  },

  // 3. THE REVIEW & DEPLOYMENT PIPELINE
  STAGING_REVIEW: {
    HEADER: 'Build Progress',
    SUBHEADER: 'Staging Environment',
    GREETING: 'Hey',
    BODY_1: "Here is a quick preview of what your site is going to look like so far. We can definitely make adjustments together, but I wanted to show you the progress before you lock in your subscription.",
    INSTRUCTIONS_TITLE: 'What happens next?',
    INSTRUCTIONS_INTRO: 'Instead of going back and forth over email, I want to get you set up in your private client portal so we can collaborate and finish this efficiently.',
    
    INSTRUCTION_1_TITLE: '1. Take a look',
    INSTRUCTION_1_BODY: 'Click the link, view the progress, and see the foundation I am building for you.',
    
    INSTRUCTION_2_TITLE: '2. Activate subscription',
    INSTRUCTION_2_BODY: 'When you are ready to proceed, click the button on the staging widget to set up your subscription.',
    
    INSTRUCTION_3_TITLE: '⚡ 3. Enter your portal',
    INSTRUCTION_3_BODY: 'Once active, you unlock your portal. That is where you will upload your images and drop your specific tweaks so I can finish getting you exactly where you need to be.',
    
    CTA_BUTTON: 'Check out your site',
    ...STANDARD_SIGNATURE
  },

  STAGING_RECEIPT: {
    CLIENT_APPROVED: 'Thanks for looking over the staging site. You verified all checkpoints with zero requested changes. This build is officially in my queue for final deployment. Keep an eye out for your live hosting link.',
    CLIENT_CHANGES: 'Thanks for looking over the staging site. I have your requested tweaks logged below. I am jumping under the hood to knock these out. Once applied, I will send an updated link for your final approval.',
    ADMIN_APPROVED: 'Client has locked the build! Verify their recurring subscription plan is active and initiate domain DNS wiring protocols.',
    ADMIN_CHANGES: 'Client requested specific adjustments. Open the active codebase, apply the tweak list in a single pass, and push to staging for their second review.',
    ...STANDARD_SIGNATURE
  },

  // 4. THE MANUAL FALLBACK & ACTIVATION PIPELINE
  MANUAL_CHECKOUT: {
    HEADER: 'Almost Live',
    SUBHEADER: 'Subscription Setup',
    GREETING: 'Hey',
    BODY: 'As requested, here is the secure link to set up your monthly hosting subscription. Once this is good to go, I will flip the switch and put your site live!',
    CTA_BUTTON: 'Set Up Hosting',
    ...STANDARD_SIGNATURE
  },

  SUBSCRIPTION_ACTIVATION: {
    HEADER: 'Green Light',
    SUBHEADER: 'Ready To Launch',
    GREETING: 'Hey',
    BODY_START: 'Great news—I have everything for ',
    BODY_END: ' completely dialed in and ready to go live.',
    DETAILS_TITLE: 'The Details',
    PLAN_LABEL: 'Selected Plan:',
    PRICE_LABEL: 'Subscription:',
    NEXT_STEPS_TITLE: 'What happens next?',
    NEXT_STEPS_BODY: "Just click the button below to lock in your hosting. The second your payment clears, I get a ping on my end, and I'll flip the switch to put your site live. Let's get this thing out there.",
    CTA_BUTTON: 'Go Live',
    ...STANDARD_SIGNATURE
  },

  INVITE_SUBJECT: 'Access Granted: Secure Workspace'
};