import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthPage from '../src/components/auth/AuthPage';
import AuthHeader from '../src/components/auth/AuthHeader';
import AuthSidePanel from '../src/components/auth/AuthSidePanel';
import LoginForm from '../src/components/auth/LoginForm';
import RegisterForm from '../src/components/auth/RegisterForm';
import ForgotPasswordForm from '../src/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../src/components/auth/ResetPasswordForm';
import OTPVerificationForm from '../src/components/auth/OTPVerificationForm';
import SocialLoginButtons from '../src/components/auth/SocialLoginButtons';

describe('CMD-030 Customer Authentication UI', () => {
  // 1. AuthHeader
  it('renders AuthHeader with single H1 title, brand name, and subtitle', () => {
    render(
      <AuthHeader
        title="Sign In to AuraMart"
        subtitle="Welcome back! Please enter your details."
        brandName="AuraMart"
      />
    );

    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('Sign In to AuraMart');
    expect(screen.getByText('Welcome back! Please enter your details.')).toBeInTheDocument();
  });

  // 2. AuthSidePanel
  it('renders AuthSidePanel with headline, features, and marketing content', () => {
    render(
      <AuthSidePanel
        headline="Shop millions of products"
        features={['Fast shipping', 'Easy returns']}
      />
    );

    expect(screen.getByTestId('auth-side-panel')).toBeInTheDocument();
    expect(screen.getByText('Shop millions of products')).toBeInTheDocument();
    expect(screen.getByText('Fast shipping')).toBeInTheDocument();
    expect(screen.getByText('Easy returns')).toBeInTheDocument();
  });

  // 3. SocialLoginButtons
  it('renders SocialLoginButtons with Google, Apple, Facebook callbacks', () => {
    const onGoogleLogin = jest.fn();
    const onAppleLogin = jest.fn();
    const onFacebookLogin = jest.fn();

    render(
      <SocialLoginButtons
        onGoogleLogin={onGoogleLogin}
        onAppleLogin={onAppleLogin}
        onFacebookLogin={onFacebookLogin}
      />
    );

    expect(screen.getByTestId('social-login-buttons')).toBeInTheDocument();

    const googleBtn = screen.getByTestId('google-login-btn');
    fireEvent.click(googleBtn);
    expect(onGoogleLogin).toHaveBeenCalled();

    const appleBtn = screen.getByTestId('apple-login-btn');
    fireEvent.click(appleBtn);
    expect(onAppleLogin).toHaveBeenCalled();

    const fbBtn = screen.getByTestId('facebook-login-btn');
    fireEvent.click(fbBtn);
    expect(onFacebookLogin).toHaveBeenCalled();
  });

  // 4. LoginForm
  it('renders LoginForm with accessible input labels, password type, and submit callback', () => {
    const onIdentifierChange = jest.fn();
    const onPasswordChange = jest.fn();
    const onSubmit = jest.fn();
    const onForgotPasswordClick = jest.fn();

    render(
      <LoginForm
        identifierValue="user@example.com"
        onIdentifierChange={onIdentifierChange}
        passwordValue="secret123"
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
        onForgotPasswordClick={onForgotPasswordClick}
      />
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Phone Number/i)).toHaveValue('user@example.com');

    const passInput = screen.getByLabelText(/Password/i);
    expect(passInput).toHaveAttribute('type', 'password');
    expect(passInput).toHaveValue('secret123');

    const forgotLink = screen.getByTestId('forgot-password-link');
    fireEvent.click(forgotLink);
    expect(onForgotPasswordClick).toHaveBeenCalled();

    const submitBtn = screen.getByTestId('login-submit-btn');
    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  // 5. RegisterForm
  it('renders RegisterForm with all fields, password inputs, terms checkbox, and submit callback', () => {
    const onFullNameChange = jest.fn();
    const onTermsChange = jest.fn();
    const onSubmit = jest.fn();

    render(
      <RegisterForm
        fullNameValue="Jane Doe"
        onFullNameChange={onFullNameChange}
        emailValue="jane@example.com"
        phoneValue="+919876543210"
        passwordValue="secret123"
        confirmPasswordValue="secret123"
        termsAccepted={true}
        onTermsChange={onTermsChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('Jane Doe');

    const passInput = screen.getByLabelText(/^Password$/i);
    expect(passInput).toHaveAttribute('type', 'password');

    const confirmInput = screen.getByLabelText(/Confirm Password/i);
    expect(confirmInput).toHaveAttribute('type', 'password');

    const termsCheckbox = screen.getByTestId('register-terms-checkbox');
    expect(termsCheckbox).toBeChecked();

    const submitBtn = screen.getByTestId('register-submit-btn');
    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  // 6. ForgotPasswordForm
  it('renders ForgotPasswordForm with identifier input and send OTP button', () => {
    const onIdentifierChange = jest.fn();
    const onSubmit = jest.fn();

    render(
      <ForgotPasswordForm
        identifierValue="user@example.com"
        onIdentifierChange={onIdentifierChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Phone Number/i)).toHaveValue('user@example.com');

    const sendBtn = screen.getByTestId('send-otp-btn');
    fireEvent.click(sendBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  // 7. ResetPasswordForm
  it('renders ResetPasswordForm with new password and confirm password inputs', () => {
    const onSubmit = jest.fn();

    render(
      <ResetPasswordForm
        newPasswordValue="newsecret123"
        confirmPasswordValue="newsecret123"
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByTestId('reset-password-form')).toBeInTheDocument();
    const newPass = screen.getByLabelText(/^New Password$/i);
    expect(newPass).toHaveAttribute('type', 'password');
    expect(newPass).toHaveValue('newsecret123');

    const submitBtn = screen.getByTestId('reset-password-submit-btn');
    fireEvent.click(submitBtn);
    expect(onSubmit).toHaveBeenCalled();
  });

  // 8. OTPVerificationForm
  it('renders OTPVerificationForm displaying OTP input, resend button, and countdown text from props', () => {
    const onOTPChange = jest.fn();
    const onResendOTP = jest.fn();

    render(
      <OTPVerificationForm
        otpValue="123456"
        onOTPChange={onOTPChange}
        countdownText="Resend code in 45s"
        onResendOTP={onResendOTP}
      />
    );

    expect(screen.getByTestId('otp-verification-form')).toBeInTheDocument();
    expect(screen.getByTestId('otp-input')).toHaveValue('123456');
    expect(screen.getByTestId('otp-countdown-text')).toHaveTextContent('Resend code in 45s');
  });

  // 9. Full AuthPage composition
  it('composes full AuthPage with side panel, header with single H1, and login form', () => {
    render(
      <AuthPage
        mode="login"
        loginForm={{
          identifierValue: 'user@example.com',
          passwordValue: 'secret',
        }}
      />
    );

    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    expect(screen.getByTestId('auth-side-panel')).toBeInTheDocument();
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('Sign In to Your Account');
  });

  // 10. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <AuthPage
        mode="login"
        loginForm={{
          identifierValue: 'user@example.com',
          passwordValue: 'secret',
        }}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('auth'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
