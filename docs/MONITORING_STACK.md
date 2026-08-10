# AuraMart Commerce OS — Production Monitoring Stack Guide

## Overview
AuraMart integrates Prometheus, Grafana, Loki, and Alertmanager for metric collection, log aggregation, dashboard visualization, and alerting.

---

## 1. Stack Components

- **Prometheus** ([`docker/monitoring/prometheus.yml`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/monitoring/prometheus.yml)): Metrics scraper targeting NestJS backend (`/api/v1/health`), PostgreSQL exporter (9187), Redis exporter (9121), and Nginx exporter (9113).
- **Grafana** ([`docker/monitoring/grafana/dashboards/auramart.json`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/monitoring/grafana/dashboards/auramart.json)): Visualizes HTTP request rates, P99 latency, PostgreSQL active connections, Redis memory usage, and 5xx error percentages.
- **Loki** ([`docker/monitoring/loki-config.yml`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/monitoring/loki-config.yml)): Centralized JSON log ingestion.
- **Alertmanager** ([`docker/monitoring/alertmanager.yml`](file:///Users/arifalnukhbah/antigravity/AuraMart/docker/monitoring/alertmanager.yml)): Dispatches alerts to Slack (`#auramart-alerts`) when high error rates or connection failures occur.
