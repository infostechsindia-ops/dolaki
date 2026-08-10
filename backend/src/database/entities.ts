import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ValueTransformer,
  Unique,
} from 'typeorm';

export const BigIntSafeTransformer: ValueTransformer = {
  to: (entityValue: number | null | undefined): number => {
    if (entityValue === null || entityValue === undefined) return 0;
    return entityValue;
  },
  from: (databaseValue: string | number | null | undefined): number => {
    if (databaseValue === null || databaseValue === undefined) return 0;
    const num = typeof databaseValue === 'number' ? databaseValue : parseInt(databaseValue, 10);
    if (isNaN(num)) return 0;
    if (!Number.isSafeInteger(num)) {
      throw new Error(`Database minor-unit integer ${databaseValue} exceeds Number.MAX_SAFE_INTEGER`);
    }
    return num;
  },
};

// User Entity
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ type: 'varchar', default: 'CUSTOMER' })
  role:
    | 'CUSTOMER'
    | 'VENDOR_OWNER'
    | 'VENDOR_STAFF'
    | 'MERCHANT_OWNER'
    | 'MERCHANT_MANAGER'
    | 'MERCHANT_PICKER'
    | 'RIDER'
    | 'SUPPORT'
    | 'OPERATIONS'
    | 'FINANCE'
    | 'CATALOG_ADMIN'
    | 'SUPER_ADMIN';

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVip: boolean;

  @Column({ type: 'datetime', nullable: true })
  vipExpiresAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Saved Address Entity
@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ default: 'Home' })
  label: string; // 'Home' | 'Work' | 'Other'

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  line1: string;

  @Column({ type: 'text', nullable: true })
  line2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// SMS OTP Token Entity (mTalkz Integration)
@Entity('otp_tokens')
export class OtpToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column()
  otp: string;

  @Column({ default: 'LOGIN' })
  purpose: 'LOGIN' | 'VERIFY_PHONE' | 'PASSWORD_RESET';

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  usedAt: Date;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn()
  createdAt: Date;
}

// Refresh Token Entity
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  tokenHash: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  rotatedAt: Date;

  @Column({ nullable: true })
  replacedByTokenHash: string;

  @CreateDateColumn()
  createdAt: Date;
}

// Vendor Entity
@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  storeName: string;

  @Column({ type: 'text', nullable: true })
  storeDescription: string;

  @Column({ nullable: true })
  gstNumber: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', default: 'DRAFT' })
  onboardingStatus: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'RESUBMITTED';

  @Column({ type: 'varchar', nullable: true })
  businessLegalName: string | null;

  @Column({ type: 'varchar', nullable: true })
  panNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountName: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankIfsc: string | null;

  @Column({ default: false })
  agreementsAccepted: boolean;

  @Column({ type: 'datetime', nullable: true })
  agreementsAcceptedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ type: 'datetime', nullable: true })
  submittedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  documentsJson: string | null;

  @Column({ type: 'float', default: 0.0 })
  performanceScore: number;

  @CreateDateColumn()
  createdAt: Date;
}

// Category Entity
// Brand Entity
@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Category Entity
@Entity('categories')
@Index(['parentId', 'displayOrder'])
@Index(['status', 'isMarketplace', 'isQuickCommerce'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  parentId: string | null;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: '/' })
  @Index()
  path: string; // Materialized path e.g. "/c100/c101/c102/"

  @Column({ default: 0 })
  depth: number; // 0 = Root, 1 = L1, 2 = L2

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  @Index()
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  @Column({ type: 'varchar', default: 'OK' })
  migrationStatus: 'OK' | 'NEEDS_CATALOG_REVIEW';

  @Column({ default: true })
  isMarketplace: boolean;

  @Column({ default: false })
  isQuickCommerce: boolean;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  keywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Category Attribute Key Association Entity
@Entity('category_attribute_keys')
export class CategoryAttributeKey {
  @PrimaryColumn()
  categoryId: string;

  @PrimaryColumn()
  attributeKeyId: string;

  @Column({ default: true })
  isFilterable: boolean;

  @Column({ default: false })
  isRequired: boolean;
}

// Product Entity
@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  brandId: string;

  @Column()
  categoryId: string;

  @Column({ nullable: true })
  @Index()
  categoryPath: string; // Derived search projection e.g. "/c100/c101/"

  @Column()
  title: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', default: 'OK' })
  migrationStatus: 'OK' | 'NEEDS_CATALOG_REVIEW';

  @Column({ default: false })
  isQuickCommerce: boolean;

  @Column({ type: 'float', default: 4.5 })
  rating: number;

  @Column({ default: 12 })
  reviewCount: number;

  @Column({ default: 'STANDARD' })
  taxClass: string;

  // DEPRECATED COMPATIBILITY PROJECTIONS (Read-Only for clients, managed by service)
  @Column({ nullable: true })
  legacyVendorId: string;

  @Column({ nullable: true })
  vendorId: string; // Deprecated alias for legacyVendorId

  @Column({ nullable: true })
  sku: string; // Deprecated: projects primary variant SKU

  @Column({ type: 'float', nullable: true })
  basePrice: number; // Deprecated catalog MSRP

  @Column({ type: 'float', nullable: true })
  discountPrice: number; // Deprecated catalog discount price

  @Column({ type: 'text', default: '[]' })
  colorsJson: string; // Deprecated option projection

  @Column({ type: 'text', default: '[]' })
  sizesJson: string; // Deprecated option projection

  @Column({ nullable: true })
  imageUrl: string; // Deprecated primary image projection

  @Column({ nullable: true })
  subCategory: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ProductVariant (SKU) Entity
