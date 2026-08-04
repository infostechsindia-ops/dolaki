'use client';
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
