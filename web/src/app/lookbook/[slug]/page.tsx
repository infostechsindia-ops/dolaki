'use client';

import React, { use, useState, useRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiChevronRight, FiCamera, FiEye } from 'react-icons/fi';
import styles from './page.module.css';
import { API_BASE_URL } from '@/lib/config';
import { products as allProducts, Product } from '@/data/products';

interface Hotspot { top: string; left: string; productId: string; label?: string; }
interface LookbookSlide { imageUrl: string; title: string; hotspots: Hotspot[]; }
interface StyleTip { emoji: string; title: string; desc: string; }

interface LookbookConfig {
  title: string;
  tagline: string;
  description: string;
  season: string;
  accentColor: string;
  slides: LookbookSlide[];
  styleTips: StyleTip[];
  relatedSlugs: string[];
}

const LOOKBOOKS: Record<string, LookbookConfig> = {
  'summer-streetwear': {
    title: 'Premium Summer Streetwear',
    tagline: '☀️ The Street Edit · Summer 2026',
    description: 'Where athletic utility meets casual luxury. Hover the (+) pins to explore and shop exact items from this editorial spread.',
    season: 'Summer 2026',
    accentColor: '#f59e0b',
    slides: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop',
        title: 'Urban Athletic',
        hotspots: [
          { top: '22%', left: '52%', productId: 'fas-1', label: 'Classic Tee' },
          { top: '72%', left: '40%', productId: 'fas-4', label: 'Ultraboost' },
        ],
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027614df?w=900&h=1200&fit=crop',
        title: 'Minimal Layers',
        hotspots: [
          { top: '35%', left: '55%', productId: 'fas-2', label: 'Windbreaker' },
        ],
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop',
        title: 'Statement Pieces',
        hotspots: [
          { top: '45%', left: '48%', productId: 'fas-3', label: 'Cargo Pants' },
        ],
      },
    ],
    styleTips: [
      { emoji: '👟', title: 'Chunky Soles', desc: 'Platform soles add height and visual weight — pair with slim-fit joggers for balance.' },
      { emoji: '🧢', title: 'Logo Cap', desc: 'A structured dad cap in a tonal colorway pulls a monochrome look together effortlessly.' },
      { emoji: '💍', title: 'Stack & Layer', desc: 'Layer two or three chains of varying thickness for a high-end street aesthetic.' },
    ],
    relatedSlugs: ['festive-elegance', 'athleisure-pro'],
  },
  'festive-elegance': {
    title: 'Elegant Festive Wear',
    tagline: '🪔 The Festival Edit · Festive 2026',
    description: 'Celebrate tradition in style. Explore handcrafted ensembles, gleaming gold jewellery, and décor essentials from this festive editorial.',
    season: 'Festive 2026',
    accentColor: '#d97706',
    slides: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&h=1200&fit=crop',
        title: 'Silk Sherwani',
        hotspots: [
          { top: '38%', left: '50%', productId: 'fas-5', label: 'Embroidered Sherwani' },
        ],
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&h=1200&fit=crop',
        title: 'Gold Jewellery',
        hotspots: [
          { top: '30%', left: '50%', productId: 'jew-1', label: 'Gold Necklace' },
          { top: '18%', left: '47%', productId: 'jew-2', label: 'Diamond Earrings' },
        ],
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&h=1200&fit=crop',
        title: 'Home Décor',
        hotspots: [
          { top: '50%', left: '45%', productId: 'hom-3', label: 'Brass Diya Set' },
        ],
      },
    ],
    styleTips: [
      { emoji: '🪷', title: 'Dupatta Drama', desc: 'Drape a contrast dupatta diagonally across the shoulder for a regal, editorial silhouette.' },
      { emoji: '💎', title: 'Jewel Tone Match', desc: 'Match emerald-set earrings with a bottle-green anarkali for a cohesive festive palette.' },
      { emoji: '🌸', title: 'Fresh Florals', desc: 'A gajra hair accessory or fresh mogra strings elevate any traditional look instantly.' },
    ],
    relatedSlugs: ['summer-streetwear'],
  },
  'athleisure-pro': {
    title: 'Athleisure Pro Collection',
    tagline: '⚡ Performance Meets Street · Active 2026',
    description: 'Seamlessly transition from gym to café. Premium performance activewear curated for all-day comfort without sacrificing style.',
    season: 'Active 2026',
    accentColor: '#16a34a',
    slides: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=1200&fit=crop',
        title: 'Performance Fit',
        hotspots: [
          { top: '30%', left: '50%', productId: 'spt-1', label: 'Compression Set' },
          { top: '75%', left: '48%', productId: 'spt-2', label: 'Trail Runners' },
        ],
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=1200&fit=crop',
        title: 'Studio Ready',
        hotspots: [
          { top: '40%', left: '52%', productId: 'spt-3', label: 'Yoga Set' },
        ],
      },
    ],
    styleTips: [
      { emoji: '💧', title: 'Hydration First', desc: 'Carry a stainless steel insulated bottle — it\'s both functional and a style statement on its own.' },
      { emoji: '📊', title: 'Track It All', desc: 'Pair your outfit with a smart fitness band for the complete athletic lifestyle look.' },
      { emoji: '🎽', title: 'Tonal Dressing', desc: 'Monochrome activewear in deep navy or forest green looks instantly premium and put-together.' },
    ],
    relatedSlugs: ['summer-streetwear'],
  },
};

