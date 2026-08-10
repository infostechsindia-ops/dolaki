'use client';

import React from 'react';
import CheckoutProgress, { CheckoutProgressProps } from './CheckoutProgress';
import CheckoutSection from './CheckoutSection';
import ShippingAddressCard, { ShippingAddressCardProps } from './ShippingAddressCard';
import DeliveryMethodSelector, { DeliveryMethodSelectorProps } from './DeliveryMethodSelector';
import PaymentMethodSelector, { PaymentMethodSelectorProps } from './PaymentMethodSelector';
import CheckoutNotes, { CheckoutNotesProps } from './CheckoutNotes';
import OrderSummary, { OrderSummaryProps } from './OrderSummary';
import BillingSummary, { BillingSummaryProps } from './BillingSummary';
import PlaceOrderPanel, { PlaceOrderPanelProps } from './PlaceOrderPanel';
import CheckoutEmptyState, { CheckoutEmptyStateProps } from './CheckoutEmptyState';
import AddressSelector, { AddressSelectorProps } from './AddressSelector';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './CheckoutPage.module.css';

export interface CheckoutValidationErrors {
  address?: string;
  delivery?: string;
  payment?: string;
}

export interface CheckoutPageProps {
  /* Title override */
  title?: string;

  /* Step Progress */
  progress: CheckoutProgressProps;

  /* Shipping Address */
  address?: ShippingAddressCardProps;
  onEditAddress?: () => void;
  addressSelector?: AddressSelectorProps;

  /* Delivery Method */
  deliveryMethods?: DeliveryMethodSelectorProps;

  /* Payment Method */
  paymentMethods?: PaymentMethodSelectorProps;

  /* Notes */
  notes?: CheckoutNotesProps;

  /* Order Summary & Billing */
  orderSummary?: OrderSummaryProps;
  billingSummary?: BillingSummaryProps;

  /* Place Order Panel */
  placeOrder: PlaceOrderPanelProps;

  /* Empty state */
  isEmpty?: boolean;
  emptyState?: CheckoutEmptyStateProps;
  onReturnToCart?: () => void;

  /* Surface */
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';

  /* CMD-042 Checkout Preview Props */
  isLoading?: boolean;
  blockers?: string[];
  grandTotalFormatted?: string;

  /* CMD-043 Checkout UX — Inline Validation */
  /** Per-section validation errors surfaced after attempted submission */
  validationErrors?: CheckoutValidationErrors;

  /* CMD-043 Checkout UX — API Error Recovery */
  /** Non-null when the checkout preview API call failed */
  fetchError?: string;
  /** Callback to retry the failed preview API call */
  onRetry?: () => void;

  /* CMD-045 Payment Orchestration */
  isProcessingPayment?: boolean;
  paymentError?: string;
}