@Entity('product_variants')
@Index(['productId', 'attributeSignature'], { unique: true })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ unique: true })
  sku: string; // Authoritative SKU Code (e.g. SKU-PROD-001)

  @Column({ nullable: true })
  gtin: string; // Barcode / EAN-13 / UPC

  @Column({ default: 'Default' })
  title: string; // e.g. "Red / XL" or "500g"

  @Column({ default: '' })
  attributeSignature: string; // Deterministic hash/signature e.g. "key1_val1|key2_val2"

  // Reference MSRP (Non-authoritative catalog MSRP; commercial pricing belongs to CMD-014 Price Engine)
  @Column({ type: 'float', default: 0.0 })
  referenceMsrp: number;

  @Column({ type: 'float', nullable: true })
  referenceDiscountPrice: number;

  // Grocery & Quick-Commerce Unit Semantics
  @Column({ type: 'float', nullable: true })
  netQuantity: number; // e.g. 500, 1, 6

  @Column({ type: 'varchar', nullable: true })
  unitOfMeasure: 'g' | 'kg' | 'ml' | 'L' | 'pack' | 'pc' | 'unit';

  @Column({ type: 'int', default: 1 })
  quantityPerPack: number;

  @Column({ type: 'float', nullable: true })
  weightKg: number;

  @Column({ default: false })
  isDefault: boolean; // True for single-SKU products

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Attribute Entities & Mappings
@Entity('attribute_keys')
export class AttributeKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Color", "Size", "Storage", "Pack Size"

  @Column({ unique: true })
  code: string; // e.g. "color", "size", "storage", "pack_size"
}

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attributeKeyId: string; // Enforces key ownership!

  @Column()
  value: string; // e.g. "Red", "XL", "256GB", "500g"

  @Column()
  code: string; // e.g. "red", "xl", "256gb", "500g"
}

@Entity('product_variant_attributes')
export class ProductVariantAttribute {
  @PrimaryColumn()
  variantId: string;

  @PrimaryColumn()
  attributeKeyId: string;

  @PrimaryColumn()
  attributeValueId: string;
}

// Media Entities
@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ nullable: true })
  altText: string;
}

@Entity('variant_images')
export class VariantImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  variantId: string;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: false })
  isPrimary: boolean;
}

// Seller Listing Entity
@Entity('seller_listings')
export class SellerListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  variantId: string;

  @Column()
  vendorId: string; // Seller identity

  @Column({ type: 'varchar', nullable: true })
  shopId?: string | null; // Flado Darkstore ID

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'bigint', default: 0, nullable: true, transformer: BigIntSafeTransformer })
  priceMinor: number = 0;

  @Column({ type: 'bigint', nullable: true, transformer: BigIntSafeTransformer })
  compareAtPriceMinor: number | null = null;

  @Column({ type: 'varchar', default: 'INR' })
  currency: string = 'INR';

  @CreateDateColumn()
  createdAt: Date;
}

// Inventory Entity (Legacy Read-Only Projection)
@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  listingId: string;

  @Column({ nullable: true })
  variantId: string; // Authoritative variant FK

  @Column({ nullable: true })
  productId: string;

  @Column()
  vendorId: string;

  @Column({ nullable: true })
  shopId: string;

  @Column({ nullable: true })
  variantName: string; // Legacy free-form variant name

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({ default: 5 })
  lowStockThreshold: number;

  @Column({ nullable: true })
  categoryId?: string;

  @Column({ type: 'text', default: '[]' })
  tagsJson?: string;

  @Column({ default: false })
  isFeatured?: boolean;

  @Column({ type: 'int', default: 0 })
  featuredPriority?: number;

  @Column({ type: 'varchar', default: 'OK' })
  migrationStatus: 'OK' | 'UNMAPPED_VARIANT';

  @UpdateDateColumn()
  updatedAt: Date;
}

// Stock History Audit Trail Entity
@Entity('stock_history')
export class StockHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryId: string;

  @Column()
  vendorId: string;

  @Column({ type: 'varchar', nullable: true })
  variantId: string;

  @Column({ type: 'varchar', nullable: true })
  shopId: string;

  @Column({ type: 'varchar' })
  adjustmentType: 'MANUAL_INCREASE' | 'MANUAL_DECREASE' | 'ORDER_SALE' | 'CANCELLATION_RESTOCK' | 'RETURN_RESTOCK' | 'CORRECTION_DAMAGE' | 'DARKSTORE_ALLOCATION';

  @Column({ default: 0 })
  previousQuantity: number;

  @Column({ default: 0 })
  newQuantity: number;

  @Column({ default: 0 })
  deltaQuantity: number;

  @Column({ type: 'text', nullable: true })
  reasonNote: string | null;

  @Column({ type: 'varchar', nullable: true })
  actorUserId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

// Price History Audit Trail Entity
@Entity('price_history')
export class PriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  variantId: string;

  @Column()
  vendorId: string;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  previousPriceMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  newPriceMinor: number = 0;

  @Column({ type: 'bigint', nullable: true, transformer: BigIntSafeTransformer })
  previousCompareAtPriceMinor: number | null = null;

  @Column({ type: 'bigint', nullable: true, transformer: BigIntSafeTransformer })
  newCompareAtPriceMinor: number | null = null;

  @Column({ type: 'datetime', nullable: true })
  promoStartDate: Date | null = null;

  @Column({ type: 'datetime', nullable: true })
  promoEndDate: Date | null = null;

  @Column({ type: 'text', nullable: true })
  reasonNote: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  actorUserId: string | null = null;

  @CreateDateColumn()
  createdAt: Date;
}

