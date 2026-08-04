export interface FladoPassPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  benefits: string[];
  savingLabel: string;
  accentColor: string;
  popular?: boolean;
}

export const fladoPassPlansData: FladoPassPlan[] = [
  {
    id: 'pass-monthly',
    name: 'Monthly Flado Pass',
    price: 39,
    billingCycle: 'month',
    benefits: [
      'Unlimited FREE Delivery on all orders above ₹99',
      'Extra 5% discount on all Fresh Fruits & Vegetables',
      'Access to exclusive members-only Flash Sales',
      'Priority delivery queue during high-demand hours'
    ],
    savingLabel: 'Save ~₹250/month',
    accentColor: '#F59E0B'
  },
  {
    id: 'pass-quarterly',
    name: 'Quarterly Flado Pass',
    price: 99,
    billingCycle: '3 months',
    benefits: [
      'Unlimited FREE Delivery on all orders above ₹99',
      'Extra 5% discount on all Fresh Fruits & Vegetables',
      'Access to exclusive members-only Flash Sales',
      'Priority delivery queue during high-demand hours',
      'Free premium item add-on once a month',
      '24/7 Priority VIP customer helpline support'
    ],
    savingLabel: 'Save ~₹900/quarter',
    accentColor: '#8B5CF6',
    popular: true
  },
  {
    id: 'pass-annual',
    name: 'Annual Flado Pass',
    price: 299,
    billingCycle: 'year',
    benefits: [
      'Unlimited FREE Delivery on all orders above ₹99',
      'Extra 5% discount on all Fresh Fruits & Vegetables',
      'Access to exclusive members-only Flash Sales',
      'Priority delivery queue during high-demand hours',
      'Free premium item add-on once a month',
      '24/7 Priority VIP customer helpline support',
      '2x FladoCoins earned on every order',
      'No surge fees during rain or festivals'
    ],
    savingLabel: 'Save ~₹4,500/year',
    accentColor: '#10B981'
  }
];
