'use client';

import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { FiSearch } from 'react-icons/fi';

export interface NoResultsSectionProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function NoResultsSection({
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  action,
}: NoResultsSectionProps) {
  return (
    <EmptyState
      icon={<FiSearch />}
      title={title}
      description={description}
      action={action}
    />
  );
}