// Vendor Settlement Ledger Entity
@Entity('vendor_settlement_ledger')
export class VendorSettlementLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  vendorId: string;

  @Column({ type: 'varchar' })
  sourceType: 'ORDER_SALE' | 'RETURN_REFUND' | 'CANCELLATION_ADJUSTMENT' | 'MANUAL_PAYOUT';

  @Index()
  @Column()
  sourceId: string;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  grossAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  commissionAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  taxWithholdingMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  netAmountMinor: number = 0;

  @Column({ type: 'varchar', default: 'CREDIT' })
  direction: 'CREDIT' | 'DEBIT';

  @Column({ default: 'INR' })
  currency: string = 'INR';

  @Column({ type: 'text', nullable: true })
  description: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  payoutId: string | null = null;

  @CreateDateColumn()
  createdAt: Date;
}

// Vendor Payout Entity
@Entity('vendor_payouts')
export class VendorPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  vendorId: string;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  grossAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  commissionAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  taxWithholdingMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  netPayoutMinor: number = 0;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';

  @Column({ type: 'datetime', nullable: true })
  periodStart: Date | null = null;

  @Column({ type: 'datetime', nullable: true })
  periodEnd: Date | null = null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountNumberMasked: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  bankIfsc: string | null = null;

  @Column({ type: 'text', nullable: true })
  failureReason: string | null = null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Vendor Staff Entity
@Entity('vendor_staff')
export class VendorStaff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  vendorId: string;

  @Index()
  @Column()
  userId: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', default: 'FULFILLMENT_STAFF' })
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'varchar', nullable: true })
  invitedByUserId: string | null;

  @Column({ type: 'text', nullable: true })
  assignedShopIdsJson?: string | null; // Stores darkstore shop IDs e.g. ["shop-flado-001"]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Vendor Invitation Entity
@Entity('vendor_invitations')
export class VendorInvitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  vendorId: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', default: 'FULFILLMENT_STAFF' })
  vendorRole: 'OWNER' | 'MANAGER' | 'FULFILLMENT_STAFF';

  @Column()
  tokenHash: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';

  @Column()
  invitedByUserId: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

// Vendor Activity Log Entity
@Entity('vendor_activity_logs')
export class VendorActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  vendorId: string;

  @Column({ type: 'varchar', nullable: true })
  actorUserId: string | null;

  @Column({ type: 'varchar', nullable: true })
  actorEmail: string | null;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  metadataJson: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

// Order Entity
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ type: 'float' })
  totalAmount: number; // Deprecated projection

  @Column({ type: 'float', default: 0.0 })
  discountAmount: number; // Deprecated projection

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  itemsSubtotalMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  discountAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  taxAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  feeAmountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  totalAmountMinor: number = 0;

  @Column({ type: 'text', nullable: true })
  pricingSnapshotJson: string | null;

  @Column({ type: 'varchar', default: 'PLACED' })
  status:
    | 'PLACED'
    | 'PREPARING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';

  @Column({ type: 'text', default: '{}' })
  shippingAddress: string;

  @Column({ type: 'text', default: '{}' })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  itemsSummary: string;

  @Column({ type: 'text', nullable: true })
  deliveryAddress: string;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  paymentIntentId?: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  orderNumber?: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD_PENDING';

  @Column({ type: 'text', nullable: true })
  fulfillmentGroupsJson?: string;

  @Column({ type: 'varchar', nullable: true })
  verificationOtp: string;

  @Column({ default: 20 })
  deliveryMinutes: number;

  @Column({ type: 'varchar', nullable: true })
  riderId: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  shopId?: string | null; // Associated Flado shop ID

  // CMD-088 Quick-Commerce Picking Session Columns
  @Column({ type: 'varchar', nullable: true })
  pickerUserId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  pickerName?: string | null;

  @Column({ type: 'varchar', default: 'NOT_STARTED' })
  pickingStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PARTIAL_OOS';

  @Column({ type: 'datetime', nullable: true })
  pickingStartedAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  pickingCompletedAt?: Date | null;

  // CMD-089 Rider Handoff & Pickup OTP Columns
  @Column({ type: 'varchar', nullable: true })
  riderName?: string | null;

  @Column({ type: 'varchar', nullable: true })
  riderPhone?: string | null;

  @Column({ type: 'varchar', nullable: true })
  pickupOtpHash?: string | null;

  @Column({ type: 'datetime', nullable: true })
  pickupOtpExpiresAt?: Date | null;

  @Column({ type: 'int', default: 0 })
  pickupOtpAttemptCount?: number;

  @Column({ default: false })
  pickupOtpLocked?: boolean;

  @Column({ type: 'datetime', nullable: true })
  pickupOtpUsedAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  handoffCompletedAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// OrderItem Entity
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  variantId: string;

  @Column({ type: 'varchar', nullable: true })
  sku: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  variantTitle: string;

  @Column()
  vendorId: string;

  @Column({ type: 'varchar', nullable: true })
  fulfillmentSourceId?: string;

  @Column({ type: 'varchar', default: 'ALLOW_SUBSTITUTION' })
  substitutionPreference?: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';

  @Column({ type: 'varchar', nullable: true })
  inventoryId: string;

  @Column()
  quantity: number;

  @Column({ type: 'int', default: 0 })
  cancelledQuantity: number;

  @Column({ type: 'int', default: 0 })
  pickedQuantity?: number;

  @Column({ type: 'varchar', default: 'PENDING' })
  pickingItemStatus?: 'PENDING' | 'PICKED' | 'OUT_OF_STOCK' | 'SUBSTITUTED';

  @Column({ type: 'float' })
  unitPrice: number; // Deprecated projection

  @Column({ type: 'float' })
  subtotal: number; // Deprecated projection

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  unitPriceMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  discountMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  subtotalMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  taxAmountMinor: number = 0;

  @Column({ type: 'varchar', default: 'PLACED' })
  status:
    | 'PLACED'
    | 'PREPARING'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';

  @CreateDateColumn()
  createdAt: Date;
}

// Payment Entity
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  method: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

  @Column({ nullable: true })
  transactionId: string;

  @Column({ type: 'text', nullable: true })
  gatewayResponse: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// PaymentIntent Entity (CMD-045)
