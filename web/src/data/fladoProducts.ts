import { Product } from './products';

// Raw template structure for generating 205+ Flado items compactly
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
    specs?: Record<string, string>;
  }[];
}

const templates: CompactTemplate[] = [
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
  {
    category: 'fruits-vegetables',
    subCategory: 'Exotic & Imported',
    brand: 'Flado Fresh',
    items: [
      { id: 'f-v-20', name: 'Hass Avocado (Imported)', weight: '1 pc (approx 200g)', basePrice: 180, discountPrice: 149, unsplashId: 'photo-1523049673857-eb18f1d7b578' },
      { id: 'f-v-21', name: 'Yellow Zucchini', weight: '250g', basePrice: 90, discountPrice: 69, unsplashId: 'photo-1603052875302-d376b7c0638a' },
      { id: 'f-v-22', name: 'Fresh Broccoli', weight: '1 pc (approx 300g)', basePrice: 120, discountPrice: 89, unsplashId: 'photo-1584269600464-37b1b58a9fe7' }
    ]
  },
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Milk & Cream',
    brand: 'Amul',
    items: [
      { id: 'd-b-1', name: 'Toned Milk (Taaza)', weight: '1L Tetra', basePrice: 75, discountPrice: 72, unsplashId: 'photo-1563636619-e9143da7973b' },
      { id: 'd-b-2', name: 'Gold Full Cream Milk', weight: '1L Pack', basePrice: 82, discountPrice: 79, unsplashId: 'photo-1550583724-b2692b85b150' },
      { id: 'd-b-3', name: 'Fresh Cream 25% Fat', weight: '250ml Pack', basePrice: 70, discountPrice: 65, unsplashId: 'photo-1618245472463-b37f44d9f67a' }
    ]
  },
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Butter & Cheese',
    brand: 'Amul',
    items: [
      { id: 'd-b-4', name: 'Salted Butter', weight: '500g Pack', basePrice: 275, discountPrice: 265, unsplashId: 'photo-1589985270826-4b7bb135bc9d' },
      { id: 'd-b-5', name: 'Cheese Slices (Processed)', weight: '200g (10 slices)', basePrice: 160, discountPrice: 148, unsplashId: 'photo-1552763487-173f2fb10d62' },
      { id: 'd-b-6', name: 'Mozzarella Pizza Cheese', weight: '200g Grated', basePrice: 140, discountPrice: 129, unsplashId: 'photo-1608686207856-001b95cf60ca' }
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
      { id: 'd-b-9', name: 'Premium Sandwich Bread', weight: '400g Pack', basePrice: 50, discountPrice: 42, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'd-b-10', name: '100% Whole Wheat Bread', weight: '400g Pack', basePrice: 60, discountPrice: 52, unsplashId: 'photo-1549931319-a545dcf3bc73' },
      { id: 'd-b-11', name: 'Flado Gourmet Sourdough', weight: '400g Loaf', basePrice: 150, discountPrice: 120, unsplashId: 'photo-1585478259715-876acc5be8eb' }
    ]
  },
  {
    category: 'dairy-bread-eggs',
    subCategory: 'Yogurt & Lassi',
    brand: 'Mother Dairy',
    items: [
      { id: 'd-b-12', name: 'Fresh Set Curd (Dahi)', weight: '400g Cup', basePrice: 50, discountPrice: 45, unsplashId: 'photo-1488477181946-6428a0291777' },
      { id: 'd-b-13', name: 'Epigamia Greek Yogurt Blueberries', weight: '90g Cup', basePrice: 75, discountPrice: 68, unsplashId: 'photo-1571244856353-fb08f55e975a' },
      { id: 'd-b-14', name: 'Sweet Lassi Tetrapak', weight: '200ml Pack', basePrice: 25, discountPrice: 22, unsplashId: 'photo-1626132647523-66f5bf380027' }
    ]
  },
  {
    category: 'atta-rice-dal',
    subCategory: 'Atta & Flours',
    brand: 'Aashirvaad',
    items: [
      { id: 'a-r-1', name: 'Shudh Chakki Atta', weight: '5 kg', basePrice: 280, discountPrice: 259, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'a-r-2', name: 'Organics Wheat Atta', weight: '5 kg', basePrice: 340, discountPrice: 299, unsplashId: 'photo-1574321020309-669db751d3b0' },
      { id: 'a-r-3', name: 'Tata Sampann Besan', weight: '1 kg', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'a-r-4', name: 'Tata Sampann Maida', weight: '1 kg', basePrice: 70, discountPrice: 59, unsplashId: 'photo-1509440159596-0249088772ff' }
    ]
  },
  {
    category: 'atta-rice-dal',
    subCategory: 'Rice Products',
    brand: 'Daawat',
    items: [
      { id: 'a-r-5', name: 'Super Basmati Rice Rozana', weight: '5 kg', basePrice: 650, discountPrice: 499, unsplashId: 'photo-1586201375761-83865001e31c' },
      { id: 'a-r-6', name: 'Premium Brown Rice', weight: '1 kg', basePrice: 160, discountPrice: 139, unsplashId: 'photo-1596797038530-2c107229654b' },
      { id: 'a-r-7', name: 'Thin Rice Flakes (Poha)', weight: '500g', basePrice: 50, discountPrice: 42, unsplashId: 'photo-1586201375761-83865001e31c' }
    ]
  },
  {
    category: 'atta-rice-dal',
    subCategory: 'Pulses & Dals',
    brand: 'Tata Sampann',
    items: [
      { id: 'a-r-8', name: 'Unpolished Toor Dal', weight: '1 kg', basePrice: 180, discountPrice: 159, unsplashId: 'photo-1547058881-aa0edd92aab3' },
      { id: 'a-r-9', name: 'Unpolished Moong Dal Chilka', weight: '1 kg', basePrice: 190, discountPrice: 168, unsplashId: 'photo-1547058881-aa0edd92aab3' },
      { id: 'a-r-10', name: 'Kabuli Chana (Chickpeas)', weight: '1 kg', basePrice: 170, discountPrice: 145, unsplashId: 'photo-1547058881-aa0edd92aab3' },
      { id: 'a-r-11', name: 'Unpolished Chana Dal', weight: '1 kg', basePrice: 130, discountPrice: 109, unsplashId: 'photo-1547058881-aa0edd92aab3' },
      { id: 'a-r-12', name: 'Premium Rajma Chitra', weight: '1 kg', basePrice: 200, discountPrice: 175, unsplashId: 'photo-1547058881-aa0edd92aab3' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Chips & Crisps',
    brand: 'Lays',
    items: [
      { id: 's-b-1', name: 'Classic Salted Potato Chips', weight: '115g Pack', basePrice: 50, discountPrice: 45, unsplashId: 'photo-1566478989037-eec170784d0b' },
      { id: 's-b-2', name: 'India\'s Magic Masala Chips', weight: '115g Pack', basePrice: 50, discountPrice: 45, unsplashId: 'photo-1566478989037-eec170784d0b' },
      { id: 's-b-3', name: 'Doritos Cheese Nachos', weight: '150g Pack', basePrice: 90, discountPrice: 79, unsplashId: 'photo-1518047601542-79f18c655718' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Chocolates & Candies',
    brand: 'Cadbury',
    items: [
      { id: 's-b-4', name: 'Dairy Milk Silk Chocolate', weight: '150g Bar', basePrice: 180, discountPrice: 149, unsplashId: 'photo-1548907040-4d42b52145ca' },
      { id: 's-b-5', name: 'Bournville Dark Rich Cocoa 70%', weight: '80g Bar', basePrice: 110, discountPrice: 95, unsplashId: 'photo-1606313564200-e75d5e30476c' },
      { id: 's-b-6', name: 'KitKat 4-Finger Milk Bar', weight: '37g Pack', basePrice: 30, discountPrice: 25, unsplashId: 'photo-1582298538104-fe2e74c27f59' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Tea & Coffee',
    brand: 'Nestle',
    items: [
      { id: 's-b-7', name: 'Nescafe Classic Instant Coffee', weight: '100g Jar', basePrice: 320, discountPrice: 299, unsplashId: 'photo-1514432324607-a09d9b4aefdd' },
      { id: 's-b-8', name: 'Brooke Bond Red Label Tea', weight: '500g Pack', basePrice: 220, discountPrice: 199, unsplashId: 'photo-1576092768241-dec231879fc3' },
      { id: 's-b-9', name: 'Tata Tea Gold Premium', weight: '500g Pack', basePrice: 260, discountPrice: 229, unsplashId: 'photo-1576092768241-dec231879fc3' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Cold Drinks & Juices',
    brand: 'Coca-Cola',
    items: [
      { id: 's-b-10', name: 'Coca Cola Soft Drink PET', weight: '1.25L Bottle', basePrice: 75, discountPrice: 65, unsplashId: 'photo-1622483767028-3f66f32aef97' },
      { id: 's-b-11', name: 'Sprite Lemon Lime Soft Drink', weight: '1.25L Bottle', basePrice: 75, discountPrice: 65, unsplashId: 'photo-1625772299848-391b6a87d7b3' },
      { id: 's-b-12', name: 'Real Active 100% Orange Juice', weight: '1L Tetrapak', basePrice: 140, discountPrice: 119, unsplashId: 'photo-1621506289937-a8e4df240d0b' }
    ]
  },
  {
    category: 'snacks-beverages',
    subCategory: 'Namkeens & Savories',
    brand: 'Haldirams',
    items: [
      { id: 's-b-13', name: 'Aloo Bhujia Namkeen Snacks', weight: '400g Pack', basePrice: 110, discountPrice: 95, unsplashId: 'photo-1566478989037-eec170784d0b' },
      { id: 's-b-14', name: 'Bhujia Sev Spicy Gram Flour', weight: '400g Pack', basePrice: 110, discountPrice: 95, unsplashId: 'photo-1566478989037-eec170784d0b' },
      { id: 's-b-15', name: 'Classic Moong Dal Salted', weight: '200g Pack', basePrice: 60, discountPrice: 49, unsplashId: 'photo-1566478989037-eec170784d0b' }
    ]
  },
  {
    category: 'frozen-ready-meals',
    subCategory: 'Frozen Veggies',
    brand: 'Amul',
    items: [
      { id: 'f-r-1', name: 'Frozen Green Peas (Matar)', weight: '500g Pack', basePrice: 100, discountPrice: 85, unsplashId: 'photo-1592417817098-8f3d6eb19675' },
      { id: 'f-r-2', name: 'Frozen Sweet Corn Kernels', weight: '500g Pack', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1551754655-cd27e38d2076' }
    ]
  },
  {
    category: 'frozen-ready-meals',
    subCategory: 'Ready to Cook Fries & Nuggets',
    brand: 'McCain',
    items: [
      { id: 'f-r-3', name: 'French Fries Crispy Frozen', weight: '750g Pack', basePrice: 190, discountPrice: 169, unsplashId: 'photo-1573080496219-bb080dd4f877' },
      { id: 'f-r-4', name: 'Potato Cheese Shots Frozen', weight: '400g Pack', basePrice: 160, discountPrice: 139, unsplashId: 'photo-1541532713592-79a0317b6b77' },
      { id: 'f-r-5', name: 'Amul Happy Treats Cheese Nuggets', weight: '400g Pack', basePrice: 180, discountPrice: 155, unsplashId: 'photo-1541532713592-79a0317b6b77' }
    ]
  },
  {
    category: 'frozen-ready-meals',
    subCategory: 'Instant Noodles & Soups',
    brand: 'Nestle',
    items: [
      { id: 'f-r-6', name: 'Maggi 2-Minute Masala Noodles', weight: 'Pack of 12 (840g)', basePrice: 180, discountPrice: 162, unsplashId: 'photo-1612966608997-30d0dfd8783d' },
      { id: 'f-r-7', name: 'Knorr Classic Tomato Soup Mix', weight: '50g Pack', basePrice: 55, discountPrice: 48, unsplashId: 'photo-1547592165-e1d17fed6005' },
      { id: 'f-r-8', name: 'Ching\'s Hot & Sour Soup Mix', weight: '55g Pack', basePrice: 60, discountPrice: 50, unsplashId: 'photo-1547592165-e1d17fed6005' }
    ]
  },
  {
    category: 'frozen-ready-meals',
    subCategory: 'Frozen Desserts & Icecreams',
    brand: 'Amul',
    items: [
      { id: 'f-r-9', name: 'Vanilla Magic Ice Cream Tub', weight: '1L Tub', basePrice: 150, discountPrice: 129, unsplashId: 'photo-1572490122747-3968b75cc699' },
      { id: 'f-r-10', name: 'Shahi Anjeer Ice Cream Tub', weight: '1L Tub', basePrice: 220, discountPrice: 195, unsplashId: 'photo-1501443790141-14b2413158ed' },
      { id: 'f-r-11', name: 'Choco Bite Ice Cream Bar', weight: 'Pack of 4', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1568901346375-23c9450c58cd' }
    ]
  },
  {
    category: 'household-cleaning',
    subCategory: 'Detergents & Liquid Soaps',
    brand: 'HUL',
    items: [
      { id: 'h-c-1', name: 'Surf Excel Easy Wash Detergent', weight: '1 kg', basePrice: 180, discountPrice: 165, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-2', name: 'Ariel Complete Front Load Liquid', weight: '1L Bottle', basePrice: 250, discountPrice: 229, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-3', name: 'Comfort After Wash Softener Pink', weight: '1L Bottle', basePrice: 240, discountPrice: 215, unsplashId: 'photo-1583394838336-acd977736f90' }
    ]
  },
  {
    category: 'household-cleaning',
    subCategory: 'Toilet Cleaners & Disinfectants',
    brand: 'Reckitt',
    items: [
      { id: 'h-c-4', name: 'Harpic Liquid Toilet Cleaner Blue', weight: '1L Bottle', basePrice: 195, discountPrice: 175, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-5', name: 'Lizol Floral Floor Cleaner Liquid', weight: '975ml Bottle', basePrice: 210, discountPrice: 189, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-6', name: 'Dettol Disinfectant Liquid Floral', weight: '500ml Bottle', basePrice: 220, discountPrice: 199, unsplashId: 'photo-1583394838336-acd977736f90' }
    ]
  },
  {
    category: 'household-cleaning',
    subCategory: 'Garbage Bags & Tissues',
    brand: 'Flado Clean',
    items: [
      { id: 'h-c-7', name: 'Medium Garbage Bags Black', weight: 'Pack of 30', basePrice: 110, discountPrice: 89, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-8', name: 'Kitchen Paper Towels 2-Ply', weight: 'Pack of 2 Rolls', basePrice: 90, discountPrice: 75, unsplashId: 'photo-1583394838336-acd977736f90' },
      { id: 'h-c-9', name: 'Vim Lemon Dishwash Liquid Gel', weight: '500ml Squeeze', basePrice: 120, discountPrice: 109, unsplashId: 'photo-1583394838336-acd977736f90' }
    ]
  },
  {
    category: 'personal-care',
    subCategory: 'Shampoos & Soaps',
    brand: 'Dove',
    items: [
      { id: 'p-c-1', name: 'Dove Cream Beauty Bar Soap', weight: '125g (Pack of 3)', basePrice: 240, discountPrice: 215, unsplashId: 'photo-1607006342411-1a06d045a924' },
      { id: 'p-c-2', name: 'Head & Shoulders Anti-Dandruff', weight: '340ml Bottle', basePrice: 320, discountPrice: 289, unsplashId: 'photo-1527735093752-c6f890e0c80b' },
      { id: 'p-c-3', name: 'Dettol Handwash Skincare Refill', weight: '750ml Pouch', basePrice: 190, discountPrice: 169, unsplashId: 'photo-1603006905003-be475563bc59' }
    ]
  },
  {
    category: 'personal-care',
    subCategory: 'Face & Skincare',
    brand: 'Mamaearth',
    items: [
      { id: 'p-c-4', name: 'Mamaearth Tea Tree Face Wash', weight: '100ml Tube', basePrice: 259, discountPrice: 229, unsplashId: 'photo-1556228720-195a672e8a03' },
      { id: 'p-c-5', name: 'Nivea Soft Light Moisturiser', weight: '200ml Tub', basePrice: 350, discountPrice: 299, unsplashId: 'photo-1620916566398-39f1143ab7be' },
      { id: 'p-c-6', name: 'Lakme Absolute Matte Lipstick', weight: '3.5g Stick', basePrice: 550, discountPrice: 420, unsplashId: 'photo-1586495777744-4413f21062fa' }
    ]
  },
  {
    category: 'personal-care',
    subCategory: 'Oral Care',
    brand: 'Colgate',
    items: [
      { id: 'p-c-7', name: 'MaxFresh Blue Gel Toothpaste', weight: '150g (Pack of 2)', basePrice: 190, discountPrice: 165, unsplashId: 'photo-1559591937-e6fcd20d200c' },
      { id: 'p-c-8', name: 'Sensodyne Rapid Relief Toothpaste', weight: '100g Tube', basePrice: 210, discountPrice: 189, unsplashId: 'photo-1559591937-e6fcd20d200c' },
      { id: 'p-c-9', name: 'Listerine Cool Mint Mouthwash', weight: '500ml Bottle', basePrice: 250, discountPrice: 219, unsplashId: 'photo-1559591937-e6fcd20d200c' }
    ]
  },
  {
    category: 'baby-care',
    subCategory: 'Baby Diapers & Wipes',
    brand: 'Pampers',
    items: [
      { id: 'b-c-1', name: 'Active Baby Diaper Pants Medium', weight: 'Pack of 54', basePrice: 999, discountPrice: 849, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' },
      { id: 'b-c-2', name: 'Himalaya Herbal Gentle Baby Wipes', weight: 'Pack of 72 Wipes', basePrice: 150, discountPrice: 129, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' }
    ]
  },
  {
    category: 'baby-care',
    subCategory: 'Baby Soaps & Lotions',
    brand: 'Himalaya',
    items: [
      { id: 'b-c-3', name: 'Gentle Baby Soap Pack', weight: '75g (Pack of 3)', basePrice: 140, discountPrice: 119, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' },
      { id: 'b-c-4', name: 'Mamaearth Gentle Baby Shampoo', weight: '200ml Bottle', basePrice: 299, discountPrice: 259, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' }
    ]
  },
  {
    category: 'baby-care',
    subCategory: 'Baby Food & Formula',
    brand: 'Nestle',
    items: [
      { id: 'b-c-5', name: 'Nestum Rice Infant Cereal', weight: '300g Tin', basePrice: 320, discountPrice: 299, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' },
      { id: 'b-c-6', name: 'Cerelac Wheat Apple Cereal Stage 1', weight: '300g Pouch', basePrice: 280, discountPrice: 265, unsplashId: 'photo-1601049541289-9b1b7bbbfe19' }
    ]
  },
  {
    category: 'health-pharmacy',
    subCategory: 'OTC Medicines',
    brand: 'Sun Pharma',
    items: [
      { id: 'h-p-1', name: 'Dolo 650 Paracetamol Tablets', weight: '15 Tablets', basePrice: 30, discountPrice: 28, unsplashId: 'photo-1584308666744-24d5c474f2ae' },
      { id: 'h-p-2', name: 'Volini Instant Pain Relief Spray', weight: '55g Can', basePrice: 160, discountPrice: 145, unsplashId: 'photo-1584308666744-24d5c474f2ae' },
      { id: 'h-p-3', name: 'Eno Fruit Salt Fast Gas Relief Lemon', weight: 'Pack of 6 Sachets', basePrice: 50, discountPrice: 46, unsplashId: 'photo-1584308666744-24d5c474f2ae' }
    ]
  },
  {
    category: 'health-pharmacy',
    subCategory: 'Vitamins & Supplements',
    brand: 'Sun Pharma',
    items: [
      { id: 'h-p-4', name: 'Revital H Daily Health Capsules', weight: '30 Capsules', basePrice: 350, discountPrice: 310, unsplashId: 'photo-1584308666744-24d5c474f2ae' },
      { id: 'h-p-5', name: 'Limcee Vitamin C Chewable Tablets', weight: '15 Tablets', basePrice: 40, discountPrice: 35, unsplashId: 'photo-1584308666744-24d5c474f2ae' }
    ]
  },
  {
    category: 'health-pharmacy',
    subCategory: 'Wound Care',
    brand: 'Johnson & Johnson',
    items: [
      { id: 'h-p-6', name: 'Band-Aid Fabric Strips', weight: 'Pack of 20', basePrice: 45, discountPrice: 39, unsplashId: 'photo-1584308666744-24d5c474f2ae' },
      { id: 'h-p-7', name: 'Dettol Instant Hand Sanitizer', weight: '500ml Dispenser', basePrice: 250, discountPrice: 199, unsplashId: 'photo-1584308666744-24d5c474f2ae' }
    ]
  },
  {
    category: 'pet-care',
    subCategory: 'Dog Food & Treats',
    brand: 'Pedigree',
    items: [
      { id: 'p-t-1', name: 'Pedigree Chicken & Vegetables Dry', weight: '3 kg Bag', basePrice: 750, discountPrice: 699, unsplashId: 'photo-1589595608370-98f1f59f635d' },
      { id: 'p-t-2', name: 'Drools Puppy Food Booster Pack', weight: '1.2 kg Bag', basePrice: 340, discountPrice: 299, unsplashId: 'photo-1589595608370-98f1f59f635d' }
    ]
  },
  {
    category: 'pet-care',
    subCategory: 'Cat Food & Litter',
    brand: 'Whiskas',
    items: [
      { id: 'p-t-3', name: 'Whiskas Wet Cat Food Chicken Gravy', weight: '85g (Pack of 12)', basePrice: 480, discountPrice: 420, unsplashId: 'photo-1589595608370-98f1f59f635d' },
      { id: 'p-t-4', name: 'Drools Premium Lavender Cat Litter', weight: '5 kg Pack', basePrice: 350, discountPrice: 299, unsplashId: 'photo-1589595608370-98f1f59f635d' }
    ]
  },
  {
    category: 'electronics-accessories',
    subCategory: 'Cables & Chargers',
    brand: 'Realme',
    items: [
      { id: 'e-a-1', name: 'USB Type-C Fast Charging Cable', weight: '1 meter', basePrice: 299, discountPrice: 199, unsplashId: 'photo-1546868871-7041f2a55e12' },
      { id: 'e-a-2', name: 'SuperDart 20W USB Wall Adapter', weight: '1 pc', basePrice: 599, discountPrice: 499, unsplashId: 'photo-1546868871-7041f2a55e12' }
    ]
  },
  {
    category: 'electronics-accessories',
    subCategory: 'Audio & Wearables',
    brand: 'boAt',
    items: [
      { id: 'e-a-3', name: 'Bassheads Wired Earphones 100', weight: '1 unit', basePrice: 699, discountPrice: 399, unsplashId: 'photo-1590658268037-6bf12165a8df' },
      { id: 'e-a-4', name: 'Noise ColorFit Smartwatch Activity', weight: '1 unit', basePrice: 2999, discountPrice: 1799, unsplashId: 'photo-1523275335684-37898b6baf30' }
    ]
  },
  {
    category: 'electronics-accessories',
    subCategory: 'Batteries',
    brand: 'Duracell',
    items: [
      { id: 'e-a-5', name: 'Chara Chari AA Batteries Alkaline', weight: 'Pack of 4', basePrice: 160, discountPrice: 140, unsplashId: 'photo-1546868871-7041f2a55e12' }
    ]
  },
  {
    category: 'oils-masalas-spices',
    subCategory: 'Cooking Oils',
    brand: 'Fortune',
    items: [
      { id: 'o-m-1', name: 'Fortune Mustard Oil Kachi Ghani', weight: '1L Bottle', basePrice: 180, discountPrice: 159, unsplashId: 'photo-1474979266404-7eaacbcd87c5' },
      { id: 'o-m-2', name: 'Saffola Gold Multisource Oil', weight: '1L Bottle', basePrice: 200, discountPrice: 185, unsplashId: 'photo-1474979266404-7eaacbcd87c5' }
    ]
  },
  {
    category: 'oils-masalas-spices',
    subCategory: 'Masalas & Spices',
    brand: 'MDH',
    items: [
      { id: 'o-m-3', name: 'Garam Masala Powder Spice Mix', weight: '100g Pack', basePrice: 90, discountPrice: 79, unsplashId: 'photo-1596003906949-67221c37965c' },
      { id: 'o-m-4', name: 'Everest Turmeric (Haldi) Powder', weight: '100g Pack', basePrice: 40, discountPrice: 32, unsplashId: 'photo-1596003906949-67221c37965c' },
      { id: 'o-m-5', name: 'Everest Tikhalal Red Chili Powder', weight: '100g Pack', basePrice: 60, discountPrice: 48, unsplashId: 'photo-1596003906949-67221c37965c' },
      { id: 'o-m-6', name: 'Tata Salt Lite Low Sodium Iodized', weight: '1 kg', basePrice: 40, discountPrice: 35, unsplashId: 'photo-1596003906949-67221c37965c' }
    ]
  },
  {
    category: 'bakery-biscuits',
    subCategory: 'Biscuits',
    brand: 'Britannia',
    items: [
      { id: 'b-b-1', name: 'Good Day Cashew Cookies Biscuits', weight: '200g Pack', basePrice: 40, discountPrice: 32, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'b-b-2', name: 'Parle-G Gold Glucose Biscuits', weight: '250g Pack', basePrice: 20, discountPrice: 18, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'b-b-3', name: 'Oreo Original Vanilla Cream Cookies', weight: '120g Pack', basePrice: 40, discountPrice: 35, unsplashId: 'photo-1509440159596-0249088772ff' }
    ]
  },
  {
    category: 'bakery-biscuits',
    subCategory: 'Bakery Products',
    brand: 'Flado Bakery',
    items: [
      { id: 'b-b-4', name: 'Fresh Chocolate Croissant', weight: '1 pc (70g)', basePrice: 60, discountPrice: 49, unsplashId: 'photo-1509440159596-0249088772ff' },
      { id: 'b-b-5', name: 'Baked Blueberry Muffin Fresh', weight: '1 pc (80g)', basePrice: 70, discountPrice: 55, unsplashId: 'photo-1509440159596-0249088772ff' }
    ]
  },
  {
    category: 'stationery-games',
    subCategory: 'Stationery Products',
    brand: 'Camlin',
    items: [
      { id: 's-g-1', name: 'Camlin Kokuyo Supreme Pencil Box', weight: '1 unit', basePrice: 120, discountPrice: 99, unsplashId: 'photo-1586075010923-2dd4570fb338' },
      { id: 's-g-2', name: 'Classmate A4 Ruling Notebook', weight: '1 pc (120 pages)', basePrice: 80, discountPrice: 69, unsplashId: 'photo-1586075010923-2dd4570fb338' }
    ]
  },
  {
    category: 'stationery-games',
    subCategory: 'Games & Toys',
    brand: 'LEGO',
    items: [
      { id: 's-g-3', name: 'UNO Original Classic Card Game', weight: '1 pack', basePrice: 199, discountPrice: 149, unsplashId: 'photo-1610890716171-6b1bb98ffd09' },
      { id: 's-g-4', name: 'LEGO Creator Red Racer Set 31054', weight: '1 unit', basePrice: 899, discountPrice: 749, unsplashId: 'photo-1610890716171-6b1bb98ffd09' }
    ]
  },
  {
    category: 'flowers-gifts',
    subCategory: 'Flowers Bouquet',
    brand: 'FNP',
    items: [
      { id: 'f-g-1', name: 'Premium Red Roses Bouquet Fresh', weight: 'Pack of 10 Stems', basePrice: 499, discountPrice: 399, unsplashId: 'photo-1561181286-d3fee7d55364' },
      { id: 'f-g-2', name: 'Yellow Carnations Glass Vase Bouquet', weight: 'Pack of 8 Stems', basePrice: 599, discountPrice: 479, unsplashId: 'photo-1561181286-d3fee7d55364' }
    ]
  },
  {
    category: 'flowers-gifts',
    subCategory: 'Greeting Cards & Candles',
    brand: 'Archies',
    items: [
      { id: 'f-g-3', name: 'Gourmet Scented Soy Candle Lavender', weight: '1 pc (150g)', basePrice: 350, discountPrice: 279, unsplashId: 'photo-1603006905003-be475563bc59' },
      { id: 'f-g-4', name: 'Happy Birthday Archies Greeting Card', weight: '1 unit', basePrice: 150, discountPrice: 120, unsplashId: 'photo-1561181286-d3fee7d55364' }
    ]
  }
];

// Helper to expand template items into the 205+ items catalog programmatically
const generateFladoProducts = (): Product[] => {
  const list: Product[] = [];
  
  templates.forEach((tpl) => {
    tpl.items.forEach((item, index) => {
      // Dynamic specification details based on subcategory
      const dynamicSpecs: Record<string, string> = {
        'Brand': tpl.brand,
        'Packaging Type': item.weight.includes('Pack') ? 'Crate/Packet' : 'Standard Plastic Wrap',
        'Shelf Life': tpl.category.includes('fresh') || tpl.category.includes('dairy') ? '3-5 Days' : '6 Months',
        'Storage Instructions': tpl.category.includes('frozen') ? 'Store in Freezer' : 'Store in Cool, Dry Place'
      };

      if (item.specs) {
        Object.assign(dynamicSpecs, item.specs);
      }

      list.push({
        id: `flado-${item.id}`,
        name: item.name,
        description: `High quality ${item.name.toLowerCase()} sourced by AuraMart's premium instant delivery service Flado. Quick dispatched and cooled with active temperature-safe packaging to ensure fresh delivery in 10-minutes.`,
        price: item.discountPrice ?? item.basePrice,
        originalPrice: item.basePrice,
        rating: +(4.2 + (index % 8) * 0.1).toFixed(1),
        reviewsCount: 50 + (index % 10) * 35,
        images: [`https://images.unsplash.com/${item.unsplashId}?w=600&auto=format&fit=crop&q=80`],
        image: `https://images.unsplash.com/${item.unsplashId}?w=600&auto=format&fit=crop&q=80`,
        category: tpl.category,
        subCategory: tpl.subCategory,
        isFlado: true,
        fladoStock: 30 + (index % 4) * 12,
        generalStock: 0,
        specifications: dynamicSpecs,
        badge: index % 3 === 0 ? 'Bestseller' : (index % 4 === 1 ? 'New' : '10-Min Delivery'),
        brand: tpl.brand,
        launchDate: `2026-03-${10 + (index % 15)}`,
        sponsored: index % 7 === 2,
        trendingScore: 70 + (index % 6) * 4,
        weight: item.weight,
        nutritionInfo: tpl.category.includes('fruits') || tpl.category.includes('dairy') 
          ? 'Calories: 95kcal | Sugar: 12g | Protein: 3g per serving'
          : undefined
      });
    });

    // Sub-generate items to reach target density per category (e.g. 14 items per category)
    // To ensure a full count of 210 products in the dataset
    const extraItemCount = 14 - tpl.items.length;
    for (let i = 0; i < extraItemCount; i++) {
      const sourceItem = tpl.items[i % tpl.items.length];
      const id = `${sourceItem.id}-x-${i}`;
      list.push({
        id: `flado-${id}`,
        name: `Premium ${sourceItem.name} (Select Grade)`,
        description: `Premium hand-selected version of ${sourceItem.name.toLowerCase()} sourced by Flado quick commerce. Sourced locally and certified quality.`,
        price: Math.round(sourceItem.basePrice * 1.15),
        originalPrice: Math.round(sourceItem.basePrice * 1.25),
        rating: +(4.5 + (i % 5) * 0.1).toFixed(1),
        reviewsCount: 80 + i * 22,
        images: [`https://images.unsplash.com/${sourceItem.unsplashId}?w=600&auto=format&fit=crop&q=80`],
        image: `https://images.unsplash.com/${sourceItem.unsplashId}?w=600&auto=format&fit=crop&q=80`,
        category: tpl.category,
        subCategory: tpl.subCategory,
        isFlado: true,
        fladoStock: 25 + i * 5,
        generalStock: 0,
        specifications: {
          'Brand': tpl.brand,
          'Grade': 'Premium Choice'
        },
        badge: 'Special Price',
        brand: tpl.brand,
        launchDate: `2026-03-24`,
        weight: sourceItem.weight,
        nutritionInfo: 'High-quality organic packaging'
      });
    }
  });

  return list;
};

export const fladoProductsData = generateFladoProducts();
