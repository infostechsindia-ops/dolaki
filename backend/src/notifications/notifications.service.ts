import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken, NotificationPreference } from '../database/entities';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-preferences.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepo: Repository<DeviceToken>,
    @InjectRepository(NotificationPreference)
    private readonly prefRepo: Repository<NotificationPreference>,
  ) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto): Promise<DeviceToken> {
    let existing = await this.deviceTokenRepo.findOne({ where: { token: dto.token } });

    if (existing) {
      existing.userId = userId;
      existing.platform = dto.platform;
      existing.deviceId = dto.deviceId;
      existing.isEnabled = true;
      return this.deviceTokenRepo.save(existing);
    }

    const device = this.deviceTokenRepo.create({
      userId,
      token: dto.token,
      platform: dto.platform,
      deviceId: dto.deviceId,
      isEnabled: true,
    });
    return this.deviceTokenRepo.save(device);
  }

  async unregisterDevice(userId: string, token: string): Promise<{ success: boolean }> {
    const existing = await this.deviceTokenRepo.findOne({ where: { token } });
    if (!existing) {
      return { success: true };
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Cannot unregister a device token belonging to another user');
    }
    existing.isEnabled = false;
    await this.deviceTokenRepo.save(existing);
    return { success: true };
  }

  async getPreferences(userId: string): Promise<NotificationPreference> {
    let pref = await this.prefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepo.create({
        userId,
        orders: true,
        delivery: true,
        refunds: true,
        returns: true,
        promotions: true,
        quickDelivery: true,
      });
      await this.prefRepo.save(pref);
    }
    return pref;
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto): Promise<NotificationPreference> {
    let pref = await this.getPreferences(userId);
    Object.assign(pref, dto);
    return this.prefRepo.save(pref);
  }

  private sanitizePayload(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data || typeof data !== 'object') return undefined;
    const forbiddenPatterns = /otp|jwt|password|secret|creditcard|cvv|ssn/i;
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (forbiddenPatterns.test(key)) {
        continue; // Strip secrets and auth credentials from push payload
      }
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizePayload(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  async sendNotification(dto: SendNotificationDto): Promise<{ delivered: boolean; totalDevices: number; skippedDueToPreference: boolean }> {
    const pref = await this.getPreferences(dto.targetUserId);

    // Enforce backend preference checks unless category is TRANSACTIONAL
    let isAllowed = true;
    if (dto.category === 'TRANSACTIONAL') {
      // TRANSACTIONAL category (Security, OTP, Receipt) ALWAYS bypasses preferences
      isAllowed = true;
    } else if (dto.category === 'ORDER' && !pref.orders) {
      isAllowed = false;
    } else if (dto.category === 'DELIVERY' && !pref.delivery) {
      isAllowed = false;
    } else if (dto.category === 'REFUND' && !pref.refunds) {
      isAllowed = false;
    } else if (dto.category === 'RETURN' && !pref.returns) {
      isAllowed = false;
    } else if (dto.category === 'PROMOTION' && !pref.promotions) {
      isAllowed = false;
    } else if (dto.category === 'QUICK_DELIVERY' && !pref.quickDelivery) {
      isAllowed = false;
    }

    if (!isAllowed) {
      return { delivered: false, totalDevices: 0, skippedDueToPreference: true };
    }

    const devices = await this.deviceTokenRepo.find({
      where: { userId: dto.targetUserId, isEnabled: true },
    });

    if (devices.length === 0) {
      return { delivered: false, totalDevices: 0, skippedDueToPreference: false };
    }

    // Scrub payload data of secrets and credentials
    const safeData = this.sanitizePayload(dto.data);

    // In dev/test adapter mode, log and simulate clean dispatch contract
    console.log(`[PUSH DISPATCH] Sent "${dto.title}" [category: ${dto.category}] to user ${dto.targetUserId} across ${devices.length} devices.`);
    if (safeData) {
      console.log(`[PUSH PAYLOAD DATA]`, JSON.stringify(safeData));
    }

    return { delivered: true, totalDevices: devices.length, skippedDueToPreference: false };
  }

  // ─── CMD-093 Quick-Commerce Merchant Operational Push Notifications ───────────

  // Bounded TTL Deduplication Map (Production requirement: Use Redis / DB table for multi-instance clusters)
  private sentMerchantAlertMap = new Map<string, number>();
  private readonly DEDUPE_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour deduplication window

  async sendMerchantOperationalNotification(dto: {
    targetUserId: string;
    shopId: string;
    eventType: 'NEW_QUICK_ORDER' | 'SLA_BREACH_WARNING' | 'PICKING_ASSIGNMENT' | 'UNRESOLVED_OOS_ATTENTION' | 'RIDER_HANDOFF_READY';
    orderId: string;
    orderNumber: string;
    title: string;
    body: string;
    idempotencyKey?: string;
  }): Promise<{ delivered: boolean; skippedDueToDeduplication: boolean }> {
    const dedupeKey = dto.idempotencyKey || `${dto.eventType}_${dto.orderId}`;
    const now = Date.now();

    // Clean up expired entries if map exceeds 5,000 keys
    if (this.sentMerchantAlertMap.size > 5000) {
      for (const [k, timestamp] of this.sentMerchantAlertMap.entries()) {
        if (now - timestamp > this.DEDUPE_TTL_MS) {
          this.sentMerchantAlertMap.delete(k);
        }
      }
    }

    if (this.sentMerchantAlertMap.has(dedupeKey)) {
      const lastSent = this.sentMerchantAlertMap.get(dedupeKey)!;
      if (now - lastSent < this.DEDUPE_TTL_MS) {
        return { delivered: false, skippedDueToDeduplication: true };
      }
    }
    this.sentMerchantAlertMap.set(dedupeKey, now);

    // Enforce PII & Secret Exclusion in Payload (No OTPs, JWTs, or rider/customer phone numbers)
    const payload = {
      eventType: dto.eventType,
      orderId: dto.orderId,
      orderNumber: dto.orderNumber,
      shopId: dto.shopId,
      deepLink: `flado/vendor?shopId=${dto.shopId}&orderId=${dto.orderId}`,
    };

    const res = await this.sendNotification({
      targetUserId: dto.targetUserId,
      title: dto.title,
      body: dto.body,
      category: 'QUICK_DELIVERY',
      data: payload,
    });

    return { delivered: res.delivered, skippedDueToDeduplication: false };
  }

  clearDeduplicationCache(): void {
    this.sentMerchantAlertMap.clear();
  }
}
