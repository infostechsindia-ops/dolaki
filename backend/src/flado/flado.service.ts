import { Injectable, NotFoundException, BadRequestException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  Darkstore, Product, Order, OrderItem, Inventory,
  FladoShop, ShopSubscription, ShopCredit, CreditTransaction, Category, Rider, ShopHours,
} from '../database/entities';

// ─── Geo Helper ───────────────────────────────────────────────────────────────

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── COD Fee Helper ───────────────────────────────────────────────────────────

export function calculateCodFee(orderAmount: number): number {
  const fee = orderAmount * 0.01; // 1%
  return Math.min(Math.round(fee), 10); // capped at ₹10
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class FladoService implements OnApplicationBootstrap {
  constructor(
    // Legacy repos kept for backward compat
    @InjectRepository(Darkstore)
    private readonly darkstoreRepository: Repository<Darkstore>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    // New Flado repos
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(ShopSubscription)
    private readonly subscriptionRepository: Repository<ShopSubscription>,
    @InjectRepository(ShopCredit)
    private readonly creditRepository: Repository<ShopCredit>,
    @InjectRepository(CreditTransaction)
    private readonly creditTxRepository: Repository<CreditTransaction>,
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(ShopHours)
    private readonly hoursRepository: Repository<ShopHours>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedMockShops();
  }

  async seedMockShops() {
    try {
      const shopCount = await this.shopRepository.count();
      if (shopCount === 0) {
        const shopsToSeed = [
          {
            ownerName: 'Rajesh Sharma',
            ownerPhone: '+91 98765 43210',
            shopName: 'Bandra Organic Grocers',
            shopDescription: 'Your premium local source for fresh organic fruits and daily vegetables in Bandra West.',
            address: 'Hill Road, Bandra West, Mumbai, Maharashtra 400050',
            city: 'Mumbai',
            state: 'Maharashtra',
            lat: 19.0596,
            lng: 72.8295,
            deliveryRadiusKm: 3.0,
            categoriesJson: JSON.stringify(['Veggies', 'Dairy', 'Kirana', 'Bakery']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: true,
            rating: 4.8,
            totalRatings: 120,
          },
          {
            ownerName: 'Anil Mehta',
            ownerPhone: '+91 98765 43211',
            shopName: 'Worli Fresh Mart',
            shopDescription: 'Daily essentials, fresh bread, butter, and grocery staples at your door.',
            address: 'Dr Annie Besant Rd, Worli, Mumbai, Maharashtra 400018',
            city: 'Mumbai',
            state: 'Maharashtra',
            lat: 19.0178,
            lng: 72.8173,
            deliveryRadiusKm: 3.0,
            categoriesJson: JSON.stringify(['Dairy', 'Kirana', 'Bakery', 'Household']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'PAID' as any,
            deliveryFeeAmount: 20,
            isPhysicallyVerified: true,
            rating: 4.6,
            totalRatings: 85,
          },
          {
            ownerName: 'Ramesh Singh',
            ownerPhone: '+91 99999 11111',
            shopName: 'Station Road Kirana & Fruits',
            shopDescription: 'Quality groceries, seasonal fruits and vegetables delivered in minutes.',
            address: 'Station Road, Muzaffarpur, Bihar 842001',
            city: 'Muzaffarpur',
            state: 'Bihar',
            lat: 26.1209,
            lng: 85.3647,
            deliveryRadiusKm: 5.0,
            categoriesJson: JSON.stringify(['Veggies', 'Dairy', 'Kirana']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: true,
            rating: 4.7,
            totalRatings: 150,
          },
          {
            ownerName: 'Sunita Mishra',
            ownerPhone: '+91 99999 22222',
            shopName: 'Ahiyapur Daily Kirana',
            shopDescription: 'Fresh local dairy, bakery products, and cleaning essentials.',
            address: 'Ahiyapur Chawk, Muzaffarpur, Bihar 842001',
            city: 'Muzaffarpur',
            state: 'Bihar',
            lat: 26.1345,
            lng: 85.3891,
            deliveryRadiusKm: 5.0,
            categoriesJson: JSON.stringify(['Dairy', 'Kirana', 'Bakery', 'Household']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: true,
            rating: 4.5,
            totalRatings: 92,
          },
          {
            ownerName: 'Kamlesh Rai',
            ownerPhone: '+91 99999 33333',
            shopName: 'Civil Lines Super Mart',
            shopDescription: 'Best prices in Civil Lines on household groceries, snacks, and personal care.',
            address: 'Civil Lines, Maunath Bhanjan, Uttar Pradesh 275101',
            city: 'Maunath Bhanjan',
            state: 'Uttar Pradesh',
            lat: 25.9500,
            lng: 83.5620,
            deliveryRadiusKm: 5.0,
            categoriesJson: JSON.stringify(['Veggies', 'Dairy', 'Kirana', 'Beauty', 'Household']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: true,
            rating: 4.9,
            totalRatings: 210,
          },
          {
            ownerName: 'Manoj Gupta',
            ownerPhone: '+91 99999 44444',
            shopName: 'Rekabganj Kirana Bhandar',
            shopDescription: 'Traditional Indian spices, grains, flour, oil and monthly ration packs.',
            address: 'Rekabganj, Maunath Bhanjan, Uttar Pradesh 275101',
            city: 'Maunath Bhanjan',
            state: 'Uttar Pradesh',
            lat: 25.9432,
            lng: 83.5558,
            deliveryRadiusKm: 5.0,
            categoriesJson: JSON.stringify(['Kirana', 'Household']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: false,
            rating: 4.4,
            totalRatings: 67,
          },
          {
            ownerName: 'Ramesh Yadav',
            ownerPhone: '+91 98765 88888',
            shopName: 'Mithila Kirana & Organic Hub',
            shopDescription: 'Selling local Bihar staples, organic pulses, pure mustard oil and spices for 15 years.',
            address: 'Chata Chowk, Club Road, Muzaffarpur, Bihar 842002',
            city: 'Muzaffarpur',
            state: 'Bihar',
            lat: 26.1180,
            lng: 85.3520,
            deliveryRadiusKm: 6.0,
            categoriesJson: JSON.stringify(['Veggies', 'Dairy', 'Kirana', 'Bakery']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: true,
            rating: 4.8,
            totalRatings: 185,
          },
          {
            ownerName: 'Vikas Gupta',
            ownerPhone: '+91 98765 99999',
            shopName: 'Mau Medical & Provisions Agency',
            shopDescription: '24/7 medicine delivery, health supplements, baby care, and daily provisions.',
            address: 'Sadar Bazar, Maunath Bhanjan, Uttar Pradesh 275101',
            city: 'Maunath Bhanjan',
            state: 'Uttar Pradesh',
            lat: 25.9432,
            lng: 83.5558,
            deliveryRadiusKm: 8.0,
            categoriesJson: JSON.stringify(['Medical', 'Beauty', 'Kirana']),
            isOpen: true,
            approvalStatus: 'APPROVED' as any,
            deliveryFeeType: 'FREE' as any,
            deliveryFeeAmount: 0,
            isPhysicallyVerified: true,
            rating: 4.9,
            totalRatings: 240,
          }
        ];

        for (const data of shopsToSeed) {
          const shop = this.shopRepository.create(data);
          await this.shopRepository.save(shop);
        }
        console.log('Seeded 8 mock Flado shops successfully!');
      }

      // Seed darkstores if empty or missing regional nodes
      const dsCount = await this.darkstoreRepository.count();
      const hasRegional = await this.darkstoreRepository.findOne({ where: { name: 'Flado Darkstore #20 (Muzaffarpur)' } });
      if (dsCount === 0 || !hasRegional) {
        await this.darkstoreRepository.delete({});
        const darkstores = [
          { vendorId: 'store-bandra', name: 'Flado Darkstore #08 (Bandra)', address: 'Hill Road, Mumbai', lat: 19.0596, lng: 72.8295, serviceRadiusKm: 5.0, isActive: true, ownerName: 'Rajesh Sharma', contactPhone: '+91 98765 43210' },
          { vendorId: 'store-worli', name: 'Flado Darkstore #14 (Worli)', address: 'Dr Annie Besant Rd, Worli', lat: 19.0178, lng: 72.8173, serviceRadiusKm: 5.0, isActive: true, ownerName: 'Anil Mehta', contactPhone: '+91 98765 43211' },
          { vendorId: 'store-muzaffarpur', name: 'Flado Darkstore #20 (Muzaffarpur)', address: 'Station Road, Muzaffarpur', lat: 26.1209, lng: 85.3647, serviceRadiusKm: 10.0, isActive: true, ownerName: 'Ramesh Singh', contactPhone: '+91 99999 11111' },
          { vendorId: 'store-mau', name: 'Flado Darkstore #21 (Mau)', address: 'Civil Lines, Maunath Bhanjan', lat: 25.9500, lng: 83.5620, serviceRadiusKm: 10.0, isActive: true, ownerName: 'Kamlesh Rai', contactPhone: '+91 99999 33333' },
        ];
        for (const ds of darkstores) {
          const item = this.darkstoreRepository.create(ds as any);
          await this.darkstoreRepository.save(item as any);
        }
        console.log('Seeded mock darkstores successfully!');
      }

      // Seed products for all vendors if empty
      const vendorIds = [
        'store-bandra',
        'store-worli',
        'store-muzaffarpur',
        'store-mau',
        'vendor-bandra',
        'vendor-muzaffarpur'
      ];
      
      const categoryRepo = this.productRepository.manager.getRepository(Category);
      const groceriesCat = await categoryRepo.findOne({ where: { slug: 'groceries' } });
      const groceriesCatId = groceriesCat ? groceriesCat.id : 'groceries-cat-id';

      for (const vId of vendorIds) {
        const prodCount = await this.productRepository.count({ where: { vendorId: vId } });
        if (prodCount === 0) {
          const productsToSeed = [
            {
              id: `gro-1-${vId}`,
              title: 'Organic Bananas (Pack of 6)',
              description: 'Fresh, naturally ripened organic bananas sourced from local farms. Rich in potassium.',
              basePrice: 80,
              discountPrice: 60,
              sku: `SKU-${vId}-BANANA`,
              colorsJson: JSON.stringify(['Yellow']),
              sizesJson: JSON.stringify(['Pack of 6']),
              isQuickCommerce: true,
              imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
              categoryId: groceriesCatId,
              vendorId: vId,
              subCategory: 'Fruits & Vegetables',
              rating: 4.8,
              reviewCount: 320,
            },
            {
              id: `gro-2-${vId}`,
              title: 'Fresh Farm Whole Milk 1L',
              description: 'Pasteurized, homogenized whole milk. Sourced daily and chilled to perfection.',
              basePrice: 75,
              discountPrice: 72,
              sku: `SKU-${vId}-MILK`,
              colorsJson: JSON.stringify(['White']),
              sizesJson: JSON.stringify(['1 Litre']),
              isQuickCommerce: true,
              imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600',
              categoryId: groceriesCatId,
              vendorId: vId,
              subCategory: 'Dairy & Bread',
              rating: 4.7,
              reviewCount: 450,
            },
            {
              id: `gro-3-${vId}`,
              title: 'Gourmet Sourdough Bread',
              description: 'Artisanal, freshly baked sourdough bread with a chewy interior and thick, crispy crust.',
              basePrice: 150,
              discountPrice: 120,
              sku: `SKU-${vId}-SOURDOUGH`,
              colorsJson: JSON.stringify(['Brown']),
              sizesJson: JSON.stringify(['400g']),
              isQuickCommerce: true,
              imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
              categoryId: groceriesCatId,
              vendorId: vId,
              subCategory: 'Dairy & Bread',
              rating: 4.6,
              reviewCount: 98,
            },
            {
              id: `gro-4-${vId}`,
              title: 'Fresh Hass Avocados (2 Pcs)',
              description: 'Premium imported Hass avocados. Rich, creamy texture, perfect for salads or toast.',
              basePrice: 299,
              discountPrice: 249,
              sku: `SKU-${vId}-AVOCADO`,
              colorsJson: JSON.stringify(['Green']),
              sizesJson: JSON.stringify(['2 Pcs']),
              isQuickCommerce: true,
              imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600',
              categoryId: groceriesCatId,
              vendorId: vId,
              subCategory: 'Fruits & Vegetables',
              rating: 4.5,
              reviewCount: 180,
            },
            {
              id: `gro-5-${vId}`,
              title: 'Classic Potato Chips 150g',
              description: 'Thinly sliced crispy potatoes seasoned with pure sea salt.',
              basePrice: 60,
              discountPrice: 50,
              sku: `SKU-${vId}-CHIPS`,
              colorsJson: JSON.stringify(['Salted']),
              sizesJson: JSON.stringify(['150g']),
              isQuickCommerce: true,
              imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600',
              categoryId: groceriesCatId,
              vendorId: vId,
              subCategory: 'Snacks & Munchies',
              rating: 4.4,
              reviewCount: 540,
            }
          ];

          for (const prodData of productsToSeed) {
            const prod = this.productRepository.create(prodData);
            const saved = await this.productRepository.save(prod);

            // Add inventory
            const inv = this.inventoryRepository.create({
              productId: saved.id,
              vendorId: vId,
              variantName: 'Standard Variant',
              stockQuantity: 40,
              lowStockThreshold: 5,
            });
            await this.inventoryRepository.save(inv);
          }
        }
      }
    } catch (e) {
      console.error('Failed to seed Flado data:', e);
    }
  }

  // ─── Shop Registration ────────────────────────────────────────────────────


  async registerShop(dto: {
    ownerName: string;
    ownerPhone: string;
    shopName: string;
    shopDescription?: string;
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    deliveryRadiusKm: number;
    categories: string[];
    ownerStory?: string;
  }): Promise<FladoShop> {
    const existing = await this.shopRepository.findOne({ where: { ownerPhone: dto.ownerPhone } });
    if (existing) {
      throw new BadRequestException('A shop is already registered with this phone number.');
    }

    const shop = this.shopRepository.create({
      ownerName: dto.ownerName,
      ownerPhone: dto.ownerPhone,
      shopName: dto.shopName,
      shopDescription: dto.shopDescription || '',
      address: dto.address,
      city: dto.city,
      state: dto.state,
      lat: dto.lat,
      lng: dto.lng,
      deliveryRadiusKm: dto.deliveryRadiusKm,
      categoriesJson: JSON.stringify(dto.categories),
      approvalStatus: 'PENDING',
      isOpen: false,
      deliveryFeeType: 'FREE',
      deliveryFeeAmount: 0,
      ownerStory: dto.ownerStory || '',
    });

    return this.shopRepository.save(shop);
  }

  // ─── Nearby Shops (Customer Discovery) ───────────────────────────────────

  async getNearbyShops(
    userLat: number,
    userLng: number,
    category?: string,
    city?: string,
  ): Promise<(FladoShop & { distance: number; deliveryEtaMinutes: number })[]> {
    const query: any = { approvalStatus: 'APPROVED', isOpen: true };
    if (city) query.city = city;

    const shops = await this.shopRepository.find({ where: query });

    return shops
      .map((shop) => {
        const distance = calculateDistance(userLat, userLng, shop.lat, shop.lng);
        // ETA: base 5 min prep + 3 min/km travel
        const deliveryEtaMinutes = Math.round(5 + distance * 3);
        return { ...shop, distance: Math.round(distance * 100) / 100, deliveryEtaMinutes };
      })
      .filter((shop) => {
        const inRange = shop.distance <= shop.deliveryRadiusKm;
        if (!inRange) return false;
        if (category) {
          const cats: string[] = JSON.parse(shop.categoriesJson || '[]');
          return cats.some((c) => c.toLowerCase().includes(category.toLowerCase()));
        }
        return true;
      })
      .sort((a, b) => a.distance - b.distance);
  }

  // ─── Shop Detail ──────────────────────────────────────────────────────────

  async getShopById(shopId: string): Promise<FladoShop> {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found.');
    return shop;
  }

  async getShopByPhone(ownerPhone: string): Promise<FladoShop> {
    const shop = await this.shopRepository.findOne({ where: { ownerPhone } });
    if (!shop) throw new NotFoundException('No shop found for this phone number.');
    return shop;
  }

  // ─── Shop Settings (Vendor Controls) ─────────────────────────────────────

  async updateShopProfile(shopId: string, dto: Partial<FladoShop> & { categories?: string[] }): Promise<FladoShop> {
    const shop = await this.getShopById(shopId);
    const { categories, ...rest } = dto;
    if (categories !== undefined) {
      shop.categoriesJson = JSON.stringify(categories);
    }
    Object.assign(shop, rest);
    return this.shopRepository.save(shop);
  }

  async toggleShopOpen(shopId: string, isOpen: boolean): Promise<{ isOpen: boolean }> {
    const shop = await this.getShopById(shopId);
    shop.isOpen = isOpen;
    await this.shopRepository.save(shop);
    return { isOpen };
  }

  async updateDeliveryFee(
    shopId: string,
    deliveryFeeType: 'FREE' | 'PAID',
    deliveryFeeAmount: number,
  ): Promise<FladoShop> {
    const shop = await this.getShopById(shopId);
    shop.deliveryFeeType = deliveryFeeType;
    shop.deliveryFeeAmount = deliveryFeeType === 'PAID' ? deliveryFeeAmount : 0;
    return this.shopRepository.save(shop);
  }

  async updateDeliveryRadius(shopId: string, radiusKm: number): Promise<FladoShop> {
    if (radiusKm < 0.5 || radiusKm > 3.0) {
      throw new BadRequestException('Delivery radius must be between 0.5 km and 3 km.');
    }
    const shop = await this.getShopById(shopId);
    shop.deliveryRadiusKm = radiusKm;
    return this.shopRepository.save(shop);
  }

  // ─── Admin: Shop Approval ─────────────────────────────────────────────────

  async getPendingShops(): Promise<FladoShop[]> {
    return this.shopRepository.find({ where: { approvalStatus: 'PENDING' } });
  }

  async getAllShops(status?: string): Promise<FladoShop[]> {
    if (status) {
      return this.shopRepository.find({ where: { approvalStatus: status as any } });
    }
    return this.shopRepository.find();
  }

  async approveShop(
    shopId: string,
    adminId: string,
    monthlyFee: number,
    note?: string,
  ): Promise<{ shop: FladoShop; subscription: ShopSubscription }> {
    const shop = await this.getShopById(shopId);
    shop.approvalStatus = 'APPROVED';
    shop.approvedByAdminId = adminId;
    shop.approvedAt = new Date();
    shop.approvalNote = note || '';
    await this.shopRepository.save(shop);

    // Create subscription record with admin-set fee
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const subscription = this.subscriptionRepository.create({
      shopId,
      monthlyFeeAmount: monthlyFee,
      status: 'ACTIVE',
      validFrom: now,
      validUntil: nextMonth,
      setByAdminId: adminId,
      notes: note,
    });
    await this.subscriptionRepository.save(subscription);

    return { shop, subscription };
  }

  async rejectShop(shopId: string, adminId: string, reason: string): Promise<FladoShop> {
    const shop = await this.getShopById(shopId);
    shop.approvalStatus = 'REJECTED';
    shop.approvedByAdminId = adminId;
    shop.approvalNote = reason;
    return this.shopRepository.save(shop);
  }

  async verifyShopPhysically(shopId: string, agentId: string): Promise<FladoShop> {
    const shop = await this.getShopById(shopId);
    shop.isPhysicallyVerified = true;
    shop.verifiedByAgentId = agentId;
    shop.verifiedAt = new Date();
    return this.shopRepository.save(shop);
  }

  // ─── Inventory (Product) Management ──────────────────────────────────────

  async getShopProducts(shopId: string): Promise<Product[]> {
    return this.productRepository.find({ where: { vendorId: shopId } });
  }

  async addShopProduct(shopId: string, dto: {
    title: string;
    categoryId: string;
    basePrice: number;
    discountPrice?: number;
    imageUrl?: string;
    subCategory?: string;
    stockQuantity?: number;
    lowStockThreshold?: number;
    unit?: string;
  }): Promise<Product> {
    const sku = `FLADO-${shopId.slice(0, 4)}-${Date.now()}`;
    const product = this.productRepository.create({
      id: sku,
      vendorId: shopId,
      categoryId: dto.categoryId,
      title: dto.title,
      sku,
      basePrice: dto.basePrice,
      discountPrice: dto.discountPrice || dto.basePrice,
      imageUrl: dto.imageUrl || '',
      subCategory: dto.unit || dto.subCategory || 'piece',
      isQuickCommerce: true,
      isActive: true,
      rating: 4.5,
      reviewCount: 0,
    });
    const saved = await this.productRepository.save(product);

    // Create inventory record
    await this.inventoryRepository.save(
      this.inventoryRepository.create({
        productId: saved.id,
        vendorId: shopId,
        stockQuantity: dto.stockQuantity ?? 50,
        lowStockThreshold: dto.lowStockThreshold ?? 5,
      }),
    );

    return saved;
  }

  async updateShopProduct(
    shopId: string,
    productId: string,
    dto: Partial<{ title: string; basePrice: number; discountPrice: number; imageUrl: string; subCategory: string }>,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId, vendorId: shopId },
    });
    if (!product) throw new NotFoundException('Product not found for this shop.');
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async updateStockQuantity(shopId: string, productId: string, quantity: number): Promise<Inventory> {
    const inv = await this.inventoryRepository.findOne({ where: { productId, vendorId: shopId } });
    if (!inv) throw new NotFoundException('Inventory record not found.');
    inv.stockQuantity = quantity;
    return this.inventoryRepository.save(inv);
  }

  async deleteShopProduct(shopId: string, productId: string): Promise<{ success: boolean }> {
    const product = await this.productRepository.findOne({
      where: { id: productId, vendorId: shopId },
    });
    if (!product) throw new NotFoundException('Product not found for this shop.');
    product.isActive = false;
    await this.productRepository.save(product);
    return { success: true };
  }

  // ─── Orders (Vendor View) ─────────────────────────────────────────────────

  async getShopOrders(shopId: string, status?: string): Promise<OrderItem[]> {
    const where: any = { vendorId: shopId };
    if (status) where.status = status;
    return this.orderItemRepository.find({ where });
  }

  async updateOrderStatus(
    shopId: string,
    orderId: string,
    status: 'PLACED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED',
  ): Promise<OrderItem> {
    const item = await this.orderItemRepository.findOne({
      where: { orderId, vendorId: shopId },
    });
    if (!item) throw new NotFoundException('Order not found for this shop.');
    item.status = status;
    return this.orderItemRepository.save(item);
  }

  async assignRiderToOrder(orderId: string, riderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found.');
    order.riderId = riderId;
    return this.orderRepository.save(order);
  }

  // ─── Riders & Hours ─────────────────────────────────────────────────────────

  async addRider(shopId: string, data: any): Promise<Rider> {
    const rider = this.riderRepository.create({
      shopId,
      name: data.name,
      phone: data.phone,
      vehicleType: data.vehicleType || 'Bicycle',
    });
    return this.riderRepository.save(rider);
  }

  async getShopRiders(shopId: string): Promise<Rider[]> {
    return this.riderRepository.find({ where: { shopId } });
  }

  async toggleRiderAvailability(riderId: string, isAvailable: boolean): Promise<Rider> {
    const rider = await this.riderRepository.findOne({ where: { id: riderId } });
    if (!rider) throw new NotFoundException('Rider not found.');
    rider.isAvailable = isAvailable;
    return this.riderRepository.save(rider);
  }

  async getShopHours(shopId: string): Promise<ShopHours[]> {
    return this.hoursRepository.find({ where: { shopId }, order: { dayOfWeek: 'ASC' } });
  }

  async upsertShopHours(shopId: string, hoursData: any[]): Promise<ShopHours[]> {
    const results = [];
    for (const h of hoursData) {
      let existing = await this.hoursRepository.findOne({ where: { shopId, dayOfWeek: h.dayOfWeek } });
      if (!existing) {
        existing = this.hoursRepository.create({ shopId, dayOfWeek: h.dayOfWeek });
      }
      existing.openTime = h.openTime;
      existing.closeTime = h.closeTime;
      existing.isOpen = h.isOpen;
      results.push(await this.hoursRepository.save(existing));
    }
    return results;
  }

  // ─── COD Fee Calculation ──────────────────────────────────────────────────

  calculateCodFee(orderAmount: number): { fee: number; message: string } {
    const fee = calculateCodFee(orderAmount);
    return {
      fee,
      message: fee > 0
        ? `₹${fee} COD fee added. Pay online to remove this fee.`
        : 'No COD fee.',
    };
  }

  // ─── Shop Credit (Digital Udhaar) ─────────────────────────────────────────

  async grantCredit(dto: {
    shopId: string;
    customerPhone: string;
    customerName: string;
    creditLimit: number;
    notes?: string;
    repaymentDeadline?: Date;
  }): Promise<ShopCredit> {
    const existing = await this.creditRepository.findOne({
      where: { shopId: dto.shopId, customerPhone: dto.customerPhone },
    });
    if (existing) {
      // Update existing credit record
      existing.creditLimit = dto.creditLimit;
      existing.customerName = dto.customerName;
      existing.notes = dto.notes || existing.notes;
      existing.repaymentDeadline = dto.repaymentDeadline || existing.repaymentDeadline;
      if (existing.status === 'SETTLED') existing.status = 'ACTIVE';
      return this.creditRepository.save(existing);
    }

    const credit = this.creditRepository.create({
      shopId: dto.shopId,
      customerPhone: dto.customerPhone,
      customerName: dto.customerName,
      creditLimit: dto.creditLimit,
      outstandingBalance: 0,
      status: 'ACTIVE',
      notes: dto.notes,
      repaymentDeadline: dto.repaymentDeadline,
    });
    return this.creditRepository.save(credit);
  }

  async freezeCredit(shopId: string, customerPhone: string): Promise<ShopCredit> {
    const credit = await this.creditRepository.findOne({ where: { shopId, customerPhone } });
    if (!credit) throw new NotFoundException('Credit account not found.');
    credit.status = 'FROZEN';
    return this.creditRepository.save(credit);
  }

  async restoreCredit(shopId: string, customerPhone: string): Promise<ShopCredit> {
    const credit = await this.creditRepository.findOne({ where: { shopId, customerPhone } });
    if (!credit) throw new NotFoundException('Credit account not found.');
    credit.status = 'ACTIVE';
    return this.creditRepository.save(credit);
  }

  async getShopCreditLedger(shopId: string): Promise<ShopCredit[]> {
    return this.creditRepository.find({ where: { shopId } });
  }

  async getCustomerCreditForShop(shopId: string, customerPhone: string): Promise<ShopCredit | null> {
    return this.creditRepository.findOne({ where: { shopId, customerPhone } });
  }

  async sendCreditReminder(shopId: string, customerPhone: string): Promise<{ sent: boolean; message: string }> {
    const credit = await this.creditRepository.findOne({ where: { shopId, customerPhone } });
    if (!credit) throw new NotFoundException('Credit account not found.');
    if (credit.outstandingBalance <= 0) {
      return { sent: false, message: 'No outstanding balance to remind about.' };
    }

    credit.lastReminderSentAt = new Date();
    await this.creditRepository.save(credit);

    // In real app: trigger FCM push notification to customerPhone here
    return {
      sent: true,
      message: `Payment reminder sent to ${customerPhone} for ₹${credit.outstandingBalance} outstanding balance.`,
    };
  }

  async debitCredit(
    shopId: string,
    customerPhone: string,
    amount: number,
    orderId: string,
  ): Promise<CreditTransaction> {
    const credit = await this.creditRepository.findOne({ where: { shopId, customerPhone } });
    if (!credit) throw new NotFoundException('No credit account found for this customer at this shop.');
    if (credit.status === 'FROZEN') throw new BadRequestException('Credit is frozen. Contact the shop owner.');
    const available = credit.creditLimit - credit.outstandingBalance;
    if (amount > available) throw new BadRequestException(`Insufficient credit. Available: ₹${available}`);

    credit.outstandingBalance += amount;
    await this.creditRepository.save(credit);

    const tx = this.creditTxRepository.create({
      shopCreditId: credit.id,
      shopId,
      customerPhone,
      type: 'DEBIT',
      amount,
      balanceAfter: credit.outstandingBalance,
      orderId,
    });
    return this.creditTxRepository.save(tx);
  }

  async repayCredit(
    shopId: string,
    customerPhone: string,
    amount: number,
    note?: string,
  ): Promise<CreditTransaction> {
    const credit = await this.creditRepository.findOne({ where: { shopId, customerPhone } });
    if (!credit) throw new NotFoundException('Credit account not found.');
    if (amount > credit.outstandingBalance) {
      throw new BadRequestException(`Repayment amount exceeds outstanding balance of ₹${credit.outstandingBalance}`);
    }

    credit.outstandingBalance -= amount;
    if (credit.outstandingBalance === 0) credit.status = 'SETTLED';
    await this.creditRepository.save(credit);

    const tx = this.creditTxRepository.create({
      shopCreditId: credit.id,
      shopId,
      customerPhone,
      type: 'REPAYMENT',
      amount,
      balanceAfter: credit.outstandingBalance,
      note,
    });
    return this.creditTxRepository.save(tx);
  }

  async getCreditTransactions(shopId: string, customerPhone: string): Promise<CreditTransaction[]> {
    return this.creditTxRepository.find({
      where: { shopId, customerPhone },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── Subscription (Vendor Earnings View) ─────────────────────────────────

  async getShopSubscription(shopId: string): Promise<ShopSubscription | null> {
    return this.subscriptionRepository.findOne({
      where: { shopId },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── Legacy Darkstore Support (kept for backward compat) ──────────────────

  async getDarkstores(): Promise<Darkstore[]> {
    return this.darkstoreRepository.find();
  }

  async getNearbyStores(
    userLat: number,
    userLng: number,
  ): Promise<(Darkstore & { distance: number })[]> {
    const stores = await this.darkstoreRepository.find({ where: { isActive: true } });
    return stores
      .map((store) => ({
        ...store,
        distance: Math.round(calculateDistance(userLat, userLng, store.lat, store.lng) * 100) / 100,
      }))
      .filter((store) => store.distance <= store.serviceRadiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  async getQcProducts(vendorId?: string): Promise<Product[]> {
    const where: any = { isQuickCommerce: true, isActive: true };
    if (vendorId) where.vendorId = vendorId;
    return this.productRepository.find({ where });
  }

  async registerStore(vendorId: string, storeData: any): Promise<Darkstore> {
    const store = this.darkstoreRepository.create({ vendorId, ...storeData } as any);
    return this.darkstoreRepository.save(store as any);
  }

  async getStoreByVendor(vendorId: string): Promise<Darkstore> {
    const store = await this.darkstoreRepository.findOne({ where: { vendorId } });
    if (!store) throw new NotFoundException(`No store found for vendor ${vendorId}`);
    return store;
  }

  async updateStoreRange(
    vendorId: string,
    rangeKm: number,
    lat?: number,
    lng?: number,
  ): Promise<Darkstore> {
    const store = await this.getStoreByVendor(vendorId);
    store.serviceRadiusKm = rangeKm;
    if (lat) store.lat = lat;
    if (lng) store.lng = lng;
    return this.darkstoreRepository.save(store);
  }

  async calculateEta(userLat: number, userLng: number): Promise<{ etaMinutes: number; distance: number }> {
    const stores = await this.getNearbyStores(userLat, userLng);
    if (!stores.length) return { etaMinutes: 30, distance: 0 };
    const closest = stores[0];
    const etaMinutes = Math.round(5 + closest.distance * 3);
    return { etaMinutes, distance: closest.distance };
  }

  async addStoreProduct(vendorId: string, dto: any): Promise<Product> {
    return this.addShopProduct(vendorId, dto);
  }

  async updateStoreProduct(vendorId: string, productId: string, dto: any): Promise<Product> {
    return this.updateShopProduct(vendorId, productId, dto);
  }

  async deleteStoreProduct(vendorId: string, productId: string): Promise<{ success: boolean }> {
    return this.deleteShopProduct(vendorId, productId);
  }

  async getOrdersForVendor(vendorId: string): Promise<OrderItem[]> {
    return this.getShopOrders(vendorId);
  }

  // ─── Flado Customer Order Placement API ────────────────────────────────────

  async createFladoOrder(dto: {
    shopId: string;
    customerId?: string;
    customerPhone: string;
    deliveryAddress: string;
    items: Array<{ productId: string; quantity: number; unitPrice: number }>;
    paymentMethod: string;
    discountAmount?: number;
  }): Promise<Order> {
    const shop = await this.getShopById(dto.shopId);
    
    // Calculate subtotal
    const subtotal = dto.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // Calculate delivery fee
    const deliveryFee = shop.deliveryFeeType === 'PAID' ? shop.deliveryFeeAmount : 0;

    // Calculate COD fee
    const codFee = dto.paymentMethod === 'COD' ? this.calculateCodFee(subtotal).fee : 0;
    const totalAmount = subtotal + deliveryFee + codFee - (dto.discountAmount || 0);

    // Create Order Record
    const order = this.orderRepository.create({
      customerId: dto.customerId || 'guest-' + Date.now(),
      totalAmount,
      discountAmount: dto.discountAmount || 0,
      status: 'PLACED',
      deliveryAddress: dto.deliveryAddress,
      paymentMethod: dto.paymentMethod,
      deliveryMinutes: Math.min(10 + Math.round(shop.deliveryRadiusKm * 5), 30),
      itemsSummary: JSON.stringify(dto.items),
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create Order Items and update stock
    for (const item of dto.items) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        vendorId: dto.shopId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
        status: 'PLACED',
      });
      await this.orderItemRepository.save(orderItem);

      // Decrement inventory stock
      const inventory = await this.inventoryRepository.findOne({
        where: { productId: item.productId, vendorId: dto.shopId },
      });
      if (inventory) {
        inventory.stockQuantity = Math.max(0, inventory.stockQuantity - item.quantity);
        await this.inventoryRepository.save(inventory);
      }
    }

    return savedOrder;
  }

  async getFladoCustomerOrders(phone: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { deliveryAddress: Like(`%${phone}%`) },
      order: { createdAt: 'DESC' },
    });
  }
}
