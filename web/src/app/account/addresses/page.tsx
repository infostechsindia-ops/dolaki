'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

import { API_BASE_URL } from '@/lib/config';

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch(`${API_BASE_URL}/api/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(await res.json());
      } else {
        setError(`Unable to load addresses (Server status: ${res.status}).`);
      }
    } catch {
      setError('Connection error: Unable to load addresses. Please verify if backend is running.');
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        const token = localStorage.getItem('aura_token');
        const res = await fetch(`${API_BASE_URL}/api/users/addresses/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setAddresses(addresses.filter(a => a.id !== id));
        } else {
          setError(`Failed to delete address (Server status: ${res.status}).`);
        }
      } catch {
        setError('Connection error: Failed to delete address.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newAddr = {
      label: formData.label,
      name: formData.name,
      phone: formData.phone,
      address: `${formData.line1}, ${formData.line2 ? formData.line2 + ', ' : ''}${formData.city}, ${formData.state}, ${formData.pincode}`,
      isDefault: formData.isDefault
    };
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch(`${API_BASE_URL}/api/users/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAddr)
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved.isDefault) {
          setAddresses([saved, ...addresses.map(a => ({...a, isDefault: false}))]);
        } else {
          setAddresses([...addresses, saved]);
        }
        setShowModal(false);
      } else {
        setError(`Failed to save address (Server status: ${res.status}).`);
      }
    } catch {
      setError('Connection error: Failed to save address.');
    }
  };

  return (
    <div className={styles.container}>
      {error && <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', borderLeft: '4px solid #EF4444' }}>{error}</div>}
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
