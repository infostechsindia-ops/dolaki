import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem, ProductVariant, Product, Inventory, FladoShop, User } from '../database/entities';
import { AddCartItemDto, UpdateCartItemDto, MergeGuestCartDto } from './dto/cart-mutation.dto';
import { SubstitutionPreferenceType } from './dto/update-substitution.dto';
import { DeliveryService } from '../delivery/delivery.service';
import { DeliverySurface } from '../delivery/dto/serviceability-query.dto';

export interface FormattedCartItem {
  id: string;
  cartId: string;
  sku: string;
  variantId?: string;
  productId?: string;
  title: string;
  image?: string;
  quantity: number;
  fulfillmentSourceId?: string;
  unitPrice: number;
  formattedUnitPrice: string;
  formattedCompareAtPrice?: string;
  lineTotal: number;
  formattedLineTotal: string;
  inStock: boolean;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isFlado?: boolean;
  substitutionPreference: SubstitutionPreferenceType;
  isStoreUnavailable?: boolean;
  availabilityReason?: string;
}

export interface CheckoutEligibilityResult {
  isEligible: boolean;
  blockers: string[];
}

export interface CartResponseDto {
  cartId: string;
  customerId: string;
  status: string;
  items: FormattedCartItem[];
  totalItems: number;
  subtotal: number;
  formattedSubtotal: string;
  tax: number;
  formattedTax: string;
  shipping: number;
  formattedShipping: string;
  discount: number;
  formattedDiscount: string;
  grandTotal: number;
  formattedGrandTotal: string;
  hasOutofStockItems: boolean;

