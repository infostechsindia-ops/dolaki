export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image?: string;
  images?: string[];
  category: string;
  description: string;
  rating: number;
  reviews: Review[];
  isFlado: boolean;
  colors?: string[];
  sizes?: string[];
  stock: number;
  subCategory?: string;
  weight?: string;
  nutritionInfo?: string;
  brand?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "gro-1",
    "name": "Organic Bananas (Pack of 6)",
    "price": 60,
    "originalPrice": 80,
    "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Fresh, naturally ripened organic bananas sourced from local farms in Maharashtra. Rich in potassium and instant energy.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": true,
    "stock": 20,
    "subCategory": "Fruits & Vegetables",
    "brand": "Flado Fresh"
  },
  {
    "id": "gro-2",
    "name": "Fresh Farm Whole Milk 1L",
    "price": 72,
    "originalPrice": 75,
    "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Pasteurized, homogenized whole milk with 3.5% fat content. Sourced daily and chilled to perfection.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": true,
    "stock": 20,
    "subCategory": "Dairy & Bread",
    "brand": "Amul"
  },
  {
    "id": "gro-3",
    "name": "Gourmet Sourdough Bread",
    "price": 120,
    "originalPrice": 150,
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Artisanal, freshly baked sourdough bread with a chewy interior and thick, crispy crust. No added preservatives.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": true,
    "stock": 100,
    "subCategory": "Dairy & Bread",
    "brand": "Blinkit Fresh"
  },
  {
    "id": "gro-4",
    "name": "Fresh Hass Avocados (2 Pcs)",
    "price": 249,
    "originalPrice": 299,
    "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Premium imported Hass avocados. Rich, creamy texture, perfect for healthy salads, toast, or homemade guacamole.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": true,
    "stock": 20,
    "subCategory": "Fruits & Vegetables",
    "brand": "Flado Fresh"
  },
  {
    "id": "gro-5",
    "name": "Classic Potato Chips (Salted) 150g",
    "price": 50,
    "originalPrice": 60,
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Thinly sliced crispy potatoes seasoned with pure sea salt. Perfect party snack or tea-time companion.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": true,
    "stock": 20,
    "subCategory": "Snacks & Munchies",
    "brand": "Lay's"
  },
  {
    "id": "gro-6",
    "name": "Premium Greek Yogurt (Blueberry) 150g",
    "price": 65,
    "originalPrice": 75,
    "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Thick, creamy Greek yogurt layered with real blueberry compote. High protein and delicious taste.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": true,
    "stock": 20,
    "subCategory": "Dairy & Bread",
    "brand": "Nestle"
  },
  {
    "id": "ele-1",
    "name": "AuraPods Pro ANC Earbuds",
    "price": 8999,
    "originalPrice": 12999,
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588444839799-eaa4344ebd19?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Premium active noise-cancelling wireless earbuds with spatial audio, transparency mode, and up to 36 hours of battery life with case.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": true,
    "stock": 250,
    "subCategory": "Audio & Wearables",
    "brand": "AuraTech"
  },
  {
    "id": "ele-2",
    "name": "AuraWatch Elite Smartwatch",
    "price": 14999,
    "originalPrice": 19999,
    "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Stunning 1.43\" AMOLED screen, continuous heart rate tracking, blood oxygen monitoring, multi-sport modes, and premium leather strap.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 120,
    "subCategory": "Audio & Wearables",
    "brand": "Samsung"
  },
  {
    "id": "ele-3",
    "name": "AuraSound Go Portable Speaker",
    "price": 3499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Compact bluetooth speaker packing powerful 20W stereo sound, deep bass, and IPX7 structural waterproof casing. Perfect for pool parties.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": true,
    "stock": 400,
    "subCategory": "Audio & Wearables",
    "brand": "boAt"
  },
  {
    "id": "ele-4",
    "name": "Ultralight ANC Gaming Headphones",
    "price": 6999,
    "originalPrice": 9999,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Pro-grade wireless gaming headphones featuring ultra-low latency wireless transmitters, 50mm drivers, and crystal-clear boom microphones.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 85,
    "subCategory": "Computers & Accessories",
    "brand": "Sony"
  },
  {
    "id": "fas-1",
    "name": "Classic Denim Trucker Jacket",
    "price": 2499,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Vintage-wash premium cotton denim jacket with button chest pockets, adjustable waist tabs, and side welt pockets. Built to last.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 180,
    "subCategory": "Mens Wear",
    "brand": "Levi's"
  },
  {
    "id": "fas-2",
    "name": "Linen Blend Summer Dress",
    "price": 1899,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Breezy, lightweight summer dress featuring a flattering A-line silhouette, adjustable spaghetti straps, and side pockets.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 140,
    "subCategory": "Womens Wear",
    "brand": "Zara"
  },
  {
    "id": "fas-3",
    "name": "AuraSpeed Run Pro Sneakers",
    "price": 4599,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "High-performance running shoes built with nitrogen-infused foam midsoles, engineered knit mesh uppers, and high-traction rubber outsoles.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 90,
    "subCategory": "Footwear",
    "brand": "Nike"
  },
  {
    "id": "be-1",
    "name": "AuraGlow Vitamin C Face Serum",
    "price": 799,
    "originalPrice": 1199,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Advanced brightening formula containing 15% pure L-Ascorbic Acid, Ferulic Acid, and Hyaluronic Acid. Redefines skin texture and dark spots.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": true,
    "stock": 950,
    "subCategory": "Skin Care",
    "brand": "AuraGlow"
  },
  {
    "id": "be-2",
    "name": "Ceramide Barrier Relief Cream",
    "price": 649,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Intense hydration moisturizer built with 3 critical ceramides, cholesterol, and fatty acids to rebuild damaged skin barriers.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": true,
    "stock": 700,
    "subCategory": "Skin Care",
    "brand": "Clinique"
  },
  {
    "id": "hom-1",
    "name": "Smart Drip Coffee Maker",
    "price": 4999,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Programmable 12-cup coffee brewer with automated strength settings, LCD display, and double-walled thermal stainless steel carafe.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 140,
    "subCategory": "Kitchen Appliances",
    "brand": "CoffeeDay"
  },
  {
    "id": "hom-2",
    "name": "AuraBlend High-Speed Mixer Blender",
    "price": 3899,
    "originalPrice": 5499,
    "image": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Equipped with a robust 1200W copper motor and three surgical-grade stainless steel jars. Crushes tough ingredients in seconds.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 210,
    "subCategory": "Kitchen Appliances",
    "brand": "Philips"
  },
  {
    "id": "spo-1",
    "name": "Pro Premier Match Football",
    "price": 1999,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Official FIFA-certified thermal bonded match football. Textured PU cover provides incredible durability and aerodynamically stable flight path.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": true,
    "stock": 300,
    "subCategory": "Team Sports",
    "brand": "Cosco"
  },
  {
    "id": "spo-2",
    "name": "Nanoflare Badminton Racket",
    "price": 3499,
    "originalPrice": 4500,
    "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Ultra-light, head-light carbon graphite badminton racket. High tension support for powerful lightning-fast smashes and swift recovery.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 150,
    "subCategory": "Racquet Sports",
    "brand": "Yonex"
  },
  {
    "id": "app-1",
    "name": "Cyclone Cordless Stick Vacuum",
    "price": 24999,
    "originalPrice": 34999,
    "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Extremely powerful 150AW cordless stick vacuum cleaner with smart digital optical sensors that auto-adjust suction on hard floors.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 45,
    "subCategory": "Cleaning Appliances",
    "brand": "Dyson"
  },
  {
    "id": "toy-1",
    "name": "Space Shuttle Discovery Set",
    "price": 15999,
    "originalPrice": 19999,
    "image": "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Immersive building project containing 2354 pieces. Models the official space shuttle Discovery and Hubble Space Telescope.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Building Blocks",
    "brand": "LEGO"
  },
  {
    "id": "ele-5",
    "name": "Apple iPhone 15 Pro (128GB)",
    "price": 129900,
    "originalPrice": 134900,
    "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "The first iPhone to feature an aerospace-grade titanium design, using the A17 Pro chip, a customizable Action button, and a powerful Pro camera system.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 80,
    "subCategory": "Smartphones",
    "brand": "Apple"
  },
  {
    "id": "ele-6",
    "name": "Apple MacBook Air M3 (13-inch)",
    "price": 114900,
    "originalPrice": 119900,
    "image": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Superlight, incredibly fast laptop featuring the powerful M3 chip, liquid retina display, and up to 18 hours of all-day battery life.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 35,
    "subCategory": "Laptops",
    "brand": "Apple"
  },
  {
    "id": "fas-4",
    "name": "Adidas Ultraboost Light Running Shoes",
    "price": 18999,
    "originalPrice": 19999,
    "image": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Experience epic energy with the new Ultraboost Light, the lightest Ultraboost ever made. Created with Light BOOST cushioning technology.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 95,
    "subCategory": "Footwear",
    "brand": "Adidas"
  },
  {
    "id": "fas-5",
    "name": "Manyavar Embroidered Silk Sherwani Set",
    "price": 14999,
    "originalPrice": 17999,
    "image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Elevate your festive look with this premium dupion silk sherwani set, featuring intricate floral thread embroidery and a classic mandarin collar.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 25,
    "subCategory": "Ethnic Wear",
    "brand": "Manyavar"
  },
  {
    "id": "hom-3",
    "name": "IKEA KALLAX Shelf Unit (4x4)",
    "price": 8999,
    "originalPrice": 9999,
    "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Simple, clean shelving unit that does a lot. Stand it up, lie it down, push it against a wall, or use it as a smart room divider.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 50,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "hom-4",
    "name": "IKEA POÄNG Armchair",
    "price": 6999,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Laminated bentwood frame gives the armchair a comfortable resilience, making it perfect to relax in. High back gives good support for your neck.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 40,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "be-3",
    "name": "Lakme Absolute Matte Lipstick (Pink)",
    "price": 799,
    "originalPrice": 950,
    "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Enriched with Argan oil, this lipstick delivers intense matte color payoff with rich moisture, keeping lips soft and hydrated.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": true,
    "stock": 400,
    "subCategory": "Makeup",
    "brand": "Lakme"
  },
  {
    "id": "be-4",
    "name": "Mamaearth Onion Hair Fall Control Shampoo",
    "price": 349,
    "originalPrice": 399,
    "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "With Onion and Plant Keratin, this natural shampoo reduces hair fall, boosts hair growth, and strengthens hair fibers.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": true,
    "stock": 900,
    "subCategory": "Hair Care",
    "brand": "Mamaearth"
  },
  {
    "id": "gro-7",
    "name": "Haldirams Aloo Bhujia 400g",
    "price": 110,
    "originalPrice": 120,
    "image": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Crispy potato mint noodles snack infused with a blend of select spices. The ultimate teatime partner for Indian households.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": true,
    "stock": 1500,
    "subCategory": "Snacks & Beverages",
    "brand": "Haldirams"
  },
  {
    "id": "gro-8",
    "name": "Cadbury Dairy Milk Silk Chocolate (150g)",
    "price": 175,
    "originalPrice": 195,
    "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "groceries",
    "description": "Rich, smooth and creamy chocolate Silk that melts in your mouth for the ultimate chocolate indulgence.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": true,
    "stock": 1200,
    "subCategory": "Snacks & Beverages",
    "brand": "Cadbury"
  },
  {
    "id": "ele-7",
    "name": "AuraPad Pro 11-inch Tablet",
    "price": 29999,
    "originalPrice": 34999,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "A sleek, powerful 11-inch tablet featuring the latest Octa-core processor, stunning Liquid Retina display, and support for the AuraStylus.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Tablets",
    "brand": "AuraTech"
  },
  {
    "id": "ele-8",
    "name": "Sony Alpha 7 IV Mirrorless Camera",
    "price": 189999,
    "originalPrice": 199999,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "The ultimate hybrid mirrorless camera featuring a 33MP Exmor R CMOS sensor, high-speed autofocus, and advanced 4K 60p video capabilities.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Cameras",
    "brand": "Sony"
  },
  {
    "id": "ele-9",
    "name": "Bose QuietComfort Ultra Headphones",
    "price": 29999,
    "originalPrice": 32999,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Premium over-ear wireless headphones with world-class noise cancellation, breakthrough spatial audio, and luxury comfort for long listening sessions.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Audio & Wearables",
    "brand": "Bose"
  },
  {
    "id": "ele-10",
    "name": "Logitech MX Master 3S Wireless Mouse",
    "price": 9499,
    "originalPrice": 10999,
    "image": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "An iconic ergonomic office mouse featuring an 8K DPI any-surface tracking sensor, MagSpeed electromagnetic scrolling, and quiet click technology.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Computers & Accessories",
    "brand": "Logitech"
  },
  {
    "id": "ele-11",
    "name": "Dell UltraSharp 27\" 4K USB-C Hub Monitor",
    "price": 34999,
    "originalPrice": 39999,
    "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Stunning 27-inch 4K monitor featuring IPS Black technology for exceptional contrast, built-in USB-C hub with 90W power delivery, and sleek design.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Computers & Accessories",
    "brand": "Dell"
  },
  {
    "id": "ele-12",
    "name": "HP LaserJet Pro MFP Printer",
    "price": 16999,
    "originalPrice": 18999,
    "image": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "High-speed monochrome laser multifunction printer featuring automatic two-sided printing, reliable wireless connectivity, and scanning capabilities.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Computers & Accessories",
    "brand": "HP"
  },
  {
    "id": "ele-13",
    "name": "Samsung Galaxy S24 Ultra (256GB)",
    "price": 124999,
    "originalPrice": 129999,
    "image": "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 6.8-inch flat display. Empowered by Galaxy AI.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Smartphones",
    "brand": "Samsung"
  },
  {
    "id": "ele-14",
    "name": "Apple Watch Series 9 GPS 45mm",
    "price": 41900,
    "originalPrice": 44900,
    "image": "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "The smartest, most powerful Apple Watch yet. Features the S9 SiP chip, double tap gesture control, bright Always-On display, and health sensors.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Audio & Wearables",
    "brand": "Apple"
  },
  {
    "id": "ele-15",
    "name": "OnePlus 12 (512GB, Silky Black)",
    "price": 69999,
    "originalPrice": 74999,
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Flagship smartphone powered by Snapdragon 8 Gen 3, 16GB LPDDR5X RAM, 512GB storage, and the 4th Gen Hasselblad Camera System for Mobile.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Smartphones",
    "brand": "OnePlus"
  },
  {
    "id": "ele-16",
    "name": "Samsung Galaxy Tab S9 Ultra (Wi-Fi)",
    "price": 108999,
    "originalPrice": 114999,
    "image": "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Premium 14.6-inch Dynamic AMOLED 2X tablet, bundled with the S Pen. Water and dust resistant with IP68 rating, powered by Snapdragon 8 Gen 2.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Tablets",
    "brand": "Samsung"
  },
  {
    "id": "ele-17",
    "name": "GoPro HERO12 Black Action Camera",
    "price": 37999,
    "originalPrice": 45000,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "The new HERO12 Black features best-in-class image quality, even better HyperSmooth video stabilization, and a huge boost in battery performance.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Cameras",
    "brand": "GoPro"
  },
  {
    "id": "ele-18",
    "name": "Logitech MX Keys S Wireless Keyboard",
    "price": 12999,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "A premium low-profile wireless keyboard that offers fluid, precise typing with smart backlighting, customizable keys, and multi-device connection.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Computers & Accessories",
    "brand": "Logitech"
  },
  {
    "id": "ele-19",
    "name": "Bose SoundLink Flex Bluetooth Speaker",
    "price": 14999,
    "originalPrice": 16900,
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "A waterproof portable speaker that packs exceptionally crisp sound, deep bass, and extreme durability into a compact, carry-anywhere design.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Audio & Wearables",
    "brand": "Bose"
  },
  {
    "id": "ele-20",
    "name": "Seagate Expansion 2TB External HDD",
    "price": 5499,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Simple, high-capacity portable storage that easily plugs in via USB 3.0. Instantly drag-and-drop files to free up space on your computer.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Computers & Accessories",
    "brand": "Seagate"
  },
  {
    "id": "ele-21",
    "name": "Sennheiser HD 600 Open Back Headphones",
    "price": 24999,
    "originalPrice": 29999,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Audiophile-grade open-back dynamic stereo headphones. Known worldwide for their neutral sound signature and exceptionally wide soundstage.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Audio & Wearables",
    "brand": "Sennheiser"
  },
  {
    "id": "ele-22",
    "name": "Sony WH-1000XM5 Wireless Headphones",
    "price": 26999,
    "originalPrice": 29999,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Industry-leading active noise-canceling headphones with 8 microphones, Auto NC Optimizer, and up to 30 hours of battery life.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Audio & Wearables",
    "brand": "Sony"
  },
  {
    "id": "ele-23",
    "name": "Anker PowerCore 20K Power Bank",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "High-capacity portable charger with PowerIQ charging tech. Delivers fastest possible charge to phones, tablets, and other USB devices.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Computers & Accessories",
    "brand": "Anker"
  },
  {
    "id": "ele-24",
    "name": "Elgato Stream Deck MK.2",
    "price": 13999,
    "originalPrice": 15999,
    "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "A creative interface featuring 15 customizable LCD keys to control apps, trigger actions, launch socials, and adjust audio on the fly.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Computers & Accessories",
    "brand": "Elgato"
  },
  {
    "id": "ele-25",
    "name": "Asus ROG Swift 32\" Gaming Monitor",
    "price": 78999,
    "originalPrice": 89999,
    "image": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "High-end 32-inch 4K UHD gaming monitor featuring a blazingly fast 144Hz refresh rate, G-Sync compatibility, and stunning DisplayHDR 600 certification.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Computers & Accessories",
    "brand": "Asus"
  },
  {
    "id": "ele-26",
    "name": "Kindle Paperwhite (16GB, 6.8\")",
    "price": 13999,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Now with a 6.8\" display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 163,
    "subCategory": "Tablets",
    "brand": "Amazon"
  },
  {
    "id": "ele-27",
    "name": "OnePlus Buds Pro 2 Wireless Earbuds",
    "price": 9999,
    "originalPrice": 11999,
    "image": "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Co-created with Dynaudio, featuring Smart Adaptive Noise Cancellation, dual dynamic drivers, and up to 39 hours of battery life with case.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 170,
    "subCategory": "Audio & Wearables",
    "brand": "OnePlus"
  },
  {
    "id": "ele-28",
    "name": "TP-Link Deco X50 Mesh Wi-Fi (3-Pack)",
    "price": 18999,
    "originalPrice": 24999,
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "AX3000 Whole Home Mesh Wi-Fi 6 System. Covers up to 6,500 sq ft with super-fast, seamless Wi-Fi, connecting over 150 devices without lag.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 177,
    "subCategory": "Computers & Accessories",
    "brand": "TP-Link"
  },
  {
    "id": "ele-29",
    "name": "DJI Mini 4 Pro Drone (RC 2)",
    "price": 95999,
    "originalPrice": 105000,
    "image": "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "DJI's most advanced mini camera drone yet. Features omnidirectional obstacle sensing, 4K/60fps HDR True Vertical Shooting, and 34-min flight time.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 34,
    "subCategory": "Cameras",
    "brand": "DJI"
  },
  {
    "id": "ele-30",
    "name": "Xiaomi Pad 6 (128GB, Graphite Grey)",
    "price": 26999,
    "originalPrice": 39999,
    "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Flagship 11-inch tablet with 144Hz 7-Stage Refresh Rate display, Snapdragon 870 processor, quad speakers, and long-lasting 8840mAh battery.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 41,
    "subCategory": "Tablets",
    "brand": "Xiaomi"
  },
  {
    "id": "ele-31",
    "name": "Razer DeathAdder V3 Pro Mouse",
    "price": 11999,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Ultra-lightweight wireless ergonomic gaming mouse designed with esports pros. Features the Razer Focus Pro 30K Optical Sensor.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 48,
    "subCategory": "Computers & Accessories",
    "brand": "Razer"
  },
  {
    "id": "ele-32",
    "name": "HyperX QuadCast S USB Microphone",
    "price": 12499,
    "originalPrice": 16499,
    "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "A USB condenser microphone featuring stunning RGB lighting, an anti-vibration shock mount, tap-to-mute sensor, and 4 selectable polar patterns.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 55,
    "subCategory": "Audio & Wearables",
    "brand": "HyperX"
  },
  {
    "id": "ele-33",
    "name": "WD Black SN850X 1TB NVMe SSD",
    "price": 8499,
    "originalPrice": 12999,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "The ultimate PCIe Gen4 gaming SSD. Crushes load times and slashes throttling with read speeds up to 7,300 MB/s for peak performance.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 62,
    "subCategory": "Computers & Accessories",
    "brand": "Western Digital"
  },
  {
    "id": "ele-34",
    "name": "Nintendo Switch OLED Model",
    "price": 28999,
    "originalPrice": 32999,
    "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Features a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 69,
    "subCategory": "Gaming",
    "brand": "Nintendo"
  },
  {
    "id": "ele-35",
    "name": "Sony PlayStation 5 Slim Console",
    "price": 44999,
    "originalPrice": 54999,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, and an all-new slim design.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 76,
    "subCategory": "Gaming",
    "brand": "Sony"
  },
  {
    "id": "ele-36",
    "name": "SteelSeries Apex Pro TKL Keyboard",
    "price": 17999,
    "originalPrice": 21999,
    "image": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "The world's fastest keyboard. Features OmniPoint 2.0 adjustable mechanical switches, OLED smart display, and durable aircraft-grade aluminum frame.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 83,
    "subCategory": "Computers & Accessories",
    "brand": "SteelSeries"
  },
  {
    "id": "ele-37",
    "name": "Canon EOS R10 Mirrorless Camera",
    "price": 72999,
    "originalPrice": 80000,
    "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "A sleek mirrorless camera with an APS-C sensor, high-speed 15 fps mechanical shutter, and advanced Dual Pixel CMOS AF II tracking.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 90,
    "subCategory": "Cameras",
    "brand": "Canon"
  },
  {
    "id": "ele-38",
    "name": "Apple iPad Air M2 (11-inch)",
    "price": 59900,
    "originalPrice": 64900,
    "image": "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Now powered by the M2 chip. Gorgeous Liquid Retina display, landscape 12MP front camera, and blazing-fast Wi-Fi 6E connectivity.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 97,
    "subCategory": "Tablets",
    "brand": "Apple"
  },
  {
    "id": "ele-39",
    "name": "Xiaomi Mi Box 4K Streaming Media Player",
    "price": 3499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1574756568262-b911776b6b5c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Smart 4K Ultra HD streaming media player powered by Android TV. Features built-in Chromecast, Google Assistant, and Dolby Audio support.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 104,
    "subCategory": "Computers & Accessories",
    "brand": "Xiaomi"
  },
  {
    "id": "ele-40",
    "name": "Lenovo IdeaPad Slim 3 Laptop",
    "price": 38999,
    "originalPrice": 48999,
    "image": "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1525971977907-20d5571e16f9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "electronics",
    "description": "Dependable, lightweight laptop featuring an Intel Core i3 12th Gen processor, a 15.6\" FHD display, and narrow bezels for comfortable viewing.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 111,
    "subCategory": "Laptops",
    "brand": "Lenovo"
  },
  {
    "id": "fas-6",
    "name": "Men's Slim Fit Stretch Chinos",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Premium cotton blend stretch chinos featuring a slim cut, button closure, zip fly, and two functional side slash pockets.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Mens Wear",
    "brand": "Zara"
  },
  {
    "id": "fas-7",
    "name": "Women's Oversized Knit Sweater",
    "price": 2499,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "An oversized rib-knit sweater crafted from soft wool blend yarn. Features dropped shoulders, long sleeves, and a mock turtleneck collar.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Womens Wear",
    "brand": "H&M"
  },
  {
    "id": "fas-8",
    "name": "Nike Air Max 90 Sneakers",
    "price": 9999,
    "originalPrice": 11999,
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "An absolute classic running sneaker. Features the legendary Max Air cushioning unit in the heel and a waffle-pattern rubber traction outsole.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Footwear",
    "brand": "Nike"
  },
  {
    "id": "fas-9",
    "name": "Unisex Classic Canvas Backpack",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A durable daily canvas backpack with a large main zippered compartment, front accessories pocket, and fully padded adjustable shoulder straps.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Accessories",
    "brand": "Puma"
  },
  {
    "id": "fas-10",
    "name": "Men's Solid Regular Polo Shirt",
    "price": 3499,
    "originalPrice": 4499,
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Crafted from fine organic piqué cotton, this polo shirt features the iconic flag logo on the chest, a ribbed collar, and standard fit.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Mens Wear",
    "brand": "Tommy Hilfiger"
  },
  {
    "id": "fas-11",
    "name": "Women's High Rise Skinny Jeans",
    "price": 3999,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Sleek and classic skinny jeans engineered with innovative shape-holding stretch fibers to hug your curves comfortably all day long.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Womens Wear",
    "brand": "Levi's"
  },
  {
    "id": "fas-12",
    "name": "Men's Linen Casual Button Down Shirt",
    "price": 2499,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Crafted from 100% premium European flax linen. Exceptionally breathable, lightweight, and perfect for hot, muggy summer days.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Mens Wear",
    "brand": "Uniqlo"
  },
  {
    "id": "fas-13",
    "name": "Women's Floral Georgette Saree",
    "price": 5999,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A gorgeous floral printed georgette saree featuring a delicate gold zari border. Comes with an unstitched matching blouse piece.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Ethnic Wear",
    "brand": "Manyavar"
  },
  {
    "id": "fas-14",
    "name": "Adidas Originals Superstar Shoes",
    "price": 7999,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "The legendary shell-toe sneaker that started on the basketball court and became a hip-hop and streetwear icon. Full grain leather upper.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Footwear",
    "brand": "Adidas"
  },
  {
    "id": "fas-15",
    "name": "Leather Bifold Smart Wallet",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Slim bifold wallet made from hand-selected top grain leather. Features built-in RFID blocking technology and multiple card slots.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Accessories",
    "brand": "Tommy Hilfiger"
  },
  {
    "id": "fas-16",
    "name": "Women's Trench Coat with Belt",
    "price": 6999,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A timeless double-breasted trench coat featuring structured lapels, shoulder epaulets, adjustable buckle wrist straps, and a removable waist belt.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Womens Wear",
    "brand": "Zara"
  },
  {
    "id": "fas-17",
    "name": "Men's Waterproof Sports Watch",
    "price": 4999,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Built for active lifestyles, this watch features a durable resin case and band, mineral glass, stopwatches, alarms, and 100m water resistance.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Accessories",
    "brand": "Casio"
  },
  {
    "id": "fas-18",
    "name": "Women's Slip-On Ballet Flats",
    "price": 1499,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Comfortable, lightweight everyday slip-on ballet flats featuring a rounded toe design, faux leather upper, and lightly cushioned insoles.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Footwear",
    "brand": "H&M"
  },
  {
    "id": "fas-19",
    "name": "Men's Cotton Pajama Pants (Pack of 2)",
    "price": 1999,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Comfortable, premium loungewear pants crafted from super soft woven poplin cotton. Features an elastic waistband and drawstring.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Mens Wear",
    "brand": "Uniqlo"
  },
  {
    "id": "fas-20",
    "name": "Women's Anarkali Kurta & Palazzo Set",
    "price": 7999,
    "originalPrice": 9999,
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Stunning rayon-flared Anarkali kurta paired with comfortable wide-leg palazzo pants. Features intricate mirror and thread embroidery work.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Ethnic Wear",
    "brand": "Manyavar"
  },
  {
    "id": "fas-21",
    "name": "Puma Smash V2 Sneakers",
    "price": 3499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Tennis-inspired casual sneaker featuring a soft suede leather upper, iconic formstrip detailing, and a durable vulcanized rubber outsole.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Footwear",
    "brand": "Puma"
  },
  {
    "id": "fas-22",
    "name": "Polarized Wayfarer Sunglasses",
    "price": 9999,
    "originalPrice": 11999,
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "The most recognizable style in the history of sunglasses. Features durable acetate frames and polarized lenses for crystal-clear vision.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Accessories",
    "brand": "Ray-Ban"
  },
  {
    "id": "fas-23",
    "name": "Men's Crewneck Fleece Sweatshirt",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A cozy crewneck sweatshirt crafted from medium-weight cotton-blend fleece fabric. Features a soft brushed interior and ribbed cuffs.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Mens Wear",
    "brand": "H&M"
  },
  {
    "id": "fas-24",
    "name": "Women's Pleated Midi Skirt",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "High-waisted midi skirt featuring a fluid accordion pleated design, an elasticated waistband, and a luxurious satin-finish fabric.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Womens Wear",
    "brand": "Zara"
  },
  {
    "id": "fas-25",
    "name": "Men's Formal Leather Oxford Shoes",
    "price": 5999,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Sophisticated formal oxford shoes crafted from hand-polished full grain leather. Features premium Ortholite cushioning for all-day comfort.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 163,
    "subCategory": "Footwear",
    "brand": "Clarks"
  },
  {
    "id": "fas-26",
    "name": "Women's Tote Bag with Zipper",
    "price": 3499,
    "originalPrice": 4499,
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Spacious everyday tote bag made of high-quality faux pebbled leather. Features a secure zipper top closure and internal zipper pockets.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 170,
    "subCategory": "Accessories",
    "brand": "Zara"
  },
  {
    "id": "fas-27",
    "name": "Men's Nehru Jacket Silk Blend",
    "price": 4599,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Add a touch of elegance to your ethnic attire with this textured silk blend Nehru jacket, featuring brass buttons and a breast pocket.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 177,
    "subCategory": "Ethnic Wear",
    "brand": "Manyavar"
  },
  {
    "id": "fas-28",
    "name": "Nike Court Vision Low Sneakers",
    "price": 5499,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Classic 80s basketball-inspired low top sneaker. Features a synthetic leather upper, perforated toe box, and supportive cupsole.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 34,
    "subCategory": "Footwear",
    "brand": "Nike"
  },
  {
    "id": "fas-29",
    "name": "Unisex Cotton Winter Beanie",
    "price": 999,
    "originalPrice": 1499,
    "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A cozy and warm winter beanie knit with soft acrylic fibers, featuring the classic Adidas trefoil embroidered badge on the folded cuff.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 41,
    "subCategory": "Accessories",
    "brand": "Adidas"
  },
  {
    "id": "fas-30",
    "name": "Men's Cargo Jogger Pants",
    "price": 3299,
    "originalPrice": 4499,
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Rugged cargo pants styled with tapered jogger leg openings, elastic cuffs, utility side cargo pockets, and a comfortable stretch fit.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 48,
    "subCategory": "Mens Wear",
    "brand": "Levi's"
  },
  {
    "id": "fas-31",
    "name": "Women's Wrap V-Neck Maxi Dress",
    "price": 4999,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A beautiful, flowing maxi dress with a true wrap-around design, plunging V-neckline, self-tie waist belt, and flutter sleeves.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 55,
    "subCategory": "Womens Wear",
    "brand": "Zara"
  },
  {
    "id": "fas-32",
    "name": "Men's Tailored Fit Blazer",
    "price": 9999,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "An impeccably tailored single-breasted blazer featuring notch lapels, dual rear vents, and a soft, structure-holding wool blend fabric.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 62,
    "subCategory": "Mens Wear",
    "brand": "Tommy Hilfiger"
  },
  {
    "id": "fas-33",
    "name": "Women's Printed Cotton Kurti",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A daily-wear casual printed kurti crafted from soft, breathable premium cotton fabric. Styled with 3/4 sleeves and side slits.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 69,
    "subCategory": "Ethnic Wear",
    "brand": "Manyavar"
  },
  {
    "id": "fas-34",
    "name": "Adidas Duramo Running Shoes",
    "price": 4599,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Lightweight and responsive running shoe featuring Adidas Lightmotion cushioning in the midsole and a durable Adiwear outsole.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 76,
    "subCategory": "Footwear",
    "brand": "Adidas"
  },
  {
    "id": "fas-35",
    "name": "Woven Elastic Stretch Belt",
    "price": 1199,
    "originalPrice": 1699,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A braided stretch belt made from durable elastic fibers, featuring a premium full grain leather tip and solid metal prong buckle.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 83,
    "subCategory": "Accessories",
    "brand": "Levi's"
  },
  {
    "id": "fas-36",
    "name": "Women's Activewear Sports Bra",
    "price": 2299,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "High-support compression sports bra featuring Nike Dri-FIT moisture-wicking technology and a racerback design for maximum movement.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 90,
    "subCategory": "Womens Wear",
    "brand": "Nike"
  },
  {
    "id": "fas-37",
    "name": "Men's Dry-Fit Athletic Shorts",
    "price": 1699,
    "originalPrice": 2299,
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Performance training shorts made from lightweight, sweat-wicking knit fabric, featuring an elastic waist and internal drawcord.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 97,
    "subCategory": "Mens Wear",
    "brand": "Nike"
  },
  {
    "id": "fas-38",
    "name": "Women's Cashmere Scarf",
    "price": 3499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Luxuriously soft scarf crafted from 100% fine Inner Mongolian cashmere. Finished with traditional delicate fringe details.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 104,
    "subCategory": "Accessories",
    "brand": "Zara"
  },
  {
    "id": "fas-39",
    "name": "Unisex Slide Sandals",
    "price": 1999,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "The ultimate casual pool-side slides featuring a contoured, quick-dry Cloudfoam footbed and a classic 3-stripe logo bandage upper.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 111,
    "subCategory": "Footwear",
    "brand": "Adidas"
  },
  {
    "id": "fas-40",
    "name": "Men's Pure Silk Kurta Churidar Set",
    "price": 8999,
    "originalPrice": 11999,
    "image": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A classic wedding and festive set featuring a woven pure silk kurta paired with an off-white cotton-silk blend churidar pyjama.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 118,
    "subCategory": "Ethnic Wear",
    "brand": "Manyavar"
  },
  {
    "id": "fas-41",
    "name": "Women's Crop Hooded Sweatshirt",
    "price": 1799,
    "originalPrice": 2299,
    "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A trendy cropped hoodie made from soft, cotton-blend sweat fabric. Features an elasticized drawstring hem and dropped shoulders.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 125,
    "subCategory": "Womens Wear",
    "brand": "H&M"
  },
  {
    "id": "fas-42",
    "name": "Men's Distressed Denim Jeans",
    "price": 3499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "The classic 511 Slim Fit jeans updated with tasteful, hand-finished distressing on the thighs. Features the signature 5-pocket styling.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 132,
    "subCategory": "Mens Wear",
    "brand": "Levi's"
  },
  {
    "id": "fas-43",
    "name": "Women's Leather Chelsea Boots",
    "price": 6999,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Elegant and versatile Chelsea boots made with premium water-resistant leather uppers, elastic side gores, and a block heel.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 139,
    "subCategory": "Footwear",
    "brand": "Clarks"
  },
  {
    "id": "fas-44",
    "name": "Canvas Messenger Crossbody Bag",
    "price": 2199,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A retro-inspired canvas messenger bag with an adjustable crossbody shoulder strap, hook-and-loop flap closure, and organizational pockets.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 146,
    "subCategory": "Accessories",
    "brand": "Puma"
  },
  {
    "id": "fas-45",
    "name": "Men's Wool Blend Fedora Hat",
    "price": 2499,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A classic structured fedora hat crafted from a warm wool-polyester blend, finished with a stylish faux leather band around the crown.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 153,
    "subCategory": "Accessories",
    "brand": "Zara"
  },
  {
    "id": "fas-46",
    "name": "Women's Satin Nightwear Pyjama Set",
    "price": 1999,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Luxurious nightwear pyjama set in lightweight, silky satin-weave fabric. Features a collared button-up top and matching elasticized bottoms.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 160,
    "subCategory": "Womens Wear",
    "brand": "H&M"
  },
  {
    "id": "fas-47",
    "name": "Men's Hooded Puffer Winter Jacket",
    "price": 12999,
    "originalPrice": 16999,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Midweight water-resistant puffer jacket insulated with high-loft synthetic down. Features a fleece-lined hood and storm cuffs.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 167,
    "subCategory": "Mens Wear",
    "brand": "Tommy Hilfiger"
  },
  {
    "id": "fas-48",
    "name": "Women's Block Heel Sandals",
    "price": 3899,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Chic open-toe dress sandals featuring a supportive block heel, slim adjustable ankle strap with metal buckle, and padded footbed.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 174,
    "subCategory": "Footwear",
    "brand": "Zara"
  },
  {
    "id": "fas-49",
    "name": "Sterling Silver Stud Earrings",
    "price": 1299,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "Sparkling stud earrings made of certified 925 sterling silver, set with high-grade hand-selected round brilliant cut cubic zirconia.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 31,
    "subCategory": "Accessories",
    "brand": "Giva"
  },
  {
    "id": "fas-50",
    "name": "Men's Vintage Leather Belt",
    "price": 1599,
    "originalPrice": 2199,
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "fashion",
    "description": "A classic casual belt crafted from thick, durable single-cut bridle leather. Finished with an antiqued roller buckle and logo emboss.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 38,
    "subCategory": "Accessories",
    "brand": "Levi's"
  },
  {
    "id": "be-5",
    "name": "Hyaluronic Acid Hydrating Serum",
    "price": 599,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A hydrating formula with ultra-pure, vegan hyaluronic acid. Offers multi-depth hydration and visible plumping without drawing water out.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Skin Care",
    "brand": "The Ordinary"
  },
  {
    "id": "be-6",
    "name": "Matte Liquid Foundation SPF 20",
    "price": 2999,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A modern shine-controlling foundation that provides a matte finish, medium-to-full buildable coverage, and broad spectrum SPF 20.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Makeup",
    "brand": "MAC"
  },
  {
    "id": "be-7",
    "name": "Argan Oil Hair Mask & Conditioner",
    "price": 699,
    "originalPrice": 899,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Intense nourishing hair treatment mask enriched with cold-pressed Moroccan argan oil. Repairs damaged shafts and restores brilliant shine.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Hair Care",
    "brand": "L'Oreal"
  },
  {
    "id": "be-8",
    "name": "Cherry Blossom Hydrating Body Wash",
    "price": 299,
    "originalPrice": 399,
    "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A refreshing body wash that transforms into a rich cream foam. Enriched with natural jojoba oil and a delicate cherry blossom scent.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Bath & Body",
    "brand": "Nivea"
  },
  {
    "id": "be-9",
    "name": "Eau de Parfum Floral Intense 100ml",
    "price": 6999,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A sophisticated, highly concentrated floral fragrance. Opens with notes of jasmine and tuberose, settling into warm amber base notes.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Fragrance",
    "brand": "Estee Lauder"
  },
  {
    "id": "be-10",
    "name": "Niacinamide 10% Zinc 1% Oil Control Serum",
    "price": 599,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "High-strength vitamin and mineral blemish formula that targets breakouts, minimizes pores, and regulates sebum production.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Skin Care",
    "brand": "The Ordinary"
  },
  {
    "id": "be-11",
    "name": "Absolute Hydra Matte Liquid Lip Color",
    "price": 649,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Long-lasting matte liquid lipstick that doesn't dry your lips. Enriched with Hyaluronic Acid for locked-in moisture.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Makeup",
    "brand": "Lakme"
  },
  {
    "id": "be-12",
    "name": "Tea Tree Anti-Dandruff Hair Oil",
    "price": 399,
    "originalPrice": 499,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Natural hair oil formulated with pure tea tree oil and ginger oil. Soothes itchy scalps and clears dandruff-causing fungal buildup.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Hair Care",
    "brand": "Mamaearth"
  },
  {
    "id": "be-13",
    "name": "Cocoa Butter Deep Moisture Lotion",
    "price": 349,
    "originalPrice": 449,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Infused with deep moisture serum and rich cocoa butter. Provides intense hydration to dry skin for up to 48 hours.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Bath & Body",
    "brand": "Nivea"
  },
  {
    "id": "be-14",
    "name": "Black Waterproof Volumizing Mascara",
    "price": 799,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Get voluminous, long lashes with this waterproof formula. The unique brush coats each lash evenly without clumping.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Makeup",
    "brand": "L'Oreal"
  },
  {
    "id": "be-15",
    "name": "Salicylic Acid 2% Exfoliating Cleanser",
    "price": 699,
    "originalPrice": 899,
    "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A gentle exfoliating gel cleanser containing 2% salicylic acid to clear pores, dissolve dead skin cells, and prevent blemishes.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Skin Care",
    "brand": "The Ordinary"
  },
  {
    "id": "be-16",
    "name": "Vitamin C Glow Clay Face Mask",
    "price": 499,
    "originalPrice": 599,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Brightening clay mask formulated with Kaolin clay, Vitamin C, and Turmeric. Gently extracts toxins while reviving natural radiance.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Skin Care",
    "brand": "Mamaearth"
  },
  {
    "id": "be-17",
    "name": "Woody Eau de Toilette Sport Spray",
    "price": 1499,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A fresh, invigorating daily cologne spray for men. Blends crisp citrus top notes with a long-lasting cedarwood and musk base.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Fragrance",
    "brand": "Nivea"
  },
  {
    "id": "be-18",
    "name": "Intense Black Gel Eyeliner Kajal",
    "price": 299,
    "originalPrice": 399,
    "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Deep black, gel-based kajal eyeliner pencil. Smudge-proof and waterproof formula that lasts up to 24 hours without fading.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Makeup",
    "brand": "Lakme"
  },
  {
    "id": "be-19",
    "name": "Rosemary Hair Growth Rosemary Oil",
    "price": 449,
    "originalPrice": 549,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Encourages hair thickness and stimulates growth. Enriched with natural rosemary extract, curry leaves, and methi seeds.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Hair Care",
    "brand": "Mamaearth"
  },
  {
    "id": "be-20",
    "name": "Ultra Light Sunscreen Gel SPF 50",
    "price": 549,
    "originalPrice": 699,
    "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Non-greasy, fast-absorbing matte gel sunscreen with PA+++ rating. Provides complete defense against UVA/UVB rays.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Skin Care",
    "brand": "AuraGlow"
  },
  {
    "id": "be-21",
    "name": "Retro Matte Lipstick Ruby Woo",
    "price": 2199,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A famous, highly pigmented matte retro red lipstick. Offers an intense color payoff and completely matte finish.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Makeup",
    "brand": "MAC"
  },
  {
    "id": "be-22",
    "name": "Hydro Boost Water Gel Moisturizer",
    "price": 1899,
    "originalPrice": 2299,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Dermatologist-recommended water-gel moisturizer that provides 72-hour continuous hydration. Formulated with aloe bio-ferment.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Skin Care",
    "brand": "Clinique"
  },
  {
    "id": "be-23",
    "name": "Keratin Smooth Sulfate-Free Shampoo",
    "price": 499,
    "originalPrice": 599,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Formulated with micro-keratin technology to smooth down hair cuticles, control frizz, and keep hair sleek and manageable for up to 3 days.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Hair Care",
    "brand": "L'Oreal"
  },
  {
    "id": "be-24",
    "name": "Moisturizing Shaving Foam Sensitive",
    "price": 249,
    "originalPrice": 299,
    "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Soothes sensitive skin and prevents razor irritation. Formulated with chamomile extract and witch hazel to protect the skin barrier.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 163,
    "subCategory": "Bath & Body",
    "brand": "Nivea"
  },
  {
    "id": "be-25",
    "name": "Prestige Luxury Night Repair Serum",
    "price": 5999,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Patented nocturnal recovery serum. Synchronizes skin's natural repair process to visibly reduce lines, wrinkles, and uneven tone.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 170,
    "subCategory": "Skin Care",
    "brand": "Estee Lauder"
  },
  {
    "id": "be-26",
    "name": "Mineral Loose Finishing Powder",
    "price": 2499,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A lightweight, mineral-rich loose powder that sets makeup, controls shine, and provides a smooth, soft-focus matte airbrushed look.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 177,
    "subCategory": "Makeup",
    "brand": "MAC"
  },
  {
    "id": "be-27",
    "name": "Citrus Refreshing Hand Cream 50g",
    "price": 149,
    "originalPrice": 199,
    "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A fast-absorbing hand cream that deeply moisturizes dry hands and cuticles, leaving behind a fresh, zesty citrus scent.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 34,
    "subCategory": "Bath & Body",
    "brand": "Nivea"
  },
  {
    "id": "be-28",
    "name": "Charcoal Deep Cleansing Face Wash",
    "price": 249,
    "originalPrice": 299,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Activated charcoal face wash that draws out dirt, oil, and impurities from deep within pores. Infused with natural tea tree oil.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 41,
    "subCategory": "Skin Care",
    "brand": "Mamaearth"
  },
  {
    "id": "be-29",
    "name": "Professional Hair Straightening Cream",
    "price": 899,
    "originalPrice": 1199,
    "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "An advanced permanent hair straightening cream kit. Smooths out curls and tight waves while protecting hair fibers with cationic polymers.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 48,
    "subCategory": "Hair Care",
    "brand": "L'Oreal"
  },
  {
    "id": "be-30",
    "name": "Velvet Matte Eyeshadow Palette 12-Color",
    "price": 999,
    "originalPrice": 1299,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Features 12 highly pigmented velvety smooth eyeshadow shades, ranging from everyday neutrals to sparkling jewel tones.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 55,
    "subCategory": "Makeup",
    "brand": "Lakme"
  },
  {
    "id": "be-31",
    "name": "Gold Radiance Youthful Day Cream",
    "price": 899,
    "originalPrice": 1199,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Enriched with real gold micro-particles and SPF 30. Rehydrates skin, reduces fine lines, and reveals a youthful, radiant complexion.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 62,
    "subCategory": "Skin Care",
    "brand": "Lakme"
  },
  {
    "id": "be-32",
    "name": "Lavender Calming Sleep Body Spray",
    "price": 499,
    "originalPrice": 699,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "A relaxing mist blended with pure essential oils of lavender and chamomile. Spray on body or pillows to promote deep, restful sleep.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 69,
    "subCategory": "Fragrance",
    "brand": "AuraGlow"
  },
  {
    "id": "be-33",
    "name": "Onion Hair Serum for Frizz-Free Hair",
    "price": 299,
    "originalPrice": 349,
    "image": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Formulated with onion seed extract and olive oil. Tames flyaways, prevents hair breakage, and leaves hair silky, shiny, and tangle-free.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 76,
    "subCategory": "Hair Care",
    "brand": "Mamaearth"
  },
  {
    "id": "be-34",
    "name": "Aloe Vera Soothing Gel",
    "price": 249,
    "originalPrice": 299,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "100% pure organic aloe vera gel harvested from organic farms. Soothes sunburns, hydrates dry skin, and calms redness.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 83,
    "subCategory": "Skin Care",
    "brand": "AuraGlow"
  },
  {
    "id": "be-35",
    "name": "Ultimate Hydrating Lip Balm (Berry)",
    "price": 149,
    "originalPrice": 199,
    "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "beauty",
    "description": "Keeps lips deeply hydrated for 24 hours. Features a subtle red berry tint and a delicious fruity aroma.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 90,
    "subCategory": "Skin Care",
    "brand": "Nivea"
  },
  {
    "id": "hom-5",
    "name": "Stainless Steel 3-Tier Steamer Cooker",
    "price": 1999,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Versatile 3-tier food steamer crafted from food-grade stainless steel, featuring a tempered glass lid and heat-resistant handles.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Cookware",
    "brand": "Prestige"
  },
  {
    "id": "hom-6",
    "name": "IKEA LACK Side Table (55x55 cm)",
    "price": 999,
    "originalPrice": 1499,
    "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Lightweight, easy to assemble side table. Matches other products in the LACK series and fits perfectly in small spaces.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "hom-7",
    "name": "Digital Multi-Cooker Air Fryer 4L",
    "price": 6999,
    "originalPrice": 9999,
    "image": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Cook healthy meals with up to 90% less oil. 12-in-1 cooking functions including air fry, bake, grill, roast, and reheat.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Kitchen Appliances",
    "brand": "Philips"
  },
  {
    "id": "hom-8",
    "name": "Microfiber King Size Bed Sheet Set",
    "price": 1499,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Super soft, breathable double bed sheet set made from premium brushed microfiber. Wrinkle, fade, and stain resistant.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Bedding",
    "brand": "D'Decor"
  },
  {
    "id": "hom-9",
    "name": "Hand-Woven Cotton Area Rug (5x7 ft)",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Add warmth to your living room with this hand-woven natural cotton area rug, featuring a modern geometric print.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Home Decor",
    "brand": "HomeCentre"
  },
  {
    "id": "hom-10",
    "name": "Non-Stick Die-Cast Cookware Set (3 Pcs)",
    "price": 3499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Premium die-cast aluminum cookware set featuring a healthy PFOA-free non-stick coating, soft-touch ergonomic handles, and glass lids.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Cookware",
    "brand": "Wonderchef"
  },
  {
    "id": "hom-11",
    "name": "IKEA BILLY Bookcase (80x28x202 cm)",
    "price": 5999,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "The world's most versatile bookcase. Features adjustable shelves to help you customize your storage space as needs grow.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "hom-12",
    "name": "Glass Electric Kettle 1.7L",
    "price": 2499,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Elegant Schott Duran glass electric kettle with blue LED light indicator, auto-shut off dry protection, and flat heating element.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Kitchen Appliances",
    "brand": "Philips"
  },
  {
    "id": "hom-13",
    "name": "Reversible Cotton Comforter Double Bed",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "A cozy double bed comforter filled with high-loft hypoallergenic microfiber. Reversible design with complementary color tones.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Bedding",
    "brand": "D'Decor"
  },
  {
    "id": "hom-14",
    "name": "Set of 3 Ceramic Planter Pots",
    "price": 1199,
    "originalPrice": 1699,
    "image": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Beautifully glazed, hand-crafted ceramic planter pots in various pastel shades. Complete with drainage holes and saucers.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Home Decor",
    "brand": "HomeCentre"
  },
  {
    "id": "hom-15",
    "name": "Pressure Cooker 5 Litre (Induction Base)",
    "price": 2199,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Heavy-duty aluminum pressure cooker with anodized outer body, safety metallic plug, and durable gasket release system.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Cookware",
    "brand": "Prestige"
  },
  {
    "id": "hom-16",
    "name": "IKEA EKET Cabinet Combination",
    "price": 3999,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "A clever small cabinet to store all your smaller items. Can be wall-mounted or placed directly on the floor with legs.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "hom-17",
    "name": "Nutri-Blend Compact Bullet Blender",
    "price": 2899,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "India's favorite blender-grinder. Features a powerful 400W 22000 RPM motor and super-sharp stainless steel extraction blades.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Kitchen Appliances",
    "brand": "Wonderchef"
  },
  {
    "id": "hom-18",
    "name": "Memory Foam Ergonomic Pillow",
    "price": 1299,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Contoured memory foam pillow designed to support cervical alignment. Reduces neck stiffness and improves sleep posture.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Bedding",
    "brand": "D'Decor"
  },
  {
    "id": "hom-19",
    "name": "Decorative Metal Wall Art Sculpture",
    "price": 2499,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Three-dimensional metal wall sculpture depicting Ginkgo Biloba leaves. Finished in antique gold and teal blue rustproof paint.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Home Decor",
    "brand": "HomeCentre"
  },
  {
    "id": "hom-20",
    "name": "Hard Anodized Kadaipur Fry Pan 3L",
    "price": 1499,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Made from heavy gauge virgin aluminum. Anodized surface is harder than steel, non-reactive with acidic foods, and scratch-resistant.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Cookware",
    "brand": "Prestige"
  },
  {
    "id": "hom-21",
    "name": "IKEA MALM 3-Drawer Chest",
    "price": 7999,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "A clean expression that fits right in, in the bedroom or wherever you place it. Smooth-running drawers with pull-out stop.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "hom-22",
    "name": "Pop-up 2-Slice Toaster 800W",
    "price": 1799,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Compact toaster with 8 browning settings and integrated bun warming rack. Cancel button lets you stop toasting at any moment.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Kitchen Appliances",
    "brand": "Philips"
  },
  {
    "id": "hom-23",
    "name": "Blackout Window Curtains (Pack of 2)",
    "price": 1999,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Heavy triple-weave blackout curtains that block 95% of sunlight and UV rays. Helps insulate rooms thermally.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Home Decor",
    "brand": "D'Decor"
  },
  {
    "id": "hom-24",
    "name": "Bamboo Fiber Dinnerware Set (12 Pcs)",
    "price": 1699,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Eco-friendly, lightweight, and biodegradable dinnerware set made of organic bamboo fibers. BPA-free and dishwasher safe.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 163,
    "subCategory": "Cookware",
    "brand": "Wonderchef"
  },
  {
    "id": "hom-25",
    "name": "Foldable Orthopedic Mattress Double",
    "price": 5499,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "High density foam mattress offering orthopedic back support. Features a foldable 3-panel design for easy storage and portability.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 170,
    "subCategory": "Bedding",
    "brand": "HomeCentre"
  },
  {
    "id": "hom-26",
    "name": "IKEA BJURSTA Extendable Table",
    "price": 12999,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Extendable dining table with 2 extra leaves seats 4-6. Enables you to quickly adapt the table size to your hosting needs.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 177,
    "subCategory": "Furniture",
    "brand": "IKEA"
  },
  {
    "id": "hom-27",
    "name": "Induction Cooktop 2000W Touch Control",
    "price": 2999,
    "originalPrice": 4299,
    "image": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "High power induction cooktop featuring pre-programmed Indian menu options, automatic voltage regulator, and feather-touch panel.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 34,
    "subCategory": "Kitchen Appliances",
    "brand": "Prestige"
  },
  {
    "id": "hom-28",
    "name": "Aromatic Reed Diffuser Set (Lavender)",
    "price": 699,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Infuse your home with calm aromatherapy. Set includes a decorative glass jar, 100ml lavender essential oil, and 8 rattan reeds.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 41,
    "subCategory": "Home Decor",
    "brand": "HomeCentre"
  },
  {
    "id": "hom-29",
    "name": "Granite Stone Coating Fry Pan 24cm",
    "price": 1199,
    "originalPrice": 1799,
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Heavy-duty forged aluminum frypan coated with 5 layers of PFOA-free grey granite stone particles. Highly scratch-resistant.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 48,
    "subCategory": "Cookware",
    "brand": "Wonderchef"
  },
  {
    "id": "hom-30",
    "name": "Luxurious Cotton Bath Towels (Pack of 4)",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "home",
    "description": "Pack of 4 matching ultra-absorbent bath towels woven with 100% long-staple combed cotton ringspun yarn. 600 GSM weight.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 55,
    "subCategory": "Bedding",
    "brand": "D'Decor"
  },
  {
    "id": "spo-3",
    "name": "Premium Cricket Bat Poplar Willow",
    "price": 1299,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Lightweight poplar willow cricket bat designed for leather or tennis ball cricket. Equipped with a premium cane handle for shock absorption.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Team Sports",
    "brand": "Cosco"
  },
  {
    "id": "spo-4",
    "name": "Carbon Fiber Tennis Racket",
    "price": 4999,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Pro-grade carbon fiber tennis racket offering high torsional stiffness, huge sweet spot, and vibration dampening technology.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Racquet Sports",
    "brand": "Yonex"
  },
  {
    "id": "spo-5",
    "name": "Adjustable Dumbbell Set 20kg",
    "price": 3999,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Highly versatile strength training kit containing cast-iron weight plates, 2 chrome dumbbell bars, and 4 secure spinlock collars.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Fitness & Gym",
    "brand": "Decathlon"
  },
  {
    "id": "spo-6",
    "name": "Waterproof Camping Dome Tent 3-Person",
    "price": 4599,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Easy to pitch 3-person dome tent featuring a waterproof flysheet, tub floor, and ventilation panels to reduce condensation.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Outdoor & Adventure",
    "brand": "Decathlon"
  },
  {
    "id": "spo-7",
    "name": "Fitbit Charge 6 Fitness Tracker",
    "price": 14999,
    "originalPrice": 16999,
    "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Advanced fitness tracker with built-in GPS, continuous heart rate tracking, Sleep Score, stress management tools, and Google Maps integration.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Fitness & Gym",
    "brand": "Fitbit"
  },
  {
    "id": "spo-8",
    "name": "Synthetic Leather Basketball Size 7",
    "price": 899,
    "originalPrice": 1299,
    "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Official size 7 basketball constructed with composite synthetic leather, deep pebbling for control, and a nylon-wound butyl bladder.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Team Sports",
    "brand": "Nivia"
  },
  {
    "id": "spo-9",
    "name": "Carbon Graphite Squash Racket",
    "price": 3499,
    "originalPrice": 4500,
    "image": "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "A head-light squash racket engineered for quick defensive maneuvers. Features a tear-drop head shape for high power output.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Racquet Sports",
    "brand": "Yonex"
  },
  {
    "id": "spo-10",
    "name": "Non-Slip Eco-Friendly Yoga Mat 6mm",
    "price": 999,
    "originalPrice": 1499,
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Crafted from TPE, a biodegradable and non-toxic material. Features dual-sided non-slip textures and 6mm thickness for joint cushioning.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Fitness & Gym",
    "brand": "Decathlon"
  },
  {
    "id": "spo-11",
    "name": "Heavy Duty Hiking Backpack 50L",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Technical trekking backpack featuring an adjustable back harness, padded hip belt, bottom rain-cover compartment, and trekking pole loops.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Outdoor & Adventure",
    "brand": "Decathlon"
  },
  {
    "id": "spo-12",
    "name": "Leather Wicket Keeping Gloves",
    "price": 1499,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Professional wicket keeping gloves made from premium supple aniline leather. Features octopus-grip rubber sheet on palms.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Team Sports",
    "brand": "Cosco"
  },
  {
    "id": "spo-13",
    "name": "Nylon Shuttlecocks Yellow (Pack of 6)",
    "price": 799,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Precision-manufactured nylon shuttlecocks that mimic feather shuttlecock flight. Yellow skirt for high visibility indoors.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Racquet Sports",
    "brand": "Yonex"
  },
  {
    "id": "spo-14",
    "name": "Resistance Loop Bands (Set of 5)",
    "price": 499,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "A set of 5 natural latex loop resistance bands with varying tension levels (Extra Light to Extra Heavy). Includes travel pouch.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Fitness & Gym",
    "brand": "Decathlon"
  },
  {
    "id": "spo-15",
    "name": "High Performance Sports Water Bottle",
    "price": 699,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "BPA-free high density polyethylene squeeze water bottle with a leak-proof jet valve cap. Easy clean wide-mouth design.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Fitness & Gym",
    "brand": "Puma"
  },
  {
    "id": "spo-16",
    "name": "Premium Leather Cricket Match Ball",
    "price": 499,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Alum tanned four-piece red leather cricket ball. Wounded with high quality cork and wool yarn. Suitable for 50-over matches.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Team Sports",
    "brand": "Nivia"
  },
  {
    "id": "spo-17",
    "name": "Racquet Cover Bag Dual Compartment",
    "price": 1199,
    "originalPrice": 1699,
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Dual compartment bag built to carry up to 6 badminton rackets or 3 tennis rackets. Features dedicated wet/dry clothing sleeve.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Racquet Sports",
    "brand": "Yonex"
  },
  {
    "id": "spo-18",
    "name": "Home Gym Pull-Up Bar Doorway",
    "price": 1299,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Adjustable heavy-duty steel pull-up bar that fits secure inside standard door frames. Transparent rubber pads prevent wall markings.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Fitness & Gym",
    "brand": "Decathlon"
  },
  {
    "id": "spo-19",
    "name": "Aluminum Alloy Trekking Poles (Pair)",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Lightweight 6061 aluminum alloy trekking poles with secure flip-lock telescopic extension and ergonomic cork grips.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Outdoor & Adventure",
    "brand": "Decathlon"
  },
  {
    "id": "spo-20",
    "name": "Football Goalkeeper Gloves Pro Grip",
    "price": 1599,
    "originalPrice": 2199,
    "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Goalkeeper gloves with 3.5mm latex palms for outstanding grip. Elastic bandage wrist wrapping provides wrist support.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Team Sports",
    "brand": "Adidas"
  },
  {
    "id": "spo-21",
    "name": "Adjustable Speed Jump Rope Steel",
    "price": 599,
    "originalPrice": 899,
    "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Fast speed skipping rope featuring built-in ball bearings, a tangle-free steel wire cable, and anti-slip aluminum handles.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Fitness & Gym",
    "brand": "Puma"
  },
  {
    "id": "spo-22",
    "name": "Outdoor Sleeping Bag Lightweight",
    "price": 2199,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Comfortable envelope-style sleeping bag designed for mild weather (comfort limit 15°C). Packs down into a tiny compression sack.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 163,
    "subCategory": "Outdoor & Adventure",
    "brand": "Decathlon"
  },
  {
    "id": "spo-23",
    "name": "Laminated Volleyball Size 5",
    "price": 799,
    "originalPrice": 1100,
    "image": "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "18-panel laminated composite leather volleyball. Soft touch surface reduces sting on players' forearms during matches.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 170,
    "subCategory": "Team Sports",
    "brand": "Nivia"
  },
  {
    "id": "spo-24",
    "name": "Ab Roller Wheel with Knee Pad",
    "price": 699,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Double wheel core exercise ab roller. Features textured ergonomic foam handles and includes a soft foam knee cushion pad.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 177,
    "subCategory": "Fitness & Gym",
    "brand": "Decathlon"
  },
  {
    "id": "spo-25",
    "name": "Sports Gym Duffel Bag with Shoe Compartment",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "sports",
    "description": "Durable gym bag crafted from water-repellent ripstop polyester. Features a ventilated side pocket designed specifically for shoes.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 34,
    "subCategory": "Fitness & Gym",
    "brand": "Adidas"
  },
  {
    "id": "app-2",
    "name": "Intelligent Robot Vacuum & Mop Cleaner",
    "price": 29999,
    "originalPrice": 39999,
    "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Equipped with LiDAR navigation and smart mapping. Vacuums and mops simultaneously with automated water control flow.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Cleaning Appliances",
    "brand": "Samsung"
  },
  {
    "id": "app-3",
    "name": "Convection Microwave Oven 28L",
    "price": 14999,
    "originalPrice": 18999,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Features charcoal lighting heater for crunchy baking. 28L capacity is ideal for families. Auto-cook menu presets make it easy.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Kitchen Appliances",
    "brand": "LG"
  },
  {
    "id": "app-4",
    "name": "Smart Split Air Conditioner 1.5 Ton",
    "price": 38999,
    "originalPrice": 48999,
    "image": "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "5-Star rating for extreme energy efficiency. Features PM 2.5 air filters and copper condenser coils. Enabled with Wi-Fi control.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Home Comfort",
    "brand": "Samsung"
  },
  {
    "id": "app-5",
    "name": "Front Load Fully Automatic Washing Machine 8kg",
    "price": 32999,
    "originalPrice": 39999,
    "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Durable washing machine featuring a 4D wash system and an integrated aqua energie water softener. 14 wash programs.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Laundry",
    "brand": "IFB"
  },
  {
    "id": "app-6",
    "name": "Double Door Frost Free Refrigerator 260L",
    "price": 24999,
    "originalPrice": 29999,
    "image": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Smart inverter compressor with multi-air flow cooling. convertible freezer compartment allows extra fridge space when hosting.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Kitchen Appliances",
    "brand": "LG"
  },
  {
    "id": "app-7",
    "name": "Air Purifier with HEPA Filter H13",
    "price": 34999,
    "originalPrice": 39999,
    "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Captures 99.95% of allergens and fine dust as small as 0.1 microns. Blends smooth purification with active cooling fans.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Home Comfort",
    "brand": "Dyson"
  },
  {
    "id": "app-8",
    "name": "Digital Oil Filled Radiator Heater 11 Fin",
    "price": 8999,
    "originalPrice": 11999,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "11 fin oil-filled radiator heater featuring 3 heat settings, a PTC fan heater, and auto-tip over safety shut-down switch.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Home Comfort",
    "brand": "Havells"
  },
  {
    "id": "app-9",
    "name": "Garment Steamer Stand 1800W",
    "price": 6999,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Professional vertical garment steamer with adjustable double poles and a detachable 2L water tank for uninterrupted steaming.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Laundry",
    "brand": "Morphy Richards"
  },
  {
    "id": "app-10",
    "name": "Handheld Cordless Car Vacuum 120W",
    "price": 12999,
    "originalPrice": 15999,
    "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Compact handheld vacuum cleaner designed for cars and upholstery. Powered by a high speed brushless digital motor.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Cleaning Appliances",
    "brand": "Dyson"
  },
  {
    "id": "app-11",
    "name": "Multi-Door Convertible Refrigerator 450L",
    "price": 69999,
    "originalPrice": 79999,
    "image": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Spacious french door refrigerator featuring Triple Cooling zones and a convertible middle drawer with 4 temperature settings.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Kitchen Appliances",
    "brand": "Samsung"
  },
  {
    "id": "app-12",
    "name": "Fully Automatic Top Load Washing Machine 7kg",
    "price": 16999,
    "originalPrice": 19999,
    "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Features a built-in heater for hot washes, Spiro Wash motion technology, and 12 distinct wash cycles for various fabrics.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Laundry",
    "brand": "Whirlpool"
  },
  {
    "id": "app-13",
    "name": "Silent Tower Fan with Remote Control",
    "price": 4599,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Space-saving tower fan with high air delivery, 3 speed levels, 70-degree auto oscillation, and a soft-touch remote controller.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Home Comfort",
    "brand": "Havells"
  },
  {
    "id": "app-14",
    "name": "Dishwasher 14 Place Settings (Silver)",
    "price": 38999,
    "originalPrice": 45999,
    "image": "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "TrueSteam technology sanitizes dishes while reducing water spots. QuadWash system uses 4 spray arms for comprehensive cleaning.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Cleaning Appliances",
    "brand": "LG"
  },
  {
    "id": "app-15",
    "name": "Dry Iron with Non-Stick Soleplate 1000W",
    "price": 899,
    "originalPrice": 1199,
    "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Classic dry iron featuring a Weilburger golden non-stick coated soleplate for smooth gliding and a comfortable textured handle.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Laundry",
    "brand": "Philips"
  },
  {
    "id": "app-16",
    "name": "Personal Air Cooler 30L Honeycomb",
    "price": 6999,
    "originalPrice": 8999,
    "image": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Personal air cooler with a 30L tank capacity, high-efficiency honeycomb cooling pads, and an ice chamber for rapid cooling.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Home Comfort",
    "brand": "Havells"
  },
  {
    "id": "app-17",
    "name": "Electric OTG Baking Oven 30L",
    "price": 5499,
    "originalPrice": 7999,
    "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Oven-Toaster-Grill (OTG) with a 30L capacity. Features motorized rotisserie, stay-on timer, and adjustable temperature knobs.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Kitchen Appliances",
    "brand": "Morphy Richards"
  },
  {
    "id": "app-18",
    "name": "Steam Iron 2000W Ceramic Plate",
    "price": 2199,
    "originalPrice": 2999,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Powerful 2000W steam iron that heats up quickly. Offers continuous steam output up to 25g/min and 90g steam boost.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Laundry",
    "brand": "Philips"
  },
  {
    "id": "app-19",
    "name": "Commercial Heavy Duty Wet & Dry Vacuum 15L",
    "price": 7999,
    "originalPrice": 10999,
    "image": "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585338110584-43d88136514d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "A heavy-duty vacuum cleaner built with a 15-litre stainless steel barrel. Sucks up both liquids and dry dust efficiently.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Cleaning Appliances",
    "brand": "LG"
  },
  {
    "id": "app-20",
    "name": "Intelligent Smart Air Humidifier 4L",
    "price": 18999,
    "originalPrice": 24999,
    "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "appliances",
    "description": "Ultrasonic cool mist humidifier that sanitizes water before releasing it. Offers automatic moisture control for dry rooms.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Home Comfort",
    "brand": "Dyson"
  },
  {
    "id": "toy-2",
    "name": "Technic Porsche 911 GT3 RS Set",
    "price": 18999,
    "originalPrice": 24999,
    "image": "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Immersive building set with 2704 pieces. Features detailed orange bodywork, red suspension springs, and working steering gear.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Building Blocks",
    "brand": "LEGO"
  },
  {
    "id": "toy-3",
    "name": "Monopoly Deluxe Edition Board Game",
    "price": 1499,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "The classic property trading board game featuring deluxe golden-finish tokens, wooden houses and hotels, and a card organizer tray.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Board Games",
    "brand": "Hasbro"
  },
  {
    "id": "toy-4",
    "name": "Barbie Dreamhouse Playset (75+ Pieces)",
    "price": 12999,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "A three-story Barbie Dreamhouse standing 3 feet tall. Features 8 rooms, a working elevator, a swimming slide, and lights/sound effects.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Dolls & Action Figures",
    "brand": "Mattel"
  },
  {
    "id": "toy-5",
    "name": "STEM Solar Power Robot Kit 12-in-1",
    "price": 1299,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Build 12 different types of solar-powered robots that can move on land or water. Introduces children to mechanical engineering.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Educational Toys",
    "brand": "Fisher-Price"
  },
  {
    "id": "toy-6",
    "name": "Die-cast Hot Wheels Gift Pack (10 cars)",
    "price": 999,
    "originalPrice": 1299,
    "image": "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Includes 10 highly detailed 1:64 scale die-cast sports cars and race cars. Assorted colors and models in a single pack.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Building Blocks",
    "brand": "Hot Wheels"
  },
  {
    "id": "toy-7",
    "name": "LEGO Architecture Empire State Building",
    "price": 7999,
    "originalPrice": 9999,
    "image": "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Capture the monumental scale of New York's world-famous Empire State Building. Features a tiled base plate and name plate.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Building Blocks",
    "brand": "LEGO"
  },
  {
    "id": "toy-8",
    "name": "Scrabble Original Crossword Game",
    "price": 899,
    "originalPrice": 1199,
    "image": "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "The classic crossword puzzle game that tests your vocabulary. Features 100 wooden letter tiles, 4 racks, and a premium board.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Board Games",
    "brand": "Hasbro"
  },
  {
    "id": "toy-9",
    "name": "Marvel Avengers Action Figure Set (5 Figures)",
    "price": 2999,
    "originalPrice": 3999,
    "image": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Includes 5 classic action figures: Iron Man, Captain America, Thor, Hulk, and Black Widow. Fully articulated joints for posing.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Dolls & Action Figures",
    "brand": "Hasbro"
  },
  {
    "id": "toy-10",
    "name": "Magnetic Building Tiles Set (100 Pcs)",
    "price": 2499,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "A creative set of 100 colorful geometric tiles containing powerful internal magnets. Perfect for building 3D castles and shapes.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Educational Toys",
    "brand": "Funskool"
  },
  {
    "id": "toy-11",
    "name": "NERF Elite 2.0 Commander Blaster",
    "price": 1199,
    "originalPrice": 1499,
    "image": "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Features a rotating drum that holds 6 foam darts. Customize the blaster with accessory rails and a barrel attachment point.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Dolls & Action Figures",
    "brand": "Hasbro"
  },
  {
    "id": "toy-12",
    "name": "Jenga Classic Hardwood Block Game",
    "price": 699,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Pull out a block without crashing the stack! Includes 54 genuine hardwood blocks and an easy-to-use stacking sleeve.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Board Games",
    "brand": "Hasbro"
  },
  {
    "id": "toy-13",
    "name": "Fisher-Price Laugh & Learn Smart Stages Puppy",
    "price": 1599,
    "originalPrice": 1999,
    "image": "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Soft, cuddly plush puppy featuring Smart Stages technology that updates educational content as your baby grows.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Educational Toys",
    "brand": "Fisher-Price"
  },
  {
    "id": "toy-14",
    "name": "LEGO Creator Expert Bonsai Tree Set",
    "price": 4499,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Enjoy a mindful building project with interchangeable green leaves and pink cherry blossom petals. Includes a rectangular pot.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Building Blocks",
    "brand": "LEGO"
  },
  {
    "id": "toy-15",
    "name": "Catan Strategy Board Game Base Game",
    "price": 3499,
    "originalPrice": 4299,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "The legendary board game of resource gathering, trade, and settlement construction. Perfect for family game nights.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Board Games",
    "brand": "Hasbro"
  },
  {
    "id": "toy-16",
    "name": "Hot Wheels Ultimate Gator Car Wash Playset",
    "price": 3999,
    "originalPrice": 4999,
    "image": "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Massive water-themed playset with a hand-powered elevator, water rollers, color-shifting chamber, and giant gator hazard.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Building Blocks",
    "brand": "Hot Wheels"
  },
  {
    "id": "toy-17",
    "name": "Wooden Activity Cube Educational Center",
    "price": 1999,
    "originalPrice": 2799,
    "image": "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Five-sided wooden activity cube featuring a bead maze, gear sliders, clock dials, shape sorter, and flip-flops.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 135,
    "subCategory": "Educational Toys",
    "brand": "Fisher-Price"
  },
  {
    "id": "toy-18",
    "name": "Play-Doh Mega Can Pack (20 Colors)",
    "price": 799,
    "originalPrice": 999,
    "image": "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Includes 20 standard 3-ounce cans of colorful Play-Doh modeling compound. Safe, non-toxic, and reusable.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 142,
    "subCategory": "Educational Toys",
    "brand": "Hasbro"
  },
  {
    "id": "toy-19",
    "name": "LEGO Speed Champions Audi E-Tron Set",
    "price": 1999,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Build and display a highly detailed replica model of the futuristic Audi S1 E-Tron Quattro race car, including a driver minifigure.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 149,
    "subCategory": "Building Blocks",
    "brand": "LEGO"
  },
  {
    "id": "toy-20",
    "name": "Connect 4 Grid Game for Kids",
    "price": 599,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531214159280-079b95d26139?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "toys",
    "description": "Drop your red or yellow discs in the grid and be the first to get 4 in a row to win the classic disc-dropping game.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 156,
    "subCategory": "Board Games",
    "brand": "Hasbro"
  },
  {
    "id": "boo-1",
    "name": "The Midnight Library (Paperback)",
    "price": 399,
    "originalPrice": 499,
    "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Between life and death there is a library, and within that library, the shelves go on forever. Each book provides a chance to try another life you could have lived.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Fiction",
    "brand": "Penguin"
  },
  {
    "id": "boo-2",
    "name": "Atomic Habits (Hardcover)",
    "price": 599,
    "originalPrice": 799,
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "The definitive guide to breaking bad habits and building good ones. James Clear reveals practical strategies to form good habits and break bad ones.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Self-Help",
    "brand": "Random House"
  },
  {
    "id": "boo-3",
    "name": "Sapiens: A Brief History of Humankind",
    "price": 499,
    "originalPrice": 699,
    "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Yuval Noah Harari explores how biology and history have defined us and enhanced our understanding of what it means to be human.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Non-Fiction",
    "brand": "HarperCollins"
  },
  {
    "id": "boo-4",
    "name": "Dune (Deluxe Edition)",
    "price": 699,
    "originalPrice": 899,
    "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Frank Herbert's masterpiece set on the desert planet Arrakis. A stunning deluxe edition featuring custom endpapers and painted edges.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Sci-Fi & Fantasy",
    "brand": "Bloomsbury"
  },
  {
    "id": "boo-5",
    "name": "Steve Jobs (Official Biography)",
    "price": 550,
    "originalPrice": 750,
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Walter Isaacson's riveting biography of the creative entrepreneur whose passion for perfection revolutionized six industries.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Biography",
    "brand": "Simon & Schuster"
  },
  {
    "id": "boo-6",
    "name": "The Alchemist (Special Anniversary Edition)",
    "price": 299,
    "originalPrice": 399,
    "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Fiction",
    "brand": "HarperCollins"
  },
  {
    "id": "boo-7",
    "name": "Thinking, Fast and Slow (Paperback)",
    "price": 450,
    "originalPrice": 599,
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Daniel Kahneman, Nobel laureate in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive our choices.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Non-Fiction",
    "brand": "Penguin"
  },
  {
    "id": "boo-8",
    "name": "The Psychology of Money",
    "price": 349,
    "originalPrice": 450,
    "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of life's decisions.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Self-Help",
    "brand": "HarperCollins"
  },
  {
    "id": "boo-9",
    "name": "The Hobbit (Hardcover Illustrated)",
    "price": 899,
    "originalPrice": 1200,
    "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "A beautiful hardcover edition of J.R.R. Tolkien's fantasy classic, featuring original color illustrations painted by the author himself.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Sci-Fi & Fantasy",
    "brand": "Bloomsbury"
  },
  {
    "id": "boo-10",
    "name": "Educated: A Memoir",
    "price": 420,
    "originalPrice": 550,
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Tara Westover recounts her struggle for self-invention, leaving her survivalist family in rural Idaho to earn a PhD from Cambridge University.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Biography",
    "brand": "Random House"
  },
  {
    "id": "boo-11",
    "name": "A Game of Thrones (Song of Ice and Fire)",
    "price": 499,
    "originalPrice": 599,
    "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "George R.R. Martin's fantasy epic. Enter a world where summers span decades and winters can last a lifetime, and the struggle for the Iron Throne begins.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Sci-Fi & Fantasy",
    "brand": "Bloomsbury"
  },
  {
    "id": "boo-12",
    "name": "Deep Work: Rules for Focused Success",
    "price": 399,
    "originalPrice": 499,
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Cal Newport argues that focus is a superpower in our distracted digital age, presenting practical guidelines to cultivate deep work habits.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Self-Help",
    "brand": "Simon & Schuster"
  },
  {
    "id": "boo-13",
    "name": "Brief Answers to the Big Questions",
    "price": 350,
    "originalPrice": 450,
    "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Stephen Hawking's final book. Offers his personal and scientific reflections on the greatest mysteries of human existence and the cosmos.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Non-Fiction",
    "brand": "Penguin"
  },
  {
    "id": "boo-14",
    "name": "The Great Gatsby (Classic Deluxe)",
    "price": 199,
    "originalPrice": 299,
    "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "F. Scott Fitzgerald's jazz-age masterpiece. A gorgeous collector's edition of Jay Gatsby, Daisy Buchanan, and the decadent roaring twenties.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Fiction",
    "brand": "Penguin"
  },
  {
    "id": "boo-15",
    "name": "Shoe Dog: A Memoir by the Creator of Nike",
    "price": 450,
    "originalPrice": 599,
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "books",
    "description": "Phil Knight, founder of Nike, shares the inside story of the startup's early days as an intrepid importer of Japanese sneakers.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Biography",
    "brand": "Simon & Schuster"
  },
  {
    "id": "jew-1",
    "name": "18k Yellow Gold Diamond Ring",
    "price": 24999,
    "originalPrice": 29999,
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Elegant 18k yellow gold band featuring a cluster of 5 brilliant-cut certified diamonds. Perfect choice for anniversaries.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 30,
    "subCategory": "Rings",
    "brand": "Tanishq"
  },
  {
    "id": "jew-2",
    "name": "Sterling Silver Heart Pendant Necklace",
    "price": 1899,
    "originalPrice": 2499,
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Beautifully polished sterling silver necklace featuring a heart-shaped pendant studded with AAA+ quality cubic zirconia.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 37,
    "subCategory": "Necklaces",
    "brand": "Giva"
  },
  {
    "id": "jew-3",
    "name": "14k Rose Gold Diamond Stud Earrings",
    "price": 12499,
    "originalPrice": 14999,
    "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Simple 14k rose gold studs showcasing round brilliant-cut diamonds in secure four-prong settings. Perfect for daily wear.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 44,
    "subCategory": "Earrings",
    "brand": "CaratLane"
  },
  {
    "id": "jew-4",
    "name": "Classic Solitaire Engagement Ring",
    "price": 45999,
    "originalPrice": 49999,
    "image": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "A timeless engagement ring features a stunning single 0.25-carat brilliant cut diamond mounted on an 18k white gold band.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 51,
    "subCategory": "Rings",
    "brand": "Tanishq"
  },
  {
    "id": "jew-5",
    "name": "Premium Swarovski Crystal Tennis Bracelet",
    "price": 8999,
    "originalPrice": 10999,
    "image": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "A classic tennis bracelet features a continuous line of sparkling clear crystals bezel-set in rhodium-plated metal.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 58,
    "subCategory": "Fine Jewellery",
    "brand": "Swarovski"
  },
  {
    "id": "jew-6",
    "name": "Silver Plated Floral Hoop Earrings",
    "price": 999,
    "originalPrice": 1499,
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Delicate silver-plated hoop earrings featuring a dainty floral motif studded with sparkling white zirconia crystals.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 65,
    "subCategory": "Earrings",
    "brand": "Giva"
  },
  {
    "id": "jew-7",
    "name": "22k Gold Kundan Choker Necklace Set",
    "price": 185000,
    "originalPrice": 195000,
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "An exquisite traditional bridal choker set handcrafted in 22k pure gold, featuring detailed Kundan work and hanging green pearls.",
    "rating": 4.7,
    "reviews": [],
    "isFlado": false,
    "stock": 72,
    "subCategory": "Necklaces",
    "brand": "Malabar"
  },
  {
    "id": "jew-8",
    "name": "Pandora Moments Charm Bracelet Set",
    "price": 5499,
    "originalPrice": 6999,
    "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "A classic sterling silver snake chain bracelet, complete with three select hand-crafted cubic zirconia spacer charms.",
    "rating": 4.8,
    "reviews": [],
    "isFlado": false,
    "stock": 79,
    "subCategory": "Fashion Jewellery",
    "brand": "Pandora"
  },
  {
    "id": "jew-9",
    "name": "18k Rose Gold Infinite Band Ring",
    "price": 15999,
    "originalPrice": 18999,
    "image": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "A continuous infinity symbol band detailed with delicate sparkling diamonds, crafted in premium 18k rose gold.",
    "rating": 4.9,
    "reviews": [],
    "isFlado": false,
    "stock": 86,
    "subCategory": "Rings",
    "brand": "CaratLane"
  },
  {
    "id": "jew-10",
    "name": "Dangling Freshwater Pearl Earrings",
    "price": 1599,
    "originalPrice": 2199,
    "image": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Sterling silver dangling earrings featuring high-luster round white freshwater pearls suspended below cubic zirconia studs.",
    "rating": 4.1,
    "reviews": [],
    "isFlado": false,
    "stock": 93,
    "subCategory": "Earrings",
    "brand": "Giva"
  },
  {
    "id": "jew-11",
    "name": "18k Yellow Gold Emerald Cut Emerald Necklace",
    "price": 74999,
    "originalPrice": 85000,
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "A striking emerald-cut deep green natural emerald pendant suspended from an 18k yellow gold chain, surrounded by a diamond halo.",
    "rating": 4.2,
    "reviews": [],
    "isFlado": false,
    "stock": 100,
    "subCategory": "Necklaces",
    "brand": "Tanishq"
  },
  {
    "id": "jew-12",
    "name": "Chunky Silver Adjustable Statement Ring",
    "price": 2499,
    "originalPrice": 3499,
    "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Bold, textured sterling silver statement ring featuring an adjustable band. Handmade design that adds edge to any look.",
    "rating": 4.3,
    "reviews": [],
    "isFlado": false,
    "stock": 107,
    "subCategory": "Rings",
    "brand": "Pandora"
  },
  {
    "id": "jew-13",
    "name": "Swarovski Elements Blue Drop Earrings",
    "price": 4999,
    "originalPrice": 5999,
    "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Stunning teardrop crystal earrings in sapphire blue color. Suspended from secure hook posts plated in white gold.",
    "rating": 4.4,
    "reviews": [],
    "isFlado": false,
    "stock": 114,
    "subCategory": "Earrings",
    "brand": "Swarovski"
  },
  {
    "id": "jew-14",
    "name": "Multi-layered Beaded Boho Necklace",
    "price": 799,
    "originalPrice": 1299,
    "image": "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "A colorful, casual multi-layered beaded necklace featuring natural stones, wood accents, and small silver spacers.",
    "rating": 4.5,
    "reviews": [],
    "isFlado": false,
    "stock": 121,
    "subCategory": "Fashion Jewellery",
    "brand": "Giva"
  },
  {
    "id": "jew-15",
    "name": "22k Gold Classic Kada Bangle (Single)",
    "price": 92000,
    "originalPrice": 99000,
    "image": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    "category": "jewellery",
    "description": "Classic round design Kada bangle for women in 22k gold, detailed with traditional filigree engraving. Hallmarked for purity.",
    "rating": 4.6,
    "reviews": [],
    "isFlado": false,
    "stock": 128,
    "subCategory": "Fine Jewellery",
    "brand": "Malabar"
  }
];
