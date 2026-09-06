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
  dashboard: {
    welcomeTitle: "Welcome to your Workspace",
    welcomeSubtitle: "This is dope. Let's get building.",
    messages: {
      welcome: {
        id: 'msg-1',
        sender: "Courtney",
        time: "Just now",
        body: "Hey, I am so pumped you're here. I'm still getting the final pieces put together behind the scenes, so if a button looks weird or something doesn't load right, just let me know. You can drop a note in the Support tab, or just text me if you have my number. Poke around your Live Storefront, add some photos, and let's get this going!"
      },
      returning: {
        id: 'msg-2',
        sender: "Courtney",
        time: "Just now",
        body: "Hey, nothing new today! Just wanted to say hi and see how it's going. Hope you're having a great day. Let me know if you need anything!"
      }
    }
  },
  helpGuide: {
    title: "Quick Tour",
    subtitle: "Where everything lives",
    intro: "Here is a quick breakdown of where everything is in your workspace. If you can't find something, just hit me up in the Support tab!",
    sections: [
      {
        id: "storefront",
        title: "Live Storefront",
        desc: "Your portal to edit copy and media. I keep the live editor locked by default to prevent accidental breaks, but you can request edits to any section here."
      },
      {
        id: "vault",
        title: "Media Vault",
        desc: "Drop high-res files, brand assets, and documents directly into this secure transfer vault so we have everything in one place."
      },
      {
        id: "support",
        title: "Support Desk",
        desc: "Got a question, found a glitch, or want to add a new feature? Drop it here. It acts as a direct pipeline to my inbox."
      },
      {
        id: "billing",
        title: "Billing & Plans",
        desc: "Manage your active subscription tier, safely update your payment methods, or download tax receipts."
      }
    ]
  },
  vault: {
    title: "Media Vault",
    subtitle: "Raw Assets & Documents",
    retentionNotice: "Just a heads up: this vault is a shared staging area for us to pass files back and forth, not where your live website images are hosted! Drop your raw photos here, and I'll wire them up to your live storefront on my end. To keep things clean, unused raw files are purged after 30 days.",
    uploadBtn: "Upload Files",
    dragDrop: "Drag & Drop",
    emptyState: "No raw files in the vault."
  },
  storefront: {
    vibeCheckTitle: "Looking for a bigger change?",
    vibeCheckBody: "This control center is designed for standard content swaps. If you want to fundamentally restructure your layout, add brand new pages, or completely shift the design aesthetic, we need to map out a custom expansion. Shoot me an email to get started.",
    lockedTitle: "Want to make an edit?",
    lockedBody: "To keep your layout pixel-perfect, the structural editor is locked. But updating your site is easy just select the section below and drop your new text or image requests. I'll get it updated for you!",
    requestKeysBtn: "Send Request",
    keysRequested: "Update Request Sent",
    keysPendingBody: "I've got your request! I'll review your notes and get those updates pushed to your live site shortly."
  },
  support: {
    title: "Help & Support",
    subtitle: "Direct line to Courtney. Let's get things sorted.",
    ticketTitle: "How can I help?",
    ticketBody: "Whether you need a quick fix, spotted a weird glitch, or want to brainstorm a massive new feature, drop it here and it goes straight to my inbox.",
    categories: [
      { id: 'question', label: 'Just a Question', description: 'General inquiries, minor content updates, or "how-to" help.' },
      { id: 'broken', label: 'Something Broke', description: 'Glitches, display errors, or something is malfunctioning.' },
      { id: 'idea', label: 'Big New Idea', description: 'Scope out a custom upgrade, new page, or structural shift.' },
      // 🚀 NEW: The Positivity Channel
      { id: 'update', label: 'Business Update', description: 'Share a win, a milestone, or just tell me how things are going!' } 
    ],
    topics: [
  'Live Storefront Edits',
  'Media Vault & Assets',
  'Billing & Subscriptions',
  'New Feature Request',
  'General Strategy & Check-in',
  'Reporting a Bug'
],
    btnSend: "Send Message",
    btnSending: "Sending...",
    btnSent: "Message Sent!",
    expectTitle: "What to Expect",
    expectBody: "I usually review and reply to general questions within 24 hours. If we're mapping out a big upgrade or a custom build, we'll hash out a clear timeline together before diving in.",
    emergencyTitle: "Real Emergencies",
    emergencyBody: "If your website goes completely offline or something is seriously broken, flag it as 'Something Broke'. This bypasses the normal inbox and alerts me immediately so we can put out the fire fast.",
    historyTitle: "Message History",
    historyEmpty: "You haven't sent any messages yet."
  }
};