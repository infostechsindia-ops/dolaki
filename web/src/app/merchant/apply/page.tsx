'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiSend, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function MerchantApplyPage() {
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('groceries');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName && city && phone) {
      setSubmitted(true);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '100px', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 16px',
          backgroundColor: '#ECFDF5',
          color: '#059669',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.85rem',
          marginBottom: '12px'
        }}>
          <FiZap /> Flado Darkstore Partner Program
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
          Become a Flado Merchant Partner
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Supply local demand via 15-minute quick commerce dispatches. Expand your store's reach with zero upfront setup fees.
        </p>
      </div>

      {submitted ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '48px',
          border: '1px solid #A7F3D0',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)',
          textAlign: 'center'
        }}>
          <FiCheckCircle style={{ fontSize: '56px', color: '#10B981', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
            Application Submitted Successfully!
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto 24px auto' }}>
            Thank you for applying to become a Flado Merchant. Our regional darkstore onboard team will review your application for <strong>{storeName}</strong> in <strong>{city}</strong> within 24 business hours.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            Return to AuraMart Home
          </Link>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '40px',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                  Store / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Local Market"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                  City / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, HSR Layout Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '0.95rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="groceries">Groceries & Fresh Produce</option>
                  <option value="dairy">Dairy, Eggs & Bakery</option>
                  <option value="snacks">Snacks & Branded Foods</option>
                  <option value="personal_care">Personal Care & Hygiene</option>
                  <option value="pharmacy">Pharmacy & Wellness Essentials</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                padding: '16px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Submit Merchant Application <FiSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
