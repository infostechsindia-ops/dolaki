'use client';
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
