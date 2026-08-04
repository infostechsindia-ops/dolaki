import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  eta: string;
  status: 'Open' | 'Closed';
  riders: number;
}

const mockStores: Store[] = [
  { id: 'ds-1', name: 'Flado Darkstore Bandra West', address: 'Plot 42, Waterfield Road, Bandra West', city: 'Mumbai', eta: '8-12 mins', status: 'Open', riders: 18 },
  { id: 'ds-2', name: 'Flado Darkstore Khar Link', address: 'Level 1, Pearl Residency, Khar Link Road', city: 'Mumbai', eta: '10-15 mins', status: 'Open', riders: 12 },
  { id: 'ds-3', name: 'Flado Darkstore Nariman Point', address: 'Express Towers basement, Nariman Point', city: 'Mumbai', eta: '6-9 mins', status: 'Open', riders: 24 },
  { id: 'ds-4', name: 'Flado Darkstore Juhu Scheme', address: 'Ground Floor, Tulip Enclave, Juhu Tara Road', city: 'Mumbai', eta: '12-18 mins', status: 'Open', riders: 9 }
];

export default function MobileStoresScreen() {
  const router = useRouter();

  const handleSelectStore = (storeName: string) => {
    Alert.alert(
      'Fulfillment Hub Set',
      `🎉 '${storeName}' set as your primary shipping darkstore hub for quick commerce.`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏪 Micro Darkstore Hubs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>Fulfillment Hubs near Mumbai</Text>
          <Text style={styles.introSubtitle}>
            Our darkstore hubs are strategically placed across Mumbai key centers to enable speedy deliveries under 10-minutes.
          </Text>
        </View>

        <View style={styles.storesList}>
          {mockStores.map(store => (
            <TouchableOpacity 
              key={store.id} 
              style={styles.storeCard}
              onPress={() => handleSelectStore(store.name)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.nameRow}>
                  <Ionicons name="location-sharp" size={16} color="#059669" />
                  <Text style={styles.storeName}>{store.name}</Text>
                </View>
                <View style={[styles.statusBadge, store.status === 'Open' ? styles.statusOpen : styles.statusClosed]}>
                  <Text style={[styles.statusText, store.status === 'Open' ? { color: '#065F46' } : { color: '#991B1B' }]}>
                    {store.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.storeAddress}>{store.address}</Text>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={13} color="#6B7280" />
                  <Text style={styles.metaText}>ETA: {store.eta}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={13} color="#6B7280" />
                  <Text style={styles.metaText}>{store.riders} Riders active</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introBox: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
  },
  introSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    marginTop: 4,
    fontWeight: '600',
  },
  storesList: {
    padding: 16,
    gap: 12,
  },
  storeCard: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusOpen: {
    backgroundColor: '#D1FAE5',
  },
  statusClosed: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 8.5,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  storeAddress: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  }
});
