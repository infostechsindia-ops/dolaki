export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount?: number;
  images?: string[];
  image?: string;
  category?: string;
  subCategory?: string;
  isFlado?: boolean;
  fladoStock?: number;
  generalStock?: number;
  specifications?: Record<string, string>;
  badge?: 'Bestseller' | 'New' | '10-Min Delivery' | 'Trending' | 'Special Price';
  brand?: string;
  launchDate?: string;
  sponsored?: boolean;
  trendingScore?: number;
  dealEndsAt?: string;
  colors?: string[];
  sizes?: string[];
  weight?: string;
  nutritionInfo?: string;
}


export const products: Product[] = [
  // --- GROCERIES / FRESH (FLADO EXCLUSIVE) ---
  {
    id: 'gro-1',
    name: 'Organic Bananas (Pack of 6)',
    description: 'Fresh, naturally ripened organic bananas sourced from local farms in Maharashtra. Rich in potassium and instant energy.',
    price: 60,
    originalPrice: 80,
    rating: 4.8,
    reviewsCount: 320,
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'],
    category: 'groceries',
    subCategory: 'Fruits & Vegetables',
    isFlado: true,
    fladoStock: 45,
    generalStock: 0,
    specifications: {
      'Weight': 'approx 750g-900g',
      'Country of Origin': 'India',
      'Farming Method': 'Organic'
    },
    badge: '10-Min Delivery',
    brand: 'Flado Fresh',
    launchDate: '2026-01-10',
    trendingScore: 92
  },
  {
    id: 'gro-2',
    name: 'Fresh Farm Whole Milk 1L',
    description: 'Pasteurized, homogenized whole milk with 3.5% fat content. Sourced daily and chilled to perfection.',
    price: 72,
    originalPrice: 75,
    rating: 4.7,
    reviewsCount: 450,
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80'],
    category: 'groceries',
    subCategory: 'Dairy & Bread',
    isFlado: true,
    fladoStock: 60,
    generalStock: 0,
    specifications: {
      'Volume': '1 Litre',
      'Shelf Life': '2 Days',
      'Fat Content': '3.5%'
    },
    badge: '10-Min Delivery',
    brand: 'Amul',
    launchDate: '2026-02-05',
    trendingScore: 95
  },
  {
    id: 'gro-3',
    name: 'Gourmet Sourdough Bread',
    description: 'Artisanal, freshly baked sourdough bread with a chewy interior and thick, crispy crust. No added preservatives.',
    price: 120,
    originalPrice: 150,
    rating: 4.6,
    reviewsCount: 98,
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'],
    category: 'groceries',
    subCategory: 'Dairy & Bread',
    isFlado: true,
    fladoStock: 15,
    generalStock: 100,
    specifications: {
      'Weight': '400g',
      'Allergens': 'Gluten, Wheat',
      'Baking Date': 'Baked Fresh Daily'
    },
    badge: '10-Min Delivery',
    brand: 'Blinkit Fresh',
    launchDate: '2026-03-12',
    trendingScore: 88
  },
  {
    id: 'gro-4',
    name: 'Fresh Hass Avocados (2 Pcs)',
    description: 'Premium imported Hass avocados. Rich, creamy texture, perfect for healthy salads, toast, or homemade guacamole.',
    price: 249,
    originalPrice: 299,
    rating: 4.5,
    reviewsCount: 180,
    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80'],
    category: 'groceries',
    subCategory: 'Fruits & Vegetables',
    isFlado: true,
    fladoStock: 25,
    generalStock: 0,
    specifications: {
      'Quantity': '2 Units',
      'Ripeness': 'Semi-ripe (Ready in 1-2 days)'
    },
    badge: '10-Min Delivery',
    brand: 'Flado Fresh',
    launchDate: '2026-04-18',
    trendingScore: 90
  },
  {
    id: 'gro-5',
    name: 'Classic Potato Chips (Salted) 150g',
    description: 'Thinly sliced crispy potatoes seasoned with pure sea salt. Perfect party snack or tea-time companion.',
    price: 50,
    originalPrice: 60,
    rating: 4.4,
    reviewsCount: 540,
    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80'],
    category: 'groceries',
    subCategory: 'Snacks & Munchies',
    isFlado: true,
    fladoStock: 120,
    generalStock: 0,
    specifications: {
      'Weight': '150g',
      'Dietary Preference': 'Vegetarian, Gluten-Free'
    },
    badge: '10-Min Delivery',
    brand: "Lay's",
    launchDate: '2026-05-20',
    trendingScore: 84
  },
  {
    id: 'gro-6',
    name: 'Premium Greek Yogurt (Blueberry) 150g',
    description: 'Thick, creamy Greek yogurt layered with real blueberry compote. High protein and delicious taste.',
    price: 65,
    originalPrice: 75,
    rating: 4.7,
    reviewsCount: 210,
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80'],
    category: 'groceries',
    subCategory: 'Dairy & Bread',
    isFlado: true,
    fladoStock: 40,
    generalStock: 0,
    specifications: {
      'Weight': '150g',
      'Protein': '8g per serving',
      'Flavor': 'Blueberry'
    },
    badge: 'Bestseller',
    brand: 'Nestle',
    launchDate: '2026-05-25',
    trendingScore: 96
  },

  // --- ELECTRONICS ---
  {
    id: 'ele-1',
    name: 'AuraPods Pro ANC Earbuds',
    description: 'Premium active noise-cancelling wireless earbuds with spatial audio, transparency mode, and up to 36 hours of battery life with case.',
    price: 8999,
    originalPrice: 12999,
    rating: 4.7,
    reviewsCount: 1450,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588444839799-eaa4344ebd19?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'electronics',
    subCategory: 'Audio & Wearables',
    isFlado: true,
    fladoStock: 8,
    generalStock: 250,
    specifications: {
      'Driver Size': '11mm Dynamic',
      'Bluetooth Version': '5.3',
      'Water Resistance': 'IPX4 Waterproof',
      'Battery Life': '9 Hours (Earbuds) + 27 Hours (Case)'
    },
    badge: 'Bestseller',
    brand: 'AuraTech',
    launchDate: '2026-01-15',
    sponsored: true,
    trendingScore: 99
  },
  {
    id: 'ele-2',
    name: 'AuraWatch Elite Smartwatch',
    description: 'Stunning 1.43" AMOLED screen, continuous heart rate tracking, blood oxygen monitoring, multi-sport modes, and premium leather strap.',
    price: 14999,
    originalPrice: 19999,
    rating: 4.5,
    reviewsCount: 780,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'electronics',
    subCategory: 'Audio & Wearables',
    isFlado: false,
    generalStock: 120,
    specifications: {
      'Display': '1.43" AMOLED, 466x466 pixels',
      'Battery Life': 'Up to 14 Days',
      'Sensors': 'Optical Heart Rate, SpO2, Accelerometer, Barometer'
    },
    badge: 'New',
    brand: 'Samsung',
    launchDate: '2026-02-18',
    trendingScore: 91
  },
  {
    id: 'ele-3',
    name: 'AuraSound Go Portable Speaker',
    description: 'Compact bluetooth speaker packing powerful 20W stereo sound, deep bass, and IPX7 structural waterproof casing. Perfect for pool parties.',
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 920,
    images: ['https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80'],
    category: 'electronics',
    subCategory: 'Audio & Wearables',
    isFlado: true,
    fladoStock: 12,
    generalStock: 400,
    specifications: {
      'Output Power': '20 Watts',
      'Waterproof Rating': 'IPX7',
      'Battery life': 'Up to 12 Hours'
    },
    badge: 'Special Price',
    brand: 'boAt',
    launchDate: '2026-03-01',
    trendingScore: 87
  },
  {
    id: 'ele-4',
    name: 'Ultralight ANC Gaming Headphones',
    description: 'Pro-grade wireless gaming headphones featuring ultra-low latency wireless transmitters, 50mm drivers, and crystal-clear boom microphones.',
    price: 6999,
    originalPrice: 9999,
    rating: 4.4,
    reviewsCount: 310,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'],
    category: 'electronics',
    subCategory: 'Computers & Accessories',
    isFlado: false,
    generalStock: 85,
    specifications: {
      'Drivers': '50mm Neodymium',
      'Latency': 'Under 20ms wireless',
      'Microphone': 'Detachable Cardioid'
    },
    badge: 'Trending',
    brand: 'Sony',
    launchDate: '2026-04-10',
    trendingScore: 89
  },

  // --- FASHION ---
  {
    id: 'fas-1',
    name: 'Classic Denim Trucker Jacket',
    description: 'Vintage-wash premium cotton denim jacket with button chest pockets, adjustable waist tabs, and side welt pockets. Built to last.',
    price: 2499,
    originalPrice: 3999,
    rating: 4.6,
    reviewsCount: 880,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'fashion',
    subCategory: 'Mens Wear',
    isFlado: false,
    generalStock: 180,
    specifications: {
      'Material': '100% Organic Denim Cotton',
      'Fit': 'Regular Fit',
      'Wash Care': 'Machine wash cold'
    },
    badge: 'Bestseller',
    brand: "Levi's",
    launchDate: '2025-11-20',
    trendingScore: 94
  },
  {
    id: 'fas-2',
    name: 'Linen Blend Summer Dress',
    description: 'Breezy, lightweight summer dress featuring a flattering A-line silhouette, adjustable spaghetti straps, and side pockets.',
    price: 1899,
    originalPrice: 2999,
    rating: 4.4,
    reviewsCount: 340,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80'],
    category: 'fashion',
    subCategory: 'Womens Wear',
    isFlado: false,
    generalStock: 140,
    specifications: {
      'Material': '55% Linen, 45% Viscose',
      'Length': 'Midi Length',
      'Pockets': '2 Side Pockets'
    },
    badge: 'New',
    brand: 'Zara',
    launchDate: '2026-05-01',
    trendingScore: 93
  },
  {
    id: 'fas-3',
    name: 'AuraSpeed Run Pro Sneakers',
    description: 'High-performance running shoes built with nitrogen-infused foam midsoles, engineered knit mesh uppers, and high-traction rubber outsoles.',
    price: 4599,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 1250,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
    category: 'fashion',
    subCategory: 'Footwear',
    isFlado: false,
    generalStock: 90,
    specifications: {
      'Sole Material': 'Carbon Rubber Outsole',
      'Weight': '240g (Size 8)',
      'Cushioning': 'Max Responsive'
    },
    badge: 'Trending',
    brand: 'Nike',
    launchDate: '2026-03-15',
    sponsored: true,
    trendingScore: 98
  },

  // --- BEAUTY ---
  {
    id: 'be-1',
    name: 'AuraGlow Vitamin C Face Serum',
    description: 'Advanced brightening formula containing 15% pure L-Ascorbic Acid, Ferulic Acid, and Hyaluronic Acid. Redefines skin texture and dark spots.',
    price: 799,
    originalPrice: 1199,
    rating: 4.6,
    reviewsCount: 2310,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'beauty',
    subCategory: 'Skin Care',
    isFlado: true,
    fladoStock: 35,
    generalStock: 950,
    specifications: {
      'Volume': '30 ml',
      'Active Ingredients': '15% Vitamin C, 0.5% Ferulic Acid',
      'Skin Type': 'All Skin Types'
    },
    badge: 'Bestseller',
    brand: 'AuraGlow',
    launchDate: '2026-01-20',
    trendingScore: 97
  },
  {
    id: 'be-2',
    name: 'Ceramide Barrier Relief Cream',
    description: 'Intense hydration moisturizer built with 3 critical ceramides, cholesterol, and fatty acids to rebuild damaged skin barriers.',
    price: 649,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 1120,
    images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80'],
    category: 'beauty',
    subCategory: 'Skin Care',
    isFlado: true,
    fladoStock: 22,
    generalStock: 700,
    specifications: {
      'Weight': '50g',
      'Fragrance': 'Fragrance-free',
      'pH Range': '5.5 - 6.0'
    },
    badge: 'Trending',
    brand: 'Clinique',
    launchDate: '2026-02-12',
    trendingScore: 89
  },

  // --- HOME & KITCHEN ---
  {
    id: 'hom-1',
    name: 'Smart Drip Coffee Maker',
    description: 'Programmable 12-cup coffee brewer with automated strength settings, LCD display, and double-walled thermal stainless steel carafe.',
    price: 4999,
    originalPrice: 7999,
    rating: 4.5,
    reviewsCount: 620,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'home',
    subCategory: 'Kitchen Appliances',
    isFlado: false,
    generalStock: 140,
    specifications: {
      'Capacity': '1.8L (12 Cups)',
      'Power': '900W',
      'Material': 'Stainless Steel & ABS Plastic'
    },
    badge: 'Bestseller',
    brand: 'CoffeeDay',
    launchDate: '2026-03-25',
    trendingScore: 92
  },
  {
    id: 'hom-2',
    name: 'AuraBlend High-Speed Mixer Blender',
    description: 'Equipped with a robust 1200W copper motor and three surgical-grade stainless steel jars. Crushes tough ingredients in seconds.',
    price: 3899,
    originalPrice: 5499,
    rating: 4.6,
    reviewsCount: 880,
    images: ['https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80'],
    category: 'home',
    subCategory: 'Kitchen Appliances',
    isFlado: false,
    generalStock: 210,
    specifications: {
      'Motor Power': '1200 Watts',
      'Jars Included': '3 (Wet, Dry, Chutney)',
      'Speed Levels': '3 speeds + Pulse'
    },
    badge: 'Trending',
    brand: 'Philips',
    launchDate: '2026-04-05',
    trendingScore: 86
  },

  // --- SPORTS (NEW CATEGORY FOR OVERHAUL) ---
  {
    id: 'spo-1',
    name: 'Pro Premier Match Football',
    description: 'Official FIFA-certified thermal bonded match football. Textured PU cover provides incredible durability and aerodynamically stable flight path.',
    price: 1999,
    originalPrice: 2999,
    rating: 4.7,
    reviewsCount: 420,
    images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80'],
    category: 'sports',
    subCategory: 'Team Sports',
    isFlado: true,
    fladoStock: 15,
    generalStock: 300,
    specifications: {
      'Size': '5 (Standard)',
      'Construction': 'Thermal Bonded (Seamless)',
      'Weight': '420g-440g'
    },
    badge: 'Trending',
    brand: 'Cosco',
    launchDate: '2026-05-10',
    trendingScore: 95
  },
  {
    id: 'spo-2',
    name: 'Nanoflare Badminton Racket',
    description: 'Ultra-light, head-light carbon graphite badminton racket. High tension support for powerful lightning-fast smashes and swift recovery.',
    price: 3499,
    originalPrice: 4500,
    rating: 4.6,
    reviewsCount: 230,
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80'],
    category: 'sports',
    subCategory: 'Racquet Sports',
    isFlado: false,
    generalStock: 150,
    specifications: {
      'Frame': 'HM Graphite & Nanocell Neo',
      'Weight Class': '4U (avg 83g)',
      'String Tension': 'Up to 28 lbs'
    },
    badge: 'New',
    brand: 'Yonex',
    launchDate: '2026-05-15',
    trendingScore: 90
  },

  // --- APPLIANCES (NEW CATEGORY FOR OVERHAUL) ---
  {
    id: 'app-1',
    name: 'Cyclone Cordless Stick Vacuum',
    description: 'Extremely powerful 150AW cordless stick vacuum cleaner with smart digital optical sensors that auto-adjust suction on hard floors.',
    price: 24999,
    originalPrice: 34999,
    rating: 4.8,
    reviewsCount: 190,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80'],
    category: 'appliances',
    subCategory: 'Cleaning Appliances',
    isFlado: false,
    generalStock: 45,
    specifications: {
      'Suction Power': '150 Air Watts',
      'Runtime': 'Up to 60 Minutes',
      'Filter': '99.99% HEPA Filtration'
    },
    badge: 'Bestseller',
    brand: 'Dyson',
    launchDate: '2026-04-20',
    sponsored: true,
    trendingScore: 97
  },

  // --- TOYS (NEW CATEGORY FOR OVERHAUL) ---
  {
    id: 'toy-1',
    name: 'Space Shuttle Discovery Set',
    description: 'Immersive building project containing 2354 pieces. Models the official space shuttle Discovery and Hubble Space Telescope.',
    price: 15999,
    originalPrice: 19999,
    rating: 4.9,
    reviewsCount: 120,
    images: ['https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80'],
    category: 'toys',
    subCategory: 'Building Blocks',
    isFlado: false,
    generalStock: 30,
    specifications: {
      'Pieces': '2,354 Pieces',
      'Age Recommendation': '18+ Years',
      'Dimensions': '21 Inches Long'
    },
    badge: 'New',
    brand: 'LEGO',
    launchDate: '2026-05-30',
    trendingScore: 99
  },

  // --- APPLE PRODUCTS (ELECTRONICS) ---
  {
    id: 'ele-5',
    name: 'Apple iPhone 15 Pro (128GB)',
    description: 'The first iPhone to feature an aerospace-grade titanium design, using the A17 Pro chip, a customizable Action button, and a powerful Pro camera system.',
    price: 129900,
    originalPrice: 134900,
    rating: 4.8,
    reviewsCount: 2350,
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'electronics',
    subCategory: 'Smartphones',
    isFlado: false,
    generalStock: 80,
    specifications: {
      'Processor': 'A17 Pro Chip',
      'Camera': '48MP Main | Ultra Wide | Telephoto',
      'Display': '6.1-inch Super Retina XDR',
      'Material': 'Titanium Design'
    },
    badge: 'Bestseller',
    brand: 'Apple',
    launchDate: '2026-01-20',
    trendingScore: 98
  },
  {
    id: 'ele-6',
    name: 'Apple MacBook Air M3 (13-inch)',
    description: 'Superlight, incredibly fast laptop featuring the powerful M3 chip, liquid retina display, and up to 18 hours of all-day battery life.',
    price: 114900,
    originalPrice: 119900,
    rating: 4.9,
    reviewsCount: 890,
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'electronics',
    subCategory: 'Laptops',
    isFlado: false,
    generalStock: 35,
    specifications: {
      'Chip': 'Apple M3 Chip (8-Core CPU / 10-Core GPU)',
      'Memory': '8GB Unified RAM',
      'Storage': '256GB SSD',
      'Battery': 'Up to 18 Hours'
    },
    badge: 'Trending',
    brand: 'Apple',
    launchDate: '2026-02-15',
    trendingScore: 95
  },

  // --- ADIDAS PRODUCTS (FASHION) ---
  {
    id: 'fas-4',
    name: 'Adidas Ultraboost Light Running Shoes',
    description: 'Experience epic energy with the new Ultraboost Light, the lightest Ultraboost ever made. Created with Light BOOST cushioning technology.',
    price: 18999,
    originalPrice: 19999,
    rating: 4.7,
    reviewsCount: 740,
    images: [
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'fashion',
    subCategory: 'Footwear',
    isFlado: false,
    generalStock: 95,
    specifications: {
      'Midsole': 'Light BOOST Cushioning',
      'Outsole': 'Continental Rubber',
      'Upper': 'Primeknit Textile Upper'
    },
    badge: 'Special Price',
    brand: 'Adidas',
    launchDate: '2026-03-01',
    trendingScore: 92
  },

  // --- MANYAVAR PRODUCTS (FASHION) ---
  {
    id: 'fas-5',
    name: 'Manyavar Embroidered Silk Sherwani Set',
    description: 'Elevate your festive look with this premium dupion silk sherwani set, featuring intricate floral thread embroidery and a classic mandarin collar.',
    price: 14999,
    originalPrice: 17999,
    rating: 4.6,
    reviewsCount: 110,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'fashion',
    subCategory: 'Ethnic Wear',
    isFlado: false,
    generalStock: 25,
    specifications: {
      'Fabric': 'Dupion Silk Blend',
      'Fit': 'Regular Fit',
      'Occasion': 'Festive / Wedding',
      'Care': 'Dry Clean Only'
    },
    badge: 'New',
    brand: 'Manyavar',
    launchDate: '2026-05-10',
    trendingScore: 89
  },

  // --- IKEA PRODUCTS (HOME) ---
  {
    id: 'hom-3',
    name: 'IKEA KALLAX Shelf Unit (4x4)',
    description: 'Simple, clean shelving unit that does a lot. Stand it up, lie it down, push it against a wall, or use it as a smart room divider.',
    price: 8999,
    originalPrice: 9999,
    rating: 4.8,
    reviewsCount: 1540,
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'home',
    subCategory: 'Furniture',
    isFlado: false,
    generalStock: 50,
    specifications: {
      'Material': 'Particleboard, Paper foil, Fiberboard',
      'Dimensions': '147 cm x 147 cm x 39 cm',
      'Max Load/Shelf': '13 kg'
    },
    brand: 'IKEA',
    launchDate: '2026-01-05',
    trendingScore: 94
  },
  {
    id: 'hom-4',
    name: 'IKEA POÄNG Armchair',
    description: 'Laminated bentwood frame gives the armchair a comfortable resilience, making it perfect to relax in. High back gives good support for your neck.',
    price: 6999,
    originalPrice: 7999,
    rating: 4.7,
    reviewsCount: 2310,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'home',
    subCategory: 'Furniture',
    isFlado: false,
    generalStock: 40,
    specifications: {
      'Frame': 'Layer-glued wood veneer, Birch',
      'Cushion': 'Cotton fabric with polyester fiber fill',
      'Warranty': '10-Year Limited Warranty'
    },
    badge: 'Bestseller',
    brand: 'IKEA',
    launchDate: '2026-02-18',
    trendingScore: 96
  },

  // --- LAKME PRODUCTS (BEAUTY) ---
  {
    id: 'be-3',
    name: 'Lakme Absolute Matte Lipstick (Pink)',
    description: 'Enriched with Argan oil, this lipstick delivers intense matte color payoff with rich moisture, keeping lips soft and hydrated.',
    price: 799,
    originalPrice: 950,
    rating: 4.5,
    reviewsCount: 420,
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'beauty',
    subCategory: 'Makeup',
    isFlado: true,
    fladoStock: 15,
    generalStock: 400,
    specifications: {
      'Finish': 'Matte',
      'Texture': 'Creamy Matte',
      'Ingredients': 'Infused with Argan Oil'
    },
    brand: 'Lakme',
    launchDate: '2026-03-22',
    trendingScore: 85
  },

  // --- MAMAEARTH PRODUCTS (BEAUTY) ---
  {
    id: 'be-4',
    name: 'Mamaearth Onion Hair Fall Control Shampoo',
    description: 'With Onion and Plant Keratin, this natural shampoo reduces hair fall, boosts hair growth, and strengthens hair fibers.',
    price: 349,
    originalPrice: 399,
    rating: 4.6,
    reviewsCount: 1890,
    images: [
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'beauty',
    subCategory: 'Hair Care',
    isFlado: true,
    fladoStock: 30,
    generalStock: 900,
    specifications: {
      'Volume': '250ml',
      'Certifications': 'MadeSafe Certified | Cruelty-Free',
      'Hair Type': 'Suitable for All Hair Types'
    },
    badge: 'Bestseller',
    brand: 'Mamaearth',
    launchDate: '2026-04-05',
    trendingScore: 93
  },

  // --- HALDIRAMS PRODUCTS (GROCERIES/SNACKS) ---
  {
    id: 'gro-7',
    name: 'Haldirams Aloo Bhujia 400g',
    description: 'Crispy potato mint noodles snack infused with a blend of select spices. The ultimate teatime partner for Indian households.',
    price: 110,
    originalPrice: 120,
    rating: 4.9,
    reviewsCount: 3500,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'groceries',
    subCategory: 'Snacks & Beverages',
    isFlado: true,
    fladoStock: 60,
    generalStock: 1500,
    specifications: {
      'Weight': '400g',
      'Dietary Preference': '100% Vegetarian',
      'Shelf Life': '6 Months'
    },
    badge: '10-Min Delivery',
    brand: 'Haldirams',
    launchDate: '2026-01-20',
    trendingScore: 99
  },

  // --- CADBURY PRODUCTS (GROCERIES/SNACKS) ---
  {
    id: 'gro-8',
    name: 'Cadbury Dairy Milk Silk Chocolate (150g)',
    description: 'Rich, smooth and creamy chocolate Silk that melts in your mouth for the ultimate chocolate indulgence.',
    price: 175,
    originalPrice: 195,
    rating: 4.8,
    reviewsCount: 2800,
    images: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'groceries',
    subCategory: 'Snacks & Beverages',
    isFlado: true,
    fladoStock: 50,
    generalStock: 1200,
    specifications: {
      'Weight': '150g',
      'Allergens': 'Contains Milk, Cocoa',
      'Shelf Life': '12 Months'
    },
    badge: '10-Min Delivery',
    brand: 'Cadbury',
    launchDate: '2026-02-14',
    trendingScore: 97
  },
  {
    id: "ele-7",
    name: "AuraPad Pro 11-inch Tablet",
    description: "A sleek, powerful 11-inch tablet featuring the latest Octa-core processor, stunning Liquid Retina display, and support for the AuraStylus.",
    price: 29999,
    originalPrice: 34999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Tablets",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Screen Size": "11-inch IPS LCD",
      "Processor": "Octa-core 3.2GHz",
      "RAM/Storage": "8GB/128GB",
      "Battery": "8000 mAh"
    },
    badge: "Bestseller",
    brand: "AuraTech",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "ele-8",
    name: "Sony Alpha 7 IV Mirrorless Camera",
    description: "The ultimate hybrid mirrorless camera featuring a 33MP Exmor R CMOS sensor, high-speed autofocus, and advanced 4K 60p video capabilities.",
    price: 189999,
    originalPrice: 199999,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Cameras",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Sensor Resolution": "33.0 Megapixels",
      "ISO Range": "100 - 51200",
      "Lens Mount": "Sony E-mount",
      "Video Capture": "4K 60p 10-bit"
    },
    badge: "New",
    brand: "Sony",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "ele-9",
    name: "Bose QuietComfort Ultra Headphones",
    description: "Premium over-ear wireless headphones with world-class noise cancellation, breakthrough spatial audio, and luxury comfort for long listening sessions.",
    price: 29999,
    originalPrice: 32999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Type": "Over-ear",
      "Bluetooth Version": "5.3",
      "Battery Life": "Up to 24 Hours",
      "Charging": "USB-C Fast Charge"
    },
    badge: "Trending",
    brand: "Bose",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "ele-10",
    name: "Logitech MX Master 3S Wireless Mouse",
    description: "An iconic ergonomic office mouse featuring an 8K DPI any-surface tracking sensor, MagSpeed electromagnetic scrolling, and quiet click technology.",
    price: 9499,
    originalPrice: 10999,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Sensor": "Darkfield high precision",
      "DPI Range": "200 to 8000 DPI",
      "Buttons": "7 buttons",
      "Wireless": "Logi Bolt & Bluetooth"
    },
    badge: "Special Price",
    brand: "Logitech",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "ele-11",
    name: "Dell UltraSharp 27\" 4K USB-C Hub Monitor",
    description: "Stunning 27-inch 4K monitor featuring IPS Black technology for exceptional contrast, built-in USB-C hub with 90W power delivery, and sleek design.",
    price: 34999,
    originalPrice: 39999,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Screen Size": "27 inches",
      "Resolution": "3840 x 2160 (4K)",
      "Panel Type": "IPS Black",
      "Ports": "USB-C, DisplayPort, HDMI"
    },
    brand: "Dell",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "ele-12",
    name: "HP LaserJet Pro MFP Printer",
    description: "High-speed monochrome laser multifunction printer featuring automatic two-sided printing, reliable wireless connectivity, and scanning capabilities.",
    price: 16999,
    originalPrice: 18999,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Functions": "Print, Scan, Copy",
      "Print Speed": "Up to 30 ppm",
      "Connectivity": "Wi-Fi, Ethernet, USB",
      "Duplex Printing": "Automatic"
    },
    badge: "Bestseller",
    brand: "HP",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "ele-13",
    name: "Samsung Galaxy S24 Ultra (256GB)",
    description: "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. Empowered by Galaxy AI.",
    price: 124999,
    originalPrice: 129999,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Smartphones",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Processor": "Snapdragon 8 Gen 3",
      "Display": "6.8\" Dynamic AMOLED 2X",
      "Camera": "200MP + 50MP + 12MP + 10MP",
      "Storage": "256GB / 12GB RAM"
    },
    badge: "New",
    brand: "Samsung",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "ele-14",
    name: "Apple Watch Series 9 GPS 45mm",
    description: "The smartest, most powerful Apple Watch yet. Features the S9 SiP chip, double tap gesture control, bright Always-On display, and health sensors.",
    price: 41900,
    originalPrice: 44900,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Display": "Always-On Retina",
      "Chip": "S9 SiP",
      "Case Size": "45mm",
      "Water Resistance": "Swimproof (50m)"
    },
    badge: "Trending",
    brand: "Apple",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "ele-15",
    name: "OnePlus 12 (512GB, Silky Black)",
    description: "Flagship smartphone powered by Snapdragon 8 Gen 3, 16GB LPDDR5X RAM, 512GB storage, and the 4th Gen Hasselblad Camera System for Mobile.",
    price: 69999,
    originalPrice: 74999,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Smartphones",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "16GB LPDDR5X",
      "Storage": "512GB UFS 4.0",
      "Battery": "5400 mAh (100W Charging)"
    },
    badge: "Special Price",
    brand: "OnePlus",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "ele-16",
    name: "Samsung Galaxy Tab S9 Ultra (Wi-Fi)",
    description: "Premium 14.6-inch Dynamic AMOLED 2X tablet, bundled with the S Pen. Water and dust resistant with IP68 rating, powered by Snapdragon 8 Gen 2.",
    price: 108999,
    originalPrice: 114999,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Tablets",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Display": "14.6\" Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 2",
      "Waterproof": "IP68 certified",
      "S Pen": "Included in box"
    },
    brand: "Samsung",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "ele-17",
    name: "GoPro HERO12 Black Action Camera",
    description: "The new HERO12 Black features best-in-class image quality, even better HyperSmooth video stabilization, and a huge boost in battery performance.",
    price: 37999,
    originalPrice: 45000,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Cameras",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Video Resolution": "5.3K 60fps | 4K 120fps",
      "Photo Resolution": "27 Megapixels",
      "Stabilization": "HyperSmooth 6.0",
      "Waterproof": "Up to 33ft (10m)"
    },
    badge: "Bestseller",
    brand: "GoPro",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "ele-18",
    name: "Logitech MX Keys S Wireless Keyboard",
    description: "A premium low-profile wireless keyboard that offers fluid, precise typing with smart backlighting, customizable keys, and multi-device connection.",
    price: 12999,
    originalPrice: 14999,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Key Type": "Spherically dished keys",
      "Backlight": "Smart auto-adjusting",
      "Battery": "Rechargeable Li-Po USB-C",
      "Multi-device": "Up to 3 devices"
    },
    badge: "New",
    brand: "Logitech",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "ele-19",
    name: "Bose SoundLink Flex Bluetooth Speaker",
    description: "A waterproof portable speaker that packs exceptionally crisp sound, deep bass, and extreme durability into a compact, carry-anywhere design.",
    price: 14999,
    originalPrice: 16900,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Water Resistance": "IP67 Waterproof",
      "Battery Life": "Up to 12 Hours",
      "Dimensions": "3.6\" H x 7.9\" W",
      "Weight": "590g"
    },
    badge: "Trending",
    brand: "Bose",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "ele-20",
    name: "Seagate Expansion 2TB External HDD",
    description: "Simple, high-capacity portable storage that easily plugs in via USB 3.0. Instantly drag-and-drop files to free up space on your computer.",
    price: 5499,
    originalPrice: 7999,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Capacity": "2 TB",
      "Interface": "USB 3.0 (USB 2.0 compatible)",
      "Form Factor": "2.5 inch portable",
      "Power Source": "USB Bus Powered"
    },
    badge: "Special Price",
    brand: "Seagate",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "ele-21",
    name: "Sennheiser HD 600 Open Back Headphones",
    description: "Audiophile-grade open-back dynamic stereo headphones. Known worldwide for their neutral sound signature and exceptionally wide soundstage.",
    price: 24999,
    originalPrice: 29999,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Design": "Open-back circumaural",
      "Impedance": "300 Ohms",
      "Frequency Response": "12 - 40,500 Hz",
      "Connector": "3.5mm with 6.3mm adapter"
    },
    brand: "Sennheiser",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "ele-22",
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading active noise-canceling headphones with 8 microphones, Auto NC Optimizer, and up to 30 hours of battery life.",
    price: 26999,
    originalPrice: 29999,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Noise Cancelling": "Industry Leading ANC",
      "Battery Life": "Up to 30 Hours",
      "Charging Time": "3.5 hours",
      "Bluetooth": "v5.2, Multipoint"
    },
    badge: "Bestseller",
    brand: "Sony",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "ele-23",
    name: "Anker PowerCore 20K Power Bank",
    description: "High-capacity portable charger with PowerIQ charging tech. Delivers fastest possible charge to phones, tablets, and other USB devices.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Capacity": "20,000 mAh",
      "Output Ports": "1 USB-C, 1 USB-A",
      "Input": "USB-C PD",
      "Weight": "345g"
    },
    badge: "New",
    brand: "Anker",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "ele-24",
    name: "Elgato Stream Deck MK.2",
    description: "A creative interface featuring 15 customizable LCD keys to control apps, trigger actions, launch socials, and adjust audio on the fly.",
    price: 13999,
    originalPrice: 15999,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Keys": "15 customizable LCD keys",
      "Connection": "USB 2.0",
      "Stand": "Included 45-degree angle",
      "Compatibility": "Windows 10 / macOS 10.15+"
    },
    badge: "Trending",
    brand: "Elgato",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "ele-25",
    name: "Asus ROG Swift 32\" Gaming Monitor",
    description: "High-end 32-inch 4K UHD gaming monitor featuring a blazingly fast 144Hz refresh rate, G-Sync compatibility, and stunning DisplayHDR 600 certification.",
    price: 78999,
    originalPrice: 89999,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Screen Size": "32 inches",
      "Resolution": "3840 x 2160",
      "Refresh Rate": "144Hz",
      "Response Time": "1ms (GTG)"
    },
    badge: "Special Price",
    brand: "Asus",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "ele-26",
    name: "Kindle Paperwhite (16GB, 6.8\")",
    description: "Now with a 6.8\" display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    price: 13999,
    originalPrice: 14999,
    rating: 4.2,
    reviewsCount: 753,
    images: [
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Tablets",
    isFlado: false,
    generalStock: 163,
    specifications: {
      "Display": "6.8\" flush-front Paperwhite",
      "Storage": "16GB",
      "Waterproof": "IPX8 rated",
      "Charging": "USB-C charging"
    },
    brand: "Amazon",
    launchDate: "2026-02-11",
    trendingScore: 99
  },
  {
    id: "ele-27",
    name: "OnePlus Buds Pro 2 Wireless Earbuds",
    description: "Co-created with Dynaudio, featuring Smart Adaptive Noise Cancellation, dual dynamic drivers, and up to 39 hours of battery life with case.",
    price: 9999,
    originalPrice: 11999,
    rating: 4.3,
    reviewsCount: 790,
    images: [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 170,
    specifications: {
      "Drivers": "11mm woofer + 6mm tweeter",
      "ANC Depth": "Up to 48dB",
      "Latency": "54ms ultra-low latency",
      "Waterproof": "IP55 earbuds"
    },
    badge: "Bestseller",
    brand: "OnePlus",
    launchDate: "2026-03-12",
    trendingScore: 80
  },
  {
    id: "ele-28",
    name: "TP-Link Deco X50 Mesh Wi-Fi (3-Pack)",
    description: "AX3000 Whole Home Mesh Wi-Fi 6 System. Covers up to 6,500 sq ft with super-fast, seamless Wi-Fi, connecting over 150 devices without lag.",
    price: 18999,
    originalPrice: 24999,
    rating: 4.4,
    reviewsCount: 827,
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 177,
    specifications: {
      "Wi-Fi Standard": "Wi-Fi 6 (802.11ax)",
      "Speed": "2402 Mbps (5GHz) + 574 Mbps",
      "Coverage": "Up to 6,500 sq ft",
      "Ethernet Ports": "3 Gigabit ports per unit"
    },
    badge: "New",
    brand: "TP-Link",
    launchDate: "2026-04-13",
    trendingScore: 91
  },
  {
    id: "ele-29",
    name: "DJI Mini 4 Pro Drone (RC 2)",
    description: "DJI's most advanced mini camera drone yet. Features omnidirectional obstacle sensing, 4K/60fps HDR True Vertical Shooting, and 34-min flight time.",
    price: 95999,
    originalPrice: 105000,
    rating: 4.5,
    reviewsCount: 864,
    images: [
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Cameras",
    isFlado: false,
    generalStock: 34,
    specifications: {
      "Takeoff Weight": "Under 249g",
      "Video Resolution": "4K/60fps HDR",
      "Max Flight Time": "34 Minutes",
      "Max Transmission": "20 km (O4)"
    },
    badge: "Trending",
    brand: "DJI",
    launchDate: "2026-05-14",
    trendingScore: 72
  },
  {
    id: "ele-30",
    name: "Xiaomi Pad 6 (128GB, Graphite Grey)",
    description: "Flagship 11-inch tablet with 144Hz 7-Stage Refresh Rate display, Snapdragon 870 processor, quad speakers, and long-lasting 8840mAh battery.",
    price: 26999,
    originalPrice: 39999,
    rating: 4.6,
    reviewsCount: 901,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Tablets",
    isFlado: false,
    generalStock: 41,
    specifications: {
      "Display": "11\" WQHD+, 144Hz",
      "Processor": "Snapdragon 870",
      "RAM/Storage": "6GB/128GB",
      "Battery": "8840 mAh (33W Charge)"
    },
    badge: "Special Price",
    brand: "Xiaomi",
    launchDate: "2026-06-15",
    trendingScore: 83
  },
  {
    id: "ele-31",
    name: "Razer DeathAdder V3 Pro Mouse",
    description: "Ultra-lightweight wireless ergonomic gaming mouse designed with esports pros. Features the Razer Focus Pro 30K Optical Sensor.",
    price: 11999,
    originalPrice: 14999,
    rating: 4.7,
    reviewsCount: 938,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 48,
    specifications: {
      "Weight": "63g ultra-lightweight",
      "Sensor": "Focus Pro 30K Optical",
      "Switch Type": "Optical Mouse Switches Gen-3",
      "Battery": "Up to 90 Hours"
    },
    brand: "Razer",
    launchDate: "2026-01-16",
    trendingScore: 94
  },
  {
    id: "ele-32",
    name: "HyperX QuadCast S USB Microphone",
    description: "A USB condenser microphone featuring stunning RGB lighting, an anti-vibration shock mount, tap-to-mute sensor, and 4 selectable polar patterns.",
    price: 12499,
    originalPrice: 16499,
    rating: 4.8,
    reviewsCount: 75,
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Audio & Wearables",
    isFlado: false,
    generalStock: 55,
    specifications: {
      "Polar Patterns": "Stereo, Omnidirectional, Cardioid, Bidirectional",
      "RGB Lighting": "Customizable via NGENUITY",
      "Frequency Response": "20Hz - 20kHz",
      "Sample Rate": "48kHz / 16-bit"
    },
    badge: "Bestseller",
    brand: "HyperX",
    launchDate: "2026-02-17",
    trendingScore: 75
  },
  {
    id: "ele-33",
    name: "WD Black SN850X 1TB NVMe SSD",
    description: "The ultimate PCIe Gen4 gaming SSD. Crushes load times and slashes throttling with read speeds up to 7,300 MB/s for peak performance.",
    price: 8499,
    originalPrice: 12999,
    rating: 4.9,
    reviewsCount: 112,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 62,
    specifications: {
      "Capacity": "1 TB",
      "Form Factor": "M.2 2280",
      "Interface": "PCIe Gen4 x4",
      "Max Sequential Read": "7,300 MB/s"
    },
    badge: "New",
    brand: "Western Digital",
    launchDate: "2026-03-18",
    trendingScore: 86
  },
  {
    id: "ele-34",
    name: "Nintendo Switch OLED Model",
    description: "Features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    price: 28999,
    originalPrice: 32999,
    rating: 4.1,
    reviewsCount: 149,
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Gaming",
    isFlado: false,
    generalStock: 69,
    specifications: {
      "Display": "7.0\" OLED touch screen",
      "Storage": "64 GB",
      "Battery": "Up to 9 hours",
      "Modes": "TV, Tabletop, Handheld"
    },
    badge: "Trending",
    brand: "Nintendo",
    launchDate: "2026-04-19",
    trendingScore: 97
  },
  {
    id: "ele-35",
    name: "Sony PlayStation 5 Slim Console",
    description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, and an all-new slim design.",
    price: 44999,
    originalPrice: 54999,
    rating: 4.2,
    reviewsCount: 186,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Gaming",
    isFlado: false,
    generalStock: 76,
    specifications: {
      "Storage": "1TB Custom SSD",
      "Processor": "AMD Zen 2 Custom CPU",
      "Graphics": "AMD RDNA 2 Custom GPU",
      "Optical Drive": "Ultra HD Blu-ray"
    },
    badge: "Special Price",
    brand: "Sony",
    launchDate: "2026-05-20",
    trendingScore: 78
  },
  {
    id: "ele-36",
    name: "SteelSeries Apex Pro TKL Keyboard",
    description: "The world's fastest keyboard. Features OmniPoint 2.0 adjustable mechanical switches, OLED smart display, and durable aircraft-grade aluminum frame.",
    price: 17999,
    originalPrice: 21999,
    rating: 4.3,
    reviewsCount: 223,
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 83,
    specifications: {
      "Switches": "OmniPoint 2.0 Adjustable",
      "Actuation Range": "0.2mm to 3.8mm",
      "Layout": "Tenkeyless (TKL)",
      "Frame": "Aircraft-grade Aluminum"
    },
    brand: "SteelSeries",
    launchDate: "2026-06-21",
    trendingScore: 89
  },
  {
    id: "ele-37",
    name: "Canon EOS R10 Mirrorless Camera",
    description: "A sleek mirrorless camera with an APS-C sensor, high-speed 15 fps mechanical shutter, and advanced Dual Pixel CMOS AF II tracking.",
    price: 72999,
    originalPrice: 80000,
    rating: 4.4,
    reviewsCount: 260,
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Cameras",
    isFlado: false,
    generalStock: 90,
    specifications: {
      "Sensor": "24.2MP APS-C CMOS",
      "Continuous Shooting": "Up to 15 fps",
      "Autofocus": "651 AF points, subject tracking",
      "Video": "4K 60p (cropped) | 4K 30p"
    },
    badge: "Bestseller",
    brand: "Canon",
    launchDate: "2026-01-22",
    trendingScore: 70
  },
  {
    id: "ele-38",
    name: "Apple iPad Air M2 (11-inch)",
    description: "Now powered by the M2 chip. Gorgeous Liquid Retina display, landscape 12MP front camera, and blazing-fast Wi-Fi 6E connectivity.",
    price: 59900,
    originalPrice: 64900,
    rating: 4.5,
    reviewsCount: 297,
    images: [
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Tablets",
    isFlado: false,
    generalStock: 97,
    specifications: {
      "Chip": "Apple M2 Chip",
      "Display": "11-inch Liquid Retina",
      "Storage": "128GB base",
      "Connectivity": "Wi-Fi 6E"
    },
    badge: "New",
    brand: "Apple",
    launchDate: "2026-02-23",
    trendingScore: 81
  },
  {
    id: "ele-39",
    name: "Xiaomi Mi Box 4K Streaming Media Player",
    description: "Smart 4K Ultra HD streaming media player powered by Android TV. Features built-in Chromecast, Google Assistant, and Dolby Audio support.",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 334,
    images: [
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Computers & Accessories",
    isFlado: false,
    generalStock: 104,
    specifications: {
      "Output Resolution": "4K Ultra HD (3840x2160)",
      "CPU": "Cortex-A53 Quad-core 64-bit",
      "RAM/Storage": "2GB DDR3 / 8GB eMMC",
      "OS": "Android TV"
    },
    badge: "Trending",
    brand: "Xiaomi",
    launchDate: "2026-03-24",
    trendingScore: 92
  },
  {
    id: "ele-40",
    name: "Lenovo IdeaPad Slim 3 Laptop",
    description: "Dependable, lightweight laptop featuring an Intel Core i3 12th Gen processor, a 15.6\" FHD display, and narrow bezels for comfortable viewing.",
    price: 38999,
    originalPrice: 48999,
    rating: 4.7,
    reviewsCount: 371,
    images: [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "electronics",
    subCategory: "Laptops",
    isFlado: false,
    generalStock: 111,
    specifications: {
      "Processor": "Intel Core i3-1215U",
      "RAM/Storage": "8GB DDR4 / 512GB SSD",
      "Display": "15.6\" FHD Anti-glare",
      "Weight": "1.63 kg"
    },
    badge: "Special Price",
    brand: "Lenovo",
    launchDate: "2026-04-25",
    trendingScore: 73
  },
  {
    id: "fas-6",
    name: "Men's Slim Fit Stretch Chinos",
    description: "Premium cotton blend stretch chinos featuring a slim cut, button closure, zip fly, and two functional side slash pockets.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Slim Fit",
      "Pocket Style": "Slash Pockets",
      "Stretch": "Low-to-Medium Stretch"
    },
    badge: "Bestseller",
    brand: "Zara",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "fas-7",
    name: "Women's Oversized Knit Sweater",
    description: "An oversized rib-knit sweater crafted from soft wool blend yarn. Features dropped shoulders, long sleeves, and a mock turtleneck collar.",
    price: 2499,
    originalPrice: 3499,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Material": "60% Acrylic, 30% Polyester, 10% Wool",
      "Fit": "Oversized",
      "Neckline": "Mock Turtleneck",
      "Length": "Hip Length"
    },
    badge: "New",
    brand: "H&M",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "fas-8",
    name: "Nike Air Max 90 Sneakers",
    description: "An absolute classic running sneaker. Features the legendary Max Air cushioning unit in the heel and a waffle-pattern rubber traction outsole.",
    price: 9999,
    originalPrice: 11999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Sole Material": "Rubber Waffle Outsole",
      "Cushioning": "Visible Max Air Unit",
      "Upper Material": "Leather & Mesh",
      "Style": "Retro Running"
    },
    badge: "Trending",
    brand: "Nike",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "fas-9",
    name: "Unisex Classic Canvas Backpack",
    description: "A durable daily canvas backpack with a large main zippered compartment, front accessories pocket, and fully padded adjustable shoulder straps.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Material": "Durable Canvas Polyester",
      "Capacity": "22 Liters",
      "Laptop Sleeve": "Fits up to 15.6\" Laptop",
      "Straps": "Padded Adjustable"
    },
    badge: "Special Price",
    brand: "Puma",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "fas-10",
    name: "Men's Solid Regular Polo Shirt",
    description: "Crafted from fine organic piqué cotton, this polo shirt features the iconic flag logo on the chest, a ribbed collar, and standard fit.",
    price: 3499,
    originalPrice: 4499,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Material": "100% Organic Piqué Cotton",
      "Fit": "Regular Fit",
      "Sleeve": "Short Sleeve",
      "Care": "Machine Wash Cold"
    },
    brand: "Tommy Hilfiger",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "fas-11",
    name: "Women's High Rise Skinny Jeans",
    description: "Sleek and classic skinny jeans engineered with innovative shape-holding stretch fibers to hug your curves comfortably all day long.",
    price: 3999,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Material": "79% Cotton, 19% Polyester, 2% Elastane",
      "Rise": "High Rise",
      "Fit": "Skinny through hip and thigh",
      "Leg Opening": "Skinny"
    },
    badge: "Bestseller",
    brand: "Levi's",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "fas-12",
    name: "Men's Linen Casual Button Down Shirt",
    description: "Crafted from 100% premium European flax linen. Exceptionally breathable, lightweight, and perfect for hot, muggy summer days.",
    price: 2499,
    originalPrice: 2999,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Material": "100% European Linen",
      "Fit": "Regular Relaxed",
      "Collar": "Button-down Collar",
      "Sleeve": "Long Sleeve"
    },
    badge: "New",
    brand: "Uniqlo",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "fas-13",
    name: "Women's Floral Georgette Saree",
    description: "A gorgeous floral printed georgette saree featuring a delicate gold zari border. Comes with an unstitched matching blouse piece.",
    price: 5999,
    originalPrice: 7999,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Ethnic Wear",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Fabric": "Poly-Georgette",
      "Border": "Zari Woven Border",
      "Length": "5.5 meters Saree + 0.8 meter Blouse",
      "Care": "Dry Clean Recommended"
    },
    badge: "Trending",
    brand: "Manyavar",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "fas-14",
    name: "Adidas Originals Superstar Shoes",
    description: "The legendary shell-toe sneaker that started on the basketball court and became a hip-hop and streetwear icon. Full grain leather upper.",
    price: 7999,
    originalPrice: 8999,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Upper": "Full Grain Leather",
      "Toe": "Classic Rubber Shell Toe",
      "Outsole": "Herringbone-pattern Rubber",
      "Lining": "Textile"
    },
    badge: "Special Price",
    brand: "Adidas",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "fas-15",
    name: "Leather Bifold Smart Wallet",
    description: "Slim bifold wallet made from hand-selected top grain leather. Features built-in RFID blocking technology and multiple card slots.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Material": "100% Genuine Leather",
      "Security": "RFID Blocking Technology",
      "Capacity": "6 Card Slots, 2 Bill Compartments",
      "Style": "Slim Bifold"
    },
    brand: "Tommy Hilfiger",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "fas-16",
    name: "Women's Trench Coat with Belt",
    description: "A timeless double-breasted trench coat featuring structured lapels, shoulder epaulets, adjustable buckle wrist straps, and a removable waist belt.",
    price: 6999,
    originalPrice: 8999,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Material": "Cotton Gabardine Blend",
      "Closure": "Double-breasted buttons",
      "Water Repellent": "Light rain resistant",
      "Length": "Mid-calf length"
    },
    badge: "Bestseller",
    brand: "Zara",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "fas-17",
    name: "Men's Waterproof Sports Watch",
    description: "Built for active lifestyles, this watch features a durable resin case and band, mineral glass, stopwatches, alarms, and 100m water resistance.",
    price: 4999,
    originalPrice: 5999,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Case Material": "Durable Impact Resin",
      "Water Resistance": "100 meters (10 Bar)",
      "Movement": "Quartz Digital",
      "Battery Life": "Approx 10 Years"
    },
    badge: "New",
    brand: "Casio",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "fas-18",
    name: "Women's Slip-On Ballet Flats",
    description: "Comfortable, lightweight everyday slip-on ballet flats featuring a rounded toe design, faux leather upper, and lightly cushioned insoles.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Upper": "Synthetic Faux Leather",
      "Sole": "Thermoplastic Rubber",
      "Insole": "Lightly Cushioned Foam",
      "Fit": "True to Size"
    },
    badge: "Trending",
    brand: "H&M",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "fas-19",
    name: "Men's Cotton Pajama Pants (Pack of 2)",
    description: "Comfortable, premium loungewear pants crafted from super soft woven poplin cotton. Features an elastic waistband and drawstring.",
    price: 1999,
    originalPrice: 2499,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Material": "100% Cotton Poplin",
      "Pack Quantity": "2 Pairs of Pants",
      "Waistband": "Elastic with Drawcord",
      "Pockets": "2 Side Pockets"
    },
    badge: "Special Price",
    brand: "Uniqlo",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "fas-20",
    name: "Women's Anarkali Kurta & Palazzo Set",
    description: "Stunning rayon-flared Anarkali kurta paired with comfortable wide-leg palazzo pants. Features intricate mirror and thread embroidery work.",
    price: 7999,
    originalPrice: 9999,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Ethnic Wear",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Material": "Premium Rayon Slub",
      "Embroidery": "Mirror & Thread Handwork",
      "Fit": "Flared A-line",
      "Includes": "Kurta, Palazzo & Dupatta"
    },
    brand: "Manyavar",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "fas-21",
    name: "Puma Smash V2 Sneakers",
    description: "Tennis-inspired casual sneaker featuring a soft suede leather upper, iconic formstrip detailing, and a durable vulcanized rubber outsole.",
    price: 3499,
    originalPrice: 4999,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Upper": "Premium Suede Leather",
      "Insole": "SoftFoam+ Comfort Sockliner",
      "Outsole": "Vulcanized Rubber",
      "Profile": "Low-top"
    },
    badge: "Bestseller",
    brand: "Puma",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "fas-22",
    name: "Polarized Wayfarer Sunglasses",
    description: "The most recognizable style in the history of sunglasses. Features durable acetate frames and polarized lenses for crystal-clear vision.",
    price: 9999,
    originalPrice: 11999,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Frame Material": "Acetate",
      "Lens Technology": "Polarized G-15 Glass Lenses",
      "UV Protection": "100% UV400 Protection",
      "Fit": "Standard Unisex"
    },
    badge: "New",
    brand: "Ray-Ban",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "fas-23",
    name: "Men's Crewneck Fleece Sweatshirt",
    description: "A cozy crewneck sweatshirt crafted from medium-weight cotton-blend fleece fabric. Features a soft brushed interior and ribbed cuffs.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Material": "80% Cotton, 20% Polyester",
      "Interior": "Soft Brushed Fleece",
      "Fit": "Regular Fit",
      "Care": "Machine Wash Warm"
    },
    badge: "Trending",
    brand: "H&M",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "fas-24",
    name: "Women's Pleated Midi Skirt",
    description: "High-waisted midi skirt featuring a fluid accordion pleated design, an elasticated waistband, and a luxurious satin-finish fabric.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Material": "100% Polyester Satin",
      "Waist": "Elasticated High Waist",
      "Pleating": "Accordion Pleat",
      "Length": "Midi length"
    },
    badge: "Special Price",
    brand: "Zara",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "fas-25",
    name: "Men's Formal Leather Oxford Shoes",
    description: "Sophisticated formal oxford shoes crafted from hand-polished full grain leather. Features premium Ortholite cushioning for all-day comfort.",
    price: 5999,
    originalPrice: 7999,
    rating: 4.2,
    reviewsCount: 753,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 163,
    specifications: {
      "Upper": "Full Grain Burnished Leather",
      "Insole": "Ortholite Comfort Foam",
      "Lining": "Breathable Sheepskin",
      "Construction": "Blake Welded"
    },
    brand: "Clarks",
    launchDate: "2026-02-11",
    trendingScore: 99
  },
  {
    id: "fas-26",
    name: "Women's Tote Bag with Zipper",
    description: "Spacious everyday tote bag made of high-quality faux pebbled leather. Features a secure zipper top closure and internal zipper pockets.",
    price: 3499,
    originalPrice: 4499,
    rating: 4.3,
    reviewsCount: 790,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 170,
    specifications: {
      "Material": "Pebbled Polyurethane (Faux Leather)",
      "Closure": "Top Metal Zipper",
      "Dimensions": "12\" H x 16\" W x 5\" D",
      "Compartments": "1 Main, 2 Slip, 1 Zippered"
    },
    badge: "Bestseller",
    brand: "Zara",
    launchDate: "2026-03-12",
    trendingScore: 80
  },
  {
    id: "fas-27",
    name: "Men's Nehru Jacket Silk Blend",
    description: "Add a touch of elegance to your ethnic attire with this textured silk blend Nehru jacket, featuring brass buttons and a breast pocket.",
    price: 4599,
    originalPrice: 5999,
    rating: 4.4,
    reviewsCount: 827,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Ethnic Wear",
    isFlado: false,
    generalStock: 177,
    specifications: {
      "Fabric": "Silk & Polyester Blend",
      "Design": "Woven Texture",
      "Button Type": "Premium Brass Buttons",
      "Care": "Dry Clean Only"
    },
    badge: "New",
    brand: "Manyavar",
    launchDate: "2026-04-13",
    trendingScore: 91
  },
  {
    id: "fas-28",
    name: "Nike Court Vision Low Sneakers",
    description: "Classic 80s basketball-inspired low top sneaker. Features a synthetic leather upper, perforated toe box, and supportive cupsole.",
    price: 5499,
    originalPrice: 6999,
    rating: 4.5,
    reviewsCount: 864,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 34,
    specifications: {
      "Upper": "Synthetic Leather",
      "Perforations": "Toe box airflow holes",
      "Outsole": "Rubber Cupsole",
      "Fit": "Regular Fit"
    },
    badge: "Trending",
    brand: "Nike",
    launchDate: "2026-05-14",
    trendingScore: 72
  },
  {
    id: "fas-29",
    name: "Unisex Cotton Winter Beanie",
    description: "A cozy and warm winter beanie knit with soft acrylic fibers, featuring the classic Adidas trefoil embroidered badge on the folded cuff.",
    price: 999,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 901,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 41,
    specifications: {
      "Material": "100% Soft Acrylic",
      "Knit Type": "Rib-knit construct",
      "Size": "One Size Fits Most",
      "Care": "Hand Wash Only"
    },
    badge: "Special Price",
    brand: "Adidas",
    launchDate: "2026-06-15",
    trendingScore: 83
  },
  {
    id: "fas-30",
    name: "Men's Cargo Jogger Pants",
    description: "Rugged cargo pants styled with tapered jogger leg openings, elastic cuffs, utility side cargo pockets, and a comfortable stretch fit.",
    price: 3299,
    originalPrice: 4499,
    rating: 4.7,
    reviewsCount: 938,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 48,
    specifications: {
      "Material": "97% Cotton, 3% Elastane Ripstop",
      "Fit": "Tapered Jogger Fit",
      "Cuffs": "Elasticated Jogger Cuffs",
      "Pockets": "6-pocket configuration"
    },
    brand: "Levi's",
    launchDate: "2026-01-16",
    trendingScore: 94
  },
  {
    id: "fas-31",
    name: "Women's Wrap V-Neck Maxi Dress",
    description: "A beautiful, flowing maxi dress with a true wrap-around design, plunging V-neckline, self-tie waist belt, and flutter sleeves.",
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 75,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 55,
    specifications: {
      "Material": "100% Lightweight Viscose",
      "Closure": "True Wrap with self-tie belt",
      "Neckline": "Plunging V-neck",
      "Length": "Maxi (Floor length)"
    },
    badge: "Bestseller",
    brand: "Zara",
    launchDate: "2026-02-17",
    trendingScore: 75
  },
  {
    id: "fas-32",
    name: "Men's Tailored Fit Blazer",
    description: "An impeccably tailored single-breasted blazer featuring notch lapels, dual rear vents, and a soft, structure-holding wool blend fabric.",
    price: 9999,
    originalPrice: 14999,
    rating: 4.9,
    reviewsCount: 112,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 62,
    specifications: {
      "Material": "55% Wool, 45% Polyester",
      "Fit": "Tailored Fit",
      "Vents": "Dual Side Vents",
      "Lining": "Fully Lined with Satin"
    },
    badge: "New",
    brand: "Tommy Hilfiger",
    launchDate: "2026-03-18",
    trendingScore: 86
  },
  {
    id: "fas-33",
    name: "Women's Printed Cotton Kurti",
    description: "A daily-wear casual printed kurti crafted from soft, breathable premium cotton fabric. Styled with 3/4 sleeves and side slits.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.1,
    reviewsCount: 149,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Ethnic Wear",
    isFlado: false,
    generalStock: 69,
    specifications: {
      "Fabric": "100% Pure Cotton",
      "Sleeve Length": "3/4 Sleeves",
      "Pattern": "Jaipuri block print",
      "Care": "Hand wash separately"
    },
    badge: "Trending",
    brand: "Manyavar",
    launchDate: "2026-04-19",
    trendingScore: 97
  },
  {
    id: "fas-34",
    name: "Adidas Duramo Running Shoes",
    description: "Lightweight and responsive running shoe featuring Adidas Lightmotion cushioning in the midsole and a durable Adiwear outsole.",
    price: 4599,
    originalPrice: 5999,
    rating: 4.2,
    reviewsCount: 186,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 76,
    specifications: {
      "Midsole": "LIGHTMOTION Cushioning",
      "Outsole": "Adiwear Rubber Outsole",
      "Upper": "Engineered Mesh (50% recycled)",
      "Weight": "280g (Size 9)"
    },
    badge: "Special Price",
    brand: "Adidas",
    launchDate: "2026-05-20",
    trendingScore: 78
  },
  {
    id: "fas-35",
    name: "Woven Elastic Stretch Belt",
    description: "A braided stretch belt made from durable elastic fibers, featuring a premium full grain leather tip and solid metal prong buckle.",
    price: 1199,
    originalPrice: 1699,
    rating: 4.3,
    reviewsCount: 223,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 83,
    specifications: {
      "Material": "Elastic braided webbing",
      "Trim": "100% Leather tips",
      "Buckle": "Satin-finish metal harness buckle",
      "Width": "35 mm"
    },
    brand: "Levi's",
    launchDate: "2026-06-21",
    trendingScore: 89
  },
  {
    id: "fas-36",
    name: "Women's Activewear Sports Bra",
    description: "High-support compression sports bra featuring Nike Dri-FIT moisture-wicking technology and a racerback design for maximum movement.",
    price: 2299,
    originalPrice: 2999,
    rating: 4.4,
    reviewsCount: 260,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 90,
    specifications: {
      "Material": "82% Polyester, 18% Elastane",
      "Support Level": "High Support Compression",
      "Tech": "Dri-FIT Moisture Management",
      "Back Style": "Racerback"
    },
    badge: "Bestseller",
    brand: "Nike",
    launchDate: "2026-01-22",
    trendingScore: 70
  },
  {
    id: "fas-37",
    name: "Men's Dry-Fit Athletic Shorts",
    description: "Performance training shorts made from lightweight, sweat-wicking knit fabric, featuring an elastic waist and internal drawcord.",
    price: 1699,
    originalPrice: 2299,
    rating: 4.5,
    reviewsCount: 297,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 97,
    specifications: {
      "Material": "100% Recycled Polyester",
      "Inseam": "7 Inches",
      "Technology": "Dri-FIT Sweats Wicking",
      "Pockets": "2 Mesh Side Pockets"
    },
    badge: "New",
    brand: "Nike",
    launchDate: "2026-02-23",
    trendingScore: 81
  },
  {
    id: "fas-38",
    name: "Women's Cashmere Scarf",
    description: "Luxuriously soft scarf crafted from 100% fine Inner Mongolian cashmere. Finished with traditional delicate fringe details.",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 334,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 104,
    specifications: {
      "Material": "100% Pure Cashmere",
      "Dimensions": "70\" L x 12\" W",
      "Fringe": "3-inch twisted fringe",
      "Care": "Dry Clean or Hand Wash Cold"
    },
    badge: "Trending",
    brand: "Zara",
    launchDate: "2026-03-24",
    trendingScore: 92
  },
  {
    id: "fas-39",
    name: "Unisex Slide Sandals",
    description: "The ultimate casual pool-side slides featuring a contoured, quick-dry Cloudfoam footbed and a classic 3-stripe logo bandage upper.",
    price: 1999,
    originalPrice: 2499,
    rating: 4.7,
    reviewsCount: 371,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 111,
    specifications: {
      "Footbed": "Contoured Cloudfoam",
      "Upper": "Synthetic bandage upper",
      "Sole": "Injected EVA Outsole",
      "Weight": "Ultra lightweight"
    },
    badge: "Special Price",
    brand: "Adidas",
    launchDate: "2026-04-25",
    trendingScore: 73
  },
  {
    id: "fas-40",
    name: "Men's Pure Silk Kurta Churidar Set",
    description: "A classic wedding and festive set featuring a woven pure silk kurta paired with an off-white cotton-silk blend churidar pyjama.",
    price: 8999,
    originalPrice: 11999,
    rating: 4.8,
    reviewsCount: 408,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Ethnic Wear",
    isFlado: false,
    generalStock: 118,
    specifications: {
      "Material": "80% Silk, 20% Cotton",
      "Neck": "Mandarin Collar",
      "Includes": "Kurta + Churidar Pajama",
      "Care": "Dry Clean Only"
    },
    brand: "Manyavar",
    launchDate: "2026-05-26",
    trendingScore: 84
  },
  {
    id: "fas-41",
    name: "Women's Crop Hooded Sweatshirt",
    description: "A trendy cropped hoodie made from soft, cotton-blend sweat fabric. Features an elasticized drawstring hem and dropped shoulders.",
    price: 1799,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 445,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 125,
    specifications: {
      "Material": "65% Cotton, 35% Polyester",
      "Hem": "Adjustable elastic drawcord",
      "Hood": "Double-layered with drawstrings",
      "Length": "Cropped length"
    },
    badge: "Bestseller",
    brand: "H&M",
    launchDate: "2026-06-27",
    trendingScore: 95
  },
  {
    id: "fas-42",
    name: "Men's Distressed Denim Jeans",
    description: "The classic 511 Slim Fit jeans updated with tasteful, hand-finished distressing on the thighs. Features the signature 5-pocket styling.",
    price: 3499,
    originalPrice: 4999,
    rating: 4.1,
    reviewsCount: 482,
    images: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 132,
    specifications: {
      "Material": "99% Cotton, 1% Elastane Denim",
      "Fit": "Slim Fit",
      "Fly": "Zip Fly with button",
      "Distressing": "Medium hand-sanded highlights"
    },
    badge: "New",
    brand: "Levi's",
    launchDate: "2026-01-10",
    trendingScore: 76
  },
  {
    id: "fas-43",
    name: "Women's Leather Chelsea Boots",
    description: "Elegant and versatile Chelsea boots made with premium water-resistant leather uppers, elastic side gores, and a block heel.",
    price: 6999,
    originalPrice: 8999,
    rating: 4.2,
    reviewsCount: 519,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 139,
    specifications: {
      "Upper": "Premium Water-resistant Leather",
      "Outsole": "Durable TPR block heel",
      "Insole": "Dual-density foam cushioning",
      "Heel Height": "1.5 inches"
    },
    badge: "Trending",
    brand: "Clarks",
    launchDate: "2026-02-11",
    trendingScore: 87
  },
  {
    id: "fas-44",
    name: "Canvas Messenger Crossbody Bag",
    description: "A retro-inspired canvas messenger bag with an adjustable crossbody shoulder strap, hook-and-loop flap closure, and organizational pockets.",
    price: 2199,
    originalPrice: 2999,
    rating: 4.3,
    reviewsCount: 556,
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 146,
    specifications: {
      "Material": "Heavy-duty cotton canvas",
      "Hardware": "Antique brass finish",
      "Strap Length": "Adjustable up to 55 inches",
      "Compartments": "1 Main, 1 zippered back pocket"
    },
    badge: "Special Price",
    brand: "Puma",
    launchDate: "2026-03-12",
    trendingScore: 98
  },
  {
    id: "fas-45",
    name: "Men's Wool Blend Fedora Hat",
    description: "A classic structured fedora hat crafted from a warm wool-polyester blend, finished with a stylish faux leather band around the crown.",
    price: 2499,
    originalPrice: 3499,
    rating: 4.4,
    reviewsCount: 593,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 153,
    specifications: {
      "Material": "60% Wool, 40% Polyester",
      "Band": "Faux Leather trim",
      "Brim Width": "2.5 inches",
      "Size": "Medium (58cm circumference)"
    },
    brand: "Zara",
    launchDate: "2026-04-13",
    trendingScore: 79
  },
  {
    id: "fas-46",
    name: "Women's Satin Nightwear Pyjama Set",
    description: "Luxurious nightwear pyjama set in lightweight, silky satin-weave fabric. Features a collared button-up top and matching elasticized bottoms.",
    price: 1999,
    originalPrice: 2499,
    rating: 4.5,
    reviewsCount: 630,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Womens Wear",
    isFlado: false,
    generalStock: 160,
    specifications: {
      "Material": "100% Silky Polyester Satin",
      "Top": "Long sleeve button-front shirt",
      "Bottom": "Relaxed-leg pants with elastic waist",
      "Fit": "Relaxed Fit"
    },
    badge: "Bestseller",
    brand: "H&M",
    launchDate: "2026-05-14",
    trendingScore: 90
  },
  {
    id: "fas-47",
    name: "Men's Hooded Puffer Winter Jacket",
    description: "Midweight water-resistant puffer jacket insulated with high-loft synthetic down. Features a fleece-lined hood and storm cuffs.",
    price: 12999,
    originalPrice: 16999,
    rating: 4.6,
    reviewsCount: 667,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Mens Wear",
    isFlado: false,
    generalStock: 167,
    specifications: {
      "Shell": "Water-resistant Ripstop Nylon",
      "Insulation": "High-loft Synthetic Down alternative",
      "Pockets": "2 Zippered hand pockets, 1 interior",
      "Logo": "Embroidered flag on chest"
    },
    badge: "New",
    brand: "Tommy Hilfiger",
    launchDate: "2026-06-15",
    trendingScore: 71
  },
  {
    id: "fas-48",
    name: "Women's Block Heel Sandals",
    description: "Chic open-toe dress sandals featuring a supportive block heel, slim adjustable ankle strap with metal buckle, and padded footbed.",
    price: 3899,
    originalPrice: 4999,
    rating: 4.7,
    reviewsCount: 704,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Footwear",
    isFlado: false,
    generalStock: 174,
    specifications: {
      "Upper": "Vegan Faux Suede",
      "Heel Type": "3-inch block heel",
      "Sole": "Anti-slip synthetic rubber",
      "Comfort": "Padded memory foam footbed"
    },
    badge: "Trending",
    brand: "Zara",
    launchDate: "2026-01-16",
    trendingScore: 82
  },
  {
    id: "fas-49",
    name: "Sterling Silver Stud Earrings",
    description: "Sparkling stud earrings made of certified 925 sterling silver, set with high-grade hand-selected round brilliant cut cubic zirconia.",
    price: 1299,
    originalPrice: 1999,
    rating: 4.8,
    reviewsCount: 741,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 31,
    specifications: {
      "Metal": "925 Sterling Silver",
      "Stone": "AAA+ Grade Cubic Zirconia",
      "Backing": "Push-back post",
      "Plating": "Rhodium plating (tarnish-free)"
    },
    badge: "Special Price",
    brand: "Giva",
    launchDate: "2026-02-17",
    trendingScore: 93
  },
  {
    id: "fas-50",
    name: "Men's Vintage Leather Belt",
    description: "A classic casual belt crafted from thick, durable single-cut bridle leather. Finished with an antiqued roller buckle and logo emboss.",
    price: 1599,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 778,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    category: "fashion",
    subCategory: "Accessories",
    isFlado: false,
    generalStock: 38,
    specifications: {
      "Material": "100% Full-grain Bridle Leather",
      "Buckle": "Antiqued single-prong roller buckle",
      "Width": "40 mm",
      "Care": "Wipe clean with leather conditioner"
    },
    brand: "Levi's",
    launchDate: "2026-03-18",
    trendingScore: 74
  },
  {
    id: "be-5",
    name: "Hyaluronic Acid Hydrating Serum",
    description: "A hydrating formula with ultra-pure, vegan hyaluronic acid. Offers multi-depth hydration and visible plumping without drawing water out.",
    price: 599,
    originalPrice: 799,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Volume": "30 ml",
      "Active Ingredients": "2% Hyaluronic Acid + B5",
      "Skin Type": "All skin types",
      "Texture": "Lightweight aqueous gel"
    },
    badge: "Bestseller",
    brand: "The Ordinary",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "be-6",
    name: "Matte Liquid Foundation SPF 20",
    description: "A modern shine-controlling foundation that provides a matte finish, medium-to-full buildable coverage, and broad spectrum SPF 20.",
    price: 2999,
    originalPrice: 3499,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Volume": "30 ml",
      "Coverage": "Medium to Full (buildable)",
      "Finish": "Velvet Matte",
      "SPF": "SPF 20 protection"
    },
    badge: "New",
    brand: "MAC",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "be-7",
    name: "Argan Oil Hair Mask & Conditioner",
    description: "Intense nourishing hair treatment mask enriched with cold-pressed Moroccan argan oil. Repairs damaged shafts and restores brilliant shine.",
    price: 699,
    originalPrice: 899,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Hair Care",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Weight": "200g",
      "Hair Concern": "Dry, damaged, frizzy hair",
      "Key Ingredient": "Pure Moroccan Argan Oil",
      "Free from": "Parabens, Sulfates"
    },
    badge: "Trending",
    brand: "L'Oreal",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "be-8",
    name: "Cherry Blossom Hydrating Body Wash",
    description: "A refreshing body wash that transforms into a rich cream foam. Enriched with natural jojoba oil and a delicate cherry blossom scent.",
    price: 299,
    originalPrice: 399,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Bath & Body",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Volume": "250ml",
      "Skin Type": "Dry and Normal Skin",
      "Fragrance": "Cherry Blossom & Jojoba Oil",
      "pH Balanced": "Yes (dermatologically tested)"
    },
    badge: "Special Price",
    brand: "Nivea",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "be-9",
    name: "Eau de Parfum Floral Intense 100ml",
    description: "A sophisticated, highly concentrated floral fragrance. Opens with notes of jasmine and tuberose, settling into warm amber base notes.",
    price: 6999,
    originalPrice: 7999,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Fragrance",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Volume": "100 ml",
      "Fragrance Type": "Eau de Parfum (EDP)",
      "Scent Family": "Rich Floral",
      "Key Notes": "Jasmine, Tuberose, Sandalwood"
    },
    brand: "Estee Lauder",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "be-10",
    name: "Niacinamide 10% Zinc 1% Oil Control Serum",
    description: "High-strength vitamin and mineral blemish formula that targets breakouts, minimizes pores, and regulates sebum production.",
    price: 599,
    originalPrice: 799,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Volume": "30 ml",
      "Active Ingredients": "10% Niacinamide + 1% Zinc PCA",
      "Target": "Pores, sebum excess, skin texture",
      "pH Range": "5.5 - 6.5"
    },
    badge: "Bestseller",
    brand: "The Ordinary",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "be-11",
    name: "Absolute Hydra Matte Liquid Lip Color",
    description: "Long-lasting matte liquid lipstick that doesn't dry your lips. Enriched with Hyaluronic Acid for locked-in moisture.",
    price: 649,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Finish": "Intense Matte",
      "Texture": "Lightweight Liquid-to-Matte",
      "Wear Time": "Up to 16 Hours",
      "Ingredients": "Infused with Hyaluronic Acid"
    },
    badge: "New",
    brand: "Lakme",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "be-12",
    name: "Tea Tree Anti-Dandruff Hair Oil",
    description: "Natural hair oil formulated with pure tea tree oil and ginger oil. Soothes itchy scalps and clears dandruff-causing fungal buildup.",
    price: 399,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Hair Care",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Volume": "150ml",
      "Key Ingredients": "Tea Tree Oil, Ginger Oil, Bhringraj",
      "Target Concern": "Dandruff, itchy flaky scalp",
      "Certifications": "MadeSafe Certified"
    },
    badge: "Trending",
    brand: "Mamaearth",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "be-13",
    name: "Cocoa Butter Deep Moisture Lotion",
    description: "Infused with deep moisture serum and rich cocoa butter. Provides intense hydration to dry skin for up to 48 hours.",
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Bath & Body",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Volume": "400ml",
      "Key Ingredients": "Cocoa Butter, Vitamin E",
      "Duration": "48-Hour Deep Moisture",
      "Skin Type": "Dry to Very Dry Skin"
    },
    badge: "Special Price",
    brand: "Nivea",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "be-14",
    name: "Black Waterproof Volumizing Mascara",
    description: "Get voluminous, long lashes with this waterproof formula. The unique brush coats each lash evenly without clumping.",
    price: 799,
    originalPrice: 999,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Finish": "Intense Carbon Black",
      "Type": "Waterproof Mascara",
      "Brush Type": "Volumizing fiber brush",
      "Eye Safety": "Ophthalmologist-tested"
    },
    brand: "L'Oreal",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "be-15",
    name: "Salicylic Acid 2% Exfoliating Cleanser",
    description: "A gentle exfoliating gel cleanser containing 2% salicylic acid to clear pores, dissolve dead skin cells, and prevent blemishes.",
    price: 699,
    originalPrice: 899,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Volume": "150 ml",
      "Active Ingredients": "2% Salicylic Acid (BHA)",
      "Target": "Blemish-prone skin, clogged pores",
      "Fragrance": "Fragrance-free"
    },
    badge: "Bestseller",
    brand: "The Ordinary",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "be-16",
    name: "Vitamin C Glow Clay Face Mask",
    description: "Brightening clay mask formulated with Kaolin clay, Vitamin C, and Turmeric. Gently extracts toxins while reviving natural radiance.",
    price: 499,
    originalPrice: 599,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Weight": "100g",
      "Key Ingredients": "Vitamin C, Turmeric, Kaolin Clay",
      "Skin Benefit": "Skin brightening, detoxification",
      "Free from": "Silicones, Parabens, Sulfates"
    },
    badge: "New",
    brand: "Mamaearth",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "be-17",
    name: "Woody Eau de Toilette Sport Spray",
    description: "A fresh, invigorating daily cologne spray for men. Blends crisp citrus top notes with a long-lasting cedarwood and musk base.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Fragrance",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Volume": "50 ml",
      "Fragrance Type": "Eau de Toilette (EDT)",
      "Scent Family": "Woody Citrus",
      "Wear Occasion": "Daily Wear, Post-Sport"
    },
    badge: "Trending",
    brand: "Nivea",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "be-18",
    name: "Intense Black Gel Eyeliner Kajal",
    description: "Deep black, gel-based kajal eyeliner pencil. Smudge-proof and waterproof formula that lasts up to 24 hours without fading.",
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Color": "Intense Gel Black",
      "Wear Time": "24-Hour Smudgeproof",
      "Waterproof": "Yes",
      "Application": "Smooth glide pencil"
    },
    badge: "Special Price",
    brand: "Lakme",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "be-19",
    name: "Rosemary Hair Growth Rosemary Oil",
    description: "Encourages hair thickness and stimulates growth. Enriched with natural rosemary extract, curry leaves, and methi seeds.",
    price: 449,
    originalPrice: 549,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Hair Care",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Volume": "150ml",
      "Key Ingredients": "Rosemary Extract, Methi, Curry Leaves",
      "Benefit": "Reduces hair thinning, stimulates roots",
      "Chemical Free": "100% natural, toxin-free"
    },
    brand: "Mamaearth",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "be-20",
    name: "Ultra Light Sunscreen Gel SPF 50",
    description: "Non-greasy, fast-absorbing matte gel sunscreen with PA+++ rating. Provides complete defense against UVA/UVB rays.",
    price: 549,
    originalPrice: 699,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Volume": "50g",
      "SPF Rating": "SPF 50 PA+++",
      "Texture": "Ultra-light water gel",
      "White Cast": "Zero white cast"
    },
    badge: "Bestseller",
    brand: "AuraGlow",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "be-21",
    name: "Retro Matte Lipstick Ruby Woo",
    description: "A famous, highly pigmented matte retro red lipstick. Offers an intense color payoff and completely matte finish.",
    price: 2199,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Color": "Ruby Woo (Vivid Blue-Red)",
      "Finish": "Retro Matte",
      "Weight": "3g",
      "Origin": "Made in USA"
    },
    badge: "New",
    brand: "MAC",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "be-22",
    name: "Hydro Boost Water Gel Moisturizer",
    description: "Dermatologist-recommended water-gel moisturizer that provides 72-hour continuous hydration. Formulated with aloe bio-ferment.",
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Weight": "50ml",
      "Texture": "Oil-free water gel",
      "Hydration": "72 hours auto-replenishing",
      "Fragrance": "100% Fragrance-free"
    },
    badge: "Trending",
    brand: "Clinique",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "be-23",
    name: "Keratin Smooth Sulfate-Free Shampoo",
    description: "Formulated with micro-keratin technology to smooth down hair cuticles, control frizz, and keep hair sleek and manageable for up to 3 days.",
    price: 499,
    originalPrice: 599,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Hair Care",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Volume": "340ml",
      "Active Ingredients": "Micro-Keratin, Camellia Oil",
      "Sulfate-free": "Yes",
      "Duration": "72 hours frizz control"
    },
    badge: "Special Price",
    brand: "L'Oreal",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "be-24",
    name: "Moisturizing Shaving Foam Sensitive",
    description: "Soothes sensitive skin and prevents razor irritation. Formulated with chamomile extract and witch hazel to protect the skin barrier.",
    price: 249,
    originalPrice: 299,
    rating: 4.2,
    reviewsCount: 753,
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Bath & Body",
    isFlado: false,
    generalStock: 163,
    specifications: {
      "Volume": "200ml",
      "Key Ingredients": "Chamomile, Witch Hazel",
      "Dermatologist Tested": "Yes, for sensitive skin",
      "Alcohol Content": "0% Ethyl Alcohol"
    },
    brand: "Nivea",
    launchDate: "2026-02-11",
    trendingScore: 99
  },
  {
    id: "be-25",
    name: "Prestige Luxury Night Repair Serum",
    description: "Patented nocturnal recovery serum. Synchronizes skin's natural repair process to visibly reduce lines, wrinkles, and uneven tone.",
    price: 5999,
    originalPrice: 6999,
    rating: 4.3,
    reviewsCount: 790,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 170,
    specifications: {
      "Volume": "30 ml",
      "Technology": "Chronolux Power Signal Technology",
      "Benefits": "Firming, wrinkle reduction, hydration",
      "Application": "Nightly before moisturizer"
    },
    badge: "Bestseller",
    brand: "Estee Lauder",
    launchDate: "2026-03-12",
    trendingScore: 80
  },
  {
    id: "be-26",
    name: "Mineral Loose Finishing Powder",
    description: "A lightweight, mineral-rich loose powder that sets makeup, controls shine, and provides a smooth, soft-focus matte airbrushed look.",
    price: 2499,
    originalPrice: 2999,
    rating: 4.4,
    reviewsCount: 827,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 177,
    specifications: {
      "Weight": "15g",
      "Finish": "Translucent Soft-Focus",
      "Ingredients": "Rich in multi-minerals",
      "Skin Type": "Best for Normal-to-Oily skin"
    },
    badge: "New",
    brand: "MAC",
    launchDate: "2026-04-13",
    trendingScore: 91
  },
  {
    id: "be-27",
    name: "Citrus Refreshing Hand Cream 50g",
    description: "A fast-absorbing hand cream that deeply moisturizes dry hands and cuticles, leaving behind a fresh, zesty citrus scent.",
    price: 149,
    originalPrice: 199,
    rating: 4.5,
    reviewsCount: 864,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Bath & Body",
    isFlado: false,
    generalStock: 34,
    specifications: {
      "Weight": "50g",
      "Key Ingredients": "Citrus Extracts, Almond Oil",
      "Absorption": "Non-greasy, fast absorption",
      "Packaging": "Travel-friendly tube"
    },
    badge: "Trending",
    brand: "Nivea",
    launchDate: "2026-05-14",
    trendingScore: 72
  },
  {
    id: "be-28",
    name: "Charcoal Deep Cleansing Face Wash",
    description: "Activated charcoal face wash that draws out dirt, oil, and impurities from deep within pores. Infused with natural tea tree oil.",
    price: 249,
    originalPrice: 299,
    rating: 4.6,
    reviewsCount: 901,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 41,
    specifications: {
      "Volume": "100ml",
      "Key Ingredients": "Activated Charcoal, Tea Tree Oil",
      "Target": "Pollution defense, oil control",
      "Sulfate-Free": "Yes"
    },
    badge: "Special Price",
    brand: "Mamaearth",
    launchDate: "2026-06-15",
    trendingScore: 83
  },
  {
    id: "be-29",
    name: "Professional Hair Straightening Cream",
    description: "An advanced permanent hair straightening cream kit. Smooths out curls and tight waves while protecting hair fibers with cationic polymers.",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewsCount: 938,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Hair Care",
    isFlado: false,
    generalStock: 48,
    specifications: {
      "Kit Contents": "Straightening Cream (100ml) + Neutralizer (100ml)",
      "Hair Type": "Thick, curly, resistant hair",
      "Application": "Professional salons only",
      "Technology": "X-Tenso Moisturist"
    },
    brand: "L'Oreal",
    launchDate: "2026-01-16",
    trendingScore: 94
  },
  {
    id: "be-30",
    name: "Velvet Matte Eyeshadow Palette 12-Color",
    description: "Features 12 highly pigmented velvety smooth eyeshadow shades, ranging from everyday neutrals to sparkling jewel tones.",
    price: 999,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 75,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Makeup",
    isFlado: false,
    generalStock: 55,
    specifications: {
      "Shades": "12 unique colors",
      "Finish": "Matte, Shimmer & Metallic",
      "Applicator": "Dual-ended brush included",
      "Blendability": "Seamless ultra-fine powder"
    },
    badge: "Bestseller",
    brand: "Lakme",
    launchDate: "2026-02-17",
    trendingScore: 75
  },
  {
    id: "be-31",
    name: "Gold Radiance Youthful Day Cream",
    description: "Enriched with real gold micro-particles and SPF 30. Rehydrates skin, reduces fine lines, and reveals a youthful, radiant complexion.",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 112,
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 62,
    specifications: {
      "Weight": "50g",
      "Sun Protection": "SPF 30 PA++",
      "Active Ingredients": "Real Gold Micro-particles, Vitamin B3",
      "Skin Concern": "Anti-aging, dullness"
    },
    badge: "New",
    brand: "Lakme",
    launchDate: "2026-03-18",
    trendingScore: 86
  },
  {
    id: "be-32",
    name: "Lavender Calming Sleep Body Spray",
    description: "A relaxing mist blended with pure essential oils of lavender and chamomile. Spray on body or pillows to promote deep, restful sleep.",
    price: 499,
    originalPrice: 699,
    rating: 4.1,
    reviewsCount: 149,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Fragrance",
    isFlado: false,
    generalStock: 69,
    specifications: {
      "Volume": "100ml",
      "Key Ingredients": "Pure Lavender & Chamomile Oils",
      "Usage": "Pillow mist and body spray",
      "Cruelty Free": "Yes"
    },
    badge: "Trending",
    brand: "AuraGlow",
    launchDate: "2026-04-19",
    trendingScore: 97
  },
  {
    id: "be-33",
    name: "Onion Hair Serum for Frizz-Free Hair",
    description: "Formulated with onion seed extract and olive oil. Tames flyaways, prevents hair breakage, and leaves hair silky, shiny, and tangle-free.",
    price: 299,
    originalPrice: 349,
    rating: 4.2,
    reviewsCount: 186,
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Hair Care",
    isFlado: false,
    generalStock: 76,
    specifications: {
      "Volume": "100ml",
      "Key Ingredients": "Onion Seed Extract, Olive Oil",
      "Silicones": "Free from harmful silicones",
      "Benefit": "Reduces frizz, provides shine"
    },
    badge: "Special Price",
    brand: "Mamaearth",
    launchDate: "2026-05-20",
    trendingScore: 78
  },
  {
    id: "be-34",
    name: "Aloe Vera Soothing Gel",
    description: "100% pure organic aloe vera gel harvested from organic farms. Soothes sunburns, hydrates dry skin, and calms redness.",
    price: 249,
    originalPrice: 299,
    rating: 4.3,
    reviewsCount: 223,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 83,
    specifications: {
      "Volume": "150g",
      "Purity": "99% Pure Organic Aloe Vera",
      "Free from": "Parabens, Colorants, Alcohol",
      "Skin Type": "Sensitive and all skin types"
    },
    brand: "AuraGlow",
    launchDate: "2026-06-21",
    trendingScore: 89
  },
  {
    id: "be-35",
    name: "Ultimate Hydrating Lip Balm (Berry)",
    description: "Keeps lips deeply hydrated for 24 hours. Features a subtle red berry tint and a delicious fruity aroma.",
    price: 149,
    originalPrice: 199,
    rating: 4.4,
    reviewsCount: 260,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "beauty",
    subCategory: "Skin Care",
    isFlado: false,
    generalStock: 90,
    specifications: {
      "Weight": "4.8g",
      "Tint": "Subtle Red Berry Tint",
      "Hydration": "24-hour melt-in moisture",
      "Ingredients": "Natural oils, Shea Butter"
    },
    badge: "Bestseller",
    brand: "Nivea",
    launchDate: "2026-01-22",
    trendingScore: 70
  },
  {
    id: "hom-5",
    name: "Stainless Steel 3-Tier Steamer Cooker",
    description: "Versatile 3-tier food steamer crafted from food-grade stainless steel, featuring a tempered glass lid and heat-resistant handles.",
    price: 1999,
    originalPrice: 2999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Cookware",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Material": "Food-grade Stainless Steel",
      "Capacity": "5.5 Liters",
      "Number of Tiers": "3 Tiers",
      "Induction Base": "Yes"
    },
    badge: "Bestseller",
    brand: "Prestige",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "hom-6",
    name: "IKEA LACK Side Table (55x55 cm)",
    description: "Lightweight, easy to assemble side table. Matches other products in the LACK series and fits perfectly in small spaces.",
    price: 999,
    originalPrice: 1499,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Furniture",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Material": "Particleboard, Honeycomb paper filling",
      "Dimensions": "55 cm x 55 cm x 45 cm",
      "Max Load": "25 kg",
      "Weight": "3.9 kg"
    },
    badge: "New",
    brand: "IKEA",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "hom-7",
    name: "Digital Multi-Cooker Air Fryer 4L",
    description: "Cook healthy meals with up to 90% less oil. 12-in-1 cooking functions including air fry, bake, grill, roast, and reheat.",
    price: 6999,
    originalPrice: 9999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Capacity": "4.1 Liters",
      "Power": "1400 Watts",
      "Temperature": "80°C - 200°C",
      "Pan Coating": "Non-stick PTFE"
    },
    badge: "Trending",
    brand: "Philips",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "hom-8",
    name: "Microfiber King Size Bed Sheet Set",
    description: "Super soft, breathable double bed sheet set made from premium brushed microfiber. Wrinkle, fade, and stain resistant.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Bedding",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Material": "Brushed Microfiber (120 GSM)",
      "Thread Count": "250 TC",
      "Dimensions": "108 x 108 inches (King)",
      "Includes": "1 Bed Sheet + 2 Pillow Cases"
    },
    badge: "Special Price",
    brand: "D'Decor",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "hom-9",
    name: "Hand-Woven Cotton Area Rug (5x7 ft)",
    description: "Add warmth to your living room with this hand-woven natural cotton area rug, featuring a modern geometric print.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Home Decor",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Material": "100% Woven Cotton",
      "Dimensions": "5 ft x 7 ft (150cm x 210cm)",
      "Style": "Scandinavian Geometric",
      "Care": "Dry clean only"
    },
    brand: "HomeCentre",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "hom-10",
    name: "Non-Stick Die-Cast Cookware Set (3 Pcs)",
    description: "Premium die-cast aluminum cookware set featuring a healthy PFOA-free non-stick coating, soft-touch ergonomic handles, and glass lids.",
    price: 3499,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Cookware",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Material": "Die-cast Aluminum",
      "Coating": "5-Layer Meta-Tuff non-stick",
      "Pieces Included": "Kadahi, Fry Pan, Dosa Tawa",
      "Thickness": "3.5 mm"
    },
    badge: "Bestseller",
    brand: "Wonderchef",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "hom-11",
    name: "IKEA BILLY Bookcase (80x28x202 cm)",
    description: "The world's most versatile bookcase. Features adjustable shelves to help you customize your storage space as needs grow.",
    price: 5999,
    originalPrice: 6999,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Furniture",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Material": "Particleboard, Paper foil, Melamine",
      "Dimensions": "80 cm x 28 cm x 202 cm",
      "Max Load/Shelf": "30 kg",
      "Shelves": "5 adjustable shelves"
    },
    badge: "New",
    brand: "IKEA",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "hom-12",
    name: "Glass Electric Kettle 1.7L",
    description: "Elegant Schott Duran glass electric kettle with blue LED light indicator, auto-shut off dry protection, and flat heating element.",
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Capacity": "1.7 Liters",
      "Power": "1800W - 2200W",
      "Body Material": "Schott Duran Borosilicate Glass",
      "Base": "360 degree cordless base"
    },
    badge: "Trending",
    brand: "Philips",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "hom-13",
    name: "Reversible Cotton Comforter Double Bed",
    description: "A cozy double bed comforter filled with high-loft hypoallergenic microfiber. Reversible design with complementary color tones.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Bedding",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Material": "100% Woven Cotton Shell",
      "Fill Material": "200 GSM Siliconized Microfiber",
      "Dimensions": "90 x 100 inches",
      "Hypoallergenic": "Yes"
    },
    badge: "Special Price",
    brand: "D'Decor",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "hom-14",
    name: "Set of 3 Ceramic Planter Pots",
    description: "Beautifully glazed, hand-crafted ceramic planter pots in various pastel shades. Complete with drainage holes and saucers.",
    price: 1199,
    originalPrice: 1699,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Home Decor",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Material": "Glazed Ceramic",
      "Quantity": "3 Pots of varying sizes",
      "Drainage Hole": "Yes",
      "Pots Dimensions": "Diameter 4\", 5\", 6\""
    },
    brand: "HomeCentre",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "hom-15",
    name: "Pressure Cooker 5 Litre (Induction Base)",
    description: "Heavy-duty aluminum pressure cooker with anodized outer body, safety metallic plug, and durable gasket release system.",
    price: 2199,
    originalPrice: 2999,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Cookware",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Capacity": "5 Litres",
      "Material": "Virgin Aluminum",
      "Base": "Alpha induction base",
      "Warranty": "5 Years"
    },
    badge: "Bestseller",
    brand: "Prestige",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "hom-16",
    name: "IKEA EKET Cabinet Combination",
    description: "A clever small cabinet to store all your smaller items. Can be wall-mounted or placed directly on the floor with legs.",
    price: 3999,
    originalPrice: 4999,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Furniture",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Material": "Particleboard, Fiberboard, Honeycomb paper",
      "Dimensions": "35 cm x 35 cm x 35 cm",
      "Mounting": "Wall-mount rails included",
      "Max Load": "5 kg"
    },
    badge: "New",
    brand: "IKEA",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "hom-17",
    name: "Nutri-Blend Compact Bullet Blender",
    description: "India's favorite blender-grinder. Features a powerful 400W 22000 RPM motor and super-sharp stainless steel extraction blades.",
    price: 2899,
    originalPrice: 3999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Motor Power": "400 Watts",
      "Speed": "22,000 RPM",
      "Jars": "2 Jars (500ml and 300ml)",
      "Blades": "Surgical grade stainless steel"
    },
    badge: "Trending",
    brand: "Wonderchef",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "hom-18",
    name: "Memory Foam Ergonomic Pillow",
    description: "Contoured memory foam pillow designed to support cervical alignment. Reduces neck stiffness and improves sleep posture.",
    price: 1299,
    originalPrice: 1999,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Bedding",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Material": "Slow-rebound Memory Foam",
      "Cover": "Bamboo fiber zipper cover",
      "Dimensions": "24 x 14 x 4.5 inches",
      "Firmness": "Medium-Firm"
    },
    badge: "Special Price",
    brand: "D'Decor",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "hom-19",
    name: "Decorative Metal Wall Art Sculpture",
    description: "Three-dimensional metal wall sculpture depicting Ginkgo Biloba leaves. Finished in antique gold and teal blue rustproof paint.",
    price: 2499,
    originalPrice: 3499,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Home Decor",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Material": "100% Wrought Iron",
      "Dimensions": "36\" W x 18\" H",
      "Finish": "Rust-resistant gold & teal powder coat",
      "Mounting": "Rear loop hangers"
    },
    brand: "HomeCentre",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "hom-20",
    name: "Hard Anodized Kadaipur Fry Pan 3L",
    description: "Made from heavy gauge virgin aluminum. Anodized surface is harder than steel, non-reactive with acidic foods, and scratch-resistant.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Cookware",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Material": "Hard Anodized Aluminum",
      "Capacity": "3.0 Litres",
      "Lid": "Stainless steel lid included",
      "Induction compatible": "Yes"
    },
    badge: "Bestseller",
    brand: "Prestige",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "hom-21",
    name: "IKEA MALM 3-Drawer Chest",
    description: "A clean expression that fits right in, in the bedroom or wherever you place it. Smooth-running drawers with pull-out stop.",
    price: 7999,
    originalPrice: 8999,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Furniture",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Material": "Particleboard, Oak wood veneer",
      "Dimensions": "80 cm x 78 cm x 48 cm",
      "Drawer Depth": "43 cm",
      "Wall Anchor": "Included (Safety recommendation)"
    },
    badge: "New",
    brand: "IKEA",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "hom-22",
    name: "Pop-up 2-Slice Toaster 800W",
    description: "Compact toaster with 8 browning settings and integrated bun warming rack. Cancel button lets you stop toasting at any moment.",
    price: 1799,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Power": "800 Watts",
      "Browning Settings": "8 Levels",
      "Toast Slots": "2 self-centering slots",
      "Special Feature": "Integrated bun warmer"
    },
    badge: "Trending",
    brand: "Philips",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "hom-23",
    name: "Blackout Window Curtains (Pack of 2)",
    description: "Heavy triple-weave blackout curtains that block 95% of sunlight and UV rays. Helps insulate rooms thermally.",
    price: 1999,
    originalPrice: 2999,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Home Decor",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Material": "100% Polyester Triple-weave",
      "Dimensions": "7 ft x 4 ft (Door length)",
      "Hanging": "Rustproof eyelet rings (8 rings)",
      "Pack": "Set of 2 curtains"
    },
    badge: "Special Price",
    brand: "D'Decor",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "hom-24",
    name: "Bamboo Fiber Dinnerware Set (12 Pcs)",
    description: "Eco-friendly, lightweight, and biodegradable dinnerware set made of organic bamboo fibers. BPA-free and dishwasher safe.",
    price: 1699,
    originalPrice: 2499,
    rating: 4.2,
    reviewsCount: 753,
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Cookware",
    isFlado: false,
    generalStock: 163,
    specifications: {
      "Material": "Natural Organic Bamboo Fiber",
      "Set Includes": "4 Dinner Plates, 4 Bowls, 4 Tumblers",
      "FDA Approved": "Yes",
      "Microwave Safe": "No (not recommended)"
    },
    brand: "Wonderchef",
    launchDate: "2026-02-11",
    trendingScore: 99
  },
  {
    id: "hom-25",
    name: "Foldable Orthopedic Mattress Double",
    description: "High density foam mattress offering orthopedic back support. Features a foldable 3-panel design for easy storage and portability.",
    price: 5499,
    originalPrice: 7999,
    rating: 4.3,
    reviewsCount: 790,
    images: [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Bedding",
    isFlado: false,
    generalStock: 170,
    specifications: {
      "Material": "High-density HR Foam",
      "Dimensions": "72 x 48 x 4 inches",
      "Foldability": "Tri-fold design",
      "Cover": "Washable jacquard weave"
    },
    badge: "Bestseller",
    brand: "HomeCentre",
    launchDate: "2026-03-12",
    trendingScore: 80
  },
  {
    id: "hom-26",
    name: "IKEA BJURSTA Extendable Table",
    description: "Extendable dining table with 2 extra leaves seats 4-6. Enables you to quickly adapt the table size to your hosting needs.",
    price: 12999,
    originalPrice: 14999,
    rating: 4.4,
    reviewsCount: 827,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Furniture",
    isFlado: false,
    generalStock: 177,
    specifications: {
      "Material": "Particleboard, Ash veneer, solid pine",
      "Dimensions": "90/129/168 cm x 90 cm x 74 cm",
      "Seats": "4 to 6 people",
      "Finish": "Clear acrylic lacquer"
    },
    badge: "New",
    brand: "IKEA",
    launchDate: "2026-04-13",
    trendingScore: 91
  },
  {
    id: "hom-27",
    name: "Induction Cooktop 2000W Touch Control",
    description: "High power induction cooktop featuring pre-programmed Indian menu options, automatic voltage regulator, and feather-touch panel.",
    price: 2999,
    originalPrice: 4299,
    rating: 4.5,
    reviewsCount: 864,
    images: [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 34,
    specifications: {
      "Power": "2000 Watts",
      "Panel Type": "Feather Touch Controls",
      "Keep Warm": "Automatic keep warm function",
      "Indian Menus": "8 preset modes"
    },
    badge: "Trending",
    brand: "Prestige",
    launchDate: "2026-05-14",
    trendingScore: 72
  },
  {
    id: "hom-28",
    name: "Aromatic Reed Diffuser Set (Lavender)",
    description: "Infuse your home with calm aromatherapy. Set includes a decorative glass jar, 100ml lavender essential oil, and 8 rattan reeds.",
    price: 699,
    originalPrice: 999,
    rating: 4.6,
    reviewsCount: 901,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Home Decor",
    isFlado: false,
    generalStock: 41,
    specifications: {
      "Oil Capacity": "100ml",
      "Fragrance": "French Lavender",
      "Reed Material": "Natural Rattan Reeds",
      "Duration": "Lasts up to 60 days"
    },
    badge: "Special Price",
    brand: "HomeCentre",
    launchDate: "2026-06-15",
    trendingScore: 83
  },
  {
    id: "hom-29",
    name: "Granite Stone Coating Fry Pan 24cm",
    description: "Heavy-duty forged aluminum frypan coated with 5 layers of PFOA-free grey granite stone particles. Highly scratch-resistant.",
    price: 1199,
    originalPrice: 1799,
    rating: 4.7,
    reviewsCount: 938,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Cookware",
    isFlado: false,
    generalStock: 48,
    specifications: {
      "Diameter": "24 cm",
      "Thickness": "4.0 mm",
      "Coating": "Granite stone PFOA-free nonstick",
      "Induction Friendly": "Yes"
    },
    brand: "Wonderchef",
    launchDate: "2026-01-16",
    trendingScore: 94
  },
  {
    id: "hom-30",
    name: "Luxurious Cotton Bath Towels (Pack of 4)",
    description: "Pack of 4 matching ultra-absorbent bath towels woven with 100% long-staple combed cotton ringspun yarn. 600 GSM weight.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 75,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ],
    category: "home",
    subCategory: "Bedding",
    isFlado: false,
    generalStock: 55,
    specifications: {
      "Material": "100% Combed Ringspun Cotton",
      "Weight": "600 GSM (Heavyweight)",
      "Dimensions": "30 x 60 inches",
      "Pack Contents": "4 Bath Towels"
    },
    badge: "Bestseller",
    brand: "D'Decor",
    launchDate: "2026-02-17",
    trendingScore: 75
  },
  {
    id: "spo-3",
    name: "Premium Cricket Bat Poplar Willow",
    description: "Lightweight poplar willow cricket bat designed for leather or tennis ball cricket. Equipped with a premium cane handle for shock absorption.",
    price: 1299,
    originalPrice: 1999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Team Sports",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Willow Type": "Premium Poplar Willow",
      "Handle": "Full Cane Handle",
      "Weight": "1050-1120g",
      "Ideal for": "Intermediate / Casual Play"
    },
    badge: "Bestseller",
    brand: "Cosco",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "spo-4",
    name: "Carbon Fiber Tennis Racket",
    description: "Pro-grade carbon fiber tennis racket offering high torsional stiffness, huge sweet spot, and vibration dampening technology.",
    price: 4999,
    originalPrice: 6999,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Racquet Sports",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Frame": "HM Graphite & Carbon Fiber",
      "Weight": "290g (unstrung)",
      "Head Size": "100 sq. inches",
      "String Pattern": "16 x 19"
    },
    badge: "New",
    brand: "Yonex",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "spo-5",
    name: "Adjustable Dumbbell Set 20kg",
    description: "Highly versatile strength training kit containing cast-iron weight plates, 2 chrome dumbbell bars, and 4 secure spinlock collars.",
    price: 3999,
    originalPrice: 5999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Total Weight": "20 kg",
      "Plates": "4x 2.5kg, 4x 1.25kg, 4x 0.5kg",
      "Bars": "2x Solid Chrome Bars (2.0kg each)",
      "Collars": "4x Star Spinlocks"
    },
    badge: "Trending",
    brand: "Decathlon",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "spo-6",
    name: "Waterproof Camping Dome Tent 3-Person",
    description: "Easy to pitch 3-person dome tent featuring a waterproof flysheet, tub floor, and ventilation panels to reduce condensation.",
    price: 4599,
    originalPrice: 5999,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Outdoor & Adventure",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Capacity": "3 Persons",
      "Waterproof Rating": "2000mm Polyurethane coating",
      "Frame": "Fiberglass poles",
      "Weight": "3.4 kg"
    },
    badge: "Special Price",
    brand: "Decathlon",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "spo-7",
    name: "Fitbit Charge 6 Fitness Tracker",
    description: "Advanced fitness tracker with built-in GPS, continuous heart rate tracking, Sleep Score, stress management tools, and Google Maps integration.",
    price: 14999,
    originalPrice: 16999,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Screen": "Color AMOLED touchscreen",
      "GPS": "Built-in GPS + GLONASS",
      "Battery Life": "Up to 7 Days",
      "Sensors": "Optical HR, EDA sensor, ECG app"
    },
    brand: "Fitbit",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "spo-8",
    name: "Synthetic Leather Basketball Size 7",
    description: "Official size 7 basketball constructed with composite synthetic leather, deep pebbling for control, and a nylon-wound butyl bladder.",
    price: 899,
    originalPrice: 1299,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Team Sports",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Size": "7 (Standard Male)",
      "Material": "Composite Synthetic Leather",
      "Construction": "12-Panel deep channel",
      "Bladder": "Butyl bladder (retains pressure)"
    },
    badge: "Bestseller",
    brand: "Nivia",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "spo-9",
    name: "Carbon Graphite Squash Racket",
    description: "A head-light squash racket engineered for quick defensive maneuvers. Features a tear-drop head shape for high power output.",
    price: 3499,
    originalPrice: 4500,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Racquet Sports",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Frame": "Carbon Graphite",
      "Weight": "135g (unstrung)",
      "Balance": "Head Light",
      "Factory String": "Yonex Synthetic Gut"
    },
    badge: "New",
    brand: "Yonex",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "spo-10",
    name: "Non-Slip Eco-Friendly Yoga Mat 6mm",
    description: "Crafted from TPE, a biodegradable and non-toxic material. Features dual-sided non-slip textures and 6mm thickness for joint cushioning.",
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Material": "TPE (Thermal Plastic Elastomer)",
      "Thickness": "6 mm",
      "Dimensions": "72 x 24 inches",
      "Weight": "850g"
    },
    badge: "Trending",
    brand: "Decathlon",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "spo-11",
    name: "Heavy Duty Hiking Backpack 50L",
    description: "Technical trekking backpack featuring an adjustable back harness, padded hip belt, bottom rain-cover compartment, and trekking pole loops.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Outdoor & Adventure",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Capacity": "50 Liters",
      "Material": "600D Ripstop Polyester",
      "Rain Cover": "Included (fluorescent yellow)",
      "Weight": "1.6 kg"
    },
    badge: "Special Price",
    brand: "Decathlon",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "spo-12",
    name: "Leather Wicket Keeping Gloves",
    description: "Professional wicket keeping gloves made from premium supple aniline leather. Features octopus-grip rubber sheet on palms.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Team Sports",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Palms": "Octopus-grip high friction rubber",
      "Material": "Full Grain Sheepskin Leather",
      "Cuffs": "Padded leather cuffs",
      "Ideal for": "Professional Club matches"
    },
    brand: "Cosco",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "spo-13",
    name: "Nylon Shuttlecocks Yellow (Pack of 6)",
    description: "Precision-manufactured nylon shuttlecocks that mimic feather shuttlecock flight. Yellow skirt for high visibility indoors.",
    price: 799,
    originalPrice: 999,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Racquet Sports",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Skirt Material": "Premium Nylon",
      "Base": "Natural Portuguese Cork",
      "Quantity": "Pack of 6 shuttlecocks",
      "Speed": "Medium"
    },
    badge: "Bestseller",
    brand: "Yonex",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "spo-14",
    name: "Resistance Loop Bands (Set of 5)",
    description: "A set of 5 natural latex loop resistance bands with varying tension levels (Extra Light to Extra Heavy). Includes travel pouch.",
    price: 499,
    originalPrice: 799,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Material": "100% Natural Malaysian Latex",
      "Quantity": "Set of 5 bands",
      "Tension Range": "5 lbs to 40 lbs",
      "Accessories": "Mesh carry pouch + instruction manual"
    },
    badge: "New",
    brand: "Decathlon",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "spo-15",
    name: "High Performance Sports Water Bottle",
    description: "BPA-free high density polyethylene squeeze water bottle with a leak-proof jet valve cap. Easy clean wide-mouth design.",
    price: 699,
    originalPrice: 999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Capacity": "750 ml",
      "Material": "BPA-free Polyethylene",
      "Cap Style": "Leakproof Jet Valve",
      "Weight": "75g"
    },
    badge: "Trending",
    brand: "Puma",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "spo-16",
    name: "Premium Leather Cricket Match Ball",
    description: "Alum tanned four-piece red leather cricket ball. Wounded with high quality cork and wool yarn. Suitable for 50-over matches.",
    price: 499,
    originalPrice: 799,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Team Sports",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Material": "Alum-tanned English Leather",
      "Construction": "4-piece hand-stitched seam",
      "Weight": "156g (Standard)",
      "Core": "Layered cork and rubber core"
    },
    badge: "Special Price",
    brand: "Nivia",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "spo-17",
    name: "Racquet Cover Bag Dual Compartment",
    description: "Dual compartment bag built to carry up to 6 badminton rackets or 3 tennis rackets. Features dedicated wet/dry clothing sleeve.",
    price: 1199,
    originalPrice: 1699,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Racquet Sports",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Material": "Durable 600D Poly PVC",
      "Racket Capacity": "Up to 6 Badminton rackets",
      "Straps": "Dual padded backpack straps",
      "Compartments": "2 Large mains, 1 shoe pocket"
    },
    brand: "Yonex",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "spo-18",
    name: "Home Gym Pull-Up Bar Doorway",
    description: "Adjustable heavy-duty steel pull-up bar that fits secure inside standard door frames. Transparent rubber pads prevent wall markings.",
    price: 1299,
    originalPrice: 1999,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Material": "Reinforced Carbon Steel",
      "Adjustable Range": "70 cm to 95 cm",
      "Max Capacity": "100 kg (un-screwed) | 120 kg (screwed)",
      "Grips": "Sweat-wicking Neoprene foam"
    },
    badge: "Bestseller",
    brand: "Decathlon",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "spo-19",
    name: "Aluminum Alloy Trekking Poles (Pair)",
    description: "Lightweight 6061 aluminum alloy trekking poles with secure flip-lock telescopic extension and ergonomic cork grips.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Outdoor & Adventure",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Material": "6061 Aircraft Aluminum",
      "Mechanism": "Telescopic Flip-Lock",
      "Length Range": "65 cm to 135 cm",
      "Weight": "260g per pole"
    },
    badge: "New",
    brand: "Decathlon",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "spo-20",
    name: "Football Goalkeeper Gloves Pro Grip",
    description: "Goalkeeper gloves with 3.5mm latex palms for outstanding grip. Elastic bandage wrist wrapping provides wrist support.",
    price: 1599,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Team Sports",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Palms": "3.5mm Super Control Latex",
      "Cut": "Negative Cut (Snug fit)",
      "Wrist": "Full strap elastic wrap",
      "Backhand": "Embossed EVA backing"
    },
    badge: "Trending",
    brand: "Adidas",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "spo-21",
    name: "Adjustable Speed Jump Rope Steel",
    description: "Fast speed skipping rope featuring built-in ball bearings, a tangle-free steel wire cable, and anti-slip aluminum handles.",
    price: 599,
    originalPrice: 899,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Cable": "3m PVC-coated Steel Wire",
      "Bearings": "360 degree ball bearings",
      "Adjustability": "Screw-clamp length adjust",
      "Handles": "Anti-slip textured aluminum"
    },
    badge: "Special Price",
    brand: "Puma",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "spo-22",
    name: "Outdoor Sleeping Bag Lightweight",
    description: "Comfortable envelope-style sleeping bag designed for mild weather (comfort limit 15°C). Packs down into a tiny compression sack.",
    price: 2199,
    originalPrice: 2999,
    rating: 4.2,
    reviewsCount: 753,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Outdoor & Adventure",
    isFlado: false,
    generalStock: 163,
    specifications: {
      "Comfort Temp": "15°C",
      "Filling": "150g/m² Hollow Fiber Polyester",
      "Dimensions": "200 cm x 75 cm",
      "Packed Size": "12 cm x 30 cm (cylinder)"
    },
    brand: "Decathlon",
    launchDate: "2026-02-11",
    trendingScore: 99
  },
  {
    id: "spo-23",
    name: "Laminated Volleyball Size 5",
    description: "18-panel laminated composite leather volleyball. Soft touch surface reduces sting on players' forearms during matches.",
    price: 799,
    originalPrice: 1100,
    rating: 4.3,
    reviewsCount: 790,
    images: [
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Team Sports",
    isFlado: false,
    generalStock: 170,
    specifications: {
      "Size": "5 (Official Match size)",
      "Material": "Micro-fiber PU composite leather",
      "Construction": "18-panel laminated construction",
      "Bladder": "High-retention butyl bladder"
    },
    badge: "Bestseller",
    brand: "Nivia",
    launchDate: "2026-03-12",
    trendingScore: 80
  },
  {
    id: "spo-24",
    name: "Ab Roller Wheel with Knee Pad",
    description: "Double wheel core exercise ab roller. Features textured ergonomic foam handles and includes a soft foam knee cushion pad.",
    price: 699,
    originalPrice: 999,
    rating: 4.4,
    reviewsCount: 827,
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 177,
    specifications: {
      "Wheel Diameter": "18 cm",
      "Width": "Dual wheel assembly",
      "Handle Grip": "Tear-resistant NBR foam",
      "Knee Pad": "15mm EVA foam cushion"
    },
    badge: "New",
    brand: "Decathlon",
    launchDate: "2026-04-13",
    trendingScore: 91
  },
  {
    id: "spo-25",
    name: "Sports Gym Duffel Bag with Shoe Compartment",
    description: "Durable gym bag crafted from water-repellent ripstop polyester. Features a ventilated side pocket designed specifically for shoes.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.5,
    reviewsCount: 864,
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    category: "sports",
    subCategory: "Fitness & Gym",
    isFlado: false,
    generalStock: 34,
    specifications: {
      "Material": "100% Recycled Ripstop Polyester",
      "Capacity": "35 Liters",
      "Shoe Pocket": "Ventilated side shoe sleeve",
      "Base": "Tough water-resistant coated base"
    },
    badge: "Trending",
    brand: "Adidas",
    launchDate: "2026-05-14",
    trendingScore: 72
  },
  {
    id: "app-2",
    name: "Intelligent Robot Vacuum & Mop Cleaner",
    description: "Equipped with LiDAR navigation and smart mapping. Vacuums and mops simultaneously with automated water control flow.",
    price: 29999,
    originalPrice: 39999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Cleaning Appliances",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Suction": "4000 Pascals",
      "Navigation": "LiDAR laser mapping",
      "Battery": "5200 mAh (up to 150 mins)",
      "Dustbin Capacity": "400ml dust + 250ml water"
    },
    badge: "Bestseller",
    brand: "Samsung",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "app-3",
    name: "Convection Microwave Oven 28L",
    description: "Features charcoal lighting heater for crunchy baking. 28L capacity is ideal for families. Auto-cook menu presets make it easy.",
    price: 14999,
    originalPrice: 18999,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Capacity": "28 Litres",
      "Type": "Convection & Grill",
      "Cavity": "Stainless Steel cavity",
      "Auto Cook Menus": "251 presets"
    },
    badge: "New",
    brand: "LG",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "app-4",
    name: "Smart Split Air Conditioner 1.5 Ton",
    description: "5-Star rating for extreme energy efficiency. Features PM 2.5 air filters and copper condenser coils. Enabled with Wi-Fi control.",
    price: 38999,
    originalPrice: 48999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Home Comfort",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Capacity": "1.5 Ton",
      "Energy Rating": "5 Star BEE rating",
      "Condenser": "100% Copper coils",
      "Filter": "PM 2.5 Active Health filter"
    },
    badge: "Trending",
    brand: "Samsung",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "app-5",
    name: "Front Load Fully Automatic Washing Machine 8kg",
    description: "Durable washing machine featuring a 4D wash system and an integrated aqua energie water softener. 14 wash programs.",
    price: 32999,
    originalPrice: 39999,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Laundry",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Capacity": "8.0 kg",
      "Drum Type": "Crescent Moon Stainless Steel",
      "Spin Speed": "1400 RPM max",
      "Warranty": "4 Years comprehensive"
    },
    badge: "Special Price",
    brand: "IFB",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "app-6",
    name: "Double Door Frost Free Refrigerator 260L",
    description: "Smart inverter compressor with multi-air flow cooling. convertible freezer compartment allows extra fridge space when hosting.",
    price: 24999,
    originalPrice: 29999,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Capacity": "260 Litres",
      "Energy Rating": "3 Star rating",
      "Compressor": "Smart Inverter Compressor",
      "Freezer": "Convertible design"
    },
    brand: "LG",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "app-7",
    name: "Air Purifier with HEPA Filter H13",
    description: "Captures 99.95% of allergens and fine dust as small as 0.1 microns. Blends smooth purification with active cooling fans.",
    price: 34999,
    originalPrice: 39999,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Home Comfort",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "HEPA Standard": "HEPA H13 sealed glass filter",
      "Coverage Area": "Up to 600 sq ft",
      "Noise Level": "42 - 60 dB",
      "Connectivity": "Dyson Link app"
    },
    badge: "Bestseller",
    brand: "Dyson",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "app-8",
    name: "Digital Oil Filled Radiator Heater 11 Fin",
    description: "11 fin oil-filled radiator heater featuring 3 heat settings, a PTC fan heater, and auto-tip over safety shut-down switch.",
    price: 8999,
    originalPrice: 11999,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Home Comfort",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Fins": "11 heating fins",
      "Max Power": "2900 Watts (including fan)",
      "Safety": "Tilt switch & Overheat cut-out",
      "Mobility": "Castor wheels"
    },
    badge: "New",
    brand: "Havells",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "app-9",
    name: "Garment Steamer Stand 1800W",
    description: "Professional vertical garment steamer with adjustable double poles and a detachable 2L water tank for uninterrupted steaming.",
    price: 6999,
    originalPrice: 8999,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Laundry",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Power": "1800 Watts",
      "Water Tank": "2.0 Litres",
      "Steam Rate": "40g/min continuous",
      "Heating Time": "45 seconds"
    },
    badge: "Trending",
    brand: "Morphy Richards",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "app-10",
    name: "Handheld Cordless Car Vacuum 120W",
    description: "Compact handheld vacuum cleaner designed for cars and upholstery. Powered by a high speed brushless digital motor.",
    price: 12999,
    originalPrice: 15999,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Cleaning Appliances",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Suction Power": "12 Kilopascals",
      "Battery Life": "Up to 25 minutes",
      "Filter": "Washable HEPA filter",
      "Weight": "750g"
    },
    badge: "Special Price",
    brand: "Dyson",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "app-11",
    name: "Multi-Door Convertible Refrigerator 450L",
    description: "Spacious french door refrigerator featuring Triple Cooling zones and a convertible middle drawer with 4 temperature settings.",
    price: 69999,
    originalPrice: 79999,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Capacity": "450 Litres",
      "Cooling System": "Triple Cooling Technology",
      "Convertible Zone": "FlexZone Drawer",
      "Finish": "Fingerprint Resistant Stainless Steel"
    },
    brand: "Samsung",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "app-12",
    name: "Fully Automatic Top Load Washing Machine 7kg",
    description: "Features a built-in heater for hot washes, Spiro Wash motion technology, and 12 distinct wash cycles for various fabrics.",
    price: 16999,
    originalPrice: 19999,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Laundry",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Capacity": "7.0 kg",
      "In-built Heater": "Yes (up to 60°C)",
      "Wash System": "Spiro Wash motion",
      "Control Panel": "Smart Digital panel"
    },
    badge: "Bestseller",
    brand: "Whirlpool",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "app-13",
    name: "Silent Tower Fan with Remote Control",
    description: "Space-saving tower fan with high air delivery, 3 speed levels, 70-degree auto oscillation, and a soft-touch remote controller.",
    price: 4599,
    originalPrice: 5999,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Home Comfort",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Power": "45 Watts",
      "Oscillation": "70 degrees automatic",
      "Timer": "7.5 hours timer",
      "Airflow Speed": "3 Speed settings"
    },
    badge: "New",
    brand: "Havells",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "app-14",
    name: "Dishwasher 14 Place Settings (Silver)",
    description: "TrueSteam technology sanitizes dishes while reducing water spots. QuadWash system uses 4 spray arms for comprehensive cleaning.",
    price: 38999,
    originalPrice: 45999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Cleaning Appliances",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Place Settings": "14 Settings",
      "Spray Arms": "4 arms (QuadWash)",
      "Steam Sanitization": "TrueSteam",
      "Inverter Direct Drive": "Yes (10-Year Warranty)"
    },
    badge: "Trending",
    brand: "LG",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "app-15",
    name: "Dry Iron with Non-Stick Soleplate 1000W",
    description: "Classic dry iron featuring a Weilburger golden non-stick coated soleplate for smooth gliding and a comfortable textured handle.",
    price: 899,
    originalPrice: 1199,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Laundry",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Power": "1000 Watts",
      "Soleplate": "Weilburger golden nonstick",
      "Weight": "0.9 kg",
      "Cord": "1.8m 360-degree swivel"
    },
    badge: "Special Price",
    brand: "Philips",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "app-16",
    name: "Personal Air Cooler 30L Honeycomb",
    description: "Personal air cooler with a 30L tank capacity, high-efficiency honeycomb cooling pads, and an ice chamber for rapid cooling.",
    price: 6999,
    originalPrice: 8999,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Home Comfort",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Water Tank": "30 Litres",
      "Cooling Pads": "Honeycomb pads on 3 sides",
      "Blower/Fan": "High-speed blower",
      "Ice Chamber": "Yes"
    },
    brand: "Havells",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "app-17",
    name: "Electric OTG Baking Oven 30L",
    description: "Oven-Toaster-Grill (OTG) with a 30L capacity. Features motorized rotisserie, stay-on timer, and adjustable temperature knobs.",
    price: 5499,
    originalPrice: 7999,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Kitchen Appliances",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Capacity": "30 Litres",
      "Rotisserie": "Motorized Rotisserie included",
      "Timer": "60 minutes with auto bypass",
      "Accessories": "Baking tray, wire rack, crumb tray"
    },
    badge: "Bestseller",
    brand: "Morphy Richards",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "app-18",
    name: "Steam Iron 2000W Ceramic Plate",
    description: "Powerful 2000W steam iron that heats up quickly. Offers continuous steam output up to 25g/min and 90g steam boost.",
    price: 2199,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Laundry",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Power": "2000 Watts",
      "Steam Boost": "90 grams",
      "Soleplate": "Scratch-resistant Ceramic",
      "Water Tank": "220 ml"
    },
    badge: "New",
    brand: "Philips",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "app-19",
    name: "Commercial Heavy Duty Wet & Dry Vacuum 15L",
    description: "A heavy-duty vacuum cleaner built with a 15-litre stainless steel barrel. Sucks up both liquids and dry dust efficiently.",
    price: 7999,
    originalPrice: 10999,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Cleaning Appliances",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Barrel Capacity": "15 Litres",
      "Motor Power": "1400 Watts",
      "Body Material": "Rust-free Stainless Steel",
      "Hose": "2.5m heavy-duty flexible hose"
    },
    badge: "Trending",
    brand: "LG",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "app-20",
    name: "Intelligent Smart Air Humidifier 4L",
    description: "Ultrasonic cool mist humidifier that sanitizes water before releasing it. Offers automatic moisture control for dry rooms.",
    price: 18999,
    originalPrice: 24999,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    category: "appliances",
    subCategory: "Home Comfort",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Tank Capacity": "4.0 Litres",
      "Sanitization": "UV-C sanitizing light",
      "Misting Time": "Up to 18 hours",
      "Sensor": "Auto Hygrostat humidity check"
    },
    badge: "Special Price",
    brand: "Dyson",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "toy-2",
    name: "Technic Porsche 911 GT3 RS Set",
    description: "Immersive building set with 2704 pieces. Features detailed orange bodywork, red suspension springs, and working steering gear.",
    price: 18999,
    originalPrice: 24999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Building Blocks",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Pieces": "2,704 Pieces",
      "Age Recommendation": "16+ Years",
      "Dimensions": "22\" Long",
      "Model Number": "42056"
    },
    badge: "Bestseller",
    brand: "LEGO",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "toy-3",
    name: "Monopoly Deluxe Edition Board Game",
    description: "The classic property trading board game featuring deluxe golden-finish tokens, wooden houses and hotels, and a card organizer tray.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Board Games",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Players": "2 to 6 Players",
      "Age Recommendation": "8+ Years",
      "Includes": "Golden tokens, wooden elements, cash stack",
      "Duration": "60 - 180 minutes"
    },
    badge: "New",
    brand: "Hasbro",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "toy-4",
    name: "Barbie Dreamhouse Playset (75+ Pieces)",
    description: "A three-story Barbie Dreamhouse standing 3 feet tall. Features 8 rooms, a working elevator, a swimming slide, and lights/sound effects.",
    price: 12999,
    originalPrice: 14999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Dolls & Action Figures",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Assembly Required": "Yes",
      "Battery Required": "3 AAA Batteries",
      "Includes": "75+ furniture accessories",
      "Dimensions": "3ft Tall x 4ft Wide"
    },
    badge: "Trending",
    brand: "Mattel",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "toy-5",
    name: "STEM Solar Power Robot Kit 12-in-1",
    description: "Build 12 different types of solar-powered robots that can move on land or water. Introduces children to mechanical engineering.",
    price: 1299,
    originalPrice: 1999,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Educational Toys",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Power Source": "100% Solar Powered",
      "Number of Models": "12 configurations",
      "Skill level": "Beginner to Intermediate",
      "Age Recommendation": "10+ Years"
    },
    badge: "Special Price",
    brand: "Fisher-Price",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "toy-6",
    name: "Die-cast Hot Wheels Gift Pack (10 cars)",
    description: "Includes 10 highly detailed 1:64 scale die-cast sports cars and race cars. Assorted colors and models in a single pack.",
    price: 999,
    originalPrice: 1299,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Building Blocks",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Scale": "1:64 Scale",
      "Quantity": "10 Cars per box",
      "Material": "Die-cast metal body + plastic chassis",
      "Age Recommendation": "3+ Years"
    },
    brand: "Hot Wheels",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "toy-7",
    name: "LEGO Architecture Empire State Building",
    description: "Capture the monumental scale of New York's world-famous Empire State Building. Features a tiled base plate and name plate.",
    price: 7999,
    originalPrice: 9999,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Building Blocks",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Pieces": "1,767 Pieces",
      "Dimensions": "21\" High x 7\" Wide",
      "Age Recommendation": "12+ Years",
      "Model Number": "21046"
    },
    badge: "Bestseller",
    brand: "LEGO",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "toy-8",
    name: "Scrabble Original Crossword Game",
    description: "The classic crossword puzzle game that tests your vocabulary. Features 100 wooden letter tiles, 4 racks, and a premium board.",
    price: 899,
    originalPrice: 1199,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Board Games",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Players": "2 to 4 Players",
      "Age Recommendation": "10+ Years",
      "Tile Material": "Natural polished wood",
      "Includes": "Board, tiles, racks, drawstring bag"
    },
    badge: "New",
    brand: "Hasbro",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "toy-9",
    name: "Marvel Avengers Action Figure Set (5 Figures)",
    description: "Includes 5 classic action figures: Iron Man, Captain America, Thor, Hulk, and Black Widow. Fully articulated joints for posing.",
    price: 2999,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Dolls & Action Figures",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Quantity": "5 Figures",
      "Figure Height": "6 inches (15cm)",
      "Material": "Non-toxic PVC plastic",
      "Articulation": "5-point basic joints"
    },
    badge: "Trending",
    brand: "Hasbro",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "toy-10",
    name: "Magnetic Building Tiles Set (100 Pcs)",
    description: "A creative set of 100 colorful geometric tiles containing powerful internal magnets. Perfect for building 3D castles and shapes.",
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Educational Toys",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Quantity": "100 Translucent Tiles",
      "Magnet Type": "Neodymium magnets",
      "Material": "Food-grade BPA-free ABS plastic",
      "Age Recommendation": "3+ Years"
    },
    badge: "Special Price",
    brand: "Funskool",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "toy-11",
    name: "NERF Elite 2.0 Commander Blaster",
    description: "Features a rotating drum that holds 6 foam darts. Customize the blaster with accessory rails and a barrel attachment point.",
    price: 1199,
    originalPrice: 1499,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Dolls & Action Figures",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Drum Capacity": "6 Darts",
      "Range": "Fires up to 90ft (27m)",
      "Included Darts": "12 Official foam darts",
      "Batteries Required": "None"
    },
    brand: "Hasbro",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "toy-12",
    name: "Jenga Classic Hardwood Block Game",
    description: "Pull out a block without crashing the stack! Includes 54 genuine hardwood blocks and an easy-to-use stacking sleeve.",
    price: 699,
    originalPrice: 999,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Board Games",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Block Count": "54 Hardwood blocks",
      "Material": "Solid Natural wood",
      "Age Recommendation": "6+ Years",
      "Players": "1 or more"
    },
    badge: "Bestseller",
    brand: "Hasbro",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "toy-13",
    name: "Fisher-Price Laugh & Learn Smart Stages Puppy",
    description: "Soft, cuddly plush puppy featuring Smart Stages technology that updates educational content as your baby grows.",
    price: 1599,
    originalPrice: 1999,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Educational Toys",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Learning Levels": "3 stages of play",
      "Sensors": "Hands, foot, ear, and heart sensors",
      "Songs": "75+ sing-along songs and phrases",
      "Age Recommendation": "6 to 36 Months"
    },
    badge: "New",
    brand: "Fisher-Price",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "toy-14",
    name: "LEGO Creator Expert Bonsai Tree Set",
    description: "Enjoy a mindful building project with interchangeable green leaves and pink cherry blossom petals. Includes a rectangular pot.",
    price: 4499,
    originalPrice: 4999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Building Blocks",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Pieces": "878 Pieces",
      "Alternate Builds": "Summer Green or Spring Cherry",
      "Dimensions": "7\" High x 8\" Long",
      "Model Number": "10281"
    },
    badge: "Trending",
    brand: "LEGO",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "toy-15",
    name: "Catan Strategy Board Game Base Game",
    description: "The legendary board game of resource gathering, trade, and settlement construction. Perfect for family game nights.",
    price: 3499,
    originalPrice: 4299,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Board Games",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Players": "3 to 4 Players",
      "Age Recommendation": "10+ Years",
      "Includes": "Hexagonal board tiles, cards, wooden settlements",
      "Duration": "60 - 90 minutes"
    },
    badge: "Special Price",
    brand: "Hasbro",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "toy-16",
    name: "Hot Wheels Ultimate Gator Car Wash Playset",
    description: "Massive water-themed playset with a hand-powered elevator, water rollers, color-shifting chamber, and giant gator hazard.",
    price: 3999,
    originalPrice: 4999,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Building Blocks",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Dimensions": "26\" High x 35\" Wide",
      "Water Use": "Warm/Cold color-change water chambers",
      "Cars Included": "1 Color Shifters car",
      "Age Recommendation": "4+ Years"
    },
    brand: "Hot Wheels",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "toy-17",
    name: "Wooden Activity Cube Educational Center",
    description: "Five-sided wooden activity cube featuring a bead maze, gear sliders, clock dials, shape sorter, and flip-flops.",
    price: 1999,
    originalPrice: 2799,
    rating: 4.7,
    reviewsCount: 605,
    images: [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Educational Toys",
    isFlado: false,
    generalStock: 135,
    specifications: {
      "Material": "Natural Beechwood",
      "Paints": "Water-based non-toxic paints",
      "Activity Sides": "5 interactive sides",
      "Age Recommendation": "18+ Months"
    },
    badge: "Bestseller",
    brand: "Fisher-Price",
    launchDate: "2026-04-25",
    trendingScore: 85
  },
  {
    id: "toy-18",
    name: "Play-Doh Mega Can Pack (20 Colors)",
    description: "Includes 20 standard 3-ounce cans of colorful Play-Doh modeling compound. Safe, non-toxic, and reusable.",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 642,
    images: [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Educational Toys",
    isFlado: false,
    generalStock: 142,
    specifications: {
      "Cans Count": "20 Cans",
      "Total Weight": "60 ounces (1.7kg)",
      "Material": "Non-toxic starch compound",
      "Age Recommendation": "2+ Years"
    },
    badge: "New",
    brand: "Hasbro",
    launchDate: "2026-05-26",
    trendingScore: 96
  },
  {
    id: "toy-19",
    name: "LEGO Speed Champions Audi E-Tron Set",
    description: "Build and display a highly detailed replica model of the futuristic Audi S1 E-Tron Quattro race car, including a driver minifigure.",
    price: 1999,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 679,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Building Blocks",
    isFlado: false,
    generalStock: 149,
    specifications: {
      "Pieces": "318 Pieces",
      "Includes": "Audi driver minifigure with helmet",
      "Dimensions": "6.5\" Long",
      "Model Number": "76921"
    },
    badge: "Trending",
    brand: "LEGO",
    launchDate: "2026-06-27",
    trendingScore: 77
  },
  {
    id: "toy-20",
    name: "Connect 4 Grid Game for Kids",
    description: "Drop your red or yellow discs in the grid and be the first to get 4 in a row to win the classic disc-dropping game.",
    price: 599,
    originalPrice: 799,
    rating: 4.1,
    reviewsCount: 716,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    category: "toys",
    subCategory: "Board Games",
    isFlado: false,
    generalStock: 156,
    specifications: {
      "Players": "2 Players",
      "Age Recommendation": "6+ Years",
      "Includes": "Grid, 21 yellow discs, 21 red discs",
      "Duration": "10 - 20 minutes"
    },
    badge: "Special Price",
    brand: "Hasbro",
    launchDate: "2026-01-10",
    trendingScore: 88
  },
  {
    id: "boo-1",
    name: "The Midnight Library (Paperback)",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Each book provides a chance to try another life you could have lived.",
    price: 399,
    originalPrice: 499,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Fiction",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Penguin Books",
      "Pages": "304 pages",
      "Publication Date": "2021-08-01"
    },
    badge: "Bestseller",
    brand: "Penguin",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "boo-2",
    name: "Atomic Habits (Hardcover)",
    description: "The definitive guide to breaking bad habits and building good ones. James Clear reveals practical strategies to form good habits and break bad ones.",
    price: 599,
    originalPrice: 799,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Self-Help",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Format": "Hardcover",
      "Language": "English",
      "Publisher": "Avery",
      "Pages": "320 pages",
      "Publication Date": "2018-10-16"
    },
    badge: "New",
    brand: "Random House",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "boo-3",
    name: "Sapiens: A Brief History of Humankind",
    description: "Yuval Noah Harari explores how biology and history have defined us and enhanced our understanding of what it means to be human.",
    price: 499,
    originalPrice: 699,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Non-Fiction",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Harper Perennial",
      "Pages": "512 pages",
      "Publication Date": "2015-05-15"
    },
    badge: "Trending",
    brand: "HarperCollins",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "boo-4",
    name: "Dune (Deluxe Edition)",
    description: "Frank Herbert's masterpiece set on the desert planet Arrakis. A stunning deluxe edition featuring custom endpapers and painted edges.",
    price: 699,
    originalPrice: 899,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Sci-Fi & Fantasy",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Format": "Hardcover Cloth-bound",
      "Language": "English",
      "Publisher": "Ace Books",
      "Pages": "688 pages",
      "Publication Date": "2019-10-01"
    },
    badge: "Special Price",
    brand: "Bloomsbury",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "boo-5",
    name: "Steve Jobs (Official Biography)",
    description: "Walter Isaacson's riveting biography of the creative entrepreneur whose passion for perfection revolutionized six industries.",
    price: 550,
    originalPrice: 750,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Biography",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Simon & Schuster",
      "Pages": "656 pages",
      "Publication Date": "2011-10-24"
    },
    brand: "Simon & Schuster",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "boo-6",
    name: "The Alchemist (Special Anniversary Edition)",
    description: "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.",
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Fiction",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "HarperOne",
      "Pages": "208 pages",
      "Publication Date": "2014-04-15"
    },
    badge: "Bestseller",
    brand: "HarperCollins",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "boo-7",
    name: "Thinking, Fast and Slow (Paperback)",
    description: "Daniel Kahneman, Nobel laureate in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive our choices.",
    price: 450,
    originalPrice: 599,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Non-Fiction",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Farrar, Straus and Giroux",
      "Pages": "499 pages",
      "Publication Date": "2013-04-02"
    },
    badge: "New",
    brand: "Penguin",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "boo-8",
    name: "The Psychology of Money",
    description: "Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of life's decisions.",
    price: 349,
    originalPrice: 450,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Self-Help",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Harriman House",
      "Pages": "256 pages",
      "Publication Date": "2020-09-08"
    },
    badge: "Trending",
    brand: "HarperCollins",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "boo-9",
    name: "The Hobbit (Hardcover Illustrated)",
    description: "A beautiful hardcover edition of J.R.R. Tolkien's fantasy classic, featuring original color illustrations painted by the author himself.",
    price: 899,
    originalPrice: 1200,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Sci-Fi & Fantasy",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Format": "Hardcover slipcase",
      "Language": "English",
      "Publisher": "HarperCollins UK",
      "Pages": "320 pages",
      "Publication Date": "2020-10-01"
    },
    badge: "Special Price",
    brand: "Bloomsbury",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "boo-10",
    name: "Educated: A Memoir",
    description: "Tara Westover recounts her struggle for self-invention, leaving her survivalist family in rural Idaho to earn a PhD from Cambridge University.",
    price: 420,
    originalPrice: 550,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Biography",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Random House",
      "Pages": "352 pages",
      "Publication Date": "2018-02-20"
    },
    brand: "Random House",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "boo-11",
    name: "A Game of Thrones (Song of Ice and Fire)",
    description: "George R.R. Martin's fantasy epic. Enter a world where summers span decades and winters can last a lifetime, and the struggle for the Iron Throne begins.",
    price: 499,
    originalPrice: 599,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Sci-Fi & Fantasy",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Format": "Paperback mass-market",
      "Language": "English",
      "Publisher": "Bantam Books",
      "Pages": "835 pages",
      "Publication Date": "2011-03-22"
    },
    badge: "Bestseller",
    brand: "Bloomsbury",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "boo-12",
    name: "Deep Work: Rules for Focused Success",
    description: "Cal Newport argues that focus is a superpower in our distracted digital age, presenting practical guidelines to cultivate deep work habits.",
    price: 399,
    originalPrice: 499,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Self-Help",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Grand Central Publishing",
      "Pages": "304 pages",
      "Publication Date": "2016-01-05"
    },
    badge: "New",
    brand: "Simon & Schuster",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "boo-13",
    name: "Brief Answers to the Big Questions",
    description: "Stephen Hawking's final book. Offers his personal and scientific reflections on the greatest mysteries of human existence and the cosmos.",
    price: 350,
    originalPrice: 450,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Non-Fiction",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Bantam Books",
      "Pages": "256 pages",
      "Publication Date": "2020-03-03"
    },
    badge: "Trending",
    brand: "Penguin",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "boo-14",
    name: "The Great Gatsby (Classic Deluxe)",
    description: "F. Scott Fitzgerald's jazz-age masterpiece. A gorgeous collector's edition of Jay Gatsby, Daisy Buchanan, and the decadent roaring twenties.",
    price: 199,
    originalPrice: 299,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Fiction",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Format": "Hardcover clothbound",
      "Language": "English",
      "Publisher": "Penguin Classics",
      "Pages": "180 pages",
      "Publication Date": "2018-09-04"
    },
    badge: "Special Price",
    brand: "Penguin",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "boo-15",
    name: "Shoe Dog: A Memoir by the Creator of Nike",
    description: "Phil Knight, founder of Nike, shares the inside story of the startup's early days as an intrepid importer of Japanese sneakers.",
    price: 450,
    originalPrice: 599,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    category: "books",
    subCategory: "Biography",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Format": "Paperback",
      "Language": "English",
      "Publisher": "Scribner",
      "Pages": "400 pages",
      "Publication Date": "2018-05-01"
    },
    brand: "Simon & Schuster",
    launchDate: "2026-03-24",
    trendingScore: 74
  },
  {
    id: "jew-1",
    name: "18k Yellow Gold Diamond Ring",
    description: "Elegant 18k yellow gold band featuring a cluster of 5 brilliant-cut certified diamonds. Perfect choice for anniversaries.",
    price: 24999,
    originalPrice: 29999,
    rating: 4.1,
    reviewsCount: 50,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Rings",
    isFlado: false,
    generalStock: 30,
    specifications: {
      "Metal": "18k Yellow Gold",
      "Gemstone": "Diamond (0.15 Carat)",
      "Weight": "3.2g",
      "Certificate": "SGL Certified"
    },
    badge: "Bestseller",
    brand: "Tanishq",
    launchDate: "2026-01-10",
    trendingScore: 70
  },
  {
    id: "jew-2",
    name: "Sterling Silver Heart Pendant Necklace",
    description: "Beautifully polished sterling silver necklace featuring a heart-shaped pendant studded with AAA+ quality cubic zirconia.",
    price: 1899,
    originalPrice: 2499,
    rating: 4.2,
    reviewsCount: 87,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Necklaces",
    isFlado: false,
    generalStock: 37,
    specifications: {
      "Metal": "925 Sterling Silver",
      "Chain Length": "18 inches + adjustable loop",
      "Pendant": "Heart CZ stone",
      "Plating": "Rhodium plating"
    },
    badge: "New",
    brand: "Giva",
    launchDate: "2026-02-11",
    trendingScore: 81
  },
  {
    id: "jew-3",
    name: "14k Rose Gold Diamond Stud Earrings",
    description: "Simple 14k rose gold studs showcasing round brilliant-cut diamonds in secure four-prong settings. Perfect for daily wear.",
    price: 12499,
    originalPrice: 14999,
    rating: 4.3,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Earrings",
    isFlado: false,
    generalStock: 44,
    specifications: {
      "Metal": "14k Rose Gold",
      "Gemstone": "Round Brilliant Diamonds",
      "Carat Weight": "0.10 Carat total",
      "Clarity/Color": "SI IJ"
    },
    badge: "Trending",
    brand: "CaratLane",
    launchDate: "2026-03-12",
    trendingScore: 92
  },
  {
    id: "jew-4",
    name: "Classic Solitaire Engagement Ring",
    description: "A timeless engagement ring features a stunning single 0.25-carat brilliant cut diamond mounted on an 18k white gold band.",
    price: 45999,
    originalPrice: 49999,
    rating: 4.4,
    reviewsCount: 161,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Rings",
    isFlado: false,
    generalStock: 51,
    specifications: {
      "Metal": "18k White Gold",
      "Gemstone": "Solitaire Diamond (0.25 Carat)",
      "Cut": "Excellent Brilliant Cut",
      "Certificate": "IGI Certified"
    },
    badge: "Special Price",
    brand: "Tanishq",
    launchDate: "2026-04-13",
    trendingScore: 73
  },
  {
    id: "jew-5",
    name: "Premium Swarovski Crystal Tennis Bracelet",
    description: "A classic tennis bracelet features a continuous line of sparkling clear crystals bezel-set in rhodium-plated metal.",
    price: 8999,
    originalPrice: 10999,
    rating: 4.5,
    reviewsCount: 198,
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Fine Jewellery",
    isFlado: false,
    generalStock: 58,
    specifications: {
      "Metal": "Rhodium-plated base",
      "Stone": "Swarovski Crystals (Clear)",
      "Length": "17 cm",
      "Clasp": "Fold-over safety clasp"
    },
    brand: "Swarovski",
    launchDate: "2026-05-14",
    trendingScore: 84
  },
  {
    id: "jew-6",
    name: "Silver Plated Floral Hoop Earrings",
    description: "Delicate silver-plated hoop earrings featuring a dainty floral motif studded with sparkling white zirconia crystals.",
    price: 999,
    originalPrice: 1499,
    rating: 4.6,
    reviewsCount: 235,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Earrings",
    isFlado: false,
    generalStock: 65,
    specifications: {
      "Metal": "Brass base with silver plating",
      "Stone": "Cubic Zirconia",
      "Diameter": "25 mm",
      "Weight": "2.1g each"
    },
    badge: "Bestseller",
    brand: "Giva",
    launchDate: "2026-06-15",
    trendingScore: 95
  },
  {
    id: "jew-7",
    name: "22k Gold Kundan Choker Necklace Set",
    description: "An exquisite traditional bridal choker set handcrafted in 22k pure gold, featuring detailed Kundan work and hanging green pearls.",
    price: 185000,
    originalPrice: 195000,
    rating: 4.7,
    reviewsCount: 272,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Necklaces",
    isFlado: false,
    generalStock: 72,
    specifications: {
      "Metal": "22k Yellow Gold",
      "Style": "Bridal Kundan Choker",
      "Includes": "1 Choker + 2 Matching Earrings",
      "Certification": "BIS Hallmarked 916"
    },
    badge: "New",
    brand: "Malabar",
    launchDate: "2026-01-16",
    trendingScore: 76
  },
  {
    id: "jew-8",
    name: "Pandora Moments Charm Bracelet Set",
    description: "A classic sterling silver snake chain bracelet, complete with three select hand-crafted cubic zirconia spacer charms.",
    price: 5499,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 309,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Fashion Jewellery",
    isFlado: false,
    generalStock: 79,
    specifications: {
      "Metal": "925 Sterling Silver",
      "Bracelet Style": "Snake Chain",
      "Charms Included": "3 Charms",
      "Clasp Type": "Pandora Barrel Clasp"
    },
    badge: "Trending",
    brand: "Pandora",
    launchDate: "2026-02-17",
    trendingScore: 87
  },
  {
    id: "jew-9",
    name: "18k Rose Gold Infinite Band Ring",
    description: "A continuous infinity symbol band detailed with delicate sparkling diamonds, crafted in premium 18k rose gold.",
    price: 15999,
    originalPrice: 18999,
    rating: 4.9,
    reviewsCount: 346,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Rings",
    isFlado: false,
    generalStock: 86,
    specifications: {
      "Metal": "18k Rose Gold",
      "Gemstone": "Natural Diamonds",
      "Diamond Count": "18 diamonds",
      "Style": "Infinity Band"
    },
    badge: "Special Price",
    brand: "CaratLane",
    launchDate: "2026-03-18",
    trendingScore: 98
  },
  {
    id: "jew-10",
    name: "Dangling Freshwater Pearl Earrings",
    description: "Sterling silver dangling earrings featuring high-luster round white freshwater pearls suspended below cubic zirconia studs.",
    price: 1599,
    originalPrice: 2199,
    rating: 4.1,
    reviewsCount: 383,
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Earrings",
    isFlado: false,
    generalStock: 93,
    specifications: {
      "Metal": "925 Sterling Silver",
      "Pearl Type": "Freshwater Cultured Pearl",
      "Pearl Size": "8 mm",
      "Length": "3.0 cm"
    },
    brand: "Giva",
    launchDate: "2026-04-19",
    trendingScore: 79
  },
  {
    id: "jew-11",
    name: "18k Yellow Gold Emerald Cut Emerald Necklace",
    description: "A striking emerald-cut deep green natural emerald pendant suspended from an 18k yellow gold chain, surrounded by a diamond halo.",
    price: 74999,
    originalPrice: 85000,
    rating: 4.2,
    reviewsCount: 420,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Necklaces",
    isFlado: false,
    generalStock: 100,
    specifications: {
      "Metal": "18k Yellow Gold",
      "Gemstone": "Natural Emerald (0.6 Carat)",
      "Accent Stones": "12 Diamonds (0.12 Carat)",
      "Chain Length": "16 inches"
    },
    badge: "Bestseller",
    brand: "Tanishq",
    launchDate: "2026-05-20",
    trendingScore: 90
  },
  {
    id: "jew-12",
    name: "Chunky Silver Adjustable Statement Ring",
    description: "Bold, textured sterling silver statement ring featuring an adjustable band. Handmade design that adds edge to any look.",
    price: 2499,
    originalPrice: 3499,
    rating: 4.3,
    reviewsCount: 457,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Rings",
    isFlado: false,
    generalStock: 107,
    specifications: {
      "Metal": "925 Sterling Silver",
      "Finish": "Oxidized antique finish",
      "Size": "Adjustable (fits sizes 6-9)",
      "Weight": "5.8g"
    },
    badge: "New",
    brand: "Pandora",
    launchDate: "2026-06-21",
    trendingScore: 71
  },
  {
    id: "jew-13",
    name: "Swarovski Elements Blue Drop Earrings",
    description: "Stunning teardrop crystal earrings in sapphire blue color. Suspended from secure hook posts plated in white gold.",
    price: 4999,
    originalPrice: 5999,
    rating: 4.4,
    reviewsCount: 494,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Earrings",
    isFlado: false,
    generalStock: 114,
    specifications: {
      "Metal": "White Gold Plated base",
      "Stone": "Swarovski Sapphire Crystal",
      "Earring Type": "Drop / Dangle",
      "Length": "2.8 cm"
    },
    badge: "Trending",
    brand: "Swarovski",
    launchDate: "2026-01-22",
    trendingScore: 82
  },
  {
    id: "jew-14",
    name: "Multi-layered Beaded Boho Necklace",
    description: "A colorful, casual multi-layered beaded necklace featuring natural stones, wood accents, and small silver spacers.",
    price: 799,
    originalPrice: 1299,
    rating: 4.5,
    reviewsCount: 531,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Fashion Jewellery",
    isFlado: false,
    generalStock: 121,
    specifications: {
      "Material": "Natural stones, wood beads, silver-plated brass",
      "Length": "22 inches with extender",
      "Style": "Bohemian layer",
      "Closure": "Lobster claw"
    },
    badge: "Special Price",
    brand: "Giva",
    launchDate: "2026-02-23",
    trendingScore: 93
  },
  {
    id: "jew-15",
    name: "22k Gold Classic Kada Bangle (Single)",
    description: "Classic round design Kada bangle for women in 22k gold, detailed with traditional filigree engraving. Hallmarked for purity.",
    price: 92000,
    originalPrice: 99000,
    rating: 4.6,
    reviewsCount: 568,
    images: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    category: "jewellery",
    subCategory: "Fine Jewellery",
    isFlado: false,
    generalStock: 128,
    specifications: {
      "Metal": "22k Yellow Gold",
      "Weight": "12.5g",
      "Bangle Size": "2.4 (standard)",
      "Certification": "BIS Hallmarked 916"
    },
    brand: "Malabar",
    launchDate: "2026-03-24",
    trendingScore: 74
  }
];
