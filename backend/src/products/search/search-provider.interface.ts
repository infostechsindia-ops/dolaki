export interface SearchQueryOptions {
  query: string;
  categorySlug?: string;
  brandSlug?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface SearchHit {
  id: string;
  title: string;
  description: string;
  sku: string;
  priceMinor: number;
  categorySlug: string;
  brandSlug: string;
  imageUrl: string;
  score?: number;
}

export interface SearchResult {
  hits: SearchHit[];
  totalHits: number;
  page: number;
  limit: number;
  provider: string;
  facets?: Record<string, any>;
}

export interface ISearchProvider {
  readonly name: string;
  search(options: SearchQueryOptions): Promise<SearchResult>;
  indexProduct?(product: any): Promise<boolean>;
  removeProduct?(productId: string): Promise<boolean>;
}
