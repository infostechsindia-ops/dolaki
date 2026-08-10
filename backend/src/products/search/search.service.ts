import { Injectable, Logger } from '@nestjs/common';
import { ISearchProvider, SearchQueryOptions, SearchResult } from './search-provider.interface';
import { SqlSearchProvider } from './sql-search.provider';
import { TypesenseSearchProvider } from './typesense-search.provider';
import { MeilisearchSearchProvider } from './meilisearch-search.provider';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly providers: Map<string, ISearchProvider> = new Map();

  constructor(
    private readonly sqlProvider: SqlSearchProvider,
    private readonly typesenseProvider: TypesenseSearchProvider,
    private readonly meilisearchProvider: MeilisearchSearchProvider,
  ) {
    this.providers.set('SQL', sqlProvider);
    this.providers.set('SQL_FALLBACK', sqlProvider);
    this.providers.set('TYPESENSE', typesenseProvider);
    this.providers.set('MEILISEARCH', meilisearchProvider);
  }

  private getProvider(): ISearchProvider {
    const configured = (process.env.SEARCH_PROVIDER || 'SQL').toUpperCase();
    return this.providers.get(configured) || this.sqlProvider;
  }

  async search(options: SearchQueryOptions): Promise<SearchResult> {
    const provider = this.getProvider();
    const result = await provider.search(options);

    // Fallback to SQL if external search provider returns no hits
    if (result.hits.length === 0 && provider.name !== 'SQL_FALLBACK') {
      this.logger.log(`Search provider ${provider.name} returned 0 hits; executing SQL search fallback.`);
      return this.sqlProvider.search(options);
    }

    return result;
  }
}
