export interface ContentBlock {
  type:
    | 'hero'
    | 'rich_text'
    | 'image_gallery'
    | 'cta'
    | 'faq'
    | 'accordion'
    | 'timeline'
    | 'team'
    | 'stats'
    | 'cards'
    | 'features'
    | 'testimonials'
    | 'video'
    | 'table'
    | 'downloads'
    | 'contact_form'
    | 'newsletter'
    | 'trust_badges'
    | 'markdown';
  data: any;
}

export interface CmsPageData {
  slug: string;
  title: string;
  subtitle?: string;
  category: 'company' | 'help' | 'policy' | 'legal' | 'business' | 'community' | 'trust' | 'discover';
  lastUpdated: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    ogImage?: string;
  };
  blocks: ContentBlock[];
  faqs?: Array<{ question: string; answer: string; category?: string }>;
  articles?: Array<{ slug: string; title: string; excerpt: string; readTime: string; author: string; date: string }>;
}

export const CONTENT_REGISTRY: Record<string, CmsPageData> = {
  // ── 1. COMPANY PAGES ────────────────────────────────────────────────────────
  'about': {
    slug: 'about',
    title: 'About AuraMart Commerce OS',
    subtitle: 'Reimagining the future of unified commerce & ultra-fast fulfillment.',
    category: 'company',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'About Us — AuraMart Commerce OS',
      metaDescription: 'AuraMart is the next-generation commerce operating system unifying multi-vendor marketplace catalog with Flado 10-minute quick-commerce delivery.',
      keywords: ['about auramart', 'ecommerce platform', 'flado quick commerce', 'retail tech'],
      canonicalUrl: 'https://auramart.com/company/about',
    },
    blocks: [
      {
        type: 'hero',
        data: {
          badge: 'OUR MISSION',
          heading: 'Building the World’s Most Seamless Commerce Infrastructure',
          description: 'AuraMart connects millions of customers with top global brands and local darkstores in under 10 minutes.',
          ctaText: 'Explore Careers',
          ctaLink: '/company/careers',
        },
      },
      {
        type: 'stats',
        data: {
          items: [
            { label: 'Active Monthly Shoppers', value: '10M+' },
            { label: 'Verified Sellers & Brands', value: '50,000+' },
            { label: 'Flado Darkstore Network', value: '1,200+' },
            { label: 'Average Delivery SLA', value: '9.4 mins' },
          ],
        },
      },
      {
        type: 'features',
        data: {
          heading: 'Why Commerce Built on AuraMart Wins',
          items: [
            { title: 'Server-Authoritative Pricing', desc: 'Real-time price computation with zero client-side manipulation.' },
            { title: 'Hyper-Local Logistics', desc: 'Automated rider assignment and micro-fulfillment routing.' },
            { title: 'Multi-Currency & Regional Commerce', desc: 'Built for international expansion across India, UAE, and global markets.' },
          ],
        },
      },
    ],
  },
  'our-story': {
    slug: 'our-story',
    title: 'Our Journey',
    subtitle: 'From a single local darkstore to an enterprise commerce OS.',
    category: 'company',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Our Story — AuraMart',
      metaDescription: 'Learn how AuraMart grew from a visionary quick-commerce startup into an enterprise-grade Commerce OS.',
      keywords: ['auramart history', 'story', 'commerce os'],
      canonicalUrl: 'https://auramart.com/company/our-story',
    },
    blocks: [
      {
        type: 'timeline',
        data: {
          items: [
            { year: '2023', title: 'The Genesis', desc: 'Launched Flado 10-minute grocery pilot with 5 darkstores.' },
            { year: '2024', title: 'Marketplace Expansion', desc: 'Integrated 10,000+ multi-vendor fashion & electronics brands.' },
            { year: '2025', title: 'Commerce OS Launch', desc: 'Unified backend micro-services, SDUI engine, and rider logistics.' },
            { year: '2026', title: 'Global Enterprise Scale', desc: 'Processing millions of daily orders across international markets.' },
          ],
        },
      },
    ],
  },
  'careers': {
    slug: 'careers',
    title: 'Join Team AuraMart',
    subtitle: 'Help us engineer the future of high-frequency commerce.',
    category: 'company',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Careers & Open Positions — AuraMart',
      metaDescription: 'Explore open engineering, product, operations, and logistics roles at AuraMart.',
      keywords: ['careers', 'tech jobs', 'engineering roles', 'hiring'],
      canonicalUrl: 'https://auramart.com/company/careers',
    },
    blocks: [
      {
        type: 'cards',
        data: {
          heading: 'Open Departments',
          items: [
            { title: 'Core Systems Engineering', text: 'Distributed systems, NestJS, TypeORM, PostgreSQL tuning.' },
            { title: 'Frontend & Mobile UX', text: 'Next.js 14, React Native Expo, SDUI page engines.' },
            { title: 'AI & Data Science', text: 'Personalization algorithms, demand prediction, rider routing.' },
            { title: 'Darkstore Operations', text: 'Micro-fulfillment logistics, inventory control, warehouse management.' },
          ],
        },
      },
    ],
  },
  'sustainability': {
    slug: 'sustainability',
    title: 'Environmental & Social Responsibility (ESG)',
    subtitle: 'Committed to net-zero logistics and 100% eco-friendly packaging by 2028.',
    category: 'company',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Sustainability & ESG — AuraMart',
      metaDescription: 'Discover AuraMart green initiatives, electric delivery fleets, and sustainable packaging goals.',
      keywords: ['sustainability', 'green delivery', 'ev fleet', 'esg'],
      canonicalUrl: 'https://auramart.com/company/sustainability',
    },
    blocks: [
      {
        type: 'rich_text',
        data: {
          content: '### Electric Delivery Fleets\nOver 80% of Flado quick-commerce deliveries are executed using 2-wheel EV bikes and electric scooters, preventing thousands of metric tons of carbon emissions annually.\n\n### Biodegradable Packaging\nAll darkstore packing materials use 100% recycled paper bags and oxo-biodegradable protective liners.',
        },
      },
    ],
  },

  // ── 2. HELP CENTER & FAQ ───────────────────────────────────────────────────
  'help-home': {
    slug: 'help-home',
    title: 'AuraMart Help Center & Customer Support',
    subtitle: 'How can we help you today?',
    category: 'help',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Help Center & Customer Support — AuraMart',
      metaDescription: 'Get instant answers for order tracking, returns, refunds, payments, and account preferences.',
      keywords: ['help center', 'customer support', 'faq', 'track order'],
      canonicalUrl: 'https://auramart.com/help',
    },
    blocks: [
      {
        type: 'faq',
        data: {
          heading: 'Frequently Asked Questions',
          items: [
            { question: 'How fast is Flado Quick Commerce delivery?', answer: 'Flado orders are dispatched from your nearest local darkstore and delivered in 10 to 15 minutes.' },
            { question: 'What is AuraMart’s return policy?', answer: 'We offer a 7-day hassle-free return window for eligible fashion and electronics products.' },
            { question: 'How do I track my live order?', answer: 'Navigate to My Account > Orders to view real-time rider location telemetry and OTP status.' },
            { question: 'What payment methods are supported?', answer: 'We accept Credit/Debit Cards, UPI, Net Banking, AuraPay Wallet, Apple Pay, and Cash on Delivery.' },
          ],
        },
      },
    ],
  },

  // ── 3. SHOPPING POLICIES ──────────────────────────────────────────────────
  'shipping-policy': {
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    subtitle: 'Transparent SLAs for Marketplace & Flado Quick Commerce deliveries.',
    category: 'policy',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Shipping & Delivery Policy — AuraMart',
      metaDescription: 'Read about AuraMart shipping speeds, delivery SLAs, shipping charges, and coverage zones.',
      keywords: ['shipping policy', 'delivery time', 'flado delivery sla'],
      canonicalUrl: 'https://auramart.com/policies/shipping',
    },
    blocks: [
      {
        type: 'rich_text',
        data: {
          content: '### 1. Delivery Modes\n- **Flado Quick Commerce**: Delivered in 10-15 minutes from nearest darkstore.\n- **Standard Marketplace Shipping**: Delivered in 1-3 business days nationwide.\n\n### 2. Shipping Charges\n- Free delivery on Flado orders above $15 (or VIP Pass holders).\n- Free marketplace delivery on orders above $35.',
        },
      },
    ],
  },
  'returns-refunds': {
    slug: 'returns-refunds',
    title: 'Returns & Refund Policy',
    subtitle: 'Simple, transparent returns with instant refund processing.',
    category: 'policy',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Returns & Refunds Policy — AuraMart',
      metaDescription: 'Learn about return eligibility windows, instant AuraPay wallet refunds, and replacement workflows.',
      keywords: ['returns policy', 'refunds', 'replacement', 'instant refund'],
      canonicalUrl: 'https://auramart.com/policies/returns-refunds',
    },
    blocks: [
      {
        type: 'rich_text',
        data: {
          content: '### 1. Return Window\n- **Marketplace Items**: 7-day doorstep return pickup.\n- **Fresh Groceries**: Instant 2-hour reporting window for damage/spoilage.\n\n### 2. Refund SLA\n- **AuraPay Wallet**: Instant credit upon item pickup.\n- **Original Payment Method**: 2-4 business days via banking channels.',
        },
      },
    ],
  },

  // ── 4. LEGAL CENTER ───────────────────────────────────────────────────────
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy & Data Protection',
    subtitle: 'We are committed to protecting your personal data and privacy rights.',
    category: 'legal',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Privacy Policy — AuraMart',
      metaDescription: 'Read the official AuraMart Privacy Policy detailing data collection, GDPR compliance, and encryption standards.',
      keywords: ['privacy policy', 'gdpr', 'data protection', 'encryption'],
      canonicalUrl: 'https://auramart.com/legal/privacy-policy',
    },
    blocks: [
      {
        type: 'rich_text',
        data: {
          content: '### 1. Information We Collect\nWe collect personal information necessary to fulfill orders, including name, shipping address, phone number, and payment preferences.\n\n### 2. Data Security & Encryption\nAll sensitive payment credentials are processed through PCI-DSS Level 1 compliant provider tokens. Password hashes utilize bcrypt with 10 salt rounds.',
        },
      },
    ],
  },
  'terms-of-service': {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    subtitle: 'Terms and conditions governing the use of AuraMart web and mobile platforms.',
    category: 'legal',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Terms of Service — AuraMart',
      metaDescription: 'Read the terms and conditions for using AuraMart marketplace, Flado quick commerce, and mobile applications.',
      keywords: ['terms of service', 'terms and conditions', 'user agreement'],
      canonicalUrl: 'https://auramart.com/legal/terms-of-service',
    },
    blocks: [
      {
        type: 'rich_text',
        data: {
          content: '### 1. Acceptance of Terms\nBy accessing or placing an order on AuraMart, you agree to be bound by these Terms of Service.\n\n### 2. User Account Security\nYou are responsible for maintaining the confidentiality of your account credentials and OTP access tokens.',
        },
      },
    ],
  },

  // ── 5. BUSINESS & PARTNER PAGES ───────────────────────────────────────────
  'become-a-seller': {
    slug: 'become-a-seller',
    title: 'Sell on AuraMart Marketplace',
    subtitle: 'Reach over 10 million active customers with industry-leading seller tools.',
    category: 'business',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Become a Seller — Sell on AuraMart',
      metaDescription: 'Register as an authorized seller on AuraMart. Enjoy low commission rates, automated payouts, and fulfillment support.',
      keywords: ['sell on auramart', 'vendor onboarding', 'merchant registration', 'seller portal'],
      canonicalUrl: 'https://auramart.com/business/become-a-seller',
    },
    blocks: [
      {
        type: 'hero',
        data: {
          badge: 'SELLER ONBOARDING',
          heading: 'Grow Your Brand with AuraMart Commerce OS',
          description: 'Access 10M+ active shoppers, automated inventory sync, and instant payout ledgers.',
          ctaText: 'Register as Seller',
          ctaLink: '/vendor/register',
        },
      },
    ],
  },

  // ── 6. COMMUNITY & BLOG ───────────────────────────────────────────────────
  'blog-home': {
    slug: 'blog-home',
    title: 'AuraMart Journal & Buying Guides',
    subtitle: 'Stories, tech insights, gift guides, and lifestyle inspiration.',
    category: 'community',
    lastUpdated: '2026-08-01',
    seo: {
      metaTitle: 'Blog & Guides — AuraMart',
      metaDescription: 'Discover buying guides, tech reviews, fashion trends, and grocery tips from AuraMart editors.',
      keywords: ['auramart blog', 'buying guides', 'tech reviews', 'fashion trends'],
      canonicalUrl: 'https://auramart.com/blog',
    },
    articles: [
      {
        slug: 'smart-home-buying-guide-2026',
        title: 'The Ultimate Smart Home Buying Guide for 2026',
        excerpt: 'Everything you need to know about choosing ecosystem-compatible smart displays, security cams, and automated lighting.',
        readTime: '6 min read',
        author: 'Tech Editors',
        date: 'Aug 4, 2026',
      },
      {
        slug: 'organic-grocery-storage-tips',
        title: '10 Fresh Storage Hacks to Make Organic Produce Last Longer',
        excerpt: 'Maximize the freshness of your Flado quick-commerce produce with these temperature and humidity storage tips.',
        readTime: '4 min read',
        author: 'Wellness Team',
        date: 'Aug 2, 2026',
      },
    ],
    blocks: [],
  },
};

