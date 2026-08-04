export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  slug: string;
  tag?: string;
  productIds: string[];
}

export const collections: Collection[] = [
  {
    id: 'col-1',
    title: 'The Monsoon Setup',
    subtitle: 'Dry gear & rain protective wear',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    slug: 'sports',
    tag: 'Monsoon Sale',
    productIds: ['spo-1', 'spo-2', 'fas-3']
  },
  {
    id: 'col-2',
    title: 'Ultimate Desk Vibe',
    subtitle: 'Ergonomic layouts & sound setups',
    imageUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80',
    slug: 'home',
    tag: 'Work From Home',
    productIds: ['ele-1', 'ele-3', 'hom-1', 'hom-2']
  },
  {
    id: 'col-3',
    title: 'Gen-Z Style Book',
    subtitle: 'Trending street looks & oversized tees',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
    slug: 'fashion',
    tag: 'New Drops',
    productIds: ['fas-1', 'fas-2', 'fas-3']
  }
];
