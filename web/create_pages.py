import os

base_dir = "/Users/arifalnukhbah/antigravity/AuraMart/web/src/app"

files = {
  "auth/login/page.tsx": """'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('aura_token', data.token || 'mock_token');
        localStorage.setItem('aura_user', JSON.stringify(data.user || { email }));
        router.push('/profile');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      // API might not exist, mock success for UI
      localStorage.setItem('aura_token', 'mock_token_123');
      localStorage.setItem('aura_user', JSON.stringify({ email }));
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.branding}>
          <h1><span className={styles.accent}>Aura</span>Mart</h1>
          <p>Premium multi-platform shopping</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h2>Welcome Back</h2>
          <p>Sign in to your AuraMart account</p>
          
          {error && <div className={styles.errorMsg}>{error}</div>}
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.toggleBtn}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>
            
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className={styles.divider}>
            <span>OR</span>
          </div>
          
          <button type="button" className={styles.otpBtn}>
            Continue with Phone OTP
          </button>
          
          <p className={styles.registerPrompt}>
            New to AuraMart? <Link href="/auth/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
""",
  "auth/login/page.module.css": """.container {
  display: flex;
  min-height: calc(100vh - var(--header-height, 80px));
}
.leftPanel {
  flex: 0 0 60%;
  background: var(--gradient-brand);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.branding h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 10px;
}
.accent {
  color: var(--color-star);
}
.rightPanel {
  flex: 0 0 40%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.formWrapper {
  width: 100%;
  max-width: 400px;
}
.formWrapper h2 {
  font-size: 2rem;
  margin-bottom: 8px;
}
.formWrapper p {
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}
.errorMsg {
  color: var(--color-danger);
  font-size: 0.9rem;
  margin-bottom: 16px;
  padding: 10px;
  background: #fef2f2;
  border-radius: 6px;
}
.inputGroup {
  margin-bottom: 16px;
}
.inputGroup label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 6px;
}
.inputGroup input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
}
.passwordWrapper {
  position: relative;
}
.toggleBtn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
}
.formOptions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 0.9rem;
}
.forgotLink {
  color: var(--color-primary);
  font-weight: 500;
}
.submitBtn, .otpBtn {
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
}
.submitBtn {
  background: var(--color-primary);
  color: white;
  border: none;
}
.submitBtn:hover {
  background: var(--color-primary-dark);
}
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-border);
}
.divider span {
  padding: 0 10px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
.otpBtn {
  background: white;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.registerPrompt {
  margin-top: 24px;
  text-align: center;
  font-size: 0.9rem;
}
.registerPrompt a {
  color: var(--color-primary);
  font-weight: 600;
}
""",
  "auth/register/page.tsx": """'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('aura_token', data.token || 'mock_token');
        localStorage.setItem('aura_user', JSON.stringify(data.user || { email: formData.email, name: formData.fullName }));
        router.push('/');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      // Mock success if API is down
      localStorage.setItem('aura_token', 'mock_token_123');
      localStorage.setItem('aura_user', JSON.stringify({ email: formData.email, name: formData.fullName }));
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.branding}>
          <h1><span className={styles.accent}>Aura</span>Mart</h1>
          <p>Join the premium shopping experience</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
          
          {error && <div className={styles.errorMsg}>{error}</div>}
          
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Phone</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
            </div>
            
            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" required /> I agree to Terms & Conditions
              </label>
            </div>
            
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          
          <p className={styles.registerPrompt}>
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
""",
  "orders/page.tsx": """'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:3000/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          mockOrders();
        }
      } catch (err) {
        mockOrders();
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [router]);

  const mockOrders = () => {
    setOrders([
      { id: '1001', date: '2026-07-15', itemsSummary: 'AuraPods Pro...', total: 8999, status: 'DELIVERED' },
      { id: '1002', date: '2026-07-18', itemsSummary: 'Organic Atta, Milk...', total: 548, status: 'SHIPPED' },
      { id: '1003', date: '2026-07-19', itemsSummary: 'Sneakers...', total: 2999, status: 'CANCELLED' }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED': return '#3B82F6';
      case 'PREPARING': return '#F97316';
      case 'SHIPPED': return '#A855F7';
      case 'OUT_FOR_DELIVERY': return '#F59E0B';
      case 'DELIVERED': return '#10B981';
      case 'CANCELLED': return '#EF4444';
      case 'RETURNED': return '#9CA3AF';
      default: return '#000';
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['PLACED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status);
    if (filter === 'Delivered') return o.status === 'DELIVERED';
    if (filter === 'Cancelled') return o.status === 'CANCELLED';
    return true;
  });

  return (
    <div className={`container ${styles.container}`}>
      <h1>Your Orders</h1>
      
      <div className={styles.tabs}>
        {['All', 'Active', 'Delivered', 'Cancelled'].map(f => (
          <button key={f} className={`${styles.tab} ${filter === f ? styles.activeTab : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : filteredOrders.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.itemsSummary}</td>
                  <td>₹{order.total}</td>
                  <td>
                    <span className={styles.badge} style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link href={`/orders/${order.id}`} className={styles.viewBtn}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>📦</div>
          <h3>No orders found</h3>
          <p>Looks like you haven't placed any orders in this category.</p>
          <Link href="/" className={styles.shopBtn}>Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
""",
  "orders/page.module.css": """.container {
  padding: 40px 24px;
}
.container h1 {
  margin-bottom: 24px;
}
.tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}
.tab {
  padding: 8px 16px;
  background: none;
  border: none;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
}
.activeTab {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
  margin-bottom: -9px;
}
.tableWrapper {
  overflow-x: auto;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}
.table th {
  background: var(--color-bg-alt);
  font-weight: 600;
  color: var(--color-text-secondary);
}
.badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}
.viewBtn {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: underline;
}
.emptyState {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}
.emptyIllustration {
  font-size: 4rem;
  margin-bottom: 16px;
}
.emptyState h3 {
  margin-bottom: 8px;
}
.emptyState p {
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}
.shopBtn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
}
.loading {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
}
""",
  "orders/[id]/page.tsx": """'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReturn, setShowReturn] = useState(false);
  const [returnReason, setReturnReason] = useState('Damaged');
  const [returnDesc, setReturnDesc] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3000/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          mockOrder();
        }
      } catch (e) {
        mockOrder();
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.id, router]);

  const mockOrder = () => {
    setOrder({
      id: params.id,
      date: '2026-07-15',
      status: 'DELIVERED',
      items: [
        { name: 'AuraPods Pro ANC Earbuds', qty: 1, unitPrice: 8999, subtotal: 8999 }
      ],
      subtotal: 8999,
      delivery: 50,
      discount: 200,
      total: 8849,
      shippingAddress: 'Apt 402, Sea Green Apartments, Carter Road, Bandra West, Mumbai, 400050'
    });
  };

  const handleReturn = async () => {
    try {
      await fetch(`http://localhost:3000/orders/${params.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason, description: returnDesc })
      });
      alert('Return requested successfully!');
      setShowReturn(false);
    } catch(e) {
      alert('Failed to request return. Try again later.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!order) return <div className={styles.loading}>Order not found.</div>;

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt; <Link href="/orders">Orders</Link> &gt; Order #{order.id}
      </div>
      
      <div className={styles.header}>
        <div>
          <h1>Order #{order.id}</h1>
          <p>Placed on {order.date}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.invoiceBtn} onClick={() => alert('Invoice download coming soon')}>
            Download Invoice
          </button>
        </div>
      </div>

      <div className={styles.timeline}>
        {['PLACED', 'PREPARING', 'SHIPPED', 'DELIVERED'].map((step, idx) => (
          <div key={step} className={`${styles.step} ${order.status === step || order.status === 'DELIVERED' ? styles.stepActive : ''}`}>
            <div className={styles.stepCircle}>{idx + 1}</div>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.card}>
            <h3>Items</h3>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.unitPrice}</td>
                    <td>₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {order.status === 'DELIVERED' && (
            <div className={styles.card}>
              <div className={styles.returnHeader}>
                <h3>Need to return an item?</h3>
                <button onClick={() => setShowReturn(!showReturn)} className={styles.returnBtn}>Request Return</button>
              </div>
              
              {showReturn && (
                <div className={styles.returnForm}>
                  <select value={returnReason} onChange={e => setReturnReason(e.target.value)} className={styles.input}>
                    <option value="Damaged">Damaged</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Not as Described">Not as Described</option>
                    <option value="Changed Mind">Changed Mind</option>
                  </select>
                  <textarea value={returnDesc} onChange={e => setReturnDesc(e.target.value)} placeholder="Description" className={styles.input} rows={3}></textarea>
                  <button onClick={handleReturn} className={styles.submitReturnBtn}>Submit</button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>₹{order.delivery}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Discount</span>
              <span className={styles.discount}>-₹{order.discount}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
          
          <div className={styles.card}>
            <h3>Shipping Address</h3>
            <p className={styles.addressText}>{order.shippingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
""",
  "orders/[id]/page.module.css": """.container {
  padding: 40px 24px;
}
.breadcrumb {
  margin-bottom: 24px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}
.breadcrumb a {
  color: var(--color-primary);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.header h1 {
  margin-bottom: 4px;
}
.header p {
  color: var(--color-text-secondary);
}
.invoiceBtn {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: white;
  font-weight: 500;
  cursor: pointer;
}
.timeline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text-muted);
  flex: 1;
  position: relative;
}
.step::after {
  content: '';
  position: absolute;
  top: 15px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: var(--color-border);
  z-index: 1;
}
.step:last-child::after {
  display: none;
}
.stepCircle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  z-index: 2;
  font-weight: bold;
}
.stepActive {
  color: var(--color-primary);
}
.stepActive .stepCircle {
  background: var(--color-primary);
  color: white;
}
.grid {
  display: flex;
  gap: 24px;
}
.mainCol {
  flex: 2;
}
.sideCol {
  flex: 1;
}
.card {
  background: white;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  margin-bottom: 24px;
}
.card h3 {
  margin-bottom: 16px;
  font-size: 1.2rem;
}
.itemsTable {
  width: 100%;
  border-collapse: collapse;
}
.itemsTable th, .itemsTable td {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}
.summaryRow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.discount {
  color: var(--color-success);
}
.totalRow {
  border-top: 1px solid var(--color-border);
  padding-top: 12px;
  font-weight: bold;
  font-size: 1.2rem;
}
.addressText {
  color: var(--color-text-secondary);
  line-height: 1.6;
}
.returnHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.returnBtn {
  color: var(--color-danger);
  font-weight: 500;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
}
.returnForm {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: inherit;
}
.submitReturnBtn {
  padding: 12px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.loading {
  text-align: center;
  padding: 60px;
}
""",
  "account/addresses/page.tsx": """'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchAddresses();
  }, [router]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('http://localhost:3000/users/addresses');
      if (res.ok) {
        setAddresses(await res.json());
      } else {
        mockAddresses();
      }
    } catch {
      mockAddresses();
    }
  };

  const mockAddresses = () => {
    setAddresses([
      { id: 1, label: 'Home', name: 'Arif Al Nukhbah', phone: '+91 98765 43210', address: 'Apt 402, Sea Green Apartments, Carter Road, Bandra West, Mumbai, Maharashtra, 400050', isDefault: true },
      { id: 2, label: 'Work', name: 'Arif Al Nukhbah', phone: '+91 98765 43210', address: 'Level 12, Maker Chambers VI, Nariman Point, Mumbai, Maharashtra, 400021', isDefault: false }
    ]);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await fetch(`http://localhost:3000/users/addresses/${id}`, { method: 'DELETE' });
      } catch {}
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr = {
      id: Date.now(),
      label: formData.label,
      name: formData.name,
      phone: formData.phone,
      address: `${formData.line1}, ${formData.line2 ? formData.line2 + ', ' : ''}${formData.city}, ${formData.state}, ${formData.pincode}`,
      isDefault: formData.isDefault
    };
    try {
      await fetch('http://localhost:3000/users/addresses', { method: 'POST', body: JSON.stringify(newAddr) });
    } catch {}
    
    if (newAddr.isDefault) {
      setAddresses([newAddr, ...addresses.map(a => ({...a, isDefault: false}))]);
    } else {
      setAddresses([...addresses, newAddr]);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Saved Addresses</h2>
        <button onClick={() => setShowModal(true)} className={styles.addBtn}>+ Add New Address</button>
      </div>

      <div className={styles.grid}>
        {addresses.map(addr => (
          <div key={addr.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.badges}>
                <span className={styles.labelBadge}>{addr.label}</span>
                {addr.isDefault && <span className={styles.defaultBadge}>DEFAULT</span>}
              </div>
              <div className={styles.actions}>
                <button className={styles.iconBtn} aria-label="Edit">✏️</button>
                <button className={styles.iconBtn} onClick={() => handleDelete(addr.id)} aria-label="Delete">🗑️</button>
              </div>
            </div>
            <div className={styles.contactInfo}>
              <strong>{addr.name}</strong> • {addr.phone}
            </div>
            <p className={styles.addressText}>{addr.address}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Add New Address</h3>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.chips}>
                {['Home', 'Work', 'Other'].map(l => (
                  <button type="button" key={l} className={`${styles.chip} ${formData.label === l ? styles.activeChip : ''}`} onClick={() => setFormData({...formData, label: l})}>
                    {l}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={styles.input} />
              <input type="tel" placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={styles.input} />
              <input type="text" placeholder="Line 1" required value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} className={styles.input} />
              <input type="text" placeholder="Line 2 (optional)" value={formData.line2} onChange={e => setFormData({...formData, line2: e.target.value})} className={styles.input} />
              <div className={styles.row}>
                <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={styles.input} />
                <input type="text" placeholder="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className={styles.input} />
                <input type="text" placeholder="Pincode" required value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className={styles.input} />
              </div>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                Set as Default
              </label>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
""",
  "account/addresses/page.module.css": """.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.addBtn {
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.badges {
  display: flex;
  gap: 8px;
}
.labelBadge {
  background: var(--color-bg-alt);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
.defaultBadge {
  background: var(--color-success);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 8px;
}
.iconBtn {
  font-size: 1.2rem;
  opacity: 0.6;
  background: none;
  border: none;
  cursor: pointer;
}
.iconBtn:hover {
  opacity: 1;
}
.contactInfo {
  margin-bottom: 8px;
  color: var(--color-text-secondary);
}
.addressText {
  color: var(--color-text-secondary);
  line-height: 1.5;
}
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modalContent {
  background: white;
  padding: 32px;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
}
.modalContent h3 {
  margin-bottom: 24px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chips {
  display: flex;
  gap: 8px;
}
.chip {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: none;
  cursor: pointer;
}
.activeChip {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.input {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  width: 100%;
}
.row {
  display: flex;
  gap: 12px;
}
.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}
.modalActions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
.cancelBtn, .saveBtn {
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.cancelBtn {
  background: var(--color-bg-alt);
}
.saveBtn {
  background: var(--color-primary);
  color: white;
}
""",
  "account/wallet/page.tsx": """'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function WalletPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    // Mock API
    setData({
      balance: 1250,
      rewardPoints: 850,
      transactions: [
        { id: 1, type: 'earn', desc: 'Order reward (#AM-98274)', date: 'June 29, 2026', points: '+40' },
        { id: 2, type: 'earn', desc: 'Order reward (#AM-87361)', date: 'June 25, 2026', points: '+120' },
        { id: 3, type: 'earn', desc: 'Referral bonus', date: 'June 20, 2026', points: '+200' },
        { id: 4, type: 'earn', desc: 'Order reward (#AM-76291)', date: 'June 18, 2026', points: '+50' },
        { id: 5, type: 'earn', desc: 'First order bonus', date: 'June 10, 2026', points: '+100' },
      ]
    });
  }, [router]);

  if (!data) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>AuraPay & Rewards</h2>
      
      <div className={styles.cardsRow}>
        <div className={styles.balanceCard}>
          <h3>AuraMart Wallet</h3>
          <div className={styles.amount}>₹{data.balance}</div>
          <button className={styles.addMoneyBtn} title="Coming soon" disabled>Add Money</button>
        </div>
        
        <div className={styles.coinsCard}>
          <h3>AuraCoins</h3>
          <div className={styles.amount}>★ {data.rewardPoints}</div>
          <p>≈ ₹{data.rewardPoints / 10} Wallet Cash</p>
          <button className={styles.redeemBtn}>Redeem Info</button>
        </div>
      </div>
      
      <div className={styles.infoCard}>
        <h4>About AuraCoins</h4>
        <div className={styles.infoGrid}>
          <div>
            <strong>How to earn</strong>
            <p>Get 1% of every purchase back as AuraCoins.</p>
          </div>
          <div>
            <strong>How to redeem</strong>
            <p>100 coins = ₹10 off. Apply at checkout for instant discounts.</p>
          </div>
        </div>
      </div>

      <div className={styles.historySection}>
        <h3>Transaction History</h3>
        <div className={styles.txList}>
          {data.transactions.map((tx: any) => (
            <div key={tx.id} className={styles.txRow}>
              <div className={styles.txIcon}>{tx.type === 'earn' ? '★' : '💳'}</div>
              <div className={styles.txDetails}>
                <strong>{tx.desc}</strong>
                <span>{tx.date}</span>
              </div>
              <div className={styles.txPoints}>{tx.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
""",
  "account/wallet/page.module.css": """.container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cardsRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.balanceCard, .coinsCard {
  padding: 32px;
  border-radius: var(--radius-lg);
  color: white;
}
.balanceCard {
  background: var(--gradient-brand);
}
.coinsCard {
  background: var(--gradient-gold);
}
.amount {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 16px 0;
}
.addMoneyBtn, .redeemBtn {
  padding: 10px 24px;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
}
.addMoneyBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.infoCard {
  background: white;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}
.infoCard h4 {
  margin-bottom: 16px;
}
.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.infoGrid p {
  color: var(--color-text-secondary);
  margin-top: 4px;
}
.txList {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
  margin-top: 16px;
}
.txRow {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}
.txRow:last-child {
  border-bottom: none;
}
.txIcon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 16px;
  color: var(--color-text-primary);
}
.txDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.txDetails span {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}
.txPoints {
  font-weight: 700;
  color: var(--color-success);
}
""",
  "flado/orders/page.tsx": """'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function FladoOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('aura_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (user?.phone) {
      // Mock Flado fetch
      setOrders([
        { id: 'FL-9912', shop: 'Flado Darkstore #4', time: '10 mins ago', items: 'Milk, Bread, Eggs', total: 240, status: 'DELIVERED' }
      ]);
    }
  }, [user]);

  if (!user?.phone) {
    return (
      <div className={`container ${styles.container}`}>
        <div className={styles.messageCard}>
          <h2>No Phone Linked</h2>
          <p>Please link a phone number to your profile or use the mobile app to view Flado orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1>Flado Quick Orders</h1>
      <div className={styles.list}>
        {orders.map(order => (
          <div key={order.id} className={styles.card}>
            <div className={styles.header}>
              <h3>{order.shop}</h3>
              <span className={styles.status}>{order.status}</span>
            </div>
            <p className={styles.items}>{order.items}</p>
            <div className={styles.footer}>
              <span>{order.time}</span>
              <span>₹{order.total}</span>
              <Link href={`/tracking/${order.id}`} className={styles.trackBtn}>Track</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
""",
  "flado/orders/page.module.css": """.container {
  padding: 40px 24px;
}
.messageCard {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}
.card {
  background: white;
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.status {
  color: var(--color-flado);
  font-weight: 700;
  font-size: 0.85rem;
}
.items {
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
  font-weight: 500;
}
.trackBtn {
  padding: 8px 16px;
  background: var(--color-flado);
  color: white;
  border-radius: var(--radius-sm);
  font-weight: 600;
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w") as f:
        f.write(content)
print("Files created successfully.")
