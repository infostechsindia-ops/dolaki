import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISearchProvider, SearchQueryOptions, SearchResult, SearchHit } from './search-provider.interface';
import { Product } from '../../database/entities';

@Injectable()
export class SqlSearchProvider implements ISearchProvider {
  readonly name = 'SQL_FALLBACK';

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async search(options: SearchQueryOptions): Promise<SearchResult> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepo.createQueryBuilder('product');

    if (options.query) {
      queryBuilder.andWhere(
        '(product.title LIKE :q OR product.description LIKE :q OR product.subCategory LIKE :q)',
        { q: `%${options.query}%` },
      );
    }

    queryBuilder.andWhere('product.isActive = :active', { active: true });

    const totalHits = await queryBuilder.getCount();
    const products = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getMany();

    const hits: SearchHit[] = products.map((p) => {
      const anyP = p as any;
      return {
        id: p.id,
        title: p.title || 'Product',
        description: p.description || '',
        sku: p.sku || `SKU-${p.id.slice(0, 8)}`,
        imageUrl: p.imageUrl || '',
        priceMinor: anyP.priceMinor || Math.round((p.basePrice || 0) * 100),
        categorySlug: anyP.categorySlug || p.categoryPath || '',
        brandSlug: anyP.brandSlug || '',
      };
    });

    return {
      hits,
      totalHits,
      page,
      limit,
      provider: this.name,
      facets: {},
    };
  }
}
