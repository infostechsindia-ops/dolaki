'use client';

import React from 'react';
import styles from './CartItemImage.module.css';

export interface CartItemImageProps {
  src: string;
  alt: string;
  href?: string;
}

export default function CartItemImage({ src, alt, href }: CartItemImageProps) {
  const content = (
    <div className={styles.imageWrap} data-testid="cart-item-image">
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );

  if (href) {
    return (
      <a href={href} className={styles.link} aria-label={alt}>
        {content}
      </a>
    );
  }

  return content;
}
