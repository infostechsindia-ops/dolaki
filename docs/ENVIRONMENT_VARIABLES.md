# AuraMart Commerce OS — Environment Variable Contract (RELEASE-001)

**Release Candidate ID:** AuraMart RC-1  
**Document Purpose:** Complete specification of all environment variables across Backend API, Customer Web, Vendor Portal, Admin Platform, and Customer Mobile App.

---

## 1. Backend API & Engine Configuration

### Server & App Core
| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `NODE_ENV` | Required | `development` | No | Application environment (`development`, `staging`, `production`) |
| `PORT` | Optional | `3001` | No | NestJS HTTP server port |
| `API_PREFIX` | Optional | `/api/v1` | No | Global REST API path prefix |
| `CORS_ORIGIN` | Required | `http://localhost:3000,http://localhost:3002,http://localhost:3003` | No | Allowed CORS origin URLs |

### Database (PostgreSQL)
| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `DB_HOST` | Production | `localhost` | No | PostgreSQL database host address |
| `DB_PORT` | Optional | `5432` | No | PostgreSQL database port |
| `DB_USER` | Production | `postgres` | Yes | PostgreSQL database user |
| `DB_PASSWORD` | Production | `postgres` | Yes | PostgreSQL database password |
| `DB_NAME` | Production | `auramart` | No | PostgreSQL database name |
| `DB_SSL` | Optional | `false` | No | Enforce SSL for PostgreSQL connection |
| `DB_DATABASE` | Dev Only | `auramart.db` | No | SQLite database file path (when `DB_HOST` is unset) |

### Authentication & JWT Secrets
| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `JWT_ACCESS_SECRET` | Required | `dev-access-secret-32-chars-minimum` | **YES** | Secret key for signing Access Tokens |
| `JWT_REFRESH_SECRET` | Required | `dev-refresh-secret-32-chars-minimum` | **YES** | Secret key for signing Refresh Tokens |
| `JWT_ACCESS_EXPIRATION` | Optional | `15m` | No | Access token expiration duration |
| `JWT_REFRESH_EXPIRATION` | Optional | `7d` | No | Refresh token expiration duration |

### Payments & Financial Gateways
| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `STRIPE_SECRET_KEY` | Production | `sk_test_mock` | **YES** | Stripe API Secret Key |
| `STRIPE_WEBHOOK_SECRET` | Production | `whsec_mock` | **YES** | Stripe Webhook Signature Verification Secret |
| `RAZORPAY_KEY_ID` | Optional | `rzp_test_mock` | No | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Optional | `rzp_secret_mock` | **YES** | Razorpay Key Secret |

### Mobile Push Notifications & FCM
| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `FIREBASE_PROJECT_ID` | Production | `auramart-dev` | No | Firebase Project ID for FCM |
| `FIREBASE_CLIENT_EMAIL` | Production | `mock@firebase.iam.gserviceaccount.com` | No | Firebase Service Account Email |
| `FIREBASE_PRIVATE_KEY` | Production | `mock-private-key` | **YES** | Firebase Service Account Private Key |
| `EXPO_PUSH_TOKEN_KEY` | Production | `mock-expo-key` | **YES** | Expo Push Gateway Authorization Key |

### Storage & CMS Assets
| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `STORAGE_DRIVER` | Optional | `local` | No | Storage driver (`local` or `s3`) |
| `UPLOAD_DIR` | Optional | `./uploads` | No | Local filesystem upload directory |
| `S3_BUCKET_NAME` | Production | `auramart-media` | No | AWS S3 Bucket name for media assets |
| `S3_REGION` | Production | `us-east-1` | No | AWS S3 Region |
| `AWS_ACCESS_KEY_ID` | Production | `mock-access-key` | **YES** | AWS Access Key ID |
| `AWS_SECRET_ACCESS_KEY` | Production | `mock-secret-key` | **YES** | AWS Secret Access Key |

---

## 2. Customer Web Frontend Configuration

| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `NEXT_PUBLIC_API_URL` | Required | `http://localhost:3001` | No | Backend API endpoint URL |
| `NEXT_PUBLIC_ENABLE_DEMO_FIXTURES` | Optional | `true` | No | Enable demo data fallback when API is unreachable (`false` in production) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production | `pk_test_mock` | No | Stripe Public API Key |

---

## 3. Vendor Portal Frontend Configuration

| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `NEXT_PUBLIC_API_URL` | Required | `http://localhost:3001` | No | Backend API endpoint URL |
| `NEXT_PUBLIC_ENABLE_DEMO_FIXTURES` | Optional | `true` | No | Enable demo data fallback when API is unreachable (`false` in production) |

---

## 4. Admin Platform Frontend Configuration

| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `NEXT_PUBLIC_API_URL` | Required | `http://localhost:3001` | No | Backend API endpoint URL |
| `NEXT_PUBLIC_ENABLE_DEMO_FIXTURES` | Optional | `true` | No | Enable demo data fallback when API is unreachable (`false` in production) |

---

## 5. Customer & Merchant Mobile App Configuration

| Variable Name | Required? | Dev Default | Production Secret | Description |
|---------------|-----------|-------------|-------------------|-------------|
| `EXPO_PUBLIC_API_URL` | Required | `http://localhost:3001` | No | Backend API endpoint URL |
| `EXPO_PUBLIC_ENABLE_DEMO_FIXTURES` | Optional | `true` | No | Enable demo data fallback when API is unreachable (`false` in production) |
| `EAS_PROJECT_ID` | Production | `auramart-mobile-app-id` | No | Expo Application Services Project ID |
