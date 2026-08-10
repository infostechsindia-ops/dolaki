'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiGrid,
  FiZap,
  FiShoppingCart,
  FiShoppingBag
} from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import styles from './MobileBottomNav.module.css';

export interface MobileBottomNavProps {
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function MobileBottomNav({ surface = 'MARKETPLACE' }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const isFlado = surface === 'QUICK_COMMERCE';

  // Surface path mapping
  const homePath = isFlado ? '/flado' : '/';
  const categoriesPath = isFlado ? '/flado/categories' : '/categories';
  const ordersPath = isFlado ? '/flado/orders' : '/orders';
  const cartPath = '/cart';

  // Toggle surface helper (Marketplace <=> Flado)
  const toggleSurfacePath = isFlado ? '/' : '/flado';

  // Helper to determine if a path matches exactly
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className={styles.navBar} aria-label="Mobile Navigation" role="navigation">
      <div className={styles.container}>
        
        {/* Home Tab */}
        <Link
          href={homePath}
          className={`${styles.tabItem} ${isActive(homePath) ? styles.active : ''}`}
          aria-current={isActive(homePath) ? 'page' : undefined}
          aria-label="Home"
        >
          <FiHome className={styles.icon} />
          <span className={styles.label}>Home</span>
        </Link>

        {/* Categories Tab */}
        <Link
          href={categoriesPath}
          className={`${styles.tabItem} ${isActive(categoriesPath) ? styles.active : ''}`}
          aria-current={isActive(categoriesPath) ? 'page' : undefined}
          aria-label="Categories"
        >
          <FiGrid className={styles.icon} />
          <span className={styles.label}>Categories</span>
        </Link>

        {/* Quick Surface Toggle Tab */}
        <Link
          href={toggleSurfacePath}
          className={`${styles.tabItem} ${styles.quickToggle} ${isFlado ? styles.quickToggleFlado : ''}`}
          aria-label={isFlado ? "Switch to AuraMart Main Store" : "Switch to Flado Grocery Store"}
        >
          <div className={styles.toggleIconCircle}>
            <FiZap className={styles.quickIcon} />
          </div>
          <span className={styles.label}>{isFlado ? 'Main Store' : 'Flado'}</span>
        </Link>

        {/* Orders Tab */}
        <Link
          href={ordersPath}
          className={`${styles.tabItem} ${isActive(ordersPath) ? styles.active : ''}`}
          aria-current={isActive(ordersPath) ? 'page' : undefined}
          aria-label="Orders"
        >
          <FiShoppingBag className={styles.icon} />
          <span className={styles.label}>Orders</span>
        </Link>

        {/* Basket (Cart) Tab */}
        <Link
          href={cartPath}
          className={`${styles.tabItem} ${isActive(cartPath) ? styles.active : ''}`}
          aria-current={isActive(cartPath) ? 'page' : undefined}
          aria-label="View Shopping Cart"
        >
          <div className={styles.cartIconWrapper}>
            <FiShoppingCart className={styles.icon} />
            {totalItems > 0 && (
              <span className={styles.cartBadge} aria-label={`${totalItems} items in cart`}>
                {totalItems}
              </span>
            )}
          </div>
          <span className={styles.label}>Basket</span>
        </Link>

      </div>
    </nav>
  );
}
