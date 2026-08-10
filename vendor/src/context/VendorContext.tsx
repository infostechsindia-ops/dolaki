"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BusinessInfo {
  legalName: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BankInfo {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
}

export interface VendorProfile {
  email: string;
  storeName: string;
  phone: string;
  business: BusinessInfo;
  bank: BankInfo;
  isRegistered: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  description: string;
  imageUrl: string;
  listOnFlado: boolean;
  status: "active" | "draft" | "out_of_stock";
  createdAt: string;
}

export type OrderStatus = "pending" | "packed" | "shipped" | "ready";

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "Prepaid" | "COD";
  status: OrderStatus;
  createdAt: string;
}

export interface PayoutTransaction {
  id: string;
  date: string;
  orderId: string;
  grossAmount: number;
  fees: number;
  gst: number;
  netSettlement: number;
  status: "settled" | "processing" | "hold";
}

interface VendorContextType {
  profile: VendorProfile | null;
  products: Product[];
  orders: Order[];
  payouts: PayoutTransaction[];
  isLoggedIn: boolean;
  login: (email: string, pass: string, storeName?: string) => Promise<void>;
  register: (profileData: VendorProfile, pass?: string) => Promise<void>;
  logout: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status">) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFladoListing: (id: string) => void;
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  requestPayout: () => void;
  isLoading: boolean;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

// Initial Mock Products (Indian products with realistic values)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Organic Assam Orthodox Black Tea (250g)",
    category: "Groceries & Beverages",
    price: 349,
    compareAtPrice: 499,
    sku: "ASM-BLK-250",
    stock: 85,
    description: "Premium single-estate orthodox whole leaf tea harvested from the lush plains of Assam. Rich, malty, and full-bodied flavour.",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    listOnFlado: true,
    status: "active",
    createdAt: "2026-05-15"
  },
  {
    id: "prod-2",
    name: "Kanchipuram Pure Silk Handloom Saree - Emerald Green",
    category: "Ethnic Wear",
    price: 4999,
    compareAtPrice: 7999,
    sku: "KNC-SLK-EMG",
    stock: 12,
    description: "Exquisite handwoven pure silk saree adorned with classic zari borders, crafted by heritage weavers in Kanchipuram, Tamil Nadu.",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60",
    listOnFlado: false,
    status: "active",
    createdAt: "2026-05-20"
  },
  {
    id: "prod-3",
    name: "Pure Alphonso Mango Pulp (850g Can)",
    category: "Groceries & Gourmet",
    price: 280,
    compareAtPrice: 320,
    sku: "MNG-PLP-850",
    stock: 140,
    description: "Naturally sweet pulp made from hand-selected Devgad Alphonso mangoes. No artificial flavours or added preservatives.",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60",
    listOnFlado: true,
    status: "active",
    createdAt: "2026-06-01"
  },
  {
    id: "prod-4",
    name: "Pure Copper Leakproof Hammered Water Bottle (1 Litre)",
    category: "Home & Kitchen",
    price: 649,
    compareAtPrice: 999,
    sku: "COP-BTL-1L",
    stock: 0,
    description: "Handcrafted pure copper water bottle with a lacquer finish and a leakproof silicone washer for ayurvedic health benefits.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    listOnFlado: true,
    status: "out_of_stock",
    createdAt: "2026-06-05"
  },
  {
    id: "prod-5",
    name: "Mysore Sandalwood & Saffron Luxury Bath Soap (125g)",
    category: "Personal Care",
    price: 185,
    compareAtPrice: 220,
    sku: "SND-SOAP-125",
    stock: 210,
    description: "Enriched with real sandalwood oil and Kashmiri saffron extracts for deeply hydrated, radiant, and fragrant skin.",
    imageUrl: "https://images.unsplash.com/photo-1607006342411-92fc2a41b3e5?w=500&auto=format&fit=crop&q=60",
    listOnFlado: false,
    status: "active",
    createdAt: "2026-06-10"
  }
];

