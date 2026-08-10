'use client';

import { useState, useMemo, useCallback } from 'react';
import { VariantOption } from './VariantSelector';
import {
  VariantCombination,
  MatrixResolutionResult,
  evaluateVariantMatrix,
} from './VariantMatrix';

export interface UseVariantSelectionOptions {
  options: VariantOption[];
  combinations: VariantCombination[];
  initialSelections?: Record<string, string>;
  defaultCombinationId?: string;
}

export interface UseVariantSelectionReturn {
  selectedAttributes: Record<string, string>;
  selectOption: (optionId: string, valueId: string) => void;
  resolution: MatrixResolutionResult;
  /** Enriched options array with `available` flag calculated for every value */
  processedOptions: VariantOption[];
  /** Validates selection before cart mutation; returns result & human-readable reason if invalid */
  validateBeforeCart: () => { valid: boolean; reason?: string; combination: VariantCombination | null };
}

export function useVariantSelection({
  options = [],
  combinations = [],
  initialSelections,
  defaultCombinationId,
}: UseVariantSelectionOptions): UseVariantSelectionReturn {
  // Initialize default selection
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    if (initialSelections) {
      return { ...initialSelections };
    }

    // Try finding default combination
    const defaultCombo = defaultCombinationId
      ? combinations.find((c) => c.id === defaultCombinationId)
      : combinations[0];

    if (defaultCombo) {
      return { ...defaultCombo.attributeValues };
    }

    // Fallback to first available value per option
    const initial: Record<string, string> = {};
    for (const opt of options) {
      if (opt.values.length > 0) {
        initial[opt.id] = opt.values[0].id;
      }
    }
    return initial;
  });

  const selectOption = useCallback((optionId: string, valueId: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));
  }, []);

  // Compute resolution matrix deterministically whenever selection, options or combinations change
  const resolution = useMemo(() => {
    return evaluateVariantMatrix(options, selectedAttributes, combinations);
  }, [options, selectedAttributes, combinations]);

  // Enrich VariantOption[] with `available` boolean based on disabled matrix
  const processedOptions = useMemo(() => {
    return options.map((opt) => {
      const disabledSet = resolution.disabledValueIds[opt.id] || new Set();
      const selectedValueId = selectedAttributes[opt.id];

      return {
        ...opt,
        selectedValueId,
        values: opt.values.map((val) => ({
          ...val,
          available: !disabledSet.has(val.id),
        })),
      };
    });
  }, [options, selectedAttributes, resolution.disabledValueIds]);

  const validateBeforeCart = useCallback(() => {
    if (!resolution.isCompleteSelection) {
      return {
        valid: false,
        reason: 'Please select all product options.',
        combination: null,
      };
    }

    if (!resolution.matchingCombination) {
      return {
        valid: false,
        reason: 'The selected combination is not available.',
        combination: null,
      };
    }

    if (!resolution.matchingCombination.inStock) {
      return {
        valid: false,
        reason: 'The selected combination is currently out of stock.',
        combination: resolution.matchingCombination,
      };
    }

    return {
      valid: true,
      combination: resolution.matchingCombination,
    };
  }, [resolution]);

  return {
    selectedAttributes,
    selectOption,
    resolution,
    processedOptions,
    validateBeforeCart,
  };
}