export type PaymentIntentStatus =
  | 'CREATED'
  | 'REQUIRES_ACTION'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED';

@Entity('payment_intents')
export class PaymentIntent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  customerId: string;

  @Index()
  @Column({ nullable: true })
  cartId?: string;

  @Column({ type: 'bigint' })
  amountMinor: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  amountCapturedMinor?: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column()
  paymentMethod: string;

  @Column({ default: 'GENERIC' })
  provider: string;

  @Column({ type: 'varchar', default: 'CREATED' })
  status: PaymentIntentStatus;

  @Index({ unique: true })
  @Column({ nullable: true })
  idempotencyKey?: string;

  @Column({ nullable: true })
  providerReference?: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ type: 'text', nullable: true })
  clientSecret?: string;

  @Column({ type: 'text', nullable: true })
  metadataJson?: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// PaymentAttempt Entity (CMD-045)
export type PaymentAttemptStatus = 'INITIATED' | 'PROCESSING' | 'SUCCESS' | 'FAILURE';

@Entity('payment_attempts')
export class PaymentAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  paymentIntentId: string;

  @Column()
  provider: string;

  @Column({ nullable: true })
  providerAttemptId?: string;

  @Column({ type: 'varchar', default: 'INITIATED' })
  status: PaymentAttemptStatus;

  @Column({ nullable: true })
  failureCode?: string;

  @Column({ type: 'text', nullable: true })
  failureMessage?: string;

  @Column({ type: 'text', nullable: true })
  sanitizedResponseJson?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Coupon Entity
@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @Column()
  discountPercent: number;

  @Column({ default: false })
  isRedeemed: boolean;

  @Column({ default: 'PERCENT' })
  type: string;

  @Column({ type: 'float', default: 0.0 })
  value: number; // Deprecated projection

  @Column({ type: 'float', default: 0.0 })
  minOrderAmount: number; // Deprecated projection

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  valueMinor: number = 0;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  minOrderAmountMinor: number = 0;

  @Column({ type: 'bigint', nullable: true, transformer: BigIntSafeTransformer })
  maxDiscountAmountMinor: number | null = null;

  @Column({ default: 100 })
  maxUses: number;

  @Column({ default: 0 })
  usedCount: number;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({ default: true })
  isActive: boolean;
}

// UserWallet Entity
@Entity('user_wallets')
export class UserWallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'float', default: 500.0 })
  balance: number;

  @Column({ default: 120 })
  rewardPoints: number;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Darkstore Entity (legacy - kept for backward compat)
@Entity('darkstores')
export class Darkstore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  vendorId: string;

  @Column({ nullable: true })
  ownerName: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ type: 'float', default: 5.0 })
  serviceRadiusKm: number;

  @Column({ default: true })
  isActive: boolean;
}

// ─────────────────────────────────────────────
// FLADO QUICK COMMERCE ENTITIES
// ─────────────────────────────────────────────

// FladoShop — every registered local shop on Flado
@Entity('flado_shops')
export class FladoShop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Owner identity
  @Column()
  ownerName: string;

  @Column({ unique: true })
  ownerPhone: string;

  @Column({ nullable: true })
  ownerUserId: string; // links to users table once auth is added

  @Column({ nullable: true })
  vendorId?: string; // links to vendor account if applicable

  // Shop identity
  @Column()
  shopName: string;

  @Column({ type: 'text', nullable: true })
  shopDescription: string;

  @Column({ nullable: true })
  shopBannerUrl: string;

  @Column({ nullable: true })
  shopLogoUrl: string;

  // Categories — stored as JSON array e.g. ["Grocery","Dairy","Bakery"]
  @Column({ type: 'text', default: '[]' })
  categoriesJson: string;

  // Location
  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  city: string; // 'Muzaffarpur' | 'Maunath Bhanjan'

  @Column({ nullable: true })
  state: string; // 'Bihar' | 'Uttar Pradesh'

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  // Delivery zone (500m = 0.5, 1km = 1.0, ... 3km = 3.0)
  @Column({ type: 'float', default: 1.0 })
  deliveryRadiusKm: number;

  // Delivery fee settings — shop owner controls this
  @Column({ type: 'varchar', default: 'FREE' })
  deliveryFeeType: 'FREE' | 'PAID';

  @Column({ type: 'float', default: 0.0 })
  deliveryFeeAmount: number; // only used if deliveryFeeType = 'PAID'

  @Column({ type: 'float', nullable: true })
  minimumOrderAmount: number; // Authoritative minimum order amount (optional, in currency units)

  // Operational status
  @Column({ default: false })
  isOpen: boolean; // shop open/close toggle (real-time)

  @Column({ type: 'text', nullable: true })
  operatingHoursJson?: string; // Weekly operating schedule e.g. {"mon":{"open":"08:00","close":"22:00"}, ...}

  @Column({ type: 'int', default: 20 })
  maxActiveOrders?: number; // Maximum concurrent active orders before AT_CAPACITY

  @Column({ type: 'varchar', default: 'PENDING' })
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

  @Column({ nullable: true })
  approvalNote: string; // admin note on approval/rejection

  @Column({ nullable: true })
  approvedByAdminId: string;

  @Column({ nullable: true })
  approvedAt: Date;

  // Physical verification by a Flado field agent
  @Column({ default: false })
  isPhysicallyVerified: boolean;

  @Column({ nullable: true })
  verifiedByAgentId: string;

  @Column({ nullable: true })
  verifiedAt: Date;

  // Rating
  @Column({ type: 'float', default: 0.0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  // Shop personality
  @Column({ type: 'text', nullable: true })
  ownerStory: string; // "Family business since 1995"

  @Column({ type: 'text', default: '[]' })
  shopPhotosJson: string; // array of image URLs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// InventoryLocation Entity (CMD-012)
@Entity('inventory_locations')
@Index(['tenantType', 'tenantId', 'code'], { unique: true })
@Index(['vendorId', 'status'])
@Index(['shopId', 'status'])
@Index(['type', 'status'])
export class InventoryLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', default: 'PLATFORM' })
  tenantType: 'VENDOR' | 'MERCHANT' | 'PLATFORM';

  @Column({ type: 'varchar', default: 'PLATFORM' })
  tenantId: string; // vendorId, shopId, or 'PLATFORM'

  @Column()
  code: string; // Scoped code e.g. "WH-01"

  @Column()
  name: string; // e.g. "Dubai Central Warehouse"

  @Column({ type: 'varchar' })
  type:
    | 'VENDOR_WAREHOUSE'
    | 'MARKETPLACE_WAREHOUSE'
    | 'FULFILLMENT_CENTER'
    | 'MERCHANT_SHOP'
    | 'DARK_STORE'
    | 'RETAIL_STORE';

  @Column({ type: 'varchar', default: 'ACTIVE' })
  @Index()
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

  @ManyToOne(() => Vendor, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  vendorId: string | null;

  @ManyToOne(() => FladoShop, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'shopId' })
  shop: FladoShop;

  @Column({ type: 'varchar', nullable: true })
  @Index()
  shopId: string | null;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ default: 'AE' })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ default: true })
  isMarketplace: boolean;

  @Column({ default: false })
  isQuickCommerce: boolean;

  @Column({ default: false })
  isFulfillmentCenter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// InventoryBalance Entity (CMD-012)
