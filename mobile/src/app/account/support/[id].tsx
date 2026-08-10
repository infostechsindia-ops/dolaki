import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../utils/api';

type TicketMessage = {
  id: string;
  senderUserId: string;
  senderName?: string;
  senderRole: string;
  message: string;
  createdAt: string;
};

type TicketDetail = {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  assignedAgentName?: string;
  createdAt: string;
};

export default function SupportTicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicketDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('aura_token');
      if (!token) {
        router.push('/auth');
        return;
      }

      const res = await fetch(`${BASE_URL}/support/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTicket(data.ticket);
        setMessages(data.messages || []);
        setError(null);
      } else {
        setError(`Failed to load ticket details (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading support ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTicketDetail();
  }, [id]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const token = await AsyncStorage.getItem('aura_token');
      if (!token) return;

      const res = await fetch(`${BASE_URL}/support/tickets/${id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      if (res.ok) {
        setReplyText('');
        await fetchTicketDetail();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Failed to submit reply');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to post reply.');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {ticket?.ticketNumber || 'Ticket Details'}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : error || !ticket ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Ticket not found.'}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.content}>
            {/* Ticket Summary Header */}
            <View style={styles.summaryCard}>
              <View style={styles.statusRow}>
                <Text style={styles.categoryBadge}>{ticket.category}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{ticket.status}</Text>
                </View>
              </View>
              <Text style={styles.subjectText}>{ticket.subject}</Text>
              {ticket.assignedAgentName && (
                <Text style={styles.agentText}>Assigned: {ticket.assignedAgentName}</Text>
              )}
            </View>

            {/* Conversation Messages */}
            <Text style={styles.sectionTitle}>Messages</Text>
            {messages.map((m) => {
              const isCustomer = m.senderRole === 'CUSTOMER';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.msgBubble,
                    isCustomer ? styles.msgCustomer : styles.msgAgent,
                  ]}
                >
                  <View style={styles.msgHeader}>
                    <Text style={styles.senderText}>
                      {isCustomer ? 'You' : m.senderName || 'Support Agent'}
                    </Text>
                    <Text style={styles.timeText}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={styles.msgText}>{m.message}</Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Reply Composer */}
          {ticket.status !== 'CLOSED' ? (
            <View style={styles.composer}>
              <TextInput
                style={styles.composerInput}
                placeholder="Type your reply..."
                value={replyText}
                onChangeText={setReplyText}
                multiline
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!replyText.trim() || submittingReply) && styles.sendBtnDisabled]}
                onPress={handleSendReply}
                disabled={!replyText.trim() || submittingReply}
              >
                {submittingReply ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.closedNotice}>
              <Text style={styles.closedNoticeText}>This ticket is permanently closed.</Text>
            </View>
          )}
        </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 16,
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
    color: '#DC2626',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  subjectText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  agentText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  msgBubble: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  msgCustomer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  msgAgent: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  msgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  msgText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  composerInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#111827',
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  closedNotice: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  closedNoticeText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
