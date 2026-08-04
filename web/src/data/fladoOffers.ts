export interface FladoCoupon {
  code: string;
  type: 'FLAT_OFF' | 'PERCENT_OFF' | 'FREE_DELIVERY' | 'CASHBACK' | 'BOGO';
  discountAmount: number; // For FLAT_OFF or PERCENT_OFF or CASHBACK
  minOrder: number;
  description: string;
  categoryConstraint?: string; // Optional slug constraint
  expiryDate: string;
  accentColor: string;
}

export const fladoOffersData: FladoCoupon[] = [
  {
    code: 'FLADO100',
    type: 'FLAT_OFF',
    discountAmount: 100,
    minOrder: 399,
    description: 'Flat ₹100 OFF on your first Flado order! Welcome to instant delivery.',
    expiryDate: '2026-12-31',
    accentColor: '#10B981'
  },
  {
    code: 'SAVE80',
    type: 'FLAT_OFF',
    discountAmount: 80,
    minOrder: 499,
    description: 'Save ₹80 flat on orders above ₹499. Applicable store-wide.',
    expiryDate: '2026-08-30',
    accentColor: '#3B82F6'
  },
  {
    code: 'FREESHIP',
    type: 'FREE_DELIVERY',
    discountAmount: 15,
    minOrder: 99,
    description: 'Free delivery on all quick commerce orders above ₹99.',
    expiryDate: '2026-09-15',
    accentColor: '#F59E0B'
  },
  {
    code: 'ORGANIC20',
    type: 'PERCENT_OFF',
    discountAmount: 20,
    minOrder: 299,
    description: '20% OFF on Fresh organic greens in Fruits & Vegetables.',
    categoryConstraint: 'fruits-vegetables',
    expiryDate: '2026-07-20',
    accentColor: '#10B981'
  },
  {
    code: 'DAIRY30',
    type: 'FLAT_OFF',
    discountAmount: 30,
    minOrder: 199,
    description: 'Flat ₹30 off on Amul and Mother Dairy milk products.',
    categoryConstraint: 'dairy-bread-eggs',
    expiryDate: '2026-07-25',
    accentColor: '#3B82F6'
  },
  {
    code: 'SWEET15',
    type: 'PERCENT_OFF',
    discountAmount: 15,
    minOrder: 250,
    description: '15% off sweet treats and chocolates in Snacks & Beverages.',
    categoryConstraint: 'snacks-beverages',
    expiryDate: '2026-08-01',
    accentColor: '#EF4444'
  },
  {
    code: 'FROZEN20',
    type: 'PERCENT_OFF',
    discountAmount: 20,
    minOrder: 300,
    description: 'Flat 20% off on all McCain frozen fries and burgers.',
    categoryConstraint: 'frozen-ready-meals',
    expiryDate: '2026-08-10',
    accentColor: '#8B5CF6'
  },
  {
    code: 'CLEAN50',
    type: 'FLAT_OFF',
    discountAmount: 50,
    minOrder: 399,
    description: '₹50 off detergent combos and home care cleaning supplies.',
    categoryConstraint: 'household-cleaning',
    expiryDate: '2026-09-01',
    accentColor: '#6B7280'
  },
  {
    code: 'GLOW25',
    type: 'PERCENT_OFF',
    discountAmount: 25,
    minOrder: 499,
    description: 'Get 25% off Lakme and Mamaearth skincare cosmetics.',
    categoryConstraint: 'personal-care',
    expiryDate: '2026-07-15',
    accentColor: '#EC4899'
  },
  {
    code: 'DIAPER100',
    type: 'FLAT_OFF',
    discountAmount: 100,
    minOrder: 799,
    description: 'Save ₹100 on baby diapers and hygiene packs.',
    categoryConstraint: 'baby-care',
    expiryDate: '2026-08-15',
    accentColor: '#06B6D4'
  },
  {
    code: 'VITA10',
    type: 'PERCENT_OFF',
    discountAmount: 10,
    minOrder: 199,
    description: 'Flat 10% off on wellness supplements and OTC medicines.',
    categoryConstraint: 'health-pharmacy',
    expiryDate: '2026-07-31',
    accentColor: '#10B981'
  },
  {
    code: 'BOAT100',
    type: 'FLAT_OFF',
    discountAmount: 100,
    minOrder: 999,
    description: 'Flat ₹100 off on boAt chargers and earbuds accessories.',
    categoryConstraint: 'electronics-accessories',
    expiryDate: '2026-08-20',
    accentColor: '#1F2937'
  },
  {
    code: 'BRICK200',
    type: 'FLAT_OFF',
    discountAmount: 200,
    minOrder: 1499,
    description: 'Flat ₹200 off on all Lego sets and premium kids toys.',
    categoryConstraint: 'stationery-games',
    expiryDate: '2026-08-31',
    accentColor: '#059669'
  },
  {
    code: 'CASHBACK50',
    type: 'CASHBACK',
    discountAmount: 50,
    minOrder: 599,
    description: 'Flat ₹50 cashback added to your FladoCash wallet on checkout.',
    expiryDate: '2026-10-31',
    accentColor: '#10B981'
  },
  {
    code: 'SUPERMIDWEEK',
    type: 'PERCENT_OFF',
    discountAmount: 12,
    minOrder: 350,
    description: 'Get 12% off on all groceries during mid-week Tuesdays.',
    expiryDate: '2026-09-30',
    accentColor: '#F59E0B'
  }
];
