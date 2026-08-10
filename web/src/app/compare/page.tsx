'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiX, FiShoppingBag, FiArrowRight, FiInfo } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
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

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComparedProducts = async () => {
      setLoading(true);
      try {
        const idsParam = searchParams.get('ids');
        const ids = idsParam ? idsParam.split(',').filter(Boolean) : [];

        const res = await fetch(`${API_BASE_URL}/api/v1/products?limit=20`);
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          const mapped = list.map((p: any) => ({
            id: p.id,
            name: p.title || p.name || 'Product',
            price: p.discountPrice ?? p.basePrice ?? 0,
            originalPrice: p.basePrice ?? 0,
            image: p.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            rating: p.rating ?? 4.5,
            reviewsCount: p.reviewCount ?? 12,
            category: p.category,
            brand: p.brand?.name || ''
          }));

          if (ids.length > 0) {
            const matched = mapped.filter((p: any) => ids.includes(p.id)).slice(0, 3);
            setComparedProducts(matched.length > 0 ? matched : mapped.slice(0, 3));
          } else {
            setComparedProducts(mapped.slice(0, 3));
          }
        }
      } catch (e) {
        console.error('Failed to load comparison products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadComparedProducts();
  }, [searchParams]);

  const handleRemove = (id: string) => {
    const updated = comparedProducts.filter(p => p.id !== id);
    setComparedProducts(updated);
    const newIds = updated.map(p => p.id).join(',');
    if (newIds) {
      router.replace(`/compare?ids=${newIds}`);
    } else {
      router.replace('/compare');
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    alert(`🛒 Added ${product.name} to cart!`);
  };

  // Helper calculations for winning specifications
  const getMinPrice = () => {
    if (comparedProducts.length === 0) return 0;
    return Math.min(...comparedProducts.map(p => p.price));
  };

  const getMaxRating = () => {
    if (comparedProducts.length === 0) return 0;
    return Math.max(...comparedProducts.map(p => p.rating));
  };

  const minPrice = getMinPrice();
  const maxRating = getMaxRating();

  return (
    <div className={styles.comparePage}>
      <div className="container">
        <div className={styles.headingArea}>
          <h1>Product Comparison</h1>
          <p>Compare tech specifications, customer reviews, and prices side-by-side.</p>
        </div>

        {comparedProducts.length > 0 ? (
          <div className={styles.compareGrid}>
            {/* Left Labels Column */}
            <div className={styles.columnLabel}>
              <h3>Product Specs</h3>
              <div className={styles.labelItem}>Price</div>
              <div className={styles.labelItem}>Rating</div>
              <div className={styles.labelItem}>Brand</div>
              <div className={styles.labelItem}>Category</div>
              <div className={styles.labelItem}>General Stock</div>
              <div className={styles.labelItem}>Warranty</div>
              <div className={styles.labelItem}>Bluetooth Version</div>
            </div>

            {/* Compared Product Columns */}
            {comparedProducts.map((prod) => {
              const isLowestPrice = prod.price === minPrice;
              const isHighestRating = prod.rating === maxRating;

              return (
                <div key={prod.id} className={styles.columnProduct}>
                  <button 
                    onClick={() => handleRemove(prod.id)} 
                    className={styles.removeBtn}
                    aria-label="Remove from comparison"
                  >
                    <FiX size={18} />
                  </button>

                  <div className={styles.productCard}>
                    <img src={prod.image || (prod.images && prod.images[0]) || ''} alt={prod.name} />
                    <h4>{prod.name}</h4>
                  </div>

                  {/* Price */}
                  <div className={`${styles.specItem} ${isLowestPrice ? styles.winningSpec : ''}`}>
                    ₹{prod.price.toLocaleString('en-IN')} {isLowestPrice && '🏆 best'}
                  </div>

                  {/* Rating */}
                  <div className={`${styles.specItem} ${isHighestRating ? styles.winningSpec : ''}`}>
                    {prod.rating} ★ {isHighestRating && '🏆 highest'}
                  </div>

                  {/* Brand */}
                  <div className={styles.specItem}>
                    {prod.brand || 'N/A'}
                  </div>

                  {/* Category */}
                  <div className={styles.specItem}>
                    {prod.category}
                  </div>

                  {/* Stock */}
                  <div className={styles.specItem}>
                    {prod.generalStock > 0 ? `${prod.generalStock} units` : 'Out of Stock'}
                  </div>

                  {/* Warranty */}
                  <div className={styles.specItem}>
                    {prod.specifications['Warranty'] || '1 Year Brand Warranty'}
                  </div>

                  {/* Bluetooth Version */}
                  <div className={styles.specItem}>
                    {prod.specifications['Bluetooth Version'] || 'N/A'}
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.cartBtn} onClick={() => handleAddToCart(prod)}>
                      <FiShoppingBag /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.compareEmpty}>
            <FiInfo size={64} className={styles.emptyIcon} />
            <h2>No Products Selected for Comparison</h2>
            <p>Select up to 3 products from our categories to compare specifications side-by-side.</p>
            <Link href="/" className={styles.shopBtn}>
              Browse Stores
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className={styles.comparePage} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading comparison specs...</p></div>}>
      <ComparePageContent />
    </Suspense>
  );
}
