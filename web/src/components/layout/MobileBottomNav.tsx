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
  isOverlayActive?: boolean;
}

export default function MobileBottomNav({ surface = 'MARKETPLACE', isOverlayActive = false }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const isFlado = surface === 'QUICK_COMMERCE';
  const [isOverlayOpen, setIsOverlayOpen] = React.useState(false);

  React.useEffect(() => {
    const checkOverlay = () => {
      if (typeof document === 'undefined') return;
      const bodyHasClass =
        document.body.classList.contains('modal-open') ||
        document.body.classList.contains('drawer-open') ||
        document.body.classList.contains('overlay-active') ||
        document.body.style.overflow === 'hidden';

      const hasModalElement =
        document.querySelector('[role="dialog"]') !== null ||
        document.querySelector('[aria-modal="true"]') !== null ||
        document.querySelector('.modal-overlay') !== null ||
        document.querySelector('.drawer') !== null;

      const nextVal = bodyHasClass || hasModalElement;
      setIsOverlayOpen((prev) => (prev !== nextVal ? nextVal : prev));
    };

    checkOverlay();

    if (typeof window !== 'undefined' && 'MutationObserver' in window) {
      const observer = new MutationObserver(() => {
        checkOverlay();
      });
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      return () => observer.disconnect();
    }
  }, []);

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

  if (isOverlayActive || isOverlayOpen) {
    return null;
  }

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
