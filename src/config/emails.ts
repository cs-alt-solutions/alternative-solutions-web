// src/config/emails.ts

export const EMAIL_ASSETS = {
  LOGO_URL: 'https://alternativesolutions.io/logo.png', // Update to full CDN URL for production
};

export const BRAND_CLASSES = {
  // Centralizing our Tailwind classes for global consistency (No-Inline Policy)
  ACCENT_BORDER: 'border-b-2 border-cyan-400',
  QUOTE_BLOCK: 'bg-zinc-950 border-l-4 border-cyan-400 p-6 rounded-r-xl',
  BUTTON: 'bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl',
  TEXT_MUTED: 'text-zinc-500 text-xs text-center',
};

// Single Source of Truth for the Sign-off
const STANDARD_SIGNATURE = {
  SIGN_OFF: "Standing by,",
  NAME: "Courtney Sulenski",
  TITLE: "Lead Solutions Architect • Alternative Solutions"
};

export const EMAIL_COPY = {
  
  // 1. THE INTAKE PIPELINE
  STOREFRONT_CONFIRMATION: {
    HEADLINE: "Alternative Solutions",
    GREETING: "Hey",
    INTRO: "Thanks for reaching out! I’ve got the details for",
    INTRO_END: "and I’m definitely digging what you’ve got in mind.",
    BODY: "Just a heads-up—it’s just me over here running the show, so I’m the one who personally reviews every application. I’m going to look over what you sent, and I’ll be back in touch soon so I can outline the next steps. No hoops, no corporate fluff—just straight to the architecture.",
    ...STANDARD_SIGNATURE
  },
  
  ADMIN_INTAKE: {
    HEADER: 'New Project Application',
    SUBHEADER: 'System Intake',
    GREETING: 'System Alert,',
    INTRO: 'A new project application has been submitted to the queue. Review the dossier below and authorize the build inside the command center when ready.',
  },

  // 2. THE ACCESS PIPELINE
  MAGIC_LINK: {
    HEADER: 'Secure Authentication',
    SUBHEADER: 'Alternative Solutions',
    GREETING: 'Hey there,',
    INTRO: 'You requested a secure magic link to jump back into your workspace.',
    BODY: "I don't do clunky passwords around here. Just click the button below to instantly authenticate your session, and let's get back to building.",
    CTA_BUTTON: 'Authenticate Session',
    ...STANDARD_SIGNATURE
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
    HEADS_UP_BODY: 'Your workspace is fully functional, but I\'m actively in the trenches building and pushing updates. You might notice a little digital dust or a clunky button here and there. If the system gets sassy, just let me know!',
    CTA_TEXT: "Grab a coffee and let's build something awesome.",
    CTA_BUTTON: 'Enter Your Workspace',
    ...STANDARD_SIGNATURE
  },

  // 3. THE REVIEW & DEPLOYMENT PIPELINE
  STAGING_REVIEW: {
    HEADER: 'Pre-Launch Deployment',
    SUBHEADER: 'Ready For Review',
    GREETING: 'Hey',
    BODY_1: 'we did it! I have everything built, wired up, and deployed to a private staging link just for you. Before we lock in your hosting and push this live to the world, I need you to take it for a spin.',
    INSTRUCTIONS_TITLE: 'How Our Review Stage Works',
    INSTRUCTIONS_INTRO: 'I built an interactive review widget right into the bottom corner of your staging site to make this super easy:',
    INSTRUCTION_APPROVE: 'If you love it: Check off the verification boxes in the widget and hit Approve! That logs your sign-off and instantly generates your activation link so we can flip your domain live.',
    INSTRUCTION_TWEAK: 'If you want tweaks: This is your chance! If a headline needs adjusting or an image doesn\'t hit right, type your notes directly into the widget and hit submit.',
    INSTRUCTION_WARNING: 'Note on Revisions: We do focused, purposeful reviews. Please list all of your adjustments directly in the widget so I can execute them in one clean, lightning-fast pass.',
    CTA_BUTTON: 'Open Private Staging Link',
    ...STANDARD_SIGNATURE
  },

  STAGING_RECEIPT: {
    CLIENT_APPROVED: 'Thank you for completing your live staging review. You have verified all checkpoints with zero requested changes. This build is officially locked in our dev queue for final deployment. Keep an eye out for your official hosting activation link.',
    CLIENT_CHANGES: 'Thank you for completing your live staging review. We have logged your verified checkpoints and adjustment requests below. Our team is jumping under the hood to execute your exact tweak list in one clean pass. Once applied, we will send an updated link for your final approval.',
    ADMIN_APPROVED: 'Client has locked the build! Verify their recurring subscription plan is active and initiate domain DNS wiring protocols.',
    ADMIN_CHANGES: 'Client requested specific adjustments. Open the active codebase, apply the tweak list in a single pass, and push to staging for their second review.',
    ...STANDARD_SIGNATURE
  },

  // 4. THE MANUAL FALLBACK PIPELINE
  MANUAL_CHECKOUT: {
    HEADER: 'Architecture Sign-Off',
    SUBHEADER: 'Subscription Initialization',
    GREETING: 'Hey',
    BODY: 'As requested, here is the secure link to initialize your monthly hosting and infrastructure subscription. Once this is activated, we will flip the switch and route your domain to the live server!',
    CTA_BUTTON: 'Activate Subscription',
    ...STANDARD_SIGNATURE
  }
};