'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { 
  FiMapPin, 
  FiPhone, 
  FiClock, 
  FiChevronLeft, 
  FiCheckCircle, 
  FiAlertCircle,
  FiCompass,
  FiUser
} from 'react-icons/fi';
import styles from './page.module.css';

declare const L: any; // Leaflet global

interface TrackingProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function FladoTrackingPage({ params }: TrackingProps) {
  const { orderId } = use(params);
  const [orderTotal, setOrderTotal] = useState('1,250');
  const [initialEta, setInitialEta] = useState(10);
  const [eta, setEta] = useState(10);
  const [storeName, setStoreName] = useState('Bandra Hub');
  
  // Coordinates representing route from Bandra darkstore to Carter Road customer address
  const riderPath = [
    { lat: 19.0645, lng: 72.8358 }, // Darkstore (Bandra East/Linking Rd)
    { lat: 19.0630, lng: 72.8335 },
    { lat: 19.0612, lng: 72.8310 },
    { lat: 19.0596, lng: 72.8295 }, // Intermediate
    { lat: 19.0585, lng: 72.8270 },
    { lat: 19.0570, lng: 72.8248 }  // Customer Home (Carter Road)
  ];

  const [pathIdx, setPathIdx] = useState(0);
  const [orderStatus, setOrderStatus] = useState<'packed' | 'dispatched' | 'arriving' | 'delivered'>('packed');

  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);

  useEffect(() => {
    const savedTotal = localStorage.getItem('last_order_total');
    const savedEta = localStorage.getItem('last_order_eta');
    const savedStore = localStorage.getItem('last_order_store');
    if (savedTotal) setOrderTotal(savedTotal);
    if (savedEta) {
      setInitialEta(parseInt(savedEta));
      setEta(parseInt(savedEta));
    }
    if (savedStore) setStoreName(savedStore);
  }, []);

  // 1. Load Leaflet script/styles
  useEffect(() => {
    if (typeof L !== 'undefined') {
      setMapLoaded(true);
      return;
    }
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapLoaded || typeof L === 'undefined') return;

    const mapInstance = L.map('leaflet-live-tracking-map').setView([19.0645, 72.8358], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Draw route path line
    const coordsArray = riderPath.map(p => [p.lat, p.lng]);
    L.polyline(coordsArray, { color: '#059669', weight: 4, dashArray: '5, 8' }).addTo(mapInstance);

    // Add Darkstore Pin
    L.marker([19.0645, 72.8358], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3B82F6; color: white; padding: 6px 10px; border-radius: 20px; font-weight: 800; font-size: 10px; border: 2px solid white; white-space: nowrap;">🏪 ${storeName}</div>`,
        iconSize: [80, 24]
      })
    }).addTo(mapInstance);

    // Add Customer Pin
    L.marker([19.0570, 72.8248], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="background-color: #EF4444; color: white; padding: 6px 10px; border-radius: 20px; font-weight: 800; font-size: 10px; border: 2px solid white; white-space: nowrap;">🏠 HOME</div>',
        iconSize: [50, 24]
      })
    }).addTo(mapInstance);

    // Initialize Rider marker
    const riderMarker = L.marker([riderPath[0].lat, riderPath[0].lng], {
      icon: L.divIcon({
        className: 'custom-div-icon',
        html: '<div style="font-size: 2.2rem; transform: translate(-10px, -20px);">🛵</div>',
        iconSize: [30, 30]
      })
    }).addTo(mapInstance);

    riderMarkerRef.current = riderMarker;
    mapRef.current = mapInstance;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded]);

  // 3. Simulated rider marker animation loop
  useEffect(() => {
    if (!mapLoaded || pathIdx >= riderPath.length) return;

    const timer = setTimeout(() => {
      const nextIdx = pathIdx + 1;
      if (nextIdx < riderPath.length) {
        const nextPos = riderPath[nextIdx];
        setPathIdx(nextIdx);

        // Move marker
        if (riderMarkerRef.current) {
          riderMarkerRef.current.setLatLng([nextPos.lat, nextPos.lng]);
        }

        // Adjust ETA proportional to index
        const remainingSteps = riderPath.length - 1 - nextIdx;
        const computedEta = Math.max(1, Math.round((remainingSteps / (riderPath.length - 1)) * initialEta));
        setEta(computedEta);

        // Transition order status
        if (nextIdx === 1) setOrderStatus('dispatched');
        else if (nextIdx >= 2 && nextIdx < riderPath.length - 1) setOrderStatus('arriving');
      } else {
        setOrderStatus('delivered');
        setEta(0);
      }
    }, 4000); // Progress rider coordinates every 4 seconds

    return () => clearTimeout(timer);
  }, [mapLoaded, pathIdx, initialEta]);

  return (
    <div className={styles.trackingPage}>
      <div className="container">
        
        {/* Nav Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--color-text-secondary)', fontSize: '0.88rem', fontWeight: '800' }}>
            <FiChevronLeft /> Back to Orders
          </Link>
        </div>

        <div className={styles.trackingLayoutGrid}>
          
          {/* Left Column: Live Map */}
          <div className={styles.mapCard}>
            <div 
              id="leaflet-live-tracking-map"
              style={{ 
                height: '480px', 
                width: '100%', 
                backgroundColor: '#FAFDFB',
                zIndex: 1
              }}
            />
          </div>

          {/* Right Column: Status Summary */}
          <div className={styles.statusColumn}>
            
            {/* ETA Badge Header */}
            <div className={styles.etaHeaderCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2.5rem' }}>🛵</div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Estimated Arrival Time
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '4px 0 0 0', color: 'var(--color-text-primary)' }}>
                    {orderStatus === 'delivered' ? 'Arrived & Delivered!' : `${eta} mins`}
                  </h2>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '16px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-text-secondary)' }}>Fulfilling Store:</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '850', color: 'var(--color-text-primary)' }}>{storeName}</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className={styles.timelineCard}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '20px' }}>Live Delivery Progress</h3>
              
              <div className={styles.stepperList}>
                <div className={`${styles.stepRow} ${styles.completedStep}`}>
                  <FiCheckCircle className={styles.stepCheckIcon} />
                  <div>
                    <strong>Order Confirmed</strong>
                    <span>Payment accepted securely (₹{orderTotal})</span>
                  </div>
                </div>

                <div className={`${styles.stepRow} ${orderStatus !== 'packed' ? styles.completedStep : styles.activeStep}`}>
                  <FiCheckCircle className={styles.stepCheckIcon} />
                  <div>
                    <strong>Packed & Ready</strong>
                    <span>Rider selected & items packed inside thermal bag</span>
                  </div>
                </div>

                <div className={`${styles.stepRow} ${(orderStatus === 'arriving' || orderStatus === 'delivered' || orderStatus === 'dispatched') ? styles.completedStep : ''}`}>
                  <FiCompass className={styles.stepCheckIcon} />
                  <div>
                    <strong>Rider Dispatched</strong>
                    <span>Rider left linking road store towards your home</span>
                  </div>
                </div>

                <div className={`${styles.stepRow} ${orderStatus === 'delivered' ? styles.completedStep : (orderStatus === 'arriving' ? styles.activeStep : '')}`}>
                  <FiMapPin className={styles.stepCheckIcon} />
                  <div>
                    <strong>Rider Reached Location</strong>
                    <span>Rider is at your doorstep. Please answer phone calls.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Agent Card */}
            <div className={styles.riderCard}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="Rahul Kumar"
                  className={styles.riderAvatar}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '900', color: 'var(--color-text-primary)' }}>Rahul Kumar</h4>
                  <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: '800' }}>⭐ 4.9 Rating • 2,400+ deliveries</span>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hero Splendor Electric (MH-02-EX-9921)</p>
                </div>
                <a 
                  href="tel:+919876543210" 
                  className={styles.callRiderBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Calling Rider Rahul Kumar (+91 98765 43210) via masked secure trunk line...');
                  }}
                >
                  <FiPhone /> Call Rider
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