export function getCmsPage(slug: string): CmsPageData {
  const normalized = slug.replace(/^\/+|\/+$/g, '');
  if (CONTENT_REGISTRY[normalized]) {
    return CONTENT_REGISTRY[normalized];
  }

  // Dynamic fallback for any slug
  return {
    slug: normalized,
    title: normalized.replace(/-/g, ' ').toUpperCase(),
    subtitle: 'AuraMart Commerce OS Information Portal',
    category: 'company',
    lastUpdated: new Date().toISOString().split('T')[0],
    seo: {
      metaTitle: `${normalized.replace(/-/g, ' ')} — AuraMart`,
      metaDescription: `Read about ${normalized.replace(/-/g, ' ')} on AuraMart Commerce OS.`,
      keywords: [normalized, 'auramart'],
      canonicalUrl: `https://auramart.com/${normalized}`,
    },
    blocks: [
      {
        type: 'hero',
        data: {
          heading: normalized.replace(/-/g, ' ').toUpperCase(),
          description: 'Official enterprise information documentation for AuraMart Commerce OS.',
        },
      },
      {
        type: 'rich_text',
        data: {
          content: `### Welcome to ${normalized.replace(/-/g, ' ')}\n\nThis page is managed by the AuraMart Server-Driven UI (SDUI) Content Management System. All information is server-authoritative and updated in real time.\n\n- **Security**: Encrypted and verified content.\n- **Coverage**: Global marketplace and Flado quick commerce operations.\n- **Support**: Available 24/7 via Customer Help Center.`,
        },
      },
    ],
  };
}
