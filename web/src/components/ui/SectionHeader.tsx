'use client';

import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  isFlado?: boolean;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All',
  isFlado = false
}: SectionHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <div className={styles.left}>
        {label && (
          <span className={`${styles.label} ${isFlado ? styles.fladoLabel : styles.standardLabel}`}>
            {label}
          </span>
        )}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link 
          href={viewAllLink} 
          className={`${styles.viewAll} ${isFlado ? styles.fladoViewAll : styles.standardViewAll}`}
        >
          <span>{viewAllText}</span>
          <FiArrowRight className={styles.arrow} />
        </Link>
      )}
    </div>
  );
}
