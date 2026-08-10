'use client';

import React, { useId, useRef, KeyboardEvent } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export default function Tabs({ tabs, activeKey, onChange, className = '', children }: TabsProps) {
  const tabListId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabledIndices = tabs
      .map((t, i) => (!t.disabled ? i : -1))
      .filter((i) => i !== -1);
    const currentIdx = tabs.findIndex((t) => t.key === activeKey);
    const currentEnabledPos = enabledIndices.indexOf(currentIdx);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextPos = (currentEnabledPos + 1) % enabledIndices.length;
      const nextIdx = enabledIndices[nextPos];
      onChange(tabs[nextIdx].key);
      tabRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevPos = (currentEnabledPos - 1 + enabledIndices.length) % enabledIndices.length;
      const prevIdx = enabledIndices[prevPos];
      onChange(tabs[prevIdx].key);
      tabRefs.current[prevIdx]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      const firstIdx = enabledIndices[0];
      onChange(tabs[firstIdx].key);
      tabRefs.current[firstIdx]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      const lastIdx = enabledIndices[enabledIndices.length - 1];
      onChange(tabs[lastIdx].key);
      tabRefs.current[lastIdx]?.focus();
    }
  };

  return (
    <div className={`${styles.root} ${className}`}>
      <div
        role="tablist"
        id={tabListId}
        className={styles.tabList}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[idx] = el; }}
            role="tab"
            id={`tab-${tabListId}-${tab.key}`}
            aria-selected={activeKey === tab.key}
            aria-controls={`tabpanel-${tabListId}-${tab.key}`}
            aria-disabled={tab.disabled}
            tabIndex={activeKey === tab.key ? 0 : -1}
            disabled={tab.disabled}
            className={`${styles.tab} ${activeKey === tab.key ? styles.active : ''}`}
            onClick={() => !tab.disabled && onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`tabpanel-${tabListId}-${tab.key}`}
          aria-labelledby={`tab-${tabListId}-${tab.key}`}
          hidden={activeKey !== tab.key}
          className={styles.tabPanel}
          tabIndex={0}
        >
          {activeKey === tab.key && children}
        </div>
      ))}
    </div>
  );
}
