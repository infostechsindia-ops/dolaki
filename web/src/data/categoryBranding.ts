export interface SponsorBrand {
  name: string;
  logo: string;
  slug: string;
}

export interface AdBanner {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
  accentColor: string;
}

export interface CategoryBrandSpotlight {
  slug: string;
  name: string;
  tagline: string;
  logo: string;
  bannerUrl: string;
  primaryColor: string;
}

export interface CategoryBrandingConfig {
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;
  accentColor: string;
  offerStrip: string[];
  sponsorBrands: SponsorBrand[];
  adBanners: AdBanner[];
  brandSpotlight: CategoryBrandSpotlight;
  newLaunchIds: string[];
}

export const categoryBrandingData: Record<string, CategoryBrandingConfig> = {
  electronics: {
    slug: 'electronics',
    heroTitle: '⚡ Flagship Electronics Mall',
    heroSubtitle: 'Direct official brand stores, up to 12 months no-cost EMI options',
    heroBannerUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop',
    accentColor: '#7C3AED',
    offerStrip: [
      '🔥 Flat 10% instant discount on HDFC Bank Cards',
      '🏷️ Exchange Bonus: Up to ₹5,000 extra on old devices',
      '🚚 Free express dispatch & secure transit shield'
    ],
    sponsorBrands: [
      { name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop', slug: 'apple' },
      { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop', slug: 'samsung' },
      { name: 'boAt', logo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop', slug: 'boat' },
      { name: 'OnePlus', logo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=200&h=200&fit=crop', slug: 'oneplus' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=300&fit=crop',
        title: 'Upgrade to AuraPods Pro',
        subtitle: 'Experience true silence with active noise cancellation.',
        ctaText: 'Shop Now',
        link: '/products/ele-1',
        accentColor: '#7C3AED'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=300&fit=crop',
        title: 'Samsung Galaxy Watch Premium',
        subtitle: 'Keep tabs on health metrics & active workout tracking.',
        ctaText: 'Grab Deal',
        link: '/products/ele-2',
        accentColor: '#0A47A0'
      }
    ],
    brandSpotlight: {
      slug: 'apple',
      name: 'Apple Store',
      tagline: 'Think Different. Upgrade to premium titanium designs.',
      logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1000&h=300&fit=crop',
      primaryColor: '#000000'
    },
    newLaunchIds: ['ele-5', 'ele-6']
  },
  fashion: {
    slug: 'fashion',
    heroTitle: '👕 Trendsetters Apparel Hub',
    heroSubtitle: 'Explore fresh seasonal arrivals, streetwear drops, and ethnic staples',
    heroBannerUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&h=400&fit=crop',
    accentColor: '#E11D48',
    offerStrip: [
      '✨ Buy 2 Get 1 FREE across verified lifestyle catalogs',
      '🏷️ Coupon TRENCH20: Flat 20% discount on jacket edits',
      '📦 Standard 30-day hassle-free returns & direct exchanges'
    ],
    sponsorBrands: [
      { name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', slug: 'nike' },
      { name: 'Adidas', logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200&h=200&fit=crop', slug: 'adidas' },
      { name: 'Manyavar', logo: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=200&fit=crop', slug: 'manyavar' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&h=300&fit=crop',
        title: 'Adidas Ultraboost Light',
        subtitle: 'Experience ultimate responsive cushioning and speed.',
        ctaText: 'View Footwear',
        link: '/products/fas-4',
        accentColor: '#000000'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=300&fit=crop',
        title: 'Manyavar Celebration Wear',
        subtitle: 'Intricate ethnic designs for weddings and festivities.',
        ctaText: 'Explore Collection',
        link: '/products/fas-5',
        accentColor: '#800020'
      }
    ],
    brandSpotlight: {
      slug: 'adidas',
      name: 'Adidas Flagship',
      tagline: 'Impossible is Nothing. Premium sportswear & original sneakers.',
      logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1000&h=300&fit=crop',
      primaryColor: '#000000'
    },
    newLaunchIds: ['fas-4', 'fas-5']
  },
  beauty: {
    slug: 'beauty',
    heroTitle: '💄 Natural Skincare & Makeup Bazaar',
    heroSubtitle: 'Toxin-free chemical-free certified wellness essentials',
    heroBannerUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    accentColor: '#DB2777',
    offerStrip: [
      '🌱 Flat 15% off on Mamaearth Organic Serums',
      '🌟 Get free Lakme beauty kit on orders above ₹1,499',
      '🧴 All organic catalogs are MadeSafe certified clean'
    ],
    sponsorBrands: [
      { name: 'Lakme', logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop', slug: 'lakme' },
      { name: 'Mamaearth', logo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop', slug: 'mamaearth' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=300&fit=crop',
        title: 'Lakme Absolute Matte',
        subtitle: 'Enriched with nourishing argan oils for long wear.',
        ctaText: 'Get Matte',
        link: '/products/be-3',
        accentColor: '#D4AF37'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=300&fit=crop',
        title: 'Mamaearth Onion Shampoo',
        subtitle: 'Reduce hair fall & strengthen root fibers naturally.',
        ctaText: 'Shop Organic',
        link: '/products/be-4',
        accentColor: '#4CAF50'
      }
    ],
    brandSpotlight: {
      slug: 'mamaearth',
      name: 'Mamaearth Organic',
      tagline: 'Goodness Inside. Safe, toxic-free and natural care routines.',
      logo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1000&h=300&fit=crop',
      primaryColor: '#4CAF50'
    },
    newLaunchIds: ['be-3', 'be-4']
  },
  home: {
    slug: 'home',
    heroTitle: '🛋️ IKEA & Cozy Furnishings Center',
    heroSubtitle: 'Minimalist decors, comfortable armchairs, and smart dividers',
    heroBannerUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=400&fit=crop',
    accentColor: '#059669',
    offerStrip: [
      '🛋️ IKEA Store Exclusive: Flat 10% cashback to AuraPay',
      '📦 Free home assembly on smart storage packages',
      '🌟 10-Year official manufacturer warranty on frameworks'
    ],
    sponsorBrands: [
      { name: 'IKEA', logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop', slug: 'ikea' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=300&fit=crop',
        title: 'IKEA KALLAX Shelves',
        subtitle: 'Versatile storage shelving. Use vertically or as dividers.',
        ctaText: 'View Storage',
        link: '/products/hom-3',
        accentColor: '#0058A3'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=300&fit=crop',
        title: 'IKEA POÄNG Armchair',
        subtitle: 'Layer-glued birch frame gives a comfortable flex.',
        ctaText: 'Relax Today',
        link: '/products/hom-4',
        accentColor: '#FFCC00'
      }
    ],
    brandSpotlight: {
      slug: 'ikea',
      name: 'IKEA Gallery Store',
      tagline: 'Democratic design. Affordable quality furnishings.',
      logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&h=300&fit=crop',
      primaryColor: '#0058A3'
    },
    newLaunchIds: ['hom-3', 'hom-4']
  },
  groceries: {
    slug: 'groceries',
    heroTitle: '🍎 Fresh Grocery & Snacks Market',
    heroSubtitle: 'Delivered in 10-mins via Flado Darkstores',
    heroBannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop',
    accentColor: '#059669',
    offerStrip: [
      '⚡ 10-Min doorstep delivery guaranteed or cashback',
      '🥛 Amul Milk, Butter and Dairy delivered fresh',
      '🍿 Free classic Lay\'s chips packet on orders above ₹199'
    ],
    sponsorBrands: [
      { name: 'Amul', logo: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop', slug: 'amul' },
      { name: 'Nestle', logo: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=200&h=200&fit=crop', slug: 'nestle' },
      { name: 'Haldirams', logo: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=200&h=200&fit=crop', slug: 'haldirams' },
      { name: 'Cadbury', logo: 'https://images.unsplash.com/photo-1548907040-4d42b52115ca?w=200&h=200&fit=crop', slug: 'cadbury' },
      { name: 'Lay\'s', logo: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop', slug: 'lays' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&h=300&fit=crop',
        title: 'Haldirams Savories',
        subtitle: 'Authentic Indian Aloo Bhujia spicy teatime namkeen.',
        ctaText: 'Add to Cart',
        link: '/products/gro-7',
        accentColor: '#F59E0B'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=300&fit=crop',
        title: 'Cadbury Dairy Milk Silk',
        subtitle: 'Rich premium melt-in-mouth creamy milk chocolate.',
        ctaText: 'Indulge Now',
        link: '/products/gro-8',
        accentColor: '#4A0080'
      }
    ],
    brandSpotlight: {
      slug: 'amul',
      name: 'Amul Dairy Spot',
      tagline: 'The Taste of India. Sourced cooperatives dairy fresh daily.',
      logo: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&h=300&fit=crop',
      primaryColor: '#D32F2F'
    },
    newLaunchIds: ['gro-7', 'gro-8']
  },
  sports: {
    slug: 'sports',
    heroTitle: '⚽ Athletics Equipment Arena',
    heroSubtitle: 'Professional racquets, high-friction soccer balls, and running shoes',
    heroBannerUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&h=400&fit=crop',
    accentColor: '#D97706',
    offerStrip: [
      '🏸 Yonex Nanoray Carbon rackets flat 20% discount',
      '⚽ Premium hand-stitched soccer balls with air-retention',
      '📦 Direct official brand warranty certified checkouts'
    ],
    sponsorBrands: [
      { name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', slug: 'nike' },
      { name: 'Adidas', logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200&h=200&fit=crop', slug: 'adidas' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=300&fit=crop',
        title: 'Nike Zoom Running Shoes',
        subtitle: 'Responsive sole, dynamic grip mesh, ultralight fits.',
        ctaText: 'View Detail',
        link: '/products/fas-3',
        accentColor: '#E25822'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&h=300&fit=crop',
        title: 'Adidas Workout Edits',
        subtitle: 'Lightweight, sweat-wicking materials for top metrics.',
        ctaText: 'Shop Gear',
        link: '/products/fas-4',
        accentColor: '#000000'
      }
    ],
    brandSpotlight: {
      slug: 'nike',
      name: 'Nike Athletics Store',
      tagline: 'Just Do It. Premium running gear & football gear.',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1000&h=300&fit=crop',
      primaryColor: '#E25822'
    },
    newLaunchIds: ['fas-3', 'fas-4']
  },
  appliances: {
    slug: 'appliances',
    heroTitle: '🧹 Dyson Smart Home Appliances',
    heroSubtitle: 'Cordless cyclonic vacuums, air purifiers, and hair care utilities',
    heroBannerUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&h=400&fit=crop',
    accentColor: '#0284C7',
    offerStrip: [
      '🧹 Dyson Cordless stick vacuum flat ₹5,000 coupon checkout',
      '📦 Free professional home demo and installation support',
      '💳 No Cost EMI up to 18 Months on credit card top-ups'
    ],
    sponsorBrands: [
      { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop', slug: 'samsung' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=300&fit=crop',
        title: 'Dyson Cyclone Cordless Stick',
        subtitle: '150AW suction power with HEPA air filtration.',
        ctaText: 'Configure Home',
        link: '/products/app-1',
        accentColor: '#0284C7'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=300&fit=crop',
        title: 'Samsung Premium Appliances',
        subtitle: 'Smart digital invertors and smart features.',
        ctaText: 'View Store',
        link: '/brands/samsung',
        accentColor: '#0A47A0'
      }
    ],
    brandSpotlight: {
      slug: 'samsung',
      name: 'Samsung Flagships',
      tagline: 'Inspire the world. Smart refrigerators, TVs and washers.',
      logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000&h=300&fit=crop',
      primaryColor: '#0A47A0'
    },
    newLaunchIds: ['app-1']
  },
  toys: {
    slug: 'toys',
    heroTitle: '🧱 LEGO Official Creative Blocks Mall',
    heroSubtitle: 'Build space shuttle Discovery, complex structures, and fun collections',
    heroBannerUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1200&h=400&fit=crop',
    accentColor: '#DC2626',
    offerStrip: [
      '🧱 LEGO Space Shuttle Discovery 2354-pcs set special launch price',
      '🚚 Free packaging box protection bubble-wrapped transit',
      '👶 Ages 18+ challenging models and toddler building blocks'
    ],
    sponsorBrands: [
      { name: 'IKEA', logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop', slug: 'ikea' }
    ],
    adBanners: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&h=300&fit=crop',
        title: 'LEGO Space Shuttle Discovery',
        subtitle: '2,354 pieces model set detailing cargo doors and Hubble.',
        ctaText: 'Add to Cart',
        link: '/products/toy-1',
        accentColor: '#DC2626'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=300&fit=crop',
        title: 'IKEA Creative Children Rooms',
        subtitle: 'Explore shelving boxes and toys drawers storage.',
        ctaText: 'View Furniture',
        link: '/brands/ikea',
        accentColor: '#0058A3'
      }
    ],
    brandSpotlight: {
      slug: 'ikea',
      name: 'IKEA Children’s Space',
      tagline: 'Simple structures, creative organization, safe builds.',
      logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1000&h=300&fit=crop',
      primaryColor: '#0058A3'
    },
    newLaunchIds: ['toy-1']
  }
};
