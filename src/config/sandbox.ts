/* src/config/sandbox.ts */

export const SANDBOX_CLIENTS = {
  division: {
    id: 'division',
    accessCode: 'DIVISION',
    agencyName: "The Division",
    appTitle: "The Division",
    security: { 
      pin: "2026", 
      lockedMessage: "Secure Client & Staff Access",
      customerCodes: { morning: "WAKE", evening: "BAKE" }
    },
    primaryContact: "Doobie",
    
    // Delivery Minimums & Zones
    deliveryZones: [
      { id: 'z-wbg', name: 'Williamsburg Areas', minimum: 50 },
      { id: 'z-gloy', name: 'Gloucester / Hayes / Yorktown', minimum: 75 },
      { id: 'z-nn', name: 'Newport News / Hampton', minimum: 75 },
      { id: 'z-qcc', name: 'Quinton / Charles City Areas', minimum: 75 },
      { id: 'z-wp', name: 'West Point / Saluda Area', minimum: 75 },
      { id: 'z-rich', name: 'Richmond & Surrounding Areas', minimum: 100 },
      { id: 'z-south', name: 'Southside Areas', minimum: 100 },
      { id: 'z-ash', name: 'Ashland & Surrounding Areas', minimum: 150 },
      { id: 'z-suf', name: 'Suffolk', minimum: 150 },
      { id: 'z-other', name: 'Other (Contact Us)', minimum: 0 }
    ],

    storePolicies: [
      "Orders go out at 5:30pm DAILY! Get your order in before 5pm for SAME DAY delivery.",
      "Friday & Saturday early run: Get orders in BEFORE 12PM (Drivers Leave at 12:30pm).",
      "Drivers are allowed a 10 MINUTE GRACE PERIOD upon arrival. If wait exceeds 10min, they must move on.",
      "If you cancel AFTER the order leaves the shop, future orders will be CashApp Pre-Pay only.",
      "ALL CashApp transactions require a $10 Convenience Fee."
    ],

    apps: [
      { id: 'storefront', name: "Member Market", description: "Daily Menu & Orders", iconName: "ShoppingCart", themeKey: "emerald" },
      { id: 'admin', name: "Admin Command", description: "Global Zone Health & Velocity", iconName: "Activity", themeKey: "emerald" },
      { id: 'logistics', name: "Core Logistics", description: "Procurement & Internal Routing", iconName: "Truck", themeKey: "cyan" },
      { id: 'fulfillment', name: "Order Fulfillment", description: "Live Order Picking & Dispatch", iconName: "PackageSearch", themeKey: "fuchsia" }
    ],

    // ==========================================
    // THE MASTER INVENTORY DB (FULL MENU)
    // ==========================================
    inventory: [
      // --- MERCH & EXTRAS ---
      { 
        id: 'merch-1', name: 'Doobie Division Deal Bag', onHand: 100, category: 'Merch & Extras', 
        description: 'Choose a size and our team will craft a mystery bag based on your previous orders! The bigger the bag, the bigger the deals!', iconName: 'Box',
        variants: [ { id: 'v-mb-1', label: 'Small Bag', price: 100.00 }, { id: 'v-mb-2', label: 'Medium Bag', price: 200.00 }, { id: 'v-mb-3', label: 'Large Bag', price: 300.00 } ]
      },
      { 
        id: 'merch-2', name: 'Division Air Fresheners', onHand: 50, category: 'Merch & Extras', 
        description: 'Rep the Team on the Go! Coffee Scented. ONLY $5 if spending $100+!', iconName: 'Leaf',
        variants: [ { id: 'v-af-1', label: 'Single Freshener', price: 10.00 } ]
      },
      { 
        id: 'merch-3', name: 'Division Rolling Trays', onHand: 25, category: 'Merch & Extras', 
        description: 'Approx. 6in × 4in Limited Edition Batch Metal Tray.', iconName: 'Box',
        variants: [ { id: 'v-rt-1', label: 'Single Tray', price: 20.00 } ]
      },
      { 
        id: 'merch-4', name: 'Division Lighter & SnapBack', onHand: 40, category: 'Merch & Extras', 
        description: 'Black with Team Logo. Rep the Doobie Division.', iconName: 'Flame',
        variants: [ { id: 'v-dl-1', label: 'Lighter', price: 5.00 }, { id: 'v-dh-1', label: 'SnapBack Hat', price: 30.00 } ]
      },
      { 
        id: 'merch-5', name: 'Division Merch MegaPack', onHand: 20, category: 'Merch & Extras', 
        description: 'Combo = 1 of Each (Air Freshener, Tray, Lighter, Hat).', iconName: 'Box',
        variants: [ { id: 'v-mp-1', label: 'MegaPack Combo', price: 50.00 } ]
      },

      // --- FLOWER ---
      { 
        id: 'flw-1', name: 'Jungle Boys Flower', onHand: 40, category: 'Flower', 
        description: 'Pre-Packaged 8ths. Grown in Orange County, CA. Jungle Boys Exclusive Genetics.', iconName: 'Leaf',
        variants: [ { id: 'v-jb-1', label: 'Animal Tsunami (3.5g)', price: 50.00 }, { id: 'v-jb-2', label: 'RS-1000 (3.5g)', price: 50.00 } ]
      },
      { 
        id: 'flw-2', name: 'Original Moonrocks', onHand: 60, category: 'Flower', 
        description: 'Premium Indoor Flower Dipped in Hash Oil & Rolled in Premium Indoor Kief.', iconName: 'Leaf',
        variants: [ 
          { id: 'v-mr-1', label: 'Green Apple (3.5g)', price: 45.00 }, { id: 'v-mr-2', label: 'Gruntz (3.5g)', price: 45.00 }, 
          { id: 'v-mr-3', label: 'Gushers (3.5g)', price: 45.00 }, { id: 'v-mr-4', label: 'Orange Push Pop (3.5g)', price: 45.00 },
          { id: 'v-mr-5', label: 'Sugar Cone (7g)', price: 75.00 }, { id: 'v-mr-6', label: 'Sweet Tarts (7g)', price: 75.00 } 
        ]
      },

      // --- ROLLS ---
      { 
        id: 'rls-1', name: 'Sherbinski x Doja Prerolls', onHand: 50, category: 'Rolls', 
        description: 'Infused w/ Live Rosin. Ceramic Filter Tip. 5 Joints per Pack. Exclusive Collab!', iconName: 'Flame',
        variants: [ 
          { id: 'v-sd-1', label: 'Biscotti (Indica)', price: 50.00 }, { id: 'v-sd-2', label: 'G41 (Hybrid)', price: 50.00 },
          { id: 'v-sd-3', label: 'Gelonade (Sativa)', price: 50.00 }, { id: 'v-sd-4', label: 'Gushers (Indica)', price: 50.00 }
        ]
      },
      { 
        id: 'rls-2', name: 'Sherbinski Rosin Prerolls', onHand: 50, category: 'Rolls', 
        description: 'Premium Sherbinski Flower. Live Rosin Infused. 0.5g Joints - 5 PER Pack. Reusable Ceramic Tips.', iconName: 'Flame',
        variants: [ 
          { id: 'v-sr-1', label: 'Acai Z (Hybrid)', price: 50.00 }, { id: 'v-sr-2', label: 'Bacio (Hybrid)', price: 50.00 },
          { id: 'v-sr-3', label: 'D-31 (Indica)', price: 50.00 }, { id: 'v-sr-4', label: 'Snack Box (Sativa)', price: 50.00 }
        ]
      },
      { 
        id: 'rls-3', name: 'Sweetz PreRolls', onHand: 80, category: 'Rolls', 
        description: 'Packs of 5 PreRolls. Infused and Rolled in Diamonds. Very Flavor Forward.', iconName: 'Flame',
        variants: [ 
          { id: 'v-sw-1', label: 'Black Sherbet', price: 40.00 }, { id: 'v-sw-2', label: 'Cotton Candy', price: 40.00 },
          { id: 'v-sw-3', label: 'Grape Jelly', price: 40.00 }, { id: 'v-sw-4', label: '4K Zkittlez', price: 40.00 }
        ]
      },
      { 
        id: 'rls-4', name: 'Pleasures Hash Holes & Resin', onHand: 60, category: 'Rolls', 
        description: '1g Premium Indoor Flower + 0.2g Premium Extract. Glass Filter Tip.', iconName: 'Flame',
        variants: [ 
          { id: 'v-ph-1', label: 'Watermelon Blast (Rosin)', price: 40.00 }, { id: 'v-ph-2', label: 'Purple Zoda (Rosin)', price: 40.00 },
          { id: 'v-pr-1', label: 'Boba Tea (Resin)', price: 30.00 }, { id: 'v-pr-2', label: 'Cherrie Berries (Resin)', price: 30.00 }
        ]
      },
      { 
        id: 'rls-5', name: 'Tarantula PreRolls', onHand: 150, category: 'Rolls', 
        description: '1.5g Premium Indoor Flower. Infused with Live Resin. Rolled in Kief.', iconName: 'Flame',
        variants: [ 
          { id: 'v-tr-1', label: 'Atomic Bomb Pop', price: 20.00 }, { id: 'v-tr-2', label: 'Blue Razz', price: 20.00 },
          { id: 'v-tr-3', label: 'Grape Runtz', price: 20.00 }, { id: 'v-tr-4', label: 'Strawberry Jam', price: 20.00 }
        ]
      },

      // --- WAX & STUFF ---
      { 
        id: 'wax-1', name: 'Division Dabs - Crumble', onHand: 150, category: 'Wax & Stuff', 
        description: 'Live Resin Crumble Wax. Extracted Strain Specific Options! Terp Infused. Exclusive Division Item!', iconName: 'Box',
        variants: [ 
          { id: 'v-dc-3', label: '3g Bucket', price: 25.00 }, { id: 'v-dc-5', label: '5g Bucket', price: 40.00 }, 
          { id: 'v-dc-10', label: '10g Bucket', price: 75.00 } 
        ]
      },
      { 
        id: 'wax-2', name: 'Division Dabs - Badder', onHand: 150, category: 'Wax & Stuff', 
        description: 'Live Resin Badder. Extracted Strain Specific Options! Terp Infused. Exclusive Division Item!', iconName: 'Box',
        variants: [ 
          { id: 'v-db-3', label: '3g Bucket', price: 25.00 }, { id: 'v-db-5', label: '5g Bucket', price: 40.00 }, 
          { id: 'v-db-10', label: '10g Bucket', price: 75.00 } 
        ]
      },
      { 
        id: 'wax-3', name: 'Waxx Exotics (Soda Edition)', onHand: 30, category: 'Wax & Stuff', 
        description: 'Premium Sugar Diamonds. Ultra-Potent HTE. Exotic Soda-Inspired Flavors (All Hybrids).', iconName: 'Box',
        variants: [ 
          { id: 'v-we-1', label: 'Cactus Cooler (3g)', price: 25.00 }, { id: 'v-we-2', label: 'Fresa Fresca (3g)', price: 25.00 },
          { id: 'v-we-3', label: 'Sour Sandía (3g)', price: 25.00 }, { id: 'v-we-4', label: 'Tiki Punch (3g)', price: 25.00 }
        ]
      },
      { 
        id: 'wax-4', name: '710 Labs Persy Rosin', onHand: 10, category: 'Wax & Stuff', 
        description: 'Grown and Extracted in CA. The Best in the Game! 1g Luxury Rosin Badder/Sauce.', iconName: 'Box',
        variants: [ { id: 'v-710-1', label: '710 Chem (1g)', price: 100.00 }, { id: 'v-710-2', label: 'Super Freak (1g)', price: 100.00 } ]
      },

      // --- PENS & KARTS ---
      { 
        id: 'pen-1', name: 'Raw Garden Disposable', onHand: 80, category: 'Pens', 
        description: '1g Disposable. Refined Live Resin. Made w/ NO Trim, NO Additives. 3 Heat Options.', iconName: 'Flame',
        variants: [ 
          { id: 'v-rg-1', label: 'Black Garlic', price: 50.00 }, { id: 'v-rg-2', label: 'Cherry Chem', price: 50.00 },
          { id: 'v-rg-3', label: 'Fresh Water Taffy', price: 50.00 }
        ]
      },
      { 
        id: 'pen-2', name: 'Boutiq Switch (V5)', onHand: 40, category: 'Pens', 
        description: '2g Disposable, TRIPLE Tank System. Liquid Live Diamonds. Digital Screen Display.', iconName: 'Flame',
        variants: [ 
          { id: 'v-bq-1', label: 'Purple Papaya x Blue Berriez x RZ-11', price: 50.00 }, 
          { id: 'v-bq-2', label: 'Arctic Frost x Rocket Pop x Tropic Haze', price: 50.00 }
        ]
      },
      { 
        id: 'pen-3', name: 'Packman V6 & MuhaMeds', onHand: 100, category: 'Pens', 
        description: 'High Potency 2g Disposables. Premium Cannabis Extract.', iconName: 'Flame',
        variants: [ 
          { id: 'v-pm-1', label: 'Packman: Berry Gelato', price: 40.00 }, { id: 'v-pm-2', label: 'Packman: Miami Yayo', price: 40.00 },
          { id: 'v-mm-1', label: 'MuhaMeds: Blue Slushie', price: 40.00 }, { id: 'v-mm-2', label: 'MuhaMeds: Galactic Diesel', price: 40.00 }
        ]
      },
      { 
        id: 'kar-1', name: 'Flavorade Carts', onHand: 60, category: 'Karts', 
        description: 'Small Batch Artisan Cannabis Vape. Luxury Cold Cured Resin. 1g PER Cart!', iconName: 'Flame',
        variants: [ 
          { id: 'v-fa-1', label: 'Sin Mintz', price: 60.00 }, { id: 'v-fa-2', label: 'Rainbow Soap', price: 60.00 },
          { id: 'v-fa-3', label: 'Cherry Limeaid', price: 60.00 }, { id: 'v-fa-4', label: 'Jealousy OG', price: 60.00 }
        ]
      },
      { 
        id: 'kar-2', name: 'Cold Fire Juice', onHand: 50, category: 'Karts', 
        description: 'Cured Resin Juice. Extracted BELOW -100°. NO Distillate, NO Additives.', iconName: 'Flame',
        variants: [ 
          { id: 'v-cf-1', label: 'Angry Donuts', price: 60.00 }, { id: 'v-cf-2', label: 'Pop Rox', price: 60.00 },
          { id: 'v-cf-3', label: 'Zoasty', price: 60.00 }
        ]
      },

      // --- EDDY BULLS ---
      { 
        id: 'edb-1', name: 'MAD Bites & Bursts', onHand: 50, category: 'Eddy Bulls', 
        description: 'High Dose Edibles. Sour Belts and Nano Infused Gummies.', iconName: 'Box',
        variants: [ 
          { id: 'v-mad-1', label: 'MAD: Sour Pink Lemonade', price: 40.00 }, { id: 'v-mad-2', label: 'MAD: Sour Rainbow', price: 40.00 },
          { id: 'v-bur-1', label: 'Bursts (250mg)', price: 40.00 }
        ]
      },
      { 
        id: 'edb-2', name: 'Dope Ropes & Mambas', onHand: 100, category: 'Eddy Bulls', 
        description: 'Deliciously infused Ropes (200mg) and Mamba Gummies (200mg).', iconName: 'Box',
        variants: [ 
          { id: 'v-dr-1', label: 'Rope: Cherry Fizz', price: 20.00 }, { id: 'v-dr-2', label: 'Rope: Magic Mimosa', price: 20.00 },
          { id: 'v-mb-1', label: 'Mamba: Sour Apple', price: 30.00 }, { id: 'v-mb-2', label: 'Mamba: Watermelon', price: 30.00 }
        ]
      },
      { 
        id: 'edb-3', name: 'HIGH-Aid (Drink Mix)', onHand: 40, category: 'Eddy Bulls', 
        description: 'Classic Flavors. 500mg in Each Pack. Just Add Water!', iconName: 'Box',
        variants: [ { id: 'v-ha-1', label: 'Pink Guava', price: 25.00 }, { id: 'v-ha-2', label: 'Watermelon Gushers', price: 25.00 } ]
      },

      // --- MRS. DOOB'S KITCHEN ---
      { 
        id: 'mrs-1', name: "Mrs. Doobie's CannaBudder", onHand: 20, category: "Mrs. Doob's Fun Food", 
        description: 'Make your OWN edibles! 1800mg THC PER Stick! Sweet Cream Butter.', iconName: 'Box',
        variants: [ { id: 'v-cb-1', label: '1 Stick (8 Tbsp)', price: 50.00 } ]
      },
      { 
        id: 'mrs-2', name: "Mrs. Doobie's Munchie Melts", onHand: 30, category: "Mrs. Doob's Fun Food", 
        description: 'Infused Chocolate Bites. 80-85mg Per SQUARE! 12 Squares PER PACK! (1000mg TOTAL)', iconName: 'Box',
        variants: [ { id: 'v-mm-1', label: 'Peanut Butter Cup', price: 30.00 }, { id: 'v-mm-2', label: 'Cookies & Cream', price: 30.00 }, { id: 'v-mm-3', label: 'Smores', price: 30.00 } ]
      },
      { 
        id: 'mrs-3', name: 'Stoned Smackers', onHand: 45, category: "Mrs. Doob's Fun Food", 
        description: 'Infused Uncrustables. Approx 250mg PER Sandwich. Smuckers Jam & Skippy PB.', iconName: 'Box',
        variants: [ { id: 'v-ss-1', label: 'Grape (1x)', price: 15.00 }, { id: 'v-ss-2', label: 'Strawberry (1x)', price: 15.00 }, { id: 'v-ss-3', label: 'Any 2-Pack Deal', price: 25.00 } ]
      },
      { 
        id: 'mrs-4', name: 'Baked Goods & Fudge', onHand: 40, category: "Mrs. Doob's Fun Food", 
        description: 'High Slice Cheesecake (300mg), Fudge (300mg), Pie Bars (150mg) and Bangin Brownies (600mg).', iconName: 'Box',
        variants: [ 
          { id: 'v-bg-1', label: 'Thin Mint Cheesecake', price: 20.00 }, { id: 'v-bg-2', label: 'Cherry Pie Bar', price: 10.00 },
          { id: 'v-bg-3', label: 'Samoa Fudge (1x)', price: 15.00 }, { id: 'v-bg-4', label: 'Lunchlady Brownie', price: 25.00 }
        ]
      },

      // --- DRINKS ---
      { 
        id: 'drk-1', name: 'Medicated Mixers', onHand: 25, category: "Mrs. Doob's Drinks", 
        description: '8oz Bottles. Zing Zang Brand Mixers. 100mg THC Infused. ADD-ON ITEM!', iconName: 'Box',
        variants: [ { id: 'v-mx-1', label: 'Bloody Mary', price: 5.00 }, { id: 'v-mx-2', label: 'Margarita Mix', price: 5.00 }, { id: 'v-mx-3', label: 'Pina Colada', price: 5.00 } ]
      },
      { 
        id: 'drk-2', name: 'Juices & Teas', onHand: 40, category: "Mrs. Doob's Drinks", 
        description: '100mg Infused Drinks. Sunny-D, Paradise Punch, Sweet TeaHC, and Yoo-High. ADD-ON ITEMS!', iconName: 'Box',
        variants: [ 
          { id: 'v-jt-1', label: 'Sunny-D', price: 5.00 }, { id: 'v-jt-2', label: 'Paradise Punch: Berry Blue', price: 5.00 },
          { id: 'v-jt-3', label: 'Sweet TeaHC', price: 5.00 }, { id: 'v-jt-4', label: 'Yoo-High Chocolate', price: 5.00 }
        ]
      },
      { 
        id: 'drk-3', name: 'Red’s Rosin Refreshers', onHand: 20, category: "Mrs. Doob's Drinks", 
        description: '250-300mg PER DRINK! Infused w/ Red’s Rosin! (45-159u). ADD-ON ITEM!', iconName: 'Box',
        variants: [ { id: 'v-rr-1', label: 'Cranberry Grape (1x)', price: 10.00 }, { id: 'v-rr-2', label: 'Pick 3 Deal', price: 25.00 } ]
      },

      // --- HEALTHCARE ---
      { 
        id: 'hc-1', name: 'Alleviate Pain Relief Salve', onHand: 15, category: 'Healthcare', 
        description: '100mg Hemp CBD / 100mg THC Infused Sunflower Oil. 100% Organic Beeswax Base.', iconName: 'Leaf',
        variants: [ { id: 'v-al-1', label: 'Single 1oz Jar', price: 20.00 }, { id: 'v-al-2', label: '2-Jar Deal', price: 30.00 } ]
      },
      { 
        id: 'hc-2', name: 'Canna-Sugar Scrubs', onHand: 20, category: 'Healthcare', 
        description: 'Cold-Pressed Cannabis Oil. Fine Sugar Crystals. 100% Vegan Friendly!', iconName: 'Box',
        variants: [ { id: 'v-cs-1', label: 'Body Scrub (4oz)', price: 30.00 }, { id: 'v-cs-2', label: 'Lip Scrub (5g)', price: 10.00 } ]
      },
      { 
        id: 'hc-3', name: 'HighDrated Lip Care', onHand: 15, category: 'Healthcare', 
        description: 'All Natural/Organic Ingredients. Made w/ Cold Pressed CannabisOil.', iconName: 'Box',
        variants: [ { id: 'v-hl-1', label: 'Lip Balm (5g Jar)', price: 25.00 }, { id: 'v-hl-2', label: 'Lip Kit (Oil + Balm)', price: 40.00 } ]
      }
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