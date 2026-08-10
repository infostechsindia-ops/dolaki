import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserWallet, Address, WishlistItem } from '../database/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserWallet)
    private readonly walletRepository: Repository<UserWallet>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(WishlistItem)
    private readonly wishlistRepository: Repository<WishlistItem>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    // Auto-create user wallet with 500 Aura Cash trial balance
    const wallet = this.walletRepository.create({
      userId: savedUser.id,
      balance: 500.0,
      rewardPoints: 120,
    });
    await this.walletRepository.save(wallet);

    return savedUser;
  }

  async getWallet(userId: string): Promise<UserWallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      const newWallet = this.walletRepository.create({ userId });
      return this.walletRepository.save(newWallet);
    }
    return wallet;
  }

  async updateWallet(
    userId: string,
    balance: number,
    rewardPoints: number,
  ): Promise<UserWallet> {
    const wallet = await this.getWallet(userId);
    wallet.balance = balance;
    wallet.rewardPoints = rewardPoints;
    return this.walletRepository.save(wallet);
  }

  async getWalletTransactions(userId: string) {
    return [];
  }

  // Wishlist APIs
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    return this.wishlistRepository.find({ where: { userId } });
  }

  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<WishlistItem> {
    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });
    if (existing) return existing;
    const item = this.wishlistRepository.create({ userId, productId });
    return this.wishlistRepository.save(item);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await this.wishlistRepository.delete({ userId, productId });
  }

  // Address Book APIs
  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId },
      order: { isDefault: 'DESC' },
    });
  }

  async addAddress(userId: string, data: Partial<Address>): Promise<Address> {
    if (data.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }
    const address = this.addressRepository.create({ ...data, userId });
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await this.addressRepository.delete({ id: addressId, userId });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>,
  ): Promise<Address> {
    const existing = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });
    if (!existing) {
      throw new NotFoundException('Address not found');
    }
    if (data.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }
    Object.assign(existing, data);
    return this.addressRepository.save(existing);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Address> {
    const existing = await this.addressRepository.findOne({
      where: { id: addressId, userId },
    });
    if (!existing) {
      throw new NotFoundException('Address not found');
    }
    await this.addressRepository.update({ userId }, { isDefault: false });
    existing.isDefault = true;
    return this.addressRepository.save(existing);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
