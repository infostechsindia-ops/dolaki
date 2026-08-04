'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTrash2, FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { products as allProducts, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('auramart_wishlist');
        if (stored) {
          const parsedIds = JSON.parse(stored) as string[];
          const filtered = allProducts.filter(p => parsedIds.includes(p.id));
          setWishlist(filtered);
        } else {
          // Default fallbacks so the page isn't totally blank on first load
          const defaults = allProducts.slice(10, 14);
          setWishlist(defaults);
          localStorage.setItem('auramart_wishlist', JSON.stringify(defaults.map(d => d.id)));
        }
      } catch (e) {
        console.error('Failed to parse wishlist from local storage.');
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = (id: string) => {
    const updated = wishlist.filter(p => p.id !== id);
    setWishlist(updated);
    try {
      localStorage.setItem('auramart_wishlist', JSON.stringify(updated.map(u => u.id)));
      // Dispatch custom event to notify other headers/components
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {}
  };

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    handleRemove(product.id);
  };

  return (
    <div className={styles.wishlistPage}>
      <div className="container">
        <div className={styles.headingArea}>
          <h1>My Wishlist</h1>
          <p>You have {wishlist.length} item(s) saved in your private wishlist bag.</p>
        </div>

        {wishlist.length > 0 ? (
          <div className={styles.grid}>
            {wishlist.map((item) => {
              const discount = item.originalPrice && item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;

              return (
                <div key={item.id} className={styles.card}>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className={styles.removeBtn}
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <div className={styles.imageWrapper}>
                    <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} />
                  </div>

                  <div className={styles.info}>
                    <span className={styles.brandName}>{item.brand || 'AuraMart'}</span>
                    <h3 className={styles.prodName}>{item.name}</h3>
                    
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{item.price.toLocaleString('en-IN')}</span>
                      {discount > 0 && item.originalPrice && (
                        <>
                          <span className={styles.originalPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                          <span className={styles.discount}>{discount}% OFF</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.addBtn} onClick={() => handleMoveToCart(item)}>
                      <FiShoppingBag /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiHeart size={64} className={styles.emptyIcon} />
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you like to buy them later. Explore the latest electronics, styles, and home decor!</p>
            <Link href="/" className={styles.shopBtn}>
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
