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
    category: 'dairy-bread-eggs',
    offerText: 'Buy 2 get 15% off on whole wheat bread',
    isFeatured: true
  },
  {
    slug: 'aashirvaad',
    name: 'Aashirvaad',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
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
    isFeatured: false
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
    name: 'Lays',
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
    name: 'Coca Cola',
    logoUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop',
    tagline: 'Taste the Feeling',
    category: 'snacks-beverages',
    offerText: 'Free Coca-Cola Can on orders above ₹250',
    isFeatured: false
  },
  {
    slug: 'mccain',
    name: 'McCain',
    logoUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
    tagline: 'It\'s all good',
    category: 'frozen-ready-meals',
    offerText: 'Save 20% on Frozen French Fries packs',
    isFeatured: true
  },
  {
    slug: 'hul',
    name: 'HUL',
    logoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
    tagline: 'Everyday Essentials for a Better Future',
    category: 'household-cleaning',
    offerText: 'Flat ₹40 off on liquid detergent bottles',
    isFeatured: true
  },
  {
    slug: 'reckitt',
    name: 'Reckitt',
    logoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
    tagline: 'Clean Homes, Healthy Lives',
    category: 'household-cleaning',
    offerText: 'Flat ₹30 off on Harpic + Lizol combo packs',
    isFeatured: false
  },
  {
    slug: 'colgate',
    name: 'Colgate',
    logoUrl: 'https://images.unsplash.com/photo-1559591937-e6fcd20d200c?w=200&h=200&fit=crop',
    tagline: 'Bright Smiles, Bright Futures',
    category: 'personal-care',
    offerText: 'Flat 15% off on MaxFresh twin packs',
    isFeatured: false
  },
  {
    slug: 'lakme',
    name: 'Lakme',
    logoUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop',
    tagline: 'Reinventing Indian Beauty Standards',
    category: 'personal-care',
    offerText: 'Flat 20% off on Liquid Lip Colors',
    isFeatured: true
  },
  {
    slug: 'mamaearth',
    name: 'Mamaearth',
    logoUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop',
    tagline: 'Goodness Inside, Naturally',
    category: 'personal-care',
    offerText: 'Save 25% on Organic Tea Tree Facewash',
    isFeatured: true
  },
  {
    slug: 'pampers',
    name: 'Pampers',
    logoUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=200&h=200&fit=crop',
    tagline: 'Love, Sleep & Play Everyday',
    category: 'baby-care',
    offerText: 'Save ₹150 on Diaper Pant Box orders',
    isFeatured: true
  },
  {
    slug: 'himalaya',
    name: 'Himalaya',
    logoUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=200&h=200&fit=crop',
    tagline: 'Herbal Care for Healthy Growth',
    category: 'baby-care',
    offerText: 'Buy 2 Get 1 Free on Baby Soaps',
    isFeatured: false
  },
  {
    slug: 'boat',
    name: 'boAt',
    logoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    tagline: 'Plug Into Nirvana',
    category: 'electronics-accessories',
    offerText: 'Save flat ₹100 on Bassheads wired earphones',
    isFeatured: true
  },
  {
    slug: 'duracell',
    name: 'Duracell',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop',
    tagline: 'Lasts Up to 10 Times Longer',
    category: 'electronics-accessories',
    offerText: 'Save 10% on AA Alkaline 4-Pack batteries',
    isFeatured: false
  },
  {
    slug: 'fnp',
    name: 'Ferns N Petals',
    logoUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&h=200&fit=crop',
    tagline: 'Making Celebrations Memorable',
    category: 'flowers-gifts',
    offerText: 'Flat 15% off fresh Rose bouquets today',
    isFeatured: true
  }
];
