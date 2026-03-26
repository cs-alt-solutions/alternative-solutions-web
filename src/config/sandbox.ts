/* src/config/sandbox.ts */

export const SANDBOX_CLIENTS = {
  division: {
    id: 'division',
    accessCode: 'DIVISION',
    agencyName: "The Division",
    // CHANGED: Clean brand name for the main header
    appTitle: "The Division", 
    // CHANGED: The subtitle pill on the Gatekeeper
    security: { pin: "2026", lockedMessage: "Sandbox & Demo Portal" }, 
    primaryContact: "Doobie",
    apps: [
      { id: 'admin', name: "Admin Command", description: "Global Zone Health & Velocity", iconName: "Activity", themeKey: "emerald" },
      { id: 'logistics', name: "Core Logistics", description: "Procurement & Internal Routing", iconName: "Truck", themeKey: "cyan" },
      { id: 'fulfillment', name: "Order Fulfillment", description: "Live Order Picking & Dispatch", iconName: "PackageSearch", themeKey: "fuchsia" }
    ],
    inventory: [
      { id: 'itm-1', name: 'Premium Sample', onHand: 50, category: 'Flower' },
      { id: 'itm-2', name: 'Pre-Roll 2-Pack', onHand: 120, category: 'Pre-Rolls' },
      { id: 'itm-new', name: 'Web Catalog Item', onHand: 15, category: 'Accessories' }
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