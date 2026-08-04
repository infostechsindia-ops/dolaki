'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiHeart, FiZap, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { CategoryBlock, CategoryThemeConfig } from '@/data/categoryThemes';
import { products as allProducts, Product } from '@/data/products';
import ProductCard from './ProductCard';
import styles from './CategoryRenderer.module.css';

interface FilterProps {
  maxPrice: number;
  selectedBrands: string[];
  minRating: number;
  onlyOffers: boolean;
  sortBy: string;
}

// Function to apply filters to a list of products
const applyFilters = (products: Product[], filters?: FilterProps) => {
  if (!filters) return products;

  let result = [...products];

  // Price Filter
  result = result.filter(p => p.price <= filters.maxPrice);

  // Brand Filter
  if (filters.selectedBrands.length > 0) {
    result = result.filter(p => {
      const brandName = (p.brand || '').toLowerCase().trim();
      return filters.selectedBrands.some(b => b.toLowerCase().trim() === brandName);
    });
  }

  // Rating Filter
  if (filters.minRating > 0) {
    result = result.filter(p => p.rating >= filters.minRating);
  }

  // Offers Filter
  if (filters.onlyOffers) {
    result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
  }

  // Sort
  if (filters.sortBy === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  return result;
};

// --- Hero Carousel Block ---
export const HeroCarousel = ({ block }: { block: CategoryBlock }) => {
  const banners = (block.data as any).banners || [block.data];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    if (block.layout?.autoPlay === false) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length, block.layout?.autoPlay]);

  return (
    <div className={styles.heroWrapper}>
      {banners.map((banner: any, index: number) => (
        <div
          key={index}
          className={`${styles.heroSlide} ${index === currentIndex ? styles.slideActive : ''}`}
          style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%), url(${banner.imageUrl})` }}
        >
          <div className={styles.heroContent}>
            {block.sponsorship?.isSponsored && (
              <span className={styles.sponsoredBadge}>
                Sponsored by {block.sponsorship.sponsorName}
              </span>
            )}
            <h2 className={styles.heroTitle}>{banner.title}</h2>
            <p className={styles.heroSubtitle}>{banner.subtitle}</p>
            <Link href={banner.ctaLink || '#'} className={styles.heroCta}>
              {banner.ctaText || 'Shop Now'}
            </Link>
          </div>
        </div>
      ))}
      
      {banners.length > 1 && (
        <div className={styles.heroIndicators}>
          {banners.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`${styles.indicator} ${index === currentIndex ? styles.indicatorActive : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Brand Carousel Block ---
export const BrandCarousel = ({ block }: { block: CategoryBlock }) => (
  <div className={styles.brandContainer}>
    <h3 className={styles.blockTitle}>{block.data.title}</h3>
    <div className={`${styles.brandRow} scrollbar-hide`}>
      {(block.data as any).brands?.map((brand: any, i: number) => (
        <div key={i} className={styles.brandCard}>
          <div className={styles.brandLogoCircle}>
            <img src={brand.logoUrl} alt={brand.name} className={styles.brandLogo} />
          </div>
          <span className={styles.brandName}>{brand.name}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- Promotional Flash Block ---
export const PromotionalFlash = ({ block }: { block: CategoryBlock }) => {
  const data = block.data as any;
  const [timeLeft, setTimeLeft] = useState('11:59:59');

  useEffect(() => {
    if (!data.timerEnd) return;
    const interval = setInterval(() => {
      const difference = +new Date(data.timerEnd) - +new Date();
      if (difference <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
        return;
      }
      
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [data.timerEnd]);

  return (
    <div className={styles.promoFlash} style={{ backgroundColor: data.bgColor || '#EF4444' }}>
      <div className={styles.promoContent}>
        <div className={styles.promoText}>
          <div className={styles.promoHeader}>
            <FiZap className={styles.zapIcon} />
            <h3>{data.title}</h3>
          </div>
          <p>{data.subtitle}</p>
        </div>
        <div className={styles.promoActions}>
          {data.timerEnd && (
            <div className={styles.countdown}>
              <span className={styles.timeUnit}>{timeLeft}</span>
            </div>
          )}
          <Link href={data.ctaLink || '#'} className={styles.promoBtn}>
            {data.ctaText || 'Grab Offer'}
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Product Listing Grid Block ---
export const ProductListingGrid = ({ block, filters }: { block: CategoryBlock; filters?: FilterProps }) => {
  const data = block.data as any;
  // Get actual products based on listed IDs
  const rawProducts = allProducts.filter((p) => data.productIds?.includes(p.id));
  const blockProducts = applyFilters(rawProducts, filters);

  return (
    <div className={styles.productsBlock}>
      <h3 className={styles.blockTitle}>{data.title}</h3>
      {blockProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {blockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.noResultsBox}>
          <p>No products match the selected filters in this section.</p>
        </div>
      )}
    </div>
  );
};

// --- Product Carousel Block ---
export const ProductListingCarousel = ({ block, filters }: { block: CategoryBlock; filters?: FilterProps }) => {
  const data = block.data as any;
  const rawProducts = allProducts.filter((p) => data.productIds?.includes(p.id));
  const blockProducts = applyFilters(rawProducts, filters);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.productsBlock}>
      <div className={styles.blockTitleRow}>
        <h3 className={styles.blockTitle}>{data.title}</h3>
        {blockProducts.length > 0 && (
          <div className={styles.carouselBtns}>
            <button onClick={() => scroll('left')} className={styles.carouselBtn} aria-label="Scroll left"><FiChevronLeft /></button>
            <button onClick={() => scroll('right')} className={styles.carouselBtn} aria-label="Scroll right"><FiChevronRight /></button>
          </div>
        )}
      </div>
      {blockProducts.length > 0 ? (
        <div ref={scrollRef} className={`${styles.productsCarousel} scrollbar-hide`}>
          {blockProducts.map((product) => (
            <div key={product.id} className={styles.carouselItemWrapper}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResultsBox}>
          <p>No products match the selected filters in this section.</p>
        </div>
      )}
    </div>
  );
};

// --- Content Masonry Block ---
export const MasonryGrid = ({ block }: { block: CategoryBlock }) => {
  const data = block.data as any;
  return (
    <div className={styles.masonryBlock}>
      <h3 className={styles.blockTitle}>{data.title}</h3>
      <div className={styles.masonryGrid}>
        {data.items?.map((item: any, i: number) => (
          <div key={item.id || i} className={styles.masonryItem}>
            <img src={item.imageUrl} alt="Look inspiration" className={styles.masonryImage} />
            <div className={styles.masonryOverlay}>
              <Link href={item.link || '#'} className={styles.masonryBtn}>
                Shop This Look
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Layout Renderer Hub ---
export const CategoryLayoutRenderer = ({ block, filters }: { block: CategoryBlock; filters?: FilterProps }) => {
  if (block.layout?.type) {
    switch (block.layout.type) {
      case 'masonry':
        return <MasonryGrid block={block} />;
      case 'grid':
        return <ProductListingGrid block={block} filters={filters} />;
      case 'carousel':
        return block.type === 'BRAND_CAROUSEL'
          ? <BrandCarousel block={block} />
          : <ProductListingCarousel block={block} filters={filters} />;
    }
  }

  // Fallback on block type
  switch (block.type) {
    case 'HERO_BANNER':
      return <HeroCarousel block={block} />;
    case 'BRAND_CAROUSEL':
      return <BrandCarousel block={block} />;
    case 'PROMOTIONAL_BANNER':
      return <PromotionalFlash block={block} />;
    case 'PRODUCT_LISTING':
      return <ProductListingGrid block={block} filters={filters} />;
    case 'CONTENT_MASONRY':
      return <MasonryGrid block={block} />;
    default:
      return null;
  }
};

interface CategoryRendererProps {
  config: CategoryThemeConfig;
  filters?: FilterProps;
}

export default function CategoryRenderer({ config, filters }: CategoryRendererProps) {
  // Sort blocks based on block order config
  const sortedBlocks = [...config.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.container} style={{ backgroundColor: config.theme.backgroundColor }}>
      {sortedBlocks.map((block) => (
        <section key={block.id} className={styles.sectionBlock}>
          <CategoryLayoutRenderer block={block} filters={filters} />
        </section>
      ))}
    </div>
  );
}
