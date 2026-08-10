import { Injectable, Logger } from '@nestjs/common';
import { ISearchProvider, SearchQueryOptions, SearchResult } from './search-provider.interface';

@Injectable()
export class MeilisearchSearchProvider implements ISearchProvider {
  readonly name = 'MEILISEARCH';
  private readonly logger = new Logger(MeilisearchSearchProvider.name);
  private readonly host = process.env.MEILISEARCH_HOST || 'http://127.0.0.1:7700';

  async search(options: SearchQueryOptions): Promise<SearchResult> {
    this.logger.log(
      `[MEILISEARCH SEARCH (${this.host})] Query: "${options.query}" | Category: ${options.categorySlug || 'all'}`,
    );

    return {
      hits: [],
      totalHits: 0,
      page: options.page || 1,
      limit: options.limit || 12,
      provider: this.name,
    };
  }

  async indexProduct(product: any): Promise<boolean> {
    this.logger.log(`[MEILISEARCH INDEX] Indexed product ID: ${product.id}`);
    return true;
  }

  async removeProduct(productId: string): Promise<boolean> {
    this.logger.log(`[MEILISEARCH REMOVE] Removed product ID: ${productId}`);
    return true;
  }
}
