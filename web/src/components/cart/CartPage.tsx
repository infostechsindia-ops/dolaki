'use client';

import React from 'react';
import CartHeader, { CartHeaderProps } from './CartHeader';
import CartItem, { CartItemData, SubstitutionPreferenceType } from './CartItem';
import CartEmptyState, { CartEmptyStateProps } from './CartEmptyState';
import CartSummary, { CartSummaryProps } from './CartSummary';
import SavedForLaterSection from './SavedForLaterSection';
import { ProductCardData } from '@/components/ProductCard';
import styles from './CartPage.module.css';

import { Skeleton } from '@/components/ui/Skeleton';

export interface FulfillmentGroup {
  label: string;
  items: CartItemData[];
}

export interface CartPageProps {
  /* Header */
  header?: Partial<CartHeaderProps>;

  /* Items */
  items: CartItemData[];
  onQuantityChange?: (id: string, newQty: number) => void;
  onRemoveItem?: (id: string) => void;
  onMoveToSaved?: (id: string) => void;
  onWishlist?: (id: string) => void;
  onSubstitutionChange?: (id: string, preference: SubstitutionPreferenceType) => void;

  /* Fulfillment grouping */
  fulfillmentGroups?: FulfillmentGroup[];

  /* Cart Summary */
  summary: CartSummaryProps;

  /* Saved for later */
  savedProducts?: ProductCardData[];
  onMoveToCart?: (id: string) => void;
  onRemoveFromSaved?: (id: string) => void;

  /* Empty State overrides */
  emptyState?: CartEmptyStateProps;

  /* Theme surface */
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';

  /* Callbacks */
  onContinueShopping?: () => void;

  /* CMD-040 & CMD-041 UX Enhancements */
  isLoading?: boolean;
  hasOutofStockItems?: boolean;
  undoNotification?: { message: string; onUndo: () => void } | null;
  onCheckout?: () => void;

  /* CMD-041 Quick Cart Properties */
  isMinimumBasketMet?: boolean;
  formattedMinimumBasketShortfall?: string | null;
  formattedMinimumBasketAmount?: string | null;
  estimatedDeliveryEtaText?: string | null;
  storeAvailabilityStatus?: 'OPEN' | 'CLOSED' | 'UNAVAILABLE' | 'SERVICED';
  storeName?: string | null;
}

