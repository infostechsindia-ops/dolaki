'use client';

import React from 'react';
import styles from './ForgotPasswordForm.module.css';

export interface ForgotPasswordFormProps {
  identifierValue?: string;
  onIdentifierChange?: (val: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onBackToLoginClick?: () => void;
  disabled?: boolean;
  errorMessage?: string;
  infoMessage?: string;
}

export default function ForgotPasswordForm({
  identifierValue = '',
  onIdentifierChange,
  onSubmit,
  onBackToLoginClick,
  disabled = false,
  errorMessage,
  infoMessage = 'Enter your email address or phone number and we will send you a verification code to reset your password.',
}: ForgotPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="forgot-password-form">
      {errorMessage && (
        <div className={styles.errorBanner} role="alert" data-testid="forgot-error-banner">
          {errorMessage}
        </div>
      )}

      {infoMessage && (
        <p className={styles.infoText}>{infoMessage}</p>
      )}

      <div className={styles.fieldGroup}>
        <label htmlFor="forgot-identifier-input" className={styles.label}>
          Email or Phone Number
        </label>
        <input
          id="forgot-identifier-input"
          type="text"
          className={styles.input}
          placeholder="e.g. alex@example.com or +919876543210"
          value={identifierValue}
          onChange={(e) => onIdentifierChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="forgot-identifier-input"
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={disabled || !identifierValue.trim()}
        aria-label="Send Verification Code"
        data-testid="send-otp-btn"
      >
        Send Verification Code
      </button>

      {onBackToLoginClick && (
        <p className={styles.switchText}>
          Remember your password?{' '}
          <button
            type="button"
            className={styles.switchBtn}
            onClick={onBackToLoginClick}
            data-testid="back-to-login-btn"
          >
            Back to Sign In
          </button>
        </p>
      )}
    </form>
  );
}
