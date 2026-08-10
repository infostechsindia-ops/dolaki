'use client';

import React, { useRef } from 'react';
import { FiChevronRight, FiChevronDown, FiFolder } from 'react-icons/fi';
import styles from './CategoryTree.module.css';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  children?: CategoryNode[];
}

export interface CategoryTreeProps {
  categories: CategoryNode[];
  expandedIds?: string[];
  activeId?: string;
  onToggleExpand?: (id: string) => void;
  onSelectCategory?: (category: CategoryNode) => void;
}

export default function CategoryTree({
  categories,
  expandedIds = [],
  activeId,
  onToggleExpand,
  onSelectCategory,
}: CategoryTreeProps) {
  const treeRef = useRef<HTMLUListElement>(null);

  // Helper to handle keyboard navigation across rendered treeitem buttons
  const handleKeyDown = (e: React.KeyboardEvent, node: CategoryNode, parentId?: string) => {
    const isExpanded = expandedIds.includes(node.id);
    const hasChildren = Boolean(node.children && node.children.length > 0);

    const items = Array.from(
      treeRef.current?.querySelectorAll('[role="treeitem"]') || []
    ) as HTMLElement[];

    const currentIndex = items.indexOf(e.currentTarget as HTMLElement);
    if (currentIndex === -1) return;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextItem = items[currentIndex + 1];
        if (nextItem) nextItem.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevItem = items[currentIndex - 1];
        if (prevItem) prevItem.focus();
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (hasChildren) {
          if (!isExpanded) {
            onToggleExpand?.(node.id);
          } else {
            const nextItem = items[currentIndex + 1];
            if (nextItem) nextItem.focus();
          }
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (hasChildren && isExpanded) {
          onToggleExpand?.(node.id);
        } else if (parentId) {
          const parentItem = items.find(
            (item) => item.getAttribute('data-id') === parentId
          );
          if (parentItem) parentItem.focus();
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        if (items[0]) items[0].focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        if (items[items.length - 1]) items[items.length - 1].focus();
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        onSelectCategory?.(node);
        break;
      }
      default:
        break;
    }
  };

  const renderTreeNodes = (
    nodes: CategoryNode[],
    level = 1,
    parentId?: string
  ): React.ReactNode => {
    return nodes.map((node) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = expandedIds.includes(node.id);
      const isActive = activeId === node.id;

      return (
        <li key={node.id} role="none" className={styles.treeNode}>
          <div
            role="treeitem"
            data-id={node.id}
            tabIndex={isActive || (!activeId && level === 1 && nodes[0].id === node.id) ? 0 : -1}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isActive}
            aria-level={level}
            aria-label={node.name}
            className={`${styles.itemContent} ${isActive ? styles.active : ''}`}
            onClick={() => onSelectCategory?.(node)}
            onKeyDown={(e) => handleKeyDown(e, node, parentId)}
          >
            {hasChildren ? (
              <button
                type="button"
                className={styles.expandBtn}
                tabIndex={-1}
                aria-label={isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand?.(node.id);
                }}
              >
                {isExpanded ? (
                  <FiChevronDown className={styles.icon} />
                ) : (
                  <FiChevronRight className={styles.icon} />
                )}
              </button>
            ) : (
              <span className={styles.expandSpacer} />
            )}

            <span className={styles.nodeIcon}>
              {node.icon || <FiFolder />}
            </span>
            <span className={styles.nodeName}>{node.name}</span>
          </div>

          {hasChildren && isExpanded && (
            <ul role="group" className={styles.subGroup}>
              {renderTreeNodes(node.children!, level + 1, node.id)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <ul
      ref={treeRef}
      role="tree"
      aria-label="Categories"
      className={styles.treeContainer}
      data-testid="category-tree"
    >
      {renderTreeNodes(categories)}
    </ul>
  );
}
