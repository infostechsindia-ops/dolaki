import { Product } from './mockData';

interface CompactTemplate {
  category: string;
  subCategory: string;
  brand: string;
  items: {
    id: string;
    name: string;
    weight: string;
    basePrice: number;
    discountPrice?: number;
    unsplashId: string;
  }[];
}

const templates: CompactTemplate[] = [
  // 1. Fruits & Vegetables
  {
    category: 'fruits-vegetables',
    subCategory: 'Fresh Fruits',
    brand: 'Flado Fresh',
    items: [
      { id: 'f-v-1', name: 'Organic Bananas', weight: 'Pack of 6', basePrice: 80, discountPrice: 60, unsplashId: 'photo-1571771894821-ce9b6c11b08e' },
      { id: 'f-v-2', name: 'Royal Gala Apples', weight: '4 pcs (approx 500g)', basePrice: 160, discountPrice: 129, unsplashId: 'photo-1560806887-1e4cd0b6cbd6' },
      { id: 'f-v-3', name: 'Fresh Pomegranate (Anar)', weight: '2 pcs (approx 400g)', basePrice: 200, discountPrice: 159, unsplashId: 'photo-1601004890684-d8cbf643f5f2' },
      { id: 'f-v-4', name: 'Nagpur Oranges', weight: '1 kg', basePrice: 120, discountPrice: 89, unsplashId: 'photo-1611080626919-7cf5a9dbab5b' },
      { id: 'f-v-5', name: 'Black Grapes (Seedless)', weight: '500g', basePrice: 150, discountPrice: 119, unsplashId: 'photo-1537640538966-79f369143f8f' },
      { id: 'f-v-6', name: 'Papaya Semi-Ripe', weight: '1 pc (approx 1kg)', basePrice: 90, discountPrice: 69, unsplashId: 'photo-1526318896980-cf78c088247c' },
      { id: 'f-v-7', name: 'Fresh Kiwi Imported', weight: 'Pack of 3', basePrice: 130, discountPrice: 99, unsplashId: 'photo-1585059895524-72359e06133a' }
    ]
  },
  {
    category: 'fruits-vegetables',
    subCategory: 'Fresh Vegetables',
    brand: 'Flado Fresh',
    items: [
      { id: 'f-v-8', name: 'Hybrid Tomatoes', weight: '500g', basePrice: 40, discountPrice: 29, unsplashId: 'photo-1595855759920-86582396756a' },
      { id: 'f-v-9', name: 'Farm Potatoes (Alloo)', weight: '1 kg', basePrice: 50, discountPrice: 38, unsplashId: 'photo-1518977676601-b53f82aba655' },
      { id: 'f-v-10', name: 'Red Onions (Pyaaz)', weight: '1 kg', basePrice: 60, discountPrice: 45, unsplashId: 'photo-1620574387735-3624d75b2dbc' },
      { id: 'f-v-11', name: 'Local Cauliflower (Gobi)', weight: '1 pc (approx 600g)', basePrice: 70, discountPrice: 49, unsplashId: 'photo-1568584711298-bc29f69238fb' },
      { id: 'f-v-12', name: 'Green Capsicum (Shimla Mirch)', weight: '250g', basePrice: 40, discountPrice: 32, unsplashId: 'photo-1563565088-91246b087fb3' },
      { id: 'f-v-13', name: 'English Cucumber', weight: '500g', basePrice: 50, discountPrice: 39, unsplashId: 'photo-1449300079323-02e209d9d3a6' },
      { id: 'f-v-14', name: 'Green Peas (Matar)', weight: '250g', basePrice: 60, discountPrice: 48, unsplashId: 'photo-1587996573042-8772477f6479' }
    ]
  },
  {
    category: 'fruits-vegetables',
    subCategory: 'Herbs & Seasonings',
    brand: 'Flado Fresh',
    items: [
      { id: 'f-v-15', name: 'Fresh Coriander (Dhania)', weight: '100g', basePrice: 20, discountPrice: 15, unsplashId: 'photo-1514986872756-34324f3cdbe1' },
      { id: 'f-v-16', name: 'Fresh Mint (Pudina)', weight: '100g', basePrice: 25, discountPrice: 18, unsplashId: 'photo-1615485290382-441e4d049cb5' },
      { id: 'f-v-17', name: 'Spicy Green Chilies', weight: '100g', basePrice: 30, discountPrice: 20, unsplashId: 'photo-1588166524941-3bf61a9c41db' },
      { id: 'f-v-18', name: 'Fresh Ginger (Adrak)', weight: '250g', basePrice: 70, discountPrice: 55, unsplashId: 'photo-1599940824399-b87987ceb72a' },
      { id: 'f-v-19', name: 'Fresh Garlic (Lahsun)', weight: '200g', basePrice: 80, discountPrice: 59, unsplashId: 'photo-1540148426945-6cf22a6b2383' }
    ]
  },

  // 2. Dairy, Bread & Eggs
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Milk & Cream',
    brand: 'Amul',
    items: [
      { id: 'd-b-1', name: 'Amul Taaza Toned Milk', weight: '1L Pouch', basePrice: 75, discountPrice: 72, unsplashId: 'photo-1563636619-e9143da7973b' },
      { id: 'd-b-2', name: 'Amul Gold Full Cream Milk', weight: '1L Pack', basePrice: 82, discountPrice: 79, unsplashId: 'photo-1550583724-b2692b85b150' },
      { id: 'd-b-3', name: 'Mother Dairy Fresh Cream 25% Fat', weight: '250ml Pack', basePrice: 70, discountPrice: 65, unsplashId: 'photo-1618245472463-b37f44d9f67a' }
    ]
  },
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Butter & Cheese',
    brand: 'Amul',
    items: [
      { id: 'd-b-4', name: 'Amul Salted Butter', weight: '500g Pack', basePrice: 275, discountPrice: 265, unsplashId: 'photo-1589985270826-4b7bb135bc9d' },
      { id: 'd-b-5', name: 'Amul Cheese Slices (Processed)', weight: '200g (10 slices)', basePrice: 160, discountPrice: 148, unsplashId: 'photo-1552763487-173f2fb10d62' },
      { id: 'd-b-6', name: 'Amul Mozzarella Pizza Cheese', weight: '200g Grated', basePrice: 140, discountPrice: 129, unsplashId: 'photo-1608686207856-001b95cf60ca' }
    ]
  },
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Eggs',
    brand: 'Flado Fresh',
    items: [
      { id: 'd-b-7', name: 'Farm Fresh White Eggs', weight: 'Pack of 10', basePrice: 90, discountPrice: 75, unsplashId: 'photo-1516448620398-c5f44bf9f441' },
      { id: 'd-b-8', name: 'Organic Brown Eggs', weight: 'Pack of 6', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1506976785307-8732e854ad03' }
    ]
  },
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Bread & Buns',
    brand: 'Britannia',
    items: [
      { id: 'd-b-9', name: 'Britannia 100% Whole Wheat Bread', weight: '400g Pack', basePrice: 55, discountPrice: 48, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'd-b-10', name: 'Multigrain Sandwich Bread', weight: '400g Pack', basePrice: 65, discountPrice: 58, unsplashId: 'photo-1549931319-a545dcf3bc73' }
    ]
  },

  // 3. Atta, Rice & Dal
  {
    category: 'atta-rice-dal',
    subCategory: 'Atta & Flours',
    brand: 'Aashirvaad',
    items: [
      { id: 'a-r-1', name: 'Aashirvaad Shuddh Chakki Atta', weight: '5 kg', basePrice: 260, discountPrice: 225, unsplashId: 'photo-1586201375761-83865001e31c' },
      { id: 'a-r-2', name: 'Aashirvaad Multigrain Atta', weight: '5 kg', basePrice: 320, discountPrice: 279, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'a-r-3', name: 'Fortune Besan (Gram Flour)', weight: '500g', basePrice: 75, discountPrice: 62, unsplashId: 'photo-1586201375761-83865001e31c' }
    ]
  },
  {
    category: 'atta-rice-dal',
    subCategory: 'Rice Products',
    brand: 'Daawat',
    items: [
      { id: 'a-r-4', name: 'Daawat Super Basmati Rice', weight: '5 kg', basePrice: 650, discountPrice: 549, unsplashId: 'photo-1586201375761-83865001e31c' },
      { id: 'a-r-5', name: 'Fortune Everyday Basmati Rice', weight: '1 kg', basePrice: 110, discountPrice: 89, unsplashId: 'photo-1586201375761-83865001e31c' }
    ]
  },
  {
    category: 'atta-rice-dal',
    subCategory: 'Pulses & Dals',
    brand: 'Tata Sampann',
    items: [
      { id: 'a-r-6', name: 'Tata Sampann Unpolished Toor Dal', weight: '1 kg', basePrice: 185, discountPrice: 159, unsplashId: 'photo-1547058881-aa0edd92aab3' },
      { id: 'a-r-7', name: 'Tata Sampann Moong Dal Split', weight: '1 kg', basePrice: 160, discountPrice: 135, unsplashId: 'photo-1547058881-aa0edd92aab3' },
      { id: 'a-r-8', name: 'Tata Sampann Chana Dal', weight: '1 kg', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1547058881-aa0edd92aab3' }
    ]
  },

  // 4. Snacks & Beverages
  {
    category: 'snacks-beverages',
    subCategory: 'Chips & Crisps',
    brand: 'Lay\'s',
    items: [
      { id: 's-b-1', name: 'Lay\'s Classic Salted Potato Chips', weight: '50g Pack', basePrice: 20, discountPrice: 18, unsplashId: 'photo-1566478989037-eec170784d0b' },
      { id: 's-b-2', name: 'Lay\'s India\'s Magic Masala', weight: '50g Pack', basePrice: 20, discountPrice: 18, unsplashId: 'photo-1566478989037-eec170784d0b' },
      { id: 's-b-3', name: 'Doritos Nacho Cheese Chips', weight: '82g Pack', basePrice: 50, discountPrice: 42, unsplashId: 'photo-1566478989037-eec170784d0b' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Chocolates & Candies',
    brand: 'Cadbury',
    items: [
      { id: 's-b-4', name: 'Cadbury Dairy Milk Silk Chocolate', weight: '150g Bar', basePrice: 175, discountPrice: 149, unsplashId: 'photo-1548907040-4d42b52145ca' },
      { id: 's-b-5', name: 'KitKat 4-Finger Chocolate', weight: '38g Pack', basePrice: 30, discountPrice: 25, unsplashId: 'photo-1548907040-4d42b52145ca' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Tea & Coffee',
    brand: 'Nestle',
    items: [
      { id: 's-b-6', name: 'Nescafe Classic Instant Coffee Jar', weight: '100g Jar', basePrice: 340, discountPrice: 295, unsplashId: 'photo-1514432324607-a09d9b4aefdd' },
      { id: 's-b-7', name: 'Tata Tea Gold Premium Black Tea', weight: '500g Pack', basePrice: 320, discountPrice: 275, unsplashId: 'photo-1576092768241-dec231879fc3' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Cold Drinks & Juices',
    brand: 'Coca-Cola',
    items: [
      { id: 's-b-8', name: 'Coca-Cola Soft Drink PET Bottle', weight: '750ml', basePrice: 40, discountPrice: 35, unsplashId: 'photo-1554866585-cd94860890b7' },
      { id: 's-b-9', name: 'Real Fruit Power Mango Juice', weight: '1L Tetra', basePrice: 110, discountPrice: 89, unsplashId: 'photo-1613478223719-2ab802602423' }
    ]
  },

  // 5. Frozen & Ready Meals
  {
    category: 'frozen-ready-meals',
    subCategory: 'Ready to Cook Fries & Nuggets',
    brand: 'McCain',
    items: [
      { id: 'f-r-1', name: 'McCain French Fries Crispy', weight: '420g Pack', basePrice: 140, discountPrice: 115, unsplashId: 'photo-1582298538104-fe2e74c27f59' },
      { id: 'f-r-2', name: 'McCain Veggie Nuggets', weight: '320g Pack', basePrice: 150, discountPrice: 125, unsplashId: 'photo-1582298538104-fe2e74c27f59' }
    ]
  },
  {
    category: 'frozen-ready-meals',
    subCategory: 'Instant Noodles & Soups',
    brand: 'Nestle',
    items: [
      { id: 'f-r-3', name: 'Maggi 2-Minute Masala Noodles', weight: 'Pack of 12 (840g)', basePrice: 168, discountPrice: 144, unsplashId: 'photo-1569718212165-3a8278d5f624' },
      { id: 'f-r-4', name: 'Knorr Sweet Corn Veg Soup', weight: '43g Pack', basePrice: 40, discountPrice: 32, unsplashId: 'photo-1547592180-85f173990554' }
    ]
  },

  // 6. Household & Cleaning
  {
    category: 'household-cleaning',
    subCategory: 'Detergents & Liquid Soaps',
    brand: 'HUL',
    items: [
      { id: 'h-c-1', name: 'Surf Excel Easy Wash Detergent Powder', weight: '1 kg', basePrice: 140, discountPrice: 120, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-2', name: 'Vim Dishwash Liquid Gel Lemon', weight: '750ml Bottle', basePrice: 180, discountPrice: 149, unsplashId: 'photo-1583394838336-acd977736f90' }
    ]
  },
  {
    category: 'household-cleaning',
    subCategory: 'Toilet Cleaners & Disinfectants',
    brand: 'Reckitt',
    items: [
      { id: 'h-c-3', name: 'Harpic Powerplus Toilet Cleaner', weight: '1L Bottle', basePrice: 215, discountPrice: 179, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-4', name: 'Dettol Disinfectant Surface Cleaner Liquid', weight: '1L Bottle', basePrice: 230, discountPrice: 195, unsplashId: 'photo-1584308666744-24d5c474f2ae' }
    ]
  },

  // 7. Personal Care & Beauty
  {
    category: 'personal-care',
    subCategory: 'Shampoos & Soaps',
    brand: 'Dove',
    items: [
      { id: 'p-c-1', name: 'Dove Daily Shine Shampoo', weight: '340ml Bottle', basePrice: 320, discountPrice: 256, unsplashId: 'photo-1596462502278-27bfdc403348' },
      { id: 'p-c-2', name: 'Dove Cream Beauty Bathing Soap Bar', weight: 'Pack of 3 (375g)', basePrice: 195, discountPrice: 165, unsplashId: 'photo-1607006482602-76ca0fd2f453' }
    ]
  },
  {
    category: 'personal-care',
    subCategory: 'Face & Skincare',
    brand: 'Mamaearth',
    items: [
      { id: 'p-c-3', name: 'Mamaearth Vitamin C Face Wash', weight: '100ml Tube', basePrice: 259, discountPrice: 219, unsplashId: 'photo-1556228720-195a672e8a03' },
      { id: 'p-c-4', name: 'Nivea Soft Light Moisturiser Cream', weight: '200ml Tub', basePrice: 330, discountPrice: 269, unsplashId: 'photo-1596462502278-27bfdc403348' }
    ]
  },

  // 8. Baby Care
  {
    category: 'baby-care',
    subCategory: 'Baby Diapers & Wipes',
    brand: 'Pampers',
    items: [
      { id: 'b-c-1', name: 'Pampers All-in-One Pants Medium Diapers', weight: '42 Count Pack', basePrice: 799, discountPrice: 649, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' },
      { id: 'b-c-2', name: 'Himalaya Gentle Baby Wipes with Aloe', weight: '72 Wipes Pack', basePrice: 190, discountPrice: 145, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' }
    ]
  },

  // 9. Health & Pharmacy
  {
    category: 'health-pharmacy',
    subCategory: 'OTC Medicines & Supplements',
    brand: 'Himalaya',
    items: [
      { id: 'h-p-1', name: 'Himalaya Ashvagandha General Health Tablets', weight: '60 Tablets', basePrice: 220, discountPrice: 180, unsplashId: 'photo-1584308666744-24d5c474f2ae' },
      { id: 'h-p-2', name: 'Revital H Daily Health Supplement Capsules', weight: '30 Capsules', basePrice: 330, discountPrice: 275, unsplashId: 'photo-1584308666744-24d5c474f2ae' }
    ]
  },

  // 10. Pet Care
  {
    category: 'pet-care',
    subCategory: 'Dog Food & Treats',
    brand: 'Pedigree',
    items: [
      { id: 'p-t-1', name: 'Pedigree Adult Dry Dog Food Chicken & Rice', weight: '3 kg Bag', basePrice: 720, discountPrice: 610, unsplashId: 'photo-1589595608370-98f1f59f635d' },
      { id: 'p-t-2', name: 'Whiskas Ocean Fish Adult Cat Dry Food', weight: '1.2 kg Bag', basePrice: 460, discountPrice: 390, unsplashId: 'photo-1589595608370-98f1f59f635d' }
    ]
  },

  // 11. Electronics & Accessories
  {
    category: 'electronics-accessories',
    subCategory: 'Audio & Wearables',
    brand: 'boAt',
    items: [
      { id: 'e-a-1', name: 'boAt Airdopes 141 TWS Earbuds ANC', weight: '1 Unit', basePrice: 2990, discountPrice: 1299, unsplashId: 'photo-1546868871-7041f2a55e12' },
      { id: 'e-a-2', name: 'Duracell Ultra AA Alkaline Batteries', weight: 'Pack of 4', basePrice: 180, discountPrice: 155, unsplashId: 'photo-1546868871-7041f2a55e12' }
    ]
  },

  // 12. Oils, Masalas & Spices
  {
    category: 'oils-masalas-spices',
    subCategory: 'Cooking Oils',
    brand: 'Fortune',
    items: [
      { id: 'o-m-1', name: 'Fortune Sunlite Refined Sunflower Oil', weight: '1L Pouch', basePrice: 155, discountPrice: 132, unsplashId: 'photo-1596003906949-67221c37965c' },
      { id: 'o-m-2', name: 'MDH Garam Masala Powder', weight: '100g Box', basePrice: 95, discountPrice: 82, unsplashId: 'photo-1596003906949-67221c37965c' }
    ]
  },

  // 13. Bakery & Biscuits
  {
    category: 'bakery-biscuits',
    subCategory: 'Biscuits & Cookies',
    brand: 'Britannia',
    items: [
      { id: 'b-b-1', name: 'Britannia Good Day Cashew Cookies', weight: '200g Pack', basePrice: 45, discountPrice: 38, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'b-b-2', name: 'Parle-G Gold Biscuit Combo', weight: '1 kg Family Pack', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1509440159596-0249088772ff' }
    ]
  },

  // 14. Stationery & Toys
  {
    category: 'stationery-games',
    subCategory: 'Stationery Products',
    brand: 'Classmate',
    items: [
      { id: 's-t-1', name: 'Classmate Pulse Single Line Notebooks', weight: 'Pack of 6 (172 pages)', basePrice: 360, discountPrice: 299, unsplashId: 'photo-1586075010923-2dd4570fb338' }
    ]
  },

  // 15. Flowers & Gifts
  {
    category: 'flowers-gifts',
    subCategory: 'Flowers Bouquet',
    brand: 'FNP',
    items: [
      { id: 'f-g-1', name: 'Fresh Red Roses Bouquet Premium', weight: '12 Roses Bunch', basePrice: 499, discountPrice: 399, unsplashId: 'photo-1561181286-d3fee7d55364' }
    ]
  }
];

export function generateFladoProducts(): Product[] {
  const products: Product[] = [];

  templates.forEach((template) => {
    template.items.forEach((item) => {
      const imageUrl = `https://images.unsplash.com/${item.unsplashId}?w=600&auto=format&fit=crop&q=80`;
      
      products.push({
        id: item.id,
        name: item.name,
        price: item.discountPrice || item.basePrice,
        originalPrice: item.basePrice,
        image: imageUrl,
        category: template.category,
        subCategory: template.subCategory,
        description: `Fresh ${item.name} delivered to your doorstep in 10 mins by Flado. Guaranteed quality and best price.`,
        rating: 4.6 + Math.round(Math.random() * 3) / 10,
        reviews: [
          {
            id: `rev-${item.id}-1`,
            user: 'Amit S.',
            rating: 5,
            comment: 'Super fast delivery! Received fresh in just 8 minutes.',
            date: '2026-07-15'
          }
        ],
        isFlado: true,
        colors: [],
        sizes: [],
        weight: item.weight,
        stock: Math.floor(Math.random() * 40) + 10,
      });
    });
  });

  return products;
}

export const fladoProductsData = generateFladoProducts();
