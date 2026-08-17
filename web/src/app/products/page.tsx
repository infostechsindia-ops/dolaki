'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiGrid, FiSliders, FiPackage } from 'react-icons/fi';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/data/products';
import { API_BASE_URL } from '@/lib/config';
import styles from './page.module.css';

const CATEGORIES = [
  { slug: 'all', label: 'All Products' },
  { slug: 'electronics', label: 'Electronics' },
  { slug: 'fashion', label: 'Fashion' },
  { slug: 'beauty', label: 'Beauty & Care' },
  { slug: 'home', label: 'Home & Kitchen' },
  { slug: 'groceries', label: 'Groceries' },
  { slug: 'sports', label: 'Sports & Fitness' }
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'ele-1',
    name: 'AuraBook Pro 16" M3 Max',
    title: 'AuraBook Pro 16" M3 Max',
    price: 249990,
    originalPrice: 269990,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 128,
    category: 'electronics',
    brand: 'Apple',
  },
  {
    id: 'ele-2',
    name: 'AuraPhone 15 Pro 256GB Titanium',
    title: 'AuraPhone 15 Pro 256GB Titanium',
    price: 134900,
    originalPrice: 144900,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 342,
    category: 'electronics',
    brand: 'Apple',
  },
  {
    id: 'fas-1',
    name: 'Premium Leather Biker Jacket',
    title: 'Premium Leather Biker Jacket',
    price: 8999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 89,
    category: 'fashion',
    brand: 'Nike',
  },
  {
    id: 'bea-1',
    name: 'Advanced Botanical Facial Serum',
    title: 'Advanced Botanical Facial Serum',
    price: 2499,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 215,
    category: 'beauty',
    brand: "L'Oreal",
  },
  {
    id: 'hom-1',
    name: 'Ergonomic Birch Wood Armchair',
    title: 'Ergonomic Birch Wood Armchair',
    price: 14999,
    originalPrice: 18999,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 64,
    category: 'home',
    brand: 'IKEA',
  },
  {
    id: 'gro-1',
    name: 'Organic Hass Avocado Pack (4 Pcs)',
    title: 'Organic Hass Avocado Pack (4 Pcs)',
    price: 349,
    originalPrice: 420,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 512,
    category: 'groceries',
    brand: 'FreshFarm',
  }
];

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const url = `${API_BASE_URL}/api/v1/products?limit=50${activeCategory !== 'all' ? `&category=${activeCategory}` : ''}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;
      console.log('[AllProductsPage] Fetching products:', url);

      try {
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || json || [];
          if (Array.isArray(list) && list.length > 0) {
            const mapped = list.map((bp: any) => ({
              ...bp,
              name: bp.title || bp.name || '',
              price: bp.discountPrice ?? bp.basePrice ?? bp.price ?? 0,
              originalPrice: bp.basePrice ?? bp.originalPrice ?? bp.price ?? 0,
              image: bp.imageUrl || bp.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
              rating: bp.rating ?? 4.5,
              reviewsCount: bp.reviewCount ?? 12,
              category: bp.category || 'electronics'
            }));
            setProducts(mapped);
          }
        }
      } catch (e) {
        console.warn('[AllProductsPage] API fetch failed, using fallback products:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery]);

  // Client-side filtering & sorting
  const filteredProducts = products.filter((p) => {
    const matchCat = activeCategory === 'all' || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    const matchSearch = !searchQuery || (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className={styles.productsPage}>
      {/* Header Banner */}
      <div className={styles.heroHeader}>
        <div className="container">
          <h1 className={styles.heroTitle}>Explore Master Catalog</h1>
          <p className={styles.heroSubtitle}>
            Browse official brand stores, flagship electronics, daily gourmet essentials, and seasonal collections.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filter Controls Bar */}
        <div className={styles.filterBar}>
          <div className={styles.filterTabs}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`${styles.tabBtn} ${activeCategory === cat.slug ? styles.activeTab : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={styles.sortWrapper}>
            <FiSliders style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.sortSelect}
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiPackage style={{ fontSize: '48px', color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h2 className={styles.emptyTitle}>No Products Found</h2>
            <p className={styles.emptyText}>
              We couldn't find any products matching your current category or search criteria.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); }}
              className={styles.tabBtn}
              style={{ backgroundColor: 'var(--primary)', color: '#FFFFFF' }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
