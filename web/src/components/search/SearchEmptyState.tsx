'use client';

import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch } from 'react-icons/fi';

export interface SearchEmptyStateProps {
  query: string;
  onClearSearch?: () => void;
  title?: string;
  description?: string;
}

export default function SearchEmptyState({
  query,
  onClearSearch,
  title,
  description
}: SearchEmptyStateProps) {
  const defaultTitle = `No results found for "${query}"`;
  const defaultDescription = 'Check the spelling of your query or try looking for a different product.';

  return (
    <EmptyState
      icon={<FiSearch />}
      title={title || defaultTitle}
      description={description || defaultDescription}
      action={onClearSearch ? {
        label: 'Clear Search',
        onClick: onClearSearch
      } : undefined}
    />
  );
}
