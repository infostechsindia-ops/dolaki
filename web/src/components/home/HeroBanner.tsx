'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './HeroBanner.module.css';

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl: string;
  backgroundColor?: string;
}

export interface HeroBannerProps {
  banners: BannerItem[];
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function HeroBanner({ banners, surface = 'MARKETPLACE' }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];
  const isFlado = surface === 'QUICK_COMMERCE';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className={`${styles.heroSection} ${isFlado ? styles.quickCommerce : ''}`} aria-label="Featured Promotions">
      <div className={styles.carouselContainer} style={{ backgroundColor: currentBanner.backgroundColor || '#4C1D95' }}>
        
        {/* Banner Content Column */}
        <div className={styles.bannerContent}>
          <span className={styles.promoBadge}>Limited Promo</span>
          <h1 className={styles.title}>{currentBanner.title}</h1>
          <p className={styles.subtitle}>{currentBanner.subtitle}</p>
          <div className={styles.ctaWrapper}>
            <Link href={currentBanner.ctaUrl || '/search'} className={styles.ctaBtn}>
              <span>{currentBanner.ctaText || 'Shop Now'}</span>
              <FiArrowRight className={styles.ctaIcon} />
            </Link>
          </div>
        </div>

        {/* Banner Image Column */}
        <div className={styles.imageWrapper}>
          <img src={currentBanner.imageUrl} alt={currentBanner.title} className={styles.bannerImage} />
        </div>

        {/* Carousel controls - visible only if multiple items exist */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className={`${styles.navBtn} ${styles.prevBtn}`}
              aria-label="Previous Slide"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={handleNext}
              className={`${styles.navBtn} ${styles.nextBtn}`}
              aria-label="Next Slide"
            >
              <FiChevronRight />
            </button>
            <div className={styles.dots}>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
