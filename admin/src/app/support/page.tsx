"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Lock,
  Tag,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import styles from "../crud.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface AdminTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  orderId?: string;
  refundId?: string;
  returnRequestId?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketMessage {
  id: string;
  senderUserId: string;
  senderName?: string;
  senderRole: string;
  message: string;
  isInternalNote: boolean;
  createdAt: string;
}

interface AuditLog {
  id: string;
  actorRole: string;
  action: string;
  detailsJson?: string;
  createdAt: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Ticket Drawer State
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<{
    ticket: AdminTicket;
    messages: TicketMessage[];
    auditLogs: AuditLog[];
    context: any;
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Reply Composer State
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  // Agent Assignment State
  const [assigneeId, setAssigneeId] = useState("");
  const [assigneeName, setAssigneeName] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, categoryFilter, priorityFilter]);

  async function fetchTickets() {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aura_token") || localStorage.getItem("admin_token") : null;
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`${API_BASE}/api/v1/admin/support/tickets?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load admin support queue (HTTP ${res.status})`);
      }

      const data = await res.json();
      setTickets(data.items || []);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching support tickets.");
    } finally {
      setLoading(false);
    }
  }

  async function openTicketDetail(ticketId: string) {
    setSelectedTicketId(ticketId);
    setDetailLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aura_token") || localStorage.getItem("admin_token") : null;
      const res = await fetch(`${API_BASE}/api/v1/admin/support/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTicketDetail(data);
        setAssigneeName(data.ticket.assignedAgentName || "");
      }
    } catch (err: any) {
      alert(`Error loading ticket details: ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aura_token") || localStorage.getItem("admin_token") : null;
      const res = await fetch(`${API_BASE}/api/v1/admin/support/tickets/${selectedTicketId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: replyText.trim(),
          isInternalNote,
        }),
      });

      if (res.ok) {
        setReplyText("");
        setIsInternalNote(false);
        await openTicketDetail(selectedTicketId);
        await fetchTickets();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Failed to submit admin reply");
      }
    } catch (err: any) {
      alert(err.message || "Network error posting reply.");
    } finally {
      setSubmittingReply(false);
    }
  }

  async function handleUpdateStatus(newStatus: string) {
    if (!selectedTicketId) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aura_token") || localStorage.getItem("admin_token") : null;
      const res = await fetch(`${API_BASE}/api/v1/admin/support/tickets/${selectedTicketId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await openTicketDetail(selectedTicketId);
        await fetchTickets();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Failed to update ticket status");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  }

  async function handleUpdatePriority(newPriority: string) {
    if (!selectedTicketId) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("aura_token") || localStorage.getItem("admin_token") : null;
      const res = await fetch(`${API_BASE}/api/v1/admin/support/tickets/${selectedTicketId}/priority`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (res.ok) {
        await openTicketDetail(selectedTicketId);
        await fetchTickets();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Failed to update priority");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update priority");
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "badge badge-danger";
      case "HIGH":
        return "badge badge-warning";
      case "NORMAL":
        return "badge badge-info";
      default:
        return "badge badge-secondary";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "OPEN":
        return "badge badge-primary";
      case "IN_PROGRESS":
        return "badge badge-warning";
      case "WAITING_FOR_CUSTOMER":
        return "badge badge-info";
      case "RESOLVED":
        return "badge badge-success";
      case "CLOSED":
        return "badge badge-secondary";
      default:
        return "badge badge-secondary";
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Support Management Console</h1>
          <p className={styles.subtitle}>Triage, assign, and resolve customer support tickets across AuraMart</p>
        </div>
        <button onClick={fetchTickets} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700">
          <RefreshCw size={16} /> Refresh Queue
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ticket # or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchTickets()}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="WAITING_FOR_CUSTOMER">WAITING FOR CUSTOMER</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="ORDER">ORDER</option>
            <option value="DELIVERY">DELIVERY</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="REFUND">REFUND</option>
            <option value="RETURN">RETURN</option>
            <option value="QUICK_COMMERCE">QUICK COMMERCE</option>
            <option value="TECHNICAL">TECHNICAL</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 font-medium">{tickets.length} tickets in queue</span>
      </div>

      {/* Main Grid: Queue Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List Queue */}
        <div className={selectedTicketId ? "lg:col-span-6" : "lg:col-span-12"}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading support queue...</div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 text-sm m-4 rounded-lg">{error}</div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No support tickets match current filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="p-3.5">Ticket #</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Assigned Agent</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {tickets.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => openTicketDetail(t.id)}
                        className={`hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition-colors ${
                          selectedTicketId === t.id ? "bg-indigo-50 dark:bg-indigo-950/40" : ""
                        }`}
                      >
                        <td className="p-3.5 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {t.ticketNumber}
                        </td>
                        <td className="p-3.5 text-xs text-gray-600 font-medium">{t.category}</td>
                        <td className="p-3.5 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                          {t.subject}
                        </td>
                        <td className="p-3.5">
                          <span className={getPriorityBadgeClass(t.priority)}>{t.priority}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={getStatusBadgeClass(t.status)}>{t.status}</span>
                        </td>
                        <td className="p-3.5 text-xs text-gray-500">
                          {t.assignedAgentName || "Unassigned"}
                        </td>
                        <td className="p-3.5">
                          <ChevronRight size={16} className="text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Selected Ticket Drawer / Panel */}
        {selectedTicketId && (
          <div className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-md flex flex-col justify-between">
            {detailLoading || !ticketDetail ? (
              <div className="p-8 text-center text-gray-500">Loading ticket details...</div>
            ) : (
              <>
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800 mb-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {ticketDetail.ticket.ticketNumber}
                      </span>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                        {ticketDetail.ticket.subject}
                      </h2>
                      <span className="text-xs text-gray-500">Customer: {ticketDetail.ticket.customerName || ticketDetail.ticket.customerEmail}</span>
                    </div>
                    <button
                      onClick={() => setSelectedTicketId(null)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Status & Priority Controls */}
                  <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs">
                    <div>
                      <span className="text-gray-500 font-semibold block mb-1">Status</span>
                      <select
                        value={ticketDetail.ticket.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        className="px-2 py-1 border rounded bg-white dark:bg-gray-800 font-medium"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-gray-500 font-semibold block mb-1">Priority</span>
                      <select
                        value={ticketDetail.ticket.priority}
                        onChange={(e) => handleUpdatePriority(e.target.value)}
                        className="px-2 py-1 border rounded bg-white dark:bg-gray-800 font-medium"
                      >
                        <option value="LOW">LOW</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                      </select>
                    </div>

                    {ticketDetail.ticket.assignedAgentName && (
                      <div className="ml-auto text-right">
                        <span className="text-gray-500 block">Agent</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {ticketDetail.ticket.assignedAgentName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conversation Messages */}
                  <div className="space-y-3 max-h-[350px] overflow-y-auto mb-4 pr-1">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conversation History</h3>
                    {ticketDetail.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-lg text-xs border ${
                          m.isInternalNote
                            ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                            : m.senderRole === "CUSTOMER"
                            ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            : "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">
                            {m.isInternalNote ? "🔒 INTERNAL NOTE" : m.senderName || m.senderRole}
                          </span>
                          <span className="text-gray-400">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{m.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Composer Form */}
                <form onSubmit={handleSendReply} className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Response / Note
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                      />
                      <Lock size={12} /> Internal Note (Hidden from Customer)
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternalNote ? "Write an internal team note..." : "Type reply to customer..."}
                    className="w-full p-2.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-gray-900 dark:text-white mb-2"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReply || !replyText.trim()}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors flex items-center gap-1.5 ${
                        isInternalNote ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      <Send size={12} /> {submittingReply ? "Posting..." : isInternalNote ? "Add Note" : "Send Reply"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
