import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../api/client';
import { LoadingView, ErrorStateView } from '../../components/common/StateViews';

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data: any = await apiClient(`/orders/${id}/tracking`);
      setTrackingData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch shipment tracking details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  if (loading) {
    return <LoadingView message="Loading shipment tracking..." />;
  }

  if (error || !trackingData) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView
          title="Tracking Details Unavailable"
          message={error || 'Tracking details not found.'}
          onRetry={fetchTracking}
          retryLabel="Retry"
        />
      </SafeAreaView>
    );
  }

  const isFlado = trackingData.isFlado || trackingData.fulfillmentSource === 'FLADO_DARKSTORE';
  const events = trackingData.events || [];
  const currentStatus = trackingData.status || 'PROCESSING';
  const etaText = trackingData.estimatedDeliveryText || trackingData.etaText || 'Tracking live status';
  const rider = trackingData.rider;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Header Banner */}
        <View style={styles.statusCard}>
          <Text style={styles.surfaceLabel}>
            {isFlado ? '⚡ FLADO QUICK COMMERCE DELIVERY' : '🚚 AURAMART MARKETPLACE SHIPMENT'}
          </Text>
          <Text style={styles.etaText}>{etaText}</Text>
          <Text style={styles.statusBadgeText}>
            Status: <Text style={{ fontWeight: '800', color: isFlado ? '#059669' : '#6366F1' }}>{currentStatus.replace(/_/g, ' ')}</Text>
          </Text>
        </View>

        {/* Sanitized Rider Info (No PII leakage) */}
        {rider && (
          <View style={styles.riderCard}>
            <View style={styles.riderAvatar}>
              <Ionicons name="person" size={20} color="#4B5563" />
            </View>
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>{rider.name || 'Assigned Courier Partner'}</Text>
              <Text style={styles.riderSub}>Verification Code: {rider.deliveryOtp || 'Verified'}</Text>
            </View>
          </View>
        )}

        {/* Real Backend Tracking Events Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Authoritative Tracking Timeline</Text>

          {events.length === 0 ? (
            <Text style={styles.noEventsText}>No tracking events published yet.</Text>
          ) : (
            events.map((evt: any, idx: number) => {
              const isLast = idx === events.length - 1;
              const formattedTime = evt.timestamp
                ? new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                : 'Updated';

              return (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.indicatorCol}>
                    <View style={[styles.dot, isLast ? styles.dotActive : styles.dotPast]} />
                    {!isLast && <View style={styles.line} />}
                  </View>

                  <View style={styles.eventContent}>
                    <Text style={[styles.eventStatus, isLast && styles.eventStatusActive]}>
                      {(evt.status || evt.title || '').replace(/_/g, ' ')}
                    </Text>
                    {evt.description ? <Text style={styles.eventDesc}>{evt.description}</Text> : null}
                    <Text style={styles.eventTime}>{formattedTime}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Return to Orders Action */}
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => router.replace('/orders')}
          accessibilityRole="button"
          accessibilityLabel="Return to Order History"
        >
          <Text style={styles.returnBtnText}>Return to Order History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  surfaceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  etaText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginVertical: 8,
  },
  statusBadgeText: {
    fontSize: 13,
    color: '#374151',
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  riderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderDetails: {
    marginLeft: 10,
    flex: 1,
  },
  riderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  riderSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  noEventsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 10,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotActive: {
    backgroundColor: '#059669',
  },
  dotPast: {
    backgroundColor: '#D1D5DB',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  eventContent: {
    flex: 1,
  },
  eventStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  eventStatusActive: {
    fontWeight: '800',
    color: '#111827',
  },
  eventDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  eventTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  returnBtn: {
    height: 48,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
