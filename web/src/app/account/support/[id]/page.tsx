'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

interface TicketMessage {
  id: string;
  senderUserId: string;
  senderName?: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

interface TicketDetail {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  assignedAgentName?: string;
  createdAt: string;
  updatedAt: string;
}

interface LinkedOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmountMinor: number;
}

export default function CustomerTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params?.id as string;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [linkedOrder, setLinkedOrder] = useState<LinkedOrder | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticketId) fetchTicketDetail();
  }, [ticketId]);

  async function fetchTicketDetail() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('aura_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to load support ticket details (HTTP ${res.status})`);
      }

      const data = await res.json();
      setTicket(data.ticket);
      setMessages(data.messages || []);
      setLinkedOrder(data.linkedOrder || null);
    } catch (err: any) {
      setError(err.message || 'Error loading support ticket.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const token = localStorage.getItem('aura_token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit reply');
      }

      setReplyText('');
      await fetchTicketDetail();
    } catch (err: any) {
      alert(err.message || 'Failed to post reply.');
    } finally {
      setSubmittingReply(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Open</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">In Progress</span>;
      case 'WAITING_FOR_CUSTOMER':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">Awaiting Your Reply</span>;
      case 'RESOLVED':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Resolved</span>;
      case 'CLOSED':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Closed</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
        <div className="h-40 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 mb-6 text-sm">
          {error || 'Support ticket not found.'}
        </div>
        <Link href="/account/support" className="text-indigo-600 font-medium hover:underline text-sm">
          ← Return to Support Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/account/support" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 mb-3">
          ← Back to Support Tickets
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-sm font-bold text-gray-500">{ticket.ticketNumber}</span>
              {getStatusBadge(ticket.status)}
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {ticket.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
          </div>
          {ticket.assignedAgentName && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
              Assigned Agent: <span className="font-semibold text-gray-800 dark:text-gray-200">{ticket.assignedAgentName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Linked Order Preview */}
      {linkedOrder && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-0.5">Linked Order</span>
            <Link href={`/orders/${linkedOrder.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:underline">
              {linkedOrder.orderNumber || linkedOrder.id}
            </Link>
            <span className="text-xs text-gray-500 ml-3 font-medium">Status: {linkedOrder.status}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ${(linkedOrder.totalAmountMinor / 100).toFixed(2)}
          </span>
        </div>
      )}

      {/* Conversation Timeline */}
      <div className="space-y-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
          Conversation Timeline
        </h2>

        {messages.map((m) => {
          const isCustomer = m.senderRole === 'CUSTOMER';
          return (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border ${
                isCustomer
                  ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  : 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isCustomer ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : 'bg-indigo-600 text-white'
                  }`}>
                    {isCustomer ? 'You' : m.senderName || 'Support Agent'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{m.message}</p>
            </div>
          );
        })}
      </div>

      {/* Reply Composer */}
      {ticket.status !== 'CLOSED' ? (
        <form onSubmit={handleSendReply} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          {ticket.status === 'RESOLVED' && (
            <div className="p-3 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800">
              Note: This ticket is currently marked as RESOLVED. Sending a reply will automatically reopen the ticket.
            </div>
          )}
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            Send Reply
          </label>
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your message here..."
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingReply || !replyText.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow transition-colors"
            >
              {submittingReply ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          This ticket is permanently closed. To request further assistance, please submit a new ticket.
        </div>
      )}
    </div>
  );
}
