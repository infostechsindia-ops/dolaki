'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import { useToast, ToastItem } from '@/context/ToastContext';
import styles from './Toast.module.css';

const ICONS = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
};

function ToastNotification({ toast }: { toast: ToastItem }) {
  const { dismissToast } = useToast();

  return (
    <div
      className={`${styles.toast} ${styles[toast.variant]}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.icon} aria-hidden="true">
        {ICONS[toast.variant]}
      </span>
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.dismissBtn}
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
      >
        <FiX />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container} aria-label="Notifications">
      {toasts.map((t) => (
        <ToastNotification key={t.id} toast={t} />
      ))}
    </div>,
    document.body
  );
}
