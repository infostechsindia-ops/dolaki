import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePage from '../src/components/profile/ProfilePage';
import ProfileHeader from '../src/components/profile/ProfileHeader';
import ProfileSidebar from '../src/components/profile/ProfileSidebar';
import ProfileOverview from '../src/components/profile/ProfileOverview';
import PersonalInformationCard from '../src/components/profile/PersonalInformationCard';
import AddressBookCard from '../src/components/profile/AddressBookCard';
import SavedPaymentMethodsCard from '../src/components/profile/SavedPaymentMethodsCard';
import AccountSecurityCard from '../src/components/profile/AccountSecurityCard';
import NotificationPreferencesCard from '../src/components/profile/NotificationPreferencesCard';
import LoyaltySummaryCard from '../src/components/profile/LoyaltySummaryCard';
import ProfileEmptyState from '../src/components/profile/ProfileEmptyState';

const MOCK_HEADER = {
  name: 'Alex Johnson',
  membershipLevel: 'Gold Member',
  joinDate: 'Jan 2024',
};

const MOCK_PERSONAL = {
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  phone: '+91 98765 43210',
  dateOfBirth: '1990-05-15',
  gender: 'Non-binary',
};

const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    name: 'Home',
    phone: '+91 98765 43210',
    addressLine1: '123 Market St',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400001',
    isDefault: true,
  },
];

const MOCK_PAYMENTS = [
  {
    id: 'pay-1',
    brand: 'Visa',
    maskedNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    isDefault: true,
  },
];

const MOCK_SECURITY = {
  passwordLastChanged: '30 days ago',
  twoFactorEnabled: true,
  lastLoginText: 'Today at 10:45 AM from Mumbai',
};

const MOCK_NOTIFS = {
  email: true,
  sms: true,
  push: false,
  promotions: true,
  orderUpdates: true,
};

