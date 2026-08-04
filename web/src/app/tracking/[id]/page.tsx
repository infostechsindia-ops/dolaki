'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { FiCheck, FiZap, FiTruck, FiMapPin, FiPhone, FiCompass, FiShield } from 'react-icons/fi';
import styles from './page.module.css';

interface TrackingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderTrackingPage({ params }: TrackingPageProps) {
  const { id } = use(params);
  
  // Decide delivery type based on ID
  const isFlado = id.startsWith('AM-9') || id.includes('FLADO') || Math.random() > 0.5;

  const [step, setStep] = useState(2); // Step 2 = Out for Delivery
  const [eta, setEta] = useState(isFlado ? 8 : 48); // 8 minutes or 48 hours

  // Countdown timer for Flado delivery
  useEffect(() => {
    if (!isFlado) return;
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep(3); // Set to delivered
          return 0;
        }
        return prev - 1;
      });
    }, 45000); // Decr ETA every 45 secs

    return () => clearInterval(interval);
  }, [isFlado]);

  const steps = [
    { label: 'Order Confirmed', time: '10:05 AM, Today', desc: 'AuraMart warehouse received your order.' },
    { label: 'Packed & Dispatched', time: '10:08 AM, Today', desc: 'Courier partner selected & items sealed.' },
    { label: 'Out for Delivery', time: 'Active', desc: isFlado ? 'Flado delivery partner is on the way.' : 'Transit partner moving package towards hub.' },
    { label: 'Delivered', time: 'Pending', desc: 'Secure OTP verification will be required.' }
  ];

  return (
    <div className={styles.trackingPage}>
      <div className="container">
        {/* Header summary */}
        <div className={styles.trackHeader}>
          <div>
            <span className={styles.orderLabel}>ORDER TRACKING</span>
            <h1 className={styles.orderTitle}>Order ID: {id}</h1>
          </div>
          <div className={styles.etaBox}>
            <span className={styles.etaLabel}>{isFlado ? 'ESTIMATED ARRIVAL' : 'EXPECTED DELIVERY'}</span>
            <h2 className={styles.etaTime}>
              {eta > 0 
                ? (isFlado ? `${eta} Minutes` : 'By Tomorrow evening') 
                : 'Delivered Successfully!'}
            </h2>
          </div>
        </div>

        <div className={styles.trackGrid}>
          {/* Left Column: Progress Stepper */}
          <div className={styles.stepperColumn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Fulfillment Status</h3>
              <div className={styles.stepper}>
                {steps.map((s, index) => {
                  const isCompleted = index < step;
                  const isActive = index === step;
                  return (
                    <div 
                      key={index} 
                      className={`${styles.stepRow} ${isCompleted ? styles.stepCompleted : ''} ${isActive ? styles.stepActive : ''}`}
                    >
                      <div className={styles.stepIndicatorWrapper}>
                        <div className={styles.circle}>
                          {isCompleted ? <FiCheck /> : (index + 1)}
                        </div>
                        {index < steps.length - 1 && <div className={styles.line}></div>}
                      </div>
                      <div className={styles.stepDetails}>
                        <div className={styles.stepHeader}>
                          <h4>{s.label}</h4>
                          <span className={styles.stepTime}>{s.time}</span>
                        </div>
                        <p>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rider Information card (Only for Flado Quick Commerce) */}
            {isFlado && step < 3 && (
              <div className={`${styles.card} ${styles.riderCard}`}>
                <h3 className={styles.cardTitle}>Your Flado Delivery Executive</h3>
                <div className={styles.riderInner}>
                  <div className={styles.riderAvatar}>
                    <span>RK</span>
                  </div>
                  <div className={styles.riderMeta}>
                    <h4>Ramesh Kumar</h4>
                    <span className={styles.verificationBadge}>✓ Verified Rider Partner</span>
                    <p className={styles.riderSubtext}>Traveling on Electric Scooter. Delivery OTP: <strong>7281</strong></p>
                  </div>
                  <a href="tel:+919876543210" className={styles.phoneBtn} aria-label="Call Rider">
                    <FiPhone /> Call Ramesh
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Animated Route representation */}
          <div className={styles.mapColumn}>
            <div className={`${styles.card} ${styles.mapCard}`}>
              <h3 className={styles.cardTitle}>
                <FiCompass className={styles.compassIcon} /> Live Route Tracker
              </h3>
              
              {/* Animated Map Graphic */}
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapGridLines}></div>
                
                {/* Router Path */}
                <div className={styles.roadPath}>
                  {/* Moving Courier Icon */}
                  {step < 3 && (
                    <div className={`${styles.courierIcon} ${isFlado ? styles.fladoCourier : styles.standardCourier}`}>
                      {isFlado ? <FiZap /> : <FiTruck />}
                    </div>
                  )}
                </div>

                {/* Markers */}
                <div className={`${styles.marker} ${styles.warehouseMarker}`}>
                  <FiMapPin className={styles.markerIcon} />
                  <span className={styles.markerLabel}>Warehouse</span>
                </div>

                <div className={`${styles.marker} ${styles.homeMarker}`}>
                  <FiMapPin className={styles.markerIcon} />
                  <span className={styles.markerLabel}>Your Home</span>
                </div>

                {step === 3 && (
                  <div className={styles.deliveredCelebration}>
                    <FiShield className={styles.celebIcon} />
                    <h4>Order Delivered Securely!</h4>
                    <p>Thank you for shopping with AuraMart.</p>
                  </div>
                )}
              </div>

              <div className={styles.mapFooter}>
                <p>Deliveries are monitored live via secure GPS routing protocols. Rest assured, your parcel is safe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
