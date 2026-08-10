'use client';

import React from 'react';
import styles from './OTPVerificationForm.module.css';

export interface OTPVerificationFormProps {
  otpValue?: string;
  onOTPChange?: (val: string) => void;
  onVerify?: (e: React.FormEvent) => void;
  onResendOTP?: () => void;
  countdownText?: string;
  isResendDisabled?: boolean;
  recipientText?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export default function OTPVerificationForm({
  otpValue = '',
  onOTPChange,
  onVerify,
  onResendOTP,
  countdownText,
  isResendDisabled = false,
  recipientText,
  disabled = false,
  errorMessage,
}: OTPVerificationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify?.(e);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="otp-verification-form">
      {errorMessage && (
        <div className={styles.errorBanner} role="alert" data-testid="otp-error-banner">
          {errorMessage}
        </div>
      )}

      {recipientText && (
        <p className={styles.infoText}>
          We sent a verification code to <strong>{recipientText}</strong>
        </p>
      )}

      <div className={styles.fieldGroup}>
        <label htmlFor="otp-verification-input" className={styles.label}>
          Enter 6-digit Code
        </label>
        <input
          id="otp-verification-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          className={styles.otpInput}
          placeholder="123456"
          value={otpValue}
          onChange={(e) => onOTPChange?.(e.target.value)}
          disabled={disabled}
          required
          data-testid="otp-input"
        />
      </div>

      {/* Countdown and Resend */}
      <div className={styles.resendRow}>
        {countdownText ? (
          <span className={styles.countdownText} data-testid="otp-countdown-text">
            {countdownText}
          </span>
        ) : (
          onResendOTP && (
            <button
              type="button"
              className={styles.resendBtn}
              onClick={onResendOTP}
              disabled={disabled || isResendDisabled}
              data-testid="resend-otp-btn"
            >
              Resend Code
            </button>
          )
        )}
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={disabled || otpValue.length < 4}
        aria-label="Verify Code"
        data-testid="verify-otp-submit-btn"
      >
        Verify & Continue
      </button>
    </form>
  );
}
