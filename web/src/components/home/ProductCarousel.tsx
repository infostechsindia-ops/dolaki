'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import styles from './ProductCarousel.module.css';

export interface ProductCarouselProps {
  products: any[];
  title: string;
  subtitle?: string;
  badgeText?: string;
  viewAllUrl?: string;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductCarousel({
  products,
  title,
  subtitle,
  badgeText,
  viewAllUrl,
  surface = 'MARKETPLACE',
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.carouselSection} aria-label={title}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          {badgeText && <span className={styles.badge}>{badgeText}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
        </div>

        <div className={styles.controls}>
          {viewAllUrl && (
            <Link href={viewAllUrl} className={styles.viewAllLink}>
              View All <FiArrowRight />
            </Link>
          )}
          <button onClick={scrollLeft} className={styles.navBtn} aria-label="Previous Products">
            <FiChevronLeft size={20} />
          </button>
          <button onClick={scrollRight} className={styles.navBtn} aria-label="Next Products">
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.carouselTrack} ref={trackRef}>
        {products.map((product) => (
          <div key={product.id} className={styles.itemWrapper}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
