'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FiTrash2, 
  FiZap, 
  FiTruck, 
  FiArrowRight, 
  FiPercent, 
  FiShoppingBag, 
  FiInfo, 
  FiClock, 
  FiLock,
  FiShare2,
  FiCheckCircle
} from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import styles from './page.module.css';

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    gst,
    deliveryFee,
    totalPrice,
    fladoItems,
    standardItems
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  // Selected delivery slots
  const [standardSlot, setStandardSlot] = useState<'standard' | 'priority'>('standard');
  const [fladoSlot, setFladoSlot] = useState<'instant' | 'next-hour'>('instant');

  // Wishlist share feedback states
  const [sharedAlert, setSharedAlert] = useState(false);
  const [wishlistCopied, setWishlistCopied] = useState(false);

  // Read query params on mount to load shared wishlist items
  useEffect(() => {
    const sharedItemsParam = searchParams.get('sharedItems');
    if (sharedItemsParam) {
      const itemIds = sharedItemsParam.split(',');
      let importedCount = 0;

      itemIds.forEach(id => {
        const product = products.find(p => p.id === id);
        if (product) {
          // Check if it's already in the cart to avoid duplicate incrementing on landing
          const exists = cart.some(item => item.product.id === id);
          if (!exists) {
            addToCart(product, 1);
            importedCount++;
          }
        }
      });

      if (importedCount > 0) {
        setSharedAlert(true);
        // Clear url search parameters without page refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        setTimeout(() => setSharedAlert(false), 4000);
      }
    }
  }, [searchParams, cart, addToCart]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.toUpperCase() === 'AURA100') {
      if (subtotal > 500) {
        setPromoDiscount(100);
        setPromoApplied(true);
      } else {
        setPromoError('Minimum order value for AURA100 is ₹500.');
      }
    } else if (promoCode.toUpperCase() === 'FLADO50') {
      if (fladoItems.length > 0) {
        setPromoDiscount(50);
        setPromoApplied(true);
      } else {
        setPromoError('Coupon FLADO50 is only valid if you have Flado groceries in your cart.');
      }
    } else {
      setPromoError('Invalid coupon code. Try AURA100 or FLADO50.');
    }
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem('auramart_discount', promoDiscount.toString());
    router.push('/checkout');
  };

  const handleShareWishlist = () => {
    if (cart.length === 0) return;
    const productIds = cart.map(item => item.product.id).join(',');
    const shareUrl = `${window.location.origin}/cart?sharedItems=${productIds}`;
    
    navigator.clipboard.writeText(shareUrl);
    setWishlistCopied(true);
    setTimeout(() => setWishlistCopied(false), 3000);
  };

  // Adjust fees based on chosen slots
  const prioritySurcharge = standardSlot === 'priority' ? 49 : 0;
  const deliveryCost = deliveryFee + prioritySurcharge;

  // Split CGST and SGST
  const cgst = Number((gst / 2).toFixed(2));
  const sgst = Number((gst / 2).toFixed(2));

  const finalTotal = Math.max(0, subtotal + gst + deliveryCost - promoDiscount);

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCartContainer}>
        <div className="container">
          <div className={styles.emptyCard}>
            <FiShoppingBag className={styles.emptyIcon} />
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet. Explore our premium catalog or order groceries now!</p>
            <div className={styles.emptyActions}>
              <Link href="/" className="btn-primary">
                Browse AuraMart
              </Link>
              <Link href="/flado" className="btn-secondary" style={{ color: 'var(--color-flado)', borderColor: 'var(--color-flado-light)' }}>
                Order Groceries
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className="container">
        
        {sharedAlert && (
          <div className={styles.sharedImportAlert}>
            <FiCheckCircle />
            <span>Shared wishlist items loaded successfully into your basket! 🎁</span>
          </div>
        )}

        <h1 className={styles.pageTitle}>Review Your Shopping Cart</h1>
        <div className={styles.cartGrid}>
          {/* Left Column: Split Bags */}
          <div className={styles.itemsColumn}>
            {/* Bag 1: Flado Items (10-Min Delivery) */}
            {fladoItems.length > 0 && (
              <div className={`${styles.bagCard} ${styles.fladoBag}`}>
                <div className={styles.bagHeader}>
                  <div className={styles.bagHeaderTitle}>
                    <FiZap className={styles.zapIcon} />
                    <h3>Flado Instant Basket</h3>
                  </div>
                  <span className={styles.bagETA}>Fulfilled in ~10 Mins</span>
                </div>
                
                {/* Flado Slot Picker */}
                <div className={styles.slotPickerSection}>
                  <h4>Choose Delivery Speed:</h4>
                  <div className={styles.slotsGrid}>
                    <button 
                      onClick={() => setFladoSlot('instant')}
                      className={`${styles.slotBtn} ${fladoSlot === 'instant' ? styles.activeSlotFlado : ''}`}
                    >
                      <FiZap />
                      <div>
                        <strong>Instant Delivery</strong>
                        <span>ETA: 10 mins (FREE)</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => setFladoSlot('next-hour')}
                      className={`${styles.slotBtn} ${fladoSlot === 'next-hour' ? styles.activeSlotFlado : ''}`}
                    >
                      <FiClock />
                      <div>
                        <strong>Scheduled Hour</strong>
                        <span>Next slot: Tomorrow morning</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className={styles.bagItemsList}>
                  {fladoItems.map((item) => (
                    <div key={item.product.id} className={styles.cartItem}>
                      <img src={item.product.image || (item.product.images && item.product.images[0]) || ''} alt={item.product.name} className={styles.itemImg} />
                      <div className={styles.itemDetails}>
                        <h4>{item.product.name}</h4>
                        <p className={styles.itemSubcat}>{item.product.subCategory}</p>
                        <div className={styles.qtyRow}>
                          <div className={styles.qtySelector}>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className={styles.removeBtn} aria-label="Remove item">
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>
                      <div className={styles.priceCol}>
                        <span className={styles.itemPrice}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        <span className={styles.itemUnitprice}>₹{item.product.price}/unit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bag 2: Standard Shipping Items */}
            {standardItems.length > 0 && (
              <div className={`${styles.bagCard} ${styles.standardBag}`}>
                <div className={styles.bagHeader}>
                  <div className={styles.bagHeaderTitle}>
                    <FiTruck className={styles.truckIcon} />
                    <h3>AuraMart Standard Shipment</h3>
                  </div>
                  <span className={styles.bagETA}>Fulfilled in 2-3 Days</span>
                </div>

                {/* Standard Slot Picker */}
                <div className={styles.slotPickerSection}>
                  <h4>Choose Courier Priority:</h4>
                  <div className={styles.slotsGrid}>
                    <button 
                      onClick={() => setStandardSlot('standard')}
                      className={`${styles.slotBtn} ${standardSlot === 'standard' ? styles.activeSlotStandard : ''}`}
                    >
                      <FiTruck />
                      <div>
                        <strong>Standard Courier</strong>
                        <span>ETA: 2-3 Business Days (FREE)</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => setStandardSlot('priority')}
                      className={`${styles.slotBtn} ${standardSlot === 'priority' ? styles.activeSlotStandard : ''}`}
                    >
                      <FiZap />
                      <div>
                        <strong>Premium Priority Air</strong>
                        <span>ETA: Next Day Delivery (+₹49)</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className={styles.bagItemsList}>
                  {standardItems.map((item) => (
                    <div key={item.product.id} className={styles.cartItem}>
                      <img src={item.product.image || (item.product.images && item.product.images[0]) || ''} alt={item.product.name} className={styles.itemImg} />
                      <div className={styles.itemDetails}>
                        <h4>{item.product.name}</h4>
                        <p className={styles.itemSubcat}>{item.product.subCategory}</p>
                        <div className={styles.qtyRow}>
                          <div className={styles.qtySelector}>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className={styles.removeBtn} aria-label="Remove item">
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>
                      <div className={styles.priceCol}>
                        <span className={styles.itemPrice}>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        <span className={styles.itemUnitprice}>₹{item.product.price}/unit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing Summary */}
          <div className={styles.summaryColumn}>
            
            {/* Social Share Cart as Wishlist Block */}
            <div className={styles.summaryCard} style={{ border: wishlistCopied ? '1px dashed var(--color-success)' : '1px dashed var(--color-border)' }}>
              <h3 className={styles.summaryTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiShare2 /> Squad Shopping
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '14px', lineHeight: 1.4, fontWeight: 550 }}>
                Share your active cart items with friends or family so they can easily buy or view them!
              </p>
              <button 
                onClick={handleShareWishlist}
                className={styles.shareWishlistBtn}
              >
                {wishlistCopied ? 'Wishlist Link Copied! 🎁' : 'Share Cart as Wishlist 📤'}
              </button>
            </div>

            {/* Coupon Code Block */}
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Apply Coupon Code</h3>
              <form onSubmit={handleApplyPromo} className={styles.promoForm}>
                <input
                  type="text"
                  placeholder="Enter code (AURA100 or FLADO50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={styles.promoInput}
                  disabled={promoApplied}
                />
                <button type="submit" className={styles.promoBtn} disabled={promoApplied}>
                  Apply
                </button>
              </form>
              {promoApplied && (
                <div className={styles.promoSuccess}>
                  <FiPercent className={styles.discountIcon} />
                  <span>Coupon applied! You saved ₹{promoDiscount}.</span>
                  <button
                    onClick={() => {
                      setPromoApplied(false);
                      setPromoDiscount(0);
                    }}
                    className={styles.removePromo}
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoError && <p className={styles.promoError}>{promoError}</p>}
            </div>

            {/* Price Calculations */}
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Price Summary</h3>
              <div className={styles.breakdownList}>
                <div className={styles.calcRow}>
                  <span>Cart Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.calcRow}>
                  <span>CGST (9%)</span>
                  <span>₹{cgst.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.calcRow}>
                  <span>SGST (9%)</span>
                  <span>₹{sgst.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.calcRow}>
                  <span>Delivery Convenience Fee</span>
                  <span>{deliveryCost === 0 ? 'FREE' : `₹${deliveryCost}`}</span>
                </div>
                {promoApplied && (
                  <div className={`${styles.calcRow} ${styles.discountText}`}>
                    <span>Coupon Discount</span>
                    <span>- ₹{promoDiscount}</span>
                  </div>
                )}
                <div className={styles.divider}></div>
                <div className={`${styles.calcRow} ${styles.finalTotalRow}`}>
                  <span>Grand Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button 
                onClick={handleProceedToCheckout} 
                className={styles.checkoutBtn}
              >
                Proceed to Checkout <FiArrowRight />
              </button>

              {/* Secure Trust Emblem */}
              <div className={styles.securePaymentStrip}>
                <FiLock className={styles.lockIcon} />
                <span>100% Encrypted Transactions</span>
              </div>

              <div className={styles.termsBox}>
                <FiInfo className={styles.infoIcon} />
                <p>Orders are automatically split depending on product darkstore locations. Standard packages require custom delivery partners, while Groceries are fulfilled immediately by nearby local riders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading Cart details...</p>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
