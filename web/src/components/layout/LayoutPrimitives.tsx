import React from 'react';
import styles from './LayoutPrimitives.module.css';

// ─── PAGE CONTAINER ──────────────────────────────────────────────────────────
export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PageContainer({ children, className = '', style }: PageContainerProps) {
  return (
    <div className={`${styles.pageContainer} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── CONTAINER ────────────────────────────────────────────────────────────────
export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Container({ size = '2xl', children, className = '', style }: ContainerProps) {
  const sizeClass = styles[`max_${size}`] || styles.max_2xl;

  return (
    <div className={`${styles.container} ${sizeClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── SECTION (Full Bleed Background + Constrained Inner Content) ──────────────
export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Section({
  children,
  className = '',
  style,
  innerClassName = '',
  innerStyle,
  size = '2xl',
}: SectionProps) {
  const sizeClass = styles[`max_${size}`] || styles.max_2xl;

  return (
    <section className={`${styles.section} ${className}`} style={style}>
      <div className={`${styles.sectionInner} ${sizeClass} ${innerClassName}`} style={innerStyle}>
        {children}
      </div>
    </section>
  );
}

// ─── STACK (Vertical Alignment Utility) ───────────────────────────────────────
export interface StackProps {
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';
  align?: 'start' | 'center' | 'end' | 'stretch';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Stack({ gap = '4', align = 'stretch', children, className = '', style }: StackProps) {
  const gapClass = styles[`gap_${gap}`] || styles.gap_4;
  const alignClass = styles[`align_${align}`] || styles.align_stretch;

  return (
    <div className={`${styles.stack} ${gapClass} ${alignClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── INLINE (Horizontal Layout Container) ────────────────────────────────────
export interface InlineProps {
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Inline({
  gap = '4',
  align = 'center',
  justify = 'start',
  children,
  className = '',
  style,
}: InlineProps) {
  const gapClass = styles[`gap_${gap}`] || styles.gap_4;
  const alignClass = styles[`align_${align}`] || styles.align_center;
  const justifyClass = styles[`justify_${justify}`] || styles.justify_start;

  return (
    <div className={`${styles.inline} ${gapClass} ${alignClass} ${justifyClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── GRID (Core CSS Grid Layout) ─────────────────────────────────────────────
export interface GridProps {
  columns?: number;
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Grid({ columns = 1, gap = '4', children, className = '', style }: GridProps) {
  const gapClass = styles[`gap_${gap}`] || styles.gap_4;
  const colClass = styles[`cols_${columns}`] || styles.cols_1;

  return (
    <div className={`${styles.grid} ${colClass} ${gapClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── PRODUCT GRID (Responsive column scaling) ─────────────────────────────────
export interface ProductGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductGrid({ children, className = '', style }: ProductGridProps) {
  return (
    <div className={`${styles.productGrid} ${className}`} style={style}>
      {children}
    </div>
  );
}
