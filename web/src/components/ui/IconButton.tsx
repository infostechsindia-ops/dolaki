'use client';

import React from 'react';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Mandatory aria-label for accessibility
  variant?: 'primary' | 'secondary' | 'flado' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

export default function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  shape = 'circle',
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const classes = [
    styles.iconBtn,
    styles[variant],
    styles[size],
    styles[shape],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  );
}