@Entity('inventory_balances')
@Index(['locationId', 'sellerListingId'], { unique: true })
@Index(['variantId', 'locationId'])
@Index(['vendorId', 'locationId'])
export class InventoryBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryLocation, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'locationId' })
  location: InventoryLocation;

  @Column()
  locationId: string;

  @ManyToOne(() => SellerListing, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sellerListingId' })
  sellerListing: SellerListing;

  @Column()
  sellerListingId: string;

  @Column()
  variantId: string; // Derived SKU projection (must match sellerListing.variantId)

  @Column()
  vendorId: string; // Derived Vendor projection (must match sellerListing.vendorId)

  @Column({ type: 'varchar', nullable: true })
  shopId: string | null; // Derived Shop projection (must match location.shopId)

  @Column({ type: 'int', default: 0 })
  onHand: number;

  @Column({ type: 'int', default: 0 })
  reserved: number;

  @Column({ type: 'int', default: 0 })
  damaged: number;

  @Column({ type: 'int', default: 0 })
  safetyStock: number;

  @Column({ type: 'int', default: 5 })
  lowStockThreshold: number;

  @Column({ type: 'varchar', default: 'OK' })
  migrationStatus: 'OK' | 'NEEDS_INVENTORY_REVIEW';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ShopSubscription — admin sets the monthly fee per shop at approval time
@Entity('flado_shop_subscriptions')
export class ShopSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopId: string;

  @Column({ type: 'float' })
  monthlyFeeAmount: number; // ₹ amount set by admin (e.g. 500, 1000, 2000)

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'OVERDUE' | 'CANCELLED' | 'FREE_TRIAL';

  @Column({ nullable: true })
  validFrom: Date;

  @Column({ nullable: true })
  validUntil: Date;

  @Column({ nullable: true })
  setByAdminId: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ShopCredit — Digital Udhaar wallet: per shop-customer pair
@Entity('flado_shop_credits')
export class ShopCredit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopId: string;

  @Column()
  customerPhone: string; // identify customer by phone (no auth required)

  @Column({ nullable: true })
  customerName: string;

  // Credit limit is set freely by the shop owner — no platform cap
  @Column({ type: 'float', default: 0.0 })
  creditLimit: number;

  // Outstanding balance (how much customer owes)
  @Column({ type: 'float', default: 0.0 })
  outstandingBalance: number;

  // Status — shop owner controls this
  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'FROZEN' | 'SETTLED';

  @Column({ nullable: true })
  repaymentDeadline: Date;

  @Column({ nullable: true })
  lastReminderSentAt: Date;

  @Column({ nullable: true })
  notes: string; // shop owner can add a private note

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// CreditTransaction — debit or repayment event on a ShopCredit account
@Entity('flado_credit_transactions')
export class CreditTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopCreditId: string;

  @Column()
  shopId: string;

  @Column()
  customerPhone: string;

  @Column({ type: 'varchar' })
  type: 'DEBIT' | 'REPAYMENT'; // DEBIT = purchase on credit, REPAYMENT = customer paid back

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  balanceAfter: number; // outstanding balance after this transaction

  @Column({ nullable: true })
  orderId: string; // linked order for DEBIT transactions

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────
// REVIEWS, RETURNS & WISHLIST ENTITIES
// ─────────────────────────────────────────────

@Entity('product_reviews')
export class ProductReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ nullable: true })
  vendorId: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'int' })
  rating: number; // 1 to 5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  @Column({ type: 'text', default: '[]' })
  mediaUrlsJson: string;

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: 0 })
  reportCount: number;

  @Column({ default: true })
  isApproved: boolean;

  @Column({ type: 'varchar', default: 'APPROVED' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';

  @Column({ type: 'text', nullable: true })
  vendorResponseText: string;

  @Column({ nullable: true })
  vendorRespondedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('return_requests')
export class ReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  orderId: string;

  @Column({ nullable: true })
  orderItemId?: string;

  @Index()
  @Column()
  customerId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'REFUND' })
  resolutionChoice: 'REFUND' | 'REPLACEMENT';

  @Column({ type: 'varchar', default: 'PICKUP' })
  fulfillmentType: 'PICKUP' | 'DROPOFF';

  @Column({ type: 'text', default: '[]' })
  evidenceUrlsJson: string;

  @Column({ type: 'varchar', default: 'PENDING_INSPECTION' })
  qcStatus: 'PENDING_INSPECTION' | 'QC_PASSED' | 'QC_FAILED';

  @Column({ type: 'text', nullable: true })
  qcNotes?: string;

  @Column({ type: 'varchar', default: 'REQUESTED' })
  status: 'REQUESTED' | 'APPROVED' | 'PICKUP_SCHEDULED' | 'IN_TRANSIT' | 'QC_PENDING' | 'RESOLVED_REFUND' | 'RESOLVED_REPLACEMENT' | 'REJECTED';

  @Column({ type: 'float', default: 0.0 })
  refundAmount: number;

  @Column({ type: 'int', default: 0 })
  refundAmountMinor: number;

  @Column({ type: 'text', nullable: true })
  pickupAddressJson?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('return_tracking_events')
