'use client';

import React, { useState, useEffect } from 'react';
import DeliveryPromiseCard from '@/components/delivery/DeliveryPromiseCard';
import HeroBanner from '@/components/home/HeroBanner';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromotionalBanner from '@/components/home/PromotionalBanner';
import BrandLogos from '@/components/home/BrandLogos';
import TrustFeatures from '@/components/home/TrustFeatures';
import { PageContainer, Container } from '@/components/layout/LayoutPrimitives';
import styles from './page.module.css';

export interface QuickHomeFeedData {
  deliveryPromise?: any;
  activeShop?: any;
  categories?: any[];
  reorderItems?: any[];
  offers?: any[];
  popularNearby?: any[];
  essentials?: any[];
  brands?: any[];
}

export interface FladoExpressPageProps {
  initialFeed?: QuickHomeFeedData;
  locationPincode?: string;
  locationCoords?: { lat: number; lng: number };
}

export default function FladoExpressPage({
  initialFeed,
  locationPincode = '400050',
  locationCoords = { lat: 19.0596, lng: 72.8295 },
}: FladoExpressPageProps) {
  const [feed, setFeed] = useState<QuickHomeFeedData | null>(initialFeed || null);
  const [loading, setLoading] = useState<boolean>(!initialFeed);
  const [pincode, setPincode] = useState<string>(locationPincode);

  useEffect(() => {
    if (initialFeed) return;

    let isMounted = true;
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          lat: String(locationCoords.lat),
          lng: String(locationCoords.lng),
          pincode,
        });
        const res = await fetch(`/api/v1/flado/home?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setFeed(json.data || json);
        } else {
          // Fallback location-required feed if request fails
          if (isMounted) {
            setFeed({
              deliveryPromise: {
                isServiceable: true,
                status: 'SERVICEABLE',
                fulfillmentNodeName: 'Bandra Organic Grocers',
                shippingFeeText: 'FREE',
              },
              categories: [
                { name: 'Veggies & Fruits', slug: 'fruits-vegetables', icon: '🥬' },
                { name: 'Dairy & Bread', slug: 'dairy-bread-eggs', icon: '🥛' },
                { name: 'Cold Drinks', slug: 'cold-drinks-juices', icon: '🥤' },
              ],
              popularNearby: [],
              essentials: [],
              offers: [],
              brands: [{ name: 'Amul', slug: 'amul' }],
            });
          }
        }
      } catch (e) {
        if (isMounted) {
          setFeed({
            deliveryPromise: {
              isServiceable: true,
              status: 'SERVICEABLE',
              fulfillmentNodeName: 'Bandra Organic Grocers',
              shippingFeeText: 'FREE',
            },
            categories: [],
            popularNearby: [],
            essentials: [],
            offers: [],
            brands: [],
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeed();
    return () => {
      isMounted = false;
    };
  }, [pincode, locationCoords.lat, locationCoords.lng, initialFeed]);

  const handleLocationSubmit = (newPincode: string) => {
    setPincode(newPincode);
  };

  const categories = feed?.categories || [
    { name: 'Veggies & Fruits', slug: 'fruits-vegetables', icon: '🥬', color: '#ECFDF5' },
    { name: 'Dairy & Bread', slug: 'dairy-bread-eggs', icon: '🥛', color: '#EFF6FF' },
    { name: 'Cold Drinks', slug: 'cold-drinks-juices', icon: '🥤', color: '#FFFBEB' },
  ];

  const offers = (feed?.offers && feed.offers.length > 0)
    ? feed.offers
    : [
        {
          id: 'banner-1',
          title: 'Farm Fresh Organic Greens',
          subtitle: 'Straight from local fields to your kitchen. 100% certified organic veggies delivered fresh.',
          ctaText: 'Shop Produce',
          ctaUrl: '/flado/categories/fruits-vegetables',
          imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&fit=crop',
          backgroundColor: '#059669',
        },
      ];

  const brands = feed?.brands || [
    { name: 'Amul', slug: 'amul' },
    { name: 'Mother Dairy', slug: 'mother-dairy' },
  ];

  return (
    <PageContainer className={styles.fladoContainer}>
      <Container size="2xl">
        {/* 1. Authoritative Delivery Promise Card & Location Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <DeliveryPromiseCard
            promise={feed?.deliveryPromise}
            surface="QUICK_COMMERCE"
            title="Flado Express 10-Minute Grocery Delivery"
            locationSelector={{
              initialValue: pincode,
              onLocationSubmit: handleLocationSubmit,
              placeholder: 'Enter pincode for 10-min delivery...',
            }}
          />
        </div>

        {/* 2. Hero Banners / Offers */}
        <HeroBanner banners={offers} surface="QUICK_COMMERCE" />

        {/* 3. Categories Section */}
        <CategoriesSection categories={categories} title="Shop Grocery Categories" surface="QUICK_COMMERCE" />

        {/* 4. Frequently Bought / Reorder Section (if available) */}
        {feed?.reorderItems && feed.reorderItems.length > 0 && (
          <FeaturedProducts
            products={feed.reorderItems}
            title="Buy Again"
            subtitle="Your frequently ordered grocery items"
            surface="QUICK_COMMERCE"
          />
        )}

        {/* 5. Popular Nearby (In-Stock Items at Active Darkstore) */}
        <FeaturedProducts
          products={feed?.popularNearby || []}
          title="Popular Nearby"
          subtitle="Fresh top picks in stock at your local darkstore"
          surface="QUICK_COMMERCE"
        />

        {/* 6. Promotional Banner (Marketplace Teaser Banner) */}
        <PromotionalBanner
          title="🛍️ Explore Millions of Products on AuraMart Mall!"
          subtitle="Shop smartphones, fashionable clothing, cosmetics, and laptops at unmatched discounts."
          badgeText="Marketplace"
          ctaText="Visit Main Mall"
          ctaUrl="/"
          imageUrl="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&fit=crop"
          surface="QUICK_COMMERCE"
        />

        {/* 7. Essentials Section */}
        <FeaturedProducts
          products={feed?.essentials || []}
          title="Daily Essentials"
          subtitle="Staples delivered to your doorstep in 10 minutes"
          surface="QUICK_COMMERCE"
        />

        {/* 8. Partner Grocery Brands */}
        <BrandLogos brands={brands} title="Partner Grocery Brands" surface="QUICK_COMMERCE" />

        {/* 9. Trust Features */}
        <TrustFeatures surface="QUICK_COMMERCE" />
      </Container>
    </PageContainer>
  );
}

