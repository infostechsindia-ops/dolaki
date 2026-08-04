import Constants from 'expo-constants';
import { MOCK_PRODUCTS, Product } from './mockData';
import { fladoProductsData } from './fladoProducts';
import { fladoDarkstoresData, calculateDistance } from './fladoDarkstores';

// Dynamic host extraction for physical iOS/Android devices (LAN), USB, and Emulators
const debuggerHost = Constants.expoConfig?.hostUri || '';
const extractedHost = debuggerHost ? debuggerHost.split(':')[0] : '';
const host = extractedHost || '192.168.1.124';
const BASE_URL = `http://${host}:5000/api`;

interface BackendProduct {
  id: string;
  vendorId: string;
  categoryId: string;
  title: string;
  sku: string;
  description: string;
  basePrice: number;
  discountPrice: number | null;
  isActive: boolean;
  colorsJson: string;
  sizesJson: string;
  isQuickCommerce: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  subCategory?: string;
  createdAt: string;
  updatedAt: string;
}

// Safe fetch wrapper that handles network/server errors and falls back gracefully
async function safeFetch<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000); // 5 second timeout for fast fallback
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    
    clearTimeout(id);
    
    if (response.ok) {
      const data = await response.json();
      return data as T;
    }
  } catch (error) {
    console.log(`Backend API [${url}] down or unreachable. Using mock offline data.`, error);
  }
  
  if (fallbackData !== undefined) {
    return fallbackData;
  }
  throw new Error("Network request failed and no fallback data provided");
}

function mapBackendProductList(data: any[], categories: any[]): Product[] {
  const categoryMap = new Map<string, string>();
  if (categories && Array.isArray(categories)) {
    categories.forEach(c => {
      if (c && c.id && c.name) {
        categoryMap.set(c.id, c.name);
      }
    });
  }

  return data.map(item => {
    if (item && 'name' in item) {
      return item as Product;
    }
    
    const bp = item as BackendProduct;
    let colors: string[] = [];
    let sizes: string[] = [];
    try {
      colors = bp.colorsJson ? JSON.parse(bp.colorsJson) : [];
    } catch (e) {}
    try {
      sizes = bp.sizesJson ? JSON.parse(bp.sizesJson) : [];
    } catch (e) {}

    return {
      id: bp.id,
      name: bp.title || '',
      price: bp.discountPrice ?? bp.basePrice,
      originalPrice: bp.basePrice,
      image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      category: categoryMap.get(bp.categoryId) || 'General',
      description: bp.description || '',
      rating: bp.rating ?? 4.5,
      reviews: [],
      isFlado: bp.isQuickCommerce ?? false,
      colors,
      sizes,
      stock: 20,
      subCategory: bp.subCategory
    };
  });
}

