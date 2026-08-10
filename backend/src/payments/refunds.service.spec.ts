import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { Refund, RefundItem, RefundAttempt, PaymentIntent, Order } from '../database/entities';
import { AuditService } from '../audit/audit.service';

describe('RefundsService — CMD-051 Refund Engine', () => {
  let service: RefundsService;
  let refundRepo: any;
  let refundItemRepo: any;
  let refundAttemptRepo: any;
  let paymentIntentRepo: any;
  let orderRepo: any;
  let auditService: any;
  let mockProvider: any;
  let mockProvidersMap: Map<string, any>;
  let activeRefundsStore: any[];

  const MOCK_USER = { userId: 'cust-100', role: 'CUSTOMER' };

  beforeEach(async () => {
    activeRefundsStore = [];
    refundRepo = {
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      create: jest.fn((dto) => ({ id: `ref-${Math.random()}`, ...dto })),
      save: jest.fn((entity) => Promise.resolve({ id: entity.id || 'ref-saved', ...entity })),
    };

    refundItemRepo = {
      create: jest.fn((dto) => ({ id: `item-${Math.random()}`, ...dto })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      find: jest.fn().mockResolvedValue([]),
    };

    refundAttemptRepo = {
      create: jest.fn((dto) => ({ id: `att-${Math.random()}`, ...dto })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      findOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
    };

    paymentIntentRepo = {
      findOne: jest.fn(),
    };

    orderRepo = {
      findOne: jest.fn(),
    };

    auditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockProvider = {
      name: 'GENERIC',
      processRefund: jest.fn().mockResolvedValue({
        success: true,
        status: 'SUCCEEDED',
        providerRefundReference: 'gtw_ref_12345',
        sanitizedResponse: { status: 'REFUND_SUCCEEDED' },
      }),
    };

    mockProvidersMap = new Map();
    mockProvidersMap.set('GENERIC', mockProvider);

    const mockDataSource = {
      transaction: jest.fn(async (cb) => {
        const manager = {
          findOne: jest.fn().mockImplementation((entityClass, query) => {
            if (entityClass === Order) return orderRepo.findOne(query);
            if (entityClass === PaymentIntent) return paymentIntentRepo.findOne(query);
            if (entityClass === Refund) {
              if (query?.where?.sourceType && query?.where?.sourceId) {
                return Promise.resolve(activeRefundsStore.find((r) => r.sourceType === query.where.sourceType && r.sourceId === query.where.sourceId) || null);
              }
              return refundRepo.findOne(query);
            }
            return Promise.resolve(null);
          }),
          find: jest.fn().mockImplementation((entityClass, query) => {
            if (entityClass === Refund) return Promise.resolve(activeRefundsStore);
            return Promise.resolve([]);
          }),
          create: jest.fn((entityClass, dto) => ({ id: `tx-id-${Math.random()}`, ...dto })),
          save: jest.fn((entityClass, entity) => {
            if (entityClass === Refund) {
              const id = entity.id || `ref-${Math.random()}`;
              const saved = { ...entity, id };
              const idx = activeRefundsStore.findIndex((r) => r.id === id);
              if (idx >= 0) {
                activeRefundsStore[idx] = saved;
              } else {
                activeRefundsStore.push(saved);
              }
              return Promise.resolve(saved);
            }
            return Promise.resolve(entity);
          }),
        };
        return cb(manager);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundsService,
        { provide: getRepositoryToken(Refund), useValue: refundRepo },
        { provide: getRepositoryToken(RefundItem), useValue: refundItemRepo },
        { provide: getRepositoryToken(RefundAttempt), useValue: refundAttemptRepo },
        { provide: getRepositoryToken(PaymentIntent), useValue: paymentIntentRepo },
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: AuditService, useValue: auditService },
        { provide: 'PAYMENT_PROVIDERS', useValue: mockProvidersMap },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<RefundsService>(RefundsService);
  });

  it('T01: initiateRefund creates refund and provider attempt for prepaid captured order', async () => {
    orderRepo.findOne.mockResolvedValue({ id: 'order-1', customerId: 'cust-100', paymentIntentId: 'pi-1' });
    paymentIntentRepo.findOne.mockResolvedValue({ id: 'pi-1', amountCapturedMinor: 5000, status: 'SUCCEEDED', currency: 'USD', paymentMethod: 'CARD' });

    const result = await service.initiateRefund({
      orderId: 'order-1',
      customerId: 'cust-100',
      sourceType: 'CANCELLATION',
      sourceId: 'canc-1',
      amountMinor: 2500,
      reason: 'Partial cancellation',
    });

    expect(result.status).toBe('SUCCEEDED');
    expect(result.amountMinor).toBe(2500);
    expect(mockProvider.processRefund).toHaveBeenCalled();
  });

  it('T02: initiateRefund enforces cumulative refund balance limit', async () => {
    orderRepo.findOne.mockResolvedValue({ id: 'order-1', customerId: 'cust-100', paymentIntentId: 'pi-1' });
    paymentIntentRepo.findOne.mockResolvedValue({ id: 'pi-1', amountCapturedMinor: 5000, status: 'SUCCEEDED', currency: 'USD' });
    activeRefundsStore.push({ id: 'ref-prev', orderId: 'order-1', amountMinor: 4000, status: 'SUCCEEDED' });

    await expect(
      service.initiateRefund({
        orderId: 'order-1',
        customerId: 'cust-100',
        sourceType: 'RETURN',
        sourceId: 'ret-2',
        amountMinor: 2000, // 4000 + 2000 = 6000 > 5000 captured!
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('T03: initiateRefund handles COD order cleanly as NOT_REQUIRED without calling provider', async () => {
    orderRepo.findOne.mockResolvedValue({ id: 'order-cod', customerId: 'cust-100', paymentMethod: 'COD' });

    const result = await service.initiateRefund({
      orderId: 'order-cod',
      customerId: 'cust-100',
      sourceType: 'CANCELLATION',
      sourceId: 'canc-cod',
      amountMinor: 0,
      reason: 'COD cancellation',
    });

    expect(result.status).toBe('NOT_REQUIRED');
    expect(result.destination).toBe('NOT_REQUIRED');
    expect(mockProvider.processRefund).not.toHaveBeenCalled();
  });

  it('T04: initiateRefund returns existing record idempotently for duplicate sourceType + sourceId', async () => {
    const existing = { id: 'ref-exist', sourceType: 'CANCELLATION', sourceId: 'canc-dup', status: 'SUCCEEDED', amountMinor: 1000 };
    refundRepo.findOne.mockResolvedValue(existing);

    const result = await service.initiateRefund({
      orderId: 'order-1',
      customerId: 'cust-100',
      sourceType: 'CANCELLATION',
      sourceId: 'canc-dup',
      amountMinor: 1000,
    });

    expect(result).toBe(existing);
  });

  it('T05: processWebhookRefundEvent enforces monotonic state transitions (SUCCEEDED is terminal)', async () => {
    const existingRefund = { id: 'ref-succ', status: 'SUCCEEDED', completedAt: new Date() };
    refundAttemptRepo.findOne.mockResolvedValue({ refundId: 'ref-succ', providerRefundReference: 'gtw_ref_123' });
    refundRepo.findOne.mockResolvedValue(existingRefund);

    const result = await service.processWebhookRefundEvent('gtw_ref_123', 'FAILED', 'Stale webhook');

    expect(result.status).toBe('SUCCEEDED'); // Status remains SUCCEEDED!
  });

  it('T06: getRefundsForOrder throws ForbiddenException for unauthorized customer', async () => {
    orderRepo.findOne.mockResolvedValue({ id: 'order-other', customerId: 'cust-999' });

    await expect(service.getRefundsForOrder(MOCK_USER, 'order-other')).rejects.toThrow(ForbiddenException);
  });

  it('T07: concurrent competing partial refund requests can NEVER exceed paymentIntent amountCapturedMinor', async () => {
    activeRefundsStore.length = 0;
    orderRepo.findOne.mockResolvedValue({ id: 'order-conc', customerId: 'cust-100', paymentIntentId: 'pi-conc' });
    paymentIntentRepo.findOne.mockResolvedValue({ id: 'pi-conc', amountCapturedMinor: 5000, status: 'SUCCEEDED', currency: 'USD', paymentMethod: 'CARD' });

    // Request 1: $30.00 (3000 minor)
    const req1 = service.initiateRefund({
      orderId: 'order-conc',
      customerId: 'cust-100',
      sourceType: 'CANCELLATION',
      sourceId: 'canc-conc-1',
      amountMinor: 3000,
    });

    // Request 2: $30.00 (3000 minor) — competing concurrently!
    const req2 = service.initiateRefund({
      orderId: 'order-conc',
      customerId: 'cust-100',
      sourceType: 'CANCELLATION',
      sourceId: 'canc-conc-2',
      amountMinor: 3000,
    });

    const results = await Promise.allSettled([req1, req2]);
    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    // Exactly one request must succeed and one must be rejected
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    // Sum of successful refunds in store must be <= 5000 minor ($50.00)
    const totalAcceptedMinor = activeRefundsStore.reduce((sum, r) => sum + r.amountMinor, 0);
    expect(totalAcceptedMinor).toBeLessThanOrEqual(5000);
  });

  it('T08: processWebhookRefundEvent safely ignores webhooks for NOT_REQUIRED refunds', async () => {
    const codRefund = { id: 'ref-cod-1', status: 'NOT_REQUIRED', destination: 'NOT_REQUIRED' };
    refundAttemptRepo.findOne.mockResolvedValue({ refundId: 'ref-cod-1', providerRefundReference: 'cod_ref_123' });
    refundRepo.findOne.mockResolvedValue(codRefund);

    const result = await service.processWebhookRefundEvent('cod_ref_123', 'SUCCEEDED');

    expect(result.status).toBe('NOT_REQUIRED');
  });
});

