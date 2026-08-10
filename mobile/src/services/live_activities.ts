export type LiveActivityState = 'ORDER_PLACED' | 'CONFIRMED' | 'PACKING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface LiveActivityPayload {
  activityId: string;
  orderId: string;
  state: LiveActivityState;
  title: string;
  subtitle: string;
  etaText: string;
  progressPercent: number;
  riderName?: string;
  updatedAt: string;
}

export class LiveActivityEngine {
  private activeActivities = new Map<string, LiveActivityPayload>();

  startLiveActivity(orderId: string, etaText = '10-15 mins'): LiveActivityPayload {
    const payload: LiveActivityPayload = {
      activityId: `live-${orderId}`,
      orderId,
      state: 'OUT_FOR_DELIVERY',
      title: 'Flado Express Delivery in Progress',
      subtitle: 'Rider is on the way to your delivery address',
      etaText,
      progressPercent: 75,
      riderName: 'Ramesh Kumar',
      updatedAt: new Date().toISOString(),
    };
    this.activeActivities.set(orderId, payload);
    return payload;
  }

  updateLiveActivity(orderId: string, state: LiveActivityState, progressPercent: number): LiveActivityPayload | null {
    const existing = this.activeActivities.get(orderId);
    if (!existing) return null;
    existing.state = state;
    existing.progressPercent = progressPercent;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  endLiveActivity(orderId: string): void {
    this.activeActivities.delete(orderId);
  }

  getActiveActivity(orderId: string): LiveActivityPayload | null {
    return this.activeActivities.get(orderId) || null;
  }
}

export const liveActivityEngine = new LiveActivityEngine();
