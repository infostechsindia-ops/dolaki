'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartPage from '@/components/cart/CartPage';
import { CartItemData, SubstitutionPreferenceType } from '@/components/cart/CartItem';
import { API_BASE_URL } from '@/lib/config';

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSubstitutionPreference,
    formattedSubtotal,
    formattedTax,
    formattedShipping,
    formattedGrandTotal,
    subtotal,
    gst,
    deliveryFee,
    totalPrice,
    isMinimumBasketMet,
    formattedMinimumBasketShortfall,
    formattedMinimumBasketAmount,
    estimatedDeliveryEtaText,
    storeAvailabilityStatus,
    storeName,
    checkoutEligibility,
  } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [removedItem, setRemovedItem] = useState<{
    item: CartItemData;
    product: any;
  } | null>(null);
  const [undoNotification, setUndoNotification] = useState<{
    message: string;
    onUndo: () => void;
  } | null>(null);

  // Read query params on mount to load shared wishlist items
  useEffect(() => {
    const sharedItemsParam = searchParams.get('sharedItems');
    if (sharedItemsParam) {
      const itemIds = sharedItemsParam.split(',');
      itemIds.forEach(async (id) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);
          if (res.ok) {
            const product = await res.json();
            const exists = cart.some((item) => item.product.id === id);
            if (!exists) {
              addToCart({
                id: product.id,
                name: product.title || product.name || '',
                price: product.discountPrice ?? product.basePrice ?? 0,
                originalPrice: product.basePrice ?? 0,
                image: product.imageUrl || '',
                rating: product.rating ?? 4.5,
                reviewsCount: product.reviewCount ?? 12,
                category: product.category,
                brand: product.brand?.name || ''
              }, 1);
            }
          }
        } catch (e) {
          console.error('Failed to load shared item:', e);
        }
      });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, cart, addToCart]);

  const handleQuantityChange = async (id: string, newQty: number) => {
    setIsLoading(true);
    try {
      await updateQuantity(id, newQty);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubstitutionChange = async (id: string, preference: SubstitutionPreferenceType) => {
    setIsLoading(true);
    try {
      await updateSubstitutionPreference(id, preference);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    const target = cart.find((i) => i.id === id || i.product.id === id);
    if (target) {
      setRemovedItem({
        item: {
          id: target.id || target.product.id,
          title: target.product.name,
          image: target.product.image || target.product.images?.[0] || '',
          price: target.formattedUnitPrice || `$${target.product.price.toFixed(2)}`,
          quantity: target.quantity,
        },
        product: target.product,
      });

      setUndoNotification({
        message: `Removed "${target.product.name}" from cart`,
        onUndo: () => {
          if (target.product) {
            addToCart(target.product, target.quantity, target.sku, target.fulfillmentSourceId);
          }
          setUndoNotification(null);
          setRemovedItem(null);
        },
      });

      setTimeout(() => {
        setUndoNotification(null);
      }, 5000);
    }

    setIsLoading(true);
    try {
      await removeFromCart(id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!checkoutEligibility.isEligible) {
      return;
    }
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  // Convert cart items to CartItemData list
  const cartItems: CartItemData[] = cart.map((item) => {
    const isOut = item.inStock === false;
    return {
      id: item.id || item.product.id,
      title: item.product.name,
      image: item.product.image || item.product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      price: item.formattedLineTotal || `$${(item.product.price * item.quantity).toFixed(2)}`,
      compareAtPrice: item.product.originalPrice
        ? `$${(item.product.originalPrice * item.quantity).toFixed(2)}`
        : undefined,
      brand: item.product.brand,
      seller: item.product.isFlado ? 'Flado Darkstore' : 'AuraMart Warehouse',
      sku: item.sku || item.product.id,
      quantity: item.quantity,
      inStock: !isOut,
      stockStatus: item.stockStatus || (isOut ? 'OUT_OF_STOCK' : 'IN_STOCK'),
      stockMessage: isOut ? 'Out of Stock - Please remove to proceed to checkout' : undefined,
      substitutionPreference: item.substitutionPreference || 'ALLOW_SUBSTITUTION',
      isStoreUnavailable: item.isStoreUnavailable,
      availabilityReason: item.availabilityReason,
      isFlado: item.product.isFlado,
    };
  });

  const hasOutofStockItems = cart.some((i) => i.inStock === false);
  const isFladoCart = cart.some((i) => i.product.isFlado);

  // Authoritative prices rendered verbatim
  const formattedSubtotalStr = formattedSubtotal || `$${subtotal.toFixed(2)}`;
  const formattedTaxStr = formattedTax || `$${gst.toFixed(2)}`;
  const formattedShippingStr = formattedShipping || (deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`);
  const formattedGrandTotalStr = formattedGrandTotal || `$${totalPrice.toFixed(2)}`;

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <CartPage
        items={cartItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onSubstitutionChange={handleSubstitutionChange}
        isLoading={isLoading}
        hasOutofStockItems={hasOutofStockItems}
        undoNotification={undoNotification}
        surface={isFladoCart ? 'QUICK_COMMERCE' : 'MARKETPLACE'}
        isMinimumBasketMet={isMinimumBasketMet}
        formattedMinimumBasketShortfall={formattedMinimumBasketShortfall}
        formattedMinimumBasketAmount={formattedMinimumBasketAmount}
        estimatedDeliveryEtaText={estimatedDeliveryEtaText}
        storeAvailabilityStatus={storeAvailabilityStatus}
        storeName={storeName}
        summary={{
          itemCount: cartItems.length,
          priceSummary: {
            subtotal: formattedSubtotalStr,
            tax: formattedTaxStr,
            shipping: formattedShippingStr,
            grandTotal: formattedGrandTotalStr,
          },
          disabled: !checkoutEligibility.isEligible,
          onCheckout: handleProceedToCheckout,
        }}
        onContinueShopping={handleContinueShopping}
      />
    </div>
  );
}

export default function CartPageRoute() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>Loading Cart...</div>}>
      <CartContent />
    </Suspense>
  );
}
