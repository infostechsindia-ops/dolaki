import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../utils/mockData';
import { apiClient } from '../api/client';
import { useAuthContext } from './AuthContext';

export type SubstitutionPreferenceType = 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';

export interface CartItem {
  itemId: string; // combination of id, color, size
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  variantId?: string;
  sku?: string;
  fulfillmentSourceId?: string;
  substitutionPreference?: SubstitutionPreferenceType;
}

export interface FormattedCartItem {
  id: string;
  cartId: string;
  sku: string;
  variantId?: string;
  productId?: string;
  title: string;
  image?: string;
  quantity: number;
  fulfillmentSourceId?: string;
  unitPrice: number;
  formattedUnitPrice: string;
  formattedCompareAtPrice?: string;
  lineTotal: number;
  formattedLineTotal: string;
  inStock: boolean;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isFlado?: boolean;
  substitutionPreference: SubstitutionPreferenceType;
  isStoreUnavailable?: boolean;
  availabilityReason?: string;
}

export interface CheckoutEligibilityResult {
  isEligible: boolean;
  blockers: string[];
}

export interface CartResponseDto {
  cartId: string;
  customerId: string;
  status: string;
  items: FormattedCartItem[];
  totalItems: number;
  subtotal: number;
  formattedSubtotal: string;
  tax: number;
  formattedTax: string;
  shipping: number;
  formattedShipping: string;
  discount: number;
  formattedDiscount: string;
  grandTotal: number;
  formattedGrandTotal: string;
  hasOutofStockItems: boolean;
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

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  deliveryFee: number;
  total: number;
  date: string;
  address: string;
  status: 'placed' | 'packing' | 'shipping' | 'out_for_delivery' | 'delivered';
  eta: string;
  isFlado: boolean;
}