export class ReturnTrackingEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  returnRequestId: string;

  @Column()
  eventType: string;

  @Column()
  statusText: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  actorRole?: string;

  @CreateDateColumn()
  occurredAt: Date;
}

@Entity('user_wishlist')
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────
// FESTIVAL & CAMPAIGN ENTITIES
// ─────────────────────────────────────────────

@Entity('flash_sales')
export class FlashSale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', default: 0.0 })
  discountPercent: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  startsAt: Date;

  @Column({ nullable: true })
  endsAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  linkUrl: string;

  @Column({ default: 'home' })
  position: string; // 'home' | 'flado' | 'category'

  @Column({ nullable: true })
  city: string; // 'Muzaffarpur' | 'Maunath Bhanjan' | 'All'

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────
// RIDER & DELIVERY ENTITIES
// ─────────────────────────────────────────────

@Entity('riders')
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopId: string; // Shop owner managed rider

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: 'Bicycle' })
  vehicleType: string; // 'Bicycle' | 'Motorbike' | 'Scooter'

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 0 })
  totalDeliveries: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('shop_hours')
export class ShopHours {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() shopId: string;
  @Column() dayOfWeek: number; // 0=Sunday, 6=Saturday
  @Column({ nullable: true }) openTime: string; // '09:00'
  @Column({ nullable: true }) closeTime: string; // '22:00'
  @Column({ default: true }) isOpen: boolean;
  @CreateDateColumn() createdAt: Date;
}

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column({ type: 'varchar' }) type: 'EARN' | 'BURN' | 'EXPIRE' | 'REFERRAL';
  @Column({ type: 'int' }) points: number; // positive=earn, negative=burn
  @Column({ type: 'float', default: 0 }) monetaryValue: number; // ₹ equivalent
  @Column({ nullable: true }) orderId: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ nullable: true }) adminId: string;
  @Column({ nullable: true }) actorId: string;
  @Column({ nullable: true }) actorRole: string;
  @Column() action: string; // 'AUTH_LOGIN', 'ORDER_STATUS_UPDATE', 'SDUI_UPDATE', etc.
  @Column({ nullable: true }) targetId: string;
  @Column({ nullable: true }) resourceId: string;
  @Column({ nullable: true }) targetType: string;
  @Column({ nullable: true }) resourceType: string;
  @Column({ nullable: true }) vendorId: string;
  @Column({ nullable: true }) shopId: string;
  @Column({ type: 'text', nullable: true }) details: string; // Redacted JSON string
  @Column({ nullable: true }) ipAddress: string;
  @Column({ nullable: true }) userAgent: string;
  @CreateDateColumn() createdAt: Date;
}

@Entity('idempotency_keys')
export class IdempotencyKey {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) scopedKey: string;
  @Column() actorId: string;
  @Column() operation: string;
  @Column() idempotencyKey: string;
  @Column() requestHash: string;
  @Column({ type: 'varchar', default: 'PROCESSING' }) status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  @Column({ type: 'int', nullable: true }) statusCode: number;
  @Column({ type: 'text', nullable: true }) responseBody: string;
  @Column({ type: 'datetime' }) expiresAt: Date;
  @CreateDateColumn() createdAt: Date;
}

// ─────────────────────────────────────────────
// ATOMIC INVENTORY RESERVATION ENTITIES (CMD-013)
// ─────────────────────────────────────────────

@Entity('inventory_reservations')
@Index(['reservationToken'], { unique: true })
@Index(['customerId'])
@Index(['status', 'expiresAt'])
export class InventoryReservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reservationToken: string; // Cryptographically secure UUID (e.g. RES-crypto.randomUUID())

  @Column()
  customerId: string;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'CONSUMED' | 'RELEASED' | 'EXPIRED';

  @Column({ type: 'int', default: 900 })
  ttlSeconds: number;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  consumedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  releasedAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  idempotencyKey: string | null;

  @Column({ type: 'text', nullable: true })
  metadata: string | null;

  @OneToMany(() => InventoryReservationItem, (item) => item.reservation, {
    cascade: true,
  })
  items: InventoryReservationItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('inventory_reservation_items')
@Index(['reservationId'])
@Index(['balanceId'])
export class InventoryReservationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryReservation, (res) => res.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservationId' })
  reservation: InventoryReservation;

  @Column()
  reservationId: string;

  @ManyToOne(() => InventoryBalance, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'balanceId' })
  balance: InventoryBalance;

  @Column()
  balanceId: string;

  @Column({ type: 'int' })
  quantity: number;
}

// ─────────────────────────────────────────────
// PRICE ENGINE ENTITIES (CMD-014)
// ─────────────────────────────────────────────

@Entity('seller_listing_price_overrides')
@Index(['sellerListingId', 'locationId'], { unique: true })
export class SellerListingPriceOverride {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sellerListingId: string;

  @Column({ type: 'varchar', nullable: true })
  locationId: string | null;

