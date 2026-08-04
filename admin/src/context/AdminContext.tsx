"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  vendor: string;
  stock: number;
  rating: number;
  status: "active" | "draft" | "out_of_stock";
  image?: string;
  images?: string[];
  sales: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  status: "active" | "inactive";
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "upcoming";
  usageCount: number;
}

export interface FlashSale {
  id: string;
  title: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  productsCount: number;
  status: "active" | "paused" | "scheduled";
}

export interface Order {
  id: string;
  customerName: string;
  customerCity: string;
  orderDate: string;
  amount: number;
  paymentMethod: "UPI" | "Card" | "COD" | "NetBanking";
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  itemsCount: number;
}

export interface Vendor {
  id: string;
  name: string;
  ownerName: string;
  city: string;
  rating: number;
  status: "approved" | "pending" | "suspended";
  revenue: number;
  productCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinDate: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "blocked";
}

export interface FladoHub {
  id: string;
  name: string;
  city: string;
  status: "normal" | "high_load" | "overloaded";
  activeRiders: number;
  pendingOrders: number;
  avgDeliveryTimeMinutes: number;
}

export interface FladoRider {
  id: string;
  name: string;
  phone: string;
  hub: string;
  status: "active_delivery" | "idle" | "offline";
  currentOrder?: string;
  batteryPercent: number;
}

interface AdminContextType {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  flashSales: FlashSale[];
  orders: Order[];
  vendors: Vendor[];
  users: User[];
  hubs: FladoHub[];
  riders: FladoRider[];
  
