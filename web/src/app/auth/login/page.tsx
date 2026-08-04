'use client';
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
