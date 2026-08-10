'use client';

import React from 'react';
import { FiEdit2, FiUser, FiMail, FiPhone, FiCalendar, FiUsers } from 'react-icons/fi';
import styles from './PersonalInformationCard.module.css';

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface PersonalInformationCardProps {
  info: PersonalInfoData;
  onEdit?: () => void;
  title?: string;
}

export default function PersonalInformationCard({
  info,
  onEdit,
  title = 'Personal Information',
}: PersonalInformationCardProps) {
  const { fullName, email, phone, dateOfBirth, gender } = info;

  return (
    <div className={styles.card} data-testid="personal-information-card">
      <div className={styles.header}>
        <h3 className={styles.heading}>{title}</h3>
        {onEdit && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={onEdit}
            aria-label="Edit personal information"
            data-testid="edit-personal-info-btn"
          >
            <FiEdit2 aria-hidden="true" />
            <span>Edit</span>
          </button>
        )}
      </div>

      <dl className={styles.infoList}>
        <div className={styles.infoRow}>
          <dt className={styles.dt}>
            <FiUser className={styles.icon} aria-hidden="true" />
            <span>Full Name</span>
          </dt>
          <dd className={styles.dd} data-testid="personal-fullname">{fullName}</dd>
        </div>

        <div className={styles.infoRow}>
          <dt className={styles.dt}>
            <FiMail className={styles.icon} aria-hidden="true" />
            <span>Email Address</span>
          </dt>
          <dd className={styles.dd} data-testid="personal-email">{email}</dd>
        </div>

        <div className={styles.infoRow}>
          <dt className={styles.dt}>
            <FiPhone className={styles.icon} aria-hidden="true" />
            <span>Phone Number</span>
          </dt>
          <dd className={styles.dd} data-testid="personal-phone">{phone}</dd>
        </div>

        {dateOfBirth && (
          <div className={styles.infoRow}>
            <dt className={styles.dt}>
              <FiCalendar className={styles.icon} aria-hidden="true" />
              <span>Date of Birth</span>
            </dt>
            <dd className={styles.dd} data-testid="personal-dob">{dateOfBirth}</dd>
          </div>
        )}

        {gender && (
          <div className={styles.infoRow}>
            <dt className={styles.dt}>
              <FiUsers className={styles.icon} aria-hidden="true" />
              <span>Gender</span>
            </dt>
            <dd className={styles.dd} data-testid="personal-gender">{gender}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
