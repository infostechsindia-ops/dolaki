'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiShoppingCart, FiUser, FiMapPin, FiZap, FiBell, FiChevronDown, FiGift, FiPercent, FiHeart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, Bandra West');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState('⚡ Big Billion Aura Sale is Live! Flat 10% Off with HDFC Cards | Free Express Delivery');

  // Check if we are in Flado mode
  const isFlado = pathname.startsWith('/flado');

  const placeholders = isFlado
    ? [
        "Search fresh organic bananas 🍌...",
        "Search farm whole milk 🥛...",
        "Search gourmet sourdough bread 🍞...",
        "Search classic potato chips 🍿...",
        "Search premium match footballs ⚽..."
      ]
    : [
        "Search premium wireless earbuds 🎧...",
        "Search AMOLED smartwatches ⌚...",
        "Search denim trucker jackets 🧥...",
        "Search vitamin C face serums 🧴...",
        "Search smart drip coffee makers ☕...",
        "Search space shuttle building blocks 🎮..."
      ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('aura_token'));
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [placeholders.length]);

  // Load announcement from CMS if active
  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sdui/homepage');
        if (res.ok) {
          const data = await res.json();
          const ann = data.sections.find((s: any) => s.type === 'top_announcement' && s.visible);
          if (ann) {
            setAnnouncementText(ann.config.text);
          }
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchCMS();
  }, []);

  const locations = [
    'Mumbai, Bandra West',
    'Bangalore, Indiranagar',
    'Delhi NCR, Connaught Place',
    'Hyderabad, Gachibowli',
    'Pune, Koregaon Park',
    'Chennai, Adyar'
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className={styles.header}>
        {/* Top Banner Offers */}
        <div className={styles.topBanner}>
          <div className={styles.topBannerInner}>
            <span className={styles.topBannerBadge}>Sale</span>
            <span className={styles.tickerText}>{announcementText}</span>
          </div>
        </div>

        {/* Main Header */}
        <header className={isFlado ? styles.headerMainFlado : styles.headerMain}>
          <div className="container">
            <div className={styles.headerInner}>
              {/* Logo */}
              <div className={styles.leftSection}>
                {isFlado ? (
                  <Link href="/flado" className={styles.fladoLogo}>
                    <span className={styles.fladoLogoAccent}>Flado</span>
                    <span className={styles.fladoSuperBadge}>10-Min</span>
                  </Link>
                ) : (
                  <Link href="/" className={styles.logo}>
                    <span className={styles.logoAccent}>Aura</span>Mart
                  </Link>
                )}

                {/* Location Selector */}
                <button 
                  className={styles.locationButton}
                  onClick={() => setShowLocationModal(true)}
                  aria-label="Select Delivery Location"
                >
                  <FiMapPin className={styles.pinIcon} />
                  <div className={styles.locationText}>
                    <span className={styles.deliverTo}>Deliver to</span>
                    <span className={styles.currentLocation}>{selectedLocation}</span>
                  </div>
                  <FiChevronDown style={{ fontSize: '0.8rem', marginLeft: '2px', color: 'var(--color-text-muted)' }} />
                </button>

                {/* Departments Dropdown */}
                <div className={styles.categoriesDropdown}>
                  <Link href="/categories" className={styles.deptButton}>
                    <span>Departments</span>
                    <FiChevronDown style={{ fontSize: '0.8rem', marginLeft: '4px' }} />
                  </Link>
                  <div className={styles.dropdownMenu}>
                    <Link href="/categories/electronics">⚡ Electronics</Link>
                    <Link href="/categories/fashion">👕 Fashion</Link>
                    <Link href="/categories/beauty">💄 Beauty & Care</Link>
                    <Link href="/categories/home">🛋️ Home Decor</Link>
                    <Link href="/categories/groceries">🍎 Groceries</Link>
                    <Link href="/categories/sports">⚽ Sports</Link>
                    <Link href="/categories/appliances">🧹 Appliances</Link>
                    <Link href="/categories/toys">🧱 Toys & Hobbies</Link>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className={styles.searchBarWrapper}>
                <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                  <input
                    type="text"
                    placeholder={placeholders[placeholderIndex]}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button type="submit" className={styles.searchButton} aria-label="Submit Search">
                    <FiSearch />
                  </button>
                </form>
              </div>

              {/* Navigation Actions */}
              <nav className={styles.navActions}>
                {/* Flado Portal Button */}
                {!isFlado ? (
                  <Link href="/flado" className={styles.fladoLink}>
                    <FiZap className={styles.zapIcon} />
                    <span>Flado 10-Min</span>
                  </Link>
                ) : (
                  <Link href="/" className={styles.standardLink}>
                    <span>Main Store</span>
                  </Link>
                )}

                {/* Deals Hub */}
                <Link href="/deals" className={styles.navIconLink} aria-label="Deals Hub">
                  <FiPercent className={styles.navIcon} />
                  <span className={styles.iconLabel}>Deals</span>
                </Link>

                {/* Wishlist */}
                <Link href="/profile" className={styles.navIconLink} aria-label="Wishlist">
                  <FiHeart className={styles.navIcon} />
                  <span className={styles.iconLabel}>Wishlist</span>
                </Link>

                {/* Notifications */}
                <Link href="/notifications" className={styles.navIconLink} aria-label="Notifications">
                  <div className={styles.cartIconWrapper}>
                    <FiBell className={styles.navIcon} />
                    <span className={styles.notifDot} />
                  </div>
                  <span className={styles.iconLabel}>Alerts</span>
                </Link>

                {/* Profile */}
                <Link href={isLoggedIn ? "/profile" : "/auth/login"} className={styles.navIconLink} aria-label="Profile">
                  <FiUser className={styles.navIcon} />
                  <span className={styles.iconLabel}>Account</span>
                </Link>

                {/* Cart */}
                <Link href="/cart" className={styles.cartIconLink} aria-label="Shopping Cart">
                  <div className={styles.cartIconWrapper}>
                    <FiShoppingCart className={styles.navIcon} />
                    {totalItems > 0 && (
                      <span className={styles.cartBadge}>{totalItems}</span>
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
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLocationModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Choose your delivery location</h3>
            <p className={styles.modalSubtitle}>Sourcing fresh goods and standard products from the nearest warehouses</p>
            <div className={styles.locationGrid}>
              {locations.map((loc) => (
                <button
                  key={loc}
                  className={`${styles.locationOption} ${selectedLocation === loc ? styles.activeLoc : ''}`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationModal(false);
                  }}
                >
                  <FiMapPin className={styles.modalPin} />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
            <button 
              className={styles.closeModal}
              onClick={() => setShowLocationModal(false)}
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
}
