'use client';

import React from 'react';
import AuthHeader, { AuthHeaderProps } from './AuthHeader';
import AuthSidePanel, { AuthSidePanelProps } from './AuthSidePanel';
import LoginForm, { LoginFormProps } from './LoginForm';
import RegisterForm, { RegisterFormProps } from './RegisterForm';
import ForgotPasswordForm, { ForgotPasswordFormProps } from './ForgotPasswordForm';
import ResetPasswordForm, { ResetPasswordFormProps } from './ResetPasswordForm';
import OTPVerificationForm, { OTPVerificationFormProps } from './OTPVerificationForm';
import styles from './AuthPage.module.css';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'otp';

export interface AuthPageProps {
  mode?: AuthMode;

  /* Header override */
  header?: Partial<AuthHeaderProps>;

  /* Side panel override */
  sidePanel?: AuthSidePanelProps;

  /* Form props per mode */
  loginForm?: LoginFormProps;
  registerForm?: RegisterFormProps;
  forgotPasswordForm?: ForgotPasswordFormProps;
  resetPasswordForm?: ResetPasswordFormProps;
  otpForm?: OTPVerificationFormProps;

  /* Theme surface */
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

const DEFAULT_HEADERS: Record<AuthMode, { title: string; subtitle?: string }> = {
  login: {
    title: 'Sign In to Your Account',
    subtitle: 'Enter your details below to log in.',
  },
  register: {
    title: 'Create Your Account',
    subtitle: 'Sign up to get started with AuraMart.',
  },
  'forgot-password': {
    title: 'Reset Your Password',
    subtitle: 'We will help you recover access to your account.',
  },
  'reset-password': {
    title: 'Set New Password',
    subtitle: 'Choose a strong new password for your account.',
  },
  otp: {
    title: 'Verify Verification Code',
    subtitle: 'Enter the code sent to your email or phone.',
  },
};

export default function AuthPage({
  mode = 'login',
  header,
  sidePanel,
  loginForm,
  registerForm,
  forgotPasswordForm,
  resetPasswordForm,
  otpForm,
  surface = 'MARKETPLACE',
}: AuthPageProps) {
  const defaultHeader = DEFAULT_HEADERS[mode] ?? DEFAULT_HEADERS.login;

  return (
    <div
      className={`${styles.page} ${surface === 'QUICK_COMMERCE' ? styles.flado : ''}`}
      data-testid="auth-page"
    >
      <div className={styles.container}>
        {/* Left Column: Hero Side Panel (Desktop only or top on mobile) */}
        <div className={styles.sideColumn}>
          <AuthSidePanel {...sidePanel} surface={surface} />
        </div>

        {/* Right Column: Form Container */}
        <main className={styles.formColumn}>
          <div className={styles.formCard}>
            {/* Header (with single H1) */}
            <AuthHeader
              title={header?.title ?? defaultHeader.title}
              subtitle={header?.subtitle ?? defaultHeader.subtitle}
              {...header}
            />

            {/* Active Form */}
            <div className={styles.activeFormWrap}>
              {mode === 'login' && <LoginForm {...loginForm} />}
              {mode === 'register' && <RegisterForm {...registerForm} />}
              {mode === 'forgot-password' && <ForgotPasswordForm {...forgotPasswordForm} />}
              {mode === 'reset-password' && <ResetPasswordForm {...resetPasswordForm} />}
              {mode === 'otp' && <OTPVerificationForm {...otpForm} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
