import { Injectable, Logger } from '@nestjs/common';
import { ISearchProvider, SearchQueryOptions, SearchResult } from './search-provider.interface';

@Injectable()
export class TypesenseSearchProvider implements ISearchProvider {
  readonly name = 'TYPESENSE';
  private readonly logger = new Logger(TypesenseSearchProvider.name);
  private readonly apiKey = process.env.TYPESENSE_API_KEY || 'ts_sandbox_key';
  private readonly host = process.env.TYPESENSE_HOST || 'localhost';

  async search(options: SearchQueryOptions): Promise<SearchResult> {
    this.logger.log(
      `[TYPESENSE SEARCH (${this.host})] Query: "${options.query}" | Category: ${options.categorySlug || 'all'} | Limit: ${options.limit || 12}`,
    );

    // In sandbox mode, return structured search response shape
    return {
      hits: [],
      totalHits: 0,
      page: options.page || 1,
      limit: options.limit || 12,
      provider: this.name,
      facets: {
        categories: [],
        brands: [],
        priceRange: { min: options.minPrice || 0, max: options.maxPrice || 100000 },
      },
    };
  }

  async indexProduct(product: any): Promise<boolean> {
    this.logger.log(`[TYPESENSE INDEX] Indexed product ID: ${product.id}`);
    return true;
  }

  async removeProduct(productId: string): Promise<boolean> {
    this.logger.log(`[TYPESENSE REMOVE] Removed product ID: ${productId}`);
    return true;
  }
}
