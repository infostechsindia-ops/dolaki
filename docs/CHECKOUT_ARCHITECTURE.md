# AuraMart Checkout & Server Preview Architecture (CONTENT-005)

## 1. Overview

The AuraMart Checkout Architecture is built on 100% server-authoritative preview calculation (`POST /api/v1/checkout/preview`) and order placement (`POST /api/v1/orders`).

---

## 2. Server Order Preview Breakdown

All line-item math is calculated and validated server-side:
```typescript
export interface CheckoutPreviewResponseDto {
  items: Array<{
    variantId: string;
    title: string;
    quantity: number;
    unitPriceCents: number;
    totalPriceCents: number;
    isFlado: boolean;
  }>;
  subtotalCents: number;
  discountCents: number;
  couponDiscountCents: number;
  vipSavingsCents: number;
  deliveryFeeCents: number;
  handlingFeeCents: number;
  taxCents: number;
  grandTotalCents: number;
  totalSavingsCents: number;
  formattedSubtotal: string;
  formattedGrandTotal: string;
  checkoutEligibility: {
    canCheckout: boolean;
    blockers: string[];
  };
  selectedAddress: Address | null;
  selectedDeliveryOption: DeliveryOptionDto | null;
  selectedPaymentMethod: string;
}
```

---

## 3. Checkout Pipeline

1. **Cart Revalidation:** `CartService.getCart()` validates live stock and prices.
2. **Address Selection & IDOR Enforcement:** `CheckoutService` verifies selected address ownership.
3. **Delivery Serviceability & Time Slot Evaluation:** Evaluates 10-minute Flado express or marketplace standard shipping.
4. **Authoritative Order Creation:** `OrdersService.createOrder()` writes order, locks inventory, and applies coupon usage.
