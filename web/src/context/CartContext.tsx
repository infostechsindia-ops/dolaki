'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewsCount?: number;
  category?: string;
  brand?: string;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  id?: string;
  sku?: string;
  variantId?: string;
  fulfillmentSourceId?: string;
  unitPrice?: number;
  formattedUnitPrice?: string;
  lineTotal?: number;
  formattedLineTotal?: string;
  inStock?: boolean;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  substitutionPreference?: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';
  isStoreUnavailable?: boolean;
  availabilityReason?: string;
}

export interface CheckoutEligibilityResult {
  isEligible: boolean;
  blockers: string[];
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, sku?: string, fulfillmentSourceId?: string) => Promise<void> | void;
  removeFromCart: (productIdOrItemId: string) => Promise<void> | void;
  updateQuantity: (productIdOrItemId: string, quantity: number) => Promise<void> | void;
  updateSubstitutionPreference: (itemId: string, preference: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION') => Promise<void>;
  clearCart: () => Promise<void> | void;
  mergeGuestCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  formattedSubtotal?: string;
  gst: number;
  formattedTax?: string;
  deliveryFee: number;
  formattedShipping?: string;
  totalPrice: number;
  formattedGrandTotal?: string;
  fladoItems: CartItem[];
  standardItems: CartItem[];
  isServerCart: boolean;

  // CMD-041 Quick Cart Properties
  minimumBasketAmount?: number | null;
  formattedMinimumBasketAmount?: string | null;
  isMinimumBasketMet: boolean;
  minimumBasketShortfall?: number | null;
  formattedMinimumBasketShortfall?: string | null;
  estimatedDeliveryEtaText?: string | null;
  deliveryBadgeText?: string | null;
  storeAvailabilityStatus: 'OPEN' | 'CLOSED' | 'UNAVAILABLE' | 'SERVICED';
  storeName?: string | null;
  checkoutEligibility: CheckoutEligibilityResult;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'auramart_cart';
const AUTH_TOKEN_KEY = 'aura_token';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isServerCart, setIsServerCart] = useState<boolean>(false);
  const [serverSummary, setServerSummary] = useState<{
    subtotal?: number;
    formattedSubtotal?: string;
    tax?: number;
    formattedTax?: string;
    shipping?: number;
    formattedShipping?: string;
    grandTotal?: number;
    formattedGrandTotal?: string;
    minimumBasketAmount?: number | null;
    formattedMinimumBasketAmount?: string | null;
    isMinimumBasketMet?: boolean;
    minimumBasketShortfall?: number | null;
    formattedMinimumBasketShortfall?: string | null;
    estimatedDeliveryEtaText?: string | null;
    deliveryBadgeText?: string | null;
    storeAvailabilityStatus?: 'OPEN' | 'CLOSED' | 'UNAVAILABLE' | 'SERVICED';
    storeName?: string | null;
    checkoutEligibility?: CheckoutEligibilityResult;
  }>({});

  // Helper to fetch server cart
  const fetchServerCart = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/v1/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setIsServerCart(true);
        setServerSummary({
          subtotal: data.subtotal,
          formattedSubtotal: data.formattedSubtotal,
          tax: data.tax,
          formattedTax: data.formattedTax,
          shipping: data.shipping,
          formattedShipping: data.formattedShipping,
          grandTotal: data.grandTotal,
          formattedGrandTotal: data.formattedGrandTotal,
          minimumBasketAmount: data.minimumBasketAmount,
          formattedMinimumBasketAmount: data.formattedMinimumBasketAmount,
          isMinimumBasketMet: data.isMinimumBasketMet ?? true,
          minimumBasketShortfall: data.minimumBasketShortfall,
          formattedMinimumBasketShortfall: data.formattedMinimumBasketShortfall,
          estimatedDeliveryEtaText: data.estimatedDeliveryEtaText,
          deliveryBadgeText: data.deliveryBadgeText,
          storeAvailabilityStatus: data.storeAvailabilityStatus || 'OPEN',
          storeName: data.storeName,
          checkoutEligibility: data.checkoutEligibility || { isEligible: true, blockers: [] },
        });

        // Map server items to CartItem format
        const mappedItems: CartItem[] = (data.items || []).map((item: any) => ({
          id: item.id,
          sku: item.sku,
          variantId: item.variantId,
          fulfillmentSourceId: item.fulfillmentSourceId,
          unitPrice: item.unitPrice,
          formattedUnitPrice: item.formattedUnitPrice,
          lineTotal: item.lineTotal,
          formattedLineTotal: item.formattedLineTotal,
          inStock: item.inStock,
          stockStatus: item.stockStatus,
          substitutionPreference: item.substitutionPreference || 'ALLOW_SUBSTITUTION',
          isStoreUnavailable: item.isStoreUnavailable,
          availabilityReason: item.availabilityReason,
          quantity: item.quantity,
          product: {
            id: item.productId || item.sku || item.id,
            name: item.title,
            description: item.title,
            price: item.unitPrice ? item.unitPrice / 100 : 0,
            originalPrice: item.compareAtPrice ? item.compareAtPrice / 100 : undefined,
            category: 'general',
            subCategory: 'general',
            brand: 'AuraMart',
            generalStock: 10,
            specifications: {},
            image: item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            rating: 4.5,
            reviewsCount: 10,
            isFlado: !!item.isFlado,
          },
        }));

        setCart(mappedItems);
        return true;
      }
    } catch (e) {
      console.warn('Failed to fetch server cart:', e);
    }
    return false;
  }, []);

  // Merge local guest cart to server
  const mergeGuestCart = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    const savedCart = localStorage.getItem(GUEST_CART_KEY);
    if (!savedCart) {
      await fetchServerCart(token);
      return;
    }

    try {
      const guestItems: CartItem[] = JSON.parse(savedCart);
      if (guestItems.length > 0) {
        const payload = {
          items: guestItems.map((item) => ({
            sku: item.sku || item.product?.id || 'SKU-UNKNOWN',
            quantity: item.quantity,
            fulfillmentSourceId: item.fulfillmentSourceId,
            variantId: item.variantId,
            productId: item.product?.id,
          })),
        };

        const res = await fetch('/api/v1/cart/merge', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          localStorage.removeItem(GUEST_CART_KEY);
          await fetchServerCart(token);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to merge guest cart:', e);
    }

    await fetchServerCart(token);
  }, [fetchServerCart]);

  // Initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      mergeGuestCart();
    } else {
      setIsServerCart(false);
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse local guest cart data', e);
        }
      }
    }
  }, [mergeGuestCart]);

  // Save guest cart to localStorage when unauthenticated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isServerCart) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isServerCart]);

  const addToCart = async (
    product: Product,
    quantity: number = 1,
    sku?: string,
    fulfillmentSourceId?: string
  ) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const res = await fetch('/api/v1/cart/items', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sku: sku || product.id,
              quantity,
              fulfillmentSourceId,
              productId: product.id,
            }),
          });
          if (res.ok) {
            await fetchServerCart(token);
            return;
          }
        } catch (e) {
          console.warn('Server AddToCart failed, falling back to local state:', e);
        }
      }
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      return [
        ...prevCart,
        {
          product,
          quantity,
          sku: sku || product.id,
          fulfillmentSourceId,
          substitutionPreference: 'ALLOW_SUBSTITUTION',
        },
      ];
    });
  };

  const removeFromCart = async (productIdOrItemId: string) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && isServerCart) {
        try {
          const res = await fetch(`/api/v1/cart/items/${productIdOrItemId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            await fetchServerCart(token);
            return;
          }
        } catch (e) {
          console.warn('Server RemoveFromCart failed:', e);
        }
      }
    }

    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productIdOrItemId && item.id !== productIdOrItemId)
    );
  };

  const updateQuantity = async (productIdOrItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productIdOrItemId);
      return;
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && isServerCart) {
        try {
          const res = await fetch(`/api/v1/cart/items/${productIdOrItemId}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
          });
          if (res.ok) {
            await fetchServerCart(token);
            return;
          }
        } catch (e) {
          console.warn('Server UpdateQuantity failed:', e);
        }
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productIdOrItemId || item.id === productIdOrItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateSubstitutionPreference = async (
    itemId: string,
    preference: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION'
  ) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && isServerCart) {
        try {
          const res = await fetch(`/api/v1/cart/items/${itemId}/substitution`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ preference }),
          });
          if (res.ok) {
            await fetchServerCart(token);
            return;
          }
        } catch (e) {
          console.warn('Server UpdateSubstitution failed:', e);
        }
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId || item.product.id === itemId
          ? { ...item, substitutionPreference: preference }
          : item
      )
    );
  };

  const clearCart = async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && isServerCart) {
        try {
          const res = await fetch('/api/v1/cart', {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            await fetchServerCart(token);
            return;
          }
        } catch (e) {
          console.warn('Server ClearCart failed:', e);
        }
      }
    }

    setCart([]);
  };

  const fladoItems = cart.filter((item) => item.product.isFlado);
  const standardItems = cart.filter((item) => !item.product.isFlado);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal =
    serverSummary.subtotal !== undefined
      ? serverSummary.subtotal / 100
      : cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const gst =
    serverSummary.tax !== undefined
      ? serverSummary.tax / 100
      : Math.round(subtotal * 0.18);

  const deliveryFee =
    serverSummary.shipping !== undefined
      ? serverSummary.shipping / 100
      : cart.length === 0
      ? 0
      : (fladoItems.length > 0 ? 25 : 0) + (standardItems.length > 0 && subtotal < 500 ? 40 : 0);

  const totalPrice =
    serverSummary.grandTotal !== undefined
      ? serverSummary.grandTotal / 100
      : subtotal + gst + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSubstitutionPreference,
        clearCart,
        mergeGuestCart,
        refreshCart: async () => {
          const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
          if (token) await fetchServerCart(token);
        },
        totalItems,
        subtotal,
        formattedSubtotal: serverSummary.formattedSubtotal,
        gst,
        formattedTax: serverSummary.formattedTax,
        deliveryFee,
        formattedShipping: serverSummary.formattedShipping,
        totalPrice,
        formattedGrandTotal: serverSummary.formattedGrandTotal,
        fladoItems,
        standardItems,
        isServerCart,

        minimumBasketAmount: serverSummary.minimumBasketAmount,
        formattedMinimumBasketAmount: serverSummary.formattedMinimumBasketAmount,
        isMinimumBasketMet: serverSummary.isMinimumBasketMet ?? true,
        minimumBasketShortfall: serverSummary.minimumBasketShortfall,
        formattedMinimumBasketShortfall: serverSummary.formattedMinimumBasketShortfall,
        estimatedDeliveryEtaText: serverSummary.estimatedDeliveryEtaText,
        deliveryBadgeText: serverSummary.deliveryBadgeText,
        storeAvailabilityStatus: serverSummary.storeAvailabilityStatus || 'OPEN',
        storeName: serverSummary.storeName,
        checkoutEligibility: serverSummary.checkoutEligibility || { isEligible: true, blockers: [] },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