interface CartContextType {
  cart: CartItem[];
  authoritativeCart: CartResponseDto | null;
  isLoadingCart: boolean;
  cartError: string | null;
  fetchAuthoritativeCart: () => Promise<CartResponseDto | null>;
  updateCartItemQuantity: (itemId: string, quantity: number) => Promise<CartResponseDto | null>;
  removeCartItem: (itemId: string) => Promise<CartResponseDto | null>;
  updateSubstitutionPreference: (itemId: string, preference: SubstitutionPreferenceType) => Promise<CartResponseDto | null>;
  rewardWalletBalance: number;
  creditRewardWallet: (amount: number) => void;
  deductRewardWallet: (amount: number) => void;
  addresses: string[];
  selectedAddress: string;
  addAddress: (address: string) => void;
  setSelectedAddress: (address: string) => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (isFladoOnly?: boolean) => Promise<string>;
  couponDiscount: number;
  setCouponDiscount: (discount: number) => void;
  calculations: {
    auraMartSubtotal: number;
    fladoSubtotal: number;
    subtotal: number;
    gst: number;
    auraMartDelivery: number;
    fladoDelivery: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_ADDRESSES = [
  "Flat 405, Block B, Prestige Shantiniketan, Whitefield, Bengaluru - 560048",
  "H-12, Sector 62, Noida, Uttar Pradesh - 201301",
  "120, Mount Road, Teynampet, Chennai - 600018"
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authoritativeCart, setAuthoritativeCart] = useState<CartResponseDto | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const [rewardWalletBalance, setRewardWalletBalance] = useState<number>(500);
  const [addresses, setAddresses] = useState<string[]>(DEFAULT_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<string>(DEFAULT_ADDRESSES[0]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Fetch Authoritative Cart from Backend
  const fetchAuthoritativeCart = useCallback(async (): Promise<CartResponseDto | null> => {
    if (!isAuthenticated) return null;
    setIsLoadingCart(true);
    setCartError(null);
    try {
      const data: CartResponseDto = await apiClient('/cart');
      setAuthoritativeCart(data);
      return data;
    } catch (err: any) {
      console.log('Authoritative cart fetch notice:', err?.message);
      setCartError(err?.message || 'Failed to load cart');
      return null;
    } finally {
      setIsLoadingCart(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAuthoritativeCart();
    }
  }, [isAuthenticated, fetchAuthoritativeCart]);

  // Load initial state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('@auramart_cart');
        const storedWallet = await AsyncStorage.getItem('@auramart_wallet');
        const storedAddresses = await AsyncStorage.getItem('@auramart_addresses');
        const storedSelectedAddress = await AsyncStorage.getItem('@auramart_selected_address');
        const storedOrders = await AsyncStorage.getItem('@auramart_orders');

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedWallet) setRewardWalletBalance(Number(storedWallet));
        if (storedAddresses) setAddresses(JSON.parse(storedAddresses));
        if (storedSelectedAddress) setSelectedAddress(storedSelectedAddress);
        if (storedOrders) setOrders(JSON.parse(storedOrders));
      } catch (e) {
        console.error("Failed to load cart state from storage:", e);
      }
    };
    loadState();
  }, []);

  // Save updates to AsyncStorage
  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('@auramart_cart', JSON.stringify(newCart));
    } catch (e) { console.error(e); }
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartResponseDto | null> => {
    if (quantity <= 0) {
      return removeCartItem(itemId);
    }
    if (!isAuthenticated) {
      updateQuantity(itemId, quantity);
      return null;
    }
    try {
      const data: CartResponseDto = await apiClient(`/cart/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
      setAuthoritativeCart(data);
      return data;
    } catch (err: any) {
      console.error('Failed to update cart item quantity:', err);
      return null;
    }
  };

  const removeCartItem = async (itemId: string): Promise<CartResponseDto | null> => {
    if (!isAuthenticated) {
      removeFromCart(itemId);
      return null;
    }
    try {
      const data: CartResponseDto = await apiClient(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      setAuthoritativeCart(data);
      return data;
    } catch (err: any) {
      console.error('Failed to remove cart item:', err);
      return null;
    }
  };

  const updateSubstitutionPreference = async (
    itemId: string,
    preference: SubstitutionPreferenceType
  ): Promise<CartResponseDto | null> => {
    if (!isAuthenticated) return null;
    try {
      const data: CartResponseDto = await apiClient(`/cart/items/${itemId}/substitution`, {
        method: 'PATCH',
        body: JSON.stringify({ preference }),
      });
      setAuthoritativeCart(data);
      return data;
    } catch (err: any) {
      console.error('Failed to update substitution preference:', err);
      return null;
    }
  };

  const creditRewardWallet = async (amount: number) => {
    const newVal = rewardWalletBalance + amount;
    setRewardWalletBalance(newVal);
    try {
      await AsyncStorage.setItem('@auramart_wallet', String(newVal));
    } catch (e) { console.error(e); }
  };

  const deductRewardWallet = async (amount: number) => {
    const newVal = Math.max(0, rewardWalletBalance - amount);
    setRewardWalletBalance(newVal);
    try {
      await AsyncStorage.setItem('@auramart_wallet', String(newVal));
    } catch (e) { console.error(e); }
  };

  const addAddress = async (addr: string) => {
    const updated = [...addresses, addr];
    setAddresses(updated);
    setSelectedAddress(addr);
    try {
      await AsyncStorage.setItem('@auramart_addresses', JSON.stringify(updated));
      await AsyncStorage.setItem('@auramart_selected_address', addr);
    } catch (e) { console.error(e); }
  };

  const changeSelectedAddress = async (addr: string) => {
    setSelectedAddress(addr);
    try {
      await AsyncStorage.setItem('@auramart_selected_address', addr);
    } catch (e) { console.error(e); }
  };

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const itemId = `${product.id}-${color || ''}-${size || ''}`;
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.itemId === itemId);
      let updatedCart;
      if (existingIdx > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingIdx].quantity += quantity;
      } else {
        updatedCart = [...prevCart, { itemId, product, quantity, selectedColor: color, selectedSize: size }];
      }
      saveCart(updatedCart);
      return updatedCart;
    });

    if (isAuthenticated) {
      apiClient('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          sku: (product as any).sku || `SKU-${product.id}`,
          quantity,
          fulfillmentSourceId: (product as any).fulfillmentSourceId || (product.isFlado ? 'shop-darkstore-01' : undefined),
        }),
      }).then((res: any) => {
        if (res && res.cartId) {
          setAuthoritativeCart(res);
        }
      }).catch((e) => {
        console.log('Authoritative add-to-cart notice:', e?.message);
      });
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.itemId !== itemId);
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item
      );
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
    setCouponDiscount(0);
    setAuthoritativeCart(null);
  };

  // Calculations fallback
  const auraMartItems = cart.filter(item => !item.product.isFlado);
  const fladoItems = cart.filter(item => item.product.isFlado);

  const auraMartSubtotal = auraMartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const fladoSubtotal = fladoItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const subtotal = auraMartSubtotal + fladoSubtotal;
  const gst = Math.round(subtotal * 0.18);
  const auraMartDelivery = auraMartSubtotal > 0 && auraMartSubtotal < 999 ? 40 : 0;
  const fladoDelivery = fladoSubtotal > 0 && fladoSubtotal < 299 ? 15 : 0;
  const deliveryFee = auraMartDelivery + fladoDelivery;
  const totalBeforeDiscount = subtotal + gst + deliveryFee;
  const discount = Math.min(totalBeforeDiscount, couponDiscount);
  const total = Math.max(0, totalBeforeDiscount - discount);

  const placeOrder = async (isFladoOnly = false): Promise<string> => {
    const targetItems = isFladoOnly ? fladoItems : cart;
    if (targetItems.length === 0) throw new Error("Cart is empty");

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      items: targetItems,
      subtotal: isFladoOnly ? fladoSubtotal : subtotal,
      gst: isFladoOnly ? Math.round(fladoSubtotal * 0.18) : gst,
      deliveryFee: isFladoOnly ? fladoDelivery : deliveryFee,
      total: isFladoOnly ? (fladoSubtotal + Math.round(fladoSubtotal * 0.18) + fladoDelivery) : total,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      address: selectedAddress,
      status: 'placed',
      eta: isFladoOnly ? '10 mins' : '2-3 days',
      isFlado: isFladoOnly,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      await AsyncStorage.setItem('@auramart_orders', JSON.stringify(updatedOrders));
    } catch (e) { console.error(e); }

    if (isFladoOnly) {
      setCart((prev) => prev.filter((item) => !item.product.isFlado));
    } else {
      clearCart();
    }
    return orderId;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        authoritativeCart,
        isLoadingCart,
        cartError,
        fetchAuthoritativeCart,
        updateCartItemQuantity,
        removeCartItem,
        updateSubstitutionPreference,
        rewardWalletBalance,
        creditRewardWallet,
        deductRewardWallet,
        addresses,
        selectedAddress,
        addAddress,
        setSelectedAddress: changeSelectedAddress,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orders,
        placeOrder,
        couponDiscount,
        setCouponDiscount,
        calculations: {
          auraMartSubtotal,
          fladoSubtotal,
          subtotal,
          gst,
          auraMartDelivery,
          fladoDelivery,
          deliveryFee,
          discount,
          total,
        },
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
