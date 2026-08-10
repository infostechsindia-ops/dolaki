"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../dashboard.module.css";
import {
  ProfileIcon,
  CheckIcon,
  RefreshIcon,
  InfoIcon
} from "@/components/Icons";

interface VendorStaffDTO {
  id: string;
  userId: string;
  email: string;
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';
  status: 'ACTIVE' | 'INACTIVE';
  isPrimaryOwner: boolean;
  createdAt: string;
}

interface VendorInvitationDTO {
  id: string;
  email: string;
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  inviteUrl?: string;
  createdAt: string;
}

interface VendorActivityLogDTO {
  id: string;
  actorUserId: string | null;
  actorEmail: string | null;
  action: string;
  metadata: any;
  createdAt: string;
}

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'invitations' | 'activity'>('staff');

  const [staffList, setStaffList] = useState<VendorStaffDTO[]>([]);
  const [invitations, setInvitations] = useState<VendorInvitationDTO[]>([]);
  const [activityLogs, setActivityLogs] = useState<VendorActivityLogDTO[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Invite Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF'>("FULFILLMENT_STAFF");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const fetchStaffData = useCallback(async () => {
    const isDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES === "true";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (isDemo || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [staffRes, invRes, actRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/vendors/staff`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/v1/vendors/staff/invitations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/v1/vendors/staff/activity`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (staffRes.ok) {
        let sData = await staffRes.json();
        if (sData && typeof sData === "object" && "data" in sData) sData = sData.data;
        setStaffList(sData);
      }

      if (invRes.ok) {
        let iData = await invRes.json();
        if (iData && typeof iData === "object" && "data" in iData) iData = iData.data;
        setInvitations(iData);
      }

      if (actRes.ok) {
        let aData = await actRes.json();
        if (aData && typeof aData === "object" && "data" in aData) aData = aData.data;
        setActivityLogs(aData);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load staff management data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/staff/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: inviteEmail, vendorRole: inviteRole })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Failed to send invitation");
      }

      let data = await res.json();
      if (data && typeof data === "object" && "data" in data) data = data.data;

      setGeneratedLink(data.inviteUrl || "/accept-invite");
      setSuccessMsg(`Invitation created for ${inviteEmail}. Delivery provider is deferred — copy the simulation link below.`);
      setInviteEmail("");
      fetchStaffData();
    } catch (err: any) {
      setError(err?.message || "Invite error");
    }
  };

  const handleToggleStatus = async (staffId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (!confirm(`Are you sure you want to change status to ${nextStatus}?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/staff/${staffId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Status update failed");
      }

      setSuccessMsg(`Staff status updated to ${nextStatus}.`);
      fetchStaffData();
    } catch (err: any) {
      setError(err?.message || "Status update error");
    }
  };

  const handleRoleChange = async (staffId: string, newRole: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/staff/${staffId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newRole })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Role change failed");
      }

      setSuccessMsg(`Staff role updated to ${newRole}.`);
      fetchStaffData();
    } catch (err: any) {
      setError(err?.message || "Role update error");
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    if (!confirm("Are you sure you want to remove this staff member from your vendor team? Access will be revoked immediately.")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/staff/${staffId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Removal failed");
      }

      setSuccessMsg("Staff member removed successfully.");
      fetchStaffData();
    } catch (err: any) {
      setError(err?.message || "Staff removal error");
    }
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
    const token = typeof window !== "undefined" ? localStorage.getItem("vendor_token") : null;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/vendors/staff/invitations/${invitationId}/revoke`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || "Revocation failed");
      }

      setSuccessMsg("Invitation revoked.");
      fetchStaffData();
    } catch (err: any) {
      setError(err?.message || "Revoke error");
    }
  };

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header & Invite Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Vendor Team & Permission Management
          </h2>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
            Manage staff roles (Owner, Manager, Fulfillment), pending invitations, and activity audit trail.
          </span>
        </div>

        <button className={styles.primaryBtn} onClick={() => { setIsInviteModalOpen(true); setGeneratedLink(null); }}>
          <ProfileIcon size={16} />
          <span>Invite New Team Member</span>
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #EF4444", color: "#991B1B", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: "#ECFDF5", borderLeft: "4px solid #10B981", color: "#065F46", padding: "1rem", borderRadius: "4px", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab('staff')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'staff' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'staff' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Active Staff ({staffList.length})
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'invitations' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'invitations' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Invitations ({invitations.filter((i) => i.status === "PENDING").length} Pending)
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          style={{
            padding: "0.75rem 1rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: activeTab === 'activity' ? "var(--primary-green)" : "var(--text-secondary)",
            borderBottom: activeTab === 'activity' ? "2px solid var(--primary-green)" : "none",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          Activity Audit Log
        </button>
      </div>

      {/* Staff List Tab */}
      {activeTab === 'staff' && (
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Vendor Staff Directory</span>
            <span className="badge badge-success">Server-Authoritative RBAC Boundaries</span>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email / Identity</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>
                      {s.email} {s.isPrimaryOwner && <span style={{ fontSize: "0.7rem", backgroundColor: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px", marginLeft: "6px" }}>PRIMARY OWNER</span>}
                    </td>
                    <td>
                      {s.isPrimaryOwner ? (
                        <span className="badge badge-success">OWNER</span>
                      ) : (
                        <select
                          value={s.vendorRole}
                          onChange={(e) => handleRoleChange(s.id, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", border: "1px solid #D1D5DB" }}
                        >
                          <option value="FULFILLMENT_STAFF">FULFILLMENT_STAFF</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="OWNER">OWNER</option>
                        </select>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${s.status === "ACTIVE" ? "badge-success" : "badge-warning"}`}>{s.status}</span>
                    </td>
                    <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{formatDate(s.createdAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      {!s.isPrimaryOwner && (
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => handleToggleStatus(s.id, s.status)}
                            style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                          >
                            {s.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => handleRemoveStaff(s.id)}
                            style={{ fontSize: "0.75rem", padding: "4px 8px", color: "#DC2626" }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invitations Tab */}
      {activeTab === 'invitations' && (
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Pending & Historical Invitations</span>
          </div>

          {invitations.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invited Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Expires Date</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700 }}>{inv.email}</td>
                      <td><span className="badge badge-info">{inv.vendorRole}</span></td>
                      <td>
                        <span className={`badge ${inv.status === "PENDING" ? "badge-warning" : inv.status === "ACCEPTED" ? "badge-success" : "badge-danger"}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{formatDate(inv.expiresAt)}</td>
                      <td style={{ textAlign: "right" }}>
                        {inv.status === "PENDING" && (
                          <button
                            type="button"
                            className={styles.secondaryBtn}
                            onClick={() => handleRevokeInvitation(inv.id)}
                            style={{ fontSize: "0.75rem", padding: "4px 8px", color: "#DC2626" }}
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
              No staff invitations sent yet. Click "Invite New Team Member" to invite staff.
            </div>
          )}
        </div>
      )}

      {/* Activity Audit Tab */}
      {activeTab === 'activity' && (
        <div className={styles.dashboardBlock}>
          <div className={styles.blockTitle}>
            <span>Vendor Activity Audit Log</span>
            <span className="badge badge-info">Immutable Security Trail</span>
          </div>

          {activityLogs.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor Email</th>
                    <th>Action</th>
                    <th>Metadata</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{new Date(a.createdAt).toLocaleString("en-IN")}</td>
                      <td style={{ fontWeight: 700 }}>{a.actorEmail || a.actorUserId || "System"}</td>
                      <td><span style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700 }}>{a.action}</span></td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {a.metadata ? JSON.stringify(a.metadata) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-secondary)" }}>
              No vendor activity logged yet.
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsInviteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Invite Vendor Staff Member</h3>
              <button className={styles.closeBtn} onClick={() => setIsInviteModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSendInvite}>
              <div className={styles.modalBody}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="staff@artisanstore.com"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8125rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Assigned Vendor Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
                  >
                    <option value="FULFILLMENT_STAFF">FULFILLMENT_STAFF — Order prep & shipping tasks only</option>
                    <option value="MANAGER">MANAGER — Catalog, inventory, orders & returns</option>
                    <option value="OWNER">OWNER — Full administrative, financial & staff control</option>
                  </select>
                </div>

                {generatedLink && (
                  <div style={{ backgroundColor: "#F3F4F6", padding: "10px", borderRadius: "6px", fontSize: "0.75rem", wordBreak: "break-all" }}>
                    <strong>Simulated Acceptance Link:</strong>
                    <div style={{ fontFamily: "monospace", color: "#1D4ED8", marginTop: "4px" }}>{generatedLink}</div>
                  </div>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsInviteModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryBtn}>Generate Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
