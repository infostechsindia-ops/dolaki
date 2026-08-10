'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import styles from './Drawer.module.css';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'right' | 'bottom';
  isDismissible?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function Drawer({
  isOpen,
  onClose,
  title,
  side = 'right',
  isDismissible = true,
  children,
  className = '',
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      const frame = requestAnimationFrame(() => {
        const first = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)[0];
        first?.focus();
      });
      return () => cancelAnimationFrame(frame);
    } else {
      document.body.style.overflow = '';
      if (triggerRef.current && 'focus' in triggerRef.current) {
        (triggerRef.current as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isDismissible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, isDismissible, onClose]);

  const handleTabKey = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const el = panelRef.current;
    if (!el) return;
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
      (node) => !node.closest('[hidden]')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={isDismissible ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Drawer'}
        className={`${styles.panel} ${styles[side]} ${className}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTabKey}
      >
        {(title || isDismissible) && (
          <div className={styles.header}>
            {title && <span className={styles.title}>{title}</span>}
            {isDismissible && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close drawer"
              >
                <FiX />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
