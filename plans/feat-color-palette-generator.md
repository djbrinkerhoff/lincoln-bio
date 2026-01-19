# Feature: Quick Palettes

Generate 3 color palettes from the current accent color, allowing users to quickly apply harmonious color combinations with one click.

## Overview

Add a "Quick Palettes" section at the top of the theme editor sidebar. The system generates 3 palettes from the current accent color using color theory. Clicking a palette instantly applies its background, accent, and text colors. No additional state, no selection tracking - palettes are ephemeral suggestions.

## Problem Statement

Currently, users must manually pick each brand color (background, accent, text) individually. This requires understanding color theory to create harmonious combinations. Quick palettes remove this friction by offering pre-computed, accessible color combinations derived from the accent they've already chosen.

## Proposed Solution

### User Flow

1. User sees "Quick Palettes" section at top of sidebar
2. 3 palettes display as clickable rows (derived from current accent)
3. Clicking a palette applies all 3 colors instantly
4. Changing the accent color automatically updates the palette options
5. Done. No selection tracking, no special state.

### The 3 Palette Types

Simple, user-friendly names instead of color theory jargon:

| # | Name | Algorithm | Description |
|---|------|-----------|-------------|
| 1 | **Light** | Monochromatic tints/shades | Light background, accent pops, dark text |
| 2 | **Bold** | Complementary | White background, accent stands out, contrasting text |
| 3 | **Soft** | Analogous | Muted background, shifted accent, harmonious text |

### Color Role Assignment

For each palette, derive from current accent:
- **Background**: Light variation or white
- **Accent**: Current accent or harmony variant
- **Text**: Dark variation, guaranteed ≥4.5:1 contrast vs background

## Technical Approach

### No New State

Palettes are derived directly from the existing `accent` value. No new store properties needed.

### New Function in color-utils.ts

```typescript
// lib/color-utils.ts additions (~25 lines)

import harmoniesPlugin from 'colord/plugins/harmonies';
extend([a11yPlugin, mixPlugin, harmoniesPlugin]);

export interface Palette {
  name: string;
  background: string;
  accent: string;
  text: string;
}

export function generatePalettes(accent: string): Palette[] {
  const key = colord(accent);

  return [
    {
      name: 'Light',
      background: key.lighten(0.45).toHex(),
      accent: accent,
      text: ensureContrast(key.darken(0.4).toHex(), key.lighten(0.45).toHex()),
    },
    {
      name: 'Bold',
      background: '#ffffff',
      accent: accent,
      text: ensureContrast(key.rotate(180).darken(0.3).toHex(), '#ffffff'),
    },
    {
      name: 'Soft',
      background: key.desaturate(0.3).lighten(0.4).toHex(),
      accent: key.rotate(30).toHex(),
      text: ensureContrast(key.rotate(-30).darken(0.35).toHex(), key.desaturate(0.3).lighten(0.4).toHex()),
    },
  ];
}

function ensureContrast(text: string, background: string, minRatio = 4.5): string {
  let t = colord(text);
  const bg = colord(background);
  const shouldLighten = bg.isDark();

  while (t.contrast(background) < minRatio) {
    t = shouldLighten ? t.lighten(0.05) : t.darken(0.05);
  }
  return t.toHex();
}
```

### No New Component

Add palette section directly in ThemeEditor (~25 lines):

```typescript
// In components/theme-editor.tsx

const palettes = useMemo(() => generatePalettes(accent), [accent]);

// In JSX, above Brand Colors section:
<section className="space-y-3">
  <div className="flex items-center gap-2">
    <div className="w-1 h-4 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
      Quick Palettes
    </h2>
  </div>
  <div className="space-y-2">
    {palettes.map((palette) => (
      <button
        key={palette.name}
        onClick={() => {
          set('background', palette.background);
          set('accent', palette.accent);
          set('text', palette.text);
        }}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex gap-1">
          <div className="w-5 h-5 rounded ring-1 ring-white/10" style={{ backgroundColor: palette.background }} />
          <div className="w-5 h-5 rounded ring-1 ring-white/10" style={{ backgroundColor: palette.accent }} />
          <div className="w-5 h-5 rounded ring-1 ring-white/10" style={{ backgroundColor: palette.text }} />
        </div>
        <span className="text-sm text-zinc-300">{palette.name}</span>
      </button>
    ))}
  </div>
</section>

<div className="section-divider" />
```

### No URL Changes

The existing URL params (`bg`, `accent`, `text`) already capture the applied colors. No need to track which palette was clicked.

### Integration with Existing Features

- **Derived colors**: Continue to auto-derive card/accentHover from brand colors
- **Overrides**: Preserved - palette click only changes brand colors
- **Reset button**: Works as before - returns to defaults

## Acceptance Criteria

- [ ] 3 palettes display above Brand Colors section
- [ ] Each palette shows 3 color swatches (bg, accent, text) in a row
- [ ] Clicking palette applies all 3 colors to brand colors
- [ ] Palettes update when accent color changes
- [ ] All generated text colors have ≥4.5:1 contrast vs their background
- [ ] Palette names display (Light, Bold, Soft)

## Implementation Checklist

- [ ] Add `harmonies` plugin import to `lib/color-utils.ts`
- [ ] Add `Palette` interface to `lib/color-utils.ts`
- [ ] Implement `generatePalettes(accent)` function (~20 lines)
- [ ] Implement `ensureContrast()` helper (~10 lines)
- [ ] Add Quick Palettes section to `theme-editor.tsx` (~25 lines)
- [ ] Test with various accent colors
- [ ] Verify contrast accessibility

## File Changes Summary

| File | Changes |
|------|---------|
| `lib/color-utils.ts` | +35 lines: harmonies plugin, `Palette` type, `generatePalettes()`, `ensureContrast()` |
| `components/theme-editor.tsx` | +25 lines: Quick Palettes section |

**Total: ~60 lines of new code**

## Design Notes

### Palette Row Layout

```
┌───────────────────────────────────────┐
│ [bg][ac][tx]  Light                   │
│ [bg][ac][tx]  Bold                    │
│ [bg][ac][tx]  Soft                    │
└───────────────────────────────────────┘
```

- 3 color swatches (20x20px each) in a tight group
- Palette name to the right
- Full row clickable with hover state
- No selection indicator (stateless)

## What Was Cut (Per Review Feedback)

| Removed | Reason |
|---------|--------|
| 6 palettes → 3 | Users don't need a color theory lesson |
| `keyColor` state | Current accent serves this purpose |
| `selectedPaletteIndex` state | Palettes are one-shot suggestions |
| "Modified" indicator | Adds complexity for no user value |
| URL params `key`/`pi` | Colors already persisted in URL |
| Debouncing | Palette generation is trivially fast |
| Separate component file | ~50 lines doesn't need its own file |

## References

- **Colord harmonies plugin**: `/node_modules/colord/plugins/harmonies.d.ts`
- **Current color utils**: `/lib/color-utils.ts:9-26`
- **Section styling**: `/components/theme-editor.tsx:194-220`
