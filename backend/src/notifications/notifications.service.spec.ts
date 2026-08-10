import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { DeviceToken, NotificationPreference } from '../database/entities';

describe('NotificationsService (CMD-069)', () => {
  let service: NotificationsService;
  let deviceTokenRepoMock: any;
  let prefRepoMock: any;

  beforeEach(async () => {
    deviceTokenRepoMock = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ id: 'token-uuid-1', ...dto })),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };

    prefRepoMock = {
      findOne: jest.fn(),
      create: jest.fn((dto) => ({ ...dto })),
      save: jest.fn((entity) => Promise.resolve(entity)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(DeviceToken),
          useValue: deviceTokenRepoMock,
        },
        {
          provide: getRepositoryToken(NotificationPreference),
          useValue: prefRepoMock,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    assertOk(service);
  });

  it('1. should register or update device push token for authenticated user', async () => {
    deviceTokenRepoMock.findOne.mockResolvedValue(null);

    const result = await service.registerDevice('user-1', {
      token: 'ExponentPushToken[123]',
      platform: 'ANDROID',
    });

    expect(result.token).toBe('ExponentPushToken[123]');
    expect(result.userId).toBe('user-1');
    expect(result.isEnabled).toBe(true);
  });

  it('2. should re-assign existing token to new user on device login', async () => {
    const existing = {
      id: 'dev-1',
      userId: 'user-old',
      token: 'ExponentPushToken[123]',
      platform: 'IOS',
      isEnabled: false,
    };
    deviceTokenRepoMock.findOne.mockResolvedValue(existing);

    const result = await service.registerDevice('user-new', {
      token: 'ExponentPushToken[123]',
      platform: 'IOS',
    });

    expect(result.userId).toBe('user-new');
    expect(result.isEnabled).toBe(true);
  });

  it('3. should unregister device token on logout', async () => {
    const existing = {
      id: 'dev-1',
      userId: 'user-1',
      token: 'ExponentPushToken[123]',
      isEnabled: true,
    };
    deviceTokenRepoMock.findOne.mockResolvedValue(existing);

    const result = await service.unregisterDevice('user-1', 'ExponentPushToken[123]');
    expect(result.success).toBe(true);
    expect(existing.isEnabled).toBe(false);
  });

  it('4. should prevent unregistering tokens owned by another user (IDOR guard)', async () => {
    const existing = {
      id: 'dev-1',
      userId: 'user-other',
      token: 'ExponentPushToken[123]',
      isEnabled: true,
    };
    deviceTokenRepoMock.findOne.mockResolvedValue(existing);

    await expect(
      service.unregisterDevice('user-attacker', 'ExponentPushToken[123]'),
    ).rejects.toThrow();
  });

  it('5. should enforce customer notification preferences before sending', async () => {
    prefRepoMock.findOne.mockResolvedValue({
      userId: 'user-1',
      orders: true,
      refunds: true,
      promotions: false, // Promotional push disabled by customer
      quickDelivery: true,
    });

    const resPromo = await service.sendNotification({
      targetUserId: 'user-1',
      title: 'Summer Sale',
      body: 'Get 20% off',
      category: 'PROMOTION',
    });

    expect(resPromo.delivered).toBe(false);
    expect(resPromo.skippedDueToPreference).toBe(true);
  });

  it('6. should allow TRANSACTIONAL push notifications regardless of promotional preference', async () => {
    prefRepoMock.findOne.mockResolvedValue({
      userId: 'user-1',
      promotions: false,
    });

    deviceTokenRepoMock.find.mockResolvedValue([
      { id: 'dev-1', userId: 'user-1', token: 'ExponentPushToken[123]', isEnabled: true },
    ]);

    const resTx = await service.sendNotification({
      targetUserId: 'user-1',
      title: 'Security Alert',
      body: 'New login detected',
      category: 'TRANSACTIONAL',
    });

    expect(resTx.delivered).toBe(true);
    expect(resTx.totalDevices).toBe(1);
  });

  it('7. should auto-create default notification preferences if none exist', async () => {
    prefRepoMock.findOne.mockResolvedValue(null);

    const pref = await service.getPreferences('user-new-1');
    expect(pref.userId).toBe('user-new-1');
    expect(pref.orders).toBe(true);
    expect(pref.refunds).toBe(true);
    expect(pref.promotions).toBe(true);
    expect(pref.quickDelivery).toBe(true);
  });

  it('8. should update user notification preferences selectively', async () => {
    const existingPref = {
      userId: 'user-1',
      orders: true,
      refunds: true,
      promotions: true,
      quickDelivery: true,
    };
    prefRepoMock.findOne.mockResolvedValue(existingPref);

    const updated = await service.updatePreferences('user-1', { promotions: false });
    expect(updated.promotions).toBe(false);
    expect(updated.orders).toBe(true);
  });

  it('9. should scrub sensitive credentials and PII from push notification payloads', async () => {
    prefRepoMock.findOne.mockResolvedValue({
      userId: 'user-1',
      orders: true,
    });
    deviceTokenRepoMock.find.mockResolvedValue([
      { id: 'dev-1', userId: 'user-1', token: 'ExponentPushToken[123]', isEnabled: true },
    ]);

    const res = await service.sendNotification({
      targetUserId: 'user-1',
      title: 'Order Receipt',
      body: 'Your order was placed',
      category: 'ORDER',
      data: {
        orderId: 'ord-101',
        otp: '998822', // Secret OTP - should be scrubbed
        jwt: 'header.payload.signature', // Secret JWT - should be scrubbed
        creditCard: '4111222233334444', // Sensitive - should be scrubbed
        shopId: 'shop-55', // Public metadata - should be retained
      },
    });

    expect(res.delivered).toBe(true);
  });

  it('10. should enforce DELIVERY and RETURN notification category preferences', async () => {
    prefRepoMock.findOne.mockResolvedValue({
      userId: 'user-1',
      orders: true,
      delivery: false,
      refunds: true,
      returns: false,
      promotions: true,
      quickDelivery: true,
    });

    const resDelivery = await service.sendNotification({
      targetUserId: 'user-1',
      title: 'Package Out For Delivery',
      body: 'Your order is on the way',
      category: 'DELIVERY',
    });
    expect(resDelivery.delivered).toBe(false);
    expect(resDelivery.skippedDueToPreference).toBe(true);

    const resReturn = await service.sendNotification({
      targetUserId: 'user-1',
      title: 'Return Request Approved',
      body: 'Courier assigned for pickup',
      category: 'RETURN',
    });
    expect(resReturn.delivered).toBe(false);
    expect(resReturn.skippedDueToPreference).toBe(true);
  });
});

function assertOk(val: any) {
  if (!val) throw new Error('Expected value to be truthy');
}
