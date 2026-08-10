import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../api/client';
import { useAuthContext } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import { LoadingView, ErrorStateView, EmptyStateView } from '../../components/common/StateViews';

export default function AddressesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { selectSavedAddress, setGPSLocation, requestForegroundPermission } = useLocationContext();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addModal, setAddModal] = useState<boolean>(false);

  // Form states
  const [label, setLabel] = useState<string>('Home');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [line1, setLine1] = useState<string>('');
  const [line2, setLine2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [stateForm, setStateForm] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const data: any = await apiClient('/users/addresses');
      const list = Array.isArray(data) ? data : (data?.data || []);
      setAddresses(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch saved addresses');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient(`/users/addresses/${id}`, { method: 'DELETE' });
            fetchAddresses();
          } catch (err: any) {
            Alert.alert('Delete Failure', err?.message || 'Unable to delete address');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await apiClient(`/users/addresses/${id}/default`, { method: 'PATCH' });
      fetchAddresses();
    } catch (err: any) {
      Alert.alert('Update Error', err?.message || 'Failed to set default address');
    }
  };

  const handleUseCurrentGPS = async () => {
    const perm = await requestForegroundPermission();
    if (perm === 'GRANTED') {
      await setGPSLocation({ latitude: 12.9716, longitude: 77.5946, pincode: '560038' });
      Alert.alert('Location Selected', 'Your current device location was set for delivery & serviceability.');
      router.back();
    } else {
      Alert.alert('Permission Required', 'Location permission was denied. You can select or add a saved address manually.');
    }
  };

  const handleSave = async () => {
    if (!fullName || !phone || !line1 || !city || !stateForm || !pincode) {
      Alert.alert('Missing Fields', 'Please fill in all mandatory address fields.');
      return;
    }
    setSubmitting(true);
    try {
      await apiClient('/users/addresses', {
        method: 'POST',
        body: JSON.stringify({
          label,
          fullName,
          phone,
          addressLine1: line1,
          addressLine2: line2,
          city,
          state: stateForm,
          pincode,
          isDefault,
        }),
      });
      setAddModal(false);
      resetForm();
      fetchAddresses();
    } catch (err: any) {
      Alert.alert('Save Failure', err?.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setLabel('Home');
    setFullName('');
    setPhone('');
    setLine1('');
    setLine2('');
    setCity('');
    setStateForm('');
    setPincode('');
    setIsDefault(false);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <View style={{ width: 44 }} />
        </View>
        <EmptyStateView
          title="Login Required"
          message="Please log in to manage your saved delivery addresses."
          actionLabel="Log In"
          onAction={() => router.push('/auth')}
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return <LoadingView message="Loading saved addresses..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorStateView title="Addresses Unavailable" message={error} onRetry={fetchAddresses} retryLabel="Retry" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={() => setAddModal(true)} style={styles.addBtn} accessibilityRole="button" accessibilityLabel="Add new address">
          <Ionicons name="add" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Current GPS Option Button */}
      <TouchableOpacity style={styles.gpsBannerBtn} onPress={handleUseCurrentGPS} accessibilityRole="button" accessibilityLabel="Use current device location">
        <Ionicons name="navigate-circle" size={22} color="#059669" />
        <View style={styles.gpsTextCol}>
          <Text style={styles.gpsTitle}>Use Current Location</Text>
          <Text style={styles.gpsSub}>Enable device GPS for quick serviceability check</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {addresses.length === 0 ? (
        <EmptyStateView
          title="No Saved Addresses"
          message="Add your home or office address for fast delivery and serviceability checks."
          actionLabel="Add Address"
          onAction={() => setAddModal(true)}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                selectSavedAddress(item);
                router.back();
              }}
              accessibilityRole="button"
              accessibilityLabel={`Select saved address ${item.label || item.name}`}
            >
              <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                  <View style={styles.labelBadge}><Text style={styles.labelText}>{item.label || 'Home'}</Text></View>
                  {item.isDefault ? (
                    <View style={styles.defaultBadge}><Text style={styles.defaultText}>DEFAULT</Text></View>
                  ) : (
                    <TouchableOpacity onPress={() => handleSetDefault(item.id)}>
                      <Text style={styles.setDefaultText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} accessibilityRole="button" accessibilityLabel={`Delete address ${item.label || item.id}`}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>{item.fullName || item.name}</Text>
              <Text style={styles.addressLine}>{item.addressLine1 || item.line1}{item.addressLine2 ? `, ${item.addressLine2}` : ''}</Text>
              <Text style={styles.addressLine}>{item.city}, {item.state} - {item.pincode}</Text>
              <Text style={styles.phone}>Phone: {item.phone}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add Address Modal */}
      <Modal visible={addModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setAddModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <View style={styles.labelSelector}>
              {['Home', 'Work', 'Other'].map(lbl => (
                <TouchableOpacity
                  key={lbl}
                  style={[styles.labelOption, label === lbl && styles.labelOptionActive]}
                  onPress={() => setLabel(lbl)}
                >
                  <Text style={[styles.labelOptionText, label === lbl && styles.labelOptionTextActive]}>{lbl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Address Line 1" value={line1} onChangeText={setLine1} />
            <TextInput style={styles.input} placeholder="Address Line 2 (Optional)" value={line2} onChangeText={setLine2} />
            <View style={styles.row}>
              <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} placeholder="City" value={city} onChangeText={setCity} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="State" value={stateForm} onChangeText={setStateForm} />
            </View>
            <TextInput style={styles.input} placeholder="Pincode" keyboardType="numeric" value={pincode} onChangeText={setPincode} />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Set as Default Address</Text>
              <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ true: '#6366F1' }} />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={submitting}>
              {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Save Address</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  backBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  addBtn: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  gpsBannerBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5',
    margin: 16, marginBottom: 8, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0'
  },
  gpsTextCol: { flex: 1, marginLeft: 10 },
  gpsTitle: { fontSize: 14, fontWeight: '700', color: '#047857' },
  gpsSub: { fontSize: 11, color: '#059669', marginTop: 2 },
  listContainer: { padding: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  labelText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  defaultBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#C7D2FE' },
  defaultText: { fontSize: 11, fontWeight: '800', color: '#6366F1' },
  setDefaultText: { fontSize: 11, fontWeight: '700', color: '#6366F1' },
  name: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  addressLine: { fontSize: 13, color: '#4B5563', marginBottom: 2 },
  phone: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  labelSelector: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  labelOption: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  labelOptionActive: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  labelOptionText: { color: '#4B5563', fontWeight: '500' },
  labelOptionTextActive: { color: '#6366F1', fontWeight: '800' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 13 },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  switchLabel: { fontSize: 14, color: '#111827', fontWeight: '600' },
  submitBtn: { backgroundColor: '#6366F1', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 }
});
