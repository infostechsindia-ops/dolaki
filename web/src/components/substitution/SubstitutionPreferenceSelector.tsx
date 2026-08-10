'use client';

import React from 'react';

export interface SubstitutionPreferenceSelectorProps {
  value: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';
  onChange: (newValue: 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION') => void;
  disabled?: boolean;
}

export default function SubstitutionPreferenceSelector({
  value,
  onChange,
  disabled = false,
}: SubstitutionPreferenceSelectorProps) {
  return (
    <div
      aria-label="Substitution Preferences"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155' }}>
        If an item is out of stock:
      </label>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('ALLOW_SUBSTITUTION')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            border: value === 'ALLOW_SUBSTITUTION' ? '1.5px solid #059669' : '1px solid #CBD5E1',
            backgroundColor: value === 'ALLOW_SUBSTITUTION' ? '#ECFDF5' : '#FFFFFF',
            color: value === 'ALLOW_SUBSTITUTION' ? '#047857' : '#334155',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Replace with Best Match
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('CONTACT_ME')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            border: value === 'CONTACT_ME' ? '1.5px solid #059669' : '1px solid #CBD5E1',
            backgroundColor: value === 'CONTACT_ME' ? '#ECFDF5' : '#FFFFFF',
            color: value === 'CONTACT_ME' ? '#047857' : '#334155',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Contact Me First
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('NO_SUBSTITUTION')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: '600',
            border: value === 'NO_SUBSTITUTION' ? '1.5px solid #059669' : '1px solid #CBD5E1',
            backgroundColor: value === 'NO_SUBSTITUTION' ? '#ECFDF5' : '#FFFFFF',
            color: value === 'NO_SUBSTITUTION' ? '#047857' : '#334155',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Don't Substitute
        </button>
      </div>
    </div>
  );
}