export const api = {
  // Products API
  getProducts: async (): Promise<Product[]> => {
    const rawProducts = await safeFetch<any[]>(`${BASE_URL}/products`, {}, []);
    if (rawProducts.length === 0) {
      return [...MOCK_PRODUCTS, ...fladoProductsData];
    }
    const categories = await safeFetch<any[]>(`${BASE_URL}/products/categories`, {}, []);
    return mapBackendProductList(rawProducts, categories);
  },

  getProductById: async (id: string): Promise<Product> => {
    const fallback = MOCK_PRODUCTS.find(p => p.id === id) || fladoProductsData.find(p => p.id === id) || MOCK_PRODUCTS[0];
    const data = await safeFetch<any>(`${BASE_URL}/products/${id}`, {}, fallback);
    if (data && 'name' in data) {
      return data as Product;
    }
    const categories = await safeFetch<any[]>(`${BASE_URL}/products/categories`, {}, []);
    const mapped = mapBackendProductList([data], categories);
    return mapped[0];
  },

  // Auth / Login API
  login: async (phone: string, email: string): Promise<{ success: boolean; token: string; user: { name: string; email: string; phone: string } }> => {
    const fallback = {
      success: true,
      token: "mock-jwt-token",
      user: { name: "Guest User", email: email || "guest@auramart.com", phone }
    };
    return safeFetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ phone, email })
    }, fallback);
  },

  registerStore: async (vendorId: string, storeData: any): Promise<{ success: boolean; shopId: string; message: string }> => {
    return safeFetch(`${BASE_URL}/flado/shops/register`, {
      method: 'POST',
      body: JSON.stringify({ vendorId, ...storeData })
    }, { success: true, shopId: `shop-${Date.now()}`, message: 'Store registered successfully' });
  },

  // Orders API
  getOrders: async (): Promise<any[]> => {
    return safeFetch<any[]>(`${BASE_URL}/orders`, {}, []);
  },

  placeOrder: async (orderData: any): Promise<{ success: boolean; orderId: string }> => {
    const mockOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const fallback = {
      success: true,
      orderId: mockOrderId
    };
    return safeFetch(`${BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    }, fallback);
  },

  getSduiLayout: async (): Promise<any> => {
    return safeFetch(`${BASE_URL}/sdui/homepage`, {}, null);
  },

  getFladoLayout: async (): Promise<any> => {
    return safeFetch(`${BASE_URL}/sdui/flado`, {}, null);
  },

  // Flado Merchant/Store Endpoints
  getNearbyStores: async (lat: number, lng: number): Promise<any[]> => {
    const apiStores = await safeFetch<any[]>(`${BASE_URL}/flado/stores/nearby?lat=${lat}&lng=${lng}`, {}, []);
    if (apiStores && apiStores.length >= 4) {
      return apiStores;
    }
    // Return full local geo-routed darkstores list
    return fladoDarkstoresData.map(s => {
      const d = calculateDistance(lat, lng, s.lat, s.lng);
      return {
        ...s,
        distance: d,
        eta: Math.max(Math.round(s.basePrepTime + d * s.etaSpeed), 8),
        vendorId: s.id
      };
    });
  },

  getStoreByVendor: async (vendorId: string): Promise<any> => {
    const fallback = {
      id: `store-${vendorId}`,
      vendorId,
      name: 'My Local Grocery Shop',
      address: 'Station Road, Muzaffarpur, Bihar 842001',
      lat: 26.1209,
      lng: 85.3647,
      serviceRadiusKm: 5.0,
      ownerName: 'Ramesh Yadav',
      contactPhone: '+91 99999 88888',
      isActive: true
    };
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}`, {}, fallback);
  },

  updateStoreRange: async (vendorId: string, rangeKm: number, lat?: number, lng?: number): Promise<any> => {
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/range`, {
      method: 'PUT',
      body: JSON.stringify({ rangeKm, lat, lng })
    }, { success: true });
  },

  getStoreProducts: async (vendorId: string): Promise<Product[]> => {
    const raw = await safeFetch<any[]>(`${BASE_URL}/flado/products?vendorId=${vendorId}`, {}, []);
    if (!raw || raw.length < 15) {
      // Return full 35+ product line to completely fill home screen shelves & category spotlights
      return fladoProductsData.map(p => ({
        ...p,
        vendorId
      }));
    }
    
    // map backend products using category map
    return raw.map(bp => ({
      id: bp.id,
      name: bp.title || '',
      price: bp.discountPrice ?? bp.basePrice,
      originalPrice: bp.basePrice,
      image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      category: bp.categoryId || 'Groceries',
      description: bp.description || '',
      rating: bp.rating ?? 4.5,
      reviews: [],
      isFlado: true,
      colors: [],
      sizes: [],
      stock: 30,
      weight: bp.sizesJson ? JSON.parse(bp.sizesJson)[0] || '500g' : '500g',
      subCategory: bp.subCategory
    }));
  },

  addStoreProduct: async (vendorId: string, productData: any): Promise<any> => {
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData)
    }, { success: true });
  },

  updateStoreProduct: async (vendorId: string, productId: string, productData: any): Promise<any> => {
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }, { success: true });
  },

  deleteStoreProduct: async (vendorId: string, productId: string): Promise<any> => {
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/products/${productId}`, {
      method: 'DELETE'
    }, { success: true });
  },

  getOrdersForVendor: async (vendorId: string): Promise<any[]> => {
    const fallback = [
      {
        id: 'ORD-982142',
        customerId: 'cust-12',
        totalAmount: 320,
        status: 'PREPARING',
        deliveryMinutes: 10,
        createdAt: new Date().toISOString(),
        itemsSummary: '2x Organic Bananas, 1x Gold Full Cream Milk 1L',
        shippingAddress: JSON.stringify({ name: 'Arif Al Nukhbah', phone: '+91 99999 88888', address: 'Bandra Sea Breeze, Floor 4, Flat 12A' })
      },
      {
        id: 'ORD-541295',
        customerId: 'cust-35',
        totalAmount: 180,
        status: 'DELIVERED',
        deliveryMinutes: 12,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        itemsSummary: '1x Gourmet Sourdough Bread, 1x Classic Potato Chips 150g',
        shippingAddress: JSON.stringify({ name: 'Kunal Kapoor', phone: '+91 98888 77777', address: 'Turner Road, Bandra West, flat 5B' })
      }
    ];
    return safeFetch<any[]>(`${BASE_URL}/flado/stores/vendor/${vendorId}/orders`, {}, fallback);
  },

  updateOrderStatus: async (vendorId: string, orderId: string, status: string): Promise<any> => {
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }, { success: true });
  }
};

