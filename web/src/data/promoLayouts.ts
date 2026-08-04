export interface MarketingItem {
  id: string;
  imageUrl: string; // supports .png, .jpg, .jpeg, .gif, .svg
  linkUrl: string; // e.g. /products/ele-1, /categories/fashion, /promo/diwali-festivals
  title?: string;
  subTitle?: string;
  resolutionInfo: string; // Guidelines for marketers
}

export type SectionType = 
  | 'round-bubbles' // 150px X 150px (Circle)
  | 'grid-2'        // 600px X 300px (2 Columns)
  | 'grid-3'        // 400px X 210px (3 Columns)
  | 'carousel-1'    // 1200px X 400px (1 Column Carousel)
  | 'carousel-2';   // 580px X 320px (2 Columns Carousel)

export interface FestiveOverlay {
  svgUrl?: string; // Inline SVG markup or decorative symbol (e.g. 🏮, ✨)
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'full';
  opacity?: number;
}

export interface MarketingSection {
  id: string;
  type: SectionType;
  heading?: string;
  subHeading?: string;
  headingColor?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string; // support background JPG/PNG/GIF/SVG
  backgroundSize?: 'cover' | 'contain' | 'auto';
  festiveHighlights?: FestiveOverlay[];
  items: MarketingItem[];
}

export interface PromoPageConfig {
  slug: string;
  title: string;
  description?: string;
  themeColor?: string;
  sections: MarketingSection[];
}

