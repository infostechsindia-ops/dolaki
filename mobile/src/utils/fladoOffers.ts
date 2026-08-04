export interface FladoCoupon {
  code: string;
  type: 'FLAT_OFF' | 'PERCENT_OFF' | 'FREE_DELIVERY' | 'CASHBACK' | 'BOGO';
  discountAmount: number;
  minOrder: number;
  description: string;
  categoryConstraint?: string;
  expiryDate: string;
  accentColor: string;
}

export const fladoOffersData: FladoCoupon[] = [
  {
    code: 'FLADO100',
    type: 'FLAT_OFF',
    discountAmount: 100,
    minOrder: 399,
    description: 'Flat ₹100 OFF on your first Flado order! Welcome to 10-minute instant delivery.',
    expiryDate: '2026-12-31',
    accentColor: '#10B981'
  },
  {
    code: 'VEGGIE50',
    type: 'PERCENT_OFF',
    discountAmount: 40,
    minOrder: 199,
    description: 'Flat 40% OFF on farm fresh organic vegetables & seasonal fruits.',
    categoryConstraint: 'fruits-vegetables',
    expiryDate: '2026-08-15',
    accentColor: '#059669'
  },
  {
    code: 'RATION150',
    type: 'FLAT_OFF',
    discountAmount: 150,
    minOrder: 999,
    description: 'Get Flat ₹150 OFF on monthly ration packs, Atta, Rice & Oils.',
    categoryConstraint: 'atta-rice-dal',
    expiryDate: '2026-09-30',
    accentColor: '#1E3A8A'
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
    code: 'AURACOINS2X',
    type: 'CASHBACK',
    discountAmount: 50,
    minOrder: 299,
    description: 'Earn 2X AuraCoins cashback on milk, curd & artisanal bakery products.',
    categoryConstraint: 'dairy-bread-eggs',
    expiryDate: '2026-10-31',
    accentColor: '#D97706'
  },
  {
    code: 'SNACK25',
    type: 'PERCENT_OFF',
    discountAmount: 25,
    minOrder: 149,
    description: 'Flat 25% OFF on Lay\'s, Cadbury, Doritos & Cold Drinks.',
    categoryConstraint: 'snacks-beverages',
    expiryDate: '2026-08-31',
    accentColor: '#EF4444'
  },
  {
    code: 'BEAUTY30',
    type: 'PERCENT_OFF',
    discountAmount: 30,
    minOrder: 299,
    description: 'Flat 30% OFF on Mamaearth, Dove & Lakme personal care.',
    categoryConstraint: 'personal-care',
    expiryDate: '2026-09-15',
    accentColor: '#EC4899'
  },
  {
    code: 'BABY100',
    type: 'FLAT_OFF',
    discountAmount: 100,
    minOrder: 599,
    description: 'Save ₹100 on Pampers, Himalaya Baby Wipes & Diaper packs.',
    categoryConstraint: 'baby-care',
    expiryDate: '2026-10-15',
    accentColor: '#06B6D4'
  },
  {
    code: 'PHARMA15',
    type: 'PERCENT_OFF',
    discountAmount: 15,
    minOrder: 199,
    description: 'Flat 15% OFF on OTC Medicines, Revital & Himalaya supplements.',
    categoryConstraint: 'health-pharmacy',
    expiryDate: '2026-11-30',
    accentColor: '#10B981'
  },
  {
    code: 'CLEAN50',
    type: 'FLAT_OFF',
    discountAmount: 50,
    minOrder: 349,
    description: 'Get ₹50 OFF on Surf Excel, Harpic & Dettol cleaning essentials.',
    categoryConstraint: 'household-cleaning',
    expiryDate: '2026-08-31',
    accentColor: '#6B7280'
  },
  {
    code: 'PETLOVE',
    type: 'PERCENT_OFF',
    discountAmount: 20,
    minOrder: 399,
    description: 'Flat 20% OFF on Pedigree Dog Food & Whiskas Cat Food packs.',
    categoryConstraint: 'pet-care',
    expiryDate: '2026-09-30',
    accentColor: '#78350F'
  }
];
