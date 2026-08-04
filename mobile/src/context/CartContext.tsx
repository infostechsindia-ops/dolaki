import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../utils/mockData';
import { api } from '../utils/api';

export interface CartItem {
  itemId: string; // combination of id, color, size
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [rewardWalletBalance, setRewardWalletBalance] = useState<number>(500); // Initial reward cash
  const [addresses, setAddresses] = useState<string[]>(DEFAULT_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<string>(DEFAULT_ADDRESSES[0]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

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
  };

  // Calculations
  const auraMartItems = cart.filter(item => !item.product.isFlado);
  const fladoItems = cart.filter(item => item.product.isFlado);

  const auraMartSubtotal = auraMartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const fladoSubtotal = fladoItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const subtotal = auraMartSubtotal + fladoSubtotal;
  const gst = Math.round(subtotal * 0.18); // 18% GST

  // AuraMart Delivery: ₹40, free above ₹999
  const auraMartDelivery = auraMartSubtotal > 0 && auraMartSubtotal < 999 ? 40 : 0;
  // Flado Delivery: ₹15 handling charge, free above ₹299
  const fladoDelivery = fladoSubtotal > 0 && fladoSubtotal < 299 ? 15 : 0;
  const deliveryFee = auraMartDelivery + fladoDelivery;

  // Wallet + Coupon Discount
  const totalBeforeDiscount = subtotal + gst + deliveryFee;
  // Let user use up to 10% of total via wallet, or coupon code
  const discount = Math.min(totalBeforeDiscount, couponDiscount);
  const total = Math.max(0, totalBeforeDiscount - discount);

  const calculations = {
    auraMartSubtotal,
    fladoSubtotal,
    subtotal,
    gst,
    auraMartDelivery,
    fladoDelivery,
    deliveryFee,
    discount,
    total
  };

  const placeOrder = async (isFladoOnly?: boolean): Promise<string> => {
    // Filter items to purchase
    const itemsToOrder = cart.filter(item => 
      isFladoOnly === undefined ? true : (isFladoOnly ? item.product.isFlado : !item.product.isFlado)
    );

    if (itemsToOrder.length === 0) {
      throw new Error("No items in cart to order");
    }

    const orderSubtotal = itemsToOrder.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const orderGst = Math.round(orderSubtotal * 0.18);
    
    let orderDelivery = 0;
    if (isFladoOnly === undefined) {
      orderDelivery = deliveryFee;
    } else if (isFladoOnly) {
      orderDelivery = orderSubtotal < 299 ? 15 : 0;
    } else {
      orderDelivery = orderSubtotal < 999 ? 40 : 0;
    }

    const orderTotal = orderSubtotal + orderGst + orderDelivery - (isFladoOnly === undefined ? discount : 0);

    // Call API helper to place order
    const result = await api.placeOrder({
      items: itemsToOrder,
      subtotal: orderSubtotal,
      gst: orderGst,
      deliveryFee: orderDelivery,
      total: orderTotal,
      address: selectedAddress
    });

    const newOrder: Order = {
      id: result.orderId,
      items: itemsToOrder,
      subtotal: orderSubtotal,
      gst: orderGst,
      deliveryFee: orderDelivery,
      total: orderTotal,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      address: selectedAddress,
      status: 'placed',
      eta: isFladoOnly ? '10 mins' : '2-3 days',
      isFlado: isFladoOnly ?? itemsToOrder.some(item => item.product.isFlado)
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      await AsyncStorage.setItem('@auramart_orders', JSON.stringify(updatedOrders));
    } catch (e) { console.error(e); }

    // Clear ordered items from cart
    setCart(prevCart => {
      const remainingItems = prevCart.filter(item => 
        isFladoOnly === undefined ? false : (isFladoOnly ? !item.product.isFlado : item.product.isFlado)
      );
      saveCart(remainingItems);
      return remainingItems;
    });

    // Deduct from coupon discount if unified order
    if (isFladoOnly === undefined) {
      setCouponDiscount(0);
    }

    return newOrder.id;
  };

  return (
    <CartContext.Provider value={{
      cart,
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
      calculations
    }}>
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