  @Column({ type: 'bigint', default: 0, transformer: BigIntSafeTransformer })
  priceMinor: number;

  @Column({ type: 'bigint', nullable: true, transformer: BigIntSafeTransformer })
  compareAtPriceMinor: number | null;

  @Column({ type: 'datetime', nullable: true })
  startsAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  endsAt: Date | null;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('promotions')
@Index(['isActive', 'startsAt', 'endsAt'])
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'varchar' })
  type: 'FLASH_SALE' | 'CATEGORY_DISCOUNT' | 'BRAND_DISCOUNT' | 'SELLER_PROMO';

  @Column({ type: 'varchar' })
  discountType: 'PERCENT' | 'FLAT_AMOUNT';

  @Column({ type: 'int' })
  discountValue: number; // Basis points for PERCENT (e.g., 1500 = 15.00%), minor units for FLAT_AMOUNT

  @Column({ type: 'datetime' })
  startsAt: Date;

  @Column({ type: 'datetime' })
  endsAt: Date;

  @Column({ type: 'varchar', default: 'ALL' })
  surface: 'ALL' | 'MARKETPLACE' | 'QUICK_COMMERCE';

  @Column({ type: 'varchar', default: 'ALL' })
  targetType: 'ALL' | 'CATEGORY' | 'BRAND' | 'VARIANT' | 'SELLER_LISTING';

  @Column({ type: 'varchar', nullable: true })
  targetId: string | null;

  @Column({ type: 'varchar', nullable: true })
  vendorId: string | null;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('tax_categories')
export class TaxCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: 'STANDARD' | 'REDUCED' | 'ZERO' | 'EXEMPT';

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  rateBasisPoints: number; // e.g. 500 = 5.00% GST/VAT

  @CreateDateColumn()
  createdAt: Date;
}

// Cart Entity (CMD-039)
@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  customerId: string;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: 'ACTIVE' | 'ORDERED' | 'ABANDONED';

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// CartItem Entity (CMD-039)
@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  cartId: string;

  @Column()
  sku: string;

  @Column({ nullable: true })
  variantId: string;

  @Column({ nullable: true })
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ nullable: true })
  fulfillmentSourceId?: string;

  @Column({ type: 'varchar', default: 'ALLOW_SUBSTITUTION' })
  substitutionPreference: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ─────────────────────────────────────────────
// ORDER TRACKING EVENT ENTITY (CMD-048)
// ─────────────────────────────────────────────

@Entity('order_tracking_events')
export class OrderTrackingEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  orderId: string;

  @Column()
  eventType: string;

  @Column()
  statusText: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  occurredAt: Date;

  @Column({ nullable: true })
  fulfillmentSourceId?: string;

  @Column({ nullable: true })
  riderId?: string;

  @Column({ nullable: true })
  carrierName?: string;

  @Column({ nullable: true })
  carrierTrackingNumber?: string;

  @Column({ nullable: true })
  locationText?: string;

  @Column({ type: 'text', nullable: true })
  metadataJson?: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────
// ORDER CANCELLATION ENTITY (CMD-049)
// ─────────────────────────────────────────────

@Entity('order_cancellations')
export class OrderCancellation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  orderId: string;

  @Index()
  @Column()
  customerId: string;

  @Column({ default: 'CHANGED_MIND' })
  reasonCode: string;

  @Column({ type: 'text', nullable: true })
  reasonText?: string;

  @Column({ type: 'int', default: 0 })
  cancellationFeeMinor: number;

  @Column({ type: 'int', default: 0 })
  refundAmountMinor: number;

  @Column({ type: 'varchar', default: 'FULL' })
  cancellationType: 'FULL' | 'PARTIAL';

  @Column({ type: 'text', nullable: true })
  cancelledItemsJson?: string;

  @Column({ type: 'varchar', default: 'NO_REFUND_COD' })
  refundStatusText: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────
// REFUND ENTITIES (CMD-051)
// ─────────────────────────────────────────────