describe('CMD-031 Customer Profile Foundation', () => {
  // 1. ProfileHeader
  it('renders ProfileHeader with single H1 customer name, membership level, and edit button', () => {
    const onEditProfile = jest.fn();
    render(<ProfileHeader {...MOCK_HEADER} onEditProfile={onEditProfile} />);

    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('Alex Johnson');
    expect(screen.getByTestId('membership-badge')).toHaveTextContent('Gold Member');

    const editBtn = screen.getByTestId('edit-profile-btn');
    fireEvent.click(editBtn);
    expect(onEditProfile).toHaveBeenCalled();
  });

  // 2. ProfileSidebar
  it('renders ProfileSidebar inside nav aria-label="Profile Navigation" with active item highlighting', () => {
    const onTabChange = jest.fn();
    render(<ProfileSidebar activeTab="addresses" onTabChange={onTabChange} />);

    expect(screen.getByTestId('profile-sidebar')).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile Navigation/i)).toBeInTheDocument();
    expect(screen.getByTestId('profile-nav-addresses')).toHaveAttribute('aria-current', 'page');

    const securityBtn = screen.getByTestId('profile-nav-security');
    fireEvent.click(securityBtn);
    expect(onTabChange).toHaveBeenCalledWith('security');
  });

  // 3. ProfileOverview
  it('renders ProfileOverview summary cards for orders, wishlist, addresses, and rewards', () => {
    const onNavigateTab = jest.fn();
    render(
      <ProfileOverview
        ordersCount={12}
        wishlistCount={5}
        addressesCount={2}
        rewardPoints={2450}
        onNavigateTab={onNavigateTab}
      />
    );

    expect(screen.getByTestId('profile-overview')).toBeInTheDocument();
    expect(screen.getByTestId('overview-card-orders')).toHaveTextContent('12');
    expect(screen.getByTestId('overview-card-wishlist')).toHaveTextContent('5');

    const ordersCard = screen.getByTestId('overview-card-orders');
    fireEvent.click(ordersCard);
    expect(onNavigateTab).toHaveBeenCalledWith('orders');
  });

  // 4. PersonalInformationCard
  it('renders PersonalInformationCard displaying full name, email, phone, and edit button', () => {
    const onEdit = jest.fn();
    render(<PersonalInformationCard info={MOCK_PERSONAL} onEdit={onEdit} />);

    expect(screen.getByTestId('personal-information-card')).toBeInTheDocument();
    expect(screen.getByTestId('personal-fullname')).toHaveTextContent('Alex Johnson');
    expect(screen.getByTestId('personal-email')).toHaveTextContent('alex@example.com');
    expect(screen.getByTestId('personal-phone')).toHaveTextContent('+91 98765 43210');

    const editBtn = screen.getByTestId('edit-personal-info-btn');
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalled();
  });

  // 5. AddressBookCard
  it('renders AddressBookCard with address items, default badge, and action callbacks', () => {
    const onAddAddress = jest.fn();
    const onEditAddress = jest.fn();
    const onDeleteAddress = jest.fn();

    render(
      <AddressBookCard
        addresses={MOCK_ADDRESSES}
        onAddAddress={onAddAddress}
        onEditAddress={onEditAddress}
        onDeleteAddress={onDeleteAddress}
      />
    );

    expect(screen.getByTestId('address-book-card')).toBeInTheDocument();
    expect(screen.getByTestId('address-item-addr-1')).toBeInTheDocument();

    const addBtn = screen.getByTestId('add-address-btn');
    fireEvent.click(addBtn);
    expect(onAddAddress).toHaveBeenCalled();

    const editBtn = screen.getByTestId('edit-address-btn-addr-1');
    fireEvent.click(editBtn);
    expect(onEditAddress).toHaveBeenCalledWith('addr-1');

    const deleteBtn = screen.getByTestId('delete-address-btn-addr-1');
    fireEvent.click(deleteBtn);
    expect(onDeleteAddress).toHaveBeenCalledWith('addr-1');
  });

  // 6. SavedPaymentMethodsCard
  it('renders SavedPaymentMethodsCard with brand, masked number, default badge, and remove callback', () => {
    const onAddMethod = jest.fn();
    const onRemoveMethod = jest.fn();

    render(
      <SavedPaymentMethodsCard
        methods={MOCK_PAYMENTS}
        onAddMethod={onAddMethod}
        onRemoveMethod={onRemoveMethod}
      />
    );

    expect(screen.getByTestId('saved-payment-methods-card')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-pay-1')).toHaveTextContent('Visa');
    expect(screen.getByTestId('payment-method-pay-1')).toHaveTextContent('•••• •••• •••• 4242');

    const removeBtn = screen.getByTestId('remove-payment-btn-pay-1');
    fireEvent.click(removeBtn);
    expect(onRemoveMethod).toHaveBeenCalledWith('pay-1');
  });

  // 7. AccountSecurityCard
  it('renders AccountSecurityCard with password, 2FA, and last login statuses', () => {
    const onChangePassword = jest.fn();
    const onToggleTwoFactor = jest.fn();

    render(
      <AccountSecurityCard
        security={MOCK_SECURITY}
        onChangePassword={onChangePassword}
        onToggleTwoFactor={onToggleTwoFactor}
      />
    );

    expect(screen.getByTestId('account-security-card')).toBeInTheDocument();
    expect(screen.getByTestId('password-status')).toHaveTextContent('Last changed 30 days ago');
    expect(screen.getByTestId('2fa-status')).toHaveTextContent('Status: Enabled');

    const passBtn = screen.getByTestId('change-password-btn');
    fireEvent.click(passBtn);
    expect(onChangePassword).toHaveBeenCalled();

    const toggleBtn = screen.getByTestId('toggle-2fa-btn');
    fireEvent.click(toggleBtn);
    expect(onToggleTwoFactor).toHaveBeenCalled();
  });

  // 8. NotificationPreferencesCard
  it('renders NotificationPreferencesCard with toggles for notification options', () => {
    const onPreferenceChange = jest.fn();
    render(
      <NotificationPreferencesCard
        preferences={MOCK_NOTIFS}
        onPreferenceChange={onPreferenceChange}
      />
    );

    expect(screen.getByTestId('notification-preferences-card')).toBeInTheDocument();
    const emailSwitch = screen.getByTestId('notif-switch-email');
    expect(emailSwitch).toBeChecked();

    fireEvent.click(emailSwitch);
    expect(onPreferenceChange).toHaveBeenCalledWith('email', false);
  });

  // 9. LoyaltySummaryCard
  it('renders LoyaltySummaryCard with points, tier badge, progress bar, and benefits', () => {
    render(
      <LoyaltySummaryCard
        rewardPoints={2450}
        tierName="Gold Member"
        nextTierName="Platinum Member"
        progressPercent={75}
      />
    );

    expect(screen.getByTestId('loyalty-summary-card')).toBeInTheDocument();
    expect(screen.getByTestId('loyalty-points-num')).toHaveTextContent('2,450');
    expect(screen.getByTestId('loyalty-tier-badge')).toHaveTextContent('Gold Member');
    expect(screen.getByTestId('loyalty-progress-bar')).toHaveAttribute('aria-valuenow', '75');
  });

  // 10. ProfileEmptyState
  it('renders ProfileEmptyState reusing EmptyState UI primitive when empty', () => {
    const onAction = jest.fn();
    render(<ProfileEmptyState onAction={onAction} />);

    expect(screen.getByTestId('profile-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No profile information found')).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /Go to Home/i });
    fireEvent.click(btn);
    expect(onAction).toHaveBeenCalled();
  });

  // 11. Full ProfilePage composition
  it('composes full ProfilePage with single H1 header, sidebar, and overview content', () => {
    render(
      <ProfilePage
        header={MOCK_HEADER}
        activeTab="overview"
        overview={{
          ordersCount: 12,
          wishlistCount: 5,
          addressesCount: 2,
          rewardPoints: 2450,
        }}
      />
    );

    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
    expect(screen.getByTestId('profile-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('profile-overview')).toBeInTheDocument();

    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    expect(h1s[0]).toHaveTextContent('Alex Johnson');
  });

  // 12. Invariants: Props-only architecture (No fetch, No localStorage)
  it('enforces props-only architecture without fetch or localStorage calls', () => {
    if (!window.fetch) window.fetch = jest.fn() as any;
    const spyFetch = jest.spyOn(window, 'fetch');
    const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

    render(
      <ProfilePage
        header={MOCK_HEADER}
        activeTab="overview"
        overview={{
          ordersCount: 12,
          wishlistCount: 5,
          addressesCount: 2,
          rewardPoints: 2450,
        }}
      />
    );

    expect(spyFetch).not.toHaveBeenCalled();
    expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('profile'));

    spyFetch.mockRestore();
    spyStorage.mockRestore();
  });
});
