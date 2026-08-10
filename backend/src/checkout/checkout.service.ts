import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../database/entities';
import { CartService } from '../cart/cart.service';
import { DeliveryService } from '../delivery/delivery.service';
import { DeliverySurface } from '../delivery/dto/serviceability-query.dto';
import {
  CheckoutPreviewDto,
  CheckoutPreviewResponseDto,
  DeliveryOptionDto,
  PaymentMethodDto,
} from './dto/checkout-preview.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly deliveryService: DeliveryService,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  private formatCurrency(amountCents: number): string {
    const dollars = (amountCents / 100).toFixed(2);
    return `$${dollars}`;
  }

  async getPreview(
    customerId: string,
    dto: CheckoutPreviewDto,
  ): Promise<CheckoutPreviewResponseDto> {
    // 1. Authoritative Cart Revalidation (CMD-039 & CMD-041)
    const cart = await this.cartService.getCart(customerId);

    // 2. Address Selection & IDOR Verification
    const addresses = await this.addressRepo.find({
      where: { userId: customerId },
      order: { isDefault: 'DESC' },
    });

    let selectedAddress: Address | null = null;
    if (dto.addressId) {
      const address = addresses.find((a) => a.id === dto.addressId);
      if (!address) {
        throw new ForbiddenException('Selected address does not belong to customer');
      }
      selectedAddress = address;
    } else {
      selectedAddress = addresses.length > 0 ? addresses[0] : null;
    }

    const blockers = [...cart.checkoutEligibility.blockers];

    if (!selectedAddress && cart.items.length > 0) {
      blockers.push('Shipping address selection required');
    }

    // 3. Location Serviceability Evaluation (CMD-036 & FIX-001)
    let serviceabilityEta: string | null = cart.estimatedDeliveryEtaText || null;
    if (selectedAddress && cart.items.length > 0) {
      const fladoItems = cart.items.filter((i) => i.isFlado || i.fulfillmentSourceId);
      const marketplaceItems = cart.items.filter((i) => !i.isFlado && !i.fulfillmentSourceId);

      // 3a. Authoritative Flado Quick-Commerce serviceability evaluation across all Flado items
      if (fladoItems.length > 0) {
        for (const item of fladoItems) {
          const serviceability = await this.deliveryService.evaluateServiceability({
            variantId: item.variantId || item.sku,
            quantity: item.quantity,
            surface: DeliverySurface.QUICK_COMMERCE,
            pincode: selectedAddress.pincode,
            latitude: selectedAddress.lat || undefined,
            longitude: selectedAddress.lng || undefined,
            shopId: item.fulfillmentSourceId,
          });

          if (!serviceability.isServiceable) {
            blockers.push(
              serviceability.unserviceableReason ||
                `Flado Quick-Commerce item "${item.title || item.sku}" is unserviceable at the selected delivery address.`
            );
          } else if (serviceability.estimatedDeliveryText) {
            serviceabilityEta = serviceability.estimatedDeliveryText;
          }
        }
      }

      // 3b. Marketplace serviceability evaluation across marketplace items
      if (marketplaceItems.length > 0) {
        const firstMarketplace = marketplaceItems[0];
        const serviceability = await this.deliveryService.evaluateServiceability({
          variantId: firstMarketplace.variantId || firstMarketplace.sku,
          quantity: firstMarketplace.quantity,
          surface: DeliverySurface.MARKETPLACE,
          pincode: selectedAddress.pincode,
          latitude: selectedAddress.lat || undefined,
          longitude: selectedAddress.lng || undefined,
          shopId: firstMarketplace.fulfillmentSourceId,
        });

        if (!serviceability.isServiceable) {
          blockers.push(
            serviceability.unserviceableReason ||
              'Marketplace delivery location is unserviceable.'
          );
        } else if (!serviceabilityEta && serviceability.estimatedDeliveryText) {
          serviceabilityEta = serviceability.estimatedDeliveryText;
        }
      }
    }

    // 4. Delivery Option Evaluation
    const hasFladoItems = cart.items.some((i) => i.isFlado);
    const shippingCents = cart.shipping;

    const deliveryOptions: DeliveryOptionDto[] = [
      {
        id: hasFladoItems ? 'del-flado-instant' : 'del-standard',
        label: hasFladoItems ? 'Flado Quick-Commerce Delivery' : 'AuraMart Standard Delivery',
        description: serviceabilityEta || (hasFladoItems ? 'Superfast Darkstore Delivery' : 'Standard Courier Delivery'),
        etaText: serviceabilityEta || undefined,
        priceCents: shippingCents,
        formattedPrice: this.formatCurrency(shippingCents),
        isEligible: true,
        isSelected: !dto.deliveryOptionId || dto.deliveryOptionId === (hasFladoItems ? 'del-flado-instant' : 'del-standard'),
      },
    ];

    const selectedDeliveryOption = deliveryOptions.find((d) => d.isSelected) || deliveryOptions[0];

    // 5. Payment Method Eligibility
    const paymentMethods: PaymentMethodDto[] = [
      {
        id: 'pay-upi',
        type: 'UPI',
        label: 'UPI / Instant Pay',
        description: 'Google Pay, PhonePe, Paytm, BHIM',
        isEligible: true,
        isSelected: !dto.paymentMethod || dto.paymentMethod === 'pay-upi' || dto.paymentMethod === 'UPI',
      },
      {
        id: 'pay-card',
        type: 'CARD',
        label: 'Credit / Debit Card',
        description: 'Visa, Mastercard, RuPay',
        isEligible: true,
        isSelected: dto.paymentMethod === 'pay-card' || dto.paymentMethod === 'CARD',
      },
      {
        id: 'pay-cod',
        type: 'COD',
        label: 'Cash on Delivery (COD)',
        description: 'Pay upon delivery',
        isEligible: cart.grandTotal <= 100000, // Max $1000 COD threshold
        isSelected: dto.paymentMethod === 'pay-cod' || dto.paymentMethod === 'COD',
        uneligibleReason: cart.grandTotal > 100000 ? 'COD is unavailable for orders over $1,000.00' : undefined,
      },
    ];

    const selectedPaymentMethodObj = paymentMethods.find((p) => p.isSelected && p.isEligible);
    const selectedPaymentMethod = selectedPaymentMethodObj ? selectedPaymentMethodObj.id : null;

    if (!selectedPaymentMethodObj) {
      blockers.push('Valid payment method selection required');
    }

    const isEligible = blockers.length === 0;

    return {
      cartId: cart.cartId,
      customerId: cart.customerId,
      addresses,
      selectedAddress,
      deliveryOptions,
      selectedDeliveryOption,
      paymentMethods,
      selectedPaymentMethod,
      items: cart.items,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      formattedSubtotal: cart.formattedSubtotal,
      tax: cart.tax,
      formattedTax: cart.formattedTax,
      shipping: cart.shipping,
      formattedShipping: cart.formattedShipping,
      discount: cart.discount,
      formattedDiscount: cart.formattedDiscount,
      grandTotal: cart.grandTotal,
      formattedGrandTotal: cart.formattedGrandTotal,
      minimumBasketAmount: cart.minimumBasketAmount,
      isMinimumBasketMet: cart.isMinimumBasketMet,
      formattedMinimumBasketShortfall: cart.formattedMinimumBasketShortfall,
      storeAvailabilityStatus: cart.storeAvailabilityStatus,
      storeName: cart.storeName,
      checkoutEligibility: {
        isEligible,
        blockers,
      },
    };
  }
}
