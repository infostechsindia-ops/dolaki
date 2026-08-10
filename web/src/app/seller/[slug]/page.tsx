'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  FiStar, FiPackage, FiShield, FiClock, FiMessageSquare,
  FiThumbsUp, FiChevronRight, FiAward, FiTruck, FiPhone, FiGrid, FiList
} from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { API_BASE_URL } from '@/lib/config';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  category?: string;
  brand?: string;
}

// ─── Seller Data ──────────────────────────────────────────────────────────────
interface SellerReview {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  productName: string;
  verified: boolean;
}

interface SellerPolicy {
  icon: string;
  title: string;
  desc: string;
}

interface SellerConfig {
  name: string;
  legalName: string;
  tagline: string;
  avatarUrl: string;
  bannerUrl: string;
  accentColor: string;
  rating: number;
  ratingBreakdown: [number, number, number, number, number]; // 5-star to 1-star %
  ordersFulfilled: string;
  reviewCount: number;
  memberSince: string;
  responseTime: string;
  dispatchTime: string;
  gstin: string;
  location: string;
  specialization: string[];
  policies: SellerPolicy[];
  achievements: string[];
  reviews: SellerReview[];
  filter: (p: Product) => boolean;
}

const SELLERS_REGISTRY: Record<string, SellerConfig> = {
  'auraretail': {
    name: 'AuraRetail Direct',
    legalName: 'AuraRetail India Pvt. Ltd.',
    tagline: 'India\'s Most Trusted Electronics & Home Retail Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400&h=350&fit=crop',
    accentColor: '#6366f1',
    rating: 4.8,
    ratingBreakdown: [78, 15, 5, 1, 1],
    ordersFulfilled: '52,400+',
    reviewCount: 4820,
    memberSince: 'January 2024',
    responseTime: 'Under 2 hours',
    dispatchTime: 'Same day (before 3 PM)',
    gstin: '29AAFCA1234A1Z5',
    location: 'Bengaluru, Karnataka',
    specialization: ['Consumer Electronics', 'Home Appliances', 'Smart Devices', 'Accessories'],
    policies: [
      { icon: '🔄', title: '10-Day Easy Returns', desc: 'Full refund or exchange within 10 days of delivery — no questions asked.' },
      { icon: '🛡️', title: 'Seller Warranty', desc: 'Additional 6-month seller warranty on all electronics above ₹5,000.' },
      { icon: '📦', title: 'Insured Packaging', desc: 'All fragile items shipped with air-cushion packaging and declared value insurance.' },
      { icon: '✅', title: 'Quality Checked', desc: 'Every unit undergoes QC inspection before dispatch at our fulfillment center.' },
    ],
    achievements: ['🏆 Top Seller 2025', '⚡ Same-Day Champion', '💎 AuraMart Assured', '🌟 4.8+ Rating Holder'],
    reviews: [
      { user: 'Rahul M.', avatar: 'R', rating: 5, comment: 'Packaging was impeccable. MacBook arrived in pristine condition with original seal intact. Very professional seller.', date: 'June 2026', productName: 'Apple MacBook Pro', verified: true },
      { user: 'Priya S.', avatar: 'P', rating: 5, comment: 'Dispatched within hours of ordering. Excellent communication throughout. Would definitely buy again.', date: 'May 2026', productName: 'Samsung 65" QLED TV', verified: true },
      { user: 'Arun K.', avatar: 'A', rating: 4, comment: 'Good product and fast delivery. Slight delay in response but resolved within same day.', date: 'April 2026', productName: 'Sony WH-1000XM5', verified: false },
    ],
    filter: (p) => p.category === 'electronics' || p.category === 'home',
  },
  'fashionhouse': {
    name: 'FashionHouse International',
    legalName: 'FashionHouse International LLP',
    tagline: 'Curated Global Fashion — From Runway to Your Wardrobe',
    avatarUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=350&fit=crop',
    accentColor: '#ec4899',
    rating: 4.6,
    ratingBreakdown: [70, 18, 8, 3, 1],
    ordersFulfilled: '32,100+',
    reviewCount: 2910,
    memberSince: 'March 2025',
    responseTime: 'Under 4 hours',
    dispatchTime: 'Within 24 hours',
    gstin: '27AABCF5678B1Z9',
    location: 'Mumbai, Maharashtra',
    specialization: ['Ethnic Wear', 'Western Fashion', 'Activewear', 'Luxury Accessories'],
    policies: [
      { icon: '🔄', title: '15-Day Return Window', desc: 'Extended return policy for all fashion items including free pickup from your doorstep.' },
      { icon: '🎨', title: 'Authentic Fabrics', desc: 'All fabrics sourced from certified mills with fabric quality certificates included.' },
      { icon: '📏', title: 'Free Size Exchange', desc: 'First size exchange is completely free — simply select your correct size at return initiation.' },
      { icon: '💎', title: 'Stylist Support', desc: 'Dedicated in-house fashion stylist available for personalized size and style recommendations.' },
    ],
    achievements: ['👗 Fashion Seller of the Year', '🌍 International Brand Partner', '💎 AuraMart Assured', '⭐ 4.6+ Rating Holder'],
    reviews: [
      { user: 'Meera J.', avatar: 'M', rating: 5, comment: 'The silk saree was absolutely stunning. Exactly as shown. Fast delivery and lovely packaging.', date: 'June 2026', productName: 'Kanjivaram Silk Saree', verified: true },
      { user: 'Sunita R.', avatar: 'S', rating: 5, comment: 'Ordered three kurtas and all three fit perfectly. The fabric quality is exceptional for the price.', date: 'May 2026', productName: 'Anarkali Kurta Set', verified: true },
      { user: 'Vikram B.', avatar: 'V', rating: 4, comment: 'Color was slightly different from the photograph under different lighting but overall very happy.', date: 'May 2026', productName: 'Linen Blazer', verified: false },
    ],
    filter: (p) => p.category === 'fashion',
  },
  'organichub': {
    name: 'OrganicHub Cosmetics',
    legalName: 'OrganicHub Beauty Sciences Pvt. Ltd.',
    tagline: 'Clean Beauty. Cruelty-Free. Certified Organic.',
    avatarUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=120&h=120&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1400&h=350&fit=crop',
    accentColor: '#16a34a',
    rating: 4.7,
    ratingBreakdown: [74, 16, 7, 2, 1],
    ordersFulfilled: '14,600+',
    reviewCount: 1780,
    memberSince: 'June 2025',
    responseTime: 'Under 3 hours',
    dispatchTime: 'Within 48 hours',
    gstin: '06AABCO9012C1Z3',
    location: 'Gurugram, Haryana',
    specialization: ['Organic Skincare', 'Ayurvedic Wellness', 'Cruelty-Free Makeup', 'Hair Care'],
    policies: [
      { icon: '🌿', title: 'Certified Organic', desc: 'ECOCERT and USDA certified organic ingredients across our entire product range.' },
      { icon: '🐰', title: 'Cruelty-Free', desc: 'Leaping Bunny certified — no animal testing at any stage of our supply chain.' },
      { icon: '🔄', title: '7-Day Unopened Returns', desc: 'Unopened products can be returned within 7 days for a full refund.' },
      { icon: '🌡️', title: 'Cold Chain Shipping', desc: 'Temperature-controlled packaging ensures active ingredients remain effective in transit.' },
    ],
    achievements: ['🌿 Clean Beauty Leader', '🐰 Cruelty-Free Certified', '💎 AuraMart Assured', '🌟 4.7+ Rating Holder'],
    reviews: [
      { user: 'Deepa L.', avatar: 'D', rating: 5, comment: 'The vitamin C serum is absolutely incredible. Saw visible results within two weeks. Packaging was eco-friendly too.', date: 'June 2026', productName: 'Vitamin C Brightening Serum', verified: true },
      { user: 'Kiran T.', avatar: 'K', rating: 5, comment: 'Finally found a truly organic brand that actually works. The products smell wonderful and feel luxurious.', date: 'May 2026', productName: 'Rose Hip Moisturizer', verified: true },
      { user: 'Ananya S.', avatar: 'A', rating: 4, comment: 'Excellent quality. Slightly pricier than alternatives but you get what you pay for in terms of ingredients.', date: 'April 2026', productName: 'Niacinamide Toner', verified: false },
    ],
    filter: (p) => p.category === 'beauty',
  },
};

