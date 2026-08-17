'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiChevronRight, FiHeart, FiShare2, FiGrid, FiList, FiFilter, FiTag } from 'react-icons/fi';
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
  subCategory?: string;
  brand?: string;
}

// ─── Collection Data ──────────────────────────────────────────────────────────
interface CollectionTag { label: string; color: string; }
interface FeaturedItem { imageUrl: string; caption: string; linkUrl: string; }
interface StyleNote { title: string; desc: string; icon: string; }

interface CollectionConfig {
  title: string;
  subtitle: string;
  description: string;
  bannerUrl: string;
  bannerUrlAlt?: string;
  accentColor: string;
  tags: CollectionTag[];
  featured: FeaturedItem[];
  styleNotes: StyleNote[];
  filter: (p: Product) => boolean;
  curatorNote: string;
  editorialImageUrl: string;
}

const COLLECTIONS_REGISTRY: Record<string, CollectionConfig> = {
  'monsoon-essentials': {
    title: 'The Monsoon Essentials Kit',
    subtitle: '☔ Curated for the Rains',
    description: 'Prepare for the rains with waterproof jackets, dry-fit athletic wear, and outdoor gear selected for maximum durability and comfort. Every item is humidity-tested and field-reviewed by our style editors.',
    bannerUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1400&h=500&fit=crop',
    accentColor: '#2563EB',
    tags: [
      { label: 'Waterproof', color: '#1d4ed8' },
      { label: 'All-Weather', color: '#0891b2' },
      { label: 'Outdoor', color: '#059669' },
    ],
    featured: [
      { imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=520&fit=crop', caption: 'Structured Rain Jackets', linkUrl: '/categories/fashion' },
      { imageUrl: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=520&fit=crop', caption: 'Trail Running Essentials', linkUrl: '/categories/sports' },
      { imageUrl: 'https://images.unsplash.com/photo-1538171049-c98e94e44a2b?w=400&h=520&fit=crop', caption: 'Waterproof Carry-Ons', linkUrl: '/categories/fashion' },
    ],
    styleNotes: [
      { title: 'Layer Up', desc: 'Pair a moisture-wicking base with a windproof outer shell for full monsoon coverage.', icon: '🧥' },
      { title: 'Sole Matters', desc: 'Look for deep-lug rubber outsoles with drainage channels in footwear.', icon: '👟' },
      { title: 'Stay Dry', desc: 'Packable nylon bags keep electronics and documents safe during downpours.', icon: '🎒' },
    ],
    filter: (p) => p.category === 'fashion' || p.category === 'sports',
    curatorNote: 'Curated by AuraMart Style Team — last updated July 2026',
    editorialImageUrl: 'https://images.unsplash.com/photo-1467978783085-f9b3fa29cf5c?w=700&h=500&fit=crop',
  },
  'work-from-home': {
    title: 'Smart Work-From-Home Setup',
    subtitle: '💻 Productivity Redefined',
    description: 'Elevate your home office with ergonomic support chairs, active noise-cancelling headphones, high-res monitors, and fast chargers. Every piece hand-picked to reduce fatigue and boost deep-work focus.',
    bannerUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&h=500&fit=crop',
    accentColor: '#7c3aed',
    tags: [
      { label: 'Ergonomic', color: '#7c3aed' },
      { label: 'High-Performance', color: '#2563eb' },
      { label: 'Premium Tech', color: '#0891b2' },
    ],
    featured: [
      { imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=520&fit=crop', caption: 'Ultra-Wide Monitors', linkUrl: '/categories/electronics' },
      { imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=520&fit=crop', caption: 'Pro Noise-Cancelling', linkUrl: '/categories/electronics' },
      { imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=520&fit=crop', caption: 'Sit-Stand Desk Systems', linkUrl: '/categories/home' },
    ],
    styleNotes: [
      { title: 'Posture First', desc: 'An ergonomic lumbar chair reduces fatigue by up to 40% during long coding sessions.', icon: '🪑' },
      { title: 'Light Setup', desc: 'Position your monitor at arm\'s length, slightly below eye level to prevent neck strain.', icon: '💡' },
      { title: 'Declutter', desc: 'A cable management tray and a Qi wireless charging pad keep your desk visually clean.', icon: '✨' },
    ],
    filter: (p) => p.category === 'electronics' || (p.category === 'home' && p.subCategory === 'Furniture'),
    curatorNote: 'Curated by AuraMart Tech Editors — last updated June 2026',
    editorialImageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=700&h=500&fit=crop',
  },
  'festive-vibes': {
    title: 'Sparkling Festive Bazaar',
    subtitle: '🪔 The Festival Edit',
    description: 'Step out in premium silk sherwanis, embroidered kurtas, sparkling gold jewellery lines, and decorative ambient lights. Our festive curators have assembled the finest traditional pieces for every celebration.',
    bannerUrl: 'https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?w=1400&h=500&fit=crop',
    accentColor: '#EA580C',
    tags: [
      { label: 'Traditional', color: '#b45309' },
      { label: 'Handcrafted', color: '#c2410c' },
      { label: 'Festive Special', color: '#9f1239' },
    ],
    featured: [
      { imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=520&fit=crop', caption: 'Silk Sherwanis', linkUrl: '/categories/fashion' },
      { imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=520&fit=crop', caption: 'Gold Jewellery', linkUrl: '/categories/jewellery' },
      { imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=520&fit=crop', caption: 'Home Décor Lights', linkUrl: '/categories/home' },
    ],
    styleNotes: [
      { title: 'Layer with Dupatta', desc: 'Drape a contrast dupatta over a solid anarkali for a regal, layered festive look.', icon: '🪷' },
      { title: 'Tone Match Jewels', desc: 'Warm gold tones pair naturally with earthy kurtas and deep maroon embroidery.', icon: '💎' },
      { title: 'Fragrance Ritual', desc: 'Complete the festive look with an oudh-based attar or classic rose perfume.', icon: '🌹' },
    ],
    filter: (p) => p.category === 'fashion' && (p.subCategory === 'Ethnic Wear' || p.subCategory === 'Formal Wear'),
    curatorNote: 'Curated by AuraMart Fashion Studio — Festive Edition 2026',
    editorialImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&h=500&fit=crop',
  },
  'summer-sport': {
    title: 'Summer Sport Performance',
    subtitle: '⚡ Train Harder, Look Better',
    description: 'Premium activewear, training footwear, hydration gear, and smart fitness tech from the world\'s top sports brands — curated for athletes, gym-goers, and outdoor enthusiasts.',
    bannerUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&h=500&fit=crop',
    accentColor: '#16a34a',
    tags: [
      { label: 'Performance', color: '#15803d' },
      { label: 'Breathable', color: '#0891b2' },
      { label: 'Sport-Tech', color: '#7c3aed' },
    ],
    featured: [
      { imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=520&fit=crop', caption: 'Performance Tees', linkUrl: '/categories/sports' },
      { imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=520&fit=crop', caption: 'Running Shoes', linkUrl: '/categories/sports' },
      { imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=520&fit=crop', caption: 'Fitness Wearables', linkUrl: '/categories/electronics' },
    ],
    styleNotes: [
      { title: 'Compression Counts', desc: 'Compression shorts reduce muscle fatigue and speed up recovery post-workout.', icon: '💪' },
      { title: 'Hydration Tech', desc: 'Insulated stainless bottles maintain drink temperature for up to 24 hours.', icon: '💧' },
      { title: 'Monitor Everything', desc: 'A fitness band with VO2 max and HRV metrics takes training to a new level.', icon: '📊' },
    ],
    filter: (p) => p.category === 'sports',
    curatorNote: 'Curated by AuraMart Sports Advisory — Summer 2026',
    editorialImageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&h=500&fit=crop',
  },
};

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);
  const collection = COLLECTIONS_REGISTRY[slug];
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [saved, setSaved] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  if (!collection) notFound();

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
        console.error('Failed to load collection products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [slug, sortBy]);

  return (
    <div className={styles.page}>

      {/* ── Hero Banner ─────────────────────────────── */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${collection.bannerUrl})`, '--accent': collection.accentColor } as React.CSSProperties}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroTagRow}>
            {collection.tags.map(tag => (
              <span key={tag.label} className={styles.heroTag} style={{ background: tag.color }}>
                <FiTag size={10} /> {tag.label}
              </span>
            ))}
          </div>
          <p className={styles.heroSubtitle}>{collection.subtitle}</p>
          <h1 className={styles.heroTitle}>{collection.title}</h1>
          <p className={styles.heroDesc}>{collection.description}</p>
          <div className={styles.heroActions}>
            <button
              className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
              onClick={() => setSaved(s => !s)}
            >
              <FiHeart /> {saved ? 'Saved' : 'Save Collection'}
            </button>
            <button className={styles.shareBtn} onClick={() => navigator.clipboard?.writeText(window.location.href)}>
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Editorial ───────────────────────── */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>
            <span style={{ color: collection.accentColor }}>|</span> Curated Picks
          </h2>
          <div className={styles.featuredGrid}>
            {collection.featured.map((item, i) => (
              <Link key={i} href={item.linkUrl} className={styles.featuredCard}>
                <img src={item.imageUrl} alt={item.caption} className={styles.featuredImg} />
                <div className={styles.featuredOverlay}>
                  <span>{item.caption}</span>
                  <FiChevronRight />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Style Notes ──────────────────────────────── */}
      <section className={styles.styleSection}>
        <div className={styles.container}>
          <div className={styles.styleSectionInner}>
            <div className={styles.styleContent}>
              <h2 className={styles.styleHeading}>Style Notes</h2>
              <p className={styles.styleCuratorNote}>{collection.curatorNote}</p>
              <div className={styles.styleNotesGrid}>
                {collection.styleNotes.map(note => (
                  <div key={note.title} className={styles.styleNote}>
                    <span className={styles.styleNoteEmoji}>{note.icon}</span>
                    <div>
                      <h4>{note.title}</h4>
                      <p>{note.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.styleImageWrap}>
              <img src={collection.editorialImageUrl} alt="Editorial" className={styles.styleImage} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ─────────────────────────────── */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.productsSectionHead}>
            <h2 className={styles.sectionHeading}>
              <span style={{ color: collection.accentColor }}>|</span> Shop the Collection
              <span className={styles.productCount}>{products.length} items</span>
            </h2>
            <div className={styles.toolbarRight}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="default">Sort: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <button
                className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
                onClick={() => setShowFilters(s => !s)}
              >
                <FiFilter /> Filters
              </button>
              <div className={styles.viewToggle}>
                <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
                <button className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <div className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listGrid : ''}`}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No products found in this collection right now. Check back soon.</p>
              <Link href="/categories/fashion" className={styles.emptyLink}>Browse All Products</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── More Collections ─────────────────────────── */}
      <section className={styles.moreSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>More Collections</h2>
          <div className={styles.moreGrid}>
            {Object.entries(COLLECTIONS_REGISTRY)
              .filter(([k]) => k !== slug)
              .slice(0, 3)
              .map(([k, c]) => (
                <Link key={k} href={`/collections/${k}`} className={styles.moreCard}>
                  <div className={styles.moreCardOverlay} style={{ background: `linear-gradient(135deg, ${c.accentColor}33, ${c.accentColor}11)` }} />
                  <span className={styles.moreSubtitle}>{c.subtitle}</span>
                  <strong className={styles.moreTitle}>{c.title}</strong>
                  <span className={styles.moreArrow}><FiChevronRight /></span>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}
