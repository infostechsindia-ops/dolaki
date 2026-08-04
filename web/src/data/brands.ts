export interface Brand {
  slug: string;
  name: string;
  logo: string;
  bannerUrl: string;
  tagline: string;
  story: string;
  categories: string[];
  featuredProductIds: string[];
  primaryColor: string;
  accentColor: string;
}

export const brandsData: Brand[] = [
  {
    slug: 'apple',
    name: 'Apple',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1200&h=400&fit=crop',
    tagline: 'Think Different',
    story: 'Designing the finest personal computers in the world, along with OS X, iLife, iWork and professional software. Apple leads the digital music revolution with its iPods and iTunes online store.',
    categories: ['electronics'],
    featuredProductIds: ['ele-5', 'ele-6'],
    primaryColor: '#000000',
    accentColor: '#888888'
  },
  {
    slug: 'samsung',
    name: 'Samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&h=400&fit=crop',
    tagline: 'Do What You Can\'t',
    story: 'Inspire the world with our innovative technologies, products and design that enrich people\'s lives and contribute to social prosperity by creating a new future.',
    categories: ['electronics', 'appliances'],
    featuredProductIds: ['ele-2'],
    primaryColor: '#0A47A0',
    accentColor: '#14213d'
  },
  {
    slug: 'nike',
    name: 'Nike',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&h=400&fit=crop',
    tagline: 'Just Do It',
    story: 'Our mission is to bring inspiration and innovation to every athlete in the world. If you have a body, you are an athlete.',
    categories: ['fashion', 'sports'],
    featuredProductIds: ['fas-3'],
    primaryColor: '#E25822',
    accentColor: '#000000'
  },
  {
    slug: 'adidas',
    name: 'Adidas',
    logo: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1200&h=400&fit=crop',
    tagline: 'Impossible is Nothing',
    story: 'Through sport, we have the power to change lives. Adidas designs and manufactures sports clothing, shoes, and accessories.',
    categories: ['fashion', 'sports'],
    featuredProductIds: ['fas-4'],
    primaryColor: '#000000',
    accentColor: '#7F7F7F'
  },
  {
    slug: 'lakme',
    name: 'Lakme',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    tagline: 'Reinventing Beauty',
    story: 'Lakme is India\'s first salon brand and cosmetic giant, combining international cosmetic technology with an in-depth understanding of Indian skin needs.',
    categories: ['beauty'],
    featuredProductIds: ['be-3'],
    primaryColor: '#D4AF37',
    accentColor: '#1A1A1A'
  },
  {
    slug: 'mamaearth',
    name: 'Mamaearth',
    logo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=1200&h=400&fit=crop',
    tagline: 'Goodness Inside',
    story: 'Asia\'s first brand with MadeSafe certified products that are toxic-free, organic, and entirely natural. Good for you and good for Mother Earth.',
    categories: ['beauty', 'baby-care'],
    featuredProductIds: ['be-4'],
    primaryColor: '#4CAF50',
    accentColor: '#8BC34A'
  },
  {
    slug: 'amul',
    name: 'Amul',
    logo: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&h=400&fit=crop',
    tagline: 'The Taste of India',
    story: 'Amul sparked the Dairy Cooperative movement of India and white revolution, making India the largest milk producer in the world.',
    categories: ['groceries', 'dairy-bread'],
    featuredProductIds: ['gro-2'],
    primaryColor: '#D32F2F',
    accentColor: '#1976D2'
  },
  {
    slug: 'nestle',
    name: 'Nestle',
    logo: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200&h=400&fit=crop',
    tagline: 'Good Food, Good Life',
    story: 'Nestlé is the world\'s largest food and beverage company, committed to enhancing quality of life and contributing to a healthier future.',
    categories: ['groceries', 'snacks-beverages'],
    featuredProductIds: ['gro-6'],
    primaryColor: '#005A9C',
    accentColor: '#FFCC00'
  },
  {
    slug: 'boat',
    name: 'boAt',
    logo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=400&fit=crop',
    tagline: 'Plug Into Nirvana',
    story: 'An Indian consumer electronics brand that markets earwear, audio gear, smartwatches, and mobile accessories. Truly designed for the fashionable youth.',
    categories: ['electronics'],
    featuredProductIds: ['ele-3'],
    primaryColor: '#EF233C',
    accentColor: '#2B2D42'
  },
  {
    slug: 'oneplus',
    name: 'OnePlus',
    logo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=400&fit=crop',
    tagline: 'Never Settle',
    story: 'Creating beautifully designed, high-performance smartphones and devices with meticulous craftsmanship and smooth custom software.',
    categories: ['electronics'],
    featuredProductIds: ['ele-2'],
    primaryColor: '#F5001C',
    accentColor: '#1C1C1C'
  },
  {
    slug: 'haldirams',
    name: 'Haldirams',
    logo: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=1200&h=400&fit=crop',
    tagline: 'Traditional Indian Sweets and Savory Snacks',
    story: 'Haldiram\'s is a major Indian sweets, savouries and snacks manufacturer, serving delectable traditional flavors to millions worldwide.',
    categories: ['groceries', 'snacks-beverages'],
    featuredProductIds: ['gro-7'],
    primaryColor: '#F59E0B',
    accentColor: '#8B5CF6'
  },
  {
    slug: 'cadbury',
    name: 'Cadbury',
    logo: 'https://images.unsplash.com/photo-1548907040-4d42b52115ca?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1200&h=400&fit=crop',
    tagline: 'Glass and a Half of Joy',
    story: 'Bringing sweetness to your celebrations for generations. Made with fresh milk chocolate to ensure a rich creamy melt.',
    categories: ['groceries', 'snacks-beverages'],
    featuredProductIds: ['gro-8'],
    primaryColor: '#301934',
    accentColor: '#D4AF37'
  },
  {
    slug: 'lays',
    name: 'Lay\'s',
    logo: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=1200&h=400&fit=crop',
    tagline: 'No One Can Eat Just One',
    story: 'Crispy, crunchy, and packed with flavor. Lay\'s brings you potato chips made from carefully selected high-quality potatoes.',
    categories: ['groceries', 'snacks-beverages'],
    featuredProductIds: ['gro-5'],
    primaryColor: '#FFD700',
    accentColor: '#D2143A'
  },
  {
    slug: 'manyavar',
    name: 'Manyavar',
    logo: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?w=1200&h=400&fit=crop',
    tagline: 'Celebration Wear',
    story: 'India\'s leading ethnic wear brand for men, pioneering the category with elegant sherwanis, kurtas, and accessories for wedding and festive occasions.',
    categories: ['fashion'],
    featuredProductIds: ['fas-5'],
    primaryColor: '#800020',
    accentColor: '#FFD700'
  },
  {
    slug: 'ikea',
    name: 'IKEA',
    logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=400&fit=crop',
    tagline: 'Democratic Design',
    story: 'To create a better everyday life for the many people by offering a wide range of well-designed, functional home furnishing products at low prices.',
    categories: ['home'],
    featuredProductIds: ['hom-3', 'hom-4'],
    primaryColor: '#0058A3',
    accentColor: '#FFCC00'
  }
];
