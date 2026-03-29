/* src/config/clients/division.ts */

export const divisionConfig = {
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
    { id: 'storefront', name: "Division Market", description: "Customer Order Portal", iconName: "ShoppingCart", themeKey: "emerald" },
    { id: 'admin', name: "Admin Command", description: "Global Zone Health & Velocity", iconName: "Activity", themeKey: "emerald" },
    { id: 'logistics', name: "Core Logistics", description: "Procurement & Internal Routing", iconName: "Truck", themeKey: "cyan" },
    { id: 'fulfillment', name: "Order Fulfillment", description: "Live Order Picking & Dispatch", iconName: "PackageSearch", themeKey: "fuchsia" }
  ],

  // ==========================================
  // THE MASTER INVENTORY DB 
  // ==========================================
  inventory: [
    // --- FLOWER & PLANTS (TREES & PLANTS SUB-CAT) ---
    {
      id: 'flw-candy-runtz',
      name: 'Candy Runtz',
      isTopShelf: true,
      mainCategory: 'Flower & Plants',
      subCategory: 'Trees & Plants',
      description: 'Zkittlez x Gelato. Feels: Body High, Euphoric, Uplifting. Taste: Candy, Creamy, Sugary. Fun Fact: High settles in with a mellow onset, slipping into mind and body with relaxation.',
      iconName: 'Leaf',
      featured: false,
      dailyDeal: false,
      sizes: [
        { id: 'sz-35g', label: '3.5g (Eighth)', price: 45.00, bundleQty: 1 },
        { id: 'sz-7g', label: '7g (Quarter)', price: 80.00, bundleQty: 1 },
        { id: 'sz-14g', label: '14g (Half Oz)', price: 120.00, bundleQty: 1 },
        { id: 'sz-28g', label: '28g (Full Oz)', price: 220.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard', stock: 20 }]
    },
    {
      id: 'flw-cherry-trainwreck',
      name: 'Cherry Trainwreck',
      isTopShelf: true,
      mainCategory: 'Flower & Plants',
      subCategory: 'Trees & Plants',
      description: 'Trainwreck x Cherry Kush. Feels: Aroused, Creative, Uplifting. Taste: Berry, Fruity. Fun Fact: Starts with energy and ends with sleep, filling mind and body with heavy potency.',
      iconName: 'Leaf',
      featured: false,
      dailyDeal: false,
      sizes: [
        { id: 'sz-35g', label: '3.5g (Eighth)', price: 45.00, bundleQty: 1 },
        { id: 'sz-7g', label: '7g (Quarter)', price: 80.00, bundleQty: 1 },
        { id: 'sz-14g', label: '14g (Half Oz)', price: 120.00, bundleQty: 1 },
        { id: 'sz-28g', label: '28g (Full Oz)', price: 220.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard', stock: 20 }]
    },
    {
      id: 'flw-ice-cream-cookies',
      name: 'Ice Cream Cookies',
      isTopShelf: true,
      mainCategory: 'Flower & Plants',
      subCategory: 'Trees & Plants',
      description: 'Gelato 33 x Wedding Cake. Feels: Hungry, Relaxing, Sleepy. Taste: Creamy, Mint, Vanilla. Fun Fact: Settles into the brain first before taking on your body with happy euphoria.',
      iconName: 'Leaf',
      featured: false,
      dailyDeal: false,
      sizes: [
        { id: 'sz-35g', label: '3.5g (Eighth)', price: 45.00, bundleQty: 1 },
        { id: 'sz-7g', label: '7g (Quarter)', price: 80.00, bundleQty: 1 },
        { id: 'sz-14g', label: '14g (Half Oz)', price: 120.00, bundleQty: 1 },
        { id: 'sz-28g', label: '28g (Full Oz)', price: 220.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard', stock: 20 }]
    },
    {
      id: 'flw-gorilla-butter',
      name: 'Gorilla Butter',
      isTopShelf: false,
      mainCategory: 'Flower & Plants',
      subCategory: 'Trees & Plants',
      description: 'PB Breath x GG4. Feels: Euphoria, Sociable, Tingly. Taste: Creamy, Nutty, Sour. Fun Fact: Hits a few minutes after exhale, reaching new heights of bliss and creativity.',
      iconName: 'Leaf',
      featured: false,
      dailyDeal: false,
      sizes: [
        { id: 'sz-35g', label: '3.5g (Eighth)', price: 35.00, bundleQty: 1 },
        { id: 'sz-7g', label: '7g (Quarter)', price: 60.00, bundleQty: 1 },
        { id: 'sz-14g', label: '14g (Half Oz)', price: 100.00, bundleQty: 1 },
        { id: 'sz-28g', label: '28g (Full Oz)', price: 200.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard', stock: 20 }]
    },
    {
      id: 'flw-grape-soda',
      name: 'Grape Soda',
      isTopShelf: false,
      mainCategory: 'Flower & Plants',
      subCategory: 'Trees & Plants',
      description: 'Tahoe OG Phenotype. Feels: Euphoria, Focus, Happy. Taste: Berry, Grape, Sweet. Fun Fact: Light lifting effect that starts with focus before fading into happy relaxation.',
      iconName: 'Leaf',
      featured: false,
      dailyDeal: false,
      sizes: [
        { id: 'sz-35g', label: '3.5g (Eighth)', price: 35.00, bundleQty: 1 },
        { id: 'sz-7g', label: '7g (Quarter)', price: 60.00, bundleQty: 1 },
        { id: 'sz-14g', label: '14g (Half Oz)', price: 100.00, bundleQty: 1 },
        { id: 'sz-28g', label: '28g (Full Oz)', price: 200.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard', stock: 20 }]
    },
    {
      id: 'flw-lemon-og',
      name: 'Lemon OG Kush',
      isTopShelf: false,
      mainCategory: 'Flower & Plants',
      subCategory: 'Trees & Plants',
      description: 'Las Vegas Lemon Skunk x The OG #18. Feels: Creative, Focused, Happy. Taste: Lemon, Sour, Tangy. Fun Fact: Good for sleep and effective for increasing appetite.',
      iconName: 'Leaf',
      featured: false,
      dailyDeal: false,
      sizes: [
        { id: 'sz-35g', label: '3.5g (Eighth)', price: 35.00, bundleQty: 1 },
        { id: 'sz-7g', label: '7g (Quarter)', price: 60.00, bundleQty: 1 },
        { id: 'sz-14g', label: '14g (Half Oz)', price: 100.00, bundleQty: 1 },
        { id: 'sz-28g', label: '28g (Full Oz)', price: 200.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard', stock: 20 }]
    },
    // --- FLOWER & PLANTS (PRE-ROLLS & BLUNTS) ---
    {
      id: 'roll-sherb-doja',
      name: 'Sherbinski x Doja Prerolls',
      mainCategory: 'Flower & Plants',
      subCategory: 'Pre-Rolls & Blunts',
      description: 'Exclusive Collab. Infused w/ Live Rosin. Ceramic Filter Tip. 5 Joints in EACH Pack.',
      iconName: 'Flame',
      featured: true,
      sizes: [{ id: 'sz-pk', label: '5-Pack', price: 50.00, bundleQty: 1 }],
      options: [
        { id: 'opt-bis', label: 'Biscotti (Indica)', stock: 10 },
        { id: 'opt-g41', label: 'G41 (Hybrid)', stock: 10 },
        { id: 'opt-gel', label: 'Gelonade (Sativa)', stock: 10 },
        { id: 'opt-gus', label: 'Gushers (Indica)', stock: 10 },
        { id: 'opt-pc', label: 'Pink Cherry (Hybrid)', stock: 10 }
      ]
    },
    {
      id: 'roll-pleasures-hash',
      name: 'Pleasures Hash Holes',
      mainCategory: 'Flower & Plants',
      subCategory: 'Pre-Rolls & Blunts',
      description: '1g Premium Indoor Flower + 0.2g Premium Live Rosin. Glass Filter Tip.',
      iconName: 'Flame',
      featured: true,
      sizes: [{ id: 'sz-sgl', label: 'Single Hole', price: 40.00, bundleQty: 1 }],
      options: [
        { id: 'opt-mang', label: 'Mangoneada (Hybrid)', stock: 10 },
        { id: 'opt-wb', label: 'Watermelon Blast (Hybrid)', stock: 10 },
        { id: 'opt-bf', label: 'Blueberry Faygo (Indica)', stock: 10 },
        { id: 'opt-pz', label: 'Purple Zoda (Indica)', stock: 10 },
        { id: 'opt-zt', label: 'Ztrawberry (Sativa)', stock: 10 }
      ]
    },
    {
      id: 'roll-tarantula',
      name: 'Tarantula PreRolls',
      mainCategory: 'Flower & Plants',
      subCategory: 'Pre-Rolls & Blunts',
      description: '1.5g Premium Indoor Flower. Infused with Live Resin. Rolled in Kief.',
      iconName: 'Flame',
      sizes: [{ id: 'sz-sgl', label: '1.5g Single', price: 20.00, bundleQty: 1 }],
      options: [
        { id: 'opt-abp', label: 'Atomic Bomb Pop', stock: 15 },
        { id: 'opt-br', label: 'Blue Razz', stock: 15 },
        { id: 'opt-cp', label: 'Cherry Pie', stock: 15 },
        { id: 'opt-cc', label: 'Cotton Candy', stock: 15 },
        { id: 'opt-gk', label: 'Grape Koolaid', stock: 15 },
        { id: 'opt-sj', label: 'Strawberry Jam', stock: 15 }
      ]
    },
    {
      id: 'roll-doob-toobs',
      name: 'Doob Toobs',
      mainCategory: 'Flower & Plants',
      subCategory: 'Pre-Rolls & Blunts',
      description: 'Approx. 1g PER Joint. Past Menu Favorites.',
      iconName: 'Flame',
      sizes: [
        { id: 'sz-sgl', label: '1 Joint', price: 10.00, bundleQty: 1 },
        { id: 'sz-10pk', label: '10 Pack Deal', price: 80.00, bundleQty: 1, promoLabel: '80 for 10 Deal', promoPrice: 80.00 }
      ],
      options: [
        { id: 'opt-cp', label: 'Candy Pop (H)', stock: 20 },
        { id: 'opt-bb', label: 'Bubble Bath (I)', stock: 20 },
        { id: 'opt-pm', label: 'Pink Mochi (I)', stock: 20 },
        { id: 'opt-gg', label: 'Giggle Gas (S)', stock: 20 }
      ]
    },
    // --- MERCH & EXTRAS (APPAREL & GEAR) ---
    {
      id: 'merch-deal-bag',
      name: 'Doobie Division Deal Bags',
      mainCategory: 'Merch & Extras',
      subCategory: 'Apparel & Gear',
      description: 'Mystery bag crafted based off your previous orders! The bigger the bag, the bigger the deals!',
      iconName: 'Box',
      sizes: [
        { id: 'sz-sm', label: 'Small Bag', price: 100.00, bundleQty: 1 },
        { id: 'sz-md', label: 'Medium Bag', price: 200.00, bundleQty: 1 },
        { id: 'sz-lg', label: 'Large Bag', price: 300.00, bundleQty: 1 }
      ],
      options: [{ id: 'opt-std', label: 'Standard Mix', stock: 50 }]
    },
    {
      id: 'merch-hat',
      name: 'Doobie SnapBack Hat',
      mainCategory: 'Merch & Extras',
      subCategory: 'Apparel & Gear',
      description: 'Black w/ Team Logo Patch.',
      iconName: 'Box',
      sizes: [{ id: 'sz-std', label: 'SnapBack', price: 30.00, bundleQty: 1 }],
      options: [{ id: 'opt-blk', label: 'Black', stock: 15 }]
    },
    {
      id: 'merch-megapack',
      name: 'Division Merch MegaPack',
      mainCategory: 'Merch & Extras',
      subCategory: 'Apparel & Gear',
      description: 'The Ultimate Combo: 1 of Each (Air Freshener, Tray, Lighter, Hat).',
      iconName: 'Box',
      sizes: [{ id: 'sz-combo', label: 'Full Combo', price: 50.00, bundleQty: 1 }],
      options: [{ id: 'opt-std', label: 'Standard Bundle', stock: 10 }]
    },

    // --- MERCH & EXTRAS (ACCESSORIES) ---
    {
      id: 'merch-freshener',
      name: 'Division Air Fresheners',
      mainCategory: 'Merch & Extras',
      subCategory: 'Accessories',
      description: 'Coffee Scented. Rep the Team on the Go!',
      iconName: 'Leaf',
      sizes: [{ id: 'sz-sgl', label: 'Single', price: 10.00, bundleQty: 1, promoLabel: 'Add-on Deal', promoPrice: 5.00 }],
      options: [{ id: 'opt-cof', label: 'Coffee', stock: 100 }]
    },
    {
      id: 'merch-tray',
      name: 'Division Rolling Trays',
      mainCategory: 'Merch & Extras',
      subCategory: 'Accessories',
      description: 'Approx. 6in × 4in Limited Edition Batch Metal Tray.',
      iconName: 'Box',
      sizes: [{ id: 'sz-sgl', label: 'Single Tray', price: 20.00, bundleQty: 1 }],
      options: [{ id: 'opt-std', label: 'Standard Design', stock: 30 }]
    },
    {
      id: 'merch-lighter',
      name: 'Division Lighter',
      mainCategory: 'Merch & Extras',
      subCategory: 'Accessories',
      description: 'Black w/ Team Logo.',
      iconName: 'Flame',
      sizes: [{ id: 'sz-sgl', label: 'Single Lighter', price: 5.00, bundleQty: 1 }],
      options: [{ id: 'opt-blk', label: 'Black', stock: 100 }]
    },

    // --- VAPES & PENS ---
    {
      id: "pen-raw-garden", name: "Raw Garden 1g Disposable", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "1g Disposable. Refined Live Resin. Made w/ NO Trim, NO Additives. 3 Heat Options. 'IYKYK'",
      price: 50.00, onHand: 50, featured: false, dailyDeal: false, iconName: "Flame",
      sizes: [{ id: "std", label: "1g", price: 50.00, bundleQty: 1 }],
      options: [
        { id: "rg-black-garlic", label: "Black Garlic", stock: 10 },
        { id: "rg-chem-breath", label: "Chem Breath", stock: 10 },
        { id: "rg-cherry-kush", label: "Cherry Kush Breath", stock: 10 },
        { id: "rg-fresh-water", label: "Fresh Water Taffy", stock: 10 },
        { id: "rg-gelato-clouds", label: "Gelato Clouds", stock: 10 }
      ]
    },
    {
      id: "pen-sherbinski", name: "Sherbinski Quattros", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "Premium Sherbinski Live Resin. ALL NEW Quad Heating Coil. 2g TOTAL (1g of EACH Flavor).",
      price: 50.00, onHand: 80, featured: false, dailyDeal: false, iconName: "Flame",
      sizes: [{ id: "std", label: "2g (1g x 1g)", price: 50.00, bundleQty: 1 }],
      options: [
        { id: "sq-d31-zhead", label: "D-31 (I) x Z-head (I)", stock: 10 },
        { id: "sq-xj13-whitecherry", label: "XJ-13 (S) x White Cherry (H)", stock: 10 },
        { id: "sq-cherry-lemon", label: "Cherry Gello (H) x Lemon Matcha (S)", stock: 10 },
        { id: "sq-lemon-straw", label: "Lemon Taffy (S) x Strawberry Mochi (S)", stock: 10 },
        { id: "sq-pink-cotton", label: "Pink Cherry (H) x Cotton Candy (H)", stock: 10 },
        { id: "sq-matcha-headset", label: "Matcha (H) x Headset (H)", stock: 10 },
        { id: "sq-rainbow-acai", label: "Rainbow Gello (H) x Acai (S)", stock: 10 },
        { id: "sq-perm-panna", label: "Perm-41 (I) x Panna Cotta (I)", stock: 10 }
      ]
    },
    {
      id: "pen-boutiq", name: "Boutiq Switch (V5)", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "2g Disposable, TRIPLE Tank System. Liquid Live Diamonds. Digital Screen Display.",
      price: 50.00, onHand: 20, featured: false, dailyDeal: false, iconName: "Flame",
      sizes: [{ id: "std", label: "2g Triple Tank", price: 50.00, bundleQty: 1 }],
      options: [
        { id: "bq-purple-blue-rz", label: "Purple Papaya (I) x Blue Berriez (I) x RZ-11 (I)", stock: 10 },
        { id: "bq-italian-lemon-zruntz", label: "Italian Ice (H) x Lemon Cherry (H) x Z-Runtz (I)", stock: 10 }
      ]
    },
    {
      id: "pen-packman", name: "Packman V6", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "High potency premium disposable.",
      price: 40.00, onHand: 100, featured: false, dailyDeal: false, iconName: "Box",
      sizes: [{ id: "std", label: "Standard", price: 40.00, bundleQty: 1 }],
      options: [
        { id: "pm-apple", label: "Apple Struedel", stock: 10 },
        { id: "pm-berry", label: "Berry Gelato", stock: 10 },
        { id: "pm-blueberry", label: "Blueberry Yogurt", stock: 10 },
        { id: "pm-cactus", label: "Cactus Coolerz", stock: 10 },
        { id: "pm-cherry", label: "Cherry Apple", stock: 10 },
        { id: "pm-coconut", label: "Coconut Milk", stock: 10 },
        { id: "pm-georgia", label: "Georgia Pie", stock: 10 },
        { id: "pm-miami", label: "Miami Yayo", stock: 10 },
        { id: "pm-mojito", label: "Mojito", stock: 10 },
        { id: "pm-strawberry", label: "Strawberry Frosty", stock: 10 }
      ]
    },
    {
      id: "pen-calihoney", name: "California Honey", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "Premium dual-flavor disposable.",
      price: 40.00, onHand: 50, featured: false, dailyDeal: false, iconName: "Flame",
      sizes: [{ id: "std", label: "Standard", price: 40.00, bundleQty: 1 }],
      options: [
        { id: "ch-adios-brooklyn", label: "Adios MF x Brooklyn", stock: 10 },
        { id: "ch-alien-lemon", label: "Alien Candy x Lemon", stock: 10 },
        { id: "ch-arctic-cherry", label: "Arctic Frost x Cherry", stock: 10 },
        { id: "ch-bacio-orange", label: "Bacio x Orange Sunset", stock: 10 },
        { id: "ch-purple-papaya", label: "Purple Zlushie x Papaya", stock: 10 }
      ]
    },
    {
      id: "pen-muhameds", name: "MuhaMeds Dispos", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "Full Spectrum 2g Disposables. Premium Cannabis Extract. Botanical Derived Terps.",
      price: 40.00, onHand: 100, featured: false, dailyDeal: false, iconName: "Box",
      sizes: [{ id: "std", label: "2g Full Spec", price: 40.00, bundleQty: 1 }],
      options: [
        { id: "mm-blue-slushie", label: "Blue Slushie (H)", stock: 10 },
        { id: "mm-pine-paradise", label: "Pineapple Paradise (H)", stock: 10 },
        { id: "mm-water-moon", label: "Watermelon Moonshine (H)", stock: 10 },
        { id: "mm-galactic", label: "Galactic Diesel (I)", stock: 10 },
        { id: "mm-horchata", label: "Horchata (I)", stock: 10 },
        { id: "mm-sweet-dreams", label: "Sweet Dreams OG (I)", stock: 10 },
        { id: "mm-dragonberry", label: "Dragonberry Runtz (I)", stock: 10 },
        { id: "mm-bubblegum", label: "Bubblegum Burst (S)", stock: 10 },
        { id: "mm-frozen-pom", label: "Frozen Pomegranate (S)", stock: 10 },
        { id: "mm-habibi", label: "Habibi (S)", stock: 10 }
      ]
    },
    {
      id: "pen-blinker", name: "Blinker Flips", isTopShelf: false, mainCategory: "Vapes & Pens", subCategory: "Disposables",
      description: "2g AIO device. Two Flavor Options PER Pen. Premium Quality Extracts by Blinkers Cannabis LA.",
      price: 50.00, onHand: 40, featured: false, dailyDeal: false, iconName: "Flame",
      sizes: [{ id: "std", label: "2g AIO", price: 50.00, bundleQty: 1 }],
      options: [
        { id: "bf-sundae-berry", label: "Sundae Swirl (H) x Berry Blast (H)", stock: 10 },
        { id: "bf-rainbow-honey", label: "Rainbow Sherbet (H) x Honeydew Sorbet (H)", stock: 10 },
        { id: "bf-pina-cherry", label: "Pina Colada (S) x Cherry Sorbet (H)", stock: 10 },
        { id: "bf-very-banana", label: "Very Berry Strawberry (H) x Banana Split (I)", stock: 10 }
      ]
    }
  ],
  fulfillment: {
    initialOrders: []
  },
  logistics: { vendors: [], locations: {}, catalog: [] }
};