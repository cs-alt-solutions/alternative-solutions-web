/* src/config/sandbox.ts */

export const SANDBOX_CLIENTS = {
  division: { // Changed from 'wellness' to 'division'
    id: 'division',
    accessCode: 'DIVISION',
    agencyName: "The Division",
    appTitle: "The Division",
    security: { 
      pin: "2026", // Admin/Staff Master PIN
      lockedMessage: "Secure Client & Staff Access",
      // NEW: Time-Expiring Codes for Telegram
      customerCodes: {
        morning: "WAKE", // Active 8 AM - 12 PM
        evening: "BAKE"  // Active 12 PM - 5 PM
      }
    },
    primaryContact: "Doobie",
    apps: [
      { id: 'storefront', name: "Member Market", description: "Daily Menu & Orders", iconName: "ShoppingCart", themeKey: "emerald" },
      { id: 'admin', name: "Admin Command", description: "Global Zone Health & Velocity", iconName: "Activity", themeKey: "emerald" },
      { id: 'logistics', name: "Core Logistics", description: "Procurement & Internal Routing", iconName: "Truck", themeKey: "cyan" },
      { id: 'fulfillment', name: "Order Fulfillment", description: "Live Order Picking & Dispatch", iconName: "PackageSearch", themeKey: "fuchsia" }
    ],
    inventory: [
      { id: 'itm-1', name: 'Premium Sour Diesel', onHand: 50, category: 'Flower', price: 45.00, unit: '3.5g' },
      { id: 'itm-2', name: 'Granddaddy Purple', onHand: 30, category: 'Flower', price: 50.00, unit: '3.5g' },
      { id: 'itm-3', name: 'House Pre-Roll 2-Pack', onHand: 120, category: 'Pre-Rolls', price: 15.00, unit: 'Pack' },
      { id: 'itm-4', name: 'Infused Pre-Roll', onHand: 45, category: 'Pre-Rolls', price: 25.00, unit: 'Single' },
      { id: 'itm-5', name: 'Gummy 100mg Tin', onHand: 80, category: 'Edibles', price: 20.00, unit: 'Tin' },
      { id: 'itm-new', name: 'Division Lighter', onHand: 15, category: 'Accessories', price: 3.00, unit: 'Each' }
    ],
    fulfillment: {
      initialOrders: [
        { id: "ORD-8821", customer: "Josh (Direct Access)", zone: "Williamsburg", status: 'pending', assignedTo: null, items: [{ id: 'itm-1', name: 'Premium Sample', qtyRequired: 1, qtyPicked: 0 }] },
        { id: "ORD-8822", customer: "Sarah J.", zone: "Virginia Beach", status: 'picking', assignedTo: 'Jason', items: [{ id: 'itm-2', name: 'Pre-Roll 2-Pack', qtyRequired: 3, qtyPicked: 1 }] }
      ]
    },
    logistics: {
      vendors: ["Sam's Club", "Walmart", "Restaurant Depot", "Amazon", "Local Supplier"],
      locations: {
        office: { id: 'loc-office', name: "Office", iconName: 'Briefcase', themeKey: 'emerald' },
        bakery: { id: 'loc-bakery', name: "Bakery", iconName: 'Coffee', themeKey: 'fuchsia' },
        store: { id: 'loc-store', name: "Country Store", iconName: 'Store', themeKey: 'blue' },
        restaurant: { id: 'loc-restaurant', name: "The Restaurant", iconName: 'Utensils', themeKey: 'amber' }
      },
      catalog: [
        { id: 'item-1', name: 'POM Paper Towels', unit: 'Bulk Pack', preferredVendor: "Sam's Club", locations: ['loc-store', 'loc-office'] },
        { id: 'item-sourdough', name: 'Pre-Sliced Sourdough', unit: 'Loaf', preferredVendor: "Walmart", locations: ['loc-bakery', 'loc-restaurant'] },
        { id: 'item-deli-cont', name: '8oz Clear Deli Containers', unit: '240ct Case', preferredVendor: "Restaurant Depot", locations: ['loc-bakery', 'loc-restaurant'] },
        { id: 'item-wings', name: 'Chicken Wings', unit: 'Bulk Case', preferredVendor: "Sam's Club", locations: ['loc-restaurant'] },
        { id: 'item-bacon', name: 'Hickory Bacon', unit: '5lb Pack', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] },
        { id: 'item-ranch', name: 'Ranch Dressing', unit: '1 Gallon Jug', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] },
      ]
    }
  },
  automotive: {
    id: 'automotive',
    accessCode: 'AUTO',
    agencyName: "Victory Automotive",
    appTitle: "Victory Parts & Service",
    security: { pin: "2026", lockedMessage: "Service Bay Terminal" },
    primaryContact: "Mike Foreman",
    apps: [
      { id: 'procurement', name: "Parts Procurement", description: "Daily Dealer Pickups", iconName: "Truck", themeKey: "cyan" },
      { id: 'fulfillment', name: "Service Bay Pull", description: "Pull Parts for Techs", iconName: "Wrench", themeKey: "amber" }
    ],
    logistics: {
      vendors: ["NAPA Auto Parts", "O'Reilly", "OEM Dealer"],
      locations: {
        bays: { id: 'loc-bays', name: "Service Bays", iconName: 'Wrench', themeKey: 'amber' }
      },
      catalog: [
        { id: 'pt-1', name: 'Synthetic 5W-30', unit: 'Quart', preferredVendor: "NAPA Auto Parts", locations: ['loc-bays'] },
        { id: 'pt-2', name: 'Ceramic Brake Pads', unit: 'Box', preferredVendor: "O'Reilly", locations: ['loc-bays'] },
      ]
    }
  }
};

export const MASTER_CATALOG = [
  { id: 'item-wings', name: 'Chicken Wings', unit: 'Bulk Case', category: 'Meat', preferredVendor: "Sam's Club", locations: ['loc-restaurant'] },
  { id: 'item-bacon', name: 'Hickory Bacon', unit: '5lb Pack', category: 'Meat', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] },
  { id: 'item-hoagie', name: '11" Hoagie Rolls', unit: '6-Pack Case', category: 'Bread', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] }
];