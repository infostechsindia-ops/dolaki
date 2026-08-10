'use client';

import React from 'react';
import AuthDivider from './AuthDivider';
import SocialLoginButtons from './SocialLoginButtons';
import styles from './LoginForm.module.css';

export interface LoginFormProps {
  identifierValue?: string;
  onIdentifierChange?: (val: string) => void;
  passwordValue?: string;
  onPasswordChange?: (val: string) => void;
  rememberMeValue?: boolean;
  onRememberMeChange?: (val: boolean) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onForgotPasswordClick?: () => void;
  onRegisterClick?: () => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onFacebookLogin?: () => void;
  disabled?: boolean;
  errorMessage?: string;
}

export default function LoginForm({
  identifierValue = '',
  onIdentifierChange,
  passwordValue = '',
  onPasswordChange,
  rememberMeValue = false,
  onRememberMeChange,
  onSubmit,
  onForgotPasswordClick,
  onRegisterClick,
  onGoogleLogin,
  onAppleLogin,
  onFacebookLogin,
  disabled = false,
  errorMessage,
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  const hasSocials = Boolean(onGoogleLogin || onAppleLogin || onFacebookLogin);

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="login-form">
      {errorMessage && (
        <div className={styles.errorBanner} role="alert" data-testid="login-error-banner">
          {errorMessage}
        </div>
      )}

      {/* Identifier field */}
      <div className={styles.fieldGroup}>
        <label htmlFor="login-identifier-input" className={styles.label}>
          Email or Phone Number
        </label>
        <input
          id="login-identifier-input"
          type="text"
          className={styles.input}
          placeholder="e.g. alex@example.com or +919876543210"
          value={identifierValue}
          onChange={(e) => onIdentifierChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="login-identifier-input"
        />
      </div>

      {/* Password field */}
      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <label htmlFor="login-password-input" className={styles.label}>
            Password
          </label>
          {onForgotPasswordClick && (
            <button
              type="button"
              className={styles.forgotBtn}
              onClick={onForgotPasswordClick}
              data-testid="forgot-password-link"
            >
              Forgot password?
            </button>
          )}
        </div>
        <input
          id="login-password-input"
          type="password"
          className={styles.input}
          placeholder="••••••••"
          value={passwordValue}
          onChange={(e) => onPasswordChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="login-password-input"
        />
      </div>

      {/* Remember me checkbox */}
      <div className={styles.rememberRow}>
        <label htmlFor="login-remember-checkbox" className={styles.checkboxLabel}>
          <input
            id="login-remember-checkbox"
            type="checkbox"
            className={styles.checkbox}
            checked={rememberMeValue}
            onChange={(e) => onRememberMeChange?.(e.target.checked)}
            disabled={disabled}
            data-testid="login-remember-checkbox"
          />
          <span>Remember me on this device</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={disabled}
        aria-label="Sign In"
        data-testid="login-submit-btn"
      >
        Sign In
      </button>

      {/* Social Logins */}
      {hasSocials && (
        <>
          <AuthDivider label="or sign in with" />
          <SocialLoginButtons
            onGoogleLogin={onGoogleLogin}
            onAppleLogin={onAppleLogin}
            onFacebookLogin={onFacebookLogin}
            disabled={disabled}
          />
        </>
      )}

      {/* Switch to Register link */}
      {onRegisterClick && (
        <p className={styles.switchText}>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className={styles.switchBtn}
            onClick={onRegisterClick}
            data-testid="switch-to-register-btn"
          >
            Create an account
          </button>
        </p>
      )}
    </form>
  );
}
