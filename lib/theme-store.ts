'use client';

import { create } from 'zustand';
import { useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { deriveColors, getAccessibleTextColor, type DerivedColorKey } from './color-utils';

export type ButtonStyle = 'filled' | 'outline' | 'soft';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

// Validation constants and functions
const VALID_BUTTON_STYLES: readonly ButtonStyle[] = ['filled', 'outline', 'soft'];
const VALID_BORDER_RADII: readonly BorderRadius[] = ['none', 'sm', 'md', 'lg', 'full'];

function isValidHexColor(value: string | null): boolean {
  if (!value) return false;
  return /^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(value);
}

function isValidButtonStyle(value: string | null): value is ButtonStyle {
  return VALID_BUTTON_STYLES.includes(value as ButtonStyle);
}

function isValidBorderRadius(value: string | null): value is BorderRadius {
  return VALID_BORDER_RADII.includes(value as BorderRadius);
}

export interface ThemeState {
  background: string;
  accent: string;
  text: string;
  overrides: Partial<Record<DerivedColorKey, string>>;
  buttonStyle: ButtonStyle;
  borderRadius: BorderRadius;
  _hydrated: boolean;
}

interface ThemeActions {
  hydrate: () => void;
  set: <K extends keyof ThemeState>(key: K, value: ThemeState[K]) => void;
  setOverride: (key: DerivedColorKey, value: string | null) => void;
  reset: () => void;
}

const DEFAULT_STATE: ThemeState = {
  background: '#ffffff',
  accent: '#3b82f6',
  text: '#1f2937',
  overrides: {},
  buttonStyle: 'filled',
  borderRadius: 'md',
  _hydrated: false,
};

const RADIUS_VALUES: Record<BorderRadius, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
};

export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
  ...DEFAULT_STATE,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    if (get()._hydrated) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const bg = params.get('bg');
      const accent = params.get('accent');
      const text = params.get('text');

      const overrides: ThemeState['overrides'] = {};
      const cardOverride = params.get('o_card');
      const accentHoverOverride = params.get('o_accentHover');
      if (isValidHexColor(cardOverride)) overrides.card = `#${cardOverride}`;
      if (isValidHexColor(accentHoverOverride)) overrides.accentHover = `#${accentHoverOverride}`;

      const btnParam = params.get('btn');
      const radiusParam = params.get('radius');

      set({
        background: isValidHexColor(bg) ? `#${bg}` : DEFAULT_STATE.background,
        accent: isValidHexColor(accent) ? `#${accent}` : DEFAULT_STATE.accent,
        text: isValidHexColor(text) ? `#${text}` : DEFAULT_STATE.text,
        overrides,
        buttonStyle: isValidButtonStyle(btnParam) ? btnParam : DEFAULT_STATE.buttonStyle,
        borderRadius: isValidBorderRadius(radiusParam) ? radiusParam : DEFAULT_STATE.borderRadius,
        _hydrated: true,
      });
    } catch {
      set({ _hydrated: true });
    }
  },

  set: (key, value) => set({ [key]: value }),

  setOverride: (key, value) => {
    if (value === null) {
      set((state) => {
        const { [key]: _, ...rest } = state.overrides;
        return { overrides: rest };
      });
    } else {
      set((state) => ({
        overrides: { ...state.overrides, [key]: value },
      }));
    }
  },

  reset: () => set({ ...DEFAULT_STATE, _hydrated: true }),
}));

export function useDerivedColors() {
  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);

  return useMemo(
    () => deriveColors(background, accent, text),
    [background, accent, text]
  );
}

export function useLiveTheme() {
  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);
  const overrides = useThemeStore((s) => s.overrides);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const hydrate = useThemeStore((s) => s.hydrate);

  const derived = useDerivedColors();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--color-background', background);
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-text', text);
    root.style.setProperty('--color-card', overrides.card ?? derived.card);
    root.style.setProperty('--color-accent-hover', overrides.accentHover ?? derived.accentHover);
    root.style.setProperty('--color-accent-text', getAccessibleTextColor(accent));
    root.style.setProperty('--button-radius', RADIUS_VALUES[borderRadius]);
  }, [background, accent, text, overrides, derived, borderRadius]);
}

export function useUrlSync() {
  const router = useRouter();
  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);
  const overrides = useThemeStore((s) => s.overrides);
  const buttonStyle = useThemeStore((s) => s.buttonStyle);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const hydrated = useThemeStore((s) => s._hydrated);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();

      params.set('bg', background.slice(1));
      params.set('accent', accent.slice(1));
      params.set('text', text.slice(1));

      if (overrides.card) params.set('o_card', overrides.card.slice(1));
      if (overrides.accentHover) params.set('o_accentHover', overrides.accentHover.slice(1));

      params.set('btn', buttonStyle);
      params.set('radius', borderRadius);

      router.replace(`?${params.toString()}`, { scroll: false });
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [background, accent, text, overrides, buttonStyle, borderRadius, hydrated, router]);
}
