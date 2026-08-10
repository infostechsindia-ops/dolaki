'use client';

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './ProductPagination.module.css';

export interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  // Helper to generate page item sequence with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const totalNumbers = siblingCount * 2 + 3; // current + siblings + first + last
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis blocks

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className={styles.paginationNav}
      data-testid="product-pagination"
    >
      <ul className={styles.paginationList}>
        {/* Previous Page */}
        <li>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
          >
            <FiChevronLeft aria-hidden="true" />
            <span>Prev</span>
          </button>
        </li>

        {/* Page Numbers & Ellipses */}
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${idx}`} className={styles.ellipsis}>
                &#8230;
              </li>
            );
          }

          const pageNum = page as number;
          const isCurrent = pageNum === currentPage;

          return (
            <li key={pageNum}>
              <button
                type="button"
                className={`${styles.pageBtn} ${styles.numberBtn} ${
                  isCurrent ? styles.active : ''
                }`}
                onClick={() => onPageChange(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageNum}
              </button>
            </li>
          );
        })}

        {/* Next Page */}
        <li>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
          >
            <span>Next</span>
            <FiChevronRight aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
