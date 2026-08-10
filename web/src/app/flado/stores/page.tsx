'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiMapPin, FiClock, FiActivity } from 'react-icons/fi';
import styles from './page.module.css';

import { API_BASE_URL } from '@/lib/config';

declare const L: any;

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  eta: string;
  status: string;
  riders: number;
  lat: number;
  lng: number;
}

const mockStores: Store[] = [
  { id: 'ds-1', name: 'Flado Darkstore Muzaffarpur', address: 'Zero Mile Chowk near flyover, Muzaffarpur', city: 'Muzaffarpur', eta: '8-12 mins', status: 'Open', riders: 12, lat: 26.1209, lng: 85.3647 },
  { id: 'ds-2', name: 'Flado Darkstore Maunath Bhanjan', address: 'Mohalla Sadar Bazar, Mau Road', city: 'Maunath Bhanjan', eta: '10-15 mins', status: 'Open', riders: 7, lat: 25.9500, lng: 83.5620 },
  { id: 'ds-3', name: 'Flado Darkstore Nariman Point', address: 'Express Towers basement, Nariman Point', city: 'Mumbai', eta: '6-9 mins', status: 'Open', riders: 24, lat: 18.9283, lng: 72.8200 },
  { id: 'ds-4', name: 'Flado Darkstore Juhu Scheme', address: 'Ground Floor, Tulip Enclave, Juhu Tara Road', city: 'Mumbai', eta: '12-18 mins', status: 'Open', riders: 9, lat: 19.1023, lng: 72.8258 }
];

export default function FladoStoresPage() {
  const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
  const [stores, setStores] = useState<Store[]>(isDemo ? mockStores : []);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState('ds-1');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/api/flado/darkstores`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setStores(data);
        } else {
          if (!isDemo) {
            setError(`Unable to load darkstores (Server status: ${res.status}).`);
          }
        }
      } catch (e) {
        if (!isDemo) {
          setError('Connection error: Failed to connect to darkstores service.');
        }
      }
      setLoading(false);
    };
    fetchStores();
  }, []);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).L) {
      setMapLoaded(true);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Map and markers
  useEffect(() => {
    if (!mapLoaded || typeof L === 'undefined' || loading) return;
    
    // Bandra center default
    const mapInstance = L.map('leaflet-darkstores-map').setView([19.0583, 72.8300], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    const newMarkers: Record<string, any> = {};

    stores.forEach(store => {
      const marker = L.marker([store.lat, store.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #059669; color: white; padding: 4px 8px; border-radius: 12px; font-weight: 800; font-size: 8.5px; border: 1.5px solid white; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.15)">⚡ ${store.name.split(' ').pop()}</div>`,
          iconSize: [60, 20]
        })
      }).addTo(mapInstance);

      // Add click listener
      marker.on('click', () => {
        setSelectedStoreId(store.id);
      });

      // Draw delivery coverage radius circle (3 km)
      L.circle([store.lat, store.lng], {
        color: '#10B981',
        fillColor: '#10B981',
        fillOpacity: 0.08,
        radius: 3000 
      }).addTo(mapInstance);

      newMarkers[store.id] = marker;
    });

    mapRef.current = mapInstance;
    markersRef.current = newMarkers;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded, loading, stores]);

  // Center map on selected store changes
  useEffect(() => {
    if (!mapRef.current) return;
    const store = stores.find(s => s.id === selectedStoreId);
    if (store) {
      mapRef.current.setView([store.lat, store.lng], 13);
    }
  }, [selectedStoreId, stores]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Locating closest darkstore hubs...</p>
      </div>
    );
  }

  const selectedStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  return (
    <div className={styles.storesPage}>
      {error && <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '10px 15px', borderRadius: '4px', margin: '15px auto', maxWidth: '1200px', borderLeft: '4px solid #EF4444' }}>{error}</div>}
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className="container">
          <Link href="/flado" className={styles.backBtn}>
            <FiChevronLeft /> Back to Flado
          </Link>
          <div className={styles.titleSec}>
            <h1>⚡ Flado Darkstore Networks</h1>
            <p>Our micro-warehouses are placed strategically across Mumbai to ensure delivery under 10 minutes.</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '35px' }}>
        <div className={styles.workspaceGrid}>
          {/* Left panel: Stores List */}
          <div className={styles.storesPanel}>
            <h3>Active Fulfillment Centers ({stores.length})</h3>
            <div className={styles.storesList}>
              {stores.map(store => (
                <div 
                  key={store.id} 
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`${styles.storeCard} ${selectedStoreId === store.id ? styles.activeStoreCard : ''}`}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.nameRow}>
                      <FiMapPin className={styles.pinIcon} />
                      <h4>{store.name}</h4>
                    </div>
                    <span className={`${styles.statusBadge} ${store.status === 'Open' ? styles.statusOpen : styles.statusClosed}`}>
                      {store.status}
                    </span>
                  </div>
                  <p className={styles.storeAddress}>{store.address}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}><FiClock /> ETA: {store.eta}</span>
                    <span className={styles.metaItem}><FiActivity /> {store.riders} Riders Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Leaflet Map */}
          <div className={styles.mapPanel}>
            <div className={styles.mapPlaceholder}>
              <div 
                id="leaflet-darkstores-map" 
                style={{ height: '100%', width: '100%', zIndex: 10 }}
              />

              {/* Selection Summary details */}
              <div className={styles.mapOverlayDetails}>
                <h4>Fulfillment Hub Details</h4>
                <h5>{selectedStore.name}</h5>
                <p>📍 {selectedStore.address}</p>
                <div className={styles.overlayDetailsRow}>
                  <span>⏱️ Average Pick Time: <strong>2 Mins</strong></span>
                  <span>🏍️ Average Transit Time: <strong>6 Mins</strong></span>
                </div>
                <button 
                  onClick={() => alert(`🎉 Store '${selectedStore.name}' selected as your primary fulfillment darkstore!`)} 
                  className={styles.selectStoreBtn}
                >
                  Confirm Store & Start Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
