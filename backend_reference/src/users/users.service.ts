import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getProfile() {
    return { message: 'User profile data' };
  }

  findAll() {
    return [{ id: 1, name: 'Test User' }];
  }
}
