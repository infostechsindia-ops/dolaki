'use client';

import React from 'react';
import OrderStatusBadge, { OrderStatusVariant } from './OrderStatusBadge';
import OrderItemsList, { OrderItemData } from './OrderItemsList';
import OrderActions, { OrderActionsProps } from './OrderActions';
import styles from './OrderCard.module.css';

export interface OrderCardData {
  orderId: string;
  orderDate: string;
  status: OrderStatusVariant | string;
  paymentStatusText?: string;
  deliveryStatusText?: string;
  items: OrderItemData[];
  totalPriceText: string;
}

export interface OrderCardProps {
  order: OrderCardData;
  actions?: Partial<OrderActionsProps>;
  showItems?: boolean;
}

export default function OrderCard({
  order,
  actions,
  showItems = true,
}: OrderCardProps) {
  const {
    orderId,
    orderDate,
    status,
    paymentStatusText,
    deliveryStatusText,
    items,
    totalPriceText,
  } = order;

  return (
    <article className={styles.card} data-testid={`order-card-${orderId}`}>
      {/* Header Row */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.orderId} data-testid="order-card-id">
            Order #{orderId}
          </span>
          <span className={styles.orderDate} data-testid="order-card-date">
            Placed on {orderDate}
          </span>
        </div>

        <div className={styles.headerRight}>
          <OrderStatusBadge status={status} />
        </div>
      </header>

      {/* Meta Row: Payment & Delivery Statuses */}
      {(paymentStatusText || deliveryStatusText) && (
        <div className={styles.metaRow}>
          {paymentStatusText && (
            <span className={styles.metaItem} data-testid="order-card-payment-status">
              Payment: <strong>{paymentStatusText}</strong>
            </span>
          )}
          {deliveryStatusText && (
            <span className={styles.metaItem} data-testid="order-card-delivery-status">
              Delivery: <strong>{deliveryStatusText}</strong>
            </span>
          )}
        </div>
      )}

      {/* Items Preview */}
      {showItems && items && items.length > 0 && (
        <div className={styles.itemsSection}>
          <OrderItemsList items={items} />
        </div>
      )}

      {/* Footer Row: Order Total & Actions */}
      <footer className={styles.footer}>
        <div className={styles.totalBlock}>
          <span className={styles.totalLabel}>Total Amount</span>
          <span className={styles.totalPrice} data-testid="order-card-total">
            {totalPriceText}
          </span>
        </div>

        {actions && <OrderActions orderId={orderId} {...actions} />}
      </footer>
    </article>
  );
}
