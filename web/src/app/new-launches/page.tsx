'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiAward, FiBell, FiTrendingUp, FiClock, FiStar, FiZap, FiChevronRight, FiPackage } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { API_BASE_URL } from '@/lib/config';

// ─── Types ───────────────────────────────────────────────────────────────────
interface UpcomingDrop {
  id: string;
  brand: string;
  name: string;
  category: string;
  launchDateText: string;
  launchTimestamp: number;
  imageUrl: string;
  teaser: string;
  badge: string;
  priceFrom: string;
}

// ─── Upcoming Drops Data ──────────────────────────────────────────────────────
const UPCOMING_DROPS: UpcomingDrop[] = [
  {
    id: 'drop-1',
    brand: 'Apple',
    name: 'MacBook Pro M4 Max',
    category: 'Electronics',
    launchDateText: 'Launching July 15, 2026',
    launchTimestamp: new Date('2026-07-15T00:00:00').getTime(),
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
    teaser: 'The most powerful MacBook ever — M4 Max chip with 16-core CPU and 40-core GPU.',
    badge: '🔥 Most Awaited',
    priceFrom: '₹2,49,900',
  },
  {
    id: 'drop-2',
    brand: 'OnePlus',
    name: 'OnePlus 15 Ultra',
    category: 'Mobile',
    launchDateText: 'Launching July 20, 2026',
    launchTimestamp: new Date('2026-07-20T00:00:00').getTime(),
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
    teaser: '200MP Hasselblad flagship camera system meets Snapdragon 8 Gen 4 silicon.',
    badge: '📸 Camera Beast',
    priceFrom: '₹79,999',
  },
  {
    id: 'drop-3',
    brand: 'Nike',
    name: 'Air Jordan 40 "Eclipse"',
    category: 'Footwear',
    launchDateText: 'Launching August 1, 2026',
    launchTimestamp: new Date('2026-08-01T00:00:00').getTime(),
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    teaser: 'The next chapter in Jordan heritage — limited colorway with carbon-fiber midsole.',
    badge: '👟 Limited Edition',
    priceFrom: '₹24,999',
  },
  {
    id: 'drop-4',
    brand: 'Sony',
    name: 'WH-2000XM6 Pro',
    category: 'Audio',
    launchDateText: 'Launching August 10, 2026',
    launchTimestamp: new Date('2026-08-10T00:00:00').getTime(),
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    teaser: 'Next-gen ANC with dual-chip processor and 48-hour battery life.',
    badge: '🎧 Audio Pioneer',
    priceFrom: '₹34,990',
  },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Beauty', 'Mobile', 'Audio', 'Sports'];

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────
function useCountdown(target: number) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days: d, hours: h, mins: m, secs: s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

// ─── Countdown Display ────────────────────────────────────────────────────────
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.countUnit}>
      <span className={styles.countNum}>{String(value).padStart(2, '0')}</span>
      <span className={styles.countLabel}>{label}</span>
    </div>
  );
}