export const promoPagesRegistry: Record<string, PromoPageConfig> = {
  'monsoon-clearance': {
    slug: 'monsoon-clearance',
    title: '☔ Monsoon Clearance Blast',
    description: 'Get up to 60% off on rain gear, waterproof electronics, and streetwear styling accessories.',
    themeColor: '#2563EB',
    sections: [
      {
        id: 'monsoon-hero',
        type: 'carousel-1',
        heading: '🔥 Mega Deals of the Day',
        items: [
          {
            id: 'm-hero-1',
            imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=400&fit=crop',
            linkUrl: '/categories/fashion',
            title: 'Waterproof Outdoors Apparel',
            resolutionInfo: '1200px X 400px'
          },
          {
            id: 'm-hero-2',
            imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1200&h=400&fit=crop',
            linkUrl: '/categories/electronics',
            title: 'IPX7 Certified Audio Gear',
            resolutionInfo: '1200px X 400px'
          }
        ]
      },
      {
        id: 'monsoon-brands',
        type: 'round-bubbles',
        heading: '🏆 Featured Rain Partners',
        backgroundColor: '#F1F5F9',
        items: [
          { id: 'mb-1', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop', linkUrl: '/brands/nike', title: 'Nike', resolutionInfo: '150px X 150px' },
          { id: 'mb-2', imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=150&h=150&fit=crop', linkUrl: '/brands/adidas', title: 'Adidas', resolutionInfo: '150px X 150px' },
          { id: 'mb-3', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&h=150&fit=crop', linkUrl: '/brands/boat', title: 'boAt', resolutionInfo: '150px X 150px' }
        ]
      },
      {
        id: 'monsoon-grids',
        type: 'grid-3',
        heading: '⚡ Category Spotlights',
        items: [
          { id: 'mg-1', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=210&fit=crop', linkUrl: '/categories/electronics', title: 'Tech Essentials', subTitle: 'Up to 30% Off', resolutionInfo: '400px X 210px' },
          { id: 'mg-2', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=210&fit=crop', linkUrl: '/categories/fashion', title: 'Rain Apparel', subTitle: 'Min. 40% Off', resolutionInfo: '400px X 210px' },
          { id: 'mg-3', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=210&fit=crop', linkUrl: '/categories/beauty', title: 'Waterproof Make-up', subTitle: 'Special Combos', resolutionInfo: '400px X 210px' }
        ]
      }
    ]
  },
  'diwali-festivals': {
    slug: 'diwali-festivals',
    title: '🏮 Diwali Shubh Utsav Bazaar',
    description: 'Bring home prosperity and light with special festive clothing, decor lighting, sweet bundles, and brand spotlights.',
    themeColor: '#EA580C',
    sections: [
      {
        id: 'diwali-hero',
        type: 'carousel-2',
        heading: '✨ Shubh Muhurat Bestsellers',
        backgroundImageUrl: 'https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?w=1200&h=400&fit=crop',
        backgroundSize: 'cover',
        festiveHighlights: [
          { position: 'top-left', opacity: 0.95 } // Decorative lights
        ],
        items: [
          { id: 'dh-1', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=580&h=320&fit=crop', linkUrl: '/lookbook/festive-elegance', title: 'Festive Silk Sherwanis', subTitle: 'Flat 20% Off', resolutionInfo: '580px X 320px' },
          { id: 'dh-2', imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=580&h=320&fit=crop', linkUrl: '/categories/jewellery', title: '24K Gold Necklaces', subTitle: 'No Making Charges', resolutionInfo: '580px X 320px' }
        ]
      },
      {
        id: 'diwali-spotlights',
        type: 'grid-2',
        heading: '🏮 Home Decor Spotlights',
        items: [
          { id: 'ds-1', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=300&fit=crop', linkUrl: '/categories/home', title: 'Decorative Brass Diyas', subTitle: 'Starting ₹199', resolutionInfo: '600px X 300px' },
          { id: 'ds-2', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=300&fit=crop', linkUrl: '/categories/home', title: 'Ambient Fairy Lights', subTitle: 'Buy 1 Get 1 Free', resolutionInfo: '600px X 300px' }
        ]
      }
    ]
  },
  'homepage-marketing': {
    slug: 'homepage-marketing',
    title: '🏠 Storefront Premium Promotions',
    description: 'Dynamic content-managed campaign strips loaded directly on the storefront homepage.',
    themeColor: '#7C3AED',
    sections: [
      {
        id: 'home-sponsors',
        type: 'carousel-2',
        heading: '🔥 Sponsored Mega Spotlights',
        subHeading: 'Exclusive deals from our premier brand partners',
        items: [
          { id: 'hs-1', imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=580&h=320&fit=crop', linkUrl: '/promo/diwali-festivals', title: 'Diwali Festive Sale', subTitle: 'Up to 60% Off', resolutionInfo: '580px X 320px' },
          { id: 'hs-2', imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=580&h=320&fit=crop', linkUrl: '/promo/monsoon-clearance', title: 'Monsoon Rain Gear', subTitle: 'Flat 50% Off', resolutionInfo: '580px X 320px' }
        ]
      },
      {
        id: 'home-featured-brands',
        type: 'round-bubbles',
        heading: '🏆 Featured Brand Spotlight',
        subHeading: 'Official store collections at AuraMart',
        backgroundColor: '#F8FAFC',
        items: [
          { id: 'hb-1', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop', linkUrl: '/brands/nike', title: 'Nike Store', resolutionInfo: '150px X 150px' },
          { id: 'hb-2', imageUrl: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=150&h=150&fit=crop', linkUrl: '/brands/adidas', title: 'Adidas Direct', resolutionInfo: '150px X 150px' },
          { id: 'hb-3', imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop', linkUrl: '/seller/auraretail', title: 'AuraRetail', resolutionInfo: '150px X 150px' },
          { id: 'hb-4', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&h=150&fit=crop', linkUrl: '/brands/boat', title: 'boAt Hub', resolutionInfo: '150px X 150px' }
        ]
      }
    ]
  },
  'flado-marketing': {
    slug: 'flado-marketing',
    title: '⚡ Flado Quick Commerce Promotions',
    description: 'Dynamic content-managed fast-delivery strips loaded on the Flado homepage.',
    themeColor: '#059669',
    sections: [
      {
        id: 'flado-flash-deals',
        type: 'grid-3',
        heading: '🍉 Super Saver Quick Spotlights',
        subHeading: 'Delivered in under 10 minutes from your local darkstore',
        items: [
          { id: 'ffd-1', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=210&fit=crop', linkUrl: '/flado/categories/fruits-vegetables', title: 'Fresh Produce Deal', subTitle: 'Flat 20% Off', resolutionInfo: '400px X 210px' },
          { id: 'ffd-2', imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=210&fit=crop', linkUrl: '/flado/categories/dairy-bread', title: 'Dairy & Breakfast Essentials', subTitle: 'Fresh Stock Daily', resolutionInfo: '400px X 210px' },
          { id: 'ffd-3', imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=210&fit=crop', linkUrl: '/flado/categories/snacks-beverages', title: 'Crispy Snack Deals', subTitle: 'Min. 30% Off', resolutionInfo: '400px X 210px' }
        ]
      }
    ]
  }
};
