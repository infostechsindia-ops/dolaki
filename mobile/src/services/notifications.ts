let Platform: any = { OS: 'web' };
try {
  Platform = require('react-native').Platform || { OS: 'web' };
} catch (e) {
  // Fallback in Node test context
}
import { apiClient } from '../api/client.ts';

export interface NotificationPayloadData {
  type?: 'product' | 'category' | 'order' | 'refund' | 'promotion' | 'brand' | 'support_ticket' | 'vip_pass' | 'quick_tracking';
  id?: string;
  url?: string;
  [key: string]: any;
}

export interface NotificationPreferences {
  orders: boolean;
  delivery?: boolean;
  refunds: boolean;
  returns?: boolean;
  promotions: boolean;
  quickDelivery: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  updatedAt?: string;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  let res: any;
  try {
    res = await apiClient('/users/notification-preferences', { method: 'GET' });
  } catch (e: any) {
    res = await apiClient('/notifications/preferences', { method: 'GET' });
  }
  return {
    orders: res?.orders ?? true,
    delivery: res?.delivery ?? true,
    refunds: res?.refunds ?? true,
    returns: res?.returns ?? true,
    promotions: res?.promotions ?? true,
    quickDelivery: res?.quickDelivery ?? true,
    quietHoursStart: res?.quietHoursStart ?? '22:00',
    quietHoursEnd: res?.quietHoursEnd ?? '07:00',
    soundEnabled: res?.soundEnabled ?? true,
    vibrationEnabled: res?.vibrationEnabled ?? true,
    updatedAt: res?.updatedAt,
  };
}

export async function updateNotificationPreferences(
  dto: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  let res: any;
  try {
    res = await apiClient('/users/notification-preferences', {
      method: 'PATCH',
      body: dto,
    });
  } catch (e: any) {
    res = await apiClient('/notifications/preferences', {
      method: 'PATCH',
      body: dto,
    });
  }
  return {
    orders: res?.orders ?? true,
    delivery: res?.delivery ?? true,
    refunds: res?.refunds ?? true,
    returns: res?.returns ?? true,
    promotions: res?.promotions ?? true,
    quickDelivery: res?.quickDelivery ?? true,
    updatedAt: res?.updatedAt,
  };
}

export async function registerPushToken(token: string, platform?: 'IOS' | 'ANDROID' | 'WEB') {
  if (!token) return null;
  const currentPlatform = platform || (Platform.OS === 'ios' ? 'IOS' : 'ANDROID');
  try {
    const res = await apiClient('/notifications/devices', {
      method: 'POST',
      body: {
        token,
        platform: currentPlatform,
      },
    });
    return res;
  } catch (err: any) {
    console.error('Failed to register push token with backend:', err?.message);
    return null;
  }
}

export async function unregisterPushToken(token: string) {
  if (!token) return true;
  try {
    await apiClient(`/notifications/devices/${encodeURIComponent(token)}`, {
      method: 'DELETE',
    });
    return true;
  } catch (err: any) {
    console.error('Failed to unregister push token:', err?.message);
    return false;
  }
}

// Untrusted Deep-Link Sanitizer & Whitelisted Router Handler (CMD-069)
export function handleDeepLink(
  data: NotificationPayloadData,
  router?: { push: (path: string) => void }
) {
  if (!data || typeof data !== 'object') {
    console.warn('Rejected malformed push payload:', data);
    return false;
  }

  const { type, id } = data;

  // Enforce required ID validation and whitelisted types
  if (!type || !id || typeof id !== 'string' || id.trim() === '') {
    console.warn('Rejected untrusted push deep-link payload without valid type or string ID:', data);
    return false;
  }

  const sanitizedId = encodeURIComponent(id.trim());
  let targetPath: string | null = null;

  switch (type) {
    case 'product':
      targetPath = `/products/${sanitizedId}`;
      break;
    case 'category':
      targetPath = `/products?category=${sanitizedId}`;
      break;
    case 'order':
    case 'refund':
      targetPath = `/orders/${sanitizedId}`;
      break;
    case 'promotion':
      targetPath = `/products?campaign=${sanitizedId}`;
      break;
    case 'brand':
      targetPath = `/brands/${sanitizedId}`;
      break;
    case 'support_ticket':
      targetPath = `/account/support/${sanitizedId}`;
      break;
    case 'vip_pass':
      targetPath = `/flado/vip`;
      break;
    case 'quick_tracking':
      targetPath = `/tracking/${sanitizedId}`;
      break;
    default:
      console.warn(`Unrecognized or non-whitelisted deep-link type "${type}". Navigation blocked.`);
      return false;
  }

  if (targetPath) {
    if (router && typeof router.push === 'function') {
      router.push(targetPath);
      return true;
    }
    return targetPath;
  }

  return false;
}
