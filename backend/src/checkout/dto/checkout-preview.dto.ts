import { IsString, IsOptional } from 'class-validator';

export class CheckoutPreviewDto {
  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @IsString()
  deliveryOptionId?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export interface DeliveryOptionDto {
  id: string;
  label: string;
  description?: string;
  etaText?: string;
  priceCents: number;
  formattedPrice: string;
  isEligible: boolean;
  isSelected: boolean;
}

export interface PaymentMethodDto {
  id: string;
  type: 'UPI' | 'CARD' | 'COD' | 'WALLET';
  label: string;
  description?: string;
  isEligible: boolean;
  isSelected: boolean;
  uneligibleReason?: string;
}

export interface CheckoutPreviewResponseDto {
  cartId: string;
  customerId: string;
  addresses: any[];
  selectedAddress: any | null;
  deliveryOptions: DeliveryOptionDto[];
  selectedDeliveryOption: DeliveryOptionDto | null;
  paymentMethods: PaymentMethodDto[];
  selectedPaymentMethod: string | null;
  items: any[];
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
  minimumBasketAmount?: number | null;
  isMinimumBasketMet: boolean;
  formattedMinimumBasketShortfall?: string | null;
  storeAvailabilityStatus: 'OPEN' | 'CLOSED' | 'UNAVAILABLE' | 'SERVICED';
  storeName?: string | null;
  checkoutEligibility: {
    isEligible: boolean;
    blockers: string[];
  };
}
