import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

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
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'DELIVERY';

  @Column({ default: true })
  isActive: boolean;

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

  @Column({ type: 'float', default: 0.0 })
  performanceScore: number;

  @CreateDateColumn()
  createdAt: Date;
}

// Category Entity
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  parentId: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}

// Product Entity
@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  vendorId: string;

  @Column()
  categoryId: string;

  @Column()
  title: string;

  @Column({ unique: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  basePrice: number;

  @Column({ type: 'float', nullable: true })
  discountPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', default: '[]' })
  colorsJson: string;

  @Column({ type: 'text', default: '[]' })
  sizesJson: string;

  @Column({ default: false })
  isQuickCommerce: boolean;

  @Column({ type: 'float', default: 4.5 })
  rating: number;

  @Column({ default: 12 })
  reviewCount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  subCategory: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Inventory Entity
@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  vendorId: string;

  @Column({ nullable: true })
  variantName: string;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: 0 })
  reservedQuantity: number;

  @Column({ default: 5 })
  lowStockThreshold: number;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Order Entity
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column({ type: 'float', default: 0.0 })
  discountAmount: number;

  @Column({ type: 'varchar', default: 'PLACED' })
  status: 'PLACED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

  @Column({ type: 'text', default: '{}' })
  shippingAddress: string;

  @Column({ type: 'text', default: '{}' })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  itemsSummary: string;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  verificationOtp: string;

  @Column({ default: 20 })
  deliveryMinutes: number;

  @Column({ nullable: true })
  riderId: string;

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

  @Column()
  vendorId: string;

  @Column({ nullable: true })
  inventoryId: string;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'float' })
  subtotal: number;

  @Column({ type: 'varchar', default: 'PLACED' })
  status: 'PLACED' | 'PREPARING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

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
  value: number;

  @Column({ type: 'float', default: 0.0 })
  minOrderAmount: number;

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

  // Operational status
  @Column({ default: false })
  isOpen: boolean; // shop open/close toggle (real-time)

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

  @Column({ type: 'int' })
  rating: number; // 1 to 5

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: true })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('return_requests')
export class ReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'REQUESTED' })
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

  @Column({ type: 'float', default: 0.0 })
  refundAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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
  @Column() adminId: string;
  @Column() action: string; // 'APPROVE_VENDOR', 'BAN_USER', 'CREATE_FLASH_SALE', etc.
  @Column({ nullable: true }) targetId: string;
  @Column({ nullable: true }) targetType: string; // 'USER', 'VENDOR', 'ORDER', etc.
  @Column({ type: 'text', nullable: true }) details: string; // JSON string
  @Column({ nullable: true }) ipAddress: string;
  @CreateDateColumn() createdAt: Date;
}
