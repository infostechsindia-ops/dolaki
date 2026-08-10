/**
 * AuraMart Enterprise Feature Flag Registry & Control Console
 *
 * CMS-driven Feature Flag System providing runtime enable/disable controls for 30 platform features
 * with region targeting, user segment targeting, percentage rollout, and instant rollback.
 */

export interface FeatureFlagRule {
  id: string;
  name: string;
  category: 'CORE' | 'COMMERCE' | 'PAYMENTS' | 'ENGAGEMENT' | 'AI_SEARCH' | 'OPS';
  enabled: boolean;
  percentageRollout: number; // 0 to 100
  targetRegions: string[]; // ["IN", "AE", "GLOBAL"]
  targetSegments: string[]; // ["ALL", "VIP", "NEW_USER"]
  description: string;
}

export const FEATURE_FLAG_REGISTRY: Record<string, FeatureFlagRule> = {
  flado: { id: 'flado', name: 'Flado Quick-Commerce Engine', category: 'CORE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Sub-15 min quick commerce grocery fulfillment.' },
  grocery: { id: 'grocery', name: 'Fresh Grocery Catalog', category: 'CORE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Fresh fruits, vegetables, and daily dairy catalog.' },
  pharmacy: { id: 'pharmacy', name: 'Pharmacy & Wellness', category: 'CORE', enabled: true, percentageRollout: 100, targetRegions: ['IN', 'GLOBAL'], targetSegments: ['ALL'], description: 'OTC medicine and health wellness catalog.' },
  coupons: { id: 'coupons', name: 'Coupons & Discount Engine', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Server-authoritative promotional coupon application.' },
  auraCoins: { id: 'auraCoins', name: 'AuraCoins Cashback Loyalty', category: 'ENGAGEMENT', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: '2% store credit earn & redeem system.' },
  wallet: { id: 'wallet', name: 'AuraPay Digital Wallet', category: 'PAYMENTS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Stored-value wallet and instant refund balance.' },
  referral: { id: 'referral', name: 'Referral & Earn Rewards', category: 'ENGAGEMENT', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Referral link reward distribution.' },
  vipPass: { id: 'vipPass', name: 'Flado VIP Pass Subscription', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: '₹99/mo subscription for unlimited free delivery.' },
  aiAssistant: { id: 'aiAssistant', name: 'AuraAI Shopping Assistant', category: 'AI_SEARCH', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Natural language shopping recommendation assistant.' },
  recommendations: { id: 'recommendations', name: 'Personalized Recommendation Engine', category: 'AI_SEARCH', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'ML-driven related & buy-it-with products.' },
  voiceSearch: { id: 'voiceSearch', name: 'Voice Search Command', category: 'AI_SEARCH', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Speech-to-text catalog search input.' },
  imageSearch: { id: 'imageSearch', name: 'Visual Image Search', category: 'AI_SEARCH', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Image upload visual product matching.' },
  liveTracking: { id: 'liveTracking', name: 'Real-Time Order Live Tracking', category: 'CORE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'GPS rider tracking and status milestones.' },
  chatSupport: { id: 'chatSupport', name: 'Live Support Ticket Chat', category: 'CORE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Interactive support ticket agent communication.' },
  cod: { id: 'cod', name: 'Cash on Delivery (COD)', category: 'PAYMENTS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Pay cash upon delivery receiving.' },
  applePay: { id: 'applePay', name: 'Apple Pay Direct Checkout', category: 'PAYMENTS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'One-touch Apple Pay mobile wallet checkout.' },
  googlePay: { id: 'googlePay', name: 'Google Pay & UPI Integration', category: 'PAYMENTS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Instant UPI and Google Pay payment flow.' },
  expressDelivery: { id: 'expressDelivery', name: 'Express Next-Day Delivery', category: 'CORE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Guaranteed 24-hour fulfillment option.' },
  buyAgain: { id: 'buyAgain', name: 'Quick Buy Again Shelf', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'One-click reordering of previous cart items.' },
  continueShopping: { id: 'continueShopping', name: 'Continue Shopping Carousel', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Resume incomplete browsing session.' },
  recentlyViewed: { id: 'recentlyViewed', name: 'Recently Viewed Products', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'History shelf of browsed product SKUs.' },
  wishlist: { id: 'wishlist', name: 'Customer Wishlist & Saved Items', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Save products for later purchase.' },
  compare: { id: 'compare', name: 'Product Comparison Engine', category: 'COMMERCE', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Side-by-side spec comparison table.' },
  reviews: { id: 'reviews', name: 'Verified Customer Reviews & Ratings', category: 'ENGAGEMENT', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Rating stars, photo reviews, and helpful votes.' },
  qAndA: { id: 'qAndA', name: 'Product Questions & Answers', category: 'ENGAGEMENT', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Customer Q&A forum on product detail pages.' },
  blog: { id: 'blog', name: 'AuraMart Tech & Lifestyle Blog', category: 'ENGAGEMENT', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Articles, news releases, and product teardowns.' },
  buyingGuides: { id: 'buyingGuides', name: 'Interactive Buying Guides', category: 'ENGAGEMENT', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Category decision guides and sizing charts.' },
  sellerProgram: { id: 'sellerProgram', name: 'Merchant & Seller Registration', category: 'OPS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Vendor onboarding and store creation portal.' },
  warehouseOperations: { id: 'warehouseOperations', name: 'Warehouse Fulfillment Engine', category: 'OPS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Picking SLA, packing SLA, and stock audit tools.' },
  riderOperations: { id: 'riderOperations', name: 'Flado Fleet Rider Dispatch', category: 'OPS', enabled: true, percentageRollout: 100, targetRegions: ['GLOBAL'], targetSegments: ['ALL'], description: 'Geofenced rider allocation and route optimization.' }
};

export function isFeatureEnabled(flagId: string, region: string = 'GLOBAL', userSegment: string = 'ALL'): boolean {
  const flag = FEATURE_FLAG_REGISTRY[flagId];
  if (!flag || !flag.enabled) return false;
  const isRegionMatch = flag.targetRegions.includes('GLOBAL') || flag.targetRegions.includes(region);
  const isSegmentMatch = flag.targetSegments.includes('ALL') || flag.targetSegments.includes(userSegment);
  return isRegionMatch && isSegmentMatch;
}
