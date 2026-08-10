import React from 'react';
import SkipLink from './SkipLink';
import styles from './Shell.module.css';

export interface ShellProps {
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
  children: React.ReactNode;
}

export default function Shell({ surface = 'MARKETPLACE', children }: ShellProps) {
  const surfaceAttr = surface === 'QUICK_COMMERCE' ? 'quick-commerce' : 'marketplace';
  const surfaceClass = surface === 'QUICK_COMMERCE' ? styles.quickCommerce : styles.marketplace;

  return (
    <div
      className={`${styles.shell} ${surfaceClass}`}
      data-surface={surfaceAttr}
    >
      <SkipLink />
      <main id="main-content" tabIndex={-1} className={styles.main}>
        {children}
      </main>
    </div>
  );
}
