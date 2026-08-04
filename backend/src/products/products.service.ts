import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Category, Inventory, Vendor, ProductReview, AuditLog } from '../database/entities';

@Injectable()
export class ProductsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedInitialData();
  }

  async seedInitialData() {
    const productCount = await this.productRepository.count();
    // If we have fewer than 15 products, let's clear and re-seed the rich database
    if (productCount < 15) {
      // Clear old data to avoid primary key/unique key collisions
      await this.inventoryRepository.delete({});
      await this.productRepository.delete({});
      await this.categoryRepository.delete({});

      const categoriesData = [
        { name: 'Fashion', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
        { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
        { name: 'Beauty', slug: 'beauty', imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400' },
        { name: 'Home & Kitchen', slug: 'home', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400' },
        { name: 'Groceries', slug: 'groceries', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' },
        { name: 'Sports', slug: 'sports', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400' },
        { name: 'Appliances', slug: 'appliances', imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400' },
        { name: 'Toys', slug: 'toys', imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400' },
      ];

      const categoryMap = new Map<string, string>();
      for (const cat of categoriesData) {
        const category = this.categoryRepository.create(cat);
        const savedCat = await this.categoryRepository.save(category);
        categoryMap.set(cat.slug, savedCat.id);
      }

      // Check if vendors are empty, seed one vendor
      const vendorCount = await this.vendorRepository.count();
      let defaultVendorId = '';
      if (vendorCount === 0) {
        const vendor = this.vendorRepository.create({
          userId: 'admin-user-id-placeholder',
          storeName: 'AuraMart Flagship Store',
          storeDescription: 'Official AuraMart vendor store',
          gstNumber: '29AAAAA1111A1Z1',
          isVerified: true,
          performanceScore: 4.9,
        });
        const savedVendor = await this.vendorRepository.save(vendor);
        defaultVendorId = savedVendor.id;
      } else {
        const v = await this.vendorRepository.find();
        defaultVendorId = v[0].id;
      }

      const productsData = [
        // --- GROCERIES / FRESH (FLADO EXCLUSIVE) ---
        {
          id: 'gro-1',
          title: 'Organic Bananas (Pack of 6)',
          description: 'Fresh, naturally ripened organic bananas sourced from local farms in Maharashtra. Rich in potassium and instant energy.',
          basePrice: 80.00,
          discountPrice: 60.00,
          sku: 'SKU-QC-BANANA-01',
          colorsJson: JSON.stringify(['Yellow']),
          sizesJson: JSON.stringify(['Pack of 6']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('groceries'),
          vendorId: defaultVendorId,
          subCategory: 'Fruits & Vegetables',
          rating: 4.8,
          reviewCount: 320,
        },
        {
          id: 'gro-2',
          title: 'Fresh Farm Whole Milk 1L',
          description: 'Pasteurized, homogenized whole milk with 3.5% fat content. Sourced daily and chilled to perfection.',
          basePrice: 75.00,
          discountPrice: 72.00,
          sku: 'SKU-QC-MILK-02',
          colorsJson: JSON.stringify(['White']),
          sizesJson: JSON.stringify(['1 Litre']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('groceries'),
          vendorId: defaultVendorId,
          subCategory: 'Dairy & Bread',
          rating: 4.7,
          reviewCount: 450,
        },
        {
          id: 'gro-3',
          title: 'Gourmet Sourdough Bread',
          description: 'Artisanal, freshly baked sourdough bread with a chewy interior and thick, crispy crust. No added preservatives.',
          basePrice: 150.00,
          discountPrice: 120.00,
          sku: 'SKU-QC-BREAD-03',
          colorsJson: JSON.stringify(['Brown']),
          sizesJson: JSON.stringify(['400g']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('groceries'),
          vendorId: defaultVendorId,
          subCategory: 'Dairy & Bread',
          rating: 4.6,
          reviewCount: 98,
        },
        {
          id: 'gro-4',
          title: 'Fresh Hass Avocados (2 Pcs)',
          description: 'Premium imported Hass avocados. Rich, creamy texture, perfect for healthy salads, toast, or homemade guacamole.',
          basePrice: 299.00,
          discountPrice: 249.00,
          sku: 'SKU-QC-AVOCADO-04',
          colorsJson: JSON.stringify(['Green']),
          sizesJson: JSON.stringify(['2 Pcs']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('groceries'),
          vendorId: defaultVendorId,
          subCategory: 'Fruits & Vegetables',
          rating: 4.5,
          reviewCount: 180,
        },
        {
          id: 'gro-5',
          title: 'Classic Potato Chips (Salted) 150g',
          description: 'Thinly sliced crispy potatoes seasoned with pure sea salt. Perfect party snack or tea-time companion.',
          basePrice: 60.00,
          discountPrice: 50.00,
          sku: 'SKU-QC-CHIPS-05',
          colorsJson: JSON.stringify(['Salted']),
          sizesJson: JSON.stringify(['150g']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('groceries'),
          vendorId: defaultVendorId,
          subCategory: 'Snacks & Munchies',
          rating: 4.4,
          reviewCount: 540,
        },
        {
          id: 'gro-6',
          title: 'Premium Greek Yogurt (Blueberry) 150g',
          description: 'Thick, creamy Greek yogurt layered with real blueberry compote. High protein and delicious taste.',
          basePrice: 75.00,
          discountPrice: 65.00,
          sku: 'SKU-QC-YOGURT-06',
          colorsJson: JSON.stringify(['Blueberry']),
          sizesJson: JSON.stringify(['150g']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('groceries'),
          vendorId: defaultVendorId,
          subCategory: 'Dairy & Bread',
          rating: 4.7,
          reviewCount: 210,
        },
        // --- ELECTRONICS ---
        {
          id: 'ele-1',
          title: 'AuraPods Pro ANC Earbuds',
          description: 'Premium active noise-cancelling wireless earbuds with spatial audio, transparency mode, and up to 36 hours of battery life with case.',
          basePrice: 12999.00,
          discountPrice: 8999.00,
          sku: 'SKU-ELEC-AURAPODS',
          colorsJson: JSON.stringify(['White', 'Black']),
          sizesJson: JSON.stringify(['Standard']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('electronics'),
          vendorId: defaultVendorId,
          subCategory: 'Audio & Wearables',
          rating: 4.7,
          reviewCount: 1450,
        },
        {
          id: 'ele-2',
          title: 'AuraWatch Elite Smartwatch',
          description: 'Stunning 1.43" AMOLED screen, continuous heart rate tracking, blood oxygen monitoring, multi-sport modes, and premium leather strap.',
          basePrice: 19999.00,
          discountPrice: 14999.00,
          sku: 'SKU-ELEC-WATCHELITE',
          colorsJson: JSON.stringify(['Black Leather', 'Brown Leather']),
          sizesJson: JSON.stringify(['46mm']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('electronics'),
          vendorId: defaultVendorId,
          subCategory: 'Audio & Wearables',
          rating: 4.5,
          reviewCount: 780,
        },
        {
          id: 'ele-3',
          title: 'AuraSound Go Portable Speaker',
          description: 'Compact bluetooth speaker packing powerful 20W stereo sound, deep bass, and IPX7 structural waterproof casing. Perfect for pool parties.',
          basePrice: 4999.00,
          discountPrice: 3499.00,
          sku: 'SKU-ELEC-SPEAKERGO',
          colorsJson: JSON.stringify(['Navy Blue', 'Sunset Red']),
          sizesJson: JSON.stringify(['Standard']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('electronics'),
          vendorId: defaultVendorId,
          subCategory: 'Audio & Wearables',
          rating: 4.6,
          reviewCount: 920,
        },
        {
          id: 'ele-4',
          title: 'Ultralight ANC Gaming Headphones',
          description: 'Pro-grade wireless gaming headphones featuring ultra-low latency wireless transmitters, 50mm drivers, and crystal-clear boom microphones.',
          basePrice: 9999.00,
          discountPrice: 6999.00,
          sku: 'SKU-ELEC-HEADPHONES',
          colorsJson: JSON.stringify(['Matte Black']),
          sizesJson: JSON.stringify(['Standard']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('electronics'),
          vendorId: defaultVendorId,
          subCategory: 'Computers & Accessories',
          rating: 4.4,
          reviewCount: 310,
        },
        // --- FASHION ---
        {
          id: 'fas-1',
          title: 'Classic Denim Trucker Jacket',
          description: 'Vintage-wash premium cotton denim jacket with button chest pockets, adjustable waist tabs, and side welt pockets. Built to last.',
          basePrice: 3999.00,
          discountPrice: 2499.00,
          sku: 'SKU-FASH-DENIMJACK',
          colorsJson: JSON.stringify(['Light Wash', 'Dark Indigo']),
          sizesJson: JSON.stringify(['M', 'L', 'XL']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('fashion'),
          vendorId: defaultVendorId,
          subCategory: 'Mens Wear',
          rating: 4.6,
          reviewCount: 880,
        },
        {
          id: 'fas-2',
          title: 'Linen Blend Summer Dress',
          description: 'Breezy, lightweight summer dress featuring a flattering A-line silhouette, adjustable spaghetti straps, and side pockets.',
          basePrice: 2999.00,
          discountPrice: 1899.00,
          sku: 'SKU-FASH-SUMMERDRESS',
          colorsJson: JSON.stringify(['Mint Green', 'Peach Cream']),
          sizesJson: JSON.stringify(['S', 'M', 'L']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('fashion'),
          vendorId: defaultVendorId,
          subCategory: 'Womens Wear',
          rating: 4.4,
          reviewCount: 340,
        },
        {
          id: 'fas-3',
          title: 'AuraSpeed Run Pro Sneakers',
          description: 'High-performance running shoes built with nitrogen-infused foam midsoles, engineered knit mesh uppers, and high-traction rubber outsoles.',
          basePrice: 6999.00,
          discountPrice: 4599.00,
          sku: 'SKU-FASH-RUNSNEAKER',
          colorsJson: JSON.stringify(['Neon Red', 'Stealth Black']),
          sizesJson: JSON.stringify(['8', '9', '10']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('fashion'),
          vendorId: defaultVendorId,
          subCategory: 'Footwear',
          rating: 4.8,
          reviewCount: 1250,
        },
        // --- BEAUTY ---
        {
          id: 'be-1',
          title: 'AuraGlow Vitamin C Face Serum',
          description: 'Advanced brightening formula containing 15% pure L-Ascorbic Acid, Ferulic Acid, and Hyaluronic Acid. Redefines skin texture and dark spots.',
          basePrice: 1199.00,
          discountPrice: 799.00,
          sku: 'SKU-BEAU-VITCSERUM',
          colorsJson: JSON.stringify(['Clear']),
          sizesJson: JSON.stringify(['30ml']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('beauty'),
          vendorId: defaultVendorId,
          subCategory: 'Skin Care',
          rating: 4.6,
          reviewCount: 2310,
        },
        {
          id: 'be-2',
          title: 'Ceramide Barrier Relief Cream',
          description: 'Intense hydration moisturizer built with 3 critical ceramides, cholesterol, and fatty acids to rebuild damaged skin barriers.',
          basePrice: 799.00,
          discountPrice: 649.00,
          sku: 'SKU-BEAU-CERAMIDE',
          colorsJson: JSON.stringify(['Standard']),
          sizesJson: JSON.stringify(['50g']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('beauty'),
          vendorId: defaultVendorId,
          subCategory: 'Skin Care',
          rating: 4.7,
          reviewCount: 1120,
        },
        // --- HOME & KITCHEN ---
        {
          id: 'hom-1',
          title: 'Smart Drip Coffee Maker',
          description: 'Programmable 12-cup coffee brewer with automated strength settings, LCD display, and double-walled thermal stainless steel carafe.',
          basePrice: 7999.00,
          discountPrice: 4999.00,
          sku: 'SKU-HOME-COFFEE',
          colorsJson: JSON.stringify(['Metallic Silver']),
          sizesJson: JSON.stringify(['1.8L']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('home'),
          vendorId: defaultVendorId,
          subCategory: 'Kitchen Appliances',
          rating: 4.5,
          reviewCount: 620,
        },
        {
          id: 'hom-2',
          title: 'AuraBlend High-Speed Mixer Blender',
          description: 'Equipped with a robust 1200W copper motor and three surgical-grade stainless steel jars. Crushes tough ingredients in seconds.',
          basePrice: 5499.00,
          discountPrice: 3899.00,
          sku: 'SKU-HOME-MIXER',
          colorsJson: JSON.stringify(['Classic White']),
          sizesJson: JSON.stringify(['3 Jars']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('home'),
          vendorId: defaultVendorId,
          subCategory: 'Kitchen Appliances',
          rating: 4.6,
          reviewCount: 880,
        },
        // --- SPORTS ---
        {
          id: 'spo-1',
          title: 'Pro Premier Match Football',
          description: 'Official FIFA-certified thermal bonded match football. Textured PU cover provides incredible durability and aerodynamically stable flight path.',
          basePrice: 2999.00,
          discountPrice: 1999.00,
          sku: 'SKU-SPOR-FOOTBALL',
          colorsJson: JSON.stringify(['White/Gold']),
          sizesJson: JSON.stringify(['Size 5']),
          isQuickCommerce: true,
          imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('sports'),
          vendorId: defaultVendorId,
          subCategory: 'Team Sports',
          rating: 4.7,
          reviewCount: 420,
        },
        {
          id: 'spo-2',
          title: 'Nanoflare Badminton Racket',
          description: 'Ultra-light, head-light carbon graphite badminton racket. High tension support for powerful lightning-fast smashes and swift recovery.',
          basePrice: 4500.00,
          discountPrice: 3499.00,
          sku: 'SKU-SPOR-RACKET',
          colorsJson: JSON.stringify(['Neon Yellow']),
          sizesJson: JSON.stringify(['Standard']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('sports'),
          vendorId: defaultVendorId,
          subCategory: 'Racquet Sports',
          rating: 4.6,
          reviewCount: 230,
        },
        // --- APPLIANCES ---
        {
          id: 'app-1',
          title: 'Cyclone Cordless Stick Vacuum',
          description: 'Extremely powerful 150AW cordless stick vacuum cleaner with smart digital optical sensors that auto-adjust suction on hard floors.',
          basePrice: 34999.00,
          discountPrice: 24999.00,
          sku: 'SKU-APPL-VACUUM',
          colorsJson: JSON.stringify(['Iron/Fuchsia']),
          sizesJson: JSON.stringify(['Standard']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('appliances'),
          vendorId: defaultVendorId,
          subCategory: 'Cleaning Appliances',
          rating: 4.8,
          reviewCount: 190,
        },
        // --- TOYS ---
        {
          id: 'toy-1',
          title: 'Space Shuttle Discovery Set',
          description: 'Immersive building project containing 2354 pieces. Models the official space shuttle Discovery and Hubble Space Telescope.',
          basePrice: 19999.00,
          discountPrice: 15999.00,
          sku: 'SKU-TOYS-SPACESHUTTLE',
          colorsJson: JSON.stringify(['Standard']),
          sizesJson: JSON.stringify(['2354 Pieces']),
          isQuickCommerce: false,
          imageUrl: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=600&auto=format&fit=crop&q=80',
          categoryId: categoryMap.get('toys'),
          vendorId: defaultVendorId,
          subCategory: 'Building Blocks',
          rating: 4.9,
          reviewCount: 120,
        }
      ];

      for (const prodData of productsData) {
        const prod = this.productRepository.create(prodData);
        const savedProd = await this.productRepository.save(prod);

        // Add inventory
        const inv = this.inventoryRepository.create({
          productId: savedProd.id,
          vendorId: defaultVendorId,
          variantName: 'Standard Variant',
          stockQuantity: prodData.isQuickCommerce ? 40 : 15,
          lowStockThreshold: 5,
        });
        await this.inventoryRepository.save(inv);
      }
    }
  }

  async findAll(query?: any): Promise<any[]> {
    const filters: any = {};
    if (query?.category) {
      const cat = await this.categoryRepository.findOne({ where: { slug: query.category } });
      if (cat) filters.categoryId = cat.id;
    }
    if (query?.isQuickCommerce !== undefined) {
      filters.isQuickCommerce = query.isQuickCommerce === 'true';
    }
    const list = await this.productRepository.find({ where: filters });
    return list.map(item => ({
      ...item,
      isFlado: item.isQuickCommerce
    }));
  }

  async findOne(id: string): Promise<any> {
    const prod = await this.productRepository.findOne({ where: { id } });
    if (!prod) throw new NotFoundException('Product not found');
    return {
      ...prod,
      isFlado: prod.isQuickCommerce
    };
  }

  async create(data: Partial<Product>): Promise<Product> {
    const prod = this.productRepository.create(data);
    const saved = await this.productRepository.save(prod);

    // Create default inventory
    const inv = this.inventoryRepository.create({
      productId: saved.id,
      vendorId: saved.vendorId,
      stockQuantity: data.isQuickCommerce ? 50 : 20,
    });
    await this.inventoryRepository.save(inv);

    return saved;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const prod = await this.findOne(id);
    Object.assign(prod, data);
    return this.productRepository.save(prod);
  }

  async remove(id: string): Promise<void> {
    const prod = await this.findOne(id);
    await this.productRepository.remove(prod);
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const cat = this.categoryRepository.create(data);
    return this.categoryRepository.save(cat);
  }

  async getReviews(productId: string) {
    return this.reviewRepository.find({
      where: { productId, isApproved: true },
      order: { createdAt: 'DESC' }
    });
  }

  async addReview(productId: string, customerId: string, customerName: string, data: any) {
    const review = this.reviewRepository.create({
      productId,
      customerId,
      customerName,
      rating: data.rating,
      comment: data.comment,
      isApproved: false,
    });
    return this.reviewRepository.save(review);
  }

  async approveReview(reviewId: string) {
    const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    review.isApproved = true;
    return this.reviewRepository.save(review);
  }

  async getAuditLogs() {
    return this.auditLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
