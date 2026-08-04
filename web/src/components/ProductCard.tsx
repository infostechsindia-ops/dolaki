'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiStar, FiShoppingCart, FiPlus, FiMinus, FiZap, FiHeart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageSrc = product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600';

  // Check if item is in cart
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart > 0) {
      updateQuantity(product.id, quantityInCart + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantityInCart - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const price = product.price ?? (product as any).discountPrice ?? (product as any).basePrice ?? 0;
  const originalPrice = product.originalPrice ?? (product as any).basePrice;

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Mock social proof counter based on rating
  const mockSoldCount = Math.floor(product.rating * 140) + 12;

  return (
    <div className={`${styles.card} ${product.isFlado ? styles.fladoCard : ''}`}>
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistToggle}
        className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
        aria-label="Toggle Wishlist"
      >
        <FiHeart className={styles.heartIcon} />
      </button>

      <Link href={`/products/${product.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          {/* Badge */}
          {product.badge && (
            <span className={`${styles.badge} ${styles[product.badge.replace(/\s+/g, '').replace('-', '').replace('10', 'Ten')]}`}>
              {product.badge === '10-Min Delivery' && <FiZap className={styles.badgeZap} />}
              {product.badge}
            </span>
          )}
          
          <img
            src={imageSrc}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        </div>

        <div className={styles.info}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.category}>{product.category}</span>
            <span 
              className={styles.ecoBadge} 
              title={
                product.category === 'groceries' 
                  ? 'EcoScore A: Organic farm sources, 100% biodegradable bag'
                  : product.category === 'beauty'
                  ? 'EcoScore B: Cruelty-free certified, low chemical footprints'
                  : product.category === 'fashion'
                  ? 'EcoScore B: Sustainable organic cotton fabrics, fair-trade'
                  : 'EcoScore C: Recyclable logistics, offset carbon footprint shipping'
              }
            >
              🌱 {product.category === 'groceries' ? 'A' : product.category === 'electronics' ? 'C' : 'B'}
            </span>
          </div>
          <h3 className={styles.name}>{product.name}</h3>
          
          {/* Rating & Social Proof */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              <FiStar className={styles.starIcon} />
              <span className={styles.ratingVal}>{product.rating}</span>
            </div>
            <span className={styles.reviews}>({product.reviewsCount})</span>
            <span className={styles.divider}>•</span>
            <span className={styles.soldCount}>{mockSoldCount}+ sold</span>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            <div className={styles.prices}>
              <span className={styles.price}>₹{price.toLocaleString('en-IN')}</span>
              {originalPrice && originalPrice > price && (
                <>
                  <span className={styles.originalPrice}>₹{originalPrice.toLocaleString('en-IN')}</span>
                  <span className={styles.discount}>{discountPercent}% OFF</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add To Cart Controls */}
      <div className={styles.actionWrapper}>
        <AnimatePresence mode="wait">
          {quantityInCart > 0 ? (
            <motion.div 
              key="quantity-selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.quantityControls}
            >
              <button 
                onClick={handleDecrement} 
                className={styles.qtyBtn} 
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span className={styles.qtyText}>{quantityInCart}</span>
              <button 
                onClick={handleIncrement} 
                className={styles.qtyBtn} 
                aria-label="Increase quantity"
              >
                <FiPlus />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="add-to-cart-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleIncrement}
              className={`${styles.addToCartBtn} ${product.isFlado ? styles.fladoAddBtn : ''}`}
            >
              <FiShoppingCart className={styles.cartIcon} />
              <span>Add to Cart</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
