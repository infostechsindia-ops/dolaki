import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);

  // Form states
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateForm, setStateForm] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('aura_token');
      const res = await fetch('http://localhost:3000/users/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(await res.json());
      } else {
        mockAddresses();
      }
    } catch (e) {
      mockAddresses();
    } finally {
      setLoading(false);
    }
  };

  const mockAddresses = () => {
    setAddresses([
      { id: '1', label: 'Home', fullName: 'Arif Al Nukhbah', phone: '9876543210', line1: '123 Main St', line2: 'Apt 4B', city: 'Springfield', state: 'IL', pincode: '123456', isDefault: true },
      { id: '2', label: 'Work', fullName: 'Arif Al Nukhbah', phone: '9876543210', line1: '456 Business Park', city: 'Metropolis', state: 'NY', pincode: '654321', isDefault: false }
    ]);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('aura_token');
            await fetch(`http://localhost:3000/users/addresses/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });
            fetchAddresses();
          } catch (e) {
            setAddresses(prev => prev.filter(a => a.id !== id));
          }
        }
      }
    ]);
  };

  const handleSave = async () => {
    if (!fullName || !phone || !line1 || !city || !stateForm || !pincode) {
      Alert.alert('Error', 'Please fill in all mandatory fields');
      return;
    }
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('aura_token');
      const payload = { label, fullName, phone, line1, line2, city, state: stateForm, pincode, isDefault };
      await fetch('http://localhost:3000/users/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      setAddModal(false);
      resetForm();
      fetchAddresses();
    } catch (e) {
      // Mock save
      setAddresses(prev => [...prev, { id: Date.now().toString(), label, fullName, phone, line1, line2, city, state: stateForm, pincode, isDefault }]);
      setAddModal(false);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setLabel('Home'); setFullName(''); setPhone(''); setLine1(''); setLine2(''); setCity(''); setStateForm(''); setPincode(''); setIsDefault(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={() => setAddModal(true)} style={styles.addBtn}>
          <Ionicons name="add" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No saved addresses</Text>
        </View>
      ) : (
        <FlatList 
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.labelRow}>
                  <View style={styles.labelBadge}><Text style={styles.labelText}>{item.label}</Text></View>
                  {item.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultText}>DEFAULT</Text></View>}
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.addressLine}>{item.line1}{item.line2 ? `, ${item.line2}` : ''}</Text>
              <Text style={styles.addressLine}>{item.city}, {item.state} - {item.pincode}</Text>
              <Text style={styles.phone}>Phone: {item.phone}</Text>
            </View>
          )}
        />
      )}

      {/* Add Modal */}
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
              <Text style={styles.switchLabel}>Set as Default</Text>
              <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ true: '#10B981' }} />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB', justifyContent: 'space-between'
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', flex: 1, marginLeft: 12 },
  addBtn: { padding: 4 },
  list: { padding: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 16, color: '#6B7280', marginTop: 12 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  labelRow: { flexDirection: 'row', gap: 8 },
  labelBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  labelText: { fontSize: 12, fontWeight: 'bold', color: '#4B5563' },
  defaultBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#10B981' },
  defaultText: { fontSize: 12, fontWeight: 'bold', color: '#10B981' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  addressLine: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  phone: { fontSize: 14, color: '#4B5563', marginTop: 4, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  labelSelector: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  labelOption: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  labelOptionActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  labelOptionText: { color: '#4B5563', fontWeight: '500' },
  labelOptionTextActive: { color: '#10B981', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  switchLabel: { fontSize: 16, color: '#1F2937' },
  submitBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
