import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  NotificationPreferences,
} from '../../services/notifications';
import { useOfflineContext } from '../../context/OfflineContext';

let NotificationsModule: any = null;
try {
  NotificationsModule = require('expo-notifications');
} catch (e) {
  // Safe fallback in non-Expo or simulator environment
}

export type NativePermissionStatus = 'GRANTED' | 'DENIED' | 'UNDETERMINED';

export default function NotificationSettingsScreen() {
  const router = useRouter();

  let isOffline = false;
  let registerReconnectCallback: any = null;
  try {
    const offlineCtx = useOfflineContext();
    isOffline = offlineCtx.isOffline;
    registerReconnectCallback = offlineCtx.registerReconnectCallback;
  } catch (e) {
    // In contexts where OfflineProvider is absent (e.g., unit test fixtures)
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [nativePermission, setNativePermission] = useState<NativePermissionStatus>('UNDETERMINED');

  const [prefs, setPrefs] = useState<NotificationPreferences>({
    orders: true,
    delivery: true,
    refunds: true,
    returns: true,
    promotions: true,
    quickDelivery: true,
  });

  // Check OS notification permission status
  const checkNativePermission = useCallback(async () => {
    try {
      if (Platform.OS === 'web' || !NotificationsModule?.getPermissionsAsync) {
        setNativePermission('GRANTED');
        return;
      }
      const settings = await NotificationsModule.getPermissionsAsync();
      if (settings.granted || settings.status === 'granted') {
        setNativePermission('GRANTED');
      } else if (settings.status === 'denied') {
        setNativePermission('DENIED');
      } else {
        setNativePermission('UNDETERMINED');
      }
    } catch (e) {
      // In simulator or unconfigured environment, default to GRANTED gracefully
      setNativePermission('GRANTED');
    }
  }, []);

  // Request native OS notification permission
  const requestNativePermission = async () => {
    try {
      if (!NotificationsModule?.requestPermissionsAsync) {
        setNativePermission('GRANTED');
        return;
      }
      const res = await NotificationsModule.requestPermissionsAsync();
      if (res.granted || res.status === 'granted') {
        setNativePermission('GRANTED');
      } else {
        setNativePermission('DENIED');
      }
    } catch (e) {
      setNativePermission('DENIED');
    }
  };

  // Open native system settings
  const openSystemSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Load server-authoritative notification preferences
  const loadPreferences = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getNotificationPreferences();
      setPrefs(data);
    } catch (err: any) {
      setErrorMsg('Failed to load notification preferences. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkNativePermission();
    loadPreferences();

    if (registerReconnectCallback) {
      const unregister = registerReconnectCallback('notification_settings', () => {
        loadPreferences();
      });
      return unregister;
    }
  }, [checkNativePermission, loadPreferences, registerReconnectCallback]);

  // Handle preference toggle mutation with fast-fail offline protection
  const handleToggle = async (key: keyof NotificationPreferences, newValue: boolean) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isOffline) {
      setErrorMsg('Notification settings cannot be changed while offline. Please reconnect and try again.');
      return;
    }

    // Store previous value for rollback on error
    const previousValue = prefs[key];

    // Optimistic UI update
    setPrefs((prev) => ({ ...prev, [key]: newValue }));
    setSavingKey(key);

    try {
      const updated = await updateNotificationPreferences({ [key]: newValue });
      setPrefs(updated);
      setSuccessMsg('Notification preferences saved');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      // Revert to authoritative server value on failure (e.g. offline)
      setPrefs((prev) => ({ ...prev, [key]: previousValue }));
      setErrorMsg('Failed to save settings. Connection offline or server error.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Push Notification Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Alert for OS Permission Denied */}
        {nativePermission === 'DENIED' && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={22} color="#D97706" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>Device Notifications Disabled</Text>
              <Text style={styles.warningText}>
                Notifications are turned off in your phone's Operating System settings. App preferences cannot override system settings.
              </Text>
              <TouchableOpacity style={styles.settingsBtn} onPress={openSystemSettings}>
                <Text style={styles.settingsBtnText}>Open System Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Banner Alert for Permission Undetermined */}
        {nativePermission === 'UNDETERMINED' && (
          <View style={styles.infoBanner}>
            <Ionicons name="notifications-outline" size={22} color="#2563EB" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Enable Push Notifications</Text>
              <Text style={styles.infoText}>
                Allow notifications to receive real-time order tracking and delivery alerts.
              </Text>
              <TouchableOpacity style={styles.allowBtn} onPress={requestNativePermission}>
                <Text style={styles.allowBtnText}>Allow Notifications</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Error / Success Feedback Banners */}
        {errorMsg && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        {successMsg && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Loading notification preferences...</Text>
          </View>
        ) : (
          <>
            {/* Section 1: Customer Activity Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Activity & Tracking Notifications</Text>
              <Text style={styles.sectionSubtext}>
                Choose which types of alerts you'd like to receive on your mobile device.
              </Text>

              {/* Toggle 1: Order Updates */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <Ionicons name="bag-handle-outline" size={22} color="#4F46E5" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Order Status Updates</Text>
                  <Text style={styles.toggleDescription}>
                    Order confirmation, dispatch, picking progress, and status alerts.
                  </Text>
                </View>
                {savingKey === 'orders' ? (
                  <ActivityIndicator size="small" color="#4F46E5" />
                ) : (
                  <Switch
                    value={prefs.orders}
                    onValueChange={(val) => handleToggle('orders', val)}
                    trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
                    thumbColor={prefs.orders ? '#4F46E5' : '#F3F4F6'}
                  />
                )}
              </View>

              {/* Toggle 2: Delivery Updates */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <Ionicons name="car-outline" size={22} color="#2563EB" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Delivery & Shipment Updates</Text>
                  <Text style={styles.toggleDescription}>
                    Out for delivery notifications, courier dispatch, and estimated arrival updates.
                  </Text>
                </View>
                {savingKey === 'delivery' ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <Switch
                    value={prefs.delivery ?? true}
                    onValueChange={(val) => handleToggle('delivery', val)}
                    trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                    thumbColor={prefs.delivery ? '#2563EB' : '#F3F4F6'}
                  />
                )}
              </View>

              {/* Toggle 3: Quick Delivery & Rider Tracking */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <MaterialCommunityIcons name="lightning-bolt-outline" size={22} color="#D97706" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Flado Quick-Commerce Alerts</Text>
                  <Text style={styles.toggleDescription}>
                    Live rider location, ETA updates, and store operational alerts.
                  </Text>
                </View>
                {savingKey === 'quickDelivery' ? (
                  <ActivityIndicator size="small" color="#D97706" />
                ) : (
                  <Switch
                    value={prefs.quickDelivery}
                    onValueChange={(val) => handleToggle('quickDelivery', val)}
                    trackColor={{ false: '#D1D5DB', true: '#FCD34D' }}
                    thumbColor={prefs.quickDelivery ? '#D97706' : '#F3F4F6'}
                  />
                )}
              </View>

              {/* Toggle 4: Refunds & Payments */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <Ionicons name="card-outline" size={22} color="#059669" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Refunds & Payment Alerts</Text>
                  <Text style={styles.toggleDescription}>
                    Refund approvals, payout receipts, and payment status changes.
                  </Text>
                </View>
                {savingKey === 'refunds' ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : (
                  <Switch
                    value={prefs.refunds}
                    onValueChange={(val) => handleToggle('refunds', val)}
                    trackColor={{ false: '#D1D5DB', true: '#6EE7B7' }}
                    thumbColor={prefs.refunds ? '#059669' : '#F3F4F6'}
                  />
                )}
              </View>

              {/* Toggle 5: Returns & Exchanges */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <Ionicons name="refresh-circle-outline" size={22} color="#7C3AED" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Returns & Exchanges</Text>
                  <Text style={styles.toggleDescription}>
                    Return request status, item pickup verification, and replacement tracking.
                  </Text>
                </View>
                {savingKey === 'returns' ? (
                  <ActivityIndicator size="small" color="#7C3AED" />
                ) : (
                  <Switch
                    value={prefs.returns ?? true}
                    onValueChange={(val) => handleToggle('returns', val)}
                    trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                    thumbColor={prefs.returns ? '#7C3AED' : '#F3F4F6'}
                  />
                )}
              </View>
            </View>

            {/* Section 2: Marketing & Promotions */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Marketing & Offers</Text>
              
              {/* Toggle 4: Promotions */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleIconContainer}>
                  <Ionicons name="pricetag-outline" size={22} color="#EC4899" />
                </View>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Promotions & Special Offers</Text>
                  <Text style={styles.toggleDescription}>
                    Exclusive discounts, sales alerts, coupon codes, and deal drops.
                  </Text>
                </View>
                {savingKey === 'promotions' ? (
                  <ActivityIndicator size="small" color="#EC4899" />
                ) : (
                  <Switch
                    value={prefs.promotions}
                    onValueChange={(val) => handleToggle('promotions', val)}
                    trackColor={{ false: '#D1D5DB', true: '#F472B6' }}
                    thumbColor={prefs.promotions ? '#EC4899' : '#F3F4F6'}
                  />
                )}
              </View>
            </View>

            {/* Section 3: Read-Only Mandatory Security & Transactional Policy */}
            <View style={styles.readOnlyCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="shield-checkmark" size={20} color="#047857" style={{ marginRight: 8 }} />
                <Text style={styles.readOnlyTitle}>Transactional & Security Alerts</Text>
              </View>
              <Text style={styles.readOnlyText}>
                Critical security alerts, account verification OTPs, and legal order receipt confirmations are always sent to ensure your account security and cannot be disabled.
              </Text>
            </View>

            {/* External Production Note */}
            <View style={styles.footerNote}>
              <Text style={styles.footerNoteText}>
                PRODUCTION PUSH DELIVERY: EXTERNAL CONFIGURATION REQUIRED (FCM/Expo credentials).
              </Text>
            </View>
          </>
        )}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
  },
  settingsBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  settingsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1D4ED8',
    lineHeight: 18,
  },
  allowBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  readOnlyCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  readOnlyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  readOnlyText: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },
  footerNote: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
});
