/**
 * VariantMatrix.ts
 * Pure, deterministic matrix solver and types for CMD-035 Variant Experience.
 *
 * Invariant: All display data (price, stock, images, delivery) comes from supplied
 * combination objects — zero client-side price or stock arithmetic is calculated here.
 */

import { VariantOption, VariantOptionValue } from './VariantSelector';
import { ProductImage } from './ProductGallery';

/**
 * Authoritative combination data payload for a single variant SKU.
 */
export interface VariantCombination {
  id: string;
  sku: string;
  /** Attribute map, e.g. { color: 'red', size: 'xl' } */
  attributeValues: Record<string, string>;
  inStock: boolean;
  stockBadgeText?: string;
  formattedPrice: string;
  formattedCompareAtPrice?: string;
  discountPercent?: number;
  formattedUnitPrice?: string;
  unitLabel?: string;
  images?: ProductImage[];
  deliveryBadgeText?: string;
  estimatedDeliveryText?: string;
}

/**
 * Result of resolving current selections against the combination matrix.
 */
export interface MatrixResolutionResult {
  /** Currently selected attribute map { [optionId]: valueId } */
  selectedAttributes: Record<string, string>;
  /** Set of value IDs that are impossible/disabled given current selections */
  disabledValueIds: Record<string, Set<string>>;
  /** Exact matching combination if all required attributes are selected */
  matchingCombination: VariantCombination | null;
  /** Whether the current selection forms a valid, in-stock combination */
  isValidAndInStock: boolean;
  /** Whether all required variant options have a selection */
  isCompleteSelection: boolean;
}

/**
 * Given current option selections and the matrix of valid combinations,
 * computes which option values are impossible/disabled.
 *
 * An option value V for option O is possible if there exists at least one combination
 * matching all OTHER currently selected attributes (excluding O) AND has option O = V.
 */
export function computeDisabledOptionValues(
  options: VariantOption[],
  selectedAttributes: Record<string, string>,
  combinations: VariantCombination[]
): Record<string, Set<string>> {
  const disabledMap: Record<string, Set<string>> = {};

  for (const option of options) {
    const disabledForOption = new Set<string>();

    for (const val of option.values) {
      // Test if setting option.id = val.id produces at least one valid combination
      // when holding all OTHER current selections fixed
      const testSelections: Record<string, string> = {};
      for (const otherOpt of options) {
        if (otherOpt.id === option.id) {
          testSelections[otherOpt.id] = val.id;
        } else if (selectedAttributes[otherOpt.id]) {
          testSelections[otherOpt.id] = selectedAttributes[otherOpt.id];
        }
      }

      const hasValidCombo = combinations.some((combo) => {
        return Object.entries(testSelections).every(
          ([optId, valId]) => combo.attributeValues[optId] === valId
        );
      });

      if (!hasValidCombo) {
        disabledForOption.add(val.id);
      }
    }

    disabledMap[option.id] = disabledForOption;
  }

  return disabledMap;
}

/**
 * Finds the exact matching combination given full attribute selections.
 */
export function findMatchingCombination(
  selectedAttributes: Record<string, string>,
  combinations: VariantCombination[],
  options: VariantOption[]
): VariantCombination | null {
  // Check if all options are selected
  const allSelected = options.every((opt) => !!selectedAttributes[opt.id]);
  if (!allSelected) return null;

  return (
    combinations.find((combo) => {
      return options.every(
        (opt) => combo.attributeValues[opt.id] === selectedAttributes[opt.id]
      );
    }) || null
  );
}

/**
 * Full deterministic matrix evaluation.
 */
export function evaluateVariantMatrix(
  options: VariantOption[],
  selectedAttributes: Record<string, string>,
  combinations: VariantCombination[]
): MatrixResolutionResult {
  const isCompleteSelection = options.length === 0 || options.every((opt) => !!selectedAttributes[opt.id]);
  const disabledValueIds = computeDisabledOptionValues(options, selectedAttributes, combinations);
  const matchingCombination = findMatchingCombination(selectedAttributes, combinations, options);
  const isValidAndInStock = matchingCombination !== null && matchingCombination.inStock;

  return {
    selectedAttributes,
    disabledValueIds,
    matchingCombination,
    isValidAndInStock,
    isCompleteSelection,
  };
}
