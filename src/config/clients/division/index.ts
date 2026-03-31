import { divisionInventory } from './inventory';

export const divisionConfig = {
  id: 'division',
  accessCode: 'doobie', // Restored for login routing
  name: 'Doobie Division',
  agencyName: 'Doobie Division', // Restored for sandbox header
  primaryContact: 'ADMIN-01', // Restored for session ID
  logo: '📦',
  theme: 'emerald',
  appTitle: 'Division Market',
  
  // Restored for Gatekeeper Auth
  security: {
    pin: '1234', 
    lockedMessage: 'Authorized Personnel Only'
  },
  
  // Gatekeeper live tracking
  lastActive: '2026-03-30',
  systemStatus: 'ACTIVE_DEVELOPMENT',

  // --- NEW: SINGLE SOURCE OF TRUTH SETTINGS ---
  storeHours: { open: '08:00', shiftChange: '12:00', close: '17:00' },
  shiftChange: '12:00',
  weeklySchedule: {
    0: { open: '08:00', close: '17:00', isClosed: true },
    1: { open: '08:00', close: '17:00', isClosed: true },
    2: { open: '08:00', close: '17:00', isClosed: false },
    3: { open: '08:00', close: '17:00', isClosed: false },
    4: { open: '08:00', close: '17:00', isClosed: false },
    5: { open: '08:00', close: '17:00', isClosed: false },
    6: { open: '08:00', close: '17:00', isClosed: false },
  },
  
  categories: ['Flower & Plants', 'Vapes & Pens', 'Edibles', 'Concentrates', 'Merch & Extras'],
  
  subCategories: {
    'Flower & Plants': ['Premium Flower', 'Pre-Rolls & Blunts', 'Trees & Plants', 'Featured Brands'],
    'Vapes & Pens': ['Disposables', '510 Cartridges'],
    'Edibles': ['Gummies & Candies', 'Baked Goods & Snacks', 'Infused Beverages', "Mrs. Doob's Fun Food", "Mrs. Doob's Drinks"],
    'Concentrates': ['Wax & Dabs', 'Rosin & Resin'],
    'Merch & Extras': ['Apparel & Gear', 'Healthcare & Topicals', 'Accessories']
  },

  pricingTiers: ['1g', '3.5g (Eighth)', '7g (Quarter)', '14g (Half Oz)', '28g (Full Oz)', '1 Cartridge', '2g Disposable', '100mg Pack', '250mg Pack', '1 Unit', 'Single'],

  // --- END NEW SETTINGS ---

  inventory: divisionInventory,

  apps: [
    {
      id: 'storefront',
      name: 'Consumer Storefront',
      description: 'The front-facing e-commerce interface for customer orders.',
      icon: 'Store',
      path: '/sandbox/division?app=storefront',
      status: 'beta',
      lastUpdated: 'Today',
      updateLog: 'Added Dynamic Grid & Pill Filters'
    },
    {
      id: 'admin',
      name: 'Admin Terminal',
      description: 'Secure vault for inventory management and operations.',
      icon: 'Lock',
      path: '/sandbox/division?app=admin',
      status: 'alpha',
      lastUpdated: 'Just Now',
      updateLog: 'Overhauled Campaign Engine & Operations'
    },
    {
      id: 'fulfillment',
      name: 'Fulfillment Center',
      description: 'Order processing and routing interface.',
      icon: 'Package',
      path: '/sandbox/division?app=fulfillment',
      status: 'concept',
      lastUpdated: 'Mar 25',
      updateLog: 'Initial UI Layout'
    },
    {
      id: 'logistics',
      name: 'Logistics Fleet',
      description: 'Driver routing and delivery confirmation.',
      icon: 'Truck',
      path: '/sandbox/division?app=logistics',
      status: 'concept',
      lastUpdated: 'Mar 20',
      updateLog: 'Map routing conceptualized'
    }
  ],

  storePolicies: [
    "You MUST be 21+ to order.",
    "NO Medical Card Required.",
    "NO meetups. Delivery to residential addresses ONLY.",
    "Drivers DO NOT carry change. Exact cash or CashApp only.",
    "Minimum order requirements apply based on your delivery zone."
  ],

  deliveryZones: [
    { name: 'Williamsburg Areas', minimum: 40 },
    { name: 'Gloucester / Hayes / Yorktown', minimum: 100 },
    { name: 'Newport News / Hampton', minimum: 100 },
    { name: 'Quinton / Charles City Areas', minimum: 100 },
    { name: 'West Point / Saluda Area', minimum: 150 },
    { name: 'Richmond & Surrounding Areas', minimum: 200 },
    { name: 'Southside Areas', minimum: 200 },
    { name: 'Ashland & Surrounding Areas', minimum: 250 },
    { name: 'Suffolk', minimum: 250 }
  ]
};