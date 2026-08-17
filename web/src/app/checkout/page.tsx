'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import { ShippingAddressCardProps, ShippingAddressData } from '@/components/checkout/ShippingAddressCard';
import { DeliveryMethod } from '@/components/checkout/DeliveryMethodSelector';
import { PaymentMethodOption } from '@/components/checkout/PaymentMethodSelector';
import { OrderSummaryItem } from '@/components/checkout/OrderSummary';

function CheckoutContent() {
  const router = useRouter();
  const { cart, formattedSubtotal, formattedTax, formattedShipping, formattedGrandTotal, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | undefined>(undefined);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('pay-upi');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | undefined>(undefined);

  // Fetch authoritative checkout preview from server
  const fetchPreview = async (addressId?: string, deliveryId?: string, paymentId?: string) => {
    setIsLoading(true);
    setFetchError(undefined);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
      if (token) {
        const res = await fetch('/api/v1/checkout/preview', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressId,
            deliveryOptionId: deliveryId,
            paymentMethod: paymentId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setPreviewData(data);
          if (data.selectedAddress?.id) setSelectedAddressId(data.selectedAddress.id);
          if (data.selectedDeliveryOption?.id) setSelectedDeliveryId(data.selectedDeliveryOption.id);
          if (data.selectedPaymentMethod) setSelectedPaymentId(data.selectedPaymentMethod);
          return;
        } else {
          setFetchError('Could not load your checkout details. Please try again.');
        }
      }
    } catch (e) {
      console.warn('Checkout preview fetch failed:', e);
      setFetchError('Network error — could not reach checkout service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchPreview(selectedAddressId, selectedDeliveryId, selectedPaymentId);
  };

  useEffect(() => {
    fetchPreview(selectedAddressId, selectedDeliveryId, selectedPaymentId);
  }, []);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    fetchPreview(id, selectedDeliveryId, selectedPaymentId);
  };

  const handleAddNewAddress = async (formData: any) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
      if (token) {
        const res = await fetch('/api/v1/users/addresses', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const newAddress = await res.json();
          setSelectedAddressId(newAddress.id);
          await fetchPreview(newAddress.id, selectedDeliveryId, selectedPaymentId);
        }
      }
    } catch (e) {
      console.warn('Failed to add new address:', e);
    }
  };

  const handleSelectDelivery = (id: string) => {
    setSelectedDeliveryId(id);
    fetchPreview(selectedAddressId, id, selectedPaymentId);
  };

  const handleSelectPayment = (id: string) => {
    setSelectedPaymentId(id);
    fetchPreview(selectedAddressId, selectedDeliveryId, id);
  };

  const handlePlaceOrderPreview = async () => {
    // CMD-043: Display validation errors first
    setShowValidation(true);

    const isCod = selectedPaymentId === 'cod' || selectedPaymentId === 'pay-cod' || selectedPaymentId.toLowerCase().includes('cod');
    const addressPhone = addressProps?.address?.phone || '';
    const phoneDigits = addressPhone.replace(/\D/g, '');
    const isCodPhoneInvalid = isCod && phoneDigits.length !== 10;

    // Compute validity inline — avoids stale state from useEffect
    const validNow =
      !!addressProps &&
      !isCodPhoneInvalid &&
      !!(selectedDeliveryId || deliveryMethodsList[0]?.id) &&
      !!selectedPaymentId &&
      (!previewData?.checkoutEligibility || previewData.checkoutEligibility.isEligible);

    if (!validNow || isProcessingPayment) return;

    // CMD-045: Direct payment orchestration — never in useEffect to prevent double-fire
    setIsProcessingPayment(true);
    setPaymentError(undefined);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
      if (token) {
        // 1. Create Payment Intent (Server-Authoritative)
        const intentRes = await fetch('/api/v1/payments/intents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addressId: selectedAddressId || addressProps?.address?.id,
            deliveryOptionId: selectedDeliveryId || deliveryMethodsList[0]?.id,
            paymentMethod: selectedPaymentId || 'pay-upi',
          }),
        });

        if (!intentRes.ok) {
          const errData = await intentRes.json();
          setPaymentError(errData.message || errData.error?.message || 'Payment intent creation failed. Please try again.');
          setIsProcessingPayment(false);
          return;
        }

        const intent = await intentRes.json();

        // 2. Confirm Payment Intent
        if (intent.status !== 'SUCCEEDED') {
          const confirmRes = await fetch(`/api/v1/payments/intents/${intent.id}/confirm`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentMethod: selectedPaymentId,
            }),
          });

          if (!confirmRes.ok) {
            const errData = await confirmRes.json();
            setPaymentError(errData.message || errData.error?.message || 'Payment confirmation failed. Please try again.');
            setIsProcessingPayment(false);
            return;
          }
        }

        // 3. CMD-046 Authoritative Order Placement
        const orderRes = await fetch('/api/v1/orders/place', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: intent.id,
            addressId: selectedAddressId || addressProps?.address?.id,
            deliveryOptionId: selectedDeliveryId || deliveryMethodsList[0]?.id,
          }),
        });

        if (!orderRes.ok) {
          const errData = await orderRes.json();
          setPaymentError(errData.message || errData.error?.message || 'Order placement failed. Please try again.');
          setIsProcessingPayment(false);
          return;
        }

        const placedOrder = await orderRes.json();
        if (clearCart) clearCart();
        router.push(`/orders?placedId=${placedOrder.id}`);
      } else {
        // Unauthenticated preview mode fallback
        if (clearCart) clearCart();
        router.push('/orders');
      }
    } catch (e) {
      console.warn('Payment orchestration failed:', e);
      setPaymentError('Network error — could not reach payment service. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isFladoCart = cart.some((i) => i.product.isFlado);

  // CMD-044: Address book entries for AddressSelector
  const savedAddresses: any[] = previewData?.addresses || [];
  const addressBookEntries = savedAddresses.map((a: any) => ({
    id: a.id,
    label: a.label || 'Home',
    fullName: a.fullName || 'Valued Customer',
    phone: a.phone || '',
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault,
    lat: a.lat,
    lng: a.lng,
  }));

  // Address card props
  const addressProps: ShippingAddressCardProps | undefined = previewData?.selectedAddress
    ? {
        address: {
          name: previewData.selectedAddress.fullName || 'Valued Customer',
          phone: previewData.selectedAddress.phone || '',
          addressLine1: previewData.selectedAddress.line1,
          addressLine2: previewData.selectedAddress.line2,
          city: previewData.selectedAddress.city,
          state: previewData.selectedAddress.state,
          country: 'India',
          postalCode: previewData.selectedAddress.pincode,
          isDefault: previewData.selectedAddress.isDefault,
          label: previewData.selectedAddress.label,
          lat: previewData.selectedAddress.lat,
          lng: previewData.selectedAddress.lng,
        },
      }
    : previewData?.addresses?.length > 0
    ? {
        address: {
          name: previewData.addresses[0].fullName || 'Valued Customer',
          phone: previewData.addresses[0].phone || '',
          addressLine1: previewData.addresses[0].line1,
          addressLine2: previewData.addresses[0].line2,
          city: previewData.addresses[0].city,
          state: previewData.addresses[0].state,
          country: 'India',
          postalCode: previewData.addresses[0].pincode,
          isDefault: previewData.addresses[0].isDefault,
          label: previewData.addresses[0].label,
          lat: previewData.addresses[0].lat,
          lng: previewData.addresses[0].lng,
        },
      }
    : undefined;

  // Delivery options props
  const deliveryMethodsList: DeliveryMethod[] = previewData?.deliveryOptions?.map((d: any) => ({
    id: d.id,
    name: d.label,
    description: d.description || d.etaText || 'Standard Delivery',
    etaText: d.etaText || '1-3 Business Days',
    priceText: d.formattedPrice,
  })) || [
    {
      id: isFladoCart ? 'del-flado-instant' : 'del-standard',
      name: isFladoCart ? 'Flado Quick-Commerce Delivery' : 'AuraMart Standard Delivery',
      description: isFladoCart ? 'Superfast Darkstore Delivery' : 'Standard Courier Delivery',
      etaText: isFladoCart ? '10-15 mins' : '1-3 Business Days',
      priceText: formattedShipping || 'FREE',
    },
  ];

  // Payment method options props
  const paymentMethodsList: PaymentMethodOption[] = previewData?.paymentMethods?.map((p: any) => ({
    id: p.id,
    name: p.label,
    description: p.uneligibleReason || p.description || '',
  })) || [
    { id: 'pay-upi', name: 'UPI / Instant Pay', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'pay-card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay' },
    { id: 'pay-cod', name: 'Cash on Delivery (COD)', description: 'Pay upon delivery' },
  ];

  // Order summary items
  const summaryItems: OrderSummaryItem[] = (previewData?.items || cart).map((i: any) => ({
    id: i.id || i.product?.id,
    title: i.title || i.product?.name,
    image: i.image || i.product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    priceText: i.formattedLineTotal || `$${(i.product?.price * i.quantity).toFixed(2)}`,
    quantity: i.quantity,
  }));

  const grandTotalStr = previewData?.formattedGrandTotal || formattedGrandTotal || '$0.00';

  // CMD-043: Derive per-section inline validation errors (shown after first submission attempt)
  const hasNoAddress = !addressProps;
  const hasNoDelivery =
    deliveryMethodsList.length > 0 &&
    !(selectedDeliveryId || deliveryMethodsList[0]?.id);
  const hasNoPayment = !selectedPaymentId;

  const isCod = selectedPaymentId === 'cod' || selectedPaymentId === 'pay-cod' || selectedPaymentId.toLowerCase().includes('cod');
  const addressPhone = addressProps?.address?.phone || '';
  const phoneDigits = addressPhone.replace(/\D/g, '');
  const isCodPhoneInvalid = isCod && phoneDigits.length !== 10;

  const validationErrors = (showValidation || isCodPhoneInvalid)
    ? {
        address: hasNoAddress
          ? 'Please add a delivery address to continue.'
          : isCodPhoneInvalid
          ? 'Valid 10-digit phone number required for Cash on Delivery orders'
          : undefined,
        delivery: hasNoDelivery ? 'Please select a delivery method to continue.' : undefined,
        payment: hasNoPayment ? 'Please select a payment method to continue.' : undefined,
      }
    : undefined;

  // Navigate if no validation blockers remain after surface errors are shown
  const isValidToPlace =
    !hasNoAddress && !hasNoDelivery && !hasNoPayment &&
    (!previewData?.checkoutEligibility || previewData.checkoutEligibility.isEligible);

  // NOTE: Payment orchestration is handled directly in handlePlaceOrderPreview above.
  // Do NOT move payment API calls into useEffect — it risks double-fire in React StrictMode.

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <CheckoutPage
        title="Checkout Preview"
        progress={{
          currentStep: 'review',
          steps: [
            { id: 'cart', label: 'Cart' },
            { id: 'address', label: 'Address' },
            { id: 'payment', label: 'Payment' },
            { id: 'review', label: 'Review Preview' },
          ],
        }}
        isLoading={isLoading}
        isEmpty={cart.length === 0}
        surface={isFladoCart ? 'QUICK_COMMERCE' : 'MARKETPLACE'}
        blockers={previewData?.checkoutEligibility?.blockers || []}
        grandTotalFormatted={grandTotalStr}
        address={addressProps}
        addressSelector={
          addressBookEntries.length > 0
            ? {
                addresses: addressBookEntries,
                selectedId: selectedAddressId || addressBookEntries[0]?.id,
                onSelect: handleSelectAddress,
                onAddNew: handleAddNewAddress,
              }
            : undefined
        }
        deliveryMethods={{
          methods: deliveryMethodsList,
          selectedId: selectedDeliveryId || deliveryMethodsList[0]?.id,
          onSelectMethod: handleSelectDelivery,
        }}
        paymentMethods={{
          methods: paymentMethodsList,
          selectedId: selectedPaymentId,
          onSelectMethod: handleSelectPayment,
        }}
        notes={{
          value: deliveryNotes,
          onChange: setDeliveryNotes,
        }}
        orderSummary={{
          items: summaryItems,
        }}
        billingSummary={{
          subtotal: previewData?.formattedSubtotal || formattedSubtotal || '$0.00',
          shipping: previewData?.formattedShipping || formattedShipping || 'FREE',
          tax: previewData?.formattedTax || formattedTax || '$0.00',
          discount: previewData?.formattedDiscount || '$0.00',
          grandTotal: grandTotalStr,
        }}
        placeOrder={{
          termsAccepted,
          onTermsChange: setTermsAccepted,
          onPlaceOrder: handlePlaceOrderPreview,
          buttonLabel: 'Review Order Preview',
          disabled: !previewData?.checkoutEligibility?.isEligible,
        }}
        onReturnToCart={() => router.push('/cart')}
        fetchError={fetchError}
        onRetry={handleRetry}
        validationErrors={validationErrors}
        isProcessingPayment={isProcessingPayment}
        paymentError={paymentError}
      />
    </div>
  );
}

export default function CheckoutPageRoute() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>Loading Checkout Preview...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
