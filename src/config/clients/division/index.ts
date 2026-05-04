// src/config/clients/division/index.ts
export const divisionConfig = {
  id: 'division',
  accessCode: 'doobie',
  name: 'Doobie Division',
  agencyName: 'Doobie Division',
  primaryContact: 'ADMIN-01',
  logo: '📦',
  theme: 'emerald',
  appTitle: 'Division Market',
  
  adminSecurity: {
    adminId: 'ADMIN-01',
    passphrase: 'Warehouse-ACCESS-99'
  },
  
  security: {
    pin: '1234', 
    lockedMessage: 'Authorized Personnel Only'
  },
  
  lastActive: '2026-04-02',
  systemStatus: 'ACTIVE_PRODUCTION',

  storeHours: { open: '08:00', shiftChange: '12:00', close: '17:00' },
  shiftChange: '12:00',
  weeklySchedule: {
    0: { open: '08:00', close: '17:00', isClosed: false },
    1: { open: '08:00', close: '17:00', isClosed: true },
    2: { open: '08:00', close: '17:00', isClosed: false },
    3: { open: '08:00', close: '17:00', isClosed: false },
    4: { open: '08:00', close: '17:00', isClosed: false },
    5: { open: '08:00', close: '17:00', isClosed: false },
    6: { open: '08:00', close: '17:00', isClosed: false },
  },

  team: {
    dispatchers: ["@MisterDoobie", "@RedsRosin", "@JonSpliff", "@MrsDoobieDuo"],
    drivers: ["@balance0n1", "@Laylo757", "@King_Maso", "@MistrSandman", "@Roman_Empire145", "@true80skid", "@Thouzand420", "@KyleTheNewGuy"]
  },
  
  warranty: `ALL of our electronics/electronic devices come with a "DUD WARRANTY", meaning if it's not working, leaking, or clearly a "dud" reach out with 48 HOURS with said device and we WILL honor you with a replacement.\n\nWe Stand Behind EVERY Item!\nFor questions, concerns, or issues please contact @RedsRosin or @JonSpliff!`,
  
  fees: {
    digitalPaymentFee: 10
  },

  homeConfig: {
    hero: { title: "DAILY DEALS\nARE LIVE", subtitle: "Don't Miss Out On Today's Drops", buttonText: "Click Here For Daily Deals", colorFrom: "cyan-600", colorTo: "blue-600", icon: "Flame" },
    bento: [
      { name: "Flower", cat: "Flower & Prerolls", sub: "All", icon: "Leaf", color: "emerald", desc: "Premium flower and reserve tiers.", span: "md:col-span-2 md:row-span-2", imgUrl: "" },
      { name: "Vapes", cat: "Vapes & Pens", sub: "All", icon: "Wind", color: "cyan", desc: "Disposables & carts.", span: "col-span-1 md:col-span-1 md:row-span-2", imgUrl: "" },
      { name: "Pre Rolls", cat: "Flower & Prerolls", sub: "Pre-Rolls & Blunts", icon: "Tag", color: "pink", desc: "Ready to enjoy.", span: "col-span-1 md:col-span-1 md:row-span-1", imgUrl: "" },
      { name: "Mystery Bags", cat: "Merch & Extras", sub: "Mystery Bags", icon: "Sparkles", color: "fuchsia", desc: "Surprise assortments.", span: "col-span-1 md:col-span-1 md:row-span-1", imgUrl: "" }
    ],
    secondary: { title: "Don't Miss\nThese Deals", subtitle: "While Supplies Last.", buttonText: "Click To Save", colorFrom: "emerald-500", colorTo: "emerald-500", icon: "Award" }
  },

  dailySchedule: {
    0: { title: "Sunday Strains", sub: "Prep for the week ahead." },
    1: { title: "Munchie Monday", sub: "Start the week deliciously." },
    2: { title: "Dabs & Badder", sub: "Your premium extract drop." },
    3: { title: "Weed Wednesday", sub: "The ultimate mid-week re-up." },
    4: { title: "Dabs & Badder", sub: "Thursday's premium extract drop." },
    5: { title: "Flower Friday", sub: "Fresh buds for the weekend." },
    6: { title: "Shatterday", sub: "Elevate your Saturday." }
  },
  
  categories: ['Flower & Prerolls', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras', 'Healthcare & Topicals'],  
  subCategories: {
    'Flower & Prerolls': ['Top Shelf', 'Pre-Rolls & Blunts', 'Premium', 'Featured Brands', 'SMOKEY STEALS!'],
    'Vapes & Pens': ['Disposables', '510 Cartridges'],
    'Edibles': ['Baked Goods & Chocolates', 'Gummies & Candies', 'Infused Beverages & Syrups', 'Pantry & Spreads'],
    'Concentrates': ['Wax & Dabs', 'Rosin & Resin'],
    'Merch & Extras': ['Apparel & Gear', 'Healthcare & Topicals', 'Accessories']
  },

  pricingTiers: ['1g', '3.5g (Eighth)', '7g (Quarter)', '14g (Half Oz)', '28g (Full Oz)', '1 Cartridge', '2g Disposable', '100mg Pack', '250mg Pack', '1 Unit', 'Single'],

  mockData: {
    sampleOrder: {
      customer: "New Web Order",
      zone: "Williamsburg Areas",
      items: [
        { 
          id: 'md-doobai-pucks', 
          name: 'Doobai Chocolate Pucks (1 Puck (150mg))', 
          qtyRequired: 2, 
          qtyPicked: 0,
          options: 'Dubai Chocolate' 
        }
      ]
    }
  },

  apps: [
    {
      id: 'storefront',
      category: 'prototype',
      name: 'Consumer Storefront',
      description: 'The front-facing e-commerce interface for customer orders.',
      icon: 'Store',
      status: 'production',
      lastUpdated: 'Today',
      updateLog: 'Connected to Supabase DB'
    },
    {
      id: 'admin',
      category: 'prototype',
      name: 'Admin Terminal',
      description: 'Secure Warehouse for inventory management and operations.',
      icon: 'Lock',
      status: 'production',
      lastUpdated: 'Today',
      updateLog: 'Database sync active'
    },
    {
      id: 'fulfillment',
      category: 'concept',
      name: 'Fulfillment Center',
      description: 'Order processing and routing interface.',
      icon: 'Package',
      status: 'concept',
      lastUpdated: 'Mar 25',
      updateLog: 'Initial UI Layout'
    },
    {
      id: 'logistics',
      category: 'concept',
      name: 'Logistics Fleet',
      description: 'Driver routing and delivery confirmation.',
      icon: 'Truck',
      status: 'concept',
      lastUpdated: 'Mar 20',
      updateLog: 'Map routing conceptualized'
    },
    {
      id: 'asset-hub',
      category: 'resource',
      name: 'Secure Asset Vault',
      description: 'Direct pipeline for uploading high-res photos, branding, and documents.',
      icon: 'PackageSearch',
      status: 'live',
      lastUpdated: 'Today',
      updateLog: 'Vault Online'
    }
  ],

  storePolicies: [
    "Access codes are strictly for verified members. Sharing codes with unverified individuals will result in permanent removal.",
    "All sales are final once delivery is completed and verified.",
    "Drivers do not carry excess inventory. Exact change or digital payment is required.",
    "You MUST be 21+ to order.",
    "NO Medical Card Required.",
    "NO meetups. Delivery to residential addresses ONLY."
  ],

  deliveryZones: [
    { name: 'Williamsburg Areas', minimum: 50 },
    { name: 'Gloucester / Hayes / Yorktown', minimum: 75 },
    { name: 'Newport News / Hampton', minimum: 75 },
    { name: 'Quinton / Charles City Areas', minimum: 75 },
    { name: 'West Point / Saluda Area', minimum: 75 },
    { name: 'Richmond & Surrounding Areas', minimum: 100 },
    { name: 'Southside Areas', minimum: 100 },
    { name: 'Ashland & Surrounding Areas', minimum: 150 },
    { name: 'Suffolk', minimum: 150 }
  ]
};