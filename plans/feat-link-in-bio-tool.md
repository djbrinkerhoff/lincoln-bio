# feat: Theme Editor Prototype

A prototype for exploring theming mental models, color relationships, and styling interactions. No auth, no database—just rapid iteration on the core UX questions.

## Review Summary

**Reviewed on:** 2026-01-19
**Reviewers:** dhh-rails-reviewer, kieran-rails-reviewer, code-simplicity-reviewer

### Changes From Review
1. **Reduced files from 12 to 8** - Merged url-state into theme-store, deleted css-vars.ts, inlined ColorRelationshipRow
2. **Removed Zod** - Simple try/catch with fallback is sufficient for a prototype
3. **Fixed hydration** - Explicit hydration pattern to prevent theme flash
4. **Fixed selector optimization** - Individual selectors + useMemo for derived colors
5. **Removed false OKLCH claim** - colord uses HSL, not OKLCH
6. **Simplified store actions** - From 7 to 4 actions
7. **Added missing ThemeEditor** - Concrete implementation included
8. **Removed Performance Considerations** - Documenting non-problems

---

## Goal

Work out the interactions and mental modeling around theming:
- How do themes work?
- How does a user edit colors?
- What are the relationships between colors?
- If #000 is used in two places, is that one reference or two independent values?

---

## Core Question to Answer

**Linked vs Independent Colors:**

```
Model A: Linked (Reference-Based)
┌─────────────────────────────────────────┐
│ --brand-color: #3b82f6                  │
│                                         │
│ --button-bg: var(--brand-color)  ──┐    │
│ --link-color: var(--brand-color) ──┼─→ Same source
│ --icon-color: var(--brand-color) ──┘    │
│                                         │
│ Change brand-color = all update         │
└─────────────────────────────────────────┘

Model B: Independent (Separate Values)
┌─────────────────────────────────────────┐
│ --button-bg: #3b82f6   (independent)    │
│ --link-color: #3b82f6  (independent)    │
│ --icon-color: #3b82f6  (independent)    │
│                                         │
│ Same hex, but changing one doesn't      │
│ affect the others                       │
└─────────────────────────────────────────┘
```

**Hypothesis to test:** A hybrid "brand-first with derived colors" model—users set 3 primary colors, system derives the rest, with option to detach for fine control.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 | Already set up, fast refresh |
| Styling | Tailwind CSS v4 | CSS custom properties integration |
| Color Picker | react-colorful | 2.8KB, accessible |
| Color Math | colord + plugins | Contrast ratios, mixing, a11y checking |
| State | Zustand | Simple API |
| Storage | URL params | Shareable, no backend, survives refresh |

**Not using:** Database, auth, API routes, image upload, Zod, zundo

---

## Project Structure (8 files)

```
lincoln-bio-proto/
├── app/
│   ├── page.tsx           # Split view: editor + preview
│   ├── layout.tsx
│   └── globals.css        # CSS custom properties
├── components/
│   ├── theme-editor.tsx   # Editor panel (includes relationship rows)
│   ├── color-input.tsx    # Picker + hex + contrast badge
│   ├── bio-preview.tsx    # Live bio page preview
│   └── bio-link.tsx       # Single link button
└── lib/
    ├── theme-store.ts     # Zustand store + URL sync
    └── color-utils.ts     # colord helpers
```

---

## Data Model

Simple override pattern:
- Absence in `overrides` = derived automatically
- Presence in `overrides` = detached, user's custom value

```typescript
// lib/theme-store.ts

type ButtonStyle = 'filled' | 'outline' | 'soft';
type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type DerivedColorKey = 'card' | 'accentHover';

interface ThemeState {
  // Source colors (user picks these)
  background: string;
  accent: string;
  text: string;

  // Derived color overrides (absent = auto-calculated, present = detached)
  overrides: Partial<Record<DerivedColorKey, string>>;

  // Style options
  buttonStyle: ButtonStyle;
  borderRadius: BorderRadius;

  // Hydration flag
  _hydrated: boolean;
}

interface ThemeActions {
  hydrate: () => void;
  set: <K extends keyof ThemeState>(key: K, value: ThemeState[K]) => void;
  setOverride: (key: DerivedColorKey, value: string | null) => void; // null = reattach
  reset: () => void;
}
```

### Vocabulary (per Figma conventions)
- "attached" = references source, auto-derives
- "detached" = independent value

---

## Color Derivation

colord uses HSL for `darken()`/`lighten()` operations. This is sufficient for a prototype.

