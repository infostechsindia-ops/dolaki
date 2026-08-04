import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, And } from 'typeorm';
import { FlashSale, Banner } from '../database/entities';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(FlashSale)
    private flashSaleRepository: Repository<FlashSale>,
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}

  async getActiveFlashSales() {
    const now = new Date();
    return this.flashSaleRepository.find({
      where: {
        isActive: true,
        startsAt: LessThanOrEqual(now),
        endsAt: MoreThanOrEqual(now),
      },
    });
  }

  async createFlashSale(data: any) {
    const sale = this.flashSaleRepository.create(data);
    return this.flashSaleRepository.save(sale);
  }

  async updateFlashSale(id: string, data: any) {
    const sale = await this.flashSaleRepository.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Flash sale not found');
    Object.assign(sale, data);
    return this.flashSaleRepository.save(sale);
  }

  async getActiveBanners(position?: string, city?: string) {
    const where: any = { isActive: true };
    if (position) where.position = position;
    if (city) where.city = city;
    return this.bannerRepository.find({ where });
  }

  async createBanner(data: any) {
    const banner = this.bannerRepository.create(data);
    return this.bannerRepository.save(banner);
  }

  async deleteBanner(id: string) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    banner.isActive = false;
    return this.bannerRepository.save(banner);
  }
}
