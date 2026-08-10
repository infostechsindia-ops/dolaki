# AuraMart & Flado Canonical Customer Mobile App (Expo Android + iOS)

Official canonical mobile application for **AuraMart Marketplace** and **Flado Quick-Commerce**.

---

## 1. Architectural Principles & Trust Boundaries

* **Backend Authoritative**: The backend REST API (`backend/`) is the sole authoritative source of truth for pricing, stock, cart calculation, fees, serviceability geofencing, ETA calculation, checkout, payment processing, orders, refunds, substitutions, and reorder availability.
* **No Client Financial Math**: The mobile app renders all prices, subtotals, fees, and totals verbatim from backend DTO props. No client-side price calculation or fee rounding logic.
* **Shared Infrastructure, Dual Surface**: Marketplace and Flado Quick-Commerce share authentication, session management, address book, cart, and order infrastructure while offering tailored customer experiences.
* **Security & Tokens**: Session tokens are stored securely using platform keychains (`expo-secure-store`). Sensitive payment secrets or raw card data are never stored locally.

---

## 2. Directory Structure

```
mobile/
├── app/                  # Expo Router file-based screens & navigation
│   ├── (tabs)/          # Bottom tab navigation (Home, Flado, Cart, Account)
│   ├── _layout.tsx      # Root application layout & providers
│   └── ...
├── src/
│   ├── api/             # Typed API client layer & contracts
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks (auth, location, cart, query)
│   └── types/           # Shared API contract DTO types
├── package.json
└── tsconfig.json
```

---

## 3. Environment & Scripts

```bash
# Start development server
npm start

# Run Android emulator / iOS simulator
npm run android
npm run ios

# Run test suite
npm test
```
