'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiMapPin, 
  FiCreditCard, 
  FiSmartphone, 
  FiCheckCircle, 
  FiInfo, 
  FiLock, 
  FiPlus, 
  FiArrowRight, 
  FiClock, 
  FiGift 
} from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { findClosestStoreAndETA } from '@/data/fladoDarkstores';
import styles from './page.module.css';

declare const L: any; // Leaflet global declaration

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, totalPrice } = useCart();
  
  const [discount, setDiscount] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400050');
  
  // Dynamic Map coordinates
  const [coordinates, setCoordinates] = useState({ lat: 19.0596, lng: 72.8295 });
  const [etaDetails, setEtaDetails] = useState({ storeName: 'Bandra Hub', distance: 0.5, eta: 10 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Delivery Slots & Tips
  const [fladoSlot, setFladoSlot] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledTime, setScheduledTime] = useState('Tomorrow 09:00 AM - 11:00 AM');
  const [riderTip, setRiderTip] = useState(0);

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load discount on mount
  useEffect(() => {
    const savedDiscount = localStorage.getItem('auramart_discount');
    if (savedDiscount) {
      setDiscount(parseInt(savedDiscount));
    }
  }, []);

  // 1. Load Leaflet Map dynamically
  useEffect(() => {
    // Check if Leaflet script is already loaded
    if (typeof L !== 'undefined') {
      setMapLoaded(true);
      return;
    }

    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(cssLink);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapLoaded || typeof L === 'undefined') return;

    // Initialize Map element
    const container = document.getElementById('leaflet-checkout-map');
    if (!container || mapRef.current) return;

    const mapInstance = L.map('leaflet-checkout-map').setView([coordinates.lat, coordinates.lng], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    const customMarker = L.marker([coordinates.lat, coordinates.lng], { draggable: true }).addTo(mapInstance);

    // Drop Pin Click event
    mapInstance.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      customMarker.setLatLng([lat, lng]);
      setCoordinates({ lat, lng });
    });

    // Drag Pin Event
    customMarker.on('dragend', () => {
      const position = customMarker.getLatLng();
      setCoordinates({ lat: position.lat, lng: position.lng });
    });

    mapRef.current = mapInstance;
    markerRef.current = customMarker;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded]);

  // 3. Recalculate Closest store & ETA when coordinates move
  useEffect(() => {
    const result = findClosestStoreAndETA(coordinates.lat, coordinates.lng);
    if (result) {
      setEtaDetails({
        storeName: result.store.name,
        distance: result.distance,
        eta: result.eta
      });
      // Auto prefill pincode based on selected store
      if (result.store.id === 'store-andheri') setPincode('400059');
      else if (result.store.id === 'store-worli') setPincode('400018');
      else setPincode('400050');
    }
  }, [coordinates]);

  const savedAddresses = [
    {
      id: 1,
      name: 'Arif Al Nukhbah',
      phone: '+91 98765 43210',
      address: 'Apt 402, Sea Green Apartments, Carter Road, Bandra West',
      city: 'Mumbai',
      pincode: '400050',
      lat: 19.0596,
      lng: 72.8295
    },
    {
      id: 2,
      name: 'Arif Al Nukhbah (Office)',
      phone: '+91 98765 43210',
      address: 'Level 12, Maker Chambers VI, Nariman Point',
      city: 'Mumbai',
      pincode: '400021',
      lat: 18.9067,
      lng: 72.8147
    }
  ];

  const handleSelectSavedAddress = (id: number) => {
    const addr = savedAddresses.find(a => a.id === id);
    if (addr) {
      setName(addr.name);
      setPhone(addr.phone);
      setAddress(addr.address);
      setCity(addr.city);
      setPincode(addr.pincode);
      setCoordinates({ lat: addr.lat, lng: addr.lng });

      // Move marker on map if loaded
      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng([addr.lat, addr.lng]);
        mapRef.current.setView([addr.lat, addr.lng], 14);
      }
    }
  };

  // Set default address on load
  useEffect(() => {
    handleSelectSavedAddress(1);
  }, []);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !pincode) {
      alert('Please fill in all shipping details.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment transaction
    setTimeout(() => {
      const orderId = 'FLADO-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('last_order_id', orderId);
      localStorage.setItem('last_order_total', finalTotal.toLocaleString('en-IN'));
      localStorage.setItem('last_order_eta', etaDetails.eta.toString());
      localStorage.setItem('last_order_store', etaDetails.storeName);

      clearCart();
      localStorage.removeItem('auramart_discount');
      setIsProcessing(false);
      router.push('/checkout/confirmation');
    }, 2000);
  };

  const hasFladoItems = cart.some(item => item.product.isFlado);
  const gst = Math.round(totalPrice * 0.18);
  const convenienceFee = hasFladoItems ? 15 : 49;
  const finalTotal = Math.max(0, totalPrice + gst + convenienceFee + riderTip - discount);

  return (
    <div className={styles.checkoutPage}>
      {isProcessing && (
        <div className={styles.processingOverlay}>
          <div className={styles.loadingSpinnerBox}>
            <div className={styles.spinner}></div>
            <h3>Processing Secure Transaction...</h3>
            <p>Please do not close this window or hit refresh.</p>
          </div>
        </div>
      )}

      <div className="container">
        <h1 className={styles.pageTitle}>Secure Checkout Basket</h1>
        
        <div className={styles.checkoutGrid}>
          
          {/* Left Column: Details */}
          <div className={styles.formColumn}>
            
            {/* Address Presets */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiMapPin className={styles.titleIcon} /> Saved Locations
              </h3>
              <div className={styles.addressPresets}>
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    className={styles.presetBtn}
                    onClick={() => handleSelectSavedAddress(addr.id)}
                    type="button"
                  >
                    <strong>📍 {addr.name}</strong>
                    <p style={{ margin: '4px 0', fontSize: '0.78rem' }}>{addr.address}</p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{addr.phone}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* LEAFLET OPENSTREETMAP ADDRESS SELECTOR */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiMapPin className={styles.titleIcon} /> Drop Pin Location (OpenStreetMap)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Drag the marker or click on the map to pinpoint your exact home location.
              </p>
              
              <div 
                id="leaflet-checkout-map" 
                style={{ 
                  height: '240px', 
                  width: '100%', 
                  backgroundColor: '#E5E7EB', 
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '1.5px solid var(--color-border)',
                  zIndex: 10
                }}
              />

              <div className={styles.inputGrid}>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                  <label>Home / Office Flat / Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Apt, Building, Street, Landmark"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Receiver Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Receiver Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* SCHEDULED SLOT PICKER */}
            {hasFladoItems && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <FiClock className={styles.titleIcon} /> Choose Delivery Time
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setFladoSlot('asap')}
                    className={`${styles.presetBtn} ${fladoSlot === 'asap' ? styles.presetActive : ''}`}
                    type="button"
                    style={{ padding: '16px', textAlign: 'left' }}
                  >
                    <strong>⚡ Instant ASAP</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>Deliver in {etaDetails.eta} mins</p>
                  </button>
                  <button
                    onClick={() => setFladoSlot('scheduled')}
                    className={`${styles.presetBtn} ${fladoSlot === 'scheduled' ? styles.presetActive : ''}`}
                    type="button"
                    style={{ padding: '16px', textAlign: 'left' }}
                  >
                    <strong>📅 Schedule Later</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>Choose slots tomorrow</p>
                  </button>
                </div>

                {fladoSlot === 'scheduled' && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Select Slot Interval:</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--color-border)',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Tomorrow 09:00 AM - 11:00 AM">Tomorrow 09:00 AM - 11:00 AM</option>
                      <option value="Tomorrow 01:00 PM - 03:00 PM">Tomorrow 01:00 PM - 03:00 PM</option>
                      <option value="Tomorrow 06:00 PM - 08:00 PM">Tomorrow 06:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* DELIVERY PARTNER TIP ROW */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiGift className={styles.titleIcon} style={{ color: '#10B981' }} /> Delivery Partner Tip
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Add a tip to show appreciation for your rider. 100% of tips go directly to the rider.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[0, 10, 20, 30, 50].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setRiderTip(tip)}
                    className={`${styles.presetBtn} ${riderTip === tip ? styles.presetActive : ''}`}
                    type="button"
                    style={{ padding: '10px 20px', minWidth: '70px', display: 'inline-flex', justifyContent: 'center' }}
                  >
                    {tip === 0 ? 'No Tip' : `₹${tip}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <FiCreditCard className={styles.titleIcon} /> Choose Payment Method
              </h3>
              
              <div className={styles.paymentMethods}>
                <button
                  className={`${styles.methodBtn} ${paymentMethod === 'upi' ? styles.methodActive : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                  type="button"
                >
                  <FiSmartphone className={styles.methodIcon} />
                  <div>
                    <strong>UPI Pay (Instant Verification)</strong>
                    <span>Use GPay, PhonePe, Paytm</span>
                  </div>
                </button>
                
                <button
                  className={`${styles.methodBtn} ${paymentMethod === 'card' ? styles.methodActive : ''}`}
                  onClick={() => setPaymentMethod('card')}
                  type="button"
                >
                  <FiCreditCard className={styles.methodIcon} />
                  <div>
                    <strong>Credit / Debit Card</strong>
                    <span>All Indian & Global cards accepted</span>
                  </div>
                </button>

                <button
                  className={`${styles.methodBtn} ${paymentMethod === 'cod' ? styles.methodActive : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                  type="button"
                >
                  <FiCheckCircle className={styles.methodIcon} />
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <span>Pay on delivery scanner or cash</span>
                  </div>
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Enter VPA / UPI ID:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okaxis"
                    className={styles.formInput}
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className={styles.inputGrid} style={{ marginTop: '16px' }}>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>16-digit Card Number</label>
                    <input
                      type="text"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value.replace(/\D/g, '').substring(0, 16))}
                      placeholder="4000 1234 5678 9010"
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.substring(0, 5))}
                      placeholder="MM / YY"
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="•••"
                      className={styles.formInput}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Calculations */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Payment Overview</h3>
              <div className={styles.pricesList}>
                <div className={styles.priceRow}>
                  <span>Item Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>CGST + SGST (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Convenience Delivery Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
                {riderTip > 0 && (
                  <div className={styles.priceRow}>
                    <span>Rider Tip (100% to Rider)</span>
                    <span>₹{riderTip}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className={`${styles.priceRow} ${styles.discountText}`}>
                    <span>Coupon Savings</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className={styles.divider}></div>
                <div className={styles.totalRow}>
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '1.25rem' }}>🛵</span>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '800' }}>
                  Fulfilling from {etaDetails.storeName} ({etaDetails.distance} km away).
                </span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className={styles.placeOrderBtn}
                type="button"
              >
                Place Secure Order & Pay ₹{finalTotal.toLocaleString('en-IN')}
              </button>

              <div className={styles.secureSeal}>
                <FiLock className={styles.sealIcon} />
                <span>256-bit Encrypted Transaction SSL</span>
              </div>
            </div>
            
            <div className={styles.infoBox}>
              <FiInfo className={styles.infoIcon} />
              <p style={{ margin: 0 }}>
                Flado items are fulfilled instantly from our darkstore within 10-minutes. Ensure your receiver phone is reachable for active delivery rider updates.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
