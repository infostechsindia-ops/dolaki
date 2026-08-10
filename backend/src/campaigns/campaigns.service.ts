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

  private seasonalCampaigns: any[] = [
    {
      id: 'camp-ramadan',
      name: 'Ramadan Special Deals',
      slug: 'ramadan-deals',
      campaignType: 'SEASONAL',
      enabled: true,
      priority: 10,
      themeColors: { primary: '#065F46', accent: '#F59E0B' },
      desktopBanner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      mobileBanner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
      homepagePlacement: 'HERO_SLIDER',
      productCollection: 'SEASONAL',
      couponAssignment: 'FESTIVAL15',
      schedule: { startDate: '2026-03-01T00:00:00Z', endDate: '2026-04-15T23:59:59Z', timezone: 'Asia/Kolkata' },
      announcementBar: '🌙 Ramadan Mubarak! Flat 15% Extra Savings with code FESTIVAL15',
    },
    {
      id: 'camp-summer',
      name: 'Summer Splash Sale',
      slug: 'summer-splash',
      campaignType: 'SEASONAL',
      enabled: true,
      priority: 9,
      themeColors: { primary: '#0284C7', accent: '#FDE047' },
      desktopBanner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
      mobileBanner: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      homepagePlacement: 'MID_HOMEPAGE',
      productCollection: 'TRENDING',
      couponAssignment: 'FLASH20',
      schedule: { startDate: '2026-05-01T00:00:00Z', endDate: '2026-08-31T23:59:59Z', timezone: 'Asia/Kolkata' },
      announcementBar: '☀️ Summer Splash Sale is Live! Beat the heat with cool electronics & footwear discounts.',
    },
    {
      id: 'camp-black-friday',
      name: 'Black Friday Mega Bonanza',
      slug: 'black-friday',
      campaignType: 'FESTIVAL',
      enabled: true,
      priority: 15,
      themeColors: { primary: '#09090B', accent: '#EF4444' },
      desktopBanner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
      mobileBanner: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
      homepagePlacement: 'HERO_SLIDER',
      productCollection: 'BEST_SELLER',
      couponAssignment: 'BIGBILLION',
      schedule: { startDate: '2026-11-20T00:00:00Z', endDate: '2026-11-30T23:59:59Z', timezone: 'Asia/Kolkata' },
      announcementBar: '🔥 Black Friday Unbeatable Prices! Up to 80% Off on Laptops, Phones & Audio.',
    },
  ];

  async getSeasonalCampaigns(query?: { enabledOnly?: boolean }) {
    if (query?.enabledOnly) {
      return this.seasonalCampaigns.filter((c) => c.enabled);
    }
    return this.seasonalCampaigns;
  }

  async getCampaignBySlug(slug: string) {
    const camp = this.seasonalCampaigns.find((c) => c.slug === slug);
    if (!camp) throw new NotFoundException(`Campaign '${slug}' not found`);
    return camp;
  }

  async createCampaign(data: any) {
    const newCamp = {
      id: `camp-${Date.now()}`,
      enabled: true,
      priority: data.priority || 5,
      ...data,
    };
    this.seasonalCampaigns.unshift(newCamp);
    return newCamp;
  }

  async updateCampaign(id: string, data: any) {
    const camp = this.seasonalCampaigns.find((c) => c.id === id);
    if (!camp) throw new NotFoundException(`Campaign '${id}' not found`);
    Object.assign(camp, data);
    return camp;
  }
}
