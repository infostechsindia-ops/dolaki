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
    name: 'Classic Breakfast Combo',
    productIds: ['flado-d-b-1', 'flado-d-b-9', 'flado-d-b-8'], // Toned Milk, Sandwich Bread, Brown Eggs
    totalPrice: 199,
    originalPrice: 245,
    savings: 46,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    badge: 'Saver Pack'
  },
  {
    id: 'bundle-midnight',
    name: 'Instant Midnight Feast',
    productIds: ['flado-f-r-6', 'flado-s-b-10', 'flado-s-b-1'], // Maggi, Coca-Cola, Lay's Classic
    totalPrice: 259,
    originalPrice: 305,
    savings: 46,
    imageUrl: 'https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=400&h=300&fit=crop',
    badge: 'Popular'
  },
  {
    id: 'bundle-salad',
    name: 'Fresh Farm Salad Basket',
    productIds: ['flado-f-v-8', 'flado-f-v-13', 'flado-f-v-10'], // Tomato, English Cucumber, Red Onions
    totalPrice: 99,
    originalPrice: 150,
    savings: 51,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    badge: '100% Organic'
  },
  {
    id: 'bundle-cleaning',
    name: 'Complete Home Clean Kit',
    productIds: ['flado-h-c-9', 'flado-h-c-4', 'flado-h-c-5'], // Vim Gel, Harpic toilet, Lizol floor
    totalPrice: 429,
    originalPrice: 525,
    savings: 96,
    imageUrl: 'https://images.unsplash.com/photo-1583947265567-68cf4f3cd27d?w=400&h=300&fit=crop',
    badge: 'Super Value'
  },
  {
    id: 'bundle-tea',
    name: 'Gourmet Afternoon Tea Set',
    productIds: ['flado-d-b-13', 'flado-b-b-1', 'flado-s-b-8'], // Greek Yogurt, Good Day Cookies, Red Label Tea
    totalPrice: 289,
    originalPrice: 335,
    savings: 46,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop'
  },
  {
    id: 'bundle-baby',
    name: 'Complete Baby Essentials Pack',
    productIds: ['flado-b-c-2', 'flado-b-c-3', 'flado-b-c-1'], // Himalaya wipes, Himalaya soap, Pampers diapers
    totalPrice: 989,
    originalPrice: 1289,
    savings: 300,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&h=300&fit=crop',
    badge: 'Parent\'s Choice'
  },
  {
    id: 'bundle-wellness',
    name: 'First-Aid Wellness Kit',
    productIds: ['flado-h-p-1', 'flado-h-p-2', 'flado-h-p-5'], // Dolo 650, Volini Spray, Limcee
    totalPrice: 209,
    originalPrice: 230,
    savings: 21,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop'
  },
  {
    id: 'bundle-party',
    name: 'Party Chips & Nachos Combo',
    productIds: ['flado-s-b-1', 'flado-s-b-2', 'flado-s-b-3'], // Lays Salted, Lays Masala, Doritos Nachos
    totalPrice: 169,
    originalPrice: 190,
    savings: 21,
    imageUrl: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=400&h=300&fit=crop',
    badge: 'Weekend Special'
  }
];
