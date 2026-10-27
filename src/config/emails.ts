/* src/config/emails.ts */

export const EMAIL_ASSETS = {
  LOGO_URL: 'https://alternativesolutions.io/logo.png', // Update to full CDN URL for production
};

export const BRAND_CLASSES = {
  // Centralizing our Tailwind classes for global consistency
  ACCENT_BORDER: 'border-b-2 border-cyan-400',
  QUOTE_BLOCK: 'bg-zinc-950 border-l-4 border-cyan-400 p-6 rounded-r-xl',
  BUTTON: 'bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl',
  TEXT_MUTED: 'text-zinc-500 text-xs text-center',
};

// Single Source of Truth for the Sign-off
const STANDARD_SIGNATURE = {
  SIGN_OFF: "Talk soon,",
  NAME: "Courtney Sulenski",
  TITLE: "Alternative Solutions" // Dropped "Lead Architect" to keep it chill
};

export const EMAIL_COPY = {
  
  // 1. THE INTAKE PIPELINE
  STOREFRONT_CONFIRMATION: {
    HEADER: "Application Received",
    TITLE_START: "Hey ",
    BODY_START: "Thanks for reaching out! I've received your application for ",
    BODY_END: " and I'm stoked you decided to connect.",
    
    RECEIPT_TITLE: "Rules of Engagement (Confirmed)",
    PLEDGE_TITLE: "What You Acknowledged",
    PLEDGE_BODY: "Just to recap what you agreed to on the application: Alternative Solutions is an active tech lab, meaning you might occasionally see some digital dust, but I fix things immediately. Once your draft is approved, your legacy rate is locked in forever. Finally, to ensure absolute quality, I strictly cap my active builds—which means your application is currently sitting in the priority wait queue.",
    
    NEXT_TITLE: "What happens next?",
    NEXT_BODY: "The exact moment a build slot opens up on my desk, I will pull your file, review your details, and reach out with the next steps to get your working draft started. Hang tight, and I'll talk to you soon.",
    
    ...STANDARD_SIGNATURE
  },
  
  ADMIN_INTAKE: {
    SUBJECT: "🚨 New Application: {businessName}",
    HEADER_TITLE: "NEW LEAD ALERT",
    GREETING: "Sweet! A new application just dropped.",
    BODY: "Here is everything they sent over. Review their details below before jumping in to start the discovery phase.",
    SECTIONS: {
      IDENTITY: "The Details",
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
    INTRO: 'You requested a secure link to jump back into your workspace.',
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
    USE_SPACE_BODY: 'Consider this my direct pipeline to you. You can securely drop files, mess around with live drafts, and watch your site come to life in real-time. No more losing things in endless email threads.',
    HEADS_UP_TITLE: 'A quick heads-up:',
    HEADS_UP_BODY: 'Your workspace is fully functional, but I\'m actively in the trenches building and pushing updates. You might notice a little digital dust or a clunky button here and there. If the system gets sassy, just let me know!',
    CTA_TEXT: "Grab a coffee and let's build something awesome.",
    CTA_BUTTON: 'Enter Your Workspace',
    ...STANDARD_SIGNATURE
  },

  // 3. THE REVIEW & DEPLOYMENT PIPELINE
  STAGING_REVIEW: {
    HEADER: 'Build Progress',
    SUBHEADER: 'Staging Environment',
    GREETING: 'Hey',
    BODY_1: "Here is what we've got going on so far. I think it's looking great, but I wanted you to review it and get your go-ahead to clear it to push live.",
    INSTRUCTIONS_TITLE: 'What happens next?',
    INSTRUCTIONS_INTRO: 'Instead of going back and forth over email, I want to get you set up in your private client portal so we can collaborate and finish this efficiently.',
    INSTRUCTION_1_TITLE: '1. Take a look',
    INSTRUCTION_1_BODY: 'Click the link below, view the progress, and see the groundwork I am putting together for you.',
    INSTRUCTION_2_TITLE: '2. Lock it in',
    INSTRUCTION_2_BODY: 'When you are ready to proceed, click the button on the staging widget to set up your subscription.',
    INSTRUCTION_3_TITLE: '3. Enter your portal',
    INSTRUCTION_3_BODY: 'Once active, you unlock your portal. That is where you will upload your images and drop your specific tweaks so I can finish getting you exactly where you need to be.',
    CTA_BUTTON: 'Check out your site',
    ...STANDARD_SIGNATURE
  },

  STAGING_RECEIPT: {
    CLIENT_APPROVED: 'Thank you for completing your live review. You verified all checkpoints with zero requested changes. This build is officially in my queue to go live. Keep an eye out for your hosting activation link.',
    CLIENT_CHANGES: 'Thank you for completing your live review. I have logged your requested tweaks below. I am jumping under the hood to knock these out. Once applied, I will send an updated link for your final approval.',
    ADMIN_APPROVED: 'Client has locked the build! Verify their recurring subscription plan is active and get their domain connected.',
    ADMIN_CHANGES: 'Client requested specific adjustments. Make the requested tweaks and push for a second review.',
    ...STANDARD_SIGNATURE
  },

  // 4. THE MANUAL FALLBACK & ACTIVATION PIPELINE
  MANUAL_CHECKOUT: {
    HEADER: 'Almost Live',
    SUBHEADER: 'Subscription Setup',
    GREETING: 'Hey',
    BODY: 'As requested, here is the secure link to set up your monthly hosting subscription. Once this is activated, I will flip the switch and route your domain to the live server!',
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
    NEXT_STEPS_BODY: "Just click the button below to lock in your secure hosting subscription. The second your payment clears, I get a ping on my end, and I'll flip the switch to put your site live. Let's get this thing out there.",
    CTA_BUTTON: 'Activate & Go Live',
    ...STANDARD_SIGNATURE
  },

  // 🚀 RE-ENGAGEMENT EMAIL
  FOLLOW_UP: {
    HEADER: 'Build Status',
    SUBHEADER: 'Queue Check-In',
    GREETING: 'Hey',
    BODY_1: "I noticed your build application has been sitting in the 'Awaiting Payment' queue for a bit. My active drafting table is pretty packed right now, so I do routine sweeps to clear out inactive files and make room for the next founder on the waitlist.",
    BODY_2: "I wanted to check in personally before I archive your project: Are you still wanting to lock in your setup and get this built?",
    BTN_YES: "Yes, Start My Build",
    BTN_NO: "No, Archive My File",
    ...STANDARD_SIGNATURE
  },

  // 🚀 ASSET NUDGE EMAIL
  ASSET_REMINDER: {
    HEADER: 'Action Required',
    SUBHEADER: 'Asset Collection',
    GREETING: 'Hey',
    BODY_1: "Just touching base! I'm actively putting your site together, but I'm currently paused waiting on a few final assets from your end.",
    BODY_2: "Whenever you have a minute, just drop those files directly into your secure Media Vault. The second they are uploaded, I'll resume the build and get this pushed live.",
    CTA_BUTTON: 'Open Media Vault',
    ...STANDARD_SIGNATURE
  },

  INVITE_SUBJECT: 'Access Granted: Secure Workspace'
};