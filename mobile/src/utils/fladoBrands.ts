export interface FladoBrand {
  slug: string;
  name: string;
  logoUrl: string;
  tagline: string;
  category: string;
  offerText: string;
  isFeatured: boolean;
}

export const fladoBrandsData: FladoBrand[] = [
  {
    slug: 'amul',
    name: 'Amul',
    logoUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    tagline: 'The Taste of India',
    category: 'dairy-bread-eggs',
    offerText: 'Up to 15% OFF on Milk & Butter packs',
    isFeatured: true
  },
  {
    slug: 'mother-dairy',
    name: 'Mother Dairy',
    logoUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
    tagline: 'Happy Food, Happy People',
    category: 'dairy-bread-eggs',
    offerText: 'Flat ₹20 off on icecream tubs',
    isFeatured: true
  },
  {
    slug: 'britannia',
    name: 'Britannia',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    tagline: 'Eat Healthy, Think Better',
    category: 'bakery-biscuits',
    offerText: 'Buy 2 get 15% off on whole wheat bread',
    isFeatured: true
  },
  {
    slug: 'aashirvaad',
    name: 'Aashirvaad',
    logoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
    tagline: 'Sourced from the best fields',
    category: 'atta-rice-dal',
    offerText: '₹30 off on Multi-grain 5kg Atta pack',
    isFeatured: true
  },
  {
    slug: 'daawat',
    name: 'Daawat',
    logoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
    tagline: 'The Finest Basmati Rice',
    category: 'atta-rice-dal',
    offerText: 'Flat 20% off on 5kg Rozana Basmati pack',
    isFeatured: true
  },
  {
    slug: 'tata-sampann',
    name: 'Tata Sampann',
    logoUrl: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=200&h=200&fit=crop',
    tagline: 'Goodness of Nature, Sealed',
    category: 'atta-rice-dal',
    offerText: '10% off unpolished pulses & dals',
    isFeatured: true
  },
  {
    slug: 'haldirams',
    name: 'Haldirams',
    logoUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    tagline: 'Traditional Indian Sweets & Savories',
    category: 'snacks-beverages',
    offerText: 'Flat ₹15 off on party pack Aloo Bhujia',
    isFeatured: true
  },
  {
    slug: 'cadbury',
    name: 'Cadbury',
    logoUrl: 'https://images.unsplash.com/photo-1548907040-4d42b52145ca?w=200&h=200&fit=crop',
    tagline: 'Glass and a Half of Joy',
    category: 'snacks-beverages',
    offerText: 'Buy 2 Get 1 Free on Silk Bars',
    isFeatured: true
  },
  {
    slug: 'lays',
    name: 'Lay\'s',
    logoUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    tagline: 'No One Can Eat Just One',
    category: 'snacks-beverages',
    offerText: 'Flat ₹10 off on Lay\'s Maxx combos',
    isFeatured: true
  },
  {
    slug: 'nestle',
    name: 'Nestle',
    logoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop',
    tagline: 'Good Food, Good Life',
    category: 'snacks-beverages',
    offerText: 'Save ₹50 on Nescafe Classic jar packs',
    isFeatured: true
  },
  {
    slug: 'coca-cola',
    name: 'Coca-Cola',
    logoUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop',
    tagline: 'Real Magic',
    category: 'snacks-beverages',
    offerText: 'Chill combo: 2 x 750ml at ₹65',
    isFeatured: true
  },
  {
    slug: 'mccain',
    name: 'McCain',
    logoUrl: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=200&h=200&fit=crop',
    tagline: 'Make it Amazing!',
    category: 'frozen-ready-meals',
    offerText: '20% OFF on Crispy French Fries',
    isFeatured: true
  },
  {
    slug: 'fortune',
    name: 'Fortune',
    logoUrl: 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=200&h=200&fit=crop',
    tagline: 'Sehat Ki Fortune',
    category: 'oils-masalas-spices',
    offerText: 'Flat ₹23 OFF on 1L Sunflower Oil',
    isFeatured: true
  },
  {
    slug: 'hul',
    name: 'HUL',
    logoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
    tagline: 'Adding Vitality to Life',
    category: 'household-cleaning',
    offerText: 'Save ₹20 on Surf Excel 1kg',
    isFeatured: true
  },
  {
    slug: 'reckitt',
    name: 'Reckitt',
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
    tagline: 'Protects What You Love',
    category: 'household-cleaning',
    offerText: 'Flat ₹36 OFF on Harpic 1L',
    isFeatured: true
  },
  {
    slug: 'dove',
    name: 'Dove',
    logoUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
    tagline: 'Real Beauty, Real Care',
    category: 'personal-care',
    offerText: '20% OFF on Shampoo 340ml',
    isFeatured: true
  },
  {
    slug: 'mamaearth',
    name: 'Mamaearth',
    logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
    tagline: 'Goodness Inside',
    category: 'personal-care',
    offerText: 'Flat ₹40 OFF on Vitamin C Face Wash',
    isFeatured: true
  },
  {
    slug: 'pampers',
    name: 'Pampers',
    logoUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=200&h=200&fit=crop',
    tagline: 'Love, Sleep & Play',
    category: 'baby-care',
    offerText: 'Flat ₹150 OFF on Diapers Pack',
    isFeatured: true
  },
  {
    slug: 'himalaya',
    name: 'Himalaya',
    logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
    tagline: 'Wellness Since 1930',
    category: 'health-pharmacy',
    offerText: 'Flat 18% OFF on Ashvagandha',
    isFeatured: true
  },
  {
    slug: 'pedigree',
    name: 'Pedigree',
    logoUrl: 'https://images.unsplash.com/photo-1589595608370-98f1f59f635d?w=200&h=200&fit=crop',
    tagline: 'Feed the Good',
    category: 'pet-care',
    offerText: 'Save ₹110 on 3kg Dog Food',
    isFeatured: true
  },
  {
    slug: 'boat',
    name: 'boAt',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop',
    tagline: 'Plug Into Nirvana',
    category: 'electronics-accessories',
    offerText: 'Flat 56% OFF on Airdopes 141',
    isFeatured: true
  },
  {
    slug: 'duracell',
    name: 'Duracell',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop',
    tagline: 'Trusted Everywhere',
    category: 'electronics-accessories',
    offerText: 'Flat ₹25 OFF on 4-pack AA',
    isFeatured: true
  },
  {
    slug: 'classmate',
    name: 'Classmate',
    logoUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&h=200&fit=crop',
    tagline: 'Be Better Everyday',
    category: 'stationery-games',
    offerText: 'Save ₹61 on Notebook 6-Pack',
    isFeatured: true
  },
  {
    slug: 'fnp',
    name: 'FNP',
    logoUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&h=200&fit=crop',
    tagline: 'Expressing Emotions Freshly',
    category: 'flowers-gifts',
    offerText: 'Flat ₹100 OFF on Red Roses',
    isFeatured: true
  }
];
