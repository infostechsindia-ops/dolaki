'use client';

import React from 'react';
import styles from './ReviewAuthor.module.css';

export interface ReviewAuthorProps {
  name: string;
  avatarUrl?: string;
  className?: string;
}

export default function ReviewAuthor({
  name,
  avatarUrl,
  className = '',
}: ReviewAuthorProps) {
  const getInitials = (displayName: string) => {
    if (!displayName) return 'A';
    const parts = displayName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return displayName.slice(0, 2);
  };

  return (
    <div className={`${styles.root} ${className}`} data-testid="review-author">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className={styles.avatar}
          loading="lazy"
        />
      ) : (
        <div className={styles.avatarFallback} aria-hidden="true">
          {getInitials(name)}
        </div>
      )}
      <span className={styles.name} data-testid="review-author-name">
        {name}
      </span>
    </div>
  );
}