  // Product CRUD
  addProduct: (product: Omit<Product, "id" | "sales" | "rating">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Category CRUD
  addCategory: (category: Omit<Category, "id" | "productCount">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Coupon CRUD
  addCoupon: (coupon: Omit<Coupon, "id" | "usageCount">) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  
  // Flash Sale CRUD
  addFlashSale: (sale: Omit<FlashSale, "id">) => void;
  updateFlashSale: (id: string, sale: Partial<FlashSale>) => void;
  deleteFlashSale: (id: string) => void;
  
  // Order status
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  
  // Vendor status
  updateVendorStatus: (id: string, status: Vendor["status"]) => void;
  
  // User status
  updateUserStatus: (id: string, status: User["status"]) => void;
  
  // Flado ops controls
  updateHubStatus: (id: string, status: FladoHub["status"]) => void;
  updateRiderStatus: (id: string, status: FladoRider["status"]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  // Initial Mock Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [hubs, setHubs] = useState<FladoHub[]>([]);
  const [riders, setRiders] = useState<FladoRider[]>([]);

  useEffect(() => {
    // Populate realistic Indian ecommerce mock data on client mount
    setProducts([
      { id: "P-101", name: "Aashirvaad Shudh Chakki Atta 10kg", price: 460, category: "Groceries & Staples", vendor: "Shree Balaji Traders", stock: 120, rating: 4.8, status: "active", image: "/images/atta.jpg", sales: 340 },
      { id: "P-102", name: "Fortune Soya Health Oil 5L", price: 675, category: "Groceries & Staples", vendor: "Metro Cash & Carry", stock: 85, rating: 4.5, status: "active", image: "/images/oil.jpg", sales: 290 },
      { id: "P-103", name: "Amul Pure Ghee 1L", price: 690, category: "Dairy & Bakery", vendor: "Deluxe Grocery Hub", stock: 50, rating: 4.9, status: "active", image: "/images/ghee.jpg", sales: 410 },
      { id: "P-104", name: "Tata Tea Premium 1kg", price: 420, category: "Beverages", vendor: "National Distributors", stock: 15, rating: 4.6, status: "active", image: "/images/tea.jpg", sales: 220 },
      { id: "P-105", name: "Haldiram's Bhujia Sev 400g", price: 110, category: "Snacks & Brand Foods", vendor: "Shree Balaji Traders", stock: 300, rating: 4.7, status: "active", image: "/images/bhujia.jpg", sales: 580 },
      { id: "P-106", name: "Surf Excel Easy Wash 5kg", price: 740, category: "Household Care", vendor: "Metro Cash & Carry", stock: 0, rating: 4.4, status: "out_of_stock", image: "/images/surf.jpg", sales: 130 },
      { id: "P-107", name: "Dettol Liquid Handwash Refill 1.5L", price: 230, category: "Personal Care", vendor: "National Distributors", stock: 95, rating: 4.7, status: "active", image: "/images/handwash.jpg", sales: 180 },
      { id: "P-108", name: "Maggi 2-Min Masala Noodles 12-Pack", price: 168, category: "Snacks & Brand Foods", vendor: "Deluxe Grocery Hub", stock: 210, rating: 4.8, status: "active", image: "/images/maggi.jpg", sales: 950 },
      { id: "P-109", name: "Cadbury Dairy Milk Silk 150g", price: 175, category: "Snacks & Brand Foods", vendor: "South India Retail", stock: 8, rating: 4.9, status: "active", image: "/images/silk.jpg", sales: 310 },
      { id: "P-110", name: "Epigamia Greek Yogurt Strawberry 90g", price: 60, category: "Dairy & Bakery", vendor: "South India Retail", stock: 40, rating: 4.3, status: "draft", image: "/images/yogurt.jpg", sales: 0 }
    ]);

    setCategories([
      { id: "C-1", name: "Groceries & Staples", slug: "groceries-staples", productCount: 45, status: "active" },
      { id: "C-2", name: "Dairy & Bakery", slug: "dairy-bakery", productCount: 28, status: "active" },
      { id: "C-3", name: "Beverages", slug: "beverages", productCount: 34, status: "active" },
      { id: "C-4", name: "Snacks & Brand Foods", slug: "snacks-branded-foods", productCount: 62, status: "active" },
      { id: "C-5", name: "Personal Care", slug: "personal-care", productCount: 41, status: "active" },
      { id: "C-6", name: "Household Care", slug: "household-care", productCount: 19, status: "active" }
    ]);

    setCoupons([
      { id: "CP-1", code: "AURAFIRST50", discountType: "percentage", discountValue: 50, minPurchase: 200, startDate: "2026-06-01", endDate: "2026-12-31", status: "active", usageCount: 2450 },
      { id: "CP-2", code: "CHAI20", discountType: "percentage", discountValue: 20, minPurchase: 150, startDate: "2026-06-15", endDate: "2026-07-15", status: "active", usageCount: 680 },
      { id: "CP-3", code: "SUPERSTAPLES", discountType: "fixed", discountValue: 100, minPurchase: 1000, startDate: "2026-06-01", endDate: "2026-07-31", status: "active", usageCount: 310 },
      { id: "CP-4", code: "FESTIVE25", discountType: "percentage", discountValue: 25, minPurchase: 500, startDate: "2026-08-01", endDate: "2026-08-15", status: "upcoming", usageCount: 0 },
      { id: "CP-5", code: "EXPIRED30", discountType: "percentage", discountValue: 30, minPurchase: 300, startDate: "2026-05-01", endDate: "2026-05-31", status: "expired", usageCount: 1200 }
    ]);

    setFlashSales([
      { id: "FS-1", title: "Monsoon Grocery Rush", discountPercentage: 30, startDate: "2026-06-25T10:00:00Z", endDate: "2026-07-05T22:00:00Z", productsCount: 12, status: "active" },
      { id: "FS-2", title: "Weekend Snack Fest", discountPercentage: 25, startDate: "2026-07-04T12:00:00Z", endDate: "2026-07-06T12:00:00Z", productsCount: 8, status: "scheduled" },
      { id: "FS-3", title: "Midnight Dairy Deal", discountPercentage: 15, startDate: "2026-06-01T00:00:00Z", endDate: "2026-06-30T04:00:00Z", productsCount: 5, status: "paused" }
    ]);

    setOrders([
      { id: "AM-10492", customerName: "Rahul Sharma", customerCity: "New Delhi", orderDate: "2026-06-29 23:42", amount: 1540, paymentMethod: "UPI", status: "Processing", itemsCount: 4 },
      { id: "AM-10491", customerName: "Priya Patel", customerCity: "Mumbai", orderDate: "2026-06-29 22:15", amount: 890, paymentMethod: "Card", status: "Shipped", itemsCount: 2 },
      { id: "AM-10490", customerName: "Amit Verma", customerCity: "Bengaluru", orderDate: "2026-06-29 21:05", amount: 2450, paymentMethod: "UPI", status: "Delivered", itemsCount: 6 },
      { id: "AM-10489", customerName: "Ananya Reddy", customerCity: "Hyderabad", orderDate: "2026-06-29 19:30", amount: 620, paymentMethod: "COD", status: "Pending", itemsCount: 1 },
      { id: "AM-10488", customerName: "Vikram Singh", customerCity: "Pune", orderDate: "2026-06-29 18:02", amount: 1210, paymentMethod: "NetBanking", status: "Delivered", itemsCount: 3 },
      { id: "AM-10487", customerName: "Kunal Shah", customerCity: "Ahmedabad", orderDate: "2026-06-29 15:45", amount: 310, paymentMethod: "UPI", status: "Cancelled", itemsCount: 2 },
      { id: "AM-10486", customerName: "Sunita Rao", customerCity: "Chennai", orderDate: "2026-06-29 14:10", amount: 1890, paymentMethod: "Card", status: "Delivered", itemsCount: 5 },
      { id: "AM-10485", customerName: "Deepak Gupta", customerCity: "Kolkata", orderDate: "2026-06-29 11:20", amount: 460, paymentMethod: "UPI", status: "Shipped", itemsCount: 2 },
      { id: "AM-10484", customerName: "Meera Nair", customerCity: "Kochi", orderDate: "2026-06-28 20:15", amount: 750, paymentMethod: "COD", status: "Delivered", itemsCount: 3 }
    ]);

    setVendors([
      { id: "V-201", name: "Shree Balaji Traders", ownerName: "Rajesh Kumar", city: "New Delhi", rating: 4.7, status: "approved", revenue: 245000, productCount: 42 },
      { id: "V-202", name: "Metro Cash & Carry", ownerName: "Sanjay Singhal", city: "Mumbai", rating: 4.5, status: "approved", revenue: 589000, productCount: 125 },
      { id: "V-203", name: "Deluxe Grocery Hub", ownerName: "Amit Mehra", city: "Bengaluru", rating: 4.8, status: "approved", revenue: 312000, productCount: 38 },
      { id: "V-204", name: "National Distributors", ownerName: "Harish Gupta", city: "Kolkata", rating: 4.2, status: "approved", revenue: 145000, productCount: 29 },
      { id: "V-205", name: "South India Retail", ownerName: "Venkatesh Prasad", city: "Chennai", rating: 4.6, status: "approved", revenue: 418000, productCount: 76 },
      { id: "V-206", name: "Organic Fields", ownerName: "Sunil Joshi", city: "Pune", rating: 3.9, status: "pending", revenue: 0, productCount: 5 },
      { id: "V-207", name: "Spicy Treats", ownerName: "Tarun Sharma", city: "Jaipur", rating: 2.1, status: "suspended", revenue: 24000, productCount: 14 }
    ]);

    setUsers([
      { id: "U-301", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", phone: "+91 98765 43210", city: "New Delhi", joinDate: "2025-10-12", ordersCount: 14, totalSpent: 12400, status: "active" },
      { id: "U-302", name: "Priya Patel", email: "priya.patel@yahoo.com", phone: "+91 87654 32109", city: "Mumbai", joinDate: "2025-11-05", ordersCount: 8, totalSpent: 6780, status: "active" },
      { id: "U-303", name: "Amit Verma", email: "amit.verma@outlook.com", phone: "+91 76543 21098", city: "Bengaluru", joinDate: "2025-12-20", ordersCount: 22, totalSpent: 28900, status: "active" },
      { id: "U-304", name: "Ananya Reddy", email: "ananya.r@gmail.com", phone: "+91 95432 10987", city: "Hyderabad", joinDate: "2026-01-18", ordersCount: 5, totalSpent: 3100, status: "active" },
      { id: "U-305", name: "Vikram Singh", email: "vikram.s@hotmail.com", phone: "+91 84321 09876", city: "Pune", joinDate: "2026-02-28", ordersCount: 11, totalSpent: 9240, status: "active" },
      { id: "U-306", name: "Kunal Shah", email: "kunal.shah@gmail.com", phone: "+91 73210 98765", city: "Ahmedabad", joinDate: "2026-03-15", ordersCount: 4, totalSpent: 1890, status: "active" },
      { id: "U-307", name: "Sunita Rao", email: "sunita.rao@gmail.com", phone: "+91 92109 87654", city: "Chennai", joinDate: "2026-04-10", ordersCount: 19, totalSpent: 21050, status: "active" },
      { id: "U-308", name: "Suresh Pillai", email: "suresh.p@gmail.com", phone: "+91 81098 76543", city: "Kochi", joinDate: "2026-05-02", ordersCount: 0, totalSpent: 0, status: "blocked" }
    ]);

    setHubs([
      { id: "HUB-01", name: "Delhi-NCR Central Hub", city: "New Delhi", status: "normal", activeRiders: 12, pendingOrders: 5, avgDeliveryTimeMinutes: 18.2 },
      { id: "HUB-02", name: "Mumbai-Andheri East Hub", city: "Mumbai", status: "high_load", activeRiders: 15, pendingOrders: 18, avgDeliveryTimeMinutes: 24.5 },
      { id: "HUB-03", name: "Bengaluru-HSR Layout Hub", city: "Bengaluru", status: "normal", activeRiders: 10, pendingOrders: 3, avgDeliveryTimeMinutes: 15.8 },
      { id: "HUB-04", name: "Pune-Kothrud Express Hub", city: "Pune", status: "overloaded", activeRiders: 6, pendingOrders: 14, avgDeliveryTimeMinutes: 32.1 },
      { id: "HUB-05", name: "Hyderabad-Gachibowli Tech Hub", city: "Hyderabad", status: "normal", activeRiders: 8, pendingOrders: 2, avgDeliveryTimeMinutes: 16.4 }
    ]);

    setRiders([
      { id: "R-501", name: "Amit Kumar", phone: "+91 90123 45678", hub: "Delhi-NCR Central Hub", status: "active_delivery", currentOrder: "AM-10492", batteryPercent: 82 },
      { id: "R-502", name: "Sachin Patil", phone: "+91 91234 56789", hub: "Mumbai-Andheri East Hub", status: "active_delivery", currentOrder: "AM-10491", batteryPercent: 44 },
      { id: "R-503", name: "Ramesh Gowda", phone: "+91 92345 67890", hub: "Bengaluru-HSR Layout Hub", status: "idle", batteryPercent: 95 },
      { id: "R-504", name: "Dnyaneshwar Kale", phone: "+91 93456 78901", hub: "Pune-Kothrud Express Hub", status: "active_delivery", currentOrder: "AM-10488", batteryPercent: 12 },
      { id: "R-505", name: "Satish Reddy", phone: "+91 94567 89012", hub: "Hyderabad-Gachibowli Tech Hub", status: "idle", batteryPercent: 78 },
      { id: "R-506", name: "Vijay Kumar", phone: "+91 95678 90123", hub: "Delhi-NCR Central Hub", status: "offline", batteryPercent: 0 }
    ]);
  }, []);

  // PRODUCT CRUD IMPLEMENTATION
  const addProduct = (newProd: Omit<Product, "id" | "sales" | "rating">) => {
    const newId = `P-${100 + products.length + 1}`;
    const p: Product = {
      ...newProd,
      id: newId,
      sales: 0,
      rating: 5.0,
      image: newProd.image || "/images/placeholder.jpg"
    };
    setProducts((prev) => [p, ...prev]);

    // Update categories count
    setCategories((prevCat) =>
      prevCat.map((c) =>
        c.name === newProd.category ? { ...c, productCount: c.productCount + 1 } : c
      )
    );
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // If category changed, we could update counts, but keep it simple
          return { ...p, ...updatedFields };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCategories((prevCat) =>
      prevCat.map((c) =>
        c.name === prod.category ? { ...c, productCount: Math.max(0, c.productCount - 1) } : c
      )
    );
  };

  // CATEGORY CRUD IMPLEMENTATION
  const addCategory = (newCat: Omit<Category, "id" | "productCount">) => {
    const newId = `C-${categories.length + 1}`;
    const c: Category = {
      ...newCat,
      id: newId,
      productCount: 0
    };
    setCategories((prev) => [...prev, c]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // COUPON CRUD IMPLEMENTATION
  const addCoupon = (newCoup: Omit<Coupon, "id" | "usageCount">) => {
    const newId = `CP-${coupons.length + 1}`;
    const c: Coupon = {
      ...newCoup,
      id: newId,
      usageCount: 0
    };
    setCoupons((prev) => [c, ...prev]);
  };

  const updateCoupon = (id: string, updatedFields: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // FLASH SALE CRUD IMPLEMENTATION
  const addFlashSale = (newSale: Omit<FlashSale, "id">) => {
    const newId = `FS-${flashSales.length + 1}`;
    const s: FlashSale = {
      ...newSale,
      id: newId
    };
    setFlashSales((prev) => [s, ...prev]);
  };

  const updateFlashSale = (id: string, updatedFields: Partial<FlashSale>) => {
    setFlashSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteFlashSale = (id: string) => {
    setFlashSales((prev) => prev.filter((s) => s.id !== id));
  };

  // OTHER STATUS CHANGES
  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const updateVendorStatus = (id: string, status: Vendor["status"]) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
  };

  const updateUserStatus = (id: string, status: User["status"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
  };

  const updateHubStatus = (id: string, status: FladoHub["status"]) => {
    setHubs((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status } : h))
    );
  };

  const updateRiderStatus = (id: string, status: FladoRider["status"]) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        coupons,
        flashSales,
        orders,
        vendors,
        users,
        hubs,
        riders,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addFlashSale,
        updateFlashSale,
        deleteFlashSale,
        updateOrderStatus,
        updateVendorStatus,
        updateUserStatus,
        updateHubStatus,
        updateRiderStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
