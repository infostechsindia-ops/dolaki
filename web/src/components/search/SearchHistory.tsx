'use client';

import React from 'react';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import styles from './SearchHistory.module.css';

export interface SearchHistoryProps {
  history: string[];
  onSelect: (val: string) => void;
  onClearHistory?: () => void;
  onRemoveItem?: (val: string) => void;
}

export default function SearchHistory({
  history,
  onSelect,
  onClearHistory,
  onRemoveItem
}: SearchHistoryProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Searches</h3>
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className={styles.clearAllBtn}
            aria-label="Clear all search history"
          >
            Clear All
          </button>
        )}
      </div>
      <ul className={styles.list}>
        {history.map((item, idx) => (
          <li key={idx} className={styles.item}>
            <button
              onClick={() => onSelect(item)}
              className={styles.selectBtn}
              aria-label={`Search for ${item}`}
            >
              <FiClock className={styles.clockIcon} />
              <span className={styles.text}>{item}</span>
            </button>
            {onRemoveItem && (
              <button
                onClick={() => onRemoveItem(item)}
                className={styles.removeBtn}
                aria-label={`Remove ${item} from history`}
              >
                <FiTrash2 />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
