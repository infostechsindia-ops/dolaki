'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

interface Ticket {
  id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  priority: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export default function CustomerSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  async function fetchTickets() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('aura_token');
      if (!token) {
        router.push('/auth/login?redirect=/account/support');
        return;
      }

      const queryParams = new URLSearchParams();
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);

      const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load tickets: ${res.statusText}`);
      }

      const data = await res.json();
      setTickets(data.items || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred loading your support tickets.');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Open</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">In Progress</span>;
      case 'WAITING_FOR_CUSTOMER':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">Awaiting Your Reply</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Resolved</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Closed</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Support</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your support tickets or submit a new inquiry</p>
        </div>
        <Link
          href="/account/support/new"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow transition-colors"
        >
          + Submit New Ticket
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 mb-6 overflow-x-auto">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              statusFilter === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tickets.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center text-xl font-bold mb-3">
            💬
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No support tickets found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Need help with an order, payment, or account issue?</p>
          <Link
            href="/account/support/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Your First Ticket
          </Link>
        </div>
      )}

      {/* Ticket List */}
      {!loading && !error && tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/account/support/${t.id}`}
              className="block p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400">{t.ticketNumber}</span>
                  {getStatusBadge(t.status)}
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {t.category}
                  </span>
                </div>
                <span className="text-xs text-gray-400">Updated {new Date(t.updatedAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {t.subject}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
