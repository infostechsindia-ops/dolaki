/**
 * CMD-006: Role enum and convenience arrays for RBAC authorization.
 * These 12 roles replace the legacy 4-role system (CUSTOMER, VENDOR, ADMIN, DELIVERY).
 * Legacy roles are migrated via: backend/src/database/migrations/1722825600000-RenameUserRoles.ts
 */
export enum Role {
  // Customer-facing
  CUSTOMER = 'CUSTOMER',

  // Marketplace vendor roles
  VENDOR_OWNER = 'VENDOR_OWNER',
  VENDOR_STAFF = 'VENDOR_STAFF', // Placeholder — staff management deferred

  // Flado quick-commerce merchant roles
  MERCHANT_OWNER = 'MERCHANT_OWNER',
  MERCHANT_MANAGER = 'MERCHANT_MANAGER', // Placeholder — staff management deferred
  MERCHANT_PICKER = 'MERCHANT_PICKER',   // Placeholder — staff management deferred

  // Delivery
  RIDER = 'RIDER',

  // Admin/operations roles
  SUPPORT = 'SUPPORT',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  CATALOG_ADMIN = 'CATALOG_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

/**
 * Admin roles — have access to admin-scoped endpoints as declared per endpoint.
 * SUPER_ADMIN is included in this set.
 * NOTE: These roles do NOT automatically receive resource ownership bypass.
 *       Only SUPER_ADMIN has ownership bypass, and only inside the ownership guards.
 */
export const ADMIN_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.CATALOG_ADMIN,
  Role.OPERATIONS,
  Role.FINANCE,
  Role.SUPPORT,
];

/** Marketplace vendor roles */
export const VENDOR_ROLES: Role[] = [Role.VENDOR_OWNER, Role.VENDOR_STAFF];

/** Flado quick-commerce merchant roles */
export const MERCHANT_ROLES: Role[] = [
  Role.MERCHANT_OWNER,
  Role.MERCHANT_MANAGER,
  Role.MERCHANT_PICKER,
];

/** All roles that can perform merchant shop management operations */
export const MERCHANT_OPERATOR_ROLES: Role[] = [
  Role.MERCHANT_OWNER,
  Role.MERCHANT_MANAGER,
  Role.SUPER_ADMIN,
];

/** CMS write roles */
export const CMS_WRITE_ROLES: Role[] = [Role.SUPER_ADMIN, Role.CATALOG_ADMIN];
