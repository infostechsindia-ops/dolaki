'use client';

import React from 'react';
import ProductBreadcrumbs from './ProductBreadcrumbs';
import ProductGallery, { ProductImage } from './ProductGallery';
import ProductInfo, { ProductInfoProps } from './ProductInfo';
import ProductPrice, { ProductPriceProps } from './ProductPrice';
import ProductActions, { ProductActionsProps } from './ProductActions';
import ProductHighlights from './ProductHighlights';
import ProductSpecifications, { SpecItem } from './ProductSpecifications';
import ProductDeliveryInfo, { ProductDeliveryInfoProps } from './ProductDeliveryInfo';
import ProductSellerInfo, { ProductSellerInfoProps } from './ProductSellerInfo';
import ProductReviewsSummary, { ProductReviewsSummaryProps } from './ProductReviewsSummary';
import RelatedProductsSection from './RelatedProductsSection';
import VariantSelector, { VariantOption } from './VariantSelector';
import { BreadcrumbItem } from '@/components/category/CategoryBreadcrumbs';
import { ProductCardData } from '@/components/ProductCard';
import styles from './ProductDetailPage.module.css';

export interface ProductDetailPageProps {
  /* Breadcrumbs */
  breadcrumbItems: BreadcrumbItem[];

  /* Gallery */
  images: ProductImage[];
  selectedImageIndex?: number;
  onSelectImage?: (idx: number) => void;
  onZoomClick?: () => void;

  /* Product Main Info */
  info: ProductInfoProps;

  /* Price */
  price: ProductPriceProps;

  /* Actions */
  actions: ProductActionsProps;

  /* Variant Selector */
  variantOptions?: VariantOption[];
  onVariantSelect?: (optionId: string, valueId: string) => void;

  /* Highlights & Specs */
  highlights?: string[];
  specs?: SpecItem[];

  /* Delivery & Seller */
  deliveryInfo?: ProductDeliveryInfoProps;
  sellerInfo?: ProductSellerInfoProps;

  /* Reviews Summary */
  reviewsSummary?: ProductReviewsSummaryProps;

  /* Related Products */
  relatedProducts?: ProductCardData[];

  /* Sticky Mobile Bar */
  showStickyBar?: boolean;

  /* Theme surface */
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProductDetailPage({
  breadcrumbItems,
  images,
  selectedImageIndex = 0,
  onSelectImage,
  onZoomClick,
  info,
  price,
  actions,
  variantOptions,
  onVariantSelect,
  highlights = [],
  specs = [],
  deliveryInfo,
  sellerInfo,
  reviewsSummary,
  relatedProducts = [],
  showStickyBar = true,
  surface = 'MARKETPLACE',
}: ProductDetailPageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="product-detail-page"
    >
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbRow}>
        <ProductBreadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section: Gallery (left) + Product Info & Actions (right) */}
      <div className={styles.heroSection}>
        <div className={styles.galleryColumn}>
          <ProductGallery
            images={images}
            selectedIndex={selectedImageIndex}
            onSelectImage={onSelectImage}
            onZoomClick={onZoomClick}
          />
        </div>

        <div className={styles.infoColumn}>
          <ProductInfo {...info} />
          <ProductPrice {...price} surface={surface} />

          {variantOptions && variantOptions.length > 0 && (
            <VariantSelector
              options={variantOptions}
              onSelect={onVariantSelect}
            />
          )}

          <ProductActions {...actions} surface={surface} />

          {deliveryInfo && <ProductDeliveryInfo {...deliveryInfo} />}
          {sellerInfo && <ProductSellerInfo {...sellerInfo} />}
        </div>
      </div>

      {/* Details Section: Highlights & Specifications */}
      {(highlights.length > 0 || specs.length > 0) && (
        <div className={styles.detailsSection}>
          {highlights.length > 0 && (
            <div className={styles.detailBlock}>
              <ProductHighlights highlights={highlights} />
            </div>
          )}
          {specs.length > 0 && (
            <div className={styles.detailBlock}>
              <ProductSpecifications specs={specs} />
            </div>
          )}
        </div>
      )}

      {/* Reviews Summary */}
      {reviewsSummary && (
        <div className={styles.reviewsSection}>
          <ProductReviewsSummary {...reviewsSummary} />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <RelatedProductsSection
            products={relatedProducts}
            surface={surface}
          />
        </div>
      )}

      {/* Sticky Mobile Purchase Action Bar */}
      {showStickyBar && (
        <div
          className={`${styles.stickyBar} ${isFlado ? styles.fladoSticky : ''}`}
          data-testid="sticky-mobile-purchase-bar"
        >
          <div className={styles.stickyPriceGroup}>
            <span className={styles.stickyPrice} data-testid="sticky-price">
              {price.formattedPrice}
            </span>
            {price.formattedCompareAtPrice && (
              <span className={styles.stickyCompareAt}>
                {price.formattedCompareAtPrice}
              </span>
            )}
          </div>
          <div className={styles.stickyBtnGroup}>
            <button
              type="button"
              className={`${styles.stickyCartBtn} ${isFlado ? styles.fladoCartBtn : ''}`}
              onClick={actions.onAddToCart}
              disabled={actions.disabled}
              aria-label={actions.addToCartLabel || 'Add to Cart'}
              data-testid="sticky-add-to-cart-btn"
            >
              {actions.addToCartLabel || 'Add to Cart'}
            </button>
            <button
              type="button"
              className={`${styles.stickyBuyBtn} ${isFlado ? styles.fladoBuyBtn : ''}`}
              onClick={actions.onBuyNow}
              disabled={actions.disabled}
              aria-label={actions.buyNowLabel || 'Buy Now'}
              data-testid="sticky-buy-now-btn"
            >
              {actions.buyNowLabel || 'Buy Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
