# AuraMart Commerce OS — Version Manifest
## RELEASE-002 | Version 2.0.0-rc.1 | 2026-08-08

This document records the exact dependency versions of all workspace packages
at the time of the RELEASE-002 release candidate audit.

---

## Platform Version

| Component | Version |
|-----------|---------|
| AuraMart Commerce OS | 2.0.0-rc.1 |
| Release Tag | v2.0.0-rc.1 |
| Release Date | 2026-08-08 |
| Node.js Target | 20.x LTS |
| Architecture | amd64 / arm64 |

---

## Backend (NestJS)

| Package | Version | Role |
|---------|---------|------|
| @nestjs/common | ^11.0.1 | Core framework |
| @nestjs/core | ^11.0.1 | Core framework |
| @nestjs/jwt | ^11.0.2 | JWT authentication |
| @nestjs/passport | ^11.0.5 | Passport integration |
| @nestjs/platform-express | ^11.0.1 | Express adapter |
| @nestjs/swagger | ^11.4.6 | OpenAPI docs |
| @nestjs/throttler | ^6.5.0 | Rate limiting |
| @nestjs/typeorm | ^11.0.3 | Database ORM |
| typeorm | 0.3.20 | ORM (pinned) |
| pg | ^8.22.0 | PostgreSQL driver |
| sqlite3 | ^6.0.1 | SQLite driver (dev/test) |
| bcrypt | ^6.0.0 | Password hashing |
| passport-jwt | ^4.0.1 | JWT passport strategy |
| class-validator | ^0.15.1 | DTO validation |
| class-transformer | ^0.5.1 | DTO transformation |
| cookie-parser | ^1.4.7 | Cookie parsing |
| jsonwebtoken | ^9.0.3 | JWT utilities |
| dotenv | ^17.4.2 | Environment variables |
| rxjs | ^7.8.1 | Reactive extensions |
| reflect-metadata | ^0.2.2 | Metadata reflection |
| typescript | ^5.7.3 | TypeScript compiler |
| jest | ^30.0.0 | Test framework |
| ts-jest | ^29.2.5 | TypeScript jest transform |

---

## Customer Web (Next.js)

| Package | Version | Role |
|---------|---------|------|
| next | 16.2.9 | React framework |
| react | 19.2.4 | UI library |
| react-dom | 19.2.4 | React DOM |
| framer-motion | ^12.42.0 | Animation library |
| react-icons | ^5.6.0 | Icon library |
| lucide-react | latest | Icon library (installed) |
| typescript | ^5 | TypeScript |
| jest | ^30.4.2 | Test framework |
| @testing-library/react | ^16.3.2 | Component testing |
| babel-jest | ^30.4.1 | Babel transform for tests |

---

## Admin Console (Next.js)

| Package | Version | Role |
|---------|---------|------|
| next | 16.2.9 | React framework |
| react | 19.2.4 | UI library |
| react-dom | 19.2.4 | React DOM |
| lucide-react | ^1.22.0 | Icon library |
| typescript | ^5 | TypeScript |

---

## Vendor Portal (Next.js)

| Package | Version | Role |
|---------|---------|------|
| next | 16.2.9 | React framework |
| react | 19.2.4 | UI library |
| react-dom | 19.2.4 | React DOM |
| typescript | ^5 | TypeScript |

---

## Mobile (React Native / Expo)

| Package | Version | Role |
|---------|---------|------|
| expo | ~52 | Expo framework |
| react-native | 0.76.x | Mobile framework |
| react | 18.x | UI library |
| expo-router | ~4 | Navigation |
| expo-notifications | latest | Push notifications |
| expo-location | latest | GPS location |
| expo-camera | latest | Camera |
| expo-image | latest | Image handling |
| @react-native-async-storage/async-storage | latest | Local storage |
| typescript | ^5 | TypeScript |

---

## Infrastructure

| Component | Version |
|-----------|---------|
| PostgreSQL | 16-alpine (Docker) |
| Redis | 7-alpine (Docker) |
| Nginx | Latest stable |
| Docker | 27.x |
| Docker Compose | v2 |
| Node.js | 20.x LTS (Docker base) |

---

## CI/CD

| Tool | Version |
|------|---------|
| GitHub Actions | N/A (hosted) |
| actions/checkout | v4 |
| actions/setup-node | v4 |
| docker/build-push-action | v5 |
| docker/setup-buildx-action | v3 |
| docker/setup-qemu-action | v3 |
| anchore/sbom-action | v0 |
| aquasecurity/trivy-action | master |
| actions/upload-artifact | v4 |

---

## Test Counts at Release

| Workspace | Test Suites | Tests |
|-----------|-------------|-------|
| backend | 23 | 231 |
| web | 1 (components) | 366 |
| admin | 2 | 21 |
| vendor | 1 | 40 |
| mobile | 1 | 10 |
| **TOTAL** | **28** | **668** |

---

*AuraMart Commerce OS v2.0.0-rc.1 | RELEASE-002 | 2026-08-08*
