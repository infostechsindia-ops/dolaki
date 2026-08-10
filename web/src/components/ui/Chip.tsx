'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from './Chip.module.css';

export interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'flado' | 'success' | 'warning' | 'danger';
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Chip({
  label,
  variant = 'default',
  selected = false,
  onClick,
  onRemove,
  disabled = false,
  className = '',
}: ChipProps) {
  const isClickable = Boolean(onClick);

  const classes = [
    styles.chip,
    styles[variant],
    selected ? styles.selected : '',
    isClickable ? styles.clickable : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-pressed={isClickable ? selected : undefined}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={
        isClickable && !disabled
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <span className={styles.label}>{label}</span>
      {onRemove && !disabled && (
        <button
          type="button"
          className={styles.removeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label}`}
        >
          <FiX />
        </button>
      )}
    </span>
  );
}
