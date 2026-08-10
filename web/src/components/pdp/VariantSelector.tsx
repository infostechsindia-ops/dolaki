'use client';

import React from 'react';
import styles from './VariantSelector.module.css';

export interface VariantOptionValue {
  id: string;
  label: string;
  value?: string;
  available?: boolean;
  colorHex?: string;
  imageUrl?: string;
}

export interface VariantOption {
  id: string;
  name: string; // e.g. "Color", "Size", "Storage"
  type?: 'color' | 'button' | 'dropdown';
  values: VariantOptionValue[];
  selectedValueId?: string;
}

export interface VariantSelectorProps {
  options: VariantOption[];
  onSelect?: (optionId: string, valueId: string) => void;
  className?: string;
}

export default function VariantSelector({
  options,
  onSelect,
  className = '',
}: VariantSelectorProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className={`${styles.root} ${className}`} data-testid="variant-selector">
      {options.map((option) => (
        <fieldset
          key={option.id}
          className={styles.optionGroup}
          data-testid={`variant-option-${option.id}`}
        >
          <legend className={styles.legend}>
            <span className={styles.optionName}>{option.name}</span>
            {option.selectedValueId && (
              <span className={styles.selectedLabel} data-testid={`variant-selected-${option.id}`}>
                : {option.values.find((v) => v.id === option.selectedValueId)?.label}
              </span>
            )}
          </legend>

          <div className={styles.valuesGrid}>
            {option.type === 'color'
              ? option.values.map((val) => (
                  <button
                    key={val.id}
                    type="button"
                    role="radio"
                    aria-checked={val.id === option.selectedValueId}
                    aria-label={`${option.name}: ${val.label}${val.available === false ? ' (unavailable)' : ''}`}
                    disabled={val.available === false}
                    className={`${styles.colorSwatch} ${val.id === option.selectedValueId ? styles.swatchSelected : ''} ${val.available === false ? styles.swatchDisabled : ''}`}
                    onClick={() => onSelect?.(option.id, val.id)}
                    data-testid={`variant-value-${option.id}-${val.id}`}
                  >
                    {val.colorHex && (
                      <span
                        className={styles.colorCircle}
                        style={{ backgroundColor: val.colorHex }}
                        aria-hidden="true"
                      />
                    )}
                    {val.imageUrl && (
                      <img
                        src={val.imageUrl}
                        alt=""
                        className={styles.swatchImage}
                        loading="lazy"
                      />
                    )}
                    <span className={styles.swatchLabel}>{val.label}</span>
                  </button>
                ))
              : option.type === 'dropdown'
              ? (
                <select
                  className={styles.dropdown}
                  value={option.selectedValueId || ''}
                  onChange={(e) => onSelect?.(option.id, e.target.value)}
                  aria-label={`Select ${option.name}`}
                  data-testid={`variant-dropdown-${option.id}`}
                >
                  <option value="" disabled>
                    Select {option.name}
                  </option>
                  {option.values.map((val) => (
                    <option
                      key={val.id}
                      value={val.id}
                      disabled={val.available === false}
                    >
                      {val.label}{val.available === false ? ' (Unavailable)' : ''}
                    </option>
                  ))}
                </select>
              )
              : option.values.map((val) => (
                  <button
                    key={val.id}
                    type="button"
                    role="radio"
                    aria-checked={val.id === option.selectedValueId}
                    aria-label={`${option.name}: ${val.label}${val.available === false ? ' (unavailable)' : ''}`}
                    disabled={val.available === false}
                    className={`${styles.sizeBtn} ${val.id === option.selectedValueId ? styles.sizeBtnSelected : ''} ${val.available === false ? styles.sizeBtnDisabled : ''}`}
                    onClick={() => onSelect?.(option.id, val.id)}
                    data-testid={`variant-value-${option.id}-${val.id}`}
                  >
                    {val.label}
                  </button>
                ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
