'use client';

import React from 'react';
import styles from './SearchSuggestions.module.css';

export interface SearchSuggestionsProps {
  suggestions: string[];
  activeIndex: number;
  onSelect: (val: string) => void;
  id?: string;
}

export default function SearchSuggestions({
  suggestions,
  activeIndex,
  onSelect,
  id = 'search-suggestions-listbox'
}: SearchSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul
      id={id}
      role="listbox"
      aria-label="Search suggestions"
      className={styles.suggestionsList}
    >
      {suggestions.map((suggestion, index) => {
        const isActive = index === activeIndex;
        return (
          <li
            key={index}
            id={`suggestion-item-${index}`}
            role="option"
            aria-selected={isActive}
            className={`${styles.suggestionItem} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(suggestion)}
          >
            <span className={styles.icon}>🔍</span>
            <span className={styles.text}>{suggestion}</span>
          </li>
        );
      })}
    </ul>
  );
}