export default function CheckoutPage({
  title = 'Checkout Preview',
  progress,
  address,
  onEditAddress,
  addressSelector,
  deliveryMethods,
  paymentMethods,
  notes,
  orderSummary,
  billingSummary,
  placeOrder,
  isEmpty = false,
  emptyState,
  onReturnToCart,
  surface = 'MARKETPLACE',
  isLoading = false,
  blockers = [],
  grandTotalFormatted,
  validationErrors,
  fetchError,
  onRetry,
  isProcessingPayment = false,
  paymentError,
}: CheckoutPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';
  const hasBlockers = blockers.length > 0;
  const hasValidationErrors = !!(validationErrors?.address || validationErrors?.delivery || validationErrors?.payment);
  const isCheckoutDisabled = placeOrder.disabled || hasBlockers || hasValidationErrors;

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="checkout-page"
    >
      {/* Single H1 Title for Checkout Page */}
      <h1 className={styles.title}>{title}</h1>

      {/* Progress Bar */}
      <div className={styles.progressRow}>
        <CheckoutProgress {...progress} />
      </div>

      {isLoading ? (
        /* Loading Skeleton */
        <div className={styles.loadingSkeleton} data-testid="checkout-loading-skeleton">
          <div className={styles.skeletonForm}>
            <Skeleton height={120} className={styles.skeletonSection} />
            <Skeleton height={140} className={styles.skeletonSection} />
            <Skeleton height={140} className={styles.skeletonSection} />
          </div>
          <div className={styles.skeletonSidebar}>
            <Skeleton height={320} className={styles.skeletonCard} />
          </div>
        </div>
      ) : isEmpty ? (
        /* Empty State */
        <div className={styles.emptyContainer}>
          <CheckoutEmptyState
            onReturnToCart={onReturnToCart}
            {...emptyState}
          />
        </div>
      ) : (
        /* Main Layout: Form Sections (left) + Summary Sidebar (right) */
        <div className={styles.layout}>
          {/* Main Form Column */}
          <div className={styles.formColumn}>
            {/* CMD-043: API Fetch Error Banner */}
            {fetchError && (
              <div
                className={styles.fetchErrorBanner}
                role="alert"
                aria-live="polite"
                data-testid="checkout-fetch-error"
              >
                <span className={styles.fetchErrorText}>⚠️ {fetchError}</span>
                {onRetry && (
                  <button
                    type="button"
                    className={styles.retryBtn}
                    onClick={onRetry}
                    data-testid="checkout-retry-btn"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}

            {/* Blocker Alert Banner */}
            {hasBlockers && (
              <div
                className={styles.blockerAlert}
                role="alert"
                aria-live="polite"
                data-testid="checkout-blocker-alert"
              >
                <strong>⚠️ Order Review Blockers:</strong>
                <ul className={styles.blockerList}>
                  {blockers.map((blocker, i) => (
                    <li key={i}>{blocker}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 1. Shipping Address */}
            {addressSelector ? (
              <CheckoutSection
                title="Shipping Address"
                stepNumber={1}
                isComplete={!!addressSelector.selectedId && !validationErrors?.address}
                hasError={!!validationErrors?.address}
                errorMessage={validationErrors?.address}
              >
                <AddressSelector
                  {...addressSelector}
                  showCoordinates={isFlado}
                />
              </CheckoutSection>
            ) : address ? (
              <CheckoutSection
                title="Shipping Address"
                stepNumber={1}
                action={onEditAddress ? { label: 'Change', onClick: onEditAddress } : undefined}
                isComplete={!validationErrors?.address}
                hasError={!!validationErrors?.address}
                errorMessage={validationErrors?.address}
              >
                <ShippingAddressCard
                  address={'address' in address ? (address as any).address : address}
                  onEdit={onEditAddress}
                  showCoordinates={isFlado}
                />
              </CheckoutSection>
            ) : validationErrors?.address ? (
              <CheckoutSection
                title="Shipping Address"
                stepNumber={1}
                hasError
                errorMessage={validationErrors.address}
              >
                <p className={styles.sectionHint}>No address selected.</p>
              </CheckoutSection>
            ) : null}

            {/* 2. Delivery Method */}
            {deliveryMethods && (
              <CheckoutSection
                title="Delivery Method"
                stepNumber={2}
                isComplete={!!deliveryMethods.selectedId && !validationErrors?.delivery}
                hasError={!!validationErrors?.delivery}
                errorMessage={validationErrors?.delivery}
              >
                <DeliveryMethodSelector {...deliveryMethods} />
              </CheckoutSection>
            )}

            {/* 3. Payment Method */}
            {paymentMethods && (
              <CheckoutSection
                title="Payment Method"
                stepNumber={3}
                isComplete={!!paymentMethods.selectedId && !validationErrors?.payment}
                hasError={!!validationErrors?.payment}
                errorMessage={validationErrors?.payment}
              >
                <PaymentMethodSelector {...paymentMethods} />
              </CheckoutSection>
            )}

            {/* 4. Delivery Notes */}
            {notes && (
              <CheckoutSection title="Delivery Instructions">
                <CheckoutNotes {...notes} />
              </CheckoutSection>
            )}
          </div>

          {/* Summary Sidebar Column */}
          <aside
            className={styles.sidebarColumn}
            aria-label="Order Summary Sidebar"
            data-testid="checkout-sidebar"
          >
            <div className={styles.sidebarCard}>
              {orderSummary && <OrderSummary {...orderSummary} />}
              {billingSummary && <BillingSummary {...billingSummary} />}
              <PlaceOrderPanel
                termsAccepted={placeOrder.termsAccepted}
                onTermsChange={placeOrder.onTermsChange}
                onPlaceOrder={placeOrder.onPlaceOrder}
                buttonLabel={placeOrder.buttonLabel}
                termsText={placeOrder.termsText}
                disabled={isCheckoutDisabled}
                surface={surface}
                isProcessingPayment={isProcessingPayment}
                paymentError={paymentError}
              />
            </div>
          </aside>
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      {!isEmpty && !isLoading && (
        <div
          className={`${styles.mobileStickyBar} ${isFlado ? styles.fladoSticky : ''}`}
          data-testid="mobile-checkout-sticky-bar"
        >
          <div className={styles.mobilePriceInfo}>
            <span className={styles.mobileTotalLabel}>Payable Total</span>
            <span className={styles.mobileGrandTotal} data-testid="mobile-checkout-grand-total">
              {grandTotalFormatted || billingSummary?.grandTotal || '$0.00'}
            </span>
          </div>
          <button
            type="button"
            className={`${styles.mobileCheckoutBtn} ${isFlado ? styles.fladoCheckoutBtn : ''}`}
            onClick={placeOrder.onPlaceOrder}
            disabled={isCheckoutDisabled || !placeOrder.termsAccepted}
            data-testid="mobile-place-order-btn"
          >
            {placeOrder.buttonLabel || 'Review Order'}
          </button>
        </div>
      )}
    </div>
  );
}
