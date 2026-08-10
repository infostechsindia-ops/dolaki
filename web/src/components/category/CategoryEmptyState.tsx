'use client';

import React from 'react';
import EmptyState from '@/components/ui/EmptyState';
import { FiFolder } from 'react-icons/fi';

export interface CategoryEmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function CategoryEmptyState({
  title = 'No categories found',
  description = 'There are no categories matching your selection.',
  action,
}: CategoryEmptyStateProps) {
  return (
    <EmptyState
      icon={<FiFolder />}
      title={title}
      description={description}
      action={action}
    />
  );
}
