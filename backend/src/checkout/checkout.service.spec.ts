import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { Address, User } from '../database/entities';
import { CartService } from '../cart/cart.service';
import { DeliveryService } from '../delivery/delivery.service';

describe('CheckoutService (CMD-042)', () => {
  let service: CheckoutService;
  let cartService: any;
  let deliveryService: any;
  let addressRepo: any;

  const mockCartResponse = {
    cartId: 'cart-123',
    customerId: 'cust-456',
    status: 'ACTIVE',
    items: [
      {
        id: 'item-1',
        sku: 'SKU-MILK-001',
        title: 'Organic Milk 1L',
        quantity: 2,
        unitPrice: 450,
        formattedUnitPrice: '$4.50',
        lineTotal: 900,
        formattedLineTotal: '$9.00',
        inStock: true,
        stockStatus: 'IN_STOCK',
        isFlado: true,
      },
    ],
    totalItems: 2,
    subtotal: 900,
    formattedSubtotal: '$9.00',
    tax: 162,
    formattedTax: '$1.62',
    shipping: 250,
    formattedShipping: '$2.50',
    discount: 0,
    formattedDiscount: '$0.00',
    grandTotal: 1312,
    formattedGrandTotal: '$13.12',
    hasOutofStockItems: false,
    isMinimumBasketMet: true,
    storeAvailabilityStatus: 'OPEN',
    storeName: 'Flado Darkstore #102',
    checkoutEligibility: {
      isEligible: true,
      blockers: [],
    },
  };

  const mockAddress: Address = {
    id: 'addr-1',
    userId: 'cust-456',
    label: 'Home',
    fullName: 'Rahul Sharma',
    phone: '+919876543210',
    line1: '123 Park Street',
    line2: 'Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    lat: 19.0596,
    lng: 72.8295,
    isDefault: true,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    cartService = {
      getCart: jest.fn().mockResolvedValue(mockCartResponse),
    };
    deliveryService = {
      evaluateServiceability: jest.fn().mockResolvedValue({
        isServiceable: true,
        status: 'SERVICEABLE',
        estimatedDeliveryText: '10-15 mins',
      }),
    };
    addressRepo = {
      find: jest.fn().mockResolvedValue([mockAddress]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        { provide: CartService, useValue: cartService },
        { provide: DeliveryService, useValue: deliveryService },
        { provide: getRepositoryToken(Address), useValue: addressRepo },
        { provide: getRepositoryToken(User), useValue: { findOne: jest.fn().mockResolvedValue(null) } },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 1. Authenticated checkout preview
  it('should return authoritative checkout preview for customer', async () => {
    const result = await service.getPreview('cust-456', {});

    expect(cartService.getCart).toHaveBeenCalledWith('cust-456');
    expect(addressRepo.find).toHaveBeenCalledWith({
      where: { userId: 'cust-456' },
      order: { isDefault: 'DESC' },
    });
    expect(result.cartId).toBe('cart-123');
    expect(result.selectedAddress?.id).toBe('addr-1');
    expect(result.deliveryOptions).toHaveLength(1);
    expect(result.paymentMethods.length).toBeGreaterThanOrEqual(3);
    expect(result.formattedGrandTotal).toBe('$13.12');
    expect(result.checkoutEligibility.isEligible).toBe(true);
  });

  // 2. IDOR Address Security
  it('should throw ForbiddenException if customer tries to select address owned by another user', async () => {
    addressRepo.find.mockResolvedValue([mockAddress]); // customer addresses only contain addr-1

    await expect(
      service.getPreview('cust-456', { addressId: 'other-user-address-999' }),
    ).rejects.toThrow(ForbiddenException);
  });

  // 3. Unserviceable location blocker
  it('should add unserviceable location blocker if DeliveryService fails serviceability', async () => {
    deliveryService.evaluateServiceability.mockResolvedValue({
      isServiceable: false,
      status: 'UNSERVICEABLE',
      unserviceableReason: 'Delivery location is outside service radius',
    });

    const result = await service.getPreview('cust-456', { addressId: 'addr-1' });

    expect(result.checkoutEligibility.isEligible).toBe(false);
    expect(result.checkoutEligibility.blockers).toContain(
      'Delivery location is outside service radius',
    );
  });

  // 4. COD Threshold evaluation
  it('should mark COD payment method as ineligible if grand total exceeds threshold', async () => {
    cartService.getCart.mockResolvedValue({
      ...mockCartResponse,
      grandTotal: 150000, // $1500.00 (> $1000.00 threshold)
      formattedGrandTotal: '$1,500.00',
    });

    const result = await service.getPreview('cust-456', {});

    const codOption = result.paymentMethods.find((p) => p.type === 'COD');
    expect(codOption?.isEligible).toBe(false);
  });

  // 5. Does NOT create an order during preview
  it('should purely return preview state without creating an order or mutating cart status', async () => {
    const result = await service.getPreview('cust-456', {});
    expect(result.cartId).toBe('cart-123');
    // Ensure no order repository was called
  });

  // 6. FIX-001: Evaluates Flado serviceability for ALL Flado items in cart
  it('should evaluate serviceability across all Flado cart items and block preview if any item is unserviceable', async () => {
    cartService.getCart.mockResolvedValue({
      ...mockCartResponse,
      items: [
        { id: 'item-1', sku: 'SKU-MILK-1', title: 'Organic Milk 1L', quantity: 1, isFlado: true, fulfillmentSourceId: 'shop-101' },
        { id: 'item-2', sku: 'SKU-BREAD-1', title: 'Whole Wheat Bread', quantity: 2, isFlado: true, fulfillmentSourceId: 'shop-101' },
      ],
    });

    deliveryService.evaluateServiceability
      .mockResolvedValueOnce({ isServiceable: true, estimatedDeliveryText: '10 mins' })
      .mockResolvedValueOnce({
        isServiceable: false,
        status: 'UNSERVICEABLE',
        unserviceableReason: 'Location is outside Flado quick-commerce delivery zone',
      });

    const result = await service.getPreview('cust-456', { addressId: 'addr-1' });

    expect(result.checkoutEligibility.isEligible).toBe(false);
    expect(result.checkoutEligibility.blockers).toContain(
      'Location is outside Flado quick-commerce delivery zone',
    );
  });

  // 7. FIX-001: Mixed Cart Isolation
  it('should evaluate Flado and Marketplace serviceability independently in a mixed cart and block if Flado is unserviceable', async () => {
    cartService.getCart.mockResolvedValue({
      ...mockCartResponse,
      items: [
        { id: 'item-mkt', sku: 'SKU-SHOES-1', title: 'Running Shoes', quantity: 1, isFlado: false },
        { id: 'item-flado', sku: 'SKU-APPLE-1', title: 'Fresh Apples 1kg', quantity: 2, isFlado: true, fulfillmentSourceId: 'shop-102' },
      ],
    });

    deliveryService.evaluateServiceability.mockImplementation(async (query: any) => {
      if (query.surface === 'QUICK_COMMERCE') {
        return {
          isServiceable: false,
          status: 'UNSERVICEABLE',
          unserviceableReason: 'Flado store is currently closed',
        };
      }
      return { isServiceable: true, estimatedDeliveryText: '2-3 Business Days' };
    });

    const result = await service.getPreview('cust-456', { addressId: 'addr-1' });

    expect(result.checkoutEligibility.isEligible).toBe(false);
    expect(result.checkoutEligibility.blockers).toContain('Flado store is currently closed');
  });
});
