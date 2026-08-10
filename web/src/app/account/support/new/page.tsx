'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/config';

interface OrderOption {
  id: string;
  orderNumber: string;
  totalAmountMinor: number;
  createdAt: string;
}

export default function NewSupportTicketPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('ORDER');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH'>('NORMAL');
  const [orderId, setOrderId] = useState<string>('');
  const [userOrders, setUserOrders] = useState<OrderOption[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCustomerOrders() {
      setLoadingOrders(true);
      try {
        const token = localStorage.getItem('aura_token');
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/v1/orders/my-orders?limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setUserOrders(data.orders || data.items || []);
        }
      } catch {
        // Ignore optional order fetch failure
      } finally {
        if (isMounted) {
          setLoadingOrders(false);
        }
      }
    }
    fetchCustomerOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Please fill in all required fields (Subject and Description).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('aura_token');
      if (!token) {
        router.push('/auth/login?redirect=/account/support/new');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          description: description.trim(),
          priority,
          orderId: orderId ? orderId : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed to create support ticket (HTTP ${res.status})`);
      }

      const data = await res.json();
      router.push(`/account/support/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while submitting your ticket.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/account/support"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 mb-2"
        >
          ← Back to Support Tickets
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Support Ticket</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Our customer happiness team will review your inquiry and respond promptly.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ORDER">Order Issue</option>
            <option value="DELIVERY">Delivery Status / Delay</option>
            <option value="PAYMENT">Payment / Billing</option>
            <option value="REFUND">Refund Inquiry</option>
            <option value="RETURN">Return / Replacement</option>
            <option value="QUICK_COMMERCE">Flado Quick-Commerce</option>
            <option value="PRODUCT">Product Quality / Defect</option>
            <option value="ACCOUNT">Account Security / Profile</option>
            <option value="TECHNICAL">App / Website Bug</option>
            <option value="OTHER">Other Inquiry</option>
          </select>
        </div>

        {/* Optional Linked Order */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Link to Order <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <select
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            disabled={loadingOrders}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
          >
            <option value="">No linked order</option>
            {userOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber || o.id} ({(o.totalAmountMinor / 100).toFixed(2)} USD) - {new Date(o.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Priority</label>
          <div className="flex items-center gap-4">
            {(['LOW', 'NORMAL', 'HIGH'] as const).map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Brief summary of your issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Please provide full details of your inquiry or issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Submit CTA */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/account/support"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Support Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
