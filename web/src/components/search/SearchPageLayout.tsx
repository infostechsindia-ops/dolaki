'use client';

import React, { useState, useRef, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchSuggestions from './SearchSuggestions';
import SearchHistory from './SearchHistory';
import SearchResultsGrid from './SearchResultsGrid';
import SearchEmptyState from './SearchEmptyState';
import SearchSection from './SearchSection';
import styles from './SearchPageLayout.module.css';

export interface SearchPageLayoutProps {
  query: string;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  suggestions?: string[];
  history?: string[];
  products?: any[];
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
  onClear?: () => void;
  onClearHistory?: () => void;
  onRemoveHistoryItem?: (val: string) => void;
  surface?: 'MARKETPLACE' | 'QUICK_COMMERCE';
}

export default function SearchPageLayout({
  query,
  placeholder,
  loading = false,
  disabled = false,
  suggestions = [],
  history = [],
  products = [],
  onChange,
  onSubmit,
  onClear,
  onClearHistory,
  onRemoveHistoryItem,
  surface = 'MARKETPLACE'
}: SearchPageLayoutProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isFlado = surface === 'QUICK_COMMERCE';

  // Toggle suggestions visibility based on focus and queries
  useEffect(() => {
    if (query.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }, [query, suggestions]);

  // Click outside listener to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation handler on keydown inside search container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    if (!showSuggestions && suggestions.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setShowSuggestions(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;

      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;

      case 'Enter':
        if (showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length) {
          e.preventDefault();
          const selected = suggestions[activeIndex];
          onChange(selected);
          setShowSuggestions(false);
          setActiveIndex(-1);
          onSubmit(selected);
        } else {
          // Normal submit
          onSubmit(query);
        }
        break;

      default:
        break;
    }
  };

  const handleSelectSuggestion = (val: string) => {
    onChange(val);
    setShowSuggestions(false);
    setActiveIndex(-1);
    onSubmit(val);
  };

  const handleSelectHistory = (val: string) => {
    onChange(val);
    setShowSuggestions(false);
    onSubmit(val);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`${styles.pageLayout} ${isFlado ? styles.quickCommerce : ''}`}
      data-testid="search-page-layout"
    >
      {/* Search Input Area */}
      <div className={styles.searchBarWrapper}>
        <SearchBar
          value={query}
          placeholder={placeholder}
          loading={loading}
          disabled={disabled}
          onChange={onChange}
          onSubmit={() => onSubmit(query)}
          onClear={handleClear}
          ariaExpanded={showSuggestions}
          ariaControls={showSuggestions ? 'search-suggestions-listbox' : undefined}
          ariaActiveDescendant={activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined}
        />
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions}
            activeIndex={activeIndex}
            onSelect={handleSelectSuggestion}
            id="search-suggestions-listbox"
          />
        )}
      </div>

      {/* Main Results / History Region */}
      <div className={styles.mainContent}>
        {query.trim() === '' ? (
          // Search history visible when no search query has been typed
          history.length > 0 && (
            <SearchSection title="Your Search History">
              <SearchHistory
                history={history}
                onSelect={handleSelectHistory}
                onClearHistory={onClearHistory}
                onRemoveItem={onRemoveHistoryItem}
              />
            </SearchSection>
          )
        ) : (
          // Grid Results or Empty State
          <div className={styles.resultsWrapper}>
            {products.length > 0 ? (
              <SearchSection
                title={`Search Results`}
                subtitle={`Showing ${products.length} products matching your query`}
              >
                <SearchResultsGrid products={products} />
              </SearchSection>
            ) : (
              !loading && (
                <SearchEmptyState
                  query={query}
                  onClearSearch={handleClear}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