function DropCountdown({ timestamp }: { timestamp: number }) {
  const t = useCountdown(timestamp);
  return (
    <div className={styles.countdown}>
      <CountdownUnit value={t.days} label="Days" />
      <span className={styles.countSep}>:</span>
      <CountdownUnit value={t.hours} label="Hrs" />
      <span className={styles.countSep}>:</span>
      <CountdownUnit value={t.mins} label="Min" />
      <span className={styles.countSep}>:</span>
      <CountdownUnit value={t.secs} label="Sec" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NewLaunchesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());
  const [heroIdx, setHeroIdx] = useState(0);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-rotate hero
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(p => (p + 1) % UPCOMING_DROPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const loadNewLaunches = async () => {
      setLoading(true);
      try {
        const cat = activeCategory !== 'All' ? `&category=${activeCategory.toLowerCase()}` : '';
        const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=24&sort=newest${cat}`);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          setRecentProducts(list.map((p: any) => ({
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
        console.error('Failed to fetch new launches:', e);
      } finally {
        setLoading(false);
      }
    };
    loadNewLaunches();
  }, [activeCategory]);

  const filteredProducts = recentProducts;

  const featuredDrop = UPCOMING_DROPS[heroIdx];

  const toggleNotify = (id: string) => {
    setNotifiedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className={styles.heroBanner}>
        <div
          className={styles.heroBackground}
          style={{ backgroundImage: `url(${featuredDrop.imageUrl})` }}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroContainer}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroBadge}><FiZap /> Live Drop Zone</span>
            <span className={styles.dropBadge}>{featuredDrop.badge}</span>
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroMuted}>{featuredDrop.brand}</span>
            {featuredDrop.name}
          </h1>
          <p className={styles.heroTeaser}>{featuredDrop.teaser}</p>
          <p className={styles.heroPriceFrom}>Starting from <strong>{featuredDrop.priceFrom}</strong></p>

          <DropCountdown timestamp={featuredDrop.launchTimestamp} />

          <div className={styles.heroCtas}>
            <button
              className={`${styles.notifyBtn} ${notifiedIds.has(featuredDrop.id) ? styles.notifyBtnActive : ''}`}
              onClick={() => toggleNotify(featuredDrop.id)}
            >
              <FiBell />
              {notifiedIds.has(featuredDrop.id) ? 'Notified ✓' : 'Notify Me'}
            </button>
            <Link href="/deals" className={styles.viewAllBtn}>
              Explore Deals <FiChevronRight />
            </Link>
          </div>

          {/* Hero dots */}
          <div className={styles.heroDots}>
            {UPCOMING_DROPS.map((_, i) => (
              <button
                key={i}
                className={`${styles.heroDot} ${heroIdx === i ? styles.heroDotActive : ''}`}
                onClick={() => setHeroIdx(i)}
                aria-label={`View drop ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Drops Grid ───────────────────────── */}
      <section className={styles.upcomingSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div className={styles.sectionHeadLeft}>
              <FiClock className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Upcoming Drops</h2>
                <p className={styles.sectionSub}>Set reminders before they sell out</p>
              </div>
            </div>
          </div>

          <div className={styles.dropsGrid}>
            {UPCOMING_DROPS.map((drop) => (
              <div key={drop.id} className={styles.dropCard}>
                <div className={styles.dropImageWrap}>
                  <img src={drop.imageUrl} alt={drop.name} className={styles.dropImage} />
                  <span className={styles.dropBadgeOverlay}>{drop.badge}</span>
                  <span className={styles.dropCategory}>{drop.category}</span>
                </div>
                <div className={styles.dropInfo}>
                  <span className={styles.dropBrand}>{drop.brand}</span>
                  <h3 className={styles.dropName}>{drop.name}</h3>
                  <p className={styles.dropTeaser}>{drop.teaser}</p>
                  <div className={styles.dropMeta}>
                    <span className={styles.dropDate}><FiClock /> {drop.launchDateText}</span>
                    <span className={styles.dropPrice}>{drop.priceFrom}</span>
                  </div>
                  <DropCountdown timestamp={drop.launchTimestamp} />
                  <button
                    className={`${styles.dropNotifyBtn} ${notifiedIds.has(drop.id) ? styles.dropNotifyActive : ''}`}
                    onClick={() => toggleNotify(drop.id)}
                  >
                    <FiBell />
                    {notifiedIds.has(drop.id) ? '✓ You\'ll be notified' : 'Notify When Live'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Launched ─────────────────────────── */}
      <section className={styles.recentSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeadRow}>
            <div className={styles.sectionHeadLeft}>
              <FiTrendingUp className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Recently Launched</h2>
                <p className={styles.sectionSub}>Hot off the shelf — shop before they run out</p>
              </div>
            </div>
            <Link href="/deals" className={styles.viewAllLink}>
              View All <FiChevronRight />
            </Link>
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {filteredProducts.slice(0, 16).map(product => (
                <div key={product.id} className={styles.productCardWrap}>
                  <div className={styles.newBadgeOverlay}>
                    <FiAward /> NEW
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiPackage size={48} />
              <h3>Fresh Drops Loading...</h3>
              <p>Products in this category are coming soon. Turn on notifications to be first in line.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Shop New Launches ─────────────────────── */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <h2 className={styles.whyTitle}>Why Buy at Launch?</h2>
          <div className={styles.whyGrid}>
            {[
              { icon: '🎁', title: 'Launch Day Offers', desc: 'Exclusive bank discounts and cashback deals only available in the first 48 hours.' },
              { icon: '⚡', title: 'Priority Delivery', desc: 'Launch orders ship first from our warehouses — delivered before general stock.' },
              { icon: '🏆', title: 'First Owner Perks', desc: 'Early adopter badge, extended warranty options, and priority after-sales support.' },
              { icon: '🔔', title: 'Smart Notifications', desc: 'Set reminders and we\'ll ping you the moment a drop goes live across all channels.' },
            ].map(item => (
              <div key={item.title} className={styles.whyCard}>
                <span className={styles.whyEmoji}>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
