'use client';

import React from 'react';
import styles from './SkipLink.module.css';

export default function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('main-content');
    if (target) {
      target.setAttribute('tabIndex', '-1');
      target.focus();
    }
  };

  return (
    <a href="#main-content" onClick={handleClick} className={styles.skipLink}>
      Skip to main content
    </a>
  );
}
