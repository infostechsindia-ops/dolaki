'use client';

import React from 'react';
import OrdersHeader, { OrdersHeaderProps } from './OrdersHeader';
import OrderSearch, { OrderSearchProps } from './OrderSearch';
import OrderFilters, { OrderFiltersProps } from './OrderFilters';
import OrderCard, { OrderCardData, OrderCardProps } from './OrderCard';
import OrderEmptyState, { OrderEmptyStateProps } from './OrderEmptyState';
import styles from './OrdersPage.module.css';

export interface OrdersPageProps {
  header: OrdersHeaderProps;
  search?: OrderSearchProps;
  filters?: OrderFiltersProps;
  orders: OrderCardData[];
  cardActionsProps?: Partial<OrderCardProps['actions']>;
  isEmpty?: boolean;
  emptyState?: OrderEmptyStateProps;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function OrdersPage({
  header,
  search,
  filters,
  orders = [],
  cardActionsProps,
  isEmpty = false,
  emptyState,
  surface = 'MARKETPLACE',
}: OrdersPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';
  const showEmpty = isEmpty || orders.length === 0;

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="orders-page"
    >
      {/* Header (with single H1 for "My Orders") */}
      <OrdersHeader {...header} />

      {/* Control Bar: Search & Filters */}
      {(search || filters) && (
        <div className={styles.controlBar} data-testid="orders-control-bar">
          {search && (
            <div className={styles.searchWrap}>
              <OrderSearch {...search} />
            </div>
          )}

          {filters && (
            <div className={styles.filtersWrap}>
              <OrderFilters {...filters} />
            </div>
          )}
        </div>
      )}

      {/* Orders List or Empty State */}
      {showEmpty ? (
        <div className={styles.emptyWrap}>
          <OrderEmptyState {...emptyState} />
        </div>
      ) : (
        <main className={styles.ordersList} data-testid="orders-list">
          {orders.map((ord) => (
            <OrderCard
              key={ord.orderId}
              order={ord}
              actions={cardActionsProps}
            />
          ))}
        </main>
      )}
    </div>
  );
}
