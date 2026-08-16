/* src/config/clients/portal.ts */

export const PORTAL_COPY = {
  header: {
    signOut: "SIGN OUT",
    signingOut: "SIGNING OUT..."
  },
  sidebar: {
    title: "PORTAL",
    switchWorkspace: "Switch Workspace"
  },
  storefront: {
    vibeCheckTitle: "Need a different vibe?",
    vibeCheckBody: "This command center gives you absolute control over your words and media. But if you're looking to fundamentally restructure your layout, add brand new sections, or completely shift the design aesthetic—just shoot me an email! I can help you scope out a custom expansion and get an upgrade mapped out.",
    lockedTitle: "Production Environment Secured",
    lockedBody: "To prevent accidental structural changes, your live storefront editor is locked by default. If you need to update your copy, swap images, or adjust your service offerings, simply request the keys to unlock a 48-hour edit window.",
    requestKeysBtn: "Request The Keys",
    keysRequested: "Access Request Sent",
    keysPendingBody: "Your architect has been notified. You will receive an email as soon as your 48-hour edit window is unlocked."
  },
  support: {
    title: "Help & Support",
    subtitle: "Direct line to Courtney. Let's get things sorted.",
    ticketTitle: "How can I help?",
    ticketBody: "Whether you need a quick fix, spotted a weird glitch, or want to brainstorm a massive new feature, drop it here and it goes straight to my inbox.",
    categories: [
      { id: 'question', label: 'Just a Question', description: 'General inquiries, minor content updates, or "how-to" help.' },
      { id: 'broken', label: 'Something Broke', description: 'Glitches, display errors, or something is malfunctioning.' },
      { id: 'idea', label: 'Big New Idea', description: 'Scope out a custom upgrade, new page, or structural shift.' }
    ],
    topics: [
      'Live Storefront',
      'Client Portal',
      'Billing & Subscription',
      'Custom Upgrade / Expansion',
      'Other'
    ],
    btnSend: "Send Message",
    btnSending: "Sending...",
    btnSent: "Message Sent!",
    expectTitle: "What to Expect",
    expectBody: "I usually review and reply to general questions within 24 hours. If we're mapping out a big upgrade or a custom build, we'll hash out a clear timeline together before diving in.",
    emergencyTitle: "Real Emergencies",
    emergencyBody: "If your website goes completely offline or something is seriously broken, flag it as 'Something Broke'. This bypasses the normal inbox and alerts me immediately so we can put out the fire fast.",
    // 🚀 NEW: Friendly history text!
    historyTitle: "Message History",
    historyEmpty: "You haven't sent any messages yet."
  }
};