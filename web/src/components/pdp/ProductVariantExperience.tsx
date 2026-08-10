'use client';

import React, { useState } from 'react';
import ProductDetailPage, { ProductDetailPageProps } from './ProductDetailPage';
import VariantSelector, { VariantOption } from './VariantSelector';
import { VariantCombination } from './VariantMatrix';
import { useVariantSelection } from './useVariantSelection';
import styles from './ProductVariantExperience.module.css';

export interface ProductVariantExperienceProps extends Omit<ProductDetailPageProps, 'actions'> {
  /** Master variant option definitions (e.g. Color, Size) */
  variantOptions?: VariantOption[];
  /** Authoritative variant combination matrix */
  variantCombinations?: VariantCombination[];
  /** Optional initial selected variant combination ID */
  defaultVariantId?: string;

  /** Actions props */
  actions: Omit<ProductDetailPageProps['actions'], 'onAddToCart' | 'onBuyNow'> & {
    onAddToCart?: (combination: VariantCombination | null) => void;
    onBuyNow?: (combination: VariantCombination | null) => void;
  };
}

export default function ProductVariantExperience({
  variantOptions = [],
  variantCombinations = [],
  defaultVariantId,
  images: initialImages,
  info: initialInfo,
  price: initialPrice,
  deliveryInfo: initialDeliveryInfo,
  actions,
  surface = 'MARKETPLACE',
  ...restPdpProps
}: ProductVariantExperienceProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    selectOption,
    resolution,
    processedOptions,
    validateBeforeCart,
  } = useVariantSelection({
    options: variantOptions,
    combinations: variantCombinations,
    defaultCombinationId: defaultVariantId,
  });

  const matching = resolution.matchingCombination;

  // Resolve dynamic PDP reactive props based on active variant combination
  const activeImages = matching?.images && matching.images.length > 0
    ? matching.images
    : initialImages;

  const activeSku = matching?.sku || initialInfo.sku;

  const activePrice = matching
    ? {
        formattedPrice: matching.formattedPrice,
        formattedCompareAtPrice: matching.formattedCompareAtPrice,
        discountPercent: matching.discountPercent,
        formattedUnitPrice: matching.formattedUnitPrice,
        unitLabel: matching.unitLabel,
      }
    : initialPrice;

  const activeDeliveryInfo = initialDeliveryInfo
    ? {
        ...initialDeliveryInfo,
        badgeText: matching?.deliveryBadgeText || initialDeliveryInfo.badgeText,
        estimatedDeliveryText: matching?.estimatedDeliveryText || initialDeliveryInfo.estimatedDeliveryText,
      }
    : matching?.estimatedDeliveryText || matching?.deliveryBadgeText
    ? {
        badgeText: matching.deliveryBadgeText,
        estimatedDeliveryText: matching.estimatedDeliveryText,
      }
    : undefined;

  const inStock = matching ? matching.inStock : true;
  const stockBadgeText = matching?.stockBadgeText || (inStock ? 'In Stock' : 'Out of Stock');

  // Intercept Add to Cart with validation guard
  const handleAddToCart = () => {
    const { valid, reason, combination } = validateBeforeCart();
    if (!valid) {
      setValidationError(reason || 'Invalid selection.');
      return;
    }
    setValidationError(null);
    actions.onAddToCart?.(combination);
  };

  // Intercept Buy Now with validation guard
  const handleBuyNow = () => {
    const { valid, reason, combination } = validateBeforeCart();
    if (!valid) {
      setValidationError(reason || 'Invalid selection.');
      return;
    }
    setValidationError(null);
    actions.onBuyNow?.(combination);
  };

  return (
    <div
      className={styles.root}
      data-surface={surface === 'QUICK_COMMERCE' ? 'quick-commerce' : 'marketplace'}
      data-testid="variant-experience"
    >
      {/* Optional validation alert message */}
      {validationError && (
        <div
          className={styles.validationError}
          role="alert"
          data-testid="variant-validation-error"
        >
          {validationError}
        </div>
      )}

      {/* PDP Layout composition */}
      <ProductDetailPage
        {...restPdpProps}
        surface={surface}
        images={activeImages}
        info={{
          ...initialInfo,
          sku: activeSku,
        }}
        price={activePrice}
        deliveryInfo={activeDeliveryInfo}
        variantOptions={processedOptions}
        onVariantSelect={selectOption}
        actions={{
          ...actions,
          inStock,
          disabled: !inStock,
          stockBadgeText,
          onAddToCart: handleAddToCart,
          onBuyNow: handleBuyNow,
        }}
      />
    </div>
  );
}
