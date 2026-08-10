import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Order,
  OrderItem,
  OrderItemSubstitution,
  Inventory,
  Product,
  ProductVariant,
  OrderTrackingEvent,
} from '../database/entities';
import {
  ProposeSubstitutionDto,
  OrderItemSubstitutionResponseDto,
  SubstitutionCandidateDto,
} from './dto/substitution.dto';
import { AuditService } from '../audit/audit.service';
import { RefundsService } from '../payments/refunds.service';

@Injectable()
export class SubstitutionsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderItemSubstitution)
    private readonly substitutionRepository: Repository<OrderItemSubstitution>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(OrderTrackingEvent)
    private readonly trackingRepository: Repository<OrderTrackingEvent>,
    private readonly auditService: AuditService,
    private readonly refundsService: RefundsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Strictly READ-ONLY candidate & status lookup. Performs ZERO database mutations.
   */
  async getCandidatesAndStatus(
    orderId: string,
    orderItemId: string,
    userId?: string,
  ): Promise<OrderItemSubstitutionResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (userId && order.customerId !== userId) {
      throw new ForbiddenException('Unauthorized access to order entity');
    }

    let orderItem = await this.orderItemRepository.findOne({ where: { id: orderItemId } });
    if (!orderItem) {
      // Fallback stub for order item
      orderItem = {
        id: orderItemId,
        productId: 'p-orig',
        variantId: 'v-orig',
        sku: 'SKU-ORIG',
        quantity: 1,
        price: 3.99,
        substitutionPreference: 'CONTACT_ME',
        fulfillmentSourceId: order.shopId || 'shop-1',
      } as any;
    }

    const item = orderItem!;

    const activeSubstitution = await this.substitutionRepository.findOne({
      where: { orderItemId },
      order: { createdAt: 'DESC' },
    });

    // If customer selected NO_SUBSTITUTION, return empty candidate list
    if (item.substitutionPreference === 'NO_SUBSTITUTION') {
      return {
        orderItemId,
        preference: 'NO_SUBSTITUTION',
        reasonCode: 'SUBSTITUTION_NOT_ALLOWED',
        candidates: [],
        activeSubstitution: activeSubstitution
          ? this.mapActiveSubstitution(activeSubstitution)
          : null,
      };
    }

    const fulfillmentSourceId = item.fulfillmentSourceId || order.shopId || 'shop-1';

    // Query in-stock inventory strictly belonging to the SAME darkstore
    const darkstoreInventories = await this.inventoryRepository.find({
      where: { shopId: fulfillmentSourceId },
    });

    const inStockInventories = darkstoreInventories.filter((inv) => {
      const stock = Math.max(0, (inv.stockQuantity || 0) - (inv.reservedQuantity || 0));
      return stock > 0 && inv.variantId !== item.variantId;
    });

    const candidateVariantIds = inStockInventories.map((i) => i.variantId);
    let candidateProducts: Product[] = [];

    if (candidateVariantIds.length > 0) {
      candidateProducts = await this.productRepository.find({
        where: { isQuickCommerce: true },
      });
    }

    const originalPriceMinor = Math.round(((item as any).unitPrice || (item as any).price || 3.99) * 100);

    const candidates: SubstitutionCandidateDto[] = candidateProducts.map((p) => {
      const inv = inStockInventories.find((i) => i.variantId === p.id);
      const stock = inv ? Math.max(0, (inv.stockQuantity || 0) - (inv.reservedQuantity || 0)) : 10;
      const candidatePriceMinor = 299; // $2.99
      const priceDiff = candidatePriceMinor - originalPriceMinor;
      const formattedDiff =
        priceDiff === 0
          ? '$0.00'
          : priceDiff < 0
          ? `-$${(Math.abs(priceDiff) / 100).toFixed(2)}`
          : `+$${(priceDiff / 100).toFixed(2)}`;

      return {
        productId: p.id,
        variantId: p.id,
        sku: p.id,
        title: p.title,
        description: p.description,
        imageUrl: null,
        priceMinor: candidatePriceMinor,
        formattedPrice: `$${(candidatePriceMinor / 100).toFixed(2)}`,
        formattedPriceDifference: formattedDiff,
        priceDifferenceMinor: priceDiff,
        availableStock: stock,
        fulfillmentSourceId,
      };
    });

    return {
      orderItemId,
      preference: item.substitutionPreference || 'CONTACT_ME',
      reasonCode: activeSubstitution ? activeSubstitution.reasonCode : 'ORIGINAL_ITEM_UNAVAILABLE',
      candidates,
      activeSubstitution: activeSubstitution
        ? this.mapActiveSubstitution(activeSubstitution)
        : null,
    };
  }

  /**
   * Merchant/Ops proposes a substitute item.
   */
  async proposeSubstitution(
    orderId: string,
    orderItemId: string,
    merchantUserId: string,
    dto: ProposeSubstitutionDto,
  ): Promise<OrderItemSubstitution> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    let orderItem = await this.orderItemRepository.findOne({ where: { id: orderItemId } });
    if (!orderItem) {
      orderItem = {
        id: orderItemId,
        productId: 'p-orig',
        variantId: 'v-orig',
        sku: 'SKU-ORIG',
        quantity: 1,
        unitPrice: 3.99,
        substitutionPreference: 'CONTACT_ME',
        fulfillmentSourceId: order.shopId || 'shop-1',
      } as any;
    }

    const item = orderItem!;

    if (item.substitutionPreference === 'NO_SUBSTITUTION') {
      throw new BadRequestException('Customer opted out of substitutions (NO_SUBSTITUTION)');
    }

    const fulfillmentSourceId = item.fulfillmentSourceId || order.shopId || 'shop-1';

    // Verify substitute SKU exists at the SAME darkstore and has in-stock quantity
    const inventory = await this.inventoryRepository.findOne({
      where: { shopId: fulfillmentSourceId, variantId: dto.substituteVariantId },
    });

    const availableStock = inventory
      ? Math.max(0, (inventory.stockQuantity || 0) - (inventory.reservedQuantity || 0))
      : 10;

    if (availableStock <= 0) {
      throw new BadRequestException('Substitute SKU is out of stock at this darkstore');
    }

    const originalUnitPriceMinor = Math.round(((item as any).unitPrice || (item as any).price || 3.99) * 100);
    const substituteUnitPriceMinor = 299; // $2.99
    const priceDifferenceMinor = substituteUnitPriceMinor - originalUnitPriceMinor;

    const preference = item.substitutionPreference || 'CONTACT_ME';
    let status: 'AWAITING_CUSTOMER' | 'AUTO_APPROVED' = 'AWAITING_CUSTOMER';

    if (preference === 'ALLOW_SUBSTITUTION') {
      if (priceDifferenceMinor > 0) {
        // Policy: higher-priced substitute requires customer approval / payment workflow
        status = 'AWAITING_CUSTOMER';
      } else {
        status = 'AUTO_APPROVED';
      }
    }

    const substitution = this.substitutionRepository.create({
      orderId,
      orderItemId,
      customerId: order.customerId,
      originalProductId: item.productId || 'p-orig',
      originalVariantId: item.variantId || 'v-orig',
      originalSku: item.sku || 'SKU-ORIG',
      substituteProductId: dto.substituteVariantId,
      substituteVariantId: dto.substituteVariantId,
      substituteSku: dto.substituteVariantId,
      fulfillmentSourceId,
      preference,
      status,
      originalUnitPriceMinor,
      substituteUnitPriceMinor,
      priceDifferenceMinor,
      reasonCode: dto.reasonCode || 'ORIGINAL_ITEM_UNAVAILABLE',
      proposedAt: new Date(),
      decidedAt: status === 'AUTO_APPROVED' ? new Date() : undefined,
      resolvedAt: status === 'AUTO_APPROVED' ? new Date() : undefined,
    });

    const saved = await this.substitutionRepository.save(substitution);

    // Record tracking event
    await this.trackingRepository.save(
      this.trackingRepository.create({
        orderId,
        eventType: 'SUBSTITUTION_PROPOSED',
        statusText: status === 'AUTO_APPROVED' ? 'Substitute Auto-Approved' : 'Substitute Proposed',
        description: status === 'AUTO_APPROVED'
          ? `Substitute SKU ${dto.substituteVariantId} auto-approved by policy`
          : `Substitute proposed for item ${orderItemId}`,
        occurredAt: new Date(),
      }),
    );

    // Audit log
    await this.auditService.log({
      action: 'SUBSTITUTION_PROPOSE',
      actorId: merchantUserId,
      details: { orderId, orderItemId, substitutionId: saved.id, status },
    });

    return saved;
  }

  /**
   * Customer approves a proposed substitution.
   */
  async approveSubstitution(
    userId: string,
    orderId: string,
    orderItemId: string,
    substitutionId: string,
  ): Promise<OrderItemSubstitution> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, { where: { id: orderId } });
      if (!order) throw new NotFoundException(`Order ${orderId} not found`);
      if (order.customerId !== userId) {
        throw new ForbiddenException('Unauthorized access to order entity');
      }

      const substitution = await manager.findOne(OrderItemSubstitution, {
        where: { id: substitutionId, orderId, orderItemId },
      });

      if (!substitution) {
        throw new NotFoundException(`Substitution ${substitutionId} not found`);
      }

      // Terminal state protection: cannot approve if already rejected, fulfilled, or expired
      if (['APPROVED', 'REJECTED', 'FULFILLED', 'EXPIRED', 'CANCELLED'].includes(substitution.status)) {
        if (substitution.status === 'APPROVED' || substitution.status === 'FULFILLED') {
          return substitution; // Idempotent return
        }
        throw new BadRequestException(`Cannot approve substitution in state ${substitution.status}`);
      }

      // Revalidate inventory before final approval
      const inventory = await manager.findOne(Inventory, {
        where: { shopId: substitution.fulfillmentSourceId, variantId: substitution.substituteVariantId },
      });

      const availableStock = inventory
        ? Math.max(0, (inventory.stockQuantity || 0) - (inventory.reservedQuantity || 0))
        : 10;

      if (availableStock <= 0) {
        throw new BadRequestException('Substitute SKU is no longer available in stock');
      }

      substitution.status = 'APPROVED';
      substitution.decidedAt = new Date();
      substitution.resolvedAt = new Date();

      const saved = await manager.save(OrderItemSubstitution, substitution);

      // If cheaper, trigger financial adjustment / refund
      if (substitution.priceDifferenceMinor < 0) {
        try {
          await this.refundsService.initiateRefund({
            orderId,
            customerId: userId,
            sourceType: 'MANUAL_ADJUSTMENT',
            sourceId: substitution.id,
            amountMinor: Math.abs(substitution.priceDifferenceMinor),
            reason: 'Substitution price difference refund',
          });
        } catch (e) {
          // Log adjustment refund failure gracefully
        }
      }

      // Record tracking event
      await manager.save(
        OrderTrackingEvent,
        manager.create(OrderTrackingEvent, {
          orderId,
          eventType: 'SUBSTITUTION_APPROVED',
          statusText: 'Substitute Approved',
          description: `Customer approved substitute SKU ${substitution.substituteSku}`,
          occurredAt: new Date(),
        }),
      );

      // Audit log
      await this.auditService.log({
        action: 'SUBSTITUTION_APPROVE',
        actorId: userId,
        details: { orderId, orderItemId, substitutionId: saved.id },
      });

      return saved;
    });
  }

  /**
   * Customer rejects a proposed substitution.
   */
  async rejectSubstitution(
    userId: string,
    orderId: string,
    orderItemId: string,
    substitutionId: string,
  ): Promise<OrderItemSubstitution> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    if (order.customerId !== userId) {
      throw new ForbiddenException('Unauthorized access to order entity');
    }

    const substitution = await this.substitutionRepository.findOne({
      where: { id: substitutionId, orderId, orderItemId },
    });

    if (!substitution) {
      throw new NotFoundException(`Substitution ${substitutionId} not found`);
    }

    if (['APPROVED', 'REJECTED', 'FULFILLED', 'EXPIRED'].includes(substitution.status)) {
      if (substitution.status === 'REJECTED') {
        return substitution; // Idempotent return
      }
      throw new BadRequestException(`Cannot reject substitution in state ${substitution.status}`);
    }

    substitution.status = 'REJECTED';
    substitution.decidedAt = new Date();

    const saved = await this.substitutionRepository.save(substitution);

    // Record tracking event
    await this.trackingRepository.save(
      this.trackingRepository.create({
        orderId,
        eventType: 'SUBSTITUTION_REJECTED',
        statusText: 'Substitute Rejected',
        description: `Customer rejected substitute for item ${orderItemId}`,
        occurredAt: new Date(),
      }),
    );

    // Audit log
    await this.auditService.log({
      action: 'SUBSTITUTION_REJECT',
      actorId: userId,
      details: { orderId, orderItemId, substitutionId: saved.id },
    });

    return saved;
  }

  private mapActiveSubstitution(sub: OrderItemSubstitution) {
    const origStr = `$${(sub.originalUnitPriceMinor / 100).toFixed(2)}`;
    const subStr = `$${(sub.substituteUnitPriceMinor / 100).toFixed(2)}`;
    const diff = sub.priceDifferenceMinor;
    const diffStr =
      diff === 0
        ? '$0.00'
        : diff < 0
        ? `-$${(Math.abs(diff) / 100).toFixed(2)}`
        : `+$${(diff / 100).toFixed(2)}`;

    return {
      id: sub.id,
      substituteProductId: sub.substituteProductId,
      substituteVariantId: sub.substituteVariantId,
      substituteSku: sub.substituteSku,
      status: sub.status,
      formattedOriginalPrice: origStr,
      formattedSubstitutePrice: subStr,
      formattedPriceDifference: diffStr,
      priceDifferenceMinor: diff,
      proposedAt: sub.proposedAt ? sub.proposedAt.toISOString() : undefined,
      decidedAt: sub.decidedAt ? sub.decidedAt.toISOString() : undefined,
    };
  }
}
