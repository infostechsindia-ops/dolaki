'use client';

import React from 'react';
import AuthDivider from './AuthDivider';
import SocialLoginButtons from './SocialLoginButtons';
import styles from './RegisterForm.module.css';

export interface RegisterFormProps {
  fullNameValue?: string;
  onFullNameChange?: (val: string) => void;
  emailValue?: string;
  onEmailChange?: (val: string) => void;
  phoneValue?: string;
  onPhoneChange?: (val: string) => void;
  passwordValue?: string;
  onPasswordChange?: (val: string) => void;
  confirmPasswordValue?: string;
  onConfirmPasswordChange?: (val: string) => void;
  termsAccepted?: boolean;
  onTermsChange?: (val: boolean) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onLoginClick?: () => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onFacebookLogin?: () => void;
  disabled?: boolean;
  errorMessage?: string;
}

export default function RegisterForm({
  fullNameValue = '',
  onFullNameChange,
  emailValue = '',
  onEmailChange,
  phoneValue = '',
  onPhoneChange,
  passwordValue = '',
  onPasswordChange,
  confirmPasswordValue = '',
  onConfirmPasswordChange,
  termsAccepted = false,
  onTermsChange,
  onSubmit,
  onLoginClick,
  onGoogleLogin,
  onAppleLogin,
  onFacebookLogin,
  disabled = false,
  errorMessage,
}: RegisterFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  const hasSocials = Boolean(onGoogleLogin || onAppleLogin || onFacebookLogin);

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="register-form">
      {errorMessage && (
        <div className={styles.errorBanner} role="alert" data-testid="register-error-banner">
          {errorMessage}
        </div>
      )}

      {/* Full Name */}
      <div className={styles.fieldGroup}>
        <label htmlFor="register-fullname-input" className={styles.label}>
          Full Name
        </label>
        <input
          id="register-fullname-input"
          type="text"
          className={styles.input}
          placeholder="e.g. Jane Doe"
          value={fullNameValue}
          onChange={(e) => onFullNameChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="register-fullname-input"
        />
      </div>

      {/* Email */}
      <div className={styles.fieldGroup}>
        <label htmlFor="register-email-input" className={styles.label}>
          Email Address
        </label>
        <input
          id="register-email-input"
          type="email"
          className={styles.input}
          placeholder="e.g. jane@example.com"
          value={emailValue}
          onChange={(e) => onEmailChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="register-email-input"
        />
      </div>

      {/* Phone */}
      <div className={styles.fieldGroup}>
        <label htmlFor="register-phone-input" className={styles.label}>
          Phone Number
        </label>
        <input
          id="register-phone-input"
          type="tel"
          className={styles.input}
          placeholder="e.g. +919876543210"
          value={phoneValue}
          onChange={(e) => onPhoneChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="register-phone-input"
        />
      </div>

      {/* Password */}
      <div className={styles.fieldGroup}>
        <label htmlFor="register-password-input" className={styles.label}>
          Password
        </label>
        <input
          id="register-password-input"
          type="password"
          className={styles.input}
          placeholder="At least 8 characters"
          value={passwordValue}
          onChange={(e) => onPasswordChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="register-password-input"
        />
      </div>

      {/* Confirm Password */}
      <div className={styles.fieldGroup}>
        <label htmlFor="register-confirmpassword-input" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="register-confirmpassword-input"
          type="password"
          className={styles.input}
          placeholder="Re-enter password"
          value={confirmPasswordValue}
          onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="register-confirmpassword-input"
        />
      </div>

      {/* Terms checkbox */}
      <div className={styles.termsRow}>
        <label htmlFor="register-terms-checkbox" className={styles.checkboxLabel}>
          <input
            id="register-terms-checkbox"
            type="checkbox"
            className={styles.checkbox}
            checked={termsAccepted}
            onChange={(e) => onTermsChange?.(e.target.checked)}
            disabled={disabled}
            required
            data-testid="register-terms-checkbox"
          />
          <span>
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>
      </div>

      {/* Register button */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={disabled || !termsAccepted}
        aria-label="Create Account"
        data-testid="register-submit-btn"
      >
        Create Account
      </button>

      {/* Social Logins */}
      {hasSocials && (
        <>
          <AuthDivider label="or sign up with" />
          <SocialLoginButtons
            onGoogleLogin={onGoogleLogin}
            onAppleLogin={onAppleLogin}
            onFacebookLogin={onFacebookLogin}
            disabled={disabled}
          />
        </>
      )}

      {/* Switch to Login */}
      {onLoginClick && (
        <p className={styles.switchText}>
          Already have an account?{' '}
          <button
            type="button"
            className={styles.switchBtn}
            onClick={onLoginClick}
            data-testid="switch-to-login-btn"
          >
            Sign In
          </button>
        </p>
      )}
    </form>
  );
}