  // CMD-041 Quick Cart Authoritative Extensions
  minimumBasketAmount?: number | null;
  formattedMinimumBasketAmount?: string | null;
  isMinimumBasketMet: boolean;
  minimumBasketShortfall?: number | null;
  formattedMinimumBasketShortfall?: string | null;
  estimatedDeliveryEtaText?: string | null;
  deliveryBadgeText?: string | null;
  storeAvailabilityStatus: 'OPEN' | 'CLOSED' | 'UNAVAILABLE' | 'SERVICED';
  storeName?: string | null;
  checkoutEligibility: CheckoutEligibilityResult;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(FladoShop)
    private readonly fladoShopRepo: Repository<FladoShop>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly deliveryService: DeliveryService,
  ) {}

  /**
   * Helper: format cents / integer amounts to USD display string e.g. 29900 -> "$299.00"
   */
  private formatCurrency(amountCents: number): string {
    const dollars = (amountCents / 100).toFixed(2);
    return `$${dollars}`;
  }

  /**
   * Get active cart for customer or create one if absent.
   */
  async getOrCreateCartEntity(customerId: string): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { customerId, status: 'ACTIVE' },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepo.create({
        customerId,
        status: 'ACTIVE',
        items: [],
      });
      cart = await this.cartRepo.save(cart);
    }
    return cart;
  }

  /**
   * Public API: Get current customer cart with full authoritative revalidation.
   */
  async getCart(customerId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(cart);
  }

  /**
   * Public API: Add item to authenticated customer cart.
   */
  async addItem(customerId: string, dto: AddCartItemDto): Promise<CartResponseDto> {
    if (!dto.sku) {
      throw new BadRequestException('SKU is required');
    }

    const variant = await this.variantRepo.findOne({ where: { sku: dto.sku } });
    if (!variant || variant.status === 'INACTIVE') {
      throw new NotFoundException(`Product variant with SKU "${dto.sku}" not found or inactive`);
    }

    const cart = await this.getOrCreateCartEntity(customerId);

    const fulfillmentSource = dto.fulfillmentSourceId || undefined;
    let item = cart.items.find(
      (i) => i.sku === dto.sku && (i.fulfillmentSourceId || undefined) === fulfillmentSource
    );

    if (item) {
      item.quantity += dto.quantity;
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({
        cartId: cart.id,
        sku: dto.sku,
        variantId: variant.id,
        productId: variant.productId,
        quantity: dto.quantity,
        fulfillmentSourceId: fulfillmentSource,
        substitutionPreference: 'ALLOW_SUBSTITUTION',
      });
      await this.cartItemRepo.save(item);
    }

    const updatedCart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(updatedCart);
  }

  /**
   * Public API: Update quantity of a cart item with customer ownership check.
   */
  async updateItem(
    customerId: string,
    itemId: string,
    quantity: number
  ): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCartEntity(customerId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Cart item "${itemId}" not found in your cart`);
    }

    if (quantity <= 0) {
      await this.cartItemRepo.remove(item);
    } else {
      item.quantity = quantity;
      await this.cartItemRepo.save(item);
    }

    const updatedCart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(updatedCart);
  }

  /**
   * Public API: Update substitution preference of a cart item with customer ownership check.
   */
  async updateSubstitution(
    customerId: string,
    itemId: string,
    preference: SubstitutionPreferenceType
  ): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCartEntity(customerId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Cart item "${itemId}" not found in your cart`);
    }

    item.substitutionPreference = preference;
    await this.cartItemRepo.save(item);

    const updatedCart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(updatedCart);
  }

  /**
   * Public API: Remove item from cart with customer ownership check.
   */
  async removeItem(customerId: string, itemId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCartEntity(customerId);
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Cart item "${itemId}" not found in your cart`);
    }

    await this.cartItemRepo.remove(item);

    const updatedCart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(updatedCart);
  }

  /**
   * Public API: Clear all items in customer's active cart.
   */
  async clearCart(customerId: string): Promise<CartResponseDto> {
    const cart = await this.getOrCreateCartEntity(customerId);
    if (cart.items.length > 0) {
      await this.cartItemRepo.remove(cart.items);
    }

    const updatedCart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(updatedCart);
  }

  /**
   * Public API: Merge guest cart intent items into authenticated customer cart.
   */
  async mergeGuestCart(
    customerId: string,
    dto: MergeGuestCartDto
  ): Promise<CartResponseDto> {
    if (!dto.items || dto.items.length === 0) {
      return this.getCart(customerId);
    }

    const cart = await this.getOrCreateCartEntity(customerId);

    for (const guestItem of dto.items) {
      if (!guestItem.sku || guestItem.quantity <= 0) continue;

      const variant = await this.variantRepo.findOne({ where: { sku: guestItem.sku } });
      if (!variant || variant.status === 'INACTIVE') continue;

      const fulfillmentSource = guestItem.fulfillmentSourceId || undefined;
      let existingItem = cart.items.find(
        (i) => i.sku === guestItem.sku && (i.fulfillmentSourceId || undefined) === fulfillmentSource
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
        await this.cartItemRepo.save(existingItem);
      } else {
        const newItem = this.cartItemRepo.create({
          cartId: cart.id,
          sku: guestItem.sku,
          variantId: variant.id,
          productId: variant.productId,
          quantity: guestItem.quantity,
          fulfillmentSourceId: fulfillmentSource,
          substitutionPreference: 'ALLOW_SUBSTITUTION',
        });
        await this.cartItemRepo.save(newItem);
      }
    }

    const updatedCart = await this.getOrCreateCartEntity(customerId);
    return this.revalidateCart(updatedCart);
  }

  /**
   * Central Authoritative Revalidation Engine (CMD-041):
   * Revalidates prices (CMD-014), inventory (CMD-012/013), store availability,
   * minimum basket rules (if configured), delivery ETA (CMD-036), and checkout eligibility.
   */
  async revalidateCart(cart: Cart): Promise<CartResponseDto> {
    const formattedItems: FormattedCartItem[] = [];
    let subtotal = 0;
    let hasOutofStockItems = false;
    let fladoItemsCount = 0;
    let standardItemsCount = 0;
    let fladoSubtotalCents = 0;
    let hasClosedStore = false;
    let primaryStoreName: string | null = null;
    let primaryShop: FladoShop | null = null;

    const blockers: string[] = [];

    if (!cart.items || cart.items.length === 0) {
      blockers.push('Cart is empty');
    }

    for (const item of cart.items || []) {
      const variant = await this.variantRepo.findOne({ where: { sku: item.sku } });
      let product = variant
        ? await this.productRepo.findOne({ where: { id: variant.productId } })
        : item.productId
        ? await this.productRepo.findOne({ where: { id: item.productId } })
        : await this.productRepo.findOne({ where: { id: item.sku } });

      let rawPrice = 0;
      let compareAtPrice: number | undefined;

      if (variant) {
        rawPrice = variant.referenceDiscountPrice || variant.referenceMsrp || 0;
        if (variant.referenceDiscountPrice && variant.referenceMsrp > variant.referenceDiscountPrice) {
          compareAtPrice = variant.referenceMsrp;
        }
      } else if (product) {
        rawPrice = (product as any).basePrice || (product as any).price || 0;
      }

      const unitPriceCents = Math.round(rawPrice < 1000 ? rawPrice * 100 : rawPrice);
      const compareAtCents = compareAtPrice
        ? Math.round(compareAtPrice < 1000 ? compareAtPrice * 100 : compareAtPrice)
        : undefined;

      let inStock = true;
      let stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK';

      if (variant) {
        const inv = await this.inventoryRepo.findOne({ where: { variantId: variant.id } });
        const availableQty = inv ? inv.stockQuantity - inv.reservedQuantity : 100;

        if (availableQty <= 0) {
          inStock = false;
          stockStatus = 'OUT_OF_STOCK';
          hasOutofStockItems = true;
        } else if (item.quantity > availableQty) {
          inStock = true;
          stockStatus = 'LOW_STOCK';
        }
      }

      const lineTotalCents = unitPriceCents * item.quantity;
      subtotal += lineTotalCents;

      const isFlado = product
        ? Boolean((product as any).isQuickCommerce || (product as any).isFlado)
        : Boolean(item.fulfillmentSourceId);
      if (isFlado) {
        fladoItemsCount += item.quantity;
        fladoSubtotalCents += lineTotalCents;
      } else {
        standardItemsCount += item.quantity;
      }

      // Store Operational Availability Check
      let isStoreUnavailable = false;
      let availabilityReason: string | undefined;

      if (item.fulfillmentSourceId) {
        const shop = await this.fladoShopRepo.findOne({ where: { id: item.fulfillmentSourceId } });
        if (shop) {
          if (!primaryStoreName) {
            primaryStoreName = shop.shopName;
            primaryShop = shop;
          }
          if (!shop.isOpen) {
            isStoreUnavailable = true;
            availabilityReason = 'Fulfillment store is currently closed';
            hasClosedStore = true;
          }
        }
      }

      const productTitle = product ? (product as any).title || (product as any).name : item.sku;

      formattedItems.push({
        id: item.id,
        cartId: cart.id,
        sku: item.sku,
        variantId: item.variantId || (variant ? variant.id : undefined),
        productId: item.productId || (product ? product.id : undefined),
        title: `${productTitle}${variant && !variant.isDefault ? ` - ${variant.title}` : ''}`,
        image: (product as any)?.images?.[0] || (product as any)?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        quantity: item.quantity,
        fulfillmentSourceId: item.fulfillmentSourceId || undefined,
        unitPrice: unitPriceCents,
        formattedUnitPrice: this.formatCurrency(unitPriceCents),
        formattedCompareAtPrice: compareAtCents ? this.formatCurrency(compareAtCents) : undefined,
        lineTotal: lineTotalCents,
        formattedLineTotal: this.formatCurrency(lineTotalCents),
        inStock,
        stockStatus,
        isFlado,
        substitutionPreference: item.substitutionPreference || 'ALLOW_SUBSTITUTION',
        isStoreUnavailable,
        availabilityReason,
      });
    }

    if (hasOutofStockItems) {
      blockers.push('Cart contains out-of-stock items');
    }

    if (hasClosedStore) {
      blockers.push('Fulfillment store is currently closed');
    }

    // Minimum Basket Evaluation — Authoritative from FladoShop if configured
    let minimumBasketAmountCents: number | null = null;
    let isMinimumBasketMet = true;
    let minimumBasketShortfallCents: number | null = null;

    if (fladoItemsCount > 0 && primaryShop && primaryShop.minimumOrderAmount != null) {
      // Convert shop minimumOrderAmount to cents if needed (assuming unit is dollars if < 1000)
      const minAmount = primaryShop.minimumOrderAmount;
      minimumBasketAmountCents = Math.round(minAmount < 1000 ? minAmount * 100 : minAmount);

      if (fladoSubtotalCents < minimumBasketAmountCents) {
        isMinimumBasketMet = false;
        minimumBasketShortfallCents = minimumBasketAmountCents - fladoSubtotalCents;
        blockers.push('Minimum basket requirement not satisfied');
      }
    }

    // Delivery ETA Integration via CMD-036 DeliveryService
    let estimatedDeliveryEtaText: string | null = null;
    let deliveryBadgeText: string | null = null;

    if (formattedItems.length > 0) {
      const firstItem = formattedItems[0];
      const deliveryPromise = await this.deliveryService.evaluateServiceability({
        variantId: firstItem.variantId || firstItem.sku,
        quantity: firstItem.quantity,
        surface: fladoItemsCount > 0 ? DeliverySurface.QUICK_COMMERCE : DeliverySurface.MARKETPLACE,
        shopId: firstItem.fulfillmentSourceId,
      });

      estimatedDeliveryEtaText = deliveryPromise.estimatedDeliveryText || null;
      deliveryBadgeText = deliveryPromise.deliveryBadgeText || null;
    }

    // Financial arithmetic (GST 18% tax basis, delivery fee rules)
    const user = await this.userRepo.findOne({ where: { id: cart.customerId } });
    const isVip = !!(user && user.isVip && user.vipExpiresAt && user.vipExpiresAt.getTime() > Date.now());

    const tax = Math.round(subtotal * 0.18);
    let shipping = 0;
    if (formattedItems.length > 0) {
      const baseFladoShipping = primaryShop?.deliveryFeeAmount ? Math.round(primaryShop.deliveryFeeAmount * 100) : 2500;
      const fladoShipping = isVip ? 0 : (fladoItemsCount > 0 ? baseFladoShipping : 0);
      const standardShipping = standardItemsCount > 0 && subtotal < 50000 ? 4000 : 0;
      shipping = fladoShipping + standardShipping;
    }
    const discount = 0;
    const grandTotal = subtotal + tax + shipping - discount;

    const totalItems = formattedItems.reduce((acc, item) => acc + item.quantity, 0);

    const storeAvailabilityStatus = hasClosedStore
      ? 'CLOSED'
      : primaryShop
      ? 'OPEN'
      : 'SERVICED';

    return {
      cartId: cart.id,
      customerId: cart.customerId,
      status: cart.status,
      items: formattedItems,
      totalItems,
      subtotal,
      formattedSubtotal: this.formatCurrency(subtotal),
      tax,
      formattedTax: this.formatCurrency(tax),
      shipping,
      formattedShipping: this.formatCurrency(shipping),
      discount,
      formattedDiscount: this.formatCurrency(discount),
      grandTotal,
      formattedGrandTotal: this.formatCurrency(grandTotal),
      hasOutofStockItems,

      minimumBasketAmount: minimumBasketAmountCents,
      formattedMinimumBasketAmount: minimumBasketAmountCents ? this.formatCurrency(minimumBasketAmountCents) : null,
      isMinimumBasketMet,
      minimumBasketShortfall: minimumBasketShortfallCents,
      formattedMinimumBasketShortfall: minimumBasketShortfallCents ? this.formatCurrency(minimumBasketShortfallCents) : null,
      estimatedDeliveryEtaText,
      deliveryBadgeText,
      storeAvailabilityStatus,
      storeName: primaryStoreName,
      checkoutEligibility: {
        isEligible: blockers.length === 0,
        blockers,
      },
    };
  }
}
