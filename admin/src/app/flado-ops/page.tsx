"use client";

import React from "react";
import { Truck, MapPin, Battery, Smartphone, ShieldCheck, Clock, Settings, Zap } from "lucide-react";
import { useAdmin, FladoHub, FladoRider } from "@/context/AdminContext";
import styles from "./flado.module.css";
import crudStyles from "../crud.module.css";

export default function FladoOpsPage() {
  const { hubs, riders, updateHubStatus, updateRiderStatus } = useAdmin();

  const getHubStatusBadge = (status: FladoHub["status"]) => {
    switch (status) {
      case "normal":
        return "badge badge-success";
      case "high_load":
        return "badge badge-warning";
      case "overloaded":
        return "badge badge-danger";
      default:
        return "badge badge-muted";
    }
  };

  const getRiderStatusBadge = (status: FladoRider["status"]) => {
    switch (status) {
      case "active_delivery":
        return "badge badge-info";
      case "idle":
        return "badge badge-success";
      case "offline":
        return "badge badge-muted";
      default:
        return "badge badge-muted";
    }
  };

  const getBatteryClass = (percent: number) => {
    if (percent > 40) return styles.batteryHigh;
    if (percent > 15) return styles.batteryMid;
    return styles.batteryLow;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Page Header */}
      <div className={crudStyles.pageHeader}>
        <div className={crudStyles.pageTitleGroup}>
          <h2 className={crudStyles.title}>Flado Logistics Ops</h2>
          <p className={crudStyles.subtitle}>
            AuraMart's Fast Logistics & Delivery Operations center. Track hubs and electric riders.
          </p>
        </div>
      </div>

      {/* System Settings & Variables */}
      <div className={crudStyles.card}>
        <h3 className={crudStyles.cardTitle}>Global Logistics Dispatch Parameters</h3>
        <div className={styles.configGrid}>
          <div className={styles.configCard}>
            <div className={styles.configIcon}>
              <Zap size={18} />
            </div>
            <div className={styles.configInfo}>
              <span className={styles.configName}>Auto Assign Range</span>
              <span className={styles.configVal}>3.5 Kilometers</span>
            </div>
          </div>

          <div className={styles.configCard}>
            <div className={styles.configIcon}>
              <Clock size={18} />
            </div>
            <div className={styles.configInfo}>
              <span className={styles.configName}>Peak hours delay buffer</span>
              <span className={styles.configVal}>+8 minutes</span>
            </div>
          </div>

          <div className={styles.configCard}>
            <div className={styles.configIcon}>
              <Truck size={18} />
            </div>
            <div className={styles.configInfo}>
              <span className={styles.configName}>Max Payload / EV</span>
              <span className={styles.configVal}>22 Kilograms</span>
            </div>
          </div>

          <div className={styles.configCard}>
            <div className={styles.configIcon}>
              <ShieldCheck size={18} />
            </div>
            <div className={styles.configInfo}>
              <span className={styles.configName}>EV Green Subsidy</span>
              <span className={styles.configVal}>₹4.50 / km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Hubs Management */}
      <div className={crudStyles.card}>
        <h3 className={crudStyles.cardTitle}>Live Fulfillment Hubs Status</h3>
        <div className={styles.hubsGrid}>
          {hubs.map((hub) => (
            <div key={hub.id} className={styles.hubCard}>
              <div className={styles.hubHeader}>
                <div className={styles.hubTitleGroup}>
                  <span className={styles.hubName}>{hub.name}</span>
                  <span className={styles.hubCity}>
                    <MapPin size={12} style={{ display: "inline", marginRight: "2px" }} />
                    {hub.city}
                  </span>
                </div>
                <span className={getHubStatusBadge(hub.status)}>{hub.status.replace("_", " ")}</span>
              </div>

              <div className={styles.hubStats}>
                <div className={styles.statPill}>
                  <span className={styles.statVal}>{hub.activeRiders}</span>
                  <span className={styles.statLbl}>Riders Live</span>
                </div>
                <div className={styles.statPill}>
                  <span className={styles.statVal}>{hub.pendingOrders}</span>
                  <span className={styles.statLbl}>Orders Queue</span>
                </div>
              </div>

              <div className={styles.hubFooter}>
                <div>
                  <span style={{ color: "var(--text-light)" }}>Avg fulfillment: </span>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                    {hub.avgDeliveryTimeMinutes} mins
                  </span>
                </div>

                <select
                  className={crudStyles.filterSelect}
                  style={{ padding: "0.2rem 0.4rem", fontSize: "0.7rem" }}
                  value={hub.status}
                  onChange={(e) => updateHubStatus(hub.id, e.target.value as FladoHub["status"])}
                  aria-label="Set hub status"
                >
                  <option value="normal">Set Normal</option>
                  <option value="high_load">Set High Load</option>
                  <option value="overloaded">Set Overloaded</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table: Electric Scooter Riders Tracking */}
      <div className={crudStyles.card}>
        <h3 className={crudStyles.cardTitle}>Active Delivery Riders & EV Battery Tracking</h3>
        <div className={crudStyles.tableContainer}>
          <table className={crudStyles.table}>
            <thead>
              <tr>
                <th>Rider ID</th>
                <th>Delivery Executive</th>
                <th>Affiliated Hub</th>
                <th>Battery status (EV)</th>
                <th>Active Order</th>
                <th>Rider status</th>
                <th>Override Status</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr key={rider.id}>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{rider.id}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-main)" }}>{rider.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                        <Smartphone size={10} style={{ display: "inline", marginRight: "2px" }} />
                        {rider.phone}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: "0.85rem" }}>{rider.hub}</td>
                  <td>
                    {rider.status !== "offline" ? (
                      <div className={styles.batteryContainer}>
                        <div className={styles.batteryOuter}>
                          <div
                            className={`${styles.batteryInner} ${getBatteryClass(rider.batteryPercent)}`}
                            style={{ width: `${rider.batteryPercent}%` }}
                          />
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{rider.batteryPercent}%</span>
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>Offline</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>
                    {rider.currentOrder || <span style={{ color: "var(--text-light)", fontWeight: 400 }}>None</span>}
                  </td>
                  <td>
                    <span className={getRiderStatusBadge(rider.status)}>
                      {rider.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <select
                      className={crudStyles.filterSelect}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                      value={rider.status}
                      onChange={(e) => updateRiderStatus(rider.id, e.target.value as FladoRider["status"])}
                      aria-label="Set rider status"
                    >
                      <option value="idle">Set Idle</option>
                      <option value="active_delivery">Set On Delivery</option>
                      <option value="offline">Set Offline</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