export default function CartPage({
  header,
  items = [],
  onQuantityChange,
  onRemoveItem,
  onMoveToSaved,
  onWishlist,
  onSubstitutionChange,
  fulfillmentGroups,
  summary,
  savedProducts = [],
  onMoveToCart,
  onRemoveFromSaved,
  emptyState,
  surface = 'MARKETPLACE',
  onContinueShopping,
  isLoading = false,
  hasOutofStockItems = false,
  undoNotification,
  onCheckout,
  isMinimumBasketMet = true,
  formattedMinimumBasketShortfall,
  formattedMinimumBasketAmount,
  estimatedDeliveryEtaText,
  storeAvailabilityStatus = 'OPEN',
  storeName,
}: CartPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';
  const isEmpty = items.length === 0;
  const isStoreClosed = storeAvailabilityStatus === 'CLOSED';
  const isCheckoutDisabled =
    summary.disabled || hasOutofStockItems || !isMinimumBasketMet || isStoreClosed || items.length === 0;

  // Auto-group items by seller / fulfillment if not explicitly passed
  const groupsToRender: FulfillmentGroup[] =
    fulfillmentGroups ||
    (() => {
      const groupsMap = new Map<string, CartItemData[]>();
      items.forEach((item) => {
        const groupKey = item.seller || (item.fulfillmentLabel ? item.fulfillmentLabel : 'Standard Fulfillment');
        if (!groupsMap.has(groupKey)) {
          groupsMap.set(groupKey, []);
        }
        groupsMap.get(groupKey)!.push(item);
      });
      return Array.from(groupsMap.entries()).map(([label, groupItems]) => ({
        label,
        items: groupItems,
      }));
    })();

  // Enhance deliveryInfo with authoritative ETA if provided
  const enhancedSummaryProps: CartSummaryProps = {
    ...summary,
    deliveryInfo: summary.deliveryInfo || estimatedDeliveryEtaText
      ? {
          deliveryMessage: estimatedDeliveryEtaText
            ? `Estimated Delivery: ${estimatedDeliveryEtaText}`
            : summary.deliveryInfo?.deliveryMessage,
          shippingText: summary.deliveryInfo?.shippingText,
          returnPolicyText: summary.deliveryInfo?.returnPolicyText,
        }
      : summary.deliveryInfo,
  };

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="cart-page"
    >
      {/* Header */}
      <CartHeader
        itemCount={items.length}
        onContinueShopping={onContinueShopping}
        {...header}
      />

      {/* Undo Toast Notification */}
      {undoNotification && (
        <div
          className={styles.undoNotification}
          role="status"
          aria-live="polite"
          data-testid="cart-undo-toast"
        >
          <span>{undoNotification.message}</span>
          <button
            type="button"
            className={styles.undoBtn}
            onClick={undoNotification.onUndo}
            data-testid="undo-remove-btn"
          >
            Undo
          </button>
        </div>
      )}

      {isLoading ? (
        /* Loading Skeleton UX */
        <div className={styles.loadingSkeleton} data-testid="cart-loading-skeleton">
          <div className={styles.skeletonItems}>
            <Skeleton height={140} className={styles.skeletonCard} />
            <Skeleton height={140} className={styles.skeletonCard} />
          </div>
          <div className={styles.skeletonSidebar}>
            <Skeleton height={320} className={styles.skeletonSummary} />
          </div>
        </div>
      ) : isEmpty ? (
        /* Empty State */
        <div className={styles.emptyContainer}>
          <CartEmptyState
            onContinueShopping={onContinueShopping}
            {...emptyState}
          />
        </div>
      ) : (
        /* Main Layout: Cart Items (left) + Summary Sidebar (right) */
        <div className={styles.layout}>
          <div className={styles.itemsColumn}>
            {/* Store Closed Warning Banner */}
            {isStoreClosed && (
              <div
                className={styles.storeClosedAlert}
                role="alert"
                aria-live="polite"
                data-testid="store-closed-alert"
              >
                <span>
                  🏬 {storeName ? `Store "${storeName}"` : 'Fulfillment store'} is currently closed. Items cannot be processed until the store re-opens.
                </span>
              </div>
            )}

            {/* Minimum Basket Warning Alert */}
            {!isMinimumBasketMet && (
              <div
                className={styles.minimumBasketAlert}
                role="alert"
                aria-live="polite"
                data-testid="minimum-basket-alert"
              >
                <span>
                  🛒 Minimum order requirement not met
                  {formattedMinimumBasketShortfall
                    ? `. Add ${formattedMinimumBasketShortfall} more worth of items to checkout`
                    : formattedMinimumBasketAmount
                    ? ` (Minimum order value: ${formattedMinimumBasketAmount})`
                    : ''}
                  .
                </span>
              </div>
            )}

            {/* Global Out-of-Stock Revalidation Alert */}
            {hasOutofStockItems && (
              <div
                className={styles.outOfStockAlert}
                role="alert"
                aria-live="polite"
                data-testid="cart-out-of-stock-alert"
              >
                <span>
                  ⚠️ Some items in your cart are currently out of stock. Please remove unavailable items to proceed to checkout.
                </span>
              </div>
            )}

            {/* Grouped Fulfillment Lists */}
            {groupsToRender.map((group, groupIdx) => (
              <div key={groupIdx} className={styles.fulfillmentGroup} data-testid="fulfillment-group">
                {groupsToRender.length > 1 && (
                  <h3 className={styles.groupHeading}>{group.label}</h3>
                )}
                <ul className={styles.itemList} aria-label={`Cart items - ${group.label}`}>
                  {group.items.map((item) => (
                    <li key={item.id} className={styles.itemRow}>
                      <CartItem
                        item={item}
                        onQuantityChange={onQuantityChange}
                        onRemove={onRemoveItem}
                        onMoveToSaved={onMoveToSaved}
                        onWishlist={onWishlist}
                        onSubstitutionChange={onSubstitutionChange}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.summaryColumn}>
            <CartSummary
              {...enhancedSummaryProps}
              itemCount={items.length}
              disabled={isCheckoutDisabled}
              onCheckout={onCheckout || summary.onCheckout}
              surface={surface}
            />
          </div>
        </div>
      )}

      {/* Saved for Later Section */}
      {savedProducts.length > 0 && (
        <div className={styles.savedSection}>
          <SavedForLaterSection
            products={savedProducts}
            onMoveToCart={onMoveToCart}
            onRemoveFromSaved={onRemoveFromSaved}
            surface={surface}
          />
        </div>
      )}

      {/* Mobile Sticky Checkout CTA Bar */}
      {!isEmpty && !isLoading && (
        <div
          className={`${styles.mobileStickyBar} ${isFlado ? styles.fladoSticky : ''}`}
          data-testid="mobile-sticky-checkout-bar"
        >
          <div className={styles.mobilePriceInfo}>
            <span className={styles.mobileTotalLabel}>Total Amount</span>
            <span className={styles.mobileGrandTotal} data-testid="mobile-grand-total">
              {summary.priceSummary.grandTotal}
            </span>
          </div>
          <button
            type="button"
            className={`${styles.mobileCheckoutBtn} ${isFlado ? styles.fladoCheckoutBtn : ''}`}
            onClick={onCheckout || summary.onCheckout}
            disabled={isCheckoutDisabled}
            data-testid="mobile-proceed-checkout-btn"
          >
            {summary.checkoutLabel || 'Proceed to Checkout'}
          </button>
        </div>
      )}
    </div>
  );
}
