export interface OfflineCacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
}

export class OfflineManager {
  private cache = new Map<string, OfflineCacheEntry<any>>();
  private isOnlineStatus = true;

  setOnlineStatus(online: boolean): void {
    this.isOnlineStatus = online;
  }

  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const offlineManager = new OfflineManager();