```typescript
// lib/color-utils.ts
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import mixPlugin from 'colord/plugins/mix';

extend([a11yPlugin, mixPlugin]);

export function deriveColors(
  background: string,
  accent: string,
  text: string
): Record<DerivedColorKey, string> {
  const bg = colord(background);
  const acc = colord(accent);
  const txt = colord(text);

  return {
    // Card: 5% toward text color (subtle contrast from background)
    card: bg.mix(txt, 0.05).toHex(),
    // Accent hover: 10% darker (or lighter if already dark)
    accentHover: acc.isLight()
      ? acc.darken(0.1).toHex()
      : acc.lighten(0.1).toHex(),
  };
}

// WCAG contrast checking
export function getContrastRatio(fg: string, bg: string): number {
  return colord(fg).contrast(bg);
}

export function isReadable(
  fg: string,
  bg: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  return colord(fg).isReadable(bg, { level });
}

// Auto-select accessible text color for any background
export function getAccessibleTextColor(bg: string): '#000000' | '#ffffff' {
  return colord(bg).isLight() ? '#000000' : '#ffffff';
}
```

### WCAG Contrast Requirements

| Element Type | Level AA | Level AAA |
|--------------|----------|-----------|
| Normal text (<18px) | **4.5:1** | **7:1** |
| Large text (>=18px bold) | **3:1** | **4.5:1** |
| UI components | **3:1** | **3:1** |

---

## CSS Custom Properties

```css
/* app/globals.css */

/* IMPORTANT: Keep defaults in sync with DEFAULT_STATE in theme-store.ts */
:root {
  --color-background: #ffffff;
  --color-accent: #3b82f6;
  --color-text: #1f2937;
  --color-card: #f9fafb;
  --color-accent-hover: #2563eb;
  --color-accent-text: #ffffff;
  --button-radius: 0.5rem;
}

.react-colorful {
  width: 100%;
  height: 160px;
}

.react-colorful__saturation {
  border-radius: 4px 4px 0 0;
}

.react-colorful__hue {
  height: 24px;
  border-radius: 0 0 4px 4px;
}
```

---

## Zustand Store (with URL sync)

Explicit hydration pattern prevents theme flash and hydration mismatches.

```typescript
// lib/theme-store.ts
'use client';

import { create } from 'zustand';
import { useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { deriveColors, getAccessibleTextColor } from './color-utils';

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
      if (cardOverride) overrides.card = `#${cardOverride}`;
      if (accentHoverOverride) overrides.accentHover = `#${accentHoverOverride}`;

      set({
        background: bg ? `#${bg}` : DEFAULT_STATE.background,
        accent: accent ? `#${accent}` : DEFAULT_STATE.accent,
        text: text ? `#${text}` : DEFAULT_STATE.text,
        overrides,
        buttonStyle: (params.get('btn') as ButtonStyle) || DEFAULT_STATE.buttonStyle,
        borderRadius: (params.get('radius') as BorderRadius) || DEFAULT_STATE.borderRadius,
        _hydrated: true,
      });
    } catch {
      set({ _hydrated: true }); // Use defaults on parse error
    }
  },

  set: (key, value) => set({ [key]: value }),

  setOverride: (key, value) => {
    if (value === null) {
      // Reattach: remove from overrides
      set((state) => {
        const { [key]: _, ...rest } = state.overrides;
        return { overrides: rest };
      });
    } else {
      // Detach: add to overrides
      set((state) => ({
        overrides: { ...state.overrides, [key]: value },
      }));
    }
  },

  reset: () => set({ ...DEFAULT_STATE, _hydrated: true }),
}));

// Selector with useMemo for derived colors (prevents recomputation)
export function useDerivedColors() {
  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);

  return useMemo(
    () => deriveColors(background, accent, text),
    [background, accent, text]
  );
}

// Hook to apply theme to CSS variables
export function useLiveTheme() {
  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);
  const overrides = useThemeStore((s) => s.overrides);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const hydrate = useThemeStore((s) => s.hydrate);

  const derived = useDerivedColors();

  // Hydrate on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Apply CSS variables
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

// Hook to sync state to URL (debounced)
export function useUrlSync() {
  const router = useRouter();
  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);
  const overrides = useThemeStore((s) => s.overrides);
  const buttonStyle = useThemeStore((s) => s.buttonStyle);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const hydrated = useThemeStore((s) => s._hydrated);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!hydrated) return; // Don't sync until hydrated

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
```

---

## Components

### ColorInput

```typescript
// components/color-input.tsx
'use client';

import { HexColorPicker, HexColorInput } from 'react-colorful';
import { getContrastRatio, isReadable } from '@/lib/color-utils';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  contrastAgainst?: string;
}

