import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  findAll() {
    return [{ id: 'p1', name: 'Wireless Buds' }];
  }

  create() {
    return { message: 'Product created successfully' };
  }
}
