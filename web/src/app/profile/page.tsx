'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiShoppingBag, 
  FiMapPin, 
  FiCreditCard, 
  FiZap, 
  FiTruck, 
  FiChevronRight, 
  FiPlus, 
  FiTrash2, 
  FiAward,
  FiCalendar,
  FiTarget,
  FiTrendingUp,
  FiShare2,
  FiCheckCircle,
  FiInfo,
  FiHeart,
  FiBell,
  FiRotateCcw,
  FiSettings,
  FiHelpCircle,
  FiLock,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { useAuraCoins } from '@/context/AuraCoinContext';
import styles from './page.module.css';

type TabType = 'loyalty' | 'orders' | 'addresses' | 'wallet' | 'wishlist' | 'notifications' | 'returns' | 'refer' | 'settings' | 'help';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('loyalty');
  const [copiedCode, setCopiedCode] = useState(false);

  const user = {
    name: 'Arif Al Nukhbah',
    email: 'arif@antigravity.in',
    phone: '+91 98765 43210',
    loyaltyTier: 'Aura Platinum Member',
    joinedDate: 'Joined September 2025'
  };

  // Wallet top-up state
  const [walletBalance, setWalletBalance] = useState(1250);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  // Address list state
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home Address', address: 'Apt 402, Sea Green Apartments, Carter Road, Bandra West', city: 'Mumbai', pincode: '400050' },
    { id: 2, type: 'Office Address', address: 'Level 12, Maker Chambers VI, Nariman Point', city: 'Mumbai', pincode: '400021' }
  ]);
  const [newAddrType, setNewAddrType] = useState('Home Address');
  const [newAddrText, setNewAddrText] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [showAddrForm, setShowAddrForm] = useState(false);

  // Settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Mocked wishlist products
  const [wishlistItems, setWishlistItems] = useState([
    { id: 'ele-1', name: 'AuraPods Pro ANC Earbuds', price: 8999, originalPrice: 12999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300' },
    { id: 'gro-4', name: 'Hass Avocados (2 Pcs)', price: 299, originalPrice: 399, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300' },
    { id: 'be-1', name: 'Vitamin C Radiant Face Serum', price: 599, originalPrice: 899, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300' }
  ]);

  // Mocked notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: '📦 Order Out For Delivery', body: 'Your Flado Express order #AM-98274 is out with courier Ramesh K.', time: '2 hours ago', read: false },
    { id: 2, title: '🔥 Flash Sale Live!', body: 'Monsoon Mega Sale coupon code RAIN30 is active now. Shop styles.', time: '5 hours ago', read: false },
    { id: 3, title: '🪙 Daily Check-in Bonus', body: 'Checked in today! Successfully claimed +40 AuraCoins.', time: '1 day ago', read: true },
    { id: 4, title: '💳 Top-up Confirmation', body: 'Added ₹500 to AuraPay Wallet successfully via HDFC Card.', time: '2 days ago', read: true }
  ]);

  // Return request states
  const [returnOrderId, setReturnOrderId] = useState('AM-87361');
  const [returnReason, setReturnReason] = useState('Item damaged');
  const [returnDesc, setReturnDesc] = useState('');
  const [returnHistory, setReturnHistory] = useState([
    { id: 'RET-736', date: 'June 10, 2026', orderId: 'AM-76291', status: 'Refund Completed', amount: 2499, item: 'Modern Loop Brass Table Lamp' }
  ]);

  // FAQ support list
  const faqs = [
    { q: 'How long does Flado delivery take?', a: 'Flado is our instant quick commerce service. It delivers fresh groceries and essentials under 10 minutes directly from our nearest micro-warehouse darkstore.' },
    { q: 'What are AuraCoins?', a: 'AuraCoins are our loyalty currency. 10 AuraCoins = ₹1 Wallet cash. They are automatically applied at checkout for up to 20% discount on order totals.' },
    { q: 'How do I request returns?', a: 'Go to the Returns & Refunds tab, select your order and item, fill the reason, and request pickup. Returns are picked up free within 24 hours.' },
    { q: 'Can I add money to AuraPay Wallet?', a: 'Yes! Navigate to the AuraPay Wallet tab, click Top Up, select your amount and pay securely using any UPI, debit or credit cards.' }
  ];
  const [faqSearch, setFaqSearch] = useState('');

  // AuraCoins Gamification Context Hooks
  const { 
    coins, 
    streak, 
    lastCheckIn, 
    missions, 
    badges, 
    leaderboard, 
    claimDailyCheckIn, 
    completeMission 
  } = useAuraCoins();

  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  const handleClaimCheckIn = () => {
    const res = claimDailyCheckIn();
    setClaimStatus(res.msg);
    setTimeout(() => setClaimStatus(null), 4000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('AURA-ARIF2025');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText || !newAddrCity || !newAddrPin) return;

    setAddresses([...addresses, {
      id: Date.now(),
      type: newAddrType,
      address: newAddrText,
      city: newAddrCity,
      pincode: newAddrPin
    }]);
    setNewAddrText('');
    setNewAddrCity('');
    setNewAddrPin('');
    setShowAddrForm(false);
  };

  const handleRemoveAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!isNaN(amt) && amt > 0) {
      setWalletBalance(prev => prev + amt);
      setTopUpAmount('');
      setShowTopUpModal(false);
    }
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRet = {
      id: `RET-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      orderId: returnOrderId,
      status: 'Pickup Requested',
      amount: returnOrderId === 'AM-87361' ? 8999 : 548,
      item: returnOrderId === 'AM-87361' ? 'AuraPods Pro ANC Earbuds' : 'Organic Whole Wheat Atta 5kg'
    };
    setReturnHistory([newRet, ...returnHistory]);
    setReturnDesc('');
    alert('🎉 Return request submitted successfully! Pickup will be scheduled.');
  };

  return (
    <div className={styles.profileContainer}>
      <div className="container">
        <div className={styles.profileGrid}>
          
          {/* Left Column: Summary and Vertical Navigation Sidebar */}
          <div className={styles.summaryColumn}>
            <div className={styles.profileCard}>
              <div className={styles.avatarCircle}>
                <span>{user.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <h2 className={styles.userName}>{user.name}</h2>
              <span className={styles.tierBadge}>{user.loyaltyTier}</span>
              <p className={styles.joinedText}>{user.joinedDate}</p>

              <div className={styles.loyaltyMeterBlock}>
                <div className={styles.meterText}>
                  <span>Progress to VIP Tier</span>
                  <strong>85%</strong>
                </div>
                <div className={styles.meterBarOutline}>
                  <div className={styles.meterBarFill} style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* Vertical Menu Navigation list (Flipkart/Amazon style) */}
            <div className={styles.verticalMenu}>
              <button onClick={() => setActiveTab('loyalty')} className={`${styles.menuItem} ${activeTab === 'loyalty' ? styles.menuActive : ''}`}>
                <FiAward /> AuraCoin Rewards
              </button>
              <Link href="/orders" className={`${styles.menuItem} ${activeTab === 'orders' ? styles.menuActive : ''}`}>
                <FiShoppingBag /> Order History
              </Link>
              <button onClick={() => setActiveTab('wishlist')} className={`${styles.menuItem} ${activeTab === 'wishlist' ? styles.menuActive : ''}`}>
                <FiHeart /> My Wishlist
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`${styles.menuItem} ${activeTab === 'notifications' ? styles.menuActive : ''}`}>
                <FiBell /> Notifications {notifications.some(n => !n.read) && <span className={styles.menuBadge} />}
              </button>
              <Link href="/account/addresses" className={`${styles.menuItem} ${activeTab === 'addresses' ? styles.menuActive : ''}`}>
                <FiMapPin /> Saved Addresses
              </Link>
              <Link href="/account/wallet" className={`${styles.menuItem} ${activeTab === 'wallet' ? styles.menuActive : ''}`}>
                <FiCreditCard /> AuraPay Wallet
              </Link>
              <button onClick={() => setActiveTab('returns')} className={`${styles.menuItem} ${activeTab === 'returns' ? styles.menuActive : ''}`}>
                <FiRotateCcw /> Returns & Refunds
              </button>
              <button onClick={() => setActiveTab('refer')} className={`${styles.menuItem} ${activeTab === 'refer' ? styles.menuActive : ''}`}>
                <FiShare2 /> Refer & Earn
              </button>
              <button onClick={() => setActiveTab('settings')} className={`${styles.menuItem} ${activeTab === 'settings' ? styles.menuActive : ''}`}>
                <FiSettings /> Account Settings
              </button>
              <button onClick={() => setActiveTab('help')} className={`${styles.menuItem} ${activeTab === 'help' ? styles.menuActive : ''}`}>
                <FiHelpCircle /> Help & Support
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Content Tab Card */}
          <div className={styles.detailsColumn}>
            <div className={styles.tabContentCard}>
              
              {/* 1. AuraCoins Rewards Tab */}
              {activeTab === 'loyalty' && (
                <div className={styles.loyaltyTab}>
                  <div className={styles.coinsSummaryCard}>
                    <div className={styles.coinBalanceSec}>
                      <span className={styles.coinsTitle}>AuraCoins Balance</span>
                      <div className={styles.coinAmountRow}>
                        <span className={styles.coinGoldIcon}>🪙</span>
                        <h2>{coins}</h2>
                        <span className={styles.rupeeValue}>≈ ₹{(coins * 0.1).toFixed(2)} Wallet Cash</span>
                      </div>
                      <p className={styles.coinHintText}>Coins apply dynamically at checkout for up to 20% discount on order baskets.</p>
                    </div>
                  </div>

                  {claimStatus && (
                    <div className={styles.claimAlert}>
                      <FiCheckCircle /> <span>{claimStatus}</span>
                    </div>
                  )}

                  <div className={styles.cardSegment}>
                    <h4 className={styles.segmentTitle}><FiCalendar /> Daily Check-In streak</h4>
                    <div className={styles.streakGrid}>
                      {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                        const isClaimed = dayNum < streak || (dayNum === streak && lastCheckIn === new Date().toDateString());
                        return (
                          <div key={dayNum} className={`${styles.streakDayBox} ${isClaimed ? styles.streakClaimed : ''}`}>
                            <span>Day {dayNum}</span>
                            <strong>+{dayNum * 10}</strong>
                            <span>{isClaimed ? '🔥' : '🪙'}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={handleClaimCheckIn} className={styles.claimCheckInBtn} disabled={lastCheckIn === new Date().toDateString()}>
                      {lastCheckIn === new Date().toDateString() ? 'Already Checked In Today!' : 'Check In & Claim Coins'}
                    </button>
                  </div>

                  <div className={styles.cardSegment}>
                    <h4 className={styles.segmentTitle}><FiTarget /> Missions Board</h4>
                    <div className={styles.missionsList}>
                      {missions.map((m) => (
                        <div key={m.id} className={`${styles.missionItem} ${m.completed ? styles.missionCompleted : ''}`}>
                          <div className={styles.missionText}>
                            <h5>{m.title}</h5>
                            <p>{m.description}</p>
                          </div>
                          {m.completed ? (
                            <span className={styles.completedLabel}>Completed ✓</span>
                          ) : (
                            <button onClick={() => completeMission(m.id)} className={styles.claimMissionBtn}>
                              +{m.rewardCoins} 🪙
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Order History Tab */}
              {activeTab === 'orders' && (
                <div className={styles.ordersTab}>
                  <h3 className={styles.tabTitle}>Your Shopping History</h3>
                  <div className={styles.ordersList}>
                    {[
                      { id: 'AM-98274', date: 'June 29, 2026', status: 'Out for Delivery', type: 'flado', items: 'Organic Whole Wheat Atta 5kg, Hass Avocados (2 Pcs)', total: 548 },
                      { id: 'AM-87361', date: 'June 25, 2026', status: 'Delivered', type: 'standard', items: 'AuraPods Pro ANC Earbuds', total: 8999 },
                      { id: 'AM-76291', date: 'June 18, 2026', status: 'Delivered', type: 'standard', items: 'Modern Loop Brass Table Lamp', total: 2499 }
                    ].map(ord => (
                      <div key={ord.id} className={styles.orderItem}>
                        <div className={styles.orderMain}>
                          <span className={styles.orderId}>Order #{ord.id}</span>
                          <span className={ord.type === 'flado' ? styles.fladoLabel : styles.standardLabel}>
                            {ord.type === 'flado' ? '⚡ Flado 10-Min' : '🚚 Standard'}
                          </span>
                        </div>
                        <p className={styles.itemNames}>{ord.items}</p>
                        <div className={styles.orderBottom}>
                          <span>Paid: <strong>₹{ord.total.toLocaleString('en-IN')}</strong></span>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span className={ord.status === 'Delivered' ? styles.statusSuccess : styles.statusAlert}>{ord.status}</span>
                            <Link href={`/tracking/${ord.id}`} className={styles.trackLink}>
                              Track Status <FiChevronRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className={styles.wishlistTab}>
                  <h3 className={styles.tabTitle}>💛 Saved items in Wishlist</h3>
                  {wishlistItems.length > 0 ? (
                    <div className={styles.wishlistGrid}>
                      {wishlistItems.map(item => (
                        <div key={item.id} className={styles.wishlistCard}>
                          <img src={item.image} alt={item.name} />
                          <div className={styles.wishlistInfo}>
                            <h4>{item.name}</h4>
                            <strong>₹{item.price}</strong>
                          </div>
                          <div className={styles.wishlistActions}>
                            <button onClick={() => handleRemoveWishlist(item.id)} className={styles.removeWishBtn}>
                              <FiTrash2 /> Remove
                            </button>
                            <Link href={`/products/${item.id}`} className={styles.viewProductLink}>
                              View Item
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <FiHeart size={32} />
                      <p>Your wishlist is empty. Browse items to add!</p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className={styles.notificationsTab}>
                  <div className={styles.tabTitleRow}>
                    <h3 className={styles.tabTitle}>🔔 Notifications</h3>
                    <button onClick={handleMarkAllRead} className={styles.markReadBtn}>Mark All Read</button>
                  </div>
                  <div className={styles.notificationsList}>
                    {notifications.map(notif => (
                      <div key={notif.id} className={`${styles.notifItem} ${!notif.read ? styles.unreadNotif : ''}`}>
                        <div className={styles.notifHeader}>
                          <h4>{notif.title}</h4>
                          <span>{notif.time}</span>
                        </div>
                        <p>{notif.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Saved Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className={styles.addressesTab}>
                  <div className={styles.tabTitleRow}>
                    <h3 className={styles.tabTitle}>Manage Addresses</h3>
                    <button onClick={() => setShowAddrForm(!showAddrForm)} className={styles.addAddrToggleBtn}>
                      <FiPlus /> Add New
                    </button>
                  </div>

                  {showAddrForm && (
                    <form onSubmit={handleAddAddress} className={styles.addressForm}>
                      <div className={styles.formGroup}>
                        <label>Address Type</label>
                        <select value={newAddrType} onChange={(e) => setNewAddrType(e.target.value)} className={styles.formInput}>
                          <option value="Home Address">Home Address</option>
                          <option value="Office Address">Office Address</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Pincode</label>
                        <input type="text" required placeholder="6-digit PIN code" value={newAddrPin} onChange={(e) => setNewAddrPin(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Street Address</label>
                        <input type="text" required placeholder="Flat no., area, building name" value={newAddrText} onChange={(e) => setNewAddrText(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>City</label>
                        <input type="text" required placeholder="City name" value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} className={styles.formInput} />
                      </div>
                      <div className={styles.formActionRow}>
                        <button type="submit" className={styles.saveAddrBtn}>Save Address</button>
                        <button type="button" onClick={() => setShowAddrForm(false)} className={styles.cancelAddrBtn}>Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className={styles.addressList}>
                    {addresses.map(addr => (
                      <div key={addr.id} className={styles.addressCard}>
                        <div className={styles.addressHeader}>
                          <h4>{addr.type}</h4>
                          <button onClick={() => handleRemoveAddress(addr.id)} className={styles.deleteAddrBtn}><FiTrash2 /></button>
                        </div>
                        <p>{addr.address}</p>
                        <span>{addr.city} - {addr.pincode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. AuraPay Wallet Tab */}
              {activeTab === 'wallet' && (
                <div className={styles.walletTab}>
                  <div className={styles.walletHeaderCard}>
                    <span>Available AuraPay Balance</span>
                    <h2>₹{walletBalance.toLocaleString('en-IN')}</h2>
                    <button onClick={() => setShowTopUpModal(true)} className={styles.topUpBtn}>
                      <FiPlus /> Top Up Balance
                    </button>
                  </div>
                  
                  <h4 className={styles.walletSubtitle}>Saved Payment Modes</h4>
                  <div className={styles.savedCardsList}>
                    <div className={styles.cardItem}>
                      <FiCreditCard className={styles.cardIcon} />
                      <span>HDFC Credit Card ending in 4522</span>
                    </div>
                    <div className={styles.cardItem}>
                      <FiCreditCard className={styles.cardIcon} />
                      <span>ICICI Debit Card ending in 8901</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Returns & Refunds Tab */}
              {activeTab === 'returns' && (
                <div className={styles.returnsTab}>
                  <h3 className={styles.tabTitle}>🔁 Return & Refund Tracker</h3>
                  
                  <form onSubmit={handleReturnSubmit} className={styles.returnForm}>
                    <h4>File a Return Request</h4>
                    <div className={styles.formGroup}>
                      <label>Select Order ID</label>
                      <select value={returnOrderId} onChange={(e) => setReturnOrderId(e.target.value)} className={styles.formInput}>
                        <option value="AM-87361">Order #AM-87361 (AuraPods Pro ANC Earbuds)</option>
                        <option value="AM-98274">Order #AM-98274 (Organic Wheat Atta)</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Reason for Return</label>
                      <select value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className={styles.formInput}>
                        <option value="Item damaged">Item damaged / defective</option>
                        <option value="Wrong size">Wrong size / color delivered</option>
                        <option value="Quality poor">Product quality poor / expired</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Elaborate reason details</label>
                      <textarea value={returnDesc} onChange={(e) => setReturnDesc(e.target.value)} placeholder="Provide description..." className={styles.formTextarea} />
                    </div>
                    <button type="submit" className={styles.submitReturnBtn}>Submit Return Request</button>
                  </form>

                  <h4 className={styles.walletSubtitle}>Return History</h4>
                  <div className={styles.returnHistoryList}>
                    {returnHistory.map(ret => (
                      <div key={ret.id} className={styles.returnHistoryCard}>
                        <div className={styles.returnCardHeader}>
                          <strong>Return ID: {ret.id}</strong>
                          <span className={styles.returnStatusBadge}>{ret.status}</span>
                        </div>
                        <p>Item: {ret.item}</p>
                        <div className={styles.returnCardHeader}>
                          <span>Date filed: {ret.date}</span>
                          <span>Refund amount: <strong>₹{ret.amount}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Refer & Earn Tab */}
              {activeTab === 'refer' && (
                <div className={styles.referTab}>
                  <h3 className={styles.tabTitle}>👥 Refer Friends & Earn</h3>
                  <div className={styles.referHero}>
                    <span className={styles.referEmoji}>🎁</span>
                    <h4>Earn ₹200 for every friend who signs up!</h4>
                    <p>They get ₹50 free wallet balance instantly, and you get ₹200 when they place their first purchase.</p>
                  </div>
                  <div className={styles.referralCodeCard}>
                    <span>Your Unique Referral Code:</span>
                    <div className={styles.codeRow}>
                      <h2>AURA-ARIF2025</h2>
                      <button onClick={handleCopyReferral} className={styles.copyReferralBtn}>
                        {copiedCode ? <FiCheck /> : <FiCopy />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Settings Tab */}
              {activeTab === 'settings' && (
                <div className={styles.settingsTab}>
                  <h3 className={styles.tabTitle}>⚙️ Account Settings</h3>
                  <div className={styles.settingsGroup}>
                    <h4>Notification Preferences</h4>
                    <label className={styles.toggleRow}>
                      <span>Receive Email Announcements</span>
                      <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
                    </label>
                    <label className={styles.toggleRow}>
                      <span>Receive Push Notifications</span>
                      <input type="checkbox" checked={pushAlerts} onChange={(e) => setPushAlerts(e.target.checked)} />
                    </label>
                    <label className={styles.toggleRow}>
                      <span>Receive SMS Updates</span>
                      <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
                    </label>
                  </div>
                  <div className={styles.settingsGroup} style={{ borderBottom: 'none' }}>
                    <h4>Application Settings</h4>
                    <label className={styles.toggleRow}>
                      <span>AuraMart Premium Dark Mode</span>
                      <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                    </label>
                  </div>
                </div>
              )}

              {/* 10. Help & Support Tab */}
              {activeTab === 'help' && (
                <div className={styles.helpTab}>
                  <h3 className={styles.tabTitle}>🆘 Help & Support</h3>
                  
                  <div className={styles.faqSearchBox}>
                    <input type="text" placeholder="Search FAQs..." value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} className={styles.formInput} />
                  </div>

                  <div className={styles.faqList}>
                    {faqs.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase())).map((faq, i) => (
                      <div key={i} className={styles.faqItem}>
                        <h5>{faq.q}</h5>
                        <p>{faq.a}</p>
                      </div>
                    ))}
                  </div>

                  <div className={styles.contactDetailsSec}>
                    <h4>Still need assistance?</h4>
                    <p>📞 Call us: <strong>1800-AURA-HELP</strong> (Toll Free)</p>
                    <p>✉️ Email: <strong>support@auramart.in</strong></p>
                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>

      {/* Wallet Top Up Modal */}
      {showTopUpModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTopUpModal(false)}>
          <form onSubmit={handleTopUpSubmit} className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Top Up AuraPay Balance</h3>
            <p className={styles.modalSubtitle}>Funds added to AuraPay can be used across AuraMart and Flado storefronts instantly.</p>
            
            <div className={styles.amountInputWrapper}>
              <span className={styles.rupeeSym}>₹</span>
              <input 
                type="number" 
                required 
                placeholder="Enter amount (₹)" 
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className={styles.amountInput}
                min="10"
                max="50000"
              />
            </div>
            
            <div className={styles.modalActions}>
              <button type="submit" className={styles.modalSubmitBtn}>Proceed & Add Funds</button>
              <button type="button" onClick={() => setShowTopUpModal(false)} className={styles.modalCancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