export function ColorInput({
  label,
  value,
  onChange,
  contrastAgainst,
}: ColorInputProps) {
  const contrast = contrastAgainst ? getContrastRatio(value, contrastAgainst) : null;
  const passesAA = contrastAgainst ? isReadable(value, contrastAgainst, 'AA') : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {contrast !== null && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono">{contrast.toFixed(1)}:1</span>
            <span className={`text-xs px-1 rounded ${passesAA ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {passesAA ? 'AA' : 'Fail'}
            </span>
          </div>
        )}
      </div>
      <HexColorPicker color={value} onChange={onChange} />
      <HexColorInput
        color={value}
        onChange={onChange}
        prefixed
        className="w-full px-2 py-1 border rounded text-sm font-mono"
      />
    </div>
  );
}
```

### ThemeEditor (with inlined relationship rows)

```typescript
// components/theme-editor.tsx
'use client';

import { useThemeStore, useDerivedColors, useLiveTheme, useUrlSync } from '@/lib/theme-store';
import { ColorInput } from './color-input';

export function ThemeEditor() {
  useLiveTheme();
  useUrlSync();

  const background = useThemeStore((s) => s.background);
  const accent = useThemeStore((s) => s.accent);
  const text = useThemeStore((s) => s.text);
  const overrides = useThemeStore((s) => s.overrides);
  const buttonStyle = useThemeStore((s) => s.buttonStyle);
  const borderRadius = useThemeStore((s) => s.borderRadius);
  const set = useThemeStore((s) => s.set);
  const setOverride = useThemeStore((s) => s.setOverride);
  const reset = useThemeStore((s) => s.reset);

  const derived = useDerivedColors();

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-white">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Theme Editor</h2>
        <button
          onClick={reset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </div>

      {/* Source Colors */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Source Colors
        </h3>
        <ColorInput
          label="Background"
          value={background}
          onChange={(v) => set('background', v)}
        />
        <ColorInput
          label="Accent"
          value={accent}
          onChange={(v) => set('accent', v)}
        />
        <ColorInput
          label="Text"
          value={text}
          onChange={(v) => set('text', v)}
          contrastAgainst={background}
        />
      </section>

      {/* Derived Colors */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Derived Colors
        </h3>

        {/* Card color relationship */}
        <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
          <div className="w-5 h-5 rounded border" style={{ backgroundColor: background }} />
          <span className="text-gray-500">Background</span>
          <span className="text-gray-400">→</span>
          <div className="w-5 h-5 rounded border" style={{ backgroundColor: overrides.card ?? derived.card }} />
          <span>Card</span>
          {overrides.card ? (
            <button
              onClick={() => setOverride('card', null)}
              className="text-xs text-blue-600 hover:underline ml-auto"
            >
              Reattach
            </button>
          ) : (
            <>
              <span className="text-xs text-gray-400">(5% toward text)</span>
              <button
                onClick={() => setOverride('card', derived.card)}
                className="text-xs text-blue-600 hover:underline ml-auto"
              >
                Detach
              </button>
            </>
          )}
        </div>

        {/* Accent hover relationship */}
        <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
          <div className="w-5 h-5 rounded border" style={{ backgroundColor: accent }} />
          <span className="text-gray-500">Accent</span>
          <span className="text-gray-400">→</span>
          <div className="w-5 h-5 rounded border" style={{ backgroundColor: overrides.accentHover ?? derived.accentHover }} />
          <span>Hover</span>
          {overrides.accentHover ? (
            <button
              onClick={() => setOverride('accentHover', null)}
              className="text-xs text-blue-600 hover:underline ml-auto"
            >
              Reattach
            </button>
          ) : (
            <>
              <span className="text-xs text-gray-400">(10% darker/lighter)</span>
              <button
                onClick={() => setOverride('accentHover', derived.accentHover)}
                className="text-xs text-blue-600 hover:underline ml-auto"
              >
                Detach
              </button>
            </>
          )}
        </div>
      </section>

      {/* Style Options */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Button Style
        </h3>
        <div className="flex gap-2">
          {(['filled', 'outline', 'soft'] as const).map((style) => (
            <button
              key={style}
              onClick={() => set('buttonStyle', style)}
              className={`px-3 py-1 text-sm rounded border ${
                buttonStyle === style
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Border Radius
        </h3>
        <div className="flex gap-2">
          {(['none', 'sm', 'md', 'lg', 'full'] as const).map((radius) => (
            <button
              key={radius}
              onClick={() => set('borderRadius', radius)}
              className={`px-3 py-1 text-sm rounded border ${
                borderRadius === radius
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {radius}
            </button>
          ))}
        </div>
      </section>

      {/* Share */}
      <section className="pt-4 border-t">
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Copy Link
        </button>
      </section>
    </div>
  );
}
```

### BioPreview

```typescript
// components/bio-preview.tsx
'use client';

import { BioLink } from './bio-link';

const mockProfile = {
  name: 'Jane Creator',
  bio: 'Designer & Developer',
};

const mockLinks = [
  { id: '1', title: 'My Portfolio', url: '#' },
  { id: '2', title: 'Twitter', url: '#' },
  { id: '3', title: 'Newsletter', url: '#' },
];

export function BioPreview() {
  return (
    <div
      className="min-h-full p-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-sm mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div
            className="w-20 h-20 mx-auto rounded-full"
            style={{ backgroundColor: 'var(--color-card)' }}
          />
          <h1
            className="text-xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            {mockProfile.name}
          </h1>
          <p
            className="text-sm opacity-70"
            style={{ color: 'var(--color-text)' }}
          >
            {mockProfile.bio}
          </p>
        </div>

        <div className="space-y-3">
          {mockLinks.map((link) => (
            <BioLink key={link.id} title={link.title} url={link.url} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### BioLink

```typescript
// components/bio-link.tsx
'use client';

import { useThemeStore } from '@/lib/theme-store';

const BUTTON_STYLES = {
  filled: {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-accent-text)',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-accent)',
    border: '2px solid var(--color-accent)',
  },
  soft: {
    backgroundColor: 'var(--color-card)',
    color: 'var(--color-text)',
    border: 'none',
  },
} as const;

interface BioLinkProps {
  title: string;
  url: string;
}

export function BioLink({ title, url }: BioLinkProps) {
  const buttonStyle = useThemeStore((s) => s.buttonStyle);

  return (
    <a
      href={url}
      className="block w-full py-3 px-4 text-center font-medium transition-transform hover:scale-[1.02]"
      style={{
        ...BUTTON_STYLES[buttonStyle],
        borderRadius: 'var(--button-radius)',
      }}
    >
      {title}
    </a>
  );
}
```

### Page Layout

```typescript
// app/page.tsx
import { ThemeEditor } from '@/components/theme-editor';
import { BioPreview } from '@/components/bio-preview';

export default function Home() {
  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r flex-shrink-0">
        <ThemeEditor />
      </aside>
      <main className="flex-1">
        <BioPreview />
      </main>
    </div>
  );
}
```

---

## Implementation Tasks

### Phase 1: Build It

- [ ] Install dependencies: `npm install zustand react-colorful colord`
- [ ] Set up `globals.css` with CSS custom properties
- [ ] Create `lib/color-utils.ts`
- [ ] Create `lib/theme-store.ts` with hydration + URL sync
- [ ] Build `components/color-input.tsx`
- [ ] Build `components/theme-editor.tsx`
- [ ] Build `components/bio-preview.tsx` and `bio-link.tsx`
- [ ] Wire up `app/page.tsx` split layout

### Phase 2: Polish & Learn

- [ ] Add "Copy Link" feedback (toast or button text change)
- [ ] Test: Do users understand "detach/reattach"?
- [ ] Test: Do they prefer colors auto-updating or independent?
- [ ] Document findings

---

## Acceptance Criteria

### Color Editing
- [ ] User can pick colors using visual picker or hex input
- [ ] Changes apply instantly
- [ ] Contrast ratio displayed with AA pass/fail

### Color Relationships
- [ ] Derived colors update when source changes
- [ ] User can detach a derived color
- [ ] User can reattach to restore derivation

### Live Preview
- [ ] Preview updates via CSS variables
- [ ] No flash on page load from shared URL

### Sharing
- [ ] Theme state encoded in URL
- [ ] "Copy Link" works

---

## Key Questions to Answer

1. **Attached by default?** Should derived colors auto-update or be independent by default?
2. **Visibility of relationships:** How prominently show that "Card" derives from "Background"?
3. **Detach friction:** One click or require confirmation?
4. **User vocabulary:** Do users understand "attached/detached" or prefer "auto/custom"?

---

## Not Building

- Authentication
- Database
- Image upload
- Multiple pages
- Undo/redo
- More than 2 derived colors
- Presets (defer to Phase 2 if needed)

---

## References

- [Zustand](https://zustand.docs.pmnd.rs/)
- [react-colorful](https://github.com/omgovich/react-colorful)
- [colord](https://github.com/omgovich/colord)
- [WCAG Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
