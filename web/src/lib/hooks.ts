'use client';

import { useEffect, useRef, useCallback } from 'react';

// ─── useScrollReveal ──────────────────────────────────────────────────────────
/**
 * Activates the `.is-visible` class on elements with `.reveal`, `.reveal-left`,
 * or `.reveal-scale` when they enter the viewport.
 *
 * Usage:
 *   useScrollReveal();   // attach to any page — self-contained
 *
 * Or for a specific container:
 *   const ref = useScrollReveal<HTMLDivElement>();
 *   return <section ref={ref}>...</section>
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {},
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const root = containerRef.current ?? document;
    const elements = root.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-scale',
    );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
        ...options,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [options]);

  return containerRef;
}

// ─── useHoverTilt ─────────────────────────────────────────────────────────────
/**
 * Adds a subtle 3D tilt micro-animation on mouse move.
 *
 * Usage:
 *   const tiltRef = useHoverTilt<HTMLDivElement>();
 *   return <div ref={tiltRef}>...</div>
 */
export function useHoverTilt<T extends HTMLElement = HTMLElement>(
  maxDeg = 8,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      el.style.transform = `perspective(600px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg)`;
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
      el.style.transition = 'transform 0.4s ease';
    };

    const handleEnter = () => {
      el.style.transition = 'transform 0.1s ease';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    el.addEventListener('mouseenter', handleEnter);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.removeEventListener('mouseenter', handleEnter);
    };
  }, [maxDeg]);

  return ref;
}

// ─── useCountUp ───────────────────────────────────────────────────────────────
/**
 * Animates a number from 0 to `target` over `durationMs` milliseconds.
 *
 * Usage:
 *   const count = useCountUp(12500, 2000);
 *   return <span>{count.toLocaleString('en-IN')}</span>
 */
export function useCountUp(target: number, durationMs = 1500): number {
  const countRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.round(eased * target);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, durationMs]);

  return countRef.current;
}

// ─── useCountdown ─────────────────────────────────────────────────────────────
/**
 * Returns a live countdown { days, hours, mins, secs } to a target timestamp.
 *
 * Usage:
 *   const t = useCountdown(new Date('2026-08-01').getTime());
 */
export function useCountdown(targetTimestamp: number) {
  const getTimeLeft = useCallback(() => {
    const diff = Math.max(0, targetTimestamp - Date.now());
    return {
      days:  Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins:  Math.floor((diff % 3600000) / 60000),
      secs:  Math.floor((diff % 60000) / 1000),
      total: diff,
    };
  }, [targetTimestamp]);

  const stateRef = useRef(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => {
      stateRef.current = getTimeLeft();
    }, 1000);
    return () => clearInterval(id);
  }, [getTimeLeft]);

  return stateRef.current;
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
/**
 * Returns a debounced version of `value`.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 300);
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const ref = useRef(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => { ref.current = value; }, delayMs);

  return ref.current;
}

// ─── useLocalStorage ──────────────────────────────────────────────────────────
/**
 * Synced useState backed by localStorage.
 *
 * Usage:
 *   const [cart, setCart] = useLocalStorage<string[]>('auramart_cart', []);
 */
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const read = (): T => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  };

  const ref = useRef<T>(read());

  const write = useCallback((v: T | ((prev: T) => T)) => {
    const next = typeof v === 'function' ? (v as (prev: T) => T)(ref.current) : v;
    ref.current = next;
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key]);

  return [ref.current, write];
}

// ─── usePincode ───────────────────────────────────────────────────────────────
/**
 * Validates and fetches delivery ETA for a pincode.
 * Returns { pincode, isValid, isLoading, eta }.
 */
export function usePincode(initialPincode = '') {
  const ref = useRef({
    pincode: initialPincode,
    isValid: false,
    isLoading: false,
    eta: null as null | { standardDays: number; expressDays: number; estimatedDate: string; fladoAvailable: boolean; fladoMinutes?: number; },
  });

  const setPincode = useCallback(async (pin: string) => {
    ref.current.pincode = pin;
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      ref.current.isValid = false;
      ref.current.eta = null;
      return;
    }
    ref.current.isValid = true;
    ref.current.isLoading = true;

    // Dynamic import to avoid bundle bloat
    const { deliveryApi } = await import('@/lib/api');
    const result = await deliveryApi.getETA(pin);
    ref.current.isLoading = false;
    ref.current.eta = result;
  }, []);

  return { state: ref.current, setPincode };
}