// Initial Mock Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9842",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 43210",
    shippingAddress: "Flat 402, Emerald Heights, Sector 15, Vashi",
    city: "Navi Mumbai",
    state: "Maharashtra",
    pincode: "400703",
    items: [
      { id: "prod-1", productName: "Organic Assam Orthodox Black Tea (250g)", quantity: 2, price: 349 },
      { id: "prod-3", productName: "Pure Alphonso Mango Pulp (850g Can)", quantity: 1, price: 280 }
    ],
    totalAmount: 978,
    paymentMethod: "Prepaid",
    status: "pending",
    createdAt: "2026-06-29T10:30:00Z"
  },
  {
    id: "ORD-9843",
    customerName: "Priya Patel",
    customerPhone: "+91 87654 32109",
    shippingAddress: "House 24, Gokul Society, Near Drive-in Road",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380054",
    items: [
      { id: "prod-2", productName: "Kanchipuram Pure Silk Handloom Saree - Emerald Green", quantity: 1, price: 4999 }
    ],
    totalAmount: 4999,
    paymentMethod: "Prepaid",
    status: "pending",
    createdAt: "2026-06-29T14:15:00Z"
  },
  {
    id: "ORD-9840",
    customerName: "Vikram Singh",
    customerPhone: "+91 76543 21098",
    shippingAddress: "C-12, Green Park Extension",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    items: [
      { id: "prod-1", productName: "Organic Assam Orthodox Black Tea (250g)", quantity: 1, price: 349 },
      { id: "prod-5", productName: "Mysore Sandalwood & Saffron Luxury Bath Soap (125g)", quantity: 3, price: 185 }
    ],
    totalAmount: 904,
    paymentMethod: "COD",
    status: "packed",
    createdAt: "2026-06-28T09:00:00Z"
  },
  {
    id: "ORD-9838",
    customerName: "Ananya Rao",
    customerPhone: "+91 99887 76655",
    shippingAddress: "Villa 8, Orchid Gardens, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560066",
    items: [
      { id: "prod-3", productName: "Pure Alphonso Mango Pulp (850g Can)", quantity: 4, price: 280 }
    ],
    totalAmount: 1120,
    paymentMethod: "Prepaid",
    status: "shipped",
    createdAt: "2026-06-27T11:45:00Z"
  },
  {
    id: "ORD-9835",
    customerName: "Rohan Gupta",
    customerPhone: "+91 91234 56789",
    shippingAddress: "A-501, Shanti Niketan, Kothrud",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    items: [
      { id: "prod-5", productName: "Mysore Sandalwood & Saffron Luxury Bath Soap (125g)", quantity: 2, price: 185 }
    ],
    totalAmount: 370,
    paymentMethod: "Prepaid",
    status: "ready",
    createdAt: "2026-06-26T16:30:00Z"
  }
];

// Initial Payout Transactions
const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: "TXN-884012",
    date: "2026-06-25",
    orderId: "ORD-9820",
    grossAmount: 1450,
    fees: 116, // 8% commission
    gst: 20.88, // 18% GST on commission
    netSettlement: 1313.12,
    status: "settled"
  },
  {
    id: "TXN-884013",
    date: "2026-06-25",
    orderId: "ORD-9822",
    grossAmount: 649,
    fees: 51.92,
    gst: 9.35,
    netSettlement: 587.73,
    status: "settled"
  },
  {
    id: "TXN-884014",
    date: "2026-06-27",
    orderId: "ORD-9830",
    grossAmount: 3200,
    fees: 256,
    gst: 46.08,
    netSettlement: 2897.92,
    status: "settled"
  },
  {
    id: "TXN-884015",
    date: "2026-06-28",
    orderId: "ORD-9835",
    grossAmount: 370,
    fees: 29.6,
    gst: 5.33,
    netSettlement: 335.07,
    status: "processing"
  },
  {
    id: "TXN-884016",
    date: "2026-06-29",
    orderId: "ORD-9838",
    grossAmount: 1120,
    fees: 89.6,
    gst: 16.13,
    netSettlement: 1014.27,
    status: "processing"
  }
];

