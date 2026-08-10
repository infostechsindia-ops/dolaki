# ADR-0005: Canonical Expo/React Native Customer Mobile Application Architecture

Date: 2026-08-06
Status: ACCEPTED
Deciders: Commerce OS Architecture Team (CMD-059)

## Context

AuraMart Marketplace and Flado Quick-Commerce previously had legacy native Android codebase experiments (`app/`, Gradle build manifests). Maintaining duplicate native Android and iOS client codebases introduces feature drift, contract mismatches, and duplicated client logic.

## Decision

1. **Expo / React Native as Canonical Customer Mobile**:
   - `mobile/` (Expo Router 56+, React Native 0.85+, TypeScript) is officially designated as the **single canonical customer mobile application** for both Android and iOS.
   - Legacy native Android feature development (`app/`) is frozen. No new customer features will be added to the native Android directory.

2. **Server-Authoritative Trust Boundaries**:
   - The backend API (`backend/`) remains the sole authoritative source of truth for pricing, inventory, cart rules, fee calculation, serviceability geofencing, ETA estimation, checkout validation, payments, order state machines, refunds, substitutions, and reorder availability.
   - Mobile application MUST NOT perform client-side financial calculations, stock estimation, or geographic serviceability math. All monetary and availability values are rendered verbatim from backend DTOs.

3. **Secure Storage & Session Management**:
   - Access tokens and sensitive session credentials MUST NOT be stored in plain unencrypted AsyncStorage. Secure storage mechanisms (e.g. `expo-secure-store`) must be used for JWT tokens and refresh credentials.
   - Raw payment card numbers and CVV codes MUST NEVER be stored in application-owned persistent storage.

4. **Surface Integration**:
   - Marketplace and Flado Quick-Commerce share authentication, user account, address book, cart infrastructure, and payment orchestration services while displaying distinct surface experiences.

## Migration Plan

All native Android capabilities (`app/`) have been inventoried in `docs/MOBILE_MIGRATION_INVENTORY.md` to ensure full feature parity during Expo mobile implementation (CMD-060 through CMD-068).
