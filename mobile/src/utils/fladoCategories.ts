export interface FladoCategory {
  slug: string;
  name: string;
  emoji: string;
  bannerUrl: string;
  subCategories: string[];
  featuredBrands: string[];
  primaryColor: string;
  offers: { text: string; code: string }[];
}

export const fladoCategoriesData: FladoCategory[] = [
  {
    slug: 'fruits-vegetables',
    name: 'Fruits & Vegetables',
    emoji: '🍎',
    bannerUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=400&fit=crop',
    subCategories: ['Fresh Fruits', 'Fresh Vegetables', 'Herbs & Seasonings', 'Exotic & Imported', 'Organic Produce', 'Cut & Ready'],
    featuredBrands: ['amul', 'mamaearth'],
    primaryColor: '#10B981',
    offers: [
      { text: 'Get 20% off fresh organic greens', code: 'ORGANIC20' },
      { text: 'Buy 1 Get 1 on Fresh Avocados', code: 'AVOFREE' }
    ]
  },
  {
    slug: 'dairy-bread-eggs',
    name: 'Dairy, Bread & Eggs',
    emoji: '🥛',
    bannerUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=400&fit=crop',
    subCategories: ['Milk & Cream', 'Butter & Cheese', 'Eggs', 'Bread & Buns', 'Yogurt & Lassi'],
    featuredBrands: ['amul', 'nestle', 'britannia'],
    primaryColor: '#3B82F6',
    offers: [
      { text: 'Save ₹30 on Amul Premium Cheese packs', code: 'DAIRY30' },
      { text: 'Free Sourdough loaf on orders above ₹300', code: 'BREADLOAF' }
    ]
  },
  {
    slug: 'atta-rice-dal',
    name: 'Atta, Rice & Dal',
    emoji: '🌾',
    bannerUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=400&fit=crop',
    subCategories: ['Atta & Flours', 'Rice Products', 'Pulses & Dals'],
    featuredBrands: ['aashirvaad', 'daawat', 'tata-sampann'],
    primaryColor: '#F59E0B',
    offers: [
      { text: 'Flat ₹50 off on 5kg Aashirvaad Atta', code: 'ATTA50' }
    ]
  },
  {
    slug: 'snacks-beverages',
    name: 'Snacks & Beverages',
    emoji: '🍟',
    bannerUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=1200&h=400&fit=crop',
    subCategories: ['Chips & Crisps', 'Chocolates & Candies', 'Tea & Coffee', 'Cold Drinks & Juices', 'Namkeens & Savories'],
    featuredBrands: ['haldirams', 'cadbury', 'lays', 'nestle', 'coca-cola'],
    primaryColor: '#EF4444',
    offers: [
      { text: 'Save 15% on chocolates & cookies', code: 'SWEET15' },
      { text: 'Flat ₹50 off on Lay\'s party packs combo', code: 'CHIP50' }
    ]
  },
  {
    slug: 'frozen-ready-meals',
    name: 'Frozen & Ready Meals',
    emoji: '🧊',
    bannerUrl: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=1200&h=400&fit=crop',
    subCategories: ['Frozen Veggies', 'Ready to Cook Fries & Nuggets', 'Instant Noodles & Soups', 'Frozen Desserts & Icecreams'],
    featuredBrands: ['amul', 'haldirams', 'mccain', 'nestle'],
    primaryColor: '#8B5CF6',
    offers: [
      { text: 'Flat 20% off on all frozen French fries', code: 'FROZEN20' }
    ]
  },
  {
    slug: 'household-cleaning',
    name: 'Household & Cleaning',
    emoji: '🏠',
    bannerUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&h=400&fit=crop',
    subCategories: ['Detergents & Liquid Soaps', 'Toilet Cleaners & Disinfectants', 'Garbage Bags & Tissues'],
    featuredBrands: ['hul', 'reckitt', 'flado-clean'],
    primaryColor: '#6B7280',
    offers: [
      { text: 'Save ₹50 on HUL combo detergents', code: 'CLEAN50' }
    ]
  },
  {
    slug: 'personal-care',
    name: 'Personal Care & Beauty',
    emoji: '💄',
    bannerUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    subCategories: ['Shampoos & Soaps', 'Face & Skincare', 'Oral Care'],
    featuredBrands: ['lakme', 'mamaearth', 'dove', 'colgate'],
    primaryColor: '#EC4899',
    offers: [
      { text: 'Get 25% off on Mamaearth Organic Skincare', code: 'GLOW25' }
    ]
  },
  {
    slug: 'baby-care',
    name: 'Baby Care',
    emoji: '👶',
    bannerUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&h=400&fit=crop',
    subCategories: ['Baby Diapers & Wipes', 'Baby Soaps & Lotions', 'Baby Food & Formula'],
    featuredBrands: ['mamaearth', 'nestle', 'pampers', 'himalaya'],
    primaryColor: '#06B6D4',
    offers: [
      { text: 'Save ₹100 on baby diapers monthly pack', code: 'DIAPER100' }
    ]
  },
  {
    slug: 'health-pharmacy',
    name: 'Health & Pharmacy',
    emoji: '💊',
    bannerUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=400&fit=crop',
    subCategories: ['OTC Medicines', 'Vitamins & Supplements', 'Wound Care'],
    featuredBrands: ['sun-pharma', 'johnson-johnson'],
    primaryColor: '#10B981',
    offers: [
      { text: 'Flat 10% off on daily supplements', code: 'VITA10' }
    ]
  },
  {
    slug: 'pet-care',
    name: 'Pet Care',
    emoji: '🐾',
    bannerUrl: 'https://images.unsplash.com/photo-1589595608370-98f1f59f635d?w=1200&h=400&fit=crop',
    subCategories: ['Dog Food & Treats', 'Cat Food & Litter'],
    featuredBrands: ['pedigree', 'whiskas', 'drools'],
    primaryColor: '#78350F',
    offers: [
      { text: 'Free Cat Treats on Whiskas above ₹400', code: 'KITTYFREE' }
    ]
  },
  {
    slug: 'electronics-accessories',
    name: 'Electronics & Accessories',
    emoji: '⚡',
    bannerUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&h=400&fit=crop',
    subCategories: ['Cables & Chargers', 'Audio & Wearables', 'Batteries'],
    featuredBrands: ['boat', 'realme', 'duracell'],
    primaryColor: '#1F2937',
    offers: [
      { text: 'Flat ₹100 off on boAt earwear', code: 'BOAT100' }
    ]
  },
  {
    slug: 'oils-masalas-spices',
    name: 'Oils, Masalas & Spices',
    emoji: '🌶️',
    bannerUrl: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=1200&h=400&fit=crop',
    subCategories: ['Cooking Oils', 'Masalas & Spices'],
    featuredBrands: ['fortune', 'mdh', 'everest', 'tata'],
    primaryColor: '#DC2626',
    offers: [
      { text: 'Buy 2 Spices get 10% off', code: 'SPICE10' }
    ]
  },
  {
    slug: 'bakery-biscuits',
    name: 'Bakery & Biscuits',
    emoji: '🍪',
    bannerUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=400&fit=crop',
    subCategories: ['Biscuits', 'Bakery Products'],
    featuredBrands: ['britannia', 'parle', 'flado-bakery'],
    primaryColor: '#B45309',
    offers: [
      { text: '15% off fresh croissants in morning', code: 'RISEANDBAKE' }
    ]
  },
  {
    slug: 'stationery-games',
    name: 'Stationery & Toys',
    emoji: '✏️',
    bannerUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&h=400&fit=crop',
    subCategories: ['Stationery Products', 'Games & Toys'],
    featuredBrands: ['camlin', 'classmate', 'lego'],
    primaryColor: '#059669',
    offers: [
      { text: 'Flat ₹200 off on LEGO Creator sets', code: 'BRICK200' }
    ]
  },
  {
    slug: 'flowers-gifts',
    name: 'Flowers & Gifts',
    emoji: '🌸',
    bannerUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=1200&h=400&fit=crop',
    subCategories: ['Flowers Bouquet', 'Greeting Cards & Candles'],
    featuredBrands: ['fnp', 'archies'],
    primaryColor: '#DB2777',
    offers: [
      { text: 'Express flower delivery for birthdays', code: 'LOVEFLOWERS' }
    ]
  }
];
