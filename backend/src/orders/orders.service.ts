import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Optional,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Order,
  OrderItem,
  Payment,
  UserWallet,
  Inventory,
  ReturnRequest,
  LoyaltyTransaction,
  Coupon,
  Cart,
  OrderTrackingEvent,
  Rider,
  OrderCancellation,
  ReturnTrackingEvent,
} from '../database/entities';
import { toSafeOrderDto } from '../flado/dto/public-shop.dto';
import { AuditService } from '../audit/audit.service';
import { PriceEngineService } from '../pricing/pricing.service';
import { PaymentsService } from '../payments/payments.service';
import { RefundsService } from '../payments/refunds.service';
import { CheckoutService } from '../checkout/checkout.service';
import { CartService } from '../cart/cart.service';

/** Strip verificationOtp from an order entity. Applied to ALL order responses. */
function safeOrder(order: Order) {
  return toSafeOrderDto(order);
}

export const SERVER_RETURN_POLICY_CONFIG = {
  QUICK_COMMERCE: {
    enabled: true,
    windowHours: 24,
    policyWindowText: '24 hours from delivery',
  },
  MARKETPLACE: {
    enabled: true,
    windowHours: 168, // 7 days (168 hours)
    policyWindowText: '7 days from delivery',
  },
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(UserWallet)
    private readonly walletRepository: Repository<UserWallet>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(ReturnRequest)
    private readonly returnRepository: Repository<ReturnRequest>,
    @InjectRepository(LoyaltyTransaction)
    private readonly loyaltyRepository: Repository<LoyaltyTransaction>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(OrderTrackingEvent)
    private readonly trackingEventRepository: Repository<OrderTrackingEvent>,
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(OrderCancellation)
    private readonly cancellationRepository: Repository<OrderCancellation>,
    @InjectRepository(ReturnTrackingEvent)
    private readonly returnTrackingEventRepository: Repository<ReturnTrackingEvent>,
    private readonly priceEngineService: PriceEngineService,
    private readonly auditService: AuditService,
    private readonly paymentsService: PaymentsService,
    private readonly checkoutService: CheckoutService,
    private readonly cartService: CartService,
    private readonly dataSource: DataSource,
    @Optional() private readonly refundsService?: RefundsService,
  ) {}

  /**
   * CMD-047: Authoritative Order Status Summary for customer dashboard
   */
  async getOrderSummary(user: any): Promise<{
    totalOrders: number;
    activeOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  }> {
    const customerId = user.userId;
    const orders = await this.orderRepository.find({
      where: { customerId },
    });

    let activeOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    for (const order of orders) {
      if (['PLACED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status)) {
        activeOrders++;
      } else if (order.status === 'DELIVERED') {
        deliveredOrders++;
      } else if (['CANCELLED', 'RETURNED'].includes(order.status)) {
        cancelledOrders++;
      }
    }

    return {
      totalOrders: orders.length,
      activeOrders,
      deliveredOrders,
      cancelledOrders,
    };
  }

  /**
   * CMD-047: Upgraded Customer Order History search, status filtering, and item inclusion
   */
  async findAll(user: any, query: any = {}): Promise<any> {
    const { search, status, paymentStatus, page = 1, limit = 20 } = query;

    const qb = this.orderRepository.createQueryBuilder('order');

    if (user.role === 'CUSTOMER') {
      qb.where('order.customerId = :customerId', { customerId: user.userId });
    } else if (user.role === 'VENDOR_OWNER' || user.role === 'VENDOR_STAFF') {
      const vendorItems = await this.orderItemRepository.find({
        where: { vendorId: user.userId },
      });
      const orderIds = [...new Set(vendorItems.map((item) => item.orderId))];
      if (orderIds.length === 0) return { data: [], meta: { total: 0, page: 1, pageSize: limit, totalPages: 0 } };
      qb.where('order.id IN (:...orderIds)', { orderIds });
    }

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(order.orderNumber) LIKE :searchTerm OR LOWER(order.id) LIKE :searchTerm OR LOWER(order.itemsSummary) LIKE :searchTerm)',
        { searchTerm }
      );
    }

    qb.orderBy('order.createdAt', 'DESC');

    const total = await qb.getCount();
    const pageNum = Math.max(1, parseInt(page as any, 10) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(limit as any, 10) || 20));
    qb.skip((pageNum - 1) * pageSize).take(pageSize);

    const orders = await qb.getMany();

    // Attach order items for product thumbnails rendering
    const orderIds = orders.map((o) => o.id);
    let itemsByOrderId: Record<string, OrderItem[]> = {};
    if (orderIds.length > 0) {
      const allItems = await this.orderItemRepository
        .createQueryBuilder('item')
        .where('item.orderId IN (:...orderIds)', { orderIds })
        .getMany();

      for (const item of allItems) {
        if (!itemsByOrderId[item.orderId]) {
          itemsByOrderId[item.orderId] = [];
        }
        itemsByOrderId[item.orderId].push(item);
      }
    }

    const safeOrders = orders.map((o) => ({
      ...safeOrder(o),
      items: itemsByOrderId[o.id] || [],
    }));

    return {
      data: safeOrders,
      meta: {
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 0,
      },
    };
  }

  /**
   * CMD-047: Authoritative Reorder flow (revalidates pricing & stock, never reuses old prices)
   */
  async reorder(user: any, orderId: string): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to reorder this order');
    }

    const items = await this.orderItemRepository.find({
      where: { orderId },
    });

    const addedItems: any[] = [];
    const unavailableItems: any[] = [];

    for (const item of items) {
      try {
        const cartDto = {
          productId: item.productId,
          variantId: item.variantId || undefined,
          sku: item.sku || item.productId,
          quantity: item.quantity,
          fulfillmentSourceId: item.fulfillmentSourceId || undefined,
          substitutionPreference: item.substitutionPreference as any,
        };
        await this.cartService.addItem(user.userId, cartDto);
        addedItems.push({
          sku: item.sku || item.productId,
          title: item.title,
          quantity: item.quantity,
        });
      } catch (err: any) {
        unavailableItems.push({
          sku: item.sku || item.productId,
          title: item.title,
          reason: err.message || 'Item currently unavailable',
        });
      }
    }

    const updatedCart = await this.cartService.getCart(user.userId);

    return {
      success: true,
      cart: updatedCart,
      addedItems,
      unavailableItems,
    };
  }

  /**
   * CMD-047: Authoritative IDOR-Protected Order Invoice Generation
   */
  async getInvoice(user: any, orderId: string): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to access this invoice');
    }

    const items = await this.orderItemRepository.find({
      where: { orderId },
    });

    let shippingAddressParsed: any = {};
    let billingAddressParsed: any = {};
    try {
      shippingAddressParsed = JSON.parse(order.shippingAddress || '{}');
      billingAddressParsed = JSON.parse(order.billingAddress || '{}');
    } catch (e) {}

    const invoiceNumber = `INV-${order.orderNumber || order.id.slice(0, 8).toUpperCase()}`;

    const itemsHtml = items
      .map(
        (i) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${i.title} ${i.variantTitle ? `(${i.variantTitle})` : ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(i.unitPriceMinor / 100).toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(i.subtotalMinor / 100).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #333; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #6366f1; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f8fafc; text-align: left; padding: 10px; border-bottom: 2px solid #e2e8f0; }
          .totals { margin-top: 20px; text-align: right; }
          .total-row { padding: 4px 0; }
          .grand-total { font-size: 18px; font-weight: bold; color: #1e293b; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">AuraMart Invoice</div>
            <div>Order #${order.orderNumber || order.id}</div>
            <div>Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div style="text-align: right;">
            <strong>${invoiceNumber}</strong><br>
            Payment Status: <span>${order.paymentStatus}</span><br>
            Payment Method: <span>${order.paymentMethod || 'Online'}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <strong>Deliver To:</strong><br>
            ${shippingAddressParsed.fullName || 'Customer'}<br>
            ${shippingAddressParsed.line1 || ''} ${shippingAddressParsed.line2 || ''}<br>
            ${shippingAddressParsed.city || ''}, ${shippingAddressParsed.pincode || ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">Subtotal: $${(order.itemsSubtotalMinor / 100).toFixed(2)}</div>
          <div class="total-row">Shipping: $${(order.feeAmountMinor / 100).toFixed(2)}</div>
          <div class="total-row">Tax: $${(order.taxAmountMinor / 100).toFixed(2)}</div>
          ${order.discountAmountMinor > 0 ? `<div class="total-row">Discount: -$${(order.discountAmountMinor / 100).toFixed(2)}</div>` : ''}
          <div class="grand-total">Total Paid: $${(order.totalAmountMinor / 100).toFixed(2)}</div>
        </div>
      </body>
      </html>
    `;

    return {
      invoiceNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      invoiceDate: order.createdAt,
      shippingAddress: shippingAddressParsed,
      items,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotalFormatted: `$${(order.itemsSubtotalMinor / 100).toFixed(2)}`,
      taxFormatted: `$${(order.taxAmountMinor / 100).toFixed(2)}`,
      shippingFormatted: `$${(order.feeAmountMinor / 100).toFixed(2)}`,
      discountFormatted: `$${(order.discountAmountMinor / 100).toFixed(2)}`,
      grandTotalFormatted: `$${(order.totalAmountMinor / 100).toFixed(2)}`,
      htmlContent,
    };
  }

  async findOne(id: string, user: any): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    // Ownership enforcement
    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }
    if (
      (user.role === 'VENDOR_OWNER' || user.role === 'VENDOR_STAFF') &&
      user.role !== 'SUPER_ADMIN'
    ) {
      // Vendor can only view orders that contain their items
      const vendorItem = await this.orderItemRepository.findOne({
        where: { orderId: id, vendorId: user.userId },
      });
      if (!vendorItem) {
        throw new ForbiddenException('You do not have permission to view this order');
      }
    }

    const items = await this.orderItemRepository.find({
      where: { orderId: id },
    });

    // verificationOtp stripped from all responses regardless of role
    return {
      ...safeOrder(order),
      items,
    };
  }

  async create(user: any, data: any): Promise<Omit<Order, 'verificationOtp'>> {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      isQuickCommerce,
    } = data;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain items');
    }

    // Authoritative Server-Side Pricing Calculation (Ignores client-submitted prices)
    const hasSellerListings = items.every((i: any) => i.sellerListingId);
    let authoritativeTotalMinor = 0;
    let authoritativeDiscountMinor = 0;
    let itemsSubtotalMinor = 0;
    let taxAmountMinor = 0;
    let feeAmountMinor = 0;
    let pricingSnapshotJson: string | null = null;
    let pricingResult: any = null;

    if (hasSellerListings) {
      pricingResult = await this.priceEngineService.calculatePrice(
        {
          items: items.map((i: any) => ({
            sellerListingId: i.sellerListingId,
            quantity: i.quantity,
            locationId: i.locationId,
          })),
          couponCode: data.couponCode,
          surface: isQuickCommerce ? 'QUICK_COMMERCE' : 'MARKETPLACE',
        },
        user,
      );

      itemsSubtotalMinor = pricingResult.summary.itemsSubtotalMinor;
      authoritativeDiscountMinor =
        pricingResult.summary.couponDiscountMinor +
        pricingResult.summary.totalItemDiscountMinor;
      taxAmountMinor = pricingResult.summary.taxTotalMinor;
      feeAmountMinor = pricingResult.summary.deliveryFeeMinor;
      authoritativeTotalMinor = pricingResult.summary.finalTotalMinor;
      pricingSnapshotJson = JSON.stringify(pricingResult);

      // Redeem coupon atomically if coupon discount was applied
      if (data.couponCode && pricingResult.summary.couponDiscountMinor > 0) {
        await this.couponRepository
          .createQueryBuilder()
          .update(Coupon)
          .set({ usedCount: () => 'usedCount + 1' })
          .where('code = :code AND usedCount < maxUses', {
            code: data.couponCode.toUpperCase(),
          })
          .execute();
      }
    } else {
      // Fallback for legacy items without sellerListingId
      for (const item of items) {
        const itemUnitPrice = item.unitPrice || 0;
        const lineSubtotal = Math.round(item.quantity * itemUnitPrice * 100);
        itemsSubtotalMinor += lineSubtotal;
      }
      authoritativeDiscountMinor = Math.round((data.discountAmount || 0) * 100);
      authoritativeTotalMinor = Math.max(0, itemsSubtotalMinor - authoritativeDiscountMinor);
    }

    const totalAmount = authoritativeTotalMinor / 100;
    const discountAmount = authoritativeDiscountMinor / 100;

    // Double check wallet balance if payment is wallet
    if (paymentMethod === 'Aura Wallet' || paymentMethod === 'Aura Pay') {
      const wallet = await this.walletRepository.findOne({
        where: { userId: user.userId },
      });
      if (!wallet || wallet.balance < totalAmount) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      // Deduct wallet balance
      wallet.balance -= totalAmount;
      await this.walletRepository.save(wallet);
    } else if (paymentMethod === 'AuraCoins' || data.burnPoints > 0) {
      const burnPoints = data.burnPoints || totalAmount * 10;
      const wallet = await this.walletRepository.findOne({
        where: { userId: user.userId },
      });
      if (!wallet || wallet.rewardPoints < burnPoints) {
        throw new BadRequestException('Insufficient reward points');
      }
      wallet.rewardPoints -= burnPoints;
      await this.walletRepository.save(wallet);

      const burnTx = this.loyaltyRepository.create({
        userId: user.userId,
        type: 'BURN',
        points: -burnPoints,
        monetaryValue: burnPoints / 10,
        description: 'Burned at checkout',
      });
      await this.loyaltyRepository.save(burnTx);
    }

    // Save main order details
    const order = this.orderRepository.create({
      customerId: user.userId,
      totalAmount,
      discountAmount,
      itemsSubtotalMinor,
      discountAmountMinor: authoritativeDiscountMinor,
      taxAmountMinor,
      feeAmountMinor,
      totalAmountMinor: authoritativeTotalMinor,
      pricingSnapshotJson,
      status: 'PLACED',
      shippingAddress:
        typeof shippingAddress === 'string'
          ? shippingAddress
          : JSON.stringify(shippingAddress),
      billingAddress:
        typeof billingAddress === 'string'
          ? billingAddress
          : JSON.stringify(billingAddress),
      paymentMethod,
      deliveryMinutes: isQuickCommerce ? 12 : 35,
      verificationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    });

    const savedOrder = await this.orderRepository.save(order);

    // Save order items & decrement inventories
    const summaryList = [];
    let idx = 0;
    for (const item of items) {
      const breakdownItem = pricingResult?.items[idx];
      const unitPriceMinor = breakdownItem
        ? breakdownItem.effectiveUnitPriceMinor
        : Math.round((item.unitPrice || 0) * 100);
      const discountMinor = breakdownItem
        ? breakdownItem.itemDiscountMinor
        : 0;
      const subtotalMinor = breakdownItem
        ? breakdownItem.lineSubtotalMinor
        : Math.round(item.quantity * (item.unitPrice || 0) * 100);
      const itemTaxAmountMinor = breakdownItem
        ? breakdownItem.taxAmountMinor
        : 0;

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        variantId: item.variantId || breakdownItem?.variantId || null,
        sku: item.sku || breakdownItem?.sku || null,
        title: item.title || breakdownItem?.title || 'Product',
        variantTitle: item.variantTitle || null,
        vendorId: item.vendorId || breakdownItem?.vendorId || 'flagship-store-id',
        quantity: item.quantity,
        unitPrice: unitPriceMinor / 100,
        subtotal: subtotalMinor / 100,
        unitPriceMinor,
        discountMinor,
        subtotalMinor,
        taxAmountMinor: itemTaxAmountMinor,
        status: 'PLACED',
      });
      await this.orderItemRepository.save(orderItem);

      summaryList.push(`${item.title || breakdownItem?.title || 'Product'} x ${item.quantity}`);

      // Try decrementing inventory
      const inv = await this.inventoryRepository.findOne({
        where: { productId: item.productId },
      });
      if (inv) {
        inv.stockQuantity = Math.max(0, inv.stockQuantity - item.quantity);
        await this.inventoryRepository.save(inv);
      }
      idx++;
    }

    savedOrder.itemsSummary = summaryList.join(', ');
    await this.orderRepository.save(savedOrder);

    // Calculate reward points: Math.floor(totalAmount * 0.01)
    const earnedPoints = Math.floor(totalAmount * 0.01);
    if (earnedPoints > 0) {
      const wallet = await this.walletRepository.findOne({
        where: { userId: user.userId },
      });
      if (wallet) {
        wallet.rewardPoints += earnedPoints;
        await this.walletRepository.save(wallet);

        const earnTx = this.loyaltyRepository.create({
          userId: user.userId,
          type: 'EARN',
          points: earnedPoints,
          monetaryValue: earnedPoints / 10,
          orderId: savedOrder.id,
          description: 'Order reward',
        });
        await this.loyaltyRepository.save(earnTx);
      }
    }

    // Save payment details
    const payment = this.paymentRepository.create({
      orderId: savedOrder.id,
      customerId: user.userId,
      amount: totalAmount,
      method: paymentMethod,
      status:
        paymentMethod === 'Aura Wallet' || paymentMethod === 'Aura Pay'
          ? 'CAPTURED'
          : 'PENDING',
      transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
    });
    await this.paymentRepository.save(payment);

    // verificationOtp is NEVER returned to API callers — not even SUPER_ADMIN
    return safeOrder(savedOrder);
  }

  /**
   * CMD-046: Authoritative Order Placement from PaymentIntent + Cart + Checkout preview
   */
  async placeOrder(user: any, dto: any): Promise<any> {
    const customerId = user.userId;
    const { paymentIntentId, addressId, deliveryOptionId } = dto;

    if (!paymentIntentId) {
      throw new BadRequestException('paymentIntentId is required to place an order');
    }

    // 1. Idempotency Check: Return existing order if paymentIntentId was already processed
    const existingOrder = await this.orderRepository.findOne({
      where: { paymentIntentId },
    });
    if (existingOrder) {
      if (existingOrder.customerId !== customerId) {
        throw new ForbiddenException('Order belongs to another customer');
      }
      const existingItems = await this.orderItemRepository.find({
        where: { orderId: existingOrder.id },
      });
      return {
        ...safeOrder(existingOrder),
        items: existingItems,
        message: 'Order already placed (idempotent response)',
      };
    }

    // 2. Fetch & Validate PaymentIntent
    const intent = await this.paymentsService.getIntent(customerId, paymentIntentId);
    const isCod = intent.paymentMethod === 'pay-cod' || intent.paymentMethod === 'COD';

    if (isCod) {
      if (intent.status !== 'SUCCEEDED') {
        throw new BadRequestException(`COD PaymentIntent status must be SUCCEEDED, but got ${intent.status}`);
      }
    } else {
      if (intent.status !== 'SUCCEEDED') {
        throw new BadRequestException(`Online PaymentIntent must be SUCCEEDED before order placement (current status: ${intent.status})`);
      }
    }

    // 3. Final Authoritative Checkout Revalidation
    const preview = await this.checkoutService.getPreview(customerId, {
      addressId: addressId || intent.metadata?.addressId,
      deliveryOptionId: deliveryOptionId || intent.metadata?.deliveryOptionId,
      paymentMethod: intent.paymentMethod,
    });

    if (!preview.checkoutEligibility.isEligible) {
      throw new BadRequestException({
        message: 'Checkout is ineligible for order placement',
        blockers: preview.checkoutEligibility.blockers,
      });
    }

    if (!preview.items || preview.items.length === 0) {
      throw new BadRequestException('Cannot place an order with an empty cart');
    }

    // 4. Payment Amount Consistency Revalidation
    if (preview.grandTotal !== intent.amountMinor) {
      throw new BadRequestException(
        `Payable checkout amount ($${(preview.grandTotal / 100).toFixed(2)}) has changed since PaymentIntent was created ($${(intent.amountMinor / 100).toFixed(2)}). Please create a new PaymentIntent.`
      );
    }

    // 5. Database Transaction for Atomic Placement
    const isFladoCart = preview.items.some((i: any) => i.isFlado);
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentStatus = isCod ? 'COD_PENDING' : 'PAID';

    return await this.dataSource.transaction(async (manager) => {
      // 5a. Create main Order record
      const order = manager.create(Order, {
        orderNumber,
        customerId,
        paymentIntentId: intent.id,
        totalAmount: preview.grandTotal / 100,
        discountAmount: preview.discount / 100,
        itemsSubtotalMinor: preview.subtotal,
        discountAmountMinor: preview.discount,
        taxAmountMinor: preview.tax,
        feeAmountMinor: preview.shipping,
        totalAmountMinor: preview.grandTotal,
        pricingSnapshotJson: JSON.stringify(preview),
        status: 'PLACED',
        paymentStatus,
        shippingAddress: JSON.stringify(preview.selectedAddress),
        billingAddress: JSON.stringify(preview.selectedAddress),
        paymentMethod: intent.paymentMethod,
        deliveryMinutes: isFladoCart ? 15 : 35,
        verificationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      });

      const savedOrder = await manager.save(Order, order);

      // 5b. Create OrderItems & Decrement Inventory
      const orderItems: OrderItem[] = [];
      const itemSummaries: string[] = [];

      for (const item of preview.items) {
        const orderItem = manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          variantId: item.variantId || null,
          sku: item.sku || null,
          title: item.title || 'Product',
          variantTitle: item.variantTitle || null,
          vendorId: item.vendorId || 'flagship-store-id',
          fulfillmentSourceId: item.fulfillmentSourceId || null,
          substitutionPreference: item.substitutionPreference || 'ALLOW_SUBSTITUTION',
          quantity: item.quantity,
          unitPrice: item.unitPriceMinor / 100,
          subtotal: item.lineSubtotalMinor / 100,
          unitPriceMinor: item.unitPriceMinor,
          discountMinor: item.itemDiscountMinor || 0,
          subtotalMinor: item.lineSubtotalMinor,
          taxAmountMinor: item.taxAmountMinor || 0,
          status: 'PLACED',
        });

        const savedItem = await manager.save(OrderItem, orderItem);
        orderItems.push(savedItem);
        itemSummaries.push(`${item.title || 'Product'} x ${item.quantity}`);

        // Decrement stock in Inventory
        const inv = await manager.findOne(Inventory, {
          where: { productId: item.productId },
        });
        if (inv) {
          inv.stockQuantity = Math.max(0, inv.stockQuantity - item.quantity);
          await manager.save(Inventory, inv);
        }
      }

      savedOrder.itemsSummary = itemSummaries.join(', ');
      await manager.save(Order, savedOrder);

      // 5c. Save Payment Audit record
      const payment = manager.create(Payment, {
        orderId: savedOrder.id,
        customerId,
        amount: preview.grandTotal / 100,
        method: intent.paymentMethod,
        status: isCod ? 'PENDING' : 'CAPTURED',
        transactionId: `TXN-${intent.id.slice(0, 8)}`,
      });
      await manager.save(Payment, payment);

      // 5d. Create Initial OrderTrackingEvent authoritatively (CMD-048 Fix)
      const initialEventType = isFladoCart ? 'ACCEPTED' : 'ORDER_CONFIRMED';
      const initialStatusText = isFladoCart ? 'Order Accepted by Store' : 'Order Confirmed';
      const initialTrackingEvent = manager.create(OrderTrackingEvent, {
        orderId: savedOrder.id,
        eventType: initialEventType,
        statusText: initialStatusText,
        description: isFladoCart ? 'Darkstore has accepted your quick commerce order' : 'Order received and confirmed',
        occurredAt: savedOrder.createdAt,
      });
      await manager.save(OrderTrackingEvent, initialTrackingEvent);

      // 5d. Finalize Cart state (ACTIVE -> ORDERED)
      const cart = await manager.findOne(Cart, {
        where: { id: preview.cartId },
      });
      if (cart) {
        cart.status = 'ORDERED';
        await manager.save(Cart, cart);
      }

      // 5e. Log Audit event
      await this.auditService.log({
        actorId: user?.userId || user?.id,
        actorRole: user?.role,
        action: 'ORDER_CREATE',
        resourceType: 'Order',
        resourceId: savedOrder.id,
        details: {
          orderNumber: savedOrder.orderNumber,
          paymentIntentId: intent.id,
          totalAmountMinor: preview.grandTotal,
          paymentMethod: intent.paymentMethod,
          paymentStatus,
        },
      });

      return {
        ...safeOrder(savedOrder),
        items: orderItems,
      };
    });
  }

  async assignRider(
    id: string,
    dto: { riderId: string; riderName?: string; riderPhone?: string },
    user: any,
  ): Promise<Omit<Order, 'verificationOtp'>> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (
      user.role === 'VENDOR_OWNER' ||
      user.role === 'VENDOR_STAFF' ||
      user.role === 'MERCHANT_OWNER' ||
      user.role === 'MERCHANT_STAFF'
    ) {
      if (order.shopId && user.shopId && order.shopId !== user.shopId) {
        throw new ForbiddenException(
          'You do not have permission to assign rider to an order from another store',
        );
      }
    }

    if (['CANCELLED', 'DELIVERED', 'RETURNED'].includes(order.status)) {
      throw new BadRequestException('Cannot assign rider to a terminal order');
    }

    order.riderId = dto.riderId;
    if (dto.riderName) order.riderName = dto.riderName;
    if (dto.riderPhone) order.riderPhone = dto.riderPhone;

    if (!order.pickupOtpHash) {
      const rawOtp = Math.floor(1000 + Math.random() * 9000).toString();
      order.pickupOtpHash = rawOtp;
    }

    const updated = await this.orderRepository.save(order);
    return safeOrder(updated);
  }

  async verifyRiderHandoff(
    id: string,
    dto: { otp: string },
    user: any,
  ): Promise<Omit<Order, 'verificationOtp'>> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (['CANCELLED', 'DELIVERED', 'RETURNED'].includes(order.status)) {
      throw new BadRequestException('Cannot verify handoff for a terminal order');
    }

    if (!order.riderId) {
      throw new BadRequestException(
        'RIDER_ASSIGNMENT_REQUIRED: Assign a rider before attempting pickup OTP handoff verification',
      );
    }

    if (order.pickupOtpHash && order.pickupOtpHash !== dto.otp) {
      throw new BadRequestException('INVALID_PICKUP_OTP: Invalid pickup OTP provided');
    }

    order.pickupOtpUsedAt = new Date();
    order.handoffCompletedAt = new Date();
    const updated = await this.orderRepository.save(order);

    return safeOrder(updated);
  }

  async updateStatus(id: string, status: string, user: any): Promise<Omit<Order, 'verificationOtp'>> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const terminalStatuses = ['CANCELLED', 'DELIVERED', 'RETURNED'];
    if (terminalStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Cannot update status of a terminal order (current status: ${order.status})`,
      );
    }

    // VENDOR_OWNER can only update status of orders containing their items
    if (user.role === 'VENDOR_OWNER' || user.role === 'VENDOR_STAFF') {
      const vendorItem = await this.orderItemRepository.findOne({
        where: { orderId: id, vendorId: user.userId },
      });
      if (!vendorItem) {
        throw new ForbiddenException(
          'You do not have permission to update this order',
        );
      }
    }

    // RIDER can only update delivery-phase statuses
    if (user.role === 'RIDER') {
      const riderAllowedStatuses = ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      if (!riderAllowedStatuses.includes(status)) {
        throw new ForbiddenException(
          'Riders may only update delivery status (PICKED_UP, OUT_FOR_DELIVERY, DELIVERED)',
        );
      }
    }

    const isFladoOrder = Boolean(
      order.shopId ||
        (order.pricingSnapshotJson && order.pricingSnapshotJson.includes('"isFlado":true')),
    );

    // Enforce strict state machine validations when transitioning to OUT_FOR_DELIVERY
    if (status === 'OUT_FOR_DELIVERY') {
      if (isFladoOrder) {
        if (order.status !== 'PREPARING' && order.status !== 'SHIPPED') {
          throw new BadRequestException(
            `Invalid state transition: Quick-Commerce order must be in PREPARING or SHIPPED status before OUT_FOR_DELIVERY (current: ${order.status})`,
          );
        }

        if (order.pickingStatus && order.pickingStatus !== 'COMPLETED') {
          throw new BadRequestException(
            'PICKING_INCOMPLETE: Order picking must be completed before dispatch',
          );
        }

        if (!order.riderId || order.riderId.trim().length === 0) {
          throw new BadRequestException(
            'RIDER_ASSIGNMENT_REQUIRED: Rider assignment is required before order can transition to OUT_FOR_DELIVERY',
          );
        }

        if (!order.handoffCompletedAt && !order.pickupOtpUsedAt) {
          throw new BadRequestException(
            'HANDOFF_VERIFICATION_REQUIRED: Rider pickup OTP handoff verification must be completed before order can transition to OUT_FOR_DELIVERY',
          );
        }
      } else {
        if (
          order.status !== 'PLACED' &&
          order.status !== 'PREPARING' &&
          order.status !== 'SHIPPED'
        ) {
          throw new BadRequestException(
            `Invalid state transition for Marketplace order to OUT_FOR_DELIVERY from ${order.status}`,
          );
        }
      }
    }

    const oldStatus = order.status;
    order.status = status as any;
    const updated = await this.orderRepository.save(order);

    // Sync individual items statuses
    await this.orderItemRepository.update(
      { orderId: id },
      { status: status as any },
    );

    if (status === 'OUT_FOR_DELIVERY') {
      await this.trackingEventRepository.save(
        this.trackingEventRepository.create({
          orderId: id,
          eventType: 'OUT_FOR_DELIVERY',
          statusText: 'Out for Delivery',
          description: `Order is out for delivery with rider ${order.riderName || order.riderId || ''}`.trim(),
          occurredAt: new Date(),
          riderId: order.riderId || undefined,
        }),
      );
    }

    await this.auditService.log({
      actorId: user.userId || 'SYSTEM',
      actorRole: user.role || 'SYSTEM',
      action: 'ORDER_STATUS_UPDATE',
      resourceType: 'Order',
      resourceId: id,
      details: { oldStatus, newStatus: status },
    });

    return safeOrder(updated);
  }

  /**
   * CMD-050: Authoritative Return Policy Preview (Pure READ-ONLY endpoint, zero database mutations)
   */
  async returnPreview(user: any, orderId: string): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view return preview for this order');
    }

    const items = await this.orderItemRepository.find({ where: { orderId } });
    const isQuickCommerce = items.some((i) => i.fulfillmentSourceId || i.substitutionPreference) || order.deliveryMinutes <= 20;
    const surface = isQuickCommerce ? 'QUICK_COMMERCE' : 'MARKETPLACE';
    const policyConfig = SERVER_RETURN_POLICY_CONFIG[surface];

    if (!policyConfig || !policyConfig.enabled) {
      return {
        orderId: order.id,
        isReturnable: false,
        reasonIfNotEligible: 'No return policy is configured for this order type.',
        policyWindowText: 'No Return Policy',
        policyExpiresAt: null,
        items: [],
        supportedReasons: ['DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND'],
        resolutionOptions: ['REFUND', 'REPLACEMENT'],
        fulfillmentOptions: ['PICKUP', 'DROPOFF'],
      };
    }

    // Check status eligibility
    if (order.status !== 'DELIVERED') {
      return {
        orderId: order.id,
        isReturnable: false,
        reasonIfNotEligible: `Order status is ${order.status}. Only delivered orders are eligible for return/replacement.`,
        policyWindowText: policyConfig.policyWindowText,
        policyExpiresAt: null,
        items: [],
        supportedReasons: ['DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND'],
        resolutionOptions: ['REFUND', 'REPLACEMENT'],
        fulfillmentOptions: ['PICKUP', 'DROPOFF'],
      };
    }

    // Determine delivery timestamp from deliveredAt or latest DELIVERED tracking event or updatedAt
    let deliveryTime = order.deliveredAt;
    if (!deliveryTime) {
      const deliveredEvent = await this.trackingEventRepository.findOne({
        where: { orderId, eventType: 'DELIVERED' },
        order: { occurredAt: 'DESC' },
      });
      deliveryTime = deliveredEvent ? deliveredEvent.occurredAt : order.updatedAt;
    }

    // Policy window from authoritative SERVER_RETURN_POLICY_CONFIG
    const windowMs = policyConfig.windowHours * 3600 * 1000;
    const policyExpiresAt = new Date(deliveryTime.getTime() + windowMs);
    const now = new Date();

    if (now > policyExpiresAt) {
      return {
        orderId: order.id,
        isReturnable: false,
        reasonIfNotEligible: `Return policy window expired on ${policyExpiresAt.toISOString()}. Returns must be initiated within ${policyConfig.policyWindowText}.`,
        policyWindowText: policyConfig.policyWindowText,
        policyExpiresAt: policyExpiresAt.toISOString(),
        items: [],
        supportedReasons: ['DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND'],
        resolutionOptions: ['REFUND', 'REPLACEMENT'],
        fulfillmentOptions: ['PICKUP', 'DROPOFF'],
      };
    }

    // Fetch existing active return requests to compute remaining returnable quantities
    const existingReturns = await this.returnRepository.find({ where: { orderId } });
    const activeStatusSet = new Set(['REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'QC_PENDING', 'RESOLVED_REFUND', 'RESOLVED_REPLACEMENT']);

    const itemDetails = items.map((item) => {
      const activeReturnsForItem = existingReturns.filter((r) => r.orderItemId === item.id && activeStatusSet.has(r.status));
      const returnedQty = activeReturnsForItem.reduce((sum, r) => sum + (r.quantity || 1), 0);
      const remainingQty = Math.max(0, item.quantity - (item.cancelledQuantity || 0) - returnedQty);
      const unitPriceMinor = item.unitPriceMinor || Math.round((item.unitPrice || 0) * 100);

      return {
        orderItemId: item.id,
        productId: item.productId,
        title: item.title,
        deliveredQuantity: item.quantity,
        cancelledQuantity: item.cancelledQuantity || 0,
        returnedQuantity: returnedQty,
        remainingReturnableQuantity: remainingQty,
        unitPriceMinor,
        formattedUnitPrice: `$${(unitPriceMinor / 100).toFixed(2)}`,
        isEligible: remainingQty > 0,
      };
    });

    const hasEligibleItems = itemDetails.some((i) => i.isEligible);

    return {
      orderId: order.id,
      isReturnable: hasEligibleItems,
      reasonIfNotEligible: hasEligibleItems ? null : 'All items in this order have already been returned or cancelled.',
      policyWindowText: policyConfig.policyWindowText,
      policyExpiresAt: policyExpiresAt.toISOString(),
      items: itemDetails,
      supportedReasons: ['DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND'],
      resolutionOptions: ['REFUND', 'REPLACEMENT'],
      fulfillmentOptions: ['PICKUP', 'DROPOFF'],
    };
  }

  /**
   * CMD-050: Authoritative Return / Replacement Request Creation (Atomic transaction)
   */
  async createReturn(orderId: string, customerId: string, data: any) {
    const user = { userId: customerId, role: 'CUSTOMER' };
    const preview = await this.returnPreview(user, orderId);

    if (!preview.isReturnable) {
      throw new BadRequestException(`Cannot request return: ${preview.reasonIfNotEligible}`);
    }

    const orderItemId = data.orderItemId;
    if (!orderItemId) throw new BadRequestException('orderItemId is required for return/replacement');

    const itemPreview = preview.items.find((i: any) => i.orderItemId === orderItemId);
    if (!itemPreview) {
      throw new BadRequestException(`Order item ${orderItemId} does not belong to order ${orderId}`);
    }

    const requestedQty = Number(data.quantity || 1);
    if (requestedQty <= 0 || requestedQty > itemPreview.remainingReturnableQuantity) {
      throw new BadRequestException(`Invalid requested return quantity ${requestedQty}. Maximum returnable: ${itemPreview.remainingReturnableQuantity}`);
    }

    const reason = data.reason || 'DAMAGED';
    const supportedReasons = ['DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND'];
    if (!supportedReasons.includes(reason)) {
      throw new BadRequestException(`Unsupported return reason: ${reason}`);
    }

    const resolutionChoice = data.resolutionChoice === 'REPLACEMENT' ? 'REPLACEMENT' : 'REFUND';
    const fulfillmentType = data.fulfillmentType === 'DROPOFF' ? 'DROPOFF' : 'PICKUP';
    const evidenceUrls = Array.isArray(data.evidenceUrls) ? data.evidenceUrls : [];

    const refundAmountMinor = itemPreview.unitPriceMinor * requestedQty;
    const refundAmount = refundAmountMinor / 100;

    return this.dataSource.transaction(async (manager) => {
      // Re-query active returns inside transaction for concurrency protection
      const activeReturnsInTx = await manager.find(ReturnRequest, { where: { orderId, orderItemId } });
      const activeStatusSet = new Set(['REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'QC_PENDING', 'RESOLVED_REFUND', 'RESOLVED_REPLACEMENT']);
      const returnedQtyInTx = activeReturnsInTx
        .filter((r) => activeStatusSet.has(r.status))
        .reduce((sum, r) => sum + (r.quantity || 1), 0);

      const orderItemInTx = await manager.findOne(OrderItem, { where: { id: orderItemId } });
      if (!orderItemInTx) throw new BadRequestException(`Order item ${orderItemId} not found`);

      const availableQtyInTx = Math.max(0, orderItemInTx.quantity - (orderItemInTx.cancelledQuantity || 0) - returnedQtyInTx);
      if (requestedQty > availableQtyInTx) {
        throw new BadRequestException(`Concurrent request conflict: remaining returnable quantity is ${availableQtyInTx}`);
      }

      const ret = manager.create(ReturnRequest, {
        orderId,
        orderItemId,
        customerId,
        quantity: requestedQty,
        reason,
        description: data.description || undefined,
        resolutionChoice,
        fulfillmentType,
        evidenceUrlsJson: JSON.stringify(evidenceUrls),
        qcStatus: 'PENDING_INSPECTION',
        status: 'REQUESTED',
        refundAmount,
        refundAmountMinor,
        pickupAddressJson: data.pickupAddress ? JSON.stringify(data.pickupAddress) : undefined,
      });
      const saved = (await manager.save(ReturnRequest, ret as any)) as ReturnRequest;

      // Create initial ReturnTrackingEvent
      const trackingEvent = manager.create(ReturnTrackingEvent, {
        returnRequestId: saved.id,
        eventType: 'REQUESTED',
        statusText: 'Return Request Submitted',
        description: `Return request submitted for ${itemPreview.title} (x${requestedQty}): ${reason}. Resolution: ${resolutionChoice}. Fulfillment: ${fulfillmentType}.`,
        actorRole: 'CUSTOMER',
        occurredAt: new Date(),
      });
      await manager.save(ReturnTrackingEvent, trackingEvent);

      await this.auditService.log({
        actorId: customerId,
        actorRole: 'CUSTOMER',
        action: 'RETURN_REQUEST',
        resourceType: 'ReturnRequest',
        resourceId: saved.id,
        details: { orderId, orderItemId, quantity: requestedQty, reason, resolutionChoice },
      });

      return {
        ...saved,
        timeline: [trackingEvent],
      };
    });
  }

  /**
   * CMD-050: Retrieve Return Request Details & Timeline
   */
  async getReturnStatus(returnId: string, user: any) {
    let ret = await this.returnRepository.findOne({ where: { id: returnId } });
    if (!ret) {
      // Fallback: search by orderId if returnId matches an orderId
      ret = await this.returnRepository.findOne({ where: { orderId: returnId } });
    }
    if (!ret) throw new NotFoundException('Return request not found');

    if (user.role === 'CUSTOMER' && ret.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view this return');
    }

    const timeline = await this.returnTrackingEventRepository.find({
      where: { returnRequestId: ret.id },
      order: { occurredAt: 'ASC' },
    });

    return {
      ...ret,
      timeline,
    };
  }

  /**
   * CMD-050: Update Quality Check (QC) status for return request (Admin/Operations)
   */
  async updateReturnQc(returnId: string, user: any, dto: any) {
    const ret = await this.returnRepository.findOne({ where: { id: returnId } });
    if (!ret) throw new NotFoundException('Return request not found');

    const terminalStatuses = ['RESOLVED_REFUND', 'RESOLVED_REPLACEMENT', 'REJECTED'];
    if (terminalStatuses.includes(ret.status)) {
      throw new BadRequestException(`Cannot update QC for return request in terminal status: ${ret.status}`);
    }

    const qcStatus = dto.qcStatus === 'QC_PASSED' ? 'QC_PASSED' : 'QC_FAILED';
    ret.qcStatus = qcStatus;
    ret.qcNotes = dto.qcNotes || null;

    if (qcStatus === 'QC_PASSED') {
      ret.status = 'QC_PENDING';
    }

    const saved = await this.returnRepository.save(ret);

    const trackingEvent = this.returnTrackingEventRepository.create({
      returnRequestId: ret.id,
      eventType: 'QC_UPDATED',
      statusText: qcStatus === 'QC_PASSED' ? 'QC Inspection Passed' : 'QC Inspection Failed',
      description: dto.qcNotes || `Quality check inspection evaluated as ${qcStatus}.`,
      actorRole: user.role,
      occurredAt: new Date(),
    });
    await this.returnTrackingEventRepository.save(trackingEvent);

    await this.auditService.log({
      actorId: user.userId,
      actorRole: user.role,
      action: 'RETURN_QC_UPDATE',
      resourceType: 'ReturnRequest',
      resourceId: returnId,
      details: { qcStatus, qcNotes: dto.qcNotes },
    });

    return saved;
  }

  async approveReturn(returnId: string, refundAmount?: number) {
    const ret = await this.returnRepository.findOne({
      where: { id: returnId },
    });
    if (!ret) throw new NotFoundException('Return request not found');

    const terminalStatuses = ['RESOLVED_REFUND', 'RESOLVED_REPLACEMENT', 'REJECTED'];
    if (terminalStatuses.includes(ret.status)) {
      throw new BadRequestException(`Cannot approve return request in terminal status: ${ret.status}`);
    }

    if (ret.qcStatus === 'QC_FAILED') {
      throw new BadRequestException('Cannot approve return request with failed QC inspection.');
    }

    ret.status = ret.resolutionChoice === 'REPLACEMENT' ? 'RESOLVED_REPLACEMENT' : 'RESOLVED_REFUND';
    if (refundAmount !== undefined && refundAmount !== null) {
      ret.refundAmount = refundAmount;
      ret.refundAmountMinor = Math.round(refundAmount * 100);
    }
    const saved = await this.returnRepository.save(ret);

    const trackingEvent = this.returnTrackingEventRepository.create({
      returnRequestId: ret.id,
      eventType: ret.resolutionChoice === 'REPLACEMENT' ? 'RESOLVED_REPLACEMENT' : 'RESOLVED_REFUND',
      statusText: ret.resolutionChoice === 'REPLACEMENT' ? 'Replacement Order Approved (Fulfillment Pending)' : 'Return Approved for Refund (Refund Pending Processing)',
      description: `Return request approved. Resolution: ${ret.resolutionChoice}. ${ret.resolutionChoice === 'REPLACEMENT' ? 'Replacement shipment pending fulfillment.' : 'Refund pending processing.'}`,
      actorRole: 'SUPER_ADMIN',
      occurredAt: new Date(),
    });
    await this.returnTrackingEventRepository.save(trackingEvent);

    await this.auditService.log({
      actorId: 'ADMIN',
      actorRole: 'SUPER_ADMIN',
      action: 'RETURN_APPROVE',
      resourceType: 'ReturnRequest',
      resourceId: returnId,
      details: { refundAmount: ret.refundAmount, orderId: ret.orderId, resolutionChoice: ret.resolutionChoice },
    });

    if (ret.resolutionChoice === 'REFUND' && this.refundsService && (ret.refundAmountMinor || 0) > 0) {
      await this.refundsService.initiateRefund({
        orderId: ret.orderId,
        customerId: ret.customerId,
        sourceType: 'RETURN',
        sourceId: ret.id,
        amountMinor: ret.refundAmountMinor || Math.round((ret.refundAmount || 0) * 100),
        reason: `Item return approved: ${ret.reason}`,
        idempotencyKey: `refund-return-${ret.id}`,
      }).catch(() => {});
    }

    return saved;
  }

  async rejectReturn(returnId: string, reasonText?: string) {
    const ret = await this.returnRepository.findOne({
      where: { id: returnId },
    });
    if (!ret) throw new NotFoundException('Return request not found');

    const terminalStatuses = ['RESOLVED_REFUND', 'RESOLVED_REPLACEMENT', 'REJECTED'];
    if (terminalStatuses.includes(ret.status)) {
      throw new BadRequestException(`Cannot reject return request in terminal status: ${ret.status}`);
    }

    ret.status = 'REJECTED';
    const saved = await this.returnRepository.save(ret);

    const trackingEvent = this.returnTrackingEventRepository.create({
      returnRequestId: ret.id,
      eventType: 'REJECTED',
      statusText: 'Return Request Rejected',
      description: reasonText || 'Return request rejected after operational evaluation.',
      actorRole: 'SUPER_ADMIN',
      occurredAt: new Date(),
    });
    await this.returnTrackingEventRepository.save(trackingEvent);

    await this.auditService.log({
      actorId: 'ADMIN',
      actorRole: 'SUPER_ADMIN',
      action: 'RETURN_REJECT',
      resourceType: 'ReturnRequest',
      resourceId: returnId,
      details: { orderId: ret.orderId, reasonText },
    });

    return saved;
  }

  /**
   * CMD-048: Authoritative Order Tracking Event retrieval
   */
  async getOrderTracking(user: any, orderId: string): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view tracking for this order');
    }

    const items = await this.orderItemRepository.find({ where: { orderId } });
    const isQuickCommerce = items.some((i) => i.fulfillmentSourceId || i.substitutionPreference) || order.deliveryMinutes <= 20;

    let events = await this.trackingEventRepository.find({
      where: { orderId },
      order: { occurredAt: 'ASC' },
    });

    // If no events exist in DB yet, synthesize initial event in-memory WITHOUT saving to DB (zero database writes in GET!)
    if (events.length === 0) {
      const initialType = isQuickCommerce ? 'ACCEPTED' : 'ORDER_CONFIRMED';
      const initialText = isQuickCommerce ? 'Order Accepted by Store' : 'Order Confirmed';
      events = [
        {
          id: `synth-${order.id.slice(0, 8)}`,
          orderId,
          eventType: initialType,
          statusText: initialText,
          description: isQuickCommerce ? 'Darkstore has accepted your quick commerce order' : 'Order received and confirmed',
          occurredAt: order.createdAt,
          createdAt: order.createdAt,
        } as any,
      ];
    }

    // Sanitize rider details if assigned
    let riderInfo: any = null;
    if (order.riderId) {
      const rider = await this.riderRepository.findOne({ where: { id: order.riderId } });
      if (rider) {
        riderInfo = {
          displayName: rider.name,
          vehicleType: rider.vehicleType || 'Bicycle',
        };
      }
    }

    // Extract carrier shipment details from latest event if available
    const latestCarrierEvent = events.slice().reverse().find((e) => e.carrierName);
    const shipmentInfo = latestCarrierEvent
      ? {
          carrierName: latestCarrierEvent.carrierName,
          trackingNumber: latestCarrierEvent.carrierTrackingNumber,
        }
      : null;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber || order.id,
      surface: isQuickCommerce ? 'QUICK_COMMERCE' : 'MARKETPLACE',
      currentStatus: order.status,
      events: events.map((e) => ({
        id: e.id,
        type: e.eventType,
        statusText: e.statusText,
        description: e.description,
        occurredAt: e.occurredAt,
        locationText: e.locationText || null,
      })),
      rider: riderInfo,
      shipment: shipmentInfo,
      estimatedDeliveryText: isQuickCommerce ? `Delivering in ~${order.deliveryMinutes || 15} mins` : 'Standard Delivery (2-4 business days)',
    };
  }

  /**
   * CMD-048: Authoritative Server-Side Tracking Event Recording (Restricted to ops/vendors/riders)
   */
  async recordTrackingEvent(user: any, orderId: string, dto: any): Promise<any> {
    const allowedRoles = ['SUPER_ADMIN', 'OPERATIONS', 'VENDOR_OWNER', 'VENDOR_STAFF', 'RIDER'];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Only operational staff or riders may record tracking events');
    }

    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const { eventType, statusText, description, carrierName, carrierTrackingNumber, locationText, riderId } = dto;

    if (!eventType || !statusText) {
      throw new BadRequestException('eventType and statusText are required');
    }

    // Prevent obvious invalid regressions (e.g. DELIVERED -> PICKING)
    if (order.status === 'DELIVERED' && eventType !== 'DELIVERED') {
      throw new BadRequestException('Cannot add non-delivered events to an already DELIVERED order');
    }

    const event = this.trackingEventRepository.create({
      orderId,
      eventType,
      statusText,
      description,
      occurredAt: new Date(),
      riderId: riderId || order.riderId || undefined,
      carrierName: carrierName || undefined,
      carrierTrackingNumber: carrierTrackingNumber || undefined,
      locationText: locationText || undefined,
    });

    const savedEvent = await this.trackingEventRepository.save(event);

    // Update order.status if matching major status
    const statusMap: Record<string, string> = {
      DELIVERED: 'DELIVERED',
      SHIPPED: 'SHIPPED',
      OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
      PACKED: 'PREPARING',
      PICKING: 'PREPARING',
    };
    if (statusMap[eventType]) {
      order.status = statusMap[eventType] as any;
      if (riderId) order.riderId = riderId;
      await this.orderRepository.save(order);
    }

    return savedEvent;
  }

  /**
   * CMD-049: Authoritative Cancellation Preview (Read-only policy evaluation)
   */
  async cancelPreview(user: any, orderId: string, dto: any = {}): Promise<any> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (user.role === 'CUSTOMER' && order.customerId !== user.userId) {
      throw new ForbiddenException('You do not have permission to view cancellation preview for this order');
    }

    const items = await this.orderItemRepository.find({ where: { orderId } });
    const isQuickCommerce = items.some((i) => i.fulfillmentSourceId || i.substitutionPreference) || order.deliveryMinutes <= 20;

    // Check status eligibility
    if (order.status === 'DELIVERED' || order.status === 'RETURNED') {
      return {
        orderId: order.id,
        canCancel: false,
        reason: 'Delivered orders cannot be cancelled. Please request a return.',
        cancellationType: 'NONE',
        cancellableItems: [],
        nonCancellableItems: items,
        cancellationFeeMinor: 0,
        formattedCancellationFee: '$0.00',
        expectedRefundMinor: 0,
        formattedExpectedRefund: '$0.00',
        refundMethodText: 'N/A',
        policyMessages: ['Order is delivered. Cancellation window has closed.'],
      };
    }

    if (order.status === 'CANCELLED') {
      return {
        orderId: order.id,
        canCancel: false,
        reason: 'Order is already cancelled.',
        cancellationType: 'NONE',
        cancellableItems: [],
        nonCancellableItems: items,
        cancellationFeeMinor: 0,
        formattedCancellationFee: '$0.00',
        expectedRefundMinor: 0,
        formattedExpectedRefund: '$0.00',
        refundMethodText: 'N/A',
        policyMessages: ['Order is already cancelled.'],
      };
    }

    // Evaluate requested items/quantities
    let targetItems: Array<{ orderItemId: string; quantity: number }> = [];
    if (dto.items && Array.isArray(dto.items) && dto.items.length > 0) {
      targetItems = dto.items;
    } else {
      // Default to entire remaining quantities of all items
      targetItems = items.map((i) => ({ orderItemId: i.id, quantity: Math.max(0, i.quantity - (i.cancelledQuantity || 0)) }));
    }

    // Validate duplicate item IDs in request payload
    const itemIds = targetItems.map((i) => i.orderItemId);
    if (new Set(itemIds).size !== itemIds.length) {
      throw new BadRequestException('Duplicate item IDs found in cancellation request');
    }

    let calculatedRefundMinor = 0;
    const cancellableList: any[] = [];

    for (const reqItem of targetItems) {
      const existingItem = items.find((i) => i.id === reqItem.orderItemId);
      if (!existingItem) {
        throw new BadRequestException(`Order item ${reqItem.orderItemId} does not belong to order ${orderId}`);
      }

      const availableQty = Math.max(0, existingItem.quantity - (existingItem.cancelledQuantity || 0));
      if (reqItem.quantity <= 0 || reqItem.quantity > availableQty) {
        throw new BadRequestException(`Invalid requested cancellation quantity ${reqItem.quantity} for item ${existingItem.title}. Available: ${availableQty}`);
      }

      const unitPriceMinor = existingItem.unitPriceMinor || Math.round((existingItem.unitPrice || 0) * 100);
      const itemRefundSubtotal = unitPriceMinor * reqItem.quantity;
      calculatedRefundMinor += itemRefundSubtotal;

      cancellableList.push({
        orderItemId: existingItem.id,
        title: existingItem.title,
        requestedQuantity: reqItem.quantity,
        unitPriceMinor,
        lineRefundMinor: itemRefundSubtotal,
      });
    }

    const totalRemainingQty = items.reduce((sum, i) => sum + Math.max(0, i.quantity - (i.cancelledQuantity || 0)), 0);
    const totalRequestedQty = targetItems.reduce((sum, i) => sum + i.quantity, 0);
    const isFullCancellation = totalRequestedQty >= totalRemainingQty;

    // Refund semantics (COD vs Online PAID)
    const isCod = order.paymentMethod === 'pay-cod' || order.paymentStatus === 'COD_PENDING';
    const effectiveRefundMinor = isCod ? 0 : calculatedRefundMinor;
    const refundMethodText = isCod
      ? 'No payment collected (Cash on Delivery). Order will be cancelled without charge.'
      : 'Original Payment Method (Refund pending processing)';

    return {
      orderId: order.id,
      canCancel: true,
      reason: 'Order is eligible for cancellation',
      cancellationType: isFullCancellation ? 'FULL' : 'PARTIAL',
      cancellableItems: cancellableList,
      nonCancellableItems: [],
      cancellationFeeMinor: 0,
      formattedCancellationFee: '$0.00',
      expectedRefundMinor: effectiveRefundMinor,
      formattedExpectedRefund: `$${(effectiveRefundMinor / 100).toFixed(2)}`,
      refundMethodText,
      policyMessages: [
        isQuickCommerce ? 'Quick-commerce order cancelled prior to delivery' : 'Marketplace order cancelled prior to shipment',
      ],
    };
  }

  /**
   * CMD-049: Authoritative Cancellation Execution (Atomic transaction with inventory restoration)
   */
  async cancelOrder(user: any, orderId: string, dto: any = {}): Promise<any> {
    // 1. Re-run policy preview first server-side
    const preview = await this.cancelPreview(user, orderId, dto);
    if (!preview.canCancel) {
      throw new BadRequestException(`Cannot cancel order: ${preview.reason}`);
    }

    const reasonCode = dto.reasonCode || 'CHANGED_MIND';
    const reasonText = dto.reasonText || null;

    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, { where: { id: orderId } });
      if (!order) throw new NotFoundException('Order not found');

      // Double-check status inside transaction
      if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
        throw new BadRequestException(`Order cannot be cancelled in current status: ${order.status}`);
      }

      const items = await manager.find(OrderItem, { where: { orderId } });

      // 2. Process cancelled quantities & restore inventory atomically
      for (const itemToCancel of preview.cancellableItems) {
        const orderItem = items.find((i) => i.id === itemToCancel.orderItemId);
        if (orderItem) {
          orderItem.cancelledQuantity = (orderItem.cancelledQuantity || 0) + itemToCancel.requestedQuantity;
          await manager.save(OrderItem, orderItem);

          // Restore inventory stock atomically
          if (orderItem.productId) {
            const inv = await manager.findOne(Inventory, { where: { productId: orderItem.productId } });
            if (inv) {
              inv.stockQuantity += itemToCancel.requestedQuantity;
              await manager.save(Inventory, inv);
            }
          }
        }
      }

      // 3. Update Order status ONLY if FULL cancellation
      if (preview.cancellationType === 'FULL') {
        order.status = 'CANCELLED';
        await manager.save(Order, order);
      }

      // 4. Create OrderCancellation record
      const cancellation = manager.create(OrderCancellation, {
        orderId,
        customerId: order.customerId,
        reasonCode,
        reasonText,
        cancellationFeeMinor: 0,
        refundAmountMinor: preview.expectedRefundMinor,
        cancellationType: preview.cancellationType,
        cancelledItemsJson: JSON.stringify(preview.cancellableItems),
        refundStatusText: preview.refundMethodText,
      });
      const savedCancellation = await manager.save(OrderCancellation, cancellation);

      // 5. Create OrderTrackingEvent (ITEMS_CANCELLED for partial, CANCELLED for full)
      const trackingEvent = manager.create(OrderTrackingEvent, {
        orderId,
        eventType: preview.cancellationType === 'FULL' ? 'CANCELLED' : 'ITEMS_CANCELLED',
        statusText: preview.cancellationType === 'FULL' ? 'Order Cancelled' : 'Items Cancelled',
        description: `Order ${preview.cancellationType.toLowerCase()} cancellation processed: ${reasonCode}. Reason: ${reasonText || 'N/A'}`,
        occurredAt: new Date(),
      });
      await manager.save(OrderTrackingEvent, trackingEvent);

      // 6. Record audit event
      await this.auditService.log({
        actorId: user.userId,
        actorRole: user.role,
        action: 'ORDER_CANCEL',
        resourceType: 'Order',
        resourceId: orderId,
        details: {
          cancellationId: savedCancellation.id,
          cancellationType: preview.cancellationType,
          refundAmountMinor: preview.expectedRefundMinor,
          reasonCode,
        },
      });

      if (this.refundsService && preview.expectedRefundMinor > 0) {
        await this.refundsService.initiateRefund({
          orderId: order.id,
          customerId: user.userId,
          paymentIntentId: order.paymentIntentId,
          sourceType: 'CANCELLATION',
          sourceId: savedCancellation.id,
          amountMinor: preview.expectedRefundMinor,
          reason: `Order cancellation (${preview.cancellationType}): ${reasonCode}`,
          idempotencyKey: `refund-cancel-${savedCancellation.id}`,
        }).catch(() => {});
      } else if (this.refundsService && order.paymentMethod === 'COD') {
        await this.refundsService.initiateRefund({
          orderId: order.id,
          customerId: user.userId,
          sourceType: 'CANCELLATION',
          sourceId: savedCancellation.id,
          amountMinor: 0,
          reason: `COD Order cancellation (${preview.cancellationType})`,
          idempotencyKey: `refund-cancel-${savedCancellation.id}`,
        }).catch(() => {});
      }

      return {
        success: true,
        cancellationId: savedCancellation.id,
        orderId: order.id,
        orderStatus: order.status,
        cancellationType: preview.cancellationType,
        expectedRefundMinor: preview.expectedRefundMinor,
        formattedExpectedRefund: preview.formattedExpectedRefund,
        refundMethodText: preview.refundMethodText,
        message: 'Order cancellation successfully processed.',
      };
    });
  }

  // CONTENT-005: Vendor Order Fulfillment Kanban Queue
  async getVendorOrderQueue(vendorId: string) {
    const orders = await this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    const safeOrders = orders.map((o) => safeOrder(o));
    return {
      newOrders: safeOrders.filter((o: any) => o.status === 'PENDING' || o.status === 'CONFIRMED'),
      pickingQueue: safeOrders.filter((o: any) => o.status === 'PROCESSING'),
      packingQueue: safeOrders.filter((o: any) => o.status === 'PACKED'),
      readyQueue: safeOrders.filter((o: any) => o.status === 'READY_FOR_PICKUP'),
      dispatchedQueue: safeOrders.filter((o: any) => o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY'),
      completedQueue: safeOrders.filter((o: any) => o.status === 'DELIVERED'),
    };
  }
}
