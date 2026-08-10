'use client';

import React from 'react';
import ProfileHeader, { ProfileHeaderProps } from './ProfileHeader';
import ProfileSidebar, { ProfileSidebarProps, ProfileTabId } from './ProfileSidebar';
import ProfileOverview, { ProfileOverviewProps } from './ProfileOverview';
import PersonalInformationCard, { PersonalInformationCardProps } from './PersonalInformationCard';
import AddressBookCard, { AddressBookCardProps } from './AddressBookCard';
import SavedPaymentMethodsCard, { SavedPaymentMethodsCardProps } from './SavedPaymentMethodsCard';
import AccountSecurityCard, { AccountSecurityCardProps } from './AccountSecurityCard';
import NotificationPreferencesCard, { NotificationPreferencesCardProps } from './NotificationPreferencesCard';
import LoyaltySummaryCard, { LoyaltySummaryCardProps } from './LoyaltySummaryCard';
import ProfileEmptyState, { ProfileEmptyStateProps } from './ProfileEmptyState';
import styles from './ProfilePage.module.css';

export interface ProfilePageProps {
  /* Header */
  header: ProfileHeaderProps;

  /* Navigation Sidebar */
  activeTab?: ProfileTabId;
  onTabChange?: (tabId: ProfileTabId) => void;
  sidebar?: Partial<ProfileSidebarProps>;

  /* Tab Content Props */
  overview?: ProfileOverviewProps;
  personalInfo?: PersonalInformationCardProps;
  addressBook?: AddressBookCardProps;
  paymentMethods?: SavedPaymentMethodsCardProps;
  security?: AccountSecurityCardProps;
  notificationPreferences?: NotificationPreferencesCardProps;
  loyaltySummary?: LoyaltySummaryCardProps;

  /* Empty State */
  isEmpty?: boolean;
  emptyState?: ProfileEmptyStateProps;

  /* Surface */
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function ProfilePage({
  header,
  activeTab = 'overview',
  onTabChange,
  sidebar,
  overview,
  personalInfo,
  addressBook,
  paymentMethods,
  security,
  notificationPreferences,
  loyaltySummary,
  isEmpty = false,
  emptyState,
  surface = 'MARKETPLACE',
}: ProfilePageProps) {
  const isFlado = surface === 'QUICK_COMMERCE';

  return (
    <div
      className={`${styles.page} ${isFlado ? styles.flado : ''}`}
      data-testid="profile-page"
    >
      {/* Header Section (with single H1 for customer name) */}
      <ProfileHeader {...header} />

      {isEmpty ? (
        /* Empty State */
        <div className={styles.emptyContainer}>
          <ProfileEmptyState {...emptyState} />
        </div>
      ) : (
        /* Main Layout: Sidebar (left) + Active Content Card (right) */
        <div className={styles.layout}>
          <div className={styles.sidebarColumn}>
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={onTabChange}
              {...sidebar}
            />
          </div>

          <main className={styles.contentColumn} data-testid="profile-content-area">
            {activeTab === 'overview' && overview && (
              <ProfileOverview
                {...overview}
                onNavigateTab={(tabId) => onTabChange?.(tabId as ProfileTabId)}
              />
            )}
            {activeTab === 'personal' && personalInfo && <PersonalInformationCard {...personalInfo} />}
            {activeTab === 'addresses' && addressBook && <AddressBookCard {...addressBook} />}
            {activeTab === 'payments' && paymentMethods && <SavedPaymentMethodsCard {...paymentMethods} />}
            {activeTab === 'security' && security && <AccountSecurityCard {...security} />}
            {activeTab === 'notifications' && notificationPreferences && (
              <NotificationPreferencesCard {...notificationPreferences} />
            )}
            {activeTab === 'loyalty' && loyaltySummary && <LoyaltySummaryCard {...loyaltySummary} />}
          </main>
        </div>
      )}
    </div>
  );
}
