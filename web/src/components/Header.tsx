'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiZap,
  FiBell,
  FiChevronDown,
  FiPercent,
  FiHeart
} from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import SearchInput from '@/components/ui/SearchInput';
import Modal from '@/components/ui/Modal';
import styles from './Header.module.css';

export interface HeaderProps {
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function Header({ surface = 'MARKETPLACE' }: HeaderProps) {
  const router = useRouter();
  const { totalItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Location State (stored as unverified local user preference)
  const [selectedLocation, setSelectedLocation] = useState('Select Delivery Location');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');

  // Sticky compact state
  const [isCompact, setIsCompact] = useState(false);

  // Departments dropdown menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationTriggerRef = useRef<HTMLButtonElement>(null);
  const deptTriggerRef = useRef<HTMLButtonElement>(null);
  const menuLinksRef = useRef<HTMLAnchorElement[]>([]);

  const isFlado = surface === 'QUICK_COMMERCE';

  // Check login & load location preference on mount
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('aura_token'));
    const savedLoc = localStorage.getItem('auramart_unverified_location_preference');
    if (savedLoc) {
      setSelectedLocation(savedLoc);
    }
  }, []);

  // Passive scroll listener for compact state transitions
  useEffect(() => {
    let active = false;
    const handleScroll = () => {
      const isScrollPast = window.scrollY > 50;
      if (isScrollPast !== active) {
        active = isScrollPast;
        setIsCompact(isScrollPast);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.trim()) {
      const val = pincodeInput.trim();
      setSelectedLocation(val);
      localStorage.setItem('auramart_unverified_location_preference', val);
      setShowLocationModal(false);
      setPincodeInput('');
    }
  };

  // Keyboard navigation for departments dropdown
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (!isMenuOpen) {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsMenuOpen(true);
        // Focus first link in next paint
        setTimeout(() => menuLinksRef.current[0]?.focus(), 0);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsMenuOpen(false);
      deptTriggerRef.current?.focus();
    }
  };

  const handleMenuItemKeyDown = (index: number, e: React.KeyboardEvent) => {
    const maxIndex = menuLinksRef.current.length - 1;

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsMenuOpen(false);
      deptTriggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index === maxIndex ? 0 : index + 1;
      menuLinksRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index === 0 ? maxIndex : index - 1;
      menuLinksRef.current[prevIndex]?.focus();
    }
  };

  // Pre-configured department list links
  const departments = [
    { href: '/categories/electronics', label: '⚡ Electronics' },
    { href: '/categories/fashion', label: '👕 Fashion' },
    { href: '/categories/beauty', label: '💄 Beauty & Care' },
    { href: '/categories/home', label: '🛋️ Home Decor' },
    { href: '/categories/groceries', label: '🍎 Groceries' },
    { href: '/categories/sports', label: '⚽ Sports' },
    { href: '/categories/appliances', label: '🧹 Appliances' },
    { href: '/categories/toys', label: '🧱 Toys & Hobbies' }
  ];

  return (
    <div className={`${styles.header} ${isCompact ? styles.compact : ''}`}>
      {/* Top Banner Offer Ticker — Hidden in compact mode */}
      <div className={styles.topBanner}>
        <div className={styles.topBannerInner}>
          <span className={styles.topBannerBadge}>Offer</span>
          <span className={styles.tickerText}>
            {isFlado 
              ? '⚡ Super value groceries delivered straight to your door step' 
              : '⚡ Big Billion Aura Sale is Live! Flat 10% Off with HDFC Cards | Free Standard Shipping'}
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <header className={isFlado ? styles.headerMainFlado : styles.headerMain}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            
            {/* Logo */}
            <div className={styles.leftSection}>
              {isFlado ? (
                <Link href="/flado" className={styles.fladoLogo} aria-label="Flado Grocery Home">
                  <span className={styles.fladoLogoAccent}>Flado</span>
                  <span className={styles.fladoSuperBadge}>Express</span>
                </Link>
              ) : (
                <Link href="/" className={styles.logo} aria-label="AuraMart Home">
                  <span className={styles.logoAccent}>Aura</span>Mart
                </Link>
              )}

              {/* Delivery Location Trigger */}
              <button
                ref={locationTriggerRef}
                className={styles.locationButton}
                onClick={() => setShowLocationModal(true)}
                aria-label={`Delivery Location, currently ${selectedLocation}`}
              >
                <FiMapPin className={styles.pinIcon} aria-hidden="true" />
                <div className={styles.locationText}>
                  <span className={styles.deliverTo}>Deliver to</span>
                  <span className={styles.currentLocation}>{selectedLocation}</span>
                </div>
                <FiChevronDown className={styles.chevron} aria-hidden="true" />
              </button>

              {/* Accessible Keyboard Departments Dropdown */}
              <div ref={dropdownRef} className={styles.categoriesDropdown}>
                <button
                  type="button"
                  ref={deptTriggerRef}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Departments menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  onKeyDown={handleDropdownKeyDown}
                  className={styles.deptButton}
                >
                  <span>Departments</span>
                  <FiChevronDown className={styles.chevron} aria-hidden="true" />
                </button>
                
                {isMenuOpen && (
                  <div className={styles.dropdownMenu} role="menu">
                    {departments.map((dept, idx) => (
                      <Link
                        key={dept.href}
                        href={dept.href}
                        role="menuitem"
                        tabIndex={0}
                        ref={(el) => {
                          if (el) menuLinksRef.current[idx] = el;
                        }}
                        onKeyDown={(e) => handleMenuItemKeyDown(idx, e)}
                      >
                        {dept.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prominent Search bar utilizing SearchInput primitive */}
            <div className={styles.searchBarWrapper}>
              <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  placeholder={isFlado ? "Search fresh groceries & daily needs..." : "Search electronics, fashion, beauty..."}
                  className={styles.searchBox}
                  aria-label="Search products"
                />
              </form>
            </div>

            {/* Action rail links */}
            <nav className={styles.navActions} aria-label="Quick Actions">
              {!isFlado ? (
                <Link href="/flado" className={styles.fladoLink} aria-label="Go to Flado Quick Commerce">
                  <FiZap className={styles.zapIcon} aria-hidden="true" />
                  <span>Flado Grocery</span>
                </Link>
              ) : (
                <Link href="/" className={styles.standardLink} aria-label="Go to AuraMart Marketplace">
                  <span>Main Store</span>
                </Link>
              )}

              <Link href="/deals" className={styles.navIconLink} aria-label="Deals Hub">
                <FiPercent className={styles.navIcon} aria-hidden="true" />
                <span className={styles.iconLabel}>Deals</span>
              </Link>

              <Link href="/profile" className={styles.navIconLink} aria-label="Wishlist">
                <FiHeart className={styles.navIcon} aria-hidden="true" />
                <span className={styles.iconLabel}>Wishlist</span>
              </Link>

              <Link href="/notifications" className={styles.navIconLink} aria-label="Notifications">
                <div className={styles.cartIconWrapper}>
                  <FiBell className={styles.navIcon} aria-hidden="true" />
                  <span className={styles.notifDot} />
                </div>
                <span className={styles.iconLabel}>Alerts</span>
              </Link>

              <Link href={isLoggedIn ? "/profile" : "/auth/login"} className={styles.navIconLink} aria-label="Account details">
                <FiUser className={styles.navIcon} aria-hidden="true" />
                <span className={styles.iconLabel}>Account</span>
              </Link>

              <Link href="/cart" className={styles.cartIconLink} aria-label="View Shopping Cart">
                <div className={styles.cartIconWrapper}>
                  <FiShoppingCart className={styles.navIcon} aria-hidden="true" />
                  {totalItems > 0 && (
                    <span className={styles.cartBadge} aria-label={`${totalItems} items in cart`}>
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className={styles.cartInfo}>
                  <span className={styles.myCart}>Basket</span>
                  <span className={styles.cartItemCount}>{totalItems} items</span>
                </div>
              </Link>
            </nav>

          </div>
        </div>
      </header>

      {/* Accessible location selection dialog utilizing Modal primitive */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Delivery Address Preference"
        size="sm"
      >
        <form onSubmit={handleLocationSubmit} className={styles.locationModalForm}>
          <p className={styles.modalSubtitle}>
            Enter your city name or pincode to configure localized item preferences (unverified).
          </p>
          <input
            type="text"
            required
            placeholder="e.g. Mumbai, 400050"
            value={pincodeInput}
            onChange={(e) => setPincodeInput(e.target.value)}
            className={styles.modalInput}
            aria-label="City name or pincode"
            maxLength={30}
          />
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={() => setShowLocationModal(false)}
              className={styles.modalCancel}
            >
              Cancel
            </button>
            <button type="submit" className={styles.modalSubmit}>
              Apply Preference
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
