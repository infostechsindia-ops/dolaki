'use client';

import React from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { FiLoader } from 'react-icons/fi';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  value: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaActiveDescendant?: string;
}

export default function SearchBar({
  value,
  placeholder = 'Search for products, categories, and brands...',
  loading = false,
  disabled = false,
  onChange,
  onSubmit,
  onClear,
  ariaExpanded,
  ariaControls,
  ariaActiveDescendant
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !disabled && !loading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchBarForm} role="search">
      <div className={styles.inputContainer}>
        <SearchInput
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onClear={onClear}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-activedescendant={ariaActiveDescendant}
          aria-autocomplete="list"
          autoComplete="off"
          className={styles.customSearchInput}
        />
        {loading && (
          <div className={styles.loadingSpinner} data-testid="search-bar-spinner">
            <FiLoader className={styles.spinIcon} />
          </div>
        )}
      </div>
    </form>
  );
}
