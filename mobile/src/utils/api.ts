import Constants from 'expo-constants';
import { MOCK_PRODUCTS, Product } from './mockData';
import { fladoProductsData } from './fladoProducts';
import { fladoDarkstoresData, calculateDistance } from './fladoDarkstores';

// Dynamic host extraction for physical iOS/Android devices (LAN), USB, and Emulators
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  const extractedHost = debuggerHost ? debuggerHost.split(':')[0] : '';
  const host = extractedHost || 'localhost';
  return `http://${host}:5000`;
};
export const BASE_URL = `${getBaseUrl()}/api/v1`;

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
  const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
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
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data as T;
      }
      return data as T;
    } else {
      if (!isDemo) {
        throw new Error(`API returned status ${response.status}`);
      }
    }
  } catch (error) {
    if (!isDemo) {
      throw error;
    }
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
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const rawProducts = await safeFetch<any[]>(`${BASE_URL}/products`, {}, []);
    if (rawProducts.length === 0) {
      return isDemo ? [...MOCK_PRODUCTS, ...fladoProductsData] : [];
    }
    const categories = await safeFetch<any[]>(`${BASE_URL}/products/categories`, {}, []);
    return mapBackendProductList(rawProducts, categories);
  },

  getProductById: async (id: string): Promise<Product> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo 
      ? (MOCK_PRODUCTS.find(p => p.id === id) || fladoProductsData.find(p => p.id === id) || MOCK_PRODUCTS[0])
      : undefined;
    const data = await safeFetch<any>(`${BASE_URL}/products/${id}`, {}, fallback);
    if (!data) {
      throw new Error(`Product with ID ${id} not found`);
    }
    if (data && 'name' in data) {
      return data as Product;
    }
    const categories = await safeFetch<any[]>(`${BASE_URL}/products/categories`, {}, []);
    const mapped = mapBackendProductList([data], categories);
    return mapped[0];
  },

  // Auth / Login API
  login: async (phone: string, email: string): Promise<{ success: boolean; token: string; user: { name: string; email: string; phone: string } }> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo 
      ? {
          success: true,
          token: "mock-jwt-token",
          user: { name: "Guest User", email: email || "guest@auramart.com", phone }
        }
      : undefined;
    return safeFetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ phone, email })
    }, fallback);
  },

  registerStore: async (vendorId: string, storeData: any): Promise<{ success: boolean; shopId: string; message: string }> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo 
      ? { success: true, shopId: `shop-${Date.now()}`, message: 'Store registered successfully' }
      : undefined;
    return safeFetch(`${BASE_URL}/flado/shops/register`, {
      method: 'POST',
      body: JSON.stringify({ vendorId, ...storeData })
    }, fallback);
  },

  // Orders API
  getOrders: async (): Promise<any[]> => {
    return safeFetch<any[]>(`${BASE_URL}/orders`, {}, []);
  },

  placeOrder: async (orderData: any): Promise<{ success: boolean; orderId: string }> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const mockOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const fallback = isDemo 
      ? {
          success: true,
          orderId: mockOrderId
        }
      : undefined;
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
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const apiStores = await safeFetch<any[]>(`${BASE_URL}/flado/stores/nearby?lat=${lat}&lng=${lng}`, {}, []);
    if (!isDemo) {
      return apiStores;
    }
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
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo 
      ? {
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
        }
      : undefined;
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}`, {}, fallback);
  },

  updateStoreRange: async (vendorId: string, rangeKm: number, lat?: number, lng?: number): Promise<any> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo ? { success: true } : undefined;
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/range`, {
      method: 'PUT',
      body: JSON.stringify({ rangeKm, lat, lng })
    }, fallback);
  },

  getStoreProducts: async (vendorId: string): Promise<Product[]> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const raw = await safeFetch<any[]>(`${BASE_URL}/flado/products?vendorId=${vendorId}`, {}, []);
    
    if (!isDemo) {
      if (!raw || raw.length === 0) return [];
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
        stock: bp.stockQuantity ?? 0,
        weight: bp.sizesJson ? JSON.parse(bp.sizesJson)[0] || '500g' : '500g',
        subCategory: bp.subCategory
      }));
    }

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
      stock: bp.stockQuantity ?? 30,
      weight: bp.sizesJson ? JSON.parse(bp.sizesJson)[0] || '500g' : '500g',
      subCategory: bp.subCategory
    }));
  },

  addStoreProduct: async (vendorId: string, productData: any): Promise<any> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo ? { success: true } : undefined;
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData)
    }, fallback);
  },

  updateStoreProduct: async (vendorId: string, productId: string, productData: any): Promise<any> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo ? { success: true } : undefined;
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }, fallback);
  },

  deleteStoreProduct: async (vendorId: string, productId: string): Promise<any> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo ? { success: true } : undefined;
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/products/${productId}`, {
      method: 'DELETE'
    }, fallback);
  },

  getOrdersForVendor: async (vendorId: string): Promise<any[]> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo 
      ? [
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
        ]
      : [];
    return safeFetch<any[]>(`${BASE_URL}/flado/stores/vendor/${vendorId}/orders`, {}, fallback);
  },

  updateOrderStatus: async (vendorId: string, orderId: string, status: string): Promise<any> => {
    const isDemo = process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES === 'true';
    const fallback = isDemo ? { success: true } : undefined;
    return safeFetch(`${BASE_URL}/flado/stores/vendor/${vendorId}/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }, fallback);
  },

  // Brands API (FEAT-003)
  getBrands: async (opts: { search?: string; page?: number; pageSize?: number } = {}): Promise<{ data: any[]; meta: any }> => {
    const params = new URLSearchParams();
    if (opts.search) params.set('search', opts.search);
    if (opts.page) params.set('page', String(opts.page));
    if (opts.pageSize) params.set('pageSize', String(opts.pageSize));
    const qs = params.toString();
    const res = await safeFetch<any>(`${BASE_URL}/brands${qs ? `?${qs}` : ''}`, {}, null);
    if (res && typeof res === 'object' && 'data' in res) {
      return res;
    }
    if (Array.isArray(res)) {
      return { data: res, meta: { total: res.length, page: 1, pageSize: 50, hasNextPage: false } };
    }
    return { data: [], meta: { total: 0, page: 1, pageSize: 50, hasNextPage: false } };
  },

  getBrandBySlug: async (slug: string): Promise<any | null> => {
    return safeFetch<any | null>(`${BASE_URL}/brands/${slug}`, {}, null);
  },

  getProductsByBrand: async (slug: string, category?: string): Promise<Product[]> => {
    const params = new URLSearchParams({ brand: slug });
    if (category) params.set('category', category);
    const rawProducts = await safeFetch<any>(`${BASE_URL}/products?${params.toString()}`, {}, null);
    const items = (rawProducts && typeof rawProducts === 'object' && 'data' in rawProducts) ? rawProducts.data : (Array.isArray(rawProducts) ? rawProducts : []);
    if (items.length === 0) {
      const all = await api.getProducts();
      return all.filter(p => p.brand && p.brand.toLowerCase() === slug.toLowerCase());
    }
    const categories = await safeFetch<any[]>(`${BASE_URL}/products/categories`, {}, []);
    return mapBackendProductList(items, categories);
  }
};


