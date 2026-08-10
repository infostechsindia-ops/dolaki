'use client';

import React from 'react';
import styles from './ResetPasswordForm.module.css';

export interface ResetPasswordFormProps {
  newPasswordValue?: string;
  onNewPasswordChange?: (val: string) => void;
  confirmPasswordValue?: string;
  onConfirmPasswordChange?: (val: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  disabled?: boolean;
  errorMessage?: string;
}

export default function ResetPasswordForm({
  newPasswordValue = '',
  onNewPasswordChange,
  confirmPasswordValue = '',
  onConfirmPasswordChange,
  onSubmit,
  disabled = false,
  errorMessage,
}: ResetPasswordFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="reset-password-form">
      {errorMessage && (
        <div className={styles.errorBanner} role="alert" data-testid="reset-error-banner">
          {errorMessage}
        </div>
      )}

      <div className={styles.fieldGroup}>
        <label htmlFor="reset-newpassword-input" className={styles.label}>
          New Password
        </label>
        <input
          id="reset-newpassword-input"
          type="password"
          className={styles.input}
          placeholder="Enter new password (min. 8 chars)"
          value={newPasswordValue}
          onChange={(e) => onNewPasswordChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="reset-newpassword-input"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="reset-confirmpassword-input" className={styles.label}>
          Confirm New Password
        </label>
        <input
          id="reset-confirmpassword-input"
          type="password"
          className={styles.input}
          placeholder="Re-enter new password"
          value={confirmPasswordValue}
          onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="reset-confirmpassword-input"
        />
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={disabled || !newPasswordValue.trim() || !confirmPasswordValue.trim()}
        aria-label="Reset Password"
        data-testid="reset-password-submit-btn"
      >
        Reset Password
      </button>
    </form>
  );
}
