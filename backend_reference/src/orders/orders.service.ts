import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  findAll() {
    return [{ id: 'o1', total: 4999 }];
  }

  create() {
    return { message: 'Order placed successfully' };
  }
}
