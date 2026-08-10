import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../database/entities';

@Injectable()
export class CouponsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCoupons();
  }

  async seedCoupons() {
    const count = await this.couponRepository.count();
    if (count === 0) {
      const defaultCoupons = [
        {
          code: 'AURA50',
          description: 'Flat ₹50 off on AuraMart order',
          discountPercent: 0,
          type: 'FLAT',
          value: 50.0,
          minOrderAmount: 200.0,
          maxUses: 500,
          usedCount: 0,
          isActive: true,
        },
        {
          code: 'FLADO100',
          description: 'Flat ₹100 off on Flado grocery order',
          discountPercent: 0,
          type: 'FLAT',
          value: 100.0,
          minOrderAmount: 300.0,
          maxUses: 500,
          usedCount: 0,
          isActive: true,
        },
        {
          code: 'AURA100',
          description: 'Flat ₹100 off on first standard order',
          discountPercent: 0,
          type: 'FLAT',
          value: 100.0,
          minOrderAmount: 500.0,
          maxUses: 1000,
          usedCount: 0,
          isActive: true,
        },
        {
          code: 'FLADO50',
          description: 'Flat ₹50 off on Flado milk and fruits',
          discountPercent: 0,
          type: 'FLAT',
          value: 50.0,
          minOrderAmount: 150.0,
          maxUses: 1000,
          usedCount: 0,
          isActive: true,
        },
      ];

      for (const couponData of defaultCoupons) {
        const item = this.couponRepository.create(couponData);
        await this.couponRepository.save(item);
      }
    }
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find();
  }

  async findOneByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase(), isActive: true },
    });
    if (!coupon)
      throw new NotFoundException('Coupon code is invalid or expired');
    return coupon;
  }

  async create(data: Partial<Coupon>): Promise<Coupon> {
    const coupon = this.couponRepository.create({
      ...data,
      code: data.code?.toUpperCase(),
    });
    return this.couponRepository.save(coupon);
  }

  async validateAndRedeem(code: string, orderAmount: number): Promise<Coupon> {
    const coupon = await this.findOneByCode(code);

    if (coupon.isRedeemed || coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException(
        'Coupon code has already been fully redeemed',
      );
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Order amount must be at least ₹${coupon.minOrderAmount} to use this coupon`,
      );
    }

    coupon.usedCount += 1;
    if (coupon.usedCount >= coupon.maxUses) {
      coupon.isRedeemed = true;
    }
    return this.couponRepository.save(coupon);
  }
}
