'use client';

import React from 'react';
import { FiGift, FiAward, FiCheckCircle } from 'react-icons/fi';
import styles from './LoyaltySummaryCard.module.css';

export interface LoyaltySummaryCardProps {
  rewardPoints: number;
  tierName?: string;
  nextTierName?: string;
  pointsToNextTier?: number;
  progressPercent?: number; // 0 - 100
  benefits?: string[];
  title?: string;
}

export default function LoyaltySummaryCard({
  rewardPoints,
  tierName = 'Gold Member',
  nextTierName = 'Platinum Member',
  pointsToNextTier = 550,
  progressPercent = 75,
  benefits = [
    'Free express shipping on all marketplace orders',
    'Double reward points on Flado Quick-Commerce orders',
    'Exclusive VIP customer support channel',
  ],
  title = 'Rewards & Loyalty Program',
}: LoyaltySummaryCardProps) {
  return (
    <div className={styles.card} data-testid="loyalty-summary-card">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <FiGift className={styles.icon} aria-hidden="true" />
          <h3 className={styles.heading}>{title}</h3>
        </div>

        <span className={styles.tierBadge} data-testid="loyalty-tier-badge">
          <FiAward className={styles.badgeIcon} aria-hidden="true" />
          {tierName}
        </span>
      </div>

      <div className={styles.body}>
        {/* Points Display */}
        <div className={styles.pointsBlock}>
          <span className={styles.pointsNum} data-testid="loyalty-points-num">
            {rewardPoints.toLocaleString()}
          </span>
          <span className={styles.pointsLabel}>Available Reward Points</span>
        </div>

        {/* Progress Bar */}
        {nextTierName && pointsToNextTier != null && (
          <div className={styles.progressBlock}>
            <div className={styles.progressTextRow}>
              <span className={styles.nextTierText}>
                {pointsToNextTier} pts until <strong>{nextTierName}</strong>
              </span>
              <span className={styles.percentText}>{progressPercent}%</span>
            </div>

            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                data-testid="loyalty-progress-bar"
              />
            </div>
          </div>
        )}

        {/* Benefits list */}
        {benefits.length > 0 && (
          <div className={styles.benefitsBlock}>
            <span className={styles.benefitsTitle}>Your Tier Benefits:</span>
            <ul className={styles.benefitsList}>
              {benefits.map((b, idx) => (
                <li key={idx} className={styles.benefitItem}>
                  <FiCheckCircle className={styles.checkIcon} aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