interface LookbookPageProps { params: Promise<{ slug: string }>; }

export default function LookbookPage({ params }: LookbookPageProps) {
  const { slug } = use(params);
  const lookbook = LOOKBOOKS[slug];
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [productsMap, setProductsMap] = useState<Map<string, any>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  if (!lookbook) notFound();

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=50`);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          const map = new Map<string, any>();
          list.forEach((p: any) => {
            map.set(p.id, {
              id: p.id,
              name: p.title || p.name || 'Product',
              brand: p.brand?.name || 'AuraBrand',
              price: p.discountPrice ?? p.basePrice ?? 0,
              originalPrice: p.basePrice ?? 0,
              image: p.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
              rating: p.rating ?? 4.5,
              reviewsCount: p.reviewCount ?? 12,
            });
          });
          setProductsMap(map);
        }
      } catch (e) {
        console.error('Failed to load lookbook products:', e);
      }
    };
    loadProducts();
  }, [slug]);

  const currentSlide = lookbook.slides[activeSlide];

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.page}>

      {/* ── Header ──────────────────────────────────── */}
      <div className={styles.pageHeader} style={{ '--accent': lookbook.accentColor } as React.CSSProperties}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.taglineRow}>
              <FiCamera className={styles.taglineIcon} />
              <span className={styles.tagline}>{lookbook.tagline}</span>
            </div>
            <h1 className={styles.title}>{lookbook.title}</h1>
            <p className={styles.description}>{lookbook.description}</p>
            <div className={styles.headerMeta}>
              <span className={styles.metaBadge}><FiEye /> {lookbook.slides.length} Slides</span>
              <span className={styles.metaBadge}>
                {lookbook.slides.reduce((acc, s) => acc + s.hotspots.length, 0)} Shoppable Items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Lookbook Viewer ─────────────────────── */}
      <div className={styles.container}>
        <div className={styles.lookbookLayout}>

          {/* Slide Rail (left) */}
          <div className={styles.slideRail}>
            {lookbook.slides.map((slide, i) => (
              <button
                key={i}
                className={`${styles.railThumb} ${activeSlide === i ? styles.railThumbActive : ''}`}
                onClick={() => { setActiveSlide(i); setActiveHotspot(null); }}
                style={activeSlide === i ? { borderColor: lookbook.accentColor } as React.CSSProperties : {}}
              >
                <img src={slide.imageUrl} alt={slide.title} className={styles.railThumbImg} />
                <span className={styles.railThumbNum}>{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Main Image with Hotspots */}
          <div className={styles.mainImageWrap} ref={containerRef}>
            <img
              key={currentSlide.imageUrl}
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className={styles.mainImage}
            />

            {/* Slide title overlay */}
            <div className={styles.slideTitle}>
              <span>{currentSlide.title}</span>
              <span className={styles.slidePill}>{activeSlide + 1} / {lookbook.slides.length}</span>
            </div>

            {/* Hotspot pins */}
            {currentSlide.hotspots.map((hs) => {
              const product = productsMap.get(hs.productId) || Array.from(productsMap.values())[0];
              const isOpen = activeHotspot === `${activeSlide}-${hs.productId}`;

              return (
                <div
                  key={hs.productId}
                  className={styles.hotspot}
                  style={{ top: hs.top, left: hs.left }}
                >
                  <button
                    className={`${styles.pin} ${isOpen ? styles.pinOpen : ''}`}
                    style={isOpen ? { background: lookbook.accentColor } as React.CSSProperties : {}}
                    onClick={() => setActiveHotspot(isOpen ? null : `${activeSlide}-${hs.productId}`)}
                    aria-label={`Shop: ${hs.label || (product?.name ?? '')}`}
                  >
                    <span className={styles.pinRipple} />
                    +
                  </button>

                  {hs.label && !isOpen && (
                    <span className={styles.pinLabel}>{hs.label}</span>
                  )}

                  {isOpen && product && (
                    <div className={styles.popover}>
                      <img src={product.image} alt={product.name} className={styles.popoverImg} />
                      <div className={styles.popoverInfo}>
                        <span className={styles.popoverBrand}>{product.brand}</span>
                        <h4 className={styles.popoverName}>{product.name}</h4>
                        <div className={styles.popoverPriceRow}>
                          <span className={styles.popoverPrice}>₹{product.price.toLocaleString('en-IN')}</span>
                          {product.originalPrice && (
                            <span className={styles.popoverOriginal}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <span className={styles.popoverStars}>
                          {'★'.repeat(Math.floor(product.rating))} <span>({product.reviewsCount})</span>
                        </span>
                        <div className={styles.popoverActions}>
                          <Link href={`/products/${product.id}`} className={styles.popoverShopBtn}>
                            <FiShoppingCart /> Shop Now
                          </Link>
                          <button
                            className={`${styles.popoverWishBtn} ${wishlist.has(product.id) ? styles.popoverWishActive : ''}`}
                            onClick={() => toggleWishlist(product.id)}
                          >
                            <FiHeart />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Slide arrows */}
            <button
              className={`${styles.slideArrow} ${styles.slideArrowPrev}`}
              onClick={() => { setActiveSlide(p => Math.max(0, p - 1)); setActiveHotspot(null); }}
              disabled={activeSlide === 0}
            >‹</button>
            <button
              className={`${styles.slideArrow} ${styles.slideArrowNext}`}
              onClick={() => { setActiveSlide(p => Math.min(lookbook.slides.length - 1, p + 1)); setActiveHotspot(null); }}
              disabled={activeSlide === lookbook.slides.length - 1}
            >›</button>
          </div>

          {/* Sidebar: Products in this slide */}
          <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Shop This Look</h3>
            <div className={styles.sidebarProducts}>
              {currentSlide.hotspots.map(hs => {
                const product = allProducts.find(p => p.id === hs.productId);
                if (!product) return null;
                return (
                  <div key={hs.productId} className={styles.sidebarProduct}>
                    <Link href={`/products/${product.id}`}>
                      <img src={product.image} alt={product.name} className={styles.sidebarProductImg} />
                    </Link>
                    <div className={styles.sidebarProductInfo}>
                      <span className={styles.sidebarProductBrand}>{product.brand}</span>
                      <Link href={`/products/${product.id}`} className={styles.sidebarProductName}>{product.name}</Link>
                      <span className={styles.sidebarProductPrice}>₹{product.price.toLocaleString('en-IN')}</span>
                      <Link href={`/products/${product.id}`} className={styles.sidebarShopBtn}>
                        View Product <FiChevronRight />
                      </Link>
                    </div>
                  </div>
                );
              })}
              {currentSlide.hotspots.length === 0 && (
                <p className={styles.sidebarEmpty}>No tagged items in this slide.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Style Tips ──────────────────────────────── */}
      <section className={styles.tipsSection}>
        <div className={styles.container}>
          <h2 className={styles.tipsTitle}>Style Guide</h2>
          <div className={styles.tipsGrid}>
            {lookbook.styleTips.map(tip => (
              <div key={tip.title} className={styles.tipCard}>
                <span className={styles.tipEmoji}>{tip.emoji}</span>
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── More Lookbooks ──────────────────────────── */}
      <section className={styles.moreSection}>
        <div className={styles.container}>
          <h2 className={styles.moreTitle}>More Lookbooks</h2>
          <div className={styles.moreGrid}>
            {Object.entries(LOOKBOOKS)
              .filter(([k]) => k !== slug)
              .slice(0, 3)
              .map(([k, lb]) => (
                <Link key={k} href={`/lookbook/${k}`} className={styles.moreCard}>
                  <img src={lb.slides[0]?.imageUrl} alt={lb.title} className={styles.moreCardImg} />
                  <div className={styles.moreCardOverlay}>
                    <span className={styles.moreCardTagline}>{lb.tagline}</span>
                    <strong>{lb.title}</strong>
                    <span className={styles.moreCardArrow}><FiChevronRight /></span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

    </div>
  );
}
