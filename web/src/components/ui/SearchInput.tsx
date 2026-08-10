'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiMic, FiCamera, FiTrendingUp, FiTag } from 'react-icons/fi';
import styles from './SearchInput.module.css';
import { API_BASE_URL } from '@/lib/config';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  value?: string;
  onSearchSubmit?: (q: string) => void;
}

export default function SearchInput({
  onClear,
  value = '',
  className = '',
  disabled,
  onSearchSubmit,
  onChange,
  ...props
}: SearchInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced autocomplete fetch
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products/search/suggestions?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          setSuggestions(await res.json());
        }
      } catch {
        // Fallback
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceSample = 'Apple iPhone';
      setQuery(voiceSample);
      if (onSearchSubmit) onSearchSubmit(voiceSample);
    }, 1500);
  };

  const handleImageSearch = () => {
    alert('📷 Image Search Activated: Drag & Drop a product image to find matching listings.');
  };

  return (
    <div className={`${styles.wrapper} ${className}`} ref={wrapperRef} style={{ position: 'relative' }}>
      <span className={styles.searchIcon} aria-hidden="true">
        <FiSearch />
      </span>
      <input
        type="search"
        role="searchbox"
        value={query}
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onChange) onChange(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearchSubmit) {
            onSearchSubmit(query);
            setIsOpen(false);
          }
        }}
        className={`${styles.input} ${query ? styles.hasClear : ''}`}
        {...props}
      />
      <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '6px', color: '#94A3B8' }}>
        <button
          type="button"
          onClick={handleVoiceSearch}
          title="Voice Search"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isListening ? '#EF4444' : '#94A3B8' }}
        >
          <FiMic size={16} />
        </button>
        <button
          type="button"
          onClick={handleImageSearch}
          title="Visual Image Search"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
        >
          <FiCamera size={16} />
        </button>
      </div>

      {query && onClear && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            setQuery('');
            if (onClear) onClear();
          }}
          aria-label="Clear search"
          tabIndex={0}
        >
          <FiX />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          marginTop: '8px',
          zIndex: 100,
          padding: '16px',
          border: '1px solid #E2E8F0'
        }}>
          {/* Trending Searches */}
          {!query && suggestions.trending && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiTrendingUp /> Trending Searches
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {suggestions.trending.map((t: string) => (
                  <button
                    key={t}
                    onClick={() => {
                      setQuery(t);
                      if (onSearchSubmit) onSearchSubmit(t);
                      setIsOpen(false);
                    }}
                    style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories && suggestions.categories.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Categories</div>
              {suggestions.categories.map((c: string) => (
                <div key={c} style={{ padding: '6px 0', fontSize: '0.9rem', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => { if (onSearchSubmit) onSearchSubmit(c); setIsOpen(false); }}>
                  <FiTag size={14} color="#7C3AED" /> in <strong>{c}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Product Matching Suggestions */}
          {suggestions.products && suggestions.products.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Products</div>
              {suggestions.products.map((p: any) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', cursor: 'pointer' }} onClick={() => { if (onSearchSubmit) onSearchSubmit(p.title); setIsOpen(false); }}>
                  <img src={p.imageUrl} alt={p.title} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#166534' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

