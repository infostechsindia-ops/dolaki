import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfflineContextType {
  isOffline: boolean;
  isReconnecting: boolean;
  lastOnlineTimestamp: number | null;
  setOfflineState: (offline: boolean) => void;
  registerReconnectCallback: (id: string, cb: () => void) => () => void;
  triggerReconnect: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [lastOnlineTimestamp, setLastOnlineTimestamp] = useState<number | null>(Date.now());

  const callbacksRef = useRef<Map<string, () => void>>(new Map());
  const lastReconnectTriggerRef = useRef<number>(0);

  const setOfflineState = useCallback((offline: boolean) => {
    setIsOffline((prev) => {
      if (prev && !offline) {
        // Transitioning from offline to online: trigger reconnection revalidation
        triggerReconnect();
        setLastOnlineTimestamp(Date.now());
      }
      return offline;
    });
  }, []);

  const registerReconnectCallback = useCallback((id: string, cb: () => void) => {
    callbacksRef.current.set(id, cb);
    return () => {
      callbacksRef.current.delete(id);
    };
  }, []);

  const triggerReconnect = useCallback(() => {
    const now = Date.now();
    // Storm prevention guard: skip duplicate reconnect triggers within 2 seconds
    if (now - lastReconnectTriggerRef.current < 2000) {
      return;
    }
    lastReconnectTriggerRef.current = now;

    setIsReconnecting(true);
    console.log('[NETWORK RECONNECT] Connection restored. Revalidating authoritative stale content...');

    callbacksRef.current.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Reconnect callback error:', e);
      }
    });

    setTimeout(() => {
      setIsReconnecting(false);
    }, 1500);
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        isReconnecting,
        lastOnlineTimestamp,
        setOfflineState,
        registerReconnectCallback,
        triggerReconnect,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOfflineContext = () => {
  const ctx = useContext(OfflineContext);
  if (!ctx) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return ctx;
};

// Reusable Offline Banner Component (CMD-071)
export const OfflineBanner: React.FC = () => {
  const { isOffline, isReconnecting, triggerReconnect } = useOfflineContext();

  if (!isOffline && !isReconnecting) return null;

  return (
    <View style={[styles.banner, isOffline ? styles.offlineBanner : styles.reconnectBanner]}>
      <Ionicons
        name={isOffline ? 'cloud-offline-outline' : 'refresh-circle-outline'}
        size={18}
        color="#FFFFFF"
      />
      <Text style={styles.bannerText}>
        {isOffline
          ? 'You are offline. Showing cached content where available.'
          : 'Connection restored. Refreshing live data...'}
      </Text>

      {isOffline && (
        <TouchableOpacity style={styles.retryBtn} onPress={triggerReconnect}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Reusable Stale Content Indicator Component (CMD-071)
export const StaleBadge: React.FC<{ cachedAt?: number }> = ({ cachedAt }) => {
  const { isOffline } = useOfflineContext();

  if (!isOffline && !cachedAt) return null;

  const timeAgoText = cachedAt
    ? `Cached ${Math.round((Date.now() - cachedAt) / 1000)}s ago`
    : 'Stale / Offline Content';

  return (
    <View style={styles.staleBadge}>
      <Ionicons name="time-outline" size={12} color="#B45309" />
      <Text style={styles.staleText}>{timeAgoText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  offlineBanner: {
    backgroundColor: '#DC2626',
  },
  reconnectBanner: {
    backgroundColor: '#059669',
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  staleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginVertical: 6,
    gap: 4,
  },
  staleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
});
