import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart, CartItem, ProductVariant, Product, Inventory, FladoShop, Coupon, User } from '../database/entities';
import { DeliveryService } from '../delivery/delivery.service';

describe('CartService (CMD-039 & CMD-041 Quick Cart)', () => {
  let service: CartService;
  let cartRepo: any;
  let cartItemRepo: any;
  let variantRepo: any;
  let productRepo: any;
  let inventoryRepo: any;
  let fladoShopRepo: any;
  let deliveryService: any;

  const mockCart: Cart = {
    id: 'cart-123',
    customerId: 'cust-456',
    status: 'ACTIVE',
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVariant: ProductVariant = {
    id: 'var-1',
    productId: 'prod-1',
    sku: 'SKU-HEADPHONE-001',
    gtin: '12345678',
    title: 'Black',
    attributeSignature: 'color_black',
    referenceMsrp: 349,
    referenceDiscountPrice: 299,
    netQuantity: 1,
    unitOfMeasure: 'pc',
    quantityPerPack: 1,
    weightKg: 0.25,
    isDefault: true,
    status: 'ACTIVE',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockProduct: Product = {
    id: 'prod-1',
    vendorId: 'vend-1',
    title: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'High quality wireless headphones',
    basePrice: 299,
    discountPrice: 349,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    isQuickCommerce: false,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockFladoProduct: Product = {
    id: 'prod-flado-1',
    vendorId: 'vend-flado-1',
    title: 'Organic Milk 1L',
    slug: 'organic-milk',
    description: 'Fresh milk',
    basePrice: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    isQuickCommerce: true,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockFladoShop: FladoShop = {
    id: 'shop-102',
    ownerName: 'Rahul Kumar',
    ownerPhone: '+919876543210',
    shopName: 'Flado Darkstore #102',
    address: '123 Main Street',
    deliveryRadiusKm: 3.0,
    deliveryFeeType: 'PAID',
    deliveryFeeAmount: 2.5,
    minimumOrderAmount: 15.0, // Minimum order $15.00
    isOpen: true,
    approvalStatus: 'APPROVED',
    isPhysicallyVerified: true,
    categoriesJson: '["Grocery"]',
    rating: 4.8,
    totalRatings: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockInventory: Inventory = {
    id: 'inv-1',
    quantityOnHand: 50,
    quantityReserved: 5,
    reorderThreshold: 10,
    warehouseLocation: 'Zone A',
    updatedAt: new Date(),
  } as any;

  beforeEach(async () => {
    cartRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    cartItemRepo = {
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    variantRepo = {
      findOne: jest.fn(),
    };
    productRepo = {
      findOne: jest.fn(),
    };
    inventoryRepo = {
      findOne: jest.fn(),
    };
    fladoShopRepo = {
      findOne: jest.fn(),
    };
    deliveryService = {
      evaluateServiceability: jest.fn().mockResolvedValue({
        isServiceable: true,
        status: 'SERVICEABLE',
        estimatedDeliveryText: '10-15 mins',
        deliveryBadgeText: 'Superfast Delivery',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: cartRepo },
        { provide: getRepositoryToken(CartItem), useValue: cartItemRepo },
        { provide: getRepositoryToken(ProductVariant), useValue: variantRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(Inventory), useValue: inventoryRepo },
        { provide: getRepositoryToken(FladoShop), useValue: fladoShopRepo },
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn().mockResolvedValue(null) } },
        { provide: getRepositoryToken(Coupon), useValue: {} },
        { provide: DeliveryService, useValue: deliveryService },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 1. Authenticated customer cart retrieval
  it('should retrieve existing active cart or create one for customer', async () => {
    cartRepo.findOne.mockResolvedValue(mockCart);
    const result = await service.getCart('cust-456');

    expect(cartRepo.findOne).toHaveBeenCalledWith({
      where: { customerId: 'cust-456', status: 'ACTIVE' },
      relations: ['items'],
    });
    expect(result.cartId).toBe('cart-123');
    expect(result.customerId).toBe('cust-456');
    expect(result.items).toHaveLength(0);
    expect(result.formattedGrandTotal).toBe('$0.00');
  });

  // 2. Add valid SKU
  it('should add item with valid SKU to customer cart', async () => {
    cartRepo.findOne.mockResolvedValue({ ...mockCart, items: [] });
    variantRepo.findOne.mockResolvedValue(mockVariant);
    productRepo.findOne.mockResolvedValue(mockProduct);
    inventoryRepo.findOne.mockResolvedValue(mockInventory);
    cartItemRepo.create.mockImplementation((dto: any) => ({ id: 'item-1', ...dto }));
    cartItemRepo.save.mockResolvedValue({ id: 'item-1', sku: 'SKU-HEADPHONE-001', quantity: 2 });

    const result = await service.addItem('cust-456', {
      sku: 'SKU-HEADPHONE-001',
      quantity: 2,
    });

    expect(variantRepo.findOne).toHaveBeenCalledWith({ where: { sku: 'SKU-HEADPHONE-001' } });
    expect(cartItemRepo.save).toHaveBeenCalled();
    expect(result.cartId).toBe('cart-123');
  });

  // 3. Update substitution preference
  it('should update substitution preference of a cart item', async () => {
    const existingItem: CartItem = {
      id: 'item-1',
      cartId: 'cart-123',
      sku: 'SKU-FLADO-MILK-001',
      quantity: 1,
      substitutionPreference: 'ALLOW_SUBSTITUTION',
    } as any;

    cartRepo.findOne.mockResolvedValue({ ...mockCart, items: [existingItem] });
    variantRepo.findOne.mockResolvedValue(null);
    productRepo.findOne.mockResolvedValue(mockFladoProduct);
    fladoShopRepo.findOne.mockResolvedValue(mockFladoShop);

    const result = await service.updateSubstitution('cust-456', 'item-1', 'CONTACT_ME');
    expect(cartItemRepo.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'item-1', substitutionPreference: 'CONTACT_ME' }));
  });

  // 4. Minimum basket evaluation (when minimumOrderAmount is configured vs null)
  it('should evaluate minimum basket requirement authoritatively when configured on FladoShop', async () => {
    const existingItem: CartItem = {
      id: 'item-1',
      cartId: 'cart-123',
      sku: 'SKU-FLADO-MILK-001',
      quantity: 2, // 2 * $4.50 = $9.00 (< $15.00 min)
      fulfillmentSourceId: 'shop-102',
    } as any;

    cartRepo.findOne.mockResolvedValue({ ...mockCart, items: [existingItem] });
    variantRepo.findOne.mockResolvedValue(null);
    productRepo.findOne.mockResolvedValue(mockFladoProduct);
    fladoShopRepo.findOne.mockResolvedValue(mockFladoShop); // minOrderAmount: 15.0 ($15.00)

    const result = await service.getCart('cust-456');

    expect(result.isMinimumBasketMet).toBe(false);
    expect(result.minimumBasketShortfall).toBe(600); // $6.00 shortfall
    expect(result.formattedMinimumBasketShortfall).toBe('$6.00');
    expect(result.checkoutEligibility.isEligible).toBe(false);
    expect(result.checkoutEligibility.blockers).toContain('Minimum basket requirement not satisfied');
  });

  // 5. Store operational availability validation
  it('should flag storeAvailabilityStatus as CLOSED and disable checkout when shop is closed', async () => {
    const closedShop = { ...mockFladoShop, isOpen: false };
    const existingItem: CartItem = {
      id: 'item-1',
      cartId: 'cart-123',
      sku: 'SKU-FLADO-MILK-001',
      quantity: 4, // 4 * $4.50 = $18.00 (>= $15.00 min)
      fulfillmentSourceId: 'shop-102',
    } as any;

    cartRepo.findOne.mockResolvedValue({ ...mockCart, items: [existingItem] });
    variantRepo.findOne.mockResolvedValue(null);
    productRepo.findOne.mockResolvedValue(mockFladoProduct);
    fladoShopRepo.findOne.mockResolvedValue(closedShop);

    const result = await service.getCart('cust-456');

    expect(result.storeAvailabilityStatus).toBe('CLOSED');
    expect(result.items[0].isStoreUnavailable).toBe(true);
    expect(result.checkoutEligibility.isEligible).toBe(false);
    expect(result.checkoutEligibility.blockers).toContain('Fulfillment store is currently closed');
  });

  // 6. DeliveryService ETA integration
  it('should include delivery ETA returned by DeliveryService verbatim', async () => {
    const existingItem: CartItem = {
      id: 'item-1',
      cartId: 'cart-123',
      sku: 'SKU-FLADO-MILK-001',
      quantity: 4,
      fulfillmentSourceId: 'shop-102',
    } as any;

    cartRepo.findOne.mockResolvedValue({ ...mockCart, items: [existingItem] });
    variantRepo.findOne.mockResolvedValue(null);
    productRepo.findOne.mockResolvedValue(mockFladoProduct);
    fladoShopRepo.findOne.mockResolvedValue(mockFladoShop);

    const result = await service.getCart('cust-456');

    expect(deliveryService.evaluateServiceability).toHaveBeenCalled();
    expect(result.estimatedDeliveryEtaText).toBe('10-15 mins');
  });
});
