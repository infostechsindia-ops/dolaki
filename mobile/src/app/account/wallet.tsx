import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
};

export default function WalletScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock transactions since API may not have history
  const [transactions] = useState<Transaction[]>([
    { id: 'tx-1', title: 'Cashback from Order #ORD-123', date: '2026-07-20 15:30', amount: 50, type: 'CREDIT' },
    { id: 'tx-2', title: 'Used in Order #ORD-121', date: '2026-07-18 10:15', amount: 120, type: 'DEBIT' },
    { id: 'tx-3', title: 'Added Money', date: '2026-07-15 09:00', amount: 500, type: 'CREDIT' },
    { id: 'tx-4', title: 'Coins Converted', date: '2026-07-10 14:20', amount: 25, type: 'CREDIT' },
    { id: 'tx-5', title: 'Used in Order #ORD-089', date: '2026-07-01 18:45', amount: 300, type: 'DEBIT' },
  ]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = await AsyncStorage.getItem('aura_token');
        const res = await fetch('http://localhost:3000/users/wallet', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance || 450);
          setCoins(data.coins || 1280);
        } else {
          setBalance(450); setCoins(1280);
        }
      } catch (e) {
        setBalance(450); setCoins(1280);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleAddMoney = () => {
    Alert.alert('Coming Soon', 'Add money feature will be available shortly.');
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
        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balances */}
        <View style={styles.cardsContainer}>
          <View style={styles.walletCard}>
            <View style={styles.cardIconRow}>
              <Ionicons name="wallet-outline" size={20} color="#10B981" />
              <Text style={styles.cardLabel}>Wallet Balance</Text>
            </View>
            <Text style={styles.cardValue}>₹{balance}</Text>
            <TouchableOpacity style={styles.addMoneyBtn} onPress={handleAddMoney}>
              <Text style={styles.addMoneyBtnText}>+ Add Money</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.coinCard}>
            <View style={styles.cardIconRow}>
              <Ionicons name="star-outline" size={20} color="#D97706" />
              <Text style={styles.cardLabelCoin}>AuraCoins</Text>
            </View>
            <Text style={styles.cardValueCoin}>{coins}</Text>
            <View style={styles.coinFooter}>
              <Text style={styles.coinNote}>Equals ₹{(coins / 10).toFixed(0)}</Text>
              <TouchableOpacity style={styles.redeemBtn} onPress={() => Alert.alert('Redeem', 'Coins are automatically applied at checkout.')}>
                <Text style={styles.redeemBtnText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.txList}>
          {transactions.map(tx => (
            <View key={tx.id} style={styles.txItem}>
              <View style={styles.txIconBox}>
                <Ionicons 
                  name={tx.type === 'CREDIT' ? 'arrow-down' : 'arrow-up'} 
                  size={16} 
                  color={tx.type === 'CREDIT' ? '#10B981' : '#EF4444'} 
                />
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'CREDIT' ? '#10B981' : '#1F2937' }]}>
                {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  backBtn: { padding: 4, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  content: { padding: 16 },
  cardsContainer: { gap: 16, marginBottom: 24 },
  walletCard: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#A7F3D0' },
  coinCard: { backgroundColor: '#FEF3C7', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#FDE68A' },
  cardIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardLabel: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#059669' },
  cardLabelCoin: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#B45309' },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#065F46', marginBottom: 16 },
  cardValueCoin: { fontSize: 32, fontWeight: 'bold', color: '#92400E', marginBottom: 16 },
  addMoneyBtn: { backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  addMoneyBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  coinFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coinNote: { fontSize: 14, color: '#92400E', fontWeight: '500' },
  redeemBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  redeemBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  txList: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  txIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txDetails: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '500', color: '#1F2937', marginBottom: 4 },
  txDate: { fontSize: 12, color: '#6B7280' },
  txAmount: { fontSize: 16, fontWeight: 'bold' }
});
