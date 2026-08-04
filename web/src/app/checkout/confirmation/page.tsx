'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiShoppingBag, FiTruck, FiArrowRight, FiInfo } from 'react-icons/fi';
import styles from './page.module.css';

export default function ConfirmationPage() {
  const [orderId, setOrderId] = useState('AM-108239');
  const [orderTotal, setOrderTotal] = useState('0');

  useEffect(() => {
    const savedId = localStorage.getItem('last_order_id');
    const savedTotal = localStorage.getItem('last_order_total');
    if (savedId) setOrderId(savedId);
    if (savedTotal) setOrderTotal(savedTotal);
  }, []);

  return (
    <div className={styles.confPage}>
      <div className="container">
        <div className={styles.confCard}>
          <div className={styles.successIconWrapper}>
            <FiCheckCircle className={styles.successIcon} />
          </div>

          <span className={styles.successBadge}>Payment Confirmed</span>
          <h1 className={styles.confTitle}>Order Placed Successfully!</h1>
          
          <p className={styles.confSubtitle}>
            Thank you for shopping with us! Your payment of <strong>₹{orderTotal}</strong> has been processed securely.
          </p>

          <div className={styles.orderIdBox}>
            <span className={styles.orderIdLabel}>Order ID</span>
            <strong className={styles.orderIdVal}>{orderId}</strong>
          </div>

          <div className={styles.logisticsNotice}>
            <FiInfo className={styles.infoIcon} />
            <p>
              Your order has been split into packages based on nearest warehouse availability. 
              Estimated delivery timeline details have been sent to your registered mobile number and email.
            </p>
          </div>

          <div className={styles.actionButtons}>
            <Link href={orderId.startsWith('FLADO-') ? `/flado/tracking/${orderId}` : `/tracking/${orderId}`} className={styles.trackBtn}>
              Track Order Status <FiArrowRight />
            </Link>
            <Link href="/" className={styles.continueBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
