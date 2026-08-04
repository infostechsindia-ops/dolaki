'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiZap, 
  FiShoppingBag, 
  FiTruck, 
  FiGift, 
  FiAward, 
  FiArrowRight, 
  FiPercent, 
  FiClock, 
  FiStar, 
  FiTv, 
  FiUsers, 
  FiCheckCircle 
} from 'react-icons/fi';
import { products as localProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { getCMSConfig, getVisibleSections, CMSConfig } from '@/data/cmsConfig';
import SpinWheel from '@/components/SpinWheel';
import MarketingSectionRenderer from '@/components/MarketingSectionRenderer';
import { promoPagesRegistry, PromoPageConfig } from '@/data/promoLayouts';
import styles from './page.module.css';

export default function Home() {
  const [cmsConfig, setCmsConfig] = useState<CMSConfig | null>(null);
  const [marketingConfig, setMarketingConfig] = useState<PromoPageConfig | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 59, seconds: 59 });
  const [liveWatchers, setLiveWatchers] = useState(2847);
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  // Trigger spin wheel automatic popup on mount if not spun today
  useEffect(() => {
    const lastSpin = localStorage.getItem('auramart_last_spin');
    const todayStr = new Date().toDateString();
    if (lastSpin !== todayStr) {
      const timer = setTimeout(() => {
        setShowSpinWheel(true);
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Load CMS configuration (Try backend port 5000 -> localStorage -> hardcoded default)
  const loadCMS = async () => {
    // 1. Load products from API
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((bp: any) => ({
          ...bp,
          name: bp.title || '',
          price: bp.discountPrice ?? bp.basePrice,
          originalPrice: bp.basePrice,
          image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
          rating: bp.rating ?? 4.5,
          reviewsCount: bp.reviewCount ?? 12,
        }));
        setProducts(mapped);
      } else {
        setProducts(localProducts);
      }
    } catch (e) {
      console.log('Backend API down. Using local fallback products.');
      setProducts(localProducts);
    }

    // 2. Load CMS config
    try {
      const res = await fetch('http://localhost:5000/api/sdui/homepage');
      if (res.ok) {
        const data = await res.json();
        setCmsConfig(data);
        return;
      }
    } catch (e) {
      console.log('Backend SDUI server down. Using local client fallback.');
    }
    // Client fallback
    setCmsConfig(getCMSConfig());
  };

  useEffect(() => {
    loadCMS();

    // Load dynamic homepage marketing promo config
    try {
      const stored = localStorage.getItem('auramart_custom_promos');
      let customConfig = null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed['homepage-marketing']) {
          customConfig = parsed['homepage-marketing'];
        }
      }
      setMarketingConfig(customConfig || promoPagesRegistry['homepage-marketing']);
    } catch (e) {
      setMarketingConfig(promoPagesRegistry['homepage-marketing']);
    }

    // Listen for custom cms-updated events (e.g. from same-page test triggers)
    const handleCMSUpdate = () => {
      loadCMS();
    };
    window.addEventListener('cms-updated', handleCMSUpdate);
    return () => window.removeEventListener('cms-updated', handleCMSUpdate);
  }, []);

  // Auto-play interval for hero carousel
  useEffect(() => {
    if (!cmsConfig) return;
    const heroSection = cmsConfig.sections.find(s => s.type === 'hero_banners' && s.visible);
    if (!heroSection) return;

    const intervalVal = heroSection.config.autoPlayInterval || 4000;
    const bannersCount = heroSection.config.banners?.length || 0;
    if (bannersCount === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannersCount);
    }, intervalVal);

    return () => clearInterval(timer);
  }, [cmsConfig]);

  // Flash Sale & AuraLive global timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 59, seconds: 59 };
      });
      
      // Simulate real-time incrementing watchers count for live deal
      setLiveWatchers(prev => prev + (Math.random() > 0.6 ? Math.floor(Math.random() * 5) - 2 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!cmsConfig) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Initializing AuraMart Experience...</p>
      </div>
    );
  }

  // Get active sorted layout blocks
  const activeSections = getVisibleSections(cmsConfig);

  return (
    <div className={styles.homeContainer}>
      {activeSections.map((section) => {
        switch (section.type) {
          
          // 1. TOP ANNOUNCEMENT BAR
          case 'top_announcement': {
            const { text, link, backgroundColor, textColor } = section.config;
            return (
              <div 
                key={section.id} 
                className={styles.topAnnouncement}
                style={{ backgroundColor: backgroundColor || '#7C3AED', color: textColor || '#FFFFFF' }}
              >
                {link ? (
                  <Link href={link}>{text}</Link>
                ) : (
                  <span>{text}</span>
                )}
              </div>
            );
          }

          // 2. HERO SLIDESHOW CAROUSEL
          case 'hero_banners': {
            const { banners } = section.config;
            if (!banners || banners.length === 0) return null;
            return (
              <section key={section.id} className={styles.heroSection}>
                <div className="container">
                  <div className={styles.carouselWrapper}>
                    {banners.map((slide: any, index: number) => (
                      <div
                        key={slide.id || index}
                        className={`${styles.slide} ${index === currentSlide ? styles.slideActive : ''}`}
                        style={{ backgroundColor: slide.backgroundColor || '#4C1D95' }}
                      >
                        <div className={styles.slideContent}>
                          <span className={styles.slideBadge}>Special Promo</span>
                          <h1 className={styles.slideTitle}>{slide.title}</h1>
                          <p className={slide.subtitle ? styles.slideSubtitle : styles.slideSubtitleEmpty}>{slide.subtitle}</p>
                          <div className={styles.btnRow}>
                            <Link href={slide.ctaUrl || '/search'} className={styles.slideCta}>
                              {slide.ctaText || 'Shop Now'} <FiArrowRight className={styles.arrowIcon} />
                            </Link>
                          </div>
                        </div>
                        <div className={styles.slideImageWrapper}>
                          <img src={slide.imageUrl} alt={slide.title} className={styles.slideImage} />
                          <div className={styles.imageOverlayShadow}></div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.indicators}>
                      {banners.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 2.5 CAMPAIGNS SPOTLIGHT
          case 'campaign_spotlight': {
            return (
              <section key={section.id} style={{ padding: '40px 0', backgroundColor: '#F8FAFC' }}>
                <div className="container">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <Link 
                      href="/promo/monsoon-clearance" 
                      style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        position: 'relative', 
                        height: '200px',
                        backgroundImage: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.25) 100%), url(https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'white',
                        padding: '28px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <div>
                        <span style={{ backgroundColor: '#2563EB', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'white' }}>Active Campaign</span>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginTop: '12px', color: 'white', letterSpacing: '-0.02em', margin: '8px 0 2px' }}>☔ Monsoon Clearance Blast</h3>
                        <p style={{ fontSize: '0.88rem', opacity: 0.9, margin: 0 }}>Up to 60% off on outdoor gear & gadgets</p>
                      </div>
                    </Link>
                    <Link 
                      href="/promo/diwali-festivals" 
                      style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        position: 'relative', 
                        height: '200px',
                        backgroundImage: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.25) 100%), url(https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?w=600)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'white',
                        padding: '28px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <div>
                        <span style={{ backgroundColor: '#EA580C', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'white' }}>Festive Bazaar</span>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginTop: '12px', color: 'white', letterSpacing: '-0.02em', margin: '8px 0 2px' }}>🏮 Shubh Diwali Bazaar</h3>
                        <p style={{ fontSize: '0.88rem', opacity: 0.9, margin: 0 }}>Traditional ethnic wear & home decors</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </section>
            );
          }

          // 3. FLADO QUICK COMMERCE GATEWAY
          case 'flado_banner': {
            const { title, subtitle, ctaText, ctaUrl, backgroundColor, imageUrl, badgeText } = section.config;
            return (
              <section key={section.id} className={styles.fladoTeaserSection}>
                <div className="container">
                  <div className={styles.fladoTeaserCard} style={{ background: `linear-gradient(135deg, ${backgroundColor} 0%, #064E3B 100%)` }}>
                    <div className={styles.fladoTeaserText}>
                      <span className={styles.teaserTag}>
                        <FiZap /> {badgeText || 'INSTANT'}
                      </span>
                      <h2>{title}</h2>
                      <p>{subtitle}</p>
                      <div className={styles.teaserPromises}>
                        <div className={styles.promise}>
                          <span className={styles.promiseCheck}>✓</span>
                          <span>Delivered under 10 Minutes</span>
                        </div>
                        <div className={styles.promise}>
                          <span className={styles.promiseCheck}>✓</span>
                          <span>Darkstore freshness assurance</span>
                        </div>
                      </div>
                      <Link href={ctaUrl || '/flado'} className={styles.fladoTeaserCta}>
                        {ctaText || 'Order Now'} <FiArrowRight />
                      </Link>
                    </div>
                    <div className={styles.fladoTeaserImage}>
                      <img src={imageUrl} alt="Flado Delivery" className={styles.teaserImg} />
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 4. SHOP BY CATEGORY PILLS GRID
          case 'category_grid': {
            const { categories } = section.config;
            return (
              <section key={section.id} className={styles.categoriesSection}>
                <div className="container">
                  <SectionHeader 
                    label="Explore Mall"
                    title={section.title || "Shop by Category"} 
                    subtitle="Directly sourced products from brand owners at unmatched prices."
                  />
                  <div className={styles.categoriesGrid}>
                    {categories?.map((cat: any, idx: number) => (
                      <Link
                        key={idx}
                        href={cat.slug === 'groceries' ? '/flado' : `/categories/${cat.slug}`}
                        className={styles.categoryCard}
                      >
                        <div className={styles.categoryIconCircle} style={{ background: cat.color || '#F1F5F9' }}>
                          <span className={styles.catEmoji}>{cat.icon}</span>
                        </div>
                        <div className={styles.categoryMeta}>
                          <h3>{cat.name}</h3>
                          <span>View Offers</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 5. FLASH COUNTDOWN SALE WIDGET
          case 'flash_sale': {
            const { title, subtitle, deals } = section.config;
            if (!deals || deals.length === 0) return null;
            // Get product objects matching deal product IDs
            const saleProducts = deals.map((d: any) => products.find(p => p.id === d.productId)).filter(Boolean);
            return (
              <section key={section.id} className={styles.flashSaleSection}>
                <div className="container">
                  <div className={styles.flashSaleHeader}>
                    <div className={styles.flashSaleTitleBox}>
                      <FiZap className={styles.flashIcon} />
                      <h2>{title}</h2>
                      <div className={styles.timerBox}>
                        <FiClock className={styles.clockIcon} />
                        <span>Ends in:</span>
                        <div className={styles.timeUnit}>{String(timeLeft.hours).padStart(2, '0')}h</div>
                        <span className={styles.timerColon}>:</span>
                        <div className={styles.timeUnit}>{String(timeLeft.minutes).padStart(2, '0')}m</div>
                        <span className={styles.timerColon}>:</span>
                        <div className={styles.timeUnit}>{String(timeLeft.seconds).padStart(2, '0')}s</div>
                      </div>
                    </div>
                    <Link href="/search" className={styles.viewAllBtn}>
                      View All Deals <FiArrowRight />
                    </Link>
                  </div>
                  <div className={styles.productsGrid}>
                    {saleProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 6. AURALIVE SIMULATED INTERACTIVE COMMERCE
          case 'live_deal': {
            const { productId, productName, productImage, originalPrice, livePrice, hostName } = section.config;
            const discount = Math.round(((originalPrice - livePrice) / originalPrice) * 100);
            return (
              <section key={section.id} className={styles.liveCommerceSection}>
                <div className="container">
                  <div className={styles.liveTeaserCard}>
                    <div className={styles.liveVideoSimulation}>
                      <img src={productImage} alt={productName} className={styles.liveFeedImg} />
                      <div className={styles.livePulsingBadge}>
                        <span className={styles.redDot}></span> LIVE SHOPPING
                      </div>
                      <div className={styles.watchersOverlay}>
                        <FiUsers /> <span>{liveWatchers.toLocaleString()} watching</span>
                      </div>
                      <div className={styles.hostLabel}>Host: {hostName}</div>
                    </div>

                    <div className={styles.liveDetailsBox}>
                      <span className={styles.liveDealTag}>LIMITED LIVE OFFER</span>
                      <h2 className={styles.liveTitle}>Live Stream Special Drop!</h2>
                      <p className={styles.liveDesc}>
                        Grab the <strong>{productName}</strong> live at this special price before stream ends.
                      </p>
                      
                      <div className={styles.pricingStrip}>
                        <div className={styles.livePriceTag}>₹{livePrice.toLocaleString('en-IN')}</div>
                        <div className={styles.liveOriginalPrice}>₹{originalPrice.toLocaleString('en-IN')}</div>
                        <div className={styles.liveDiscountBadge}>{discount}% OFF</div>
                      </div>

                      <div className={styles.liveTimerRow}>
                        <FiClock /> <span>Offers closes in: <strong>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong></span>
                      </div>

                      <Link href={`/products/${productId}`} className={styles.claimLiveBtn}>
                        Claim Offer & Checkout <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 7. HORIZONTAL PRODUCT STRIP (Bestsellers or New Arrivals)
          case 'product_strip': {
            const { title, subtitle, productIds, ctaText, ctaUrl } = section.config;
            const stripProducts = productIds.map((id: string) => products.find(p => p.id === id)).filter(Boolean);
            if (stripProducts.length === 0) return null;
            return (
              <section key={section.id} className={styles.productsSection}>
                <div className="container">
                  <SectionHeader
                    label="Curated List"
                    title={title}
                    subtitle={subtitle}
                    viewAllLink={ctaUrl}
                  />
                  <div className={styles.productsGrid}>
                    {stripProducts.slice(0, 4).map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 8. BRAND SPOTLIGHT
          case 'brand_spotlight': {
            const { title, subtitle, brands } = section.config;
            return (
              <section key={section.id} className={styles.brandsSection}>
                <div className="container">
                  <SectionHeader
                    label="Official Partnerships"
                    title={title}
                    subtitle={subtitle}
                  />
                  <div className={styles.brandsGrid}>
                    {brands?.map((brand: any, idx: number) => (
                      <Link href={`/search?q=${brand.slug}`} key={idx} className={styles.brandCard}>
                        <div className={styles.brandBannerWrapper}>
                          <img src={brand.bannerUrl} alt={brand.name} className={styles.brandBanner} />
                          <div className={styles.brandLogoBox} style={{ borderColor: brand.badgeColor }}>
                            <img src={brand.logoUrl} alt={brand.name} className={styles.brandLogo} />
                          </div>
                        </div>
                        <div className={styles.brandInfo}>
                          <h4 style={{ color: brand.badgeColor }}>{brand.name}</h4>
                          <p>{brand.tagline}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 9. SPONSOR BRAND STRIP
          case 'sponsor_strip': {
            const { title, brands } = section.config;
            return (
              <section key={section.id} className={styles.sponsorSection}>
                <div className="container">
                  <div className={styles.sponsorHeader}>
                    <h3>{title}</h3>
                  </div>
                  <div className={styles.sponsorGrid}>
                    {brands?.map((brand: any, idx: number) => (
                      <Link href={`/search?q=${brand.slug}`} key={idx} className={styles.sponsorCard}>
                        <img src={brand.logoUrl} alt={brand.name} className={styles.sponsorLogo} />
                        <span className={styles.sponsorDiscount}>{brand.discountText}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 10. NEW LAUNCHES
          case 'new_launches': {
            const { title, subtitle, productIds } = section.config;
            const launchProducts = productIds.map((id: string) => products.find(p => p.id === id)).filter(Boolean);
            return (
              <section key={section.id} className={styles.productsSection}>
                <div className="container">
                  <SectionHeader
                    label="Latest Arrivals"
                    title={title}
                    subtitle={subtitle}
                    viewAllLink="/new-launches"
                  />
                  <div className={styles.productsGrid}>
                    {launchProducts.slice(0, 4).map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 11. TRENDING NOW
          case 'trending_now': {
            const { title, subtitle, productIds } = section.config;
            const trendProducts = productIds.map((id: string) => products.find(p => p.id === id)).filter(Boolean);
            return (
              <section key={section.id} className={styles.productsSection}>
                <div className="container">
                  <SectionHeader
                    label="Vibe Check"
                    title={title}
                    subtitle={subtitle}
                  />
                  <div className={styles.productsGrid}>
                    {trendProducts.slice(0, 4).map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 12. CURATED COLLECTIONS
          case 'collection_cards': {
            const { title, collections } = section.config;
            return (
              <section key={section.id} className={styles.collectionsSection}>
                <div className="container">
                  <SectionHeader
                    label="Editorial"
                    title={title}
                    subtitle="Curated lookbooks designed by style editors"
                  />
                  <div className={styles.collectionsGrid}>
                    {collections?.map((col: any, idx: number) => (
                      <Link href={col.slug === 'groceries' ? '/flado' : `/categories/${col.slug}`} key={idx} className={styles.collectionCard}>
                        <div className={styles.collectionImgWrapper}>
                          <img src={col.imageUrl} alt={col.title} className={styles.collectionImg} />
                          {col.tag && <span className={styles.collectionTag}>{col.tag}</span>}
                        </div>
                        <div className={styles.collectionMeta}>
                          <h3>{col.title}</h3>
                          <p>{col.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 13. STYLE LOOKBOOK STUDIO
          case 'look_book': {
            const { title, subtitle, items } = section.config;
            return (
              <section key={section.id} className={styles.lookbookSection}>
                <div className="container">
                  <SectionHeader
                    label="Studio"
                    title={title}
                    subtitle={subtitle}
                  />
                  <div className={styles.lookbookGrid}>
                    {items?.map((item: any, idx: number) => (
                      <div key={idx} className={styles.lookbookCard}>
                        <div className={styles.lookbookImgWrapper}>
                          <img src={item.imageUrl} alt={item.title} className={styles.lookbookImg} />
                        </div>
                        <div className={styles.lookbookMeta}>
                          <h4>{item.title}</h4>
                          <div className={styles.lookbookTags}>
                            {item.tags?.map((tag: string, tIdx: number) => (
                              <span key={tIdx} className={styles.lookbookTag}>#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 14. PROMO STRIP
          case 'promo_strip': {
            const { imageUrl, title, ctaUrl, backgroundColor, textColor } = section.config;
            return (
              <section key={section.id} className={styles.promoStripSection} style={{ backgroundColor: backgroundColor || '#F59E0B' }}>
                <div className="container">
                  <Link href={ctaUrl || '/profile'} className={styles.promoStripLink} style={{ color: textColor || '#1E293B' }}>
                    <div className={styles.promoStripContent}>
                      <span className={styles.promoSparkle}>✨</span>
                      <p>{title}</p>
                      <span className={styles.promoSparkle}>✨</span>
                    </div>
                  </Link>
                </div>
              </section>
            );
          }

          default: return null;
        }
      })}

      {/* Dynamic Campaign Marketing Sections */}
      {marketingConfig && marketingConfig.sections && (
        <div className="container" style={{ margin: '40px auto 10px' }}>
          {marketingConfig.sections.map((section) => (
            <MarketingSectionRenderer key={section.id} section={section} />
          ))}
        </div>
      )}

      {/* Trust Perks Strip (Always active to build confidence) */}
      <section className={styles.perksSection}>
        <div className="container">
          <div className={styles.perksGrid}>
            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <FiAward className={styles.perkIcon} />
              </div>
              <h3>100% Brand Guarantee</h3>
              <p>Direct sourcing from brand headquarters or officially licensed regional distributors.</p>
            </div>
            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <FiTruck className={styles.perkIcon} />
              </div>
              <h3>Secure Express Shipping</h3>
              <p>Insured global shipping with comprehensive live-route packaging updates.</p>
            </div>
            <div className={styles.perkCard}>
              <div className={styles.perkIconWrapper}>
                <FiGift className={styles.perkIcon} />
              </div>
              <h3>AuraPay Cashback Wallet</h3>
              <p>Instant cashback rewards on every purchase, redeemable on both storefronts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Spin Wheel trigger button */}
      <button 
        onClick={() => setShowSpinWheel(true)} 
        className={styles.floatingSpinBtn}
        aria-label="Daily rewards spin wheel"
      >
        🎡 <span className={styles.floatingSpinText}>Spin & Win</span>
      </button>

      {showSpinWheel && <SpinWheel onClose={() => setShowSpinWheel(false)} />}
    </div>
  );
}
