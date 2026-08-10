'use client';

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  variant?: 'elevated' | 'outlined' | 'flat' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Card({
  variant = 'elevated',
  padding = 'md',
  className = '',
  children,
  onClick,
}: CardProps) {
  const classes = [
    styles.card,
    styles[variant],
    styles[`padding_${padding}`],
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <div
        className={classes}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </div>
    );
  }

  return <div className={classes}>{children}</div>;
}