@Entity('refunds')
@Unique(['sourceType', 'sourceId'])
export class Refund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  orderId: string;

  @Index()
  @Column()
  customerId: string;

  @Index()
  @Column({ nullable: true })
  paymentIntentId?: string;

  @Column({ type: 'varchar' })
  sourceType: 'CANCELLATION' | 'RETURN' | 'MANUAL_ADJUSTMENT';

  @Index()
  @Column()
  sourceId: string;

  @Column({ type: 'int', default: 0 })
  amountMinor: number;

  @Column({ type: 'varchar', default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', default: 'ORIGINAL_PAYMENT_METHOD' })
  destination: 'ORIGINAL_PAYMENT_METHOD' | 'CUSTOMER_WALLET' | 'NOT_REQUIRED';

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'NOT_REQUIRED';

  @Column({ type: 'text', nullable: true })
  failureCode?: string;

  @Column({ type: 'text', nullable: true })
  failureMessage?: string;

  @Index({ unique: true, sparse: true })
  @Column({ nullable: true })
  idempotencyKey?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  completedAt?: Date;
}

@Entity('refund_items')
export class RefundItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  refundId: string;

  @Index()
  @Column()
  orderItemId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  amountMinor: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('refund_attempts')
export class RefundAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  refundId: string;

  @Column({ default: 'GENERIC' })
  provider: string;

  @Index()
  @Column({ nullable: true })
  providerRefundReference?: string;

  @Column({ type: 'varchar', default: 'PROCESSING' })
  status: 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'NOT_REQUIRED';

  @Column({ type: 'text', nullable: true })
  sanitizedResponseJson?: string;

  @Column({ type: 'text', nullable: true })
  failureCode?: string;

  @Column({ type: 'text', nullable: true })
  failureMessage?: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ─────────────────────────────────────────────
// ORDER ITEM SUBSTITUTION ENTITY (CMD-056)
// ─────────────────────────────────────────────

@Entity('order_item_substitutions')
export class OrderItemSubstitution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  orderId: string;

  @Index()
  @Column()
  orderItemId: string;

  @Index()
  @Column()
  customerId: string;

  @Column()
  originalProductId: string;

  @Column({ nullable: true })
  originalVariantId?: string;

  @Column()
  originalSku: string;

  @Column()
  substituteProductId: string;

  @Column({ nullable: true })
  substituteVariantId?: string;

  @Column()
  substituteSku: string;

  @Column()
  fulfillmentSourceId: string;

  @Column({ type: 'varchar', default: 'CONTACT_ME' })
  preference: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';

  @Column({ type: 'varchar', default: 'PROPOSED' })
  status: 'PROPOSED' | 'AWAITING_CUSTOMER' | 'APPROVED' | 'REJECTED' | 'AUTO_APPROVED' | 'EXPIRED' | 'FULFILLED' | 'CANCELLED';

  @Column({ type: 'int', default: 0 })
  originalUnitPriceMinor: number;

  @Column({ type: 'int', default: 0 })
  substituteUnitPriceMinor: number;

  @Column({ type: 'int', default: 0 })
  priceDifferenceMinor: number;

  @Column({ default: 'ORIGINAL_ITEM_UNAVAILABLE' })
  reasonCode: string;

  @Column({ nullable: true })
  proposedAt?: Date;

  @Column({ nullable: true })
  decidedAt?: Date;

  @Column({ nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Device Token Entity for Mobile Push (CMD-069)
@Entity('device_tokens')
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'varchar', default: 'ANDROID' })
  platform: 'IOS' | 'ANDROID' | 'WEB';

  @Column({ nullable: true })
  deviceId?: string;

  @Column({ default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

// Notification Preference Entity (CMD-069)
@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryColumn('uuid')
  userId: string;

  @Column({ default: true })
  orders: boolean;

  @Column({ default: true })
  delivery: boolean;

  @Column({ default: true })
  refunds: boolean;

  @Column({ default: true })
  returns: boolean;

  @Column({ default: true })
  promotions: boolean;

  @Column({ default: true })
  quickDelivery: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ── FEAT-001: Support Ticket Entities ────────────────────────────────────────

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  ticketNumber: string;

  @Index()
  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName?: string;

  @Column({ type: 'varchar', nullable: true })
  customerEmail?: string;

  @Column({ type: 'varchar', default: 'OTHER' })
  category:
    | 'ORDER'
    | 'DELIVERY'
    | 'PAYMENT'
    | 'REFUND'
    | 'RETURN'
    | 'PRODUCT'
    | 'ACCOUNT'
    | 'QUICK_COMMERCE'
    | 'TECHNICAL'
    | 'OTHER';

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', default: 'NORMAL' })
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

  @Column({ type: 'varchar', default: 'OPEN' })
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';

  @Index()
  @Column({ type: 'varchar', nullable: true })
  orderId?: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  refundId?: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  returnRequestId?: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  assignedAgentId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  assignedAgentName?: string | null;

  @Column({ type: 'datetime', nullable: true })
  lastCustomerReplyAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lastAgentReplyAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  closedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('support_ticket_messages')
export class SupportTicketMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  ticketId: string;

  @Column({ type: 'varchar' })
  senderUserId: string;

  @Column({ type: 'varchar', nullable: true })
  senderName?: string;

  @Column({ type: 'varchar' })
  senderRole: 'CUSTOMER' | 'SUPPORT_AGENT' | 'OPERATIONS' | 'SUPER_ADMIN' | 'SYSTEM';

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  isInternalNote: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('support_ticket_attachments')
export class SupportTicketAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  ticketId: string;

  @Column({ type: 'varchar', nullable: true })
  messageId?: string | null;

  @Column({ type: 'varchar' })
  originalFilename: string;

  @Column({ type: 'varchar' })
  storageKey: string;

  @Column({ type: 'varchar' })
  mimeType: string;

  @Column({ type: 'int' })
  sizeBytes: number;

  @Column({ type: 'varchar' })
  uploadedByUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('support_ticket_audit_logs')
export class SupportTicketAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  ticketId: string;

  @Column({ type: 'varchar' })
  actorId: string;

  @Column({ type: 'varchar' })
  actorRole: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'text', nullable: true })
  detailsJson?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('flado_vip_subscriptions')
export class FladoVipSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  plan: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';

  @Index()
  @Column({ type: 'varchar', default: 'PENDING_PAYMENT' })
  status: 'PENDING_PAYMENT' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAYMENT_FAILED';

  @Column({ type: 'int' })
  priceMinor: number;

  @Column({ type: 'int', default: 0 })
  amountPaidMinor: number;

  @Column({ type: 'varchar', default: 'USD' })
  currency: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  paymentIntentId?: string | null;

  @Column({ type: 'varchar', nullable: true })
  providerPaymentReference?: string | null;

  @Column({ type: 'boolean', default: false })
  cancelAtPeriodEnd: boolean;

  @Column({ type: 'datetime', nullable: true })
  activatedAt?: Date | null;

  @Index()
  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date | null;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('cms_media_assets')
export class CmsMediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  originalFilename: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  storageKey: string;

  @Column({ type: 'varchar' })
  mimeType: string;

  @Column({ type: 'int' })
  sizeBytes: number;

  @Column({ type: 'int', nullable: true })
  width?: number | null;

  @Column({ type: 'int', nullable: true })
  height?: number | null;

  @Column({ type: 'varchar', default: 'HERO_BANNER' })
  assetType: string;

  @Column({ type: 'varchar' })
  publicUrl: string;

  @Column({ type: 'varchar', nullable: true })
  altText?: string | null;

  @Index()
  @Column({ type: 'varchar' })
  uploadedByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}