interface SellerPageProps { params: Promise<{ slug: string }>; }

export default function SellerPage({ params }: SellerPageProps) {
  const { slug } = use(params);
  const seller = SELLERS_REGISTRY[slug];
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'policies'>('products');
  const [contactSent, setContactSent] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  if (!seller) notFound();

  React.useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=24&sort=${sortBy === 'rating' ? 'rating' : sortBy === 'price-asc' ? 'price_asc' : sortBy === 'price-desc' ? 'price_desc' : 'featured'}`);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          setProducts(list.map((p: any) => ({
            id: p.id,
            name: p.title || p.name || 'Product',
            price: p.discountPrice ?? p.basePrice ?? 0,
            originalPrice: p.basePrice ?? 0,
            image: p.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            rating: p.rating ?? 4.5,
            reviewsCount: p.reviewCount ?? 12,
            category: p.category,
            brand: p.brand?.name || ''
          })));
        }
      } catch (e) {
        console.error('Failed to load seller products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [slug, sortBy]);

  const ratingPercent = seller.ratingBreakdown;

  return (
    <div className={styles.page}>

      {/* ── Banner ─────────────────────────────────── */}
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${seller.bannerUrl})`, '--accent': seller.accentColor } as React.CSSProperties}
      >
        <div className={styles.bannerOverlay} />
      </div>

      {/* ── Seller Header ──────────────────────────── */}
      <div className={styles.sellerHeader}>
        <div className={styles.container}>
          <div className={styles.sellerTopRow}>
            <div className={styles.sellerAvatarWrap}>
              <img src={seller.avatarUrl} alt={seller.name} className={styles.sellerAvatar} />
              <span className={styles.verifiedBadge}>✓</span>
            </div>
            <div className={styles.sellerInfo}>
              <div className={styles.sellerNameRow}>
                <h1 className={styles.sellerName}>{seller.name}</h1>
                <span className={styles.assuredBadge}><FiShield /> AuraMart Assured</span>
              </div>
              <p className={styles.sellerLegalName}>{seller.legalName}</p>
              <p className={styles.sellerTagline}>{seller.tagline}</p>
              <div className={styles.metaRow}>
                <span><FiStar className={styles.starIcon} />{seller.rating} / 5.0</span>
                <span><FiPackage />{seller.ordersFulfilled} Orders</span>
                <span><FiClock />Since {seller.memberSince}</span>
                <span>📍{seller.location}</span>
              </div>
            </div>
            <div className={styles.sellerActions}>
              <button
                className={styles.contactBtn}
                onClick={() => setContactSent(true)}
                style={{ background: seller.accentColor } as React.CSSProperties}
              >
                {contactSent ? '✓ Message Sent' : <><FiMessageSquare /> Message Seller</>}
              </button>
              <a href="tel:18002872345" className={styles.callBtn}>
                <FiPhone /> Call Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ──────────────────────────────── */}
      <div className={styles.statsBar}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              { icon: <FiStar />, value: `${seller.rating} / 5.0`, label: 'Seller Rating', accent: seller.accentColor },
              { icon: <FiPackage />, value: seller.ordersFulfilled, label: 'Orders Fulfilled', accent: seller.accentColor },
              { icon: <FiTruck />, value: seller.dispatchTime, label: 'Dispatch Time', accent: seller.accentColor },
              { icon: <FiMessageSquare />, value: seller.responseTime, label: 'Response Time', accent: seller.accentColor },
              { icon: <FiAward />, value: String(seller.reviewCount.toLocaleString('en-IN')), label: 'Customer Reviews', accent: seller.accentColor },
            ].map(stat => (
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statIcon} style={{ color: stat.accent }}>{stat.icon}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Achievements ───────────────────────────── */}
      <div className={styles.achievementsBar}>
        <div className={styles.container}>
          <div className={styles.achievementsList}>
            {seller.achievements.map(a => (
              <span key={a} className={styles.achievementTag}>{a}</span>
            ))}
            <span className={styles.achievementTag} style={{ background: '#f1f5f9', color: '#64748b' }}>
              🛍️ Specializes in: {seller.specialization.slice(0, 2).join(', ')} + more
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────── */}
      <div className={styles.tabsBar}>
        <div className={styles.container}>
          <div className={styles.tabs}>
            {(['products', 'reviews', 'policies'] as const).map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                style={activeTab === tab ? { borderBottomColor: seller.accentColor, color: seller.accentColor } as React.CSSProperties : {}}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'products' && <><FiGrid /> Products ({products.length})</>}
                {tab === 'reviews' && <><FiThumbsUp /> Reviews ({seller.reviewCount.toLocaleString('en-IN')})</>}
                {tab === 'policies' && <><FiShield /> Policies</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products Tab ───────────────────────────── */}
      {activeTab === 'products' && (
        <section className={styles.productsSection}>
          <div className={styles.container}>
            <div className={styles.productsToolbar}>
              <span className={styles.productCount}>{products.length} products by {seller.name}</span>
              <div className={styles.toolbarRight}>
                <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
                  <option value="default">Sort: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className={styles.viewToggle}>
                  <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('grid')} style={viewMode === 'grid' ? { background: seller.accentColor } as React.CSSProperties : {}}><FiGrid /></button>
                  <button className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('list')} style={viewMode === 'list' ? { background: seller.accentColor } as React.CSSProperties : {}}><FiList /></button>
                </div>
              </div>
            </div>
            <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listGrid : ''}`}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews Tab ────────────────────────────── */}
      {activeTab === 'reviews' && (
        <section className={styles.reviewsSection}>
          <div className={styles.container}>
            <div className={styles.reviewsLayout}>
              {/* Rating Breakdown */}
              <div className={styles.ratingBreakdown}>
                <div className={styles.bigRating} style={{ color: seller.accentColor }}>{seller.rating}</div>
                <div className={styles.bigStars}>{'★'.repeat(Math.floor(seller.rating))}{'☆'.repeat(5 - Math.floor(seller.rating))}</div>
                <p className={styles.ratingTotal}>{seller.reviewCount.toLocaleString('en-IN')} verified reviews</p>
                {ratingPercent.map((pct, i) => (
                  <div key={i} className={styles.ratingBar}>
                    <span className={styles.ratingBarStar}>{5 - i}★</span>
                    <div className={styles.ratingBarTrack}>
                      <div
                        className={styles.ratingBarFill}
                        style={{ width: `${pct}%`, background: seller.accentColor }}
                      />
                    </div>
                    <span className={styles.ratingBarPct}>{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Review Cards */}
              <div className={styles.reviewCards}>
                {seller.reviews.map((review, i) => (
                  <div key={i} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewAvatar}>{review.avatar}</div>
                      <div>
                        <div className={styles.reviewUser}>{review.user}</div>
                        <div className={styles.reviewMeta}>
                          <span className={styles.reviewStars} style={{ color: seller.accentColor }}>{'★'.repeat(review.rating)}</span>
                          {review.verified && <span className={styles.verifiedTag}><FiShield /> Verified Buyer</span>}
                        </div>
                      </div>
                      <span className={styles.reviewDate}>{review.date}</span>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                    <p className={styles.reviewProduct}>Purchased: <Link href="/products">{review.productName}</Link></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Policies Tab ───────────────────────────── */}
      {activeTab === 'policies' && (
        <section className={styles.policiesSection}>
          <div className={styles.container}>
            <div className={styles.policiesGrid}>
              {seller.policies.map(policy => (
                <div key={policy.title} className={styles.policyCard} style={{ '--accent': seller.accentColor } as React.CSSProperties}>
                  <span className={styles.policyIcon}>{policy.icon}</span>
                  <h3>{policy.title}</h3>
                  <p>{policy.desc}</p>
                </div>
              ))}
            </div>
            <div className={styles.gstinCard}>
              <FiShield className={styles.gstinIcon} />
              <div>
                <strong>GSTIN Verified Seller</strong>
                <span>{seller.gstin} — {seller.location}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Browse More Sellers ────────────────────── */}
      <section className={styles.moreSellers}>
        <div className={styles.container}>
          <h2 className={styles.moreTitle}>Browse Other Sellers</h2>
          <div className={styles.moreGrid}>
            {Object.entries(SELLERS_REGISTRY)
              .filter(([k]) => k !== slug)
              .map(([k, s]) => (
                <Link key={k} href={`/seller/${k}`} className={styles.moreCard} style={{ '--accent': s.accentColor } as React.CSSProperties}>
                  <img src={s.avatarUrl} alt={s.name} className={styles.moreCardAvatar} />
                  <div>
                    <strong className={styles.moreCardName}>{s.name}</strong>
                    <span className={styles.moreCardRating}><FiStar /> {s.rating}</span>
                    <span className={styles.moreCardOrders}>{s.ordersFulfilled} orders</span>
                  </div>
                  <FiChevronRight className={styles.moreCardArrow} />
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}