const DEFAULT_PROFILE: VendorProfile = {
  email: "admin@auramarthandicrafts.in",
  storeName: "AuraMart Heritage Crafts",
  phone: "+91 98765 43210",
  business: {
    legalName: "AuraMart Heritage Crafts Private Limited",
    gstin: "27AAAAA1111A1Z1",
    pan: "AAAAA1111A",
    address: "102, Craft Heritage House, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  bank: {
    bankName: "HDFC Bank Ltd",
    accountHolder: "AuraMart Heritage Crafts Private Limited",
    accountNumber: "50100234567890",
    ifsc: "HDFC0000123"
  },
  isRegistered: true
};

export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize store and check auth from localStorage
  useEffect(() => {
    // Perform only in browser
    if (typeof window !== "undefined") {
      const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      
      if (!isDemo) {
        const hasToken = localStorage.getItem("vendor_token");
        if (!hasToken) {
          setProfile(null);
          setProducts([]);
          setOrders([]);
          setPayouts([]);
          setIsLoggedIn(false);
          localStorage.removeItem("vendor_profile");
          localStorage.removeItem("vendor_is_logged_in");
          localStorage.removeItem("vendor_products");
          localStorage.removeItem("vendor_orders");
          localStorage.removeItem("vendor_payouts");
          setIsLoading(false);
          return;
        }
      }

      const storedProfile = localStorage.getItem("vendor_profile");
      const storedLoggedIn = localStorage.getItem("vendor_is_logged_in");
      const storedProducts = localStorage.getItem("vendor_products");
      const storedOrders = localStorage.getItem("vendor_orders");
      const storedPayouts = localStorage.getItem("vendor_payouts");

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else if (isDemo) {
        // Seed default profile so it's ready to demo
        localStorage.setItem("vendor_profile", JSON.stringify(DEFAULT_PROFILE));
        setProfile(DEFAULT_PROFILE);
      }

      if (storedLoggedIn === "true") {
        setIsLoggedIn(true);
      }

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else if (isDemo) {
        localStorage.setItem("vendor_products", JSON.stringify(INITIAL_PRODUCTS));
        setProducts(INITIAL_PRODUCTS);
      }

      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else if (isDemo) {
        localStorage.setItem("vendor_orders", JSON.stringify(INITIAL_ORDERS));
        setOrders(INITIAL_ORDERS);
      }

      if (storedPayouts) {
        setPayouts(JSON.parse(storedPayouts));
      } else if (isDemo) {
        localStorage.setItem("vendor_payouts", JSON.stringify(INITIAL_PAYOUTS));
        setPayouts(INITIAL_PAYOUTS);
      }

      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string, storeName?: string) => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    if (isDemo) {
      setIsLoggedIn(true);
      localStorage.setItem("vendor_is_logged_in", "true");
      
      let currentProfile = profile;
      if (!currentProfile) {
        currentProfile = { ...DEFAULT_PROFILE };
      }
      currentProfile = {
        ...currentProfile,
        email,
        storeName: storeName || currentProfile.storeName
      };
      
      setProfile(currentProfile);
      localStorage.setItem("vendor_profile", JSON.stringify(currentProfile));
      return;
    }

    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || errJson.message || "Invalid email or password");
    }
    let data = await res.json();
    if (data && typeof data === 'object' && 'data' in data) {
      data = data.data;
    }
    if (!['VENDOR_OWNER', 'VENDOR_STAFF', 'VENDOR'].includes(data.user?.role)) {
      throw new Error("Access Denied: Only Vendor accounts are permitted on this portal.");
    }
    setIsLoggedIn(true);
    localStorage.setItem("vendor_is_logged_in", "true");
    localStorage.setItem("vendor_token", data.token || data.access_token);
    const newProfile: VendorProfile = {
      email: data.user?.email || email,
      storeName: storeName || "My Vendor Store",
      phone: "+91 99999 88888",
      business: {
        legalName: data.user?.fullName || "My Vendor LLC",
        gstin: "",
        pan: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
      },
      bank: {
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        ifsc: ""
      },
      isRegistered: true
    };
    setProfile(newProfile);
    localStorage.setItem("vendor_profile", JSON.stringify(newProfile));
  };

  const register = async (profileData: VendorProfile, pass?: string) => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    if (isDemo) {
      setIsLoggedIn(true);
      setProfile(profileData);
      localStorage.setItem("vendor_is_logged_in", "true");
      localStorage.setItem("vendor_profile", JSON.stringify(profileData));
      return;
    }

    const res = await fetch(`${BASE_URL}/api/v1/auth/register-vendor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profileData.email,
        password: pass,
        fullName: profileData.business.legalName,
        phone: profileData.phone
      })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || data.message || "Registration failed");
    }
    let data = await res.json();
    if (data && typeof data === 'object' && 'data' in data) {
      data = data.data;
    }
    setIsLoggedIn(true);
    localStorage.setItem("vendor_is_logged_in", "true");
    localStorage.setItem("vendor_token", data.token || data.access_token);
    setProfile(profileData);
    localStorage.setItem("vendor_profile", JSON.stringify(profileData));
  };

  const logout = async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    if (!isDemo) {
      const token = localStorage.getItem("vendor_token");
      try {
        await fetch(`${BASE_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
      } catch (e) {
        // Ignore network logout failure
      }
    }

    setIsLoggedIn(false);
    localStorage.removeItem("vendor_is_logged_in");
    localStorage.removeItem("vendor_token");
    localStorage.removeItem("vendor_profile");
  };

  const addProduct = (newProduct: Omit<Product, "id" | "createdAt" | "status">) => {
    const freshProduct: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: newProduct.stock > 0 ? "active" : "out_of_stock"
    };

    const updated = [freshProduct, ...products];
    setProducts(updated);
    localStorage.setItem("vendor_products", JSON.stringify(updated));
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((prod) => {
      if (prod.id === id) {
        const result = { ...prod, ...updatedFields };
        // automatically handle out of stock status
        if (updatedFields.stock !== undefined) {
          result.status = updatedFields.stock > 0 ? "active" : "out_of_stock";
        }
        return result;
      }
      return prod;
    });
    setProducts(updated);
    localStorage.setItem("vendor_products", JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("vendor_products", JSON.stringify(updated));
  };

  const toggleFladoListing = (id: string) => {
    const updated = products.map((prod) => {
      if (prod.id === id) {
        return { ...prod, listOnFlado: !prod.listOnFlado };
      }
      return prod;
    });
    setProducts(updated);
    localStorage.setItem("vendor_products", JSON.stringify(updated));
  };

  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return { ...ord, status: nextStatus };
      }
      return ord;
    });
    setOrders(updated);
    localStorage.setItem("vendor_orders", JSON.stringify(updated));

    // If order becomes 'ready' (fully fulfilled), add a payout transaction!
    if (nextStatus === "ready") {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        // check if txn already exists
        const exists = payouts.some(p => p.orderId === orderId);
        if (!exists) {
          const commRate = 0.08; // 8% fee
          const grossAmount = order.totalAmount;
          const fees = Math.round(grossAmount * commRate * 100) / 100;
          const gst = Math.round(fees * 0.18 * 100) / 100; // 18% GST on fee
          const netSettlement = Math.round((grossAmount - fees - gst) * 100) / 100;

          const newPayout: PayoutTransaction = {
            id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString().split('T')[0],
            orderId: order.id,
            grossAmount,
            fees,
            gst,
            netSettlement,
            status: "processing"
          };

          const updatedPayouts = [newPayout, ...payouts];
          setPayouts(updatedPayouts);
          localStorage.setItem("vendor_payouts", JSON.stringify(updatedPayouts));
        }
      }
    }
  };

  const requestPayout = () => {
    // Set all "processing" payouts to "settled" as a batch request simulation
    const updatedPayouts = payouts.map(p => {
      if (p.status === "processing") {
        return { ...p, status: "settled" as const };
      }
      return p;
    });
    setPayouts(updatedPayouts);
    localStorage.setItem("vendor_payouts", JSON.stringify(updatedPayouts));
    alert("Payout request submitted successfully! Funds will be settled to your registered bank account.");
  };

  return (
    <VendorContext.Provider
      value={{
        profile,
        products,
        orders,
        payouts,
        isLoggedIn,
        login,
        register,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFladoListing,
        updateOrderStatus,
        requestPayout,
        isLoading
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
};
