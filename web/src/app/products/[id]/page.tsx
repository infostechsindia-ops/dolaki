'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  FiStar, 
  FiShoppingBag, 
  FiTruck, 
  FiZap, 
  FiPlus, 
  FiMinus, 
  FiShield, 
  FiRotateCcw, 
  FiCheckCircle, 
  FiHeart, 
  FiTag, 
  FiGift, 
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink
} from 'react-icons/fi';
import { products as localProducts, Product } from '@/data/products';
import { fladoProductsData } from '@/data/fladoProducts';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [bundleProducts, setBundleProducts] = useState<Product[]>([]);
  const [checkedBundleItems, setCheckedBundleItems] = useState<boolean[]>([true, true, true]);

  // Variant selectors
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Expandable details accordion
  const [openAccordion, setOpenAccordion] = useState<string>('features');

  // Pincode ETA Checker
  const [pincode, setPincode] = useState('');
  const [etaMessage, setEtaMessage] = useState<string | null>(null);

  // Image Magnifier zoom coordinate
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  const { cart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    const loadProductData = async () => {
      let fetchedProduct: Product | null = null;
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const bp = await res.json();
          fetchedProduct = {
            ...bp,
            name: bp.title || '',
            price: bp.discountPrice ?? bp.basePrice,
            originalPrice: bp.basePrice,
            image: bp.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
            rating: bp.rating ?? 4.5,
            reviewsCount: bp.reviewCount ?? 12,
            category: bp.category || 'groceries',
            subCategory: bp.subCategory || '',
            brand: bp.brand || '',
            isFlado: bp.isQuickCommerce ?? false,
            colors: bp.colorsJson ? JSON.parse(bp.colorsJson) : [],
            sizes: bp.sizesJson ? JSON.parse(bp.sizesJson) : [],
            specifications: bp.specifications ? (typeof bp.specifications === 'string' ? JSON.parse(bp.specifications) : bp.specifications) : {}
          };
        }
      } catch (e) {
        console.log('Failed to fetch product by ID from backend. Falling back to local data.');
      }

      if (!fetchedProduct) {
        const found = localProducts.find((p) => p.id === id) || fladoProductsData.find((p) => p.id === id);
        if (found) fetchedProduct = found;
      }

      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setActiveImage(fetchedProduct.image || (fetchedProduct.images && fetchedProduct.images[0]) || '');
        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0]);
        }
        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
        // Find Frequently Bought Together items
        const related = [...localProducts, ...fladoProductsData]
          .filter((p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 2);
        setBundleProducts(related);
      }
      setLoading(false);
    };

    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Loading premium product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleIncrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(product.id, quantityInCart + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleDecrement = () => {
    updateQuantity(product.id, quantityInCart - 1);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 6) {
      setEtaMessage('⚠️ Invalid pincode. Must be 6 digits.');
      return;
    }
    if (product.isFlado) {
      setEtaMessage('⚡ Deliver in 10 mins! Eligible for Flado instant checkout.');
    } else {
      const isMetro = pincode.startsWith('1') || pincode.startsWith('4') || pincode.startsWith('5');
      setEtaMessage(isMetro ? '🟢 Arrives tomorrow morning! Express shipping.' : '🟢 Arrives in 2-3 business days.');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '220%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Get recommendations from same category
  const recommendations = [...localProducts, ...fladoProductsData]
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Fallback brand slug matching
  const brandSlug = product.brand ? product.brand.toLowerCase().replace(/\s+/g, '-') : 'general';

  // Sample Customer Reviews
  const reviews = [
    { name: 'Arjun Mehta', rating: 5, date: 'June 22, 2026', comment: 'Superb quality! Totally matched the description and delivered super fast.' },
    { name: 'Priya Nair', rating: 4, date: 'June 18, 2026', comment: 'Very useful, color looks extremely rich. Value for money purchase.' },
    { name: 'Rohan Joshi', rating: 5, date: 'May 30, 2026', comment: 'Brilliant performance. Sourced original product and securely packaged.' }
  ];

  // Frequently Bought Together calculation
  const allBundleItems = product ? [product, ...bundleProducts] : [];
  
  const totalBundlePrice = allBundleItems.reduce((acc, item, idx) => {
    if (checkedBundleItems[idx]) {
      return acc + item.price;
    }
    return acc;
  }, 0);
  
  const totalBundleOriginalPrice = allBundleItems.reduce((acc, item, idx) => {
    if (checkedBundleItems[idx]) {
      return acc + (item.originalPrice || item.price);
    }
    return acc;
  }, 0);
  
  const bundleSavings = totalBundleOriginalPrice - totalBundlePrice;

  const handleAddBundleToCart = () => {
    allBundleItems.forEach((item, idx) => {
      if (checkedBundleItems[idx]) {
        const existing = cart.find(c => c.product.id === item.id);
        if (!existing) {
          addToCart(item, 1);
        }
      }
    });
    alert('🛒 Selected bundle products added to your cart!');
  };

  return (
    <div className={styles.pdpContainer}>
      <div className="container">
        {/* Main Content Layout */}
        <div className={styles.mainGrid}>
          
          {/* Left Column: Image Gallery with thumbnail selection */}
          <div className={styles.galleryColumn}>
            <div 
              className={styles.mainImageWrapper}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img src={activeImage} alt={product.name} className={styles.mainImage} />
              <div className={styles.zoomLens} style={zoomStyle}></div>
            </div>
            
            {/* Gallery Thumbnails */}
            <div className={styles.thumbnails}>
              <button
                onClick={() => setActiveImage(product.image || '')}
                className={`${styles.thumbBtn} ${activeImage === product.image ? styles.thumbActive : ''}`}
              >
                <img src={product.image} alt="Main thumbnail" className={styles.thumbImg} />
              </button>
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`${styles.thumbBtn} ${activeImage === img ? styles.thumbActive : ''}`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Selection */}
          <div className={styles.infoColumn}>
            <div className={styles.titleWrapper}>
              <span className={styles.subCategory}>{product.category} &rsaquo; {product.subCategory}</span>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                aria-label="Wishlist"
              >
                <FiHeart className={styles.heartIcon} />
              </button>
            </div>
            
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Sold By Flagship Badge */}
            {product.brand && (
              <div className={styles.brandBadgeSec}>
                <span>Sold by: </span>
                <Link href={`/brands/${brandSlug}`} className={styles.brandLink}>
                  <strong>{product.brand}</strong> <FiExternalLink size={12} />
                </Link>
                <span className={styles.verifiedBadge}>Verified Brand Store</span>
              </div>
            )}

            {/* Rating Row */}
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar
                    key={s}
                    className={s <= Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                  />
                ))}
                <span className={styles.ratingValue}>{product.rating}</span>
              </div>
              <span className={styles.reviewsCount}>{product.reviewsCount} customer reviews</span>
            </div>

            {/* Price Block */}
            <div className={styles.priceBlock}>
              <div className={styles.priceRow}>
                <span className={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className={styles.discountBadge}>{discountPercent}% OFF</span>
                  </>
                )}
              </div>
              <p className={styles.taxesText}>Inclusive of all local GST, taxes and dispatch charges</p>
            </div>

            {/* Color Swatch Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className={styles.variantsBlock}>
                <h4>Select Color:</h4>
                <div className={styles.colorSwatches}>
                  {product.colors.map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`${styles.colorSwatch} ${selectedColor === col ? styles.activeColor : ''}`}
                      style={{ backgroundColor: col.toLowerCase() }}
                      title={col}
                    >
                      {selectedColor === col && <FiCheck className={styles.checkColorIcon} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.variantsBlock}>
                <h4>Select Size Option:</h4>
                <div className={styles.sizeSwatches}>
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`${styles.sizeSwatch} ${selectedSize === sz ? styles.activeSize : ''}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Alert */}
            {product.generalStock > 0 && product.generalStock < 10 && (
              <p className={styles.stockAlert}>⚠️ Only {product.generalStock} left in stock - order soon!</p>
            )}

            {/* Pincode ETA Checker */}
            <div className={styles.etaCheckerBlock}>
              <h4>Check Fast Delivery Pincode:</h4>
              <form onSubmit={handlePincodeCheck} className={styles.etaForm}>
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className={styles.pincodeInput}
                />
                <button type="submit" className={styles.pincodeBtn}>Check</button>
              </form>
              {etaMessage && <p className={styles.etaMessage}>{etaMessage}</p>}
            </div>

            {/* Offers Strip */}
            <div className={styles.offersBlock}>
              <h4>Exclusive Active Offers:</h4>
              <div className={styles.offerItem}>
                <FiTag className={styles.offerIcon} />
                <div>
                  <strong>Card Discount Promotion</strong>
                  <p>Flat 10% instant discount on HDFC Bank Credit & Debit Cards.</p>
                </div>
              </div>
              <div className={styles.offerItem}>
                <FiGift className={styles.offerIcon} />
                <div>
                  <strong>AuraPay Cash Back</strong>
                  <p>Get flat ₹50 cashback added to AuraPay wallet balance above ₹1,000.</p>
                </div>
              </div>
            </div>

            {/* Delivery Box Speed details */}
            <div className={`${styles.deliveryBox} ${product.isFlado ? styles.fladoDelivery : styles.standardDelivery}`}>
              {product.isFlado ? (
                <>
                  <FiZap className={styles.deliveryIcon} />
                  <div>
                    <h4>⚡ Instant 10-Minute Flado Delivery Eligible</h4>
                    <p>Dispatched from local Bandra Flado darkstore hub.</p>
                  </div>
                </>
              ) : (
                <>
                  <FiTruck className={styles.deliveryIcon} />
                  <div>
                    <h4>🚚 Standard Express Shipping Eligible</h4>
                    <p>FREE delivery on orders above ₹499. Dispatched in 24 hours.</p>
                  </div>
                </>
              )}
            </div>

            {/* Cart Actions */}
            <div className={styles.actionsRow}>
              {quantityInCart > 0 ? (
                <div className={styles.qtyContainer}>
                  <button onClick={handleDecrement} className={styles.qtyBtn} aria-label="Decrease quantity">
                    <FiMinus />
                  </button>
                  <span className={styles.qtyVal}>{quantityInCart}</span>
                  <button onClick={handleIncrement} className={styles.qtyBtn} aria-label="Increase quantity">
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleIncrement} 
                  className={`${styles.addBtn} ${product.isFlado ? styles.fladoAddBtn : ''}`}
                >
                  <FiShoppingBag /> Add to Cart Basket
                </button>
              )}
            </div>

            {/* Accordion Expandables */}
            <div className={styles.accordionContainer}>
              <div className={styles.accordionItem}>
                <button onClick={() => setOpenAccordion(openAccordion === 'features' ? '' : 'features')}>
                  <span>Key Features</span>
                  {openAccordion === 'features' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openAccordion === 'features' && (
                  <div className={styles.accordionContent}>
                    <p>{product.description}</p>
                  </div>
                )}
              </div>

              <div className={styles.accordionItem}>
                <button onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}>
                  <span>Specifications</span>
                  {openAccordion === 'specs' ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openAccordion === 'specs' && (
                  <div className={styles.accordionContent}>
                    <table className={styles.specsTable}>
                      <tbody>
                        {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Story / Brand Spotlight */}
            {product.brand && (
              <div className={styles.brandStorySection}>
                <h4>From the House of {product.brand}</h4>
                <p>Authentic and original items backed by certified seller warranties. Browse other launches in this line.</p>
                <Link href={`/brands/${brandSlug}`} className={styles.brandStoryLink}>
                  Explore the Flagship Store
                </Link>
              </div>
            )}

            {/* Trust Perks */}
            <div className={styles.trustPerks}>
              <div className={styles.perk}>
                <FiShield className={styles.perkIcon} />
                <span>100% Brand Guarantee</span>
              </div>
              <div className={styles.perk}>
                <FiRotateCcw className={styles.perkIcon} />
                <span>7-Day Replacement Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle Section */}
        {bundleProducts.length > 0 && (
          <section className={styles.bundleSection}>
            <h3>Frequently Bought Together</h3>
            <div className={styles.bundleFlex}>
              {allBundleItems.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <span className={styles.bundlePlus}>+</span>}
                  <div className={styles.bundleItem}>
                    <input
                      type="checkbox"
                      className={styles.bundleCheckbox}
                      checked={checkedBundleItems[idx]}
                      onChange={() => {
                        const next = [...checkedBundleItems];
                        next[idx] = !next[idx];
                        setCheckedBundleItems(next);
                      }}
                    />
                    <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} />
                    <span className={styles.bundleItemName} title={item.name}>{item.name}</span>
                    <span className={styles.bundleItemPrice}>₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                </React.Fragment>
              ))}
              
              <span className={styles.bundleEquals}>=</span>
              
              <div className={styles.bundleBuyBox}>
                <div className={styles.bundleTotal}>Total: ₹{totalBundlePrice.toLocaleString('en-IN')}</div>
                {bundleSavings > 0 && (
                  <div className={styles.bundleSaving}>You Save: ₹{bundleSavings.toLocaleString('en-IN')}</div>
                )}
                <button className={styles.bundleBtn} onClick={handleAddBundleToCart}>
                  Add Selected to Cart
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <section className={styles.reviewsSection}>
          <h3>Customer Review Breakdown</h3>
          <div className={styles.reviewsLayout}>
            {/* Avg score rating breakdown bars */}
            <div className={styles.ratingSummaryBox}>
              <div className={styles.averageValue}>{product.rating}</div>
              <div className={styles.starRow}>
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} className={s <= Math.floor(product.rating) ? styles.starFilled : styles.starEmpty} />
                ))}
              </div>
              <span>Out of 5 Stars</span>
              
              <div className={styles.breakdownGrid}>
                {[5, 4, 3, 2, 1].map(stars => {
                  const pctMap: Record<number, number> = { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 };
                  const pct = pctMap[stars] || 0;
                  return (
                    <div key={stars} className={styles.breakdownRow}>
                      <span className={styles.breakdownLabel}>{stars} Star</span>
                      <div className={styles.breakdownBarOutline}>
                        <div className={styles.breakdownBarFill} style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className={styles.breakdownPct}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews Cards */}
            <div className={styles.reviewsCardsList}>
              {reviews.map((rev, idx) => (
                <div key={idx} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <strong>{rev.name}</strong>
                    <span>{rev.date}</span>
                  </div>
                  <div className={styles.reviewStars}>
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} className={s <= rev.rating ? styles.starFilled : styles.starEmpty} size={14} />
                    ))}
                  </div>
                  <p>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Similar Recommendations */}
        {recommendations.length > 0 && (
          <section className={styles.recSection}>
            <h3 className={styles.recTitle}>Similar Products You May Like</h3>
            <div className={styles.recGrid}>
              {recommendations.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Actions Bar (appears on scrolling) */}
      <div className={styles.stickyFooterCartBar}>
        <div className="container">
          <div className={styles.stickyInner}>
            <div className={styles.stickyProduct}>
              <img src={product.image} alt={product.name} />
              <div>
                <h5>{product.name}</h5>
                <strong>₹{product.price.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <div className={styles.stickyActions}>
              {quantityInCart > 0 ? (
                <div className={styles.qtyContainerCompact}>
                  <button onClick={handleDecrement} className={styles.qtyBtnCompact}><FiMinus /></button>
                  <span>{quantityInCart}</span>
                  <button onClick={handleIncrement} className={styles.qtyBtnCompact}><FiPlus /></button>
                </div>
              ) : (
                <button 
                  onClick={handleIncrement} 
                  className={`${styles.stickyAddBtn} ${product.isFlado ? styles.fladoAddBtn : ''}`}
                >
                  <FiShoppingBag /> Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
