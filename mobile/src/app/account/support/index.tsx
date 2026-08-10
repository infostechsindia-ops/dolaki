import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils/api';

type SupportTicket = {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  status: string;
  priority: string;
  updatedAt: string;
};

export default function SupportListScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const token = await AsyncStorage.getItem('aura_token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const res = await fetch(`${BASE_URL}/support/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTickets(data.items || []);
        setError(null);
      } else {
        setError(`Failed to load tickets (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return { bg: '#E0F2FE', text: '#0369A1' };
      case 'IN_PROGRESS':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'WAITING_FOR_CUSTOMER':
        return { bg: '#F3E8FF', text: '#6B21A8' };
      case 'RESOLVED':
        return { bg: '#D1FAE5', text: '#047857' };
      case 'CLOSED':
        return { bg: '#F3F4F6', text: '#374151' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Support</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/account/support/new')}>
          <Ionicons name="add-circle" size={26} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchTickets}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={56} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No support tickets</Text>
          <Text style={styles.emptySubtitle}>Have a question or issue with an order? Submit a new ticket below.</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/account/support/new')}>
            <Text style={styles.createBtnText}>Create New Ticket</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {tickets.map((t) => {
            const statusStyle = getStatusColor(t.status);
            return (
              <TouchableOpacity
                key={t.id}
                style={styles.ticketCard}
                onPress={() => router.push(`/account/support/${t.id}`)}
              >
                <View style={styles.ticketTopRow}>
                  <Text style={styles.ticketNumber}>{t.ticketNumber}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>{t.status}</Text>
                  </View>
                </View>
                <Text style={styles.subjectText} numberOfLines={2}>
                  {t.subject}
                </Text>
                <View style={styles.ticketBottomRow}>
                  <Text style={styles.categoryText}>{t.category}</Text>
                  <Text style={styles.dateText}>{new Date(t.updatedAt).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
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
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  addBtn: {
    padding: 8,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  createBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  ticketBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
