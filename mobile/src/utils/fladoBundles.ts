export interface FladoBundle {
  id: string;
  name: string;
  productIds: string[];
  totalPrice: number;
  originalPrice: number;
  savings: number;
  imageUrl: string;
  badge?: string;
}

export const fladoBundlesData: FladoBundle[] = [
  {
    id: 'bundle-breakfast',
    name: '🌅 Classic Morning Breakfast Combo',
    productIds: ['f-v-1', 'f-v-2', 'd-b-1'],
    totalPrice: 199,
    originalPrice: 245,
    savings: 46,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    badge: 'Morning Special'
  },
  {
    id: 'bundle-tea-time',
    name: '☕ Tea Time Chai & Biscuits Combo',
    productIds: ['s-b-6', 's-b-7', 'd-b-9'],
    totalPrice: 110,
    originalPrice: 140,
    savings: 30,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
    badge: 'Best Seller'
  },
  {
    id: 'bundle-midnight',
    name: '🍿 Party & Movie Munchies Combo',
    productIds: ['s-b-1', 's-b-4', 's-b-8'],
    totalPrice: 180,
    originalPrice: 235,
    savings: 55,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop',
    badge: 'Popular'
  },
  {
    id: 'bundle-salad',
    name: '🥗 Fresh Organic Farm Salad Basket',
    productIds: ['f-v-8', 'f-v-9', 'f-v-13'],
    totalPrice: 99,
    originalPrice: 150,
    savings: 51,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    badge: '100% Organic'
  },
  {
    id: 'bundle-cleaning',
    name: '🧹 Complete Home Clean & Hygiene Pack',
    productIds: ['h-c-1', 'h-c-2', 'h-c-3'],
    totalPrice: 380,
    originalPrice: 460,
    savings: 80,
    imageUrl: 'https://images.unsplash.com/photo-1583947265567-68cf4f3cd27d?w=400&h=300&fit=crop',
    badge: 'Super Value'
  },
  {
    id: 'bundle-monsoon',
    name: '🌧️ Monsoon French Fries & Hot Cocoa Pack',
    productIds: ['f-r-1', 'f-r-3', 's-b-6'],
    totalPrice: 299,
    originalPrice: 380,
    savings: 81,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    badge: 'Seasonal Hot'
  },
  {
    id: 'bundle-monthly-ration',
    name: '🌾 Monthly Ration Saver Starter Kit',
    productIds: ['a-r-1', 'a-r-4', 'a-r-6'],
    totalPrice: 899,
    originalPrice: 1095,
    savings: 196,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    badge: 'Mega Saver'
  },
  {
    id: 'bundle-beauty-glow',
    name: '✨ Organic Skincare & Bath Glow Kit',
    productIds: ['p-c-1', 'p-c-2', 'p-c-3'],
    totalPrice: 599,
    originalPrice: 774,
    savings: 175,
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    badge: 'Trending Glow'
  }
];
