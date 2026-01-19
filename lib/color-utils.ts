import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import mixPlugin from 'colord/plugins/mix';

extend([a11yPlugin, mixPlugin]);

export type DerivedColorKey = 'card' | 'accentHover';

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

// Palette generation
export interface Palette {
  name: string;
  background: string;
  accent: string;
  text: string;
}

function ensureContrast(textColor: string, bgColor: string, minRatio = 4.5): string {
  let text = colord(textColor);
  const bg = colord(bgColor);
  const shouldLighten = bg.isDark();

  let attempts = 0;
  while (text.contrast(bgColor) < minRatio && attempts < 20) {
    text = shouldLighten ? text.lighten(0.05) : text.darken(0.05);
    attempts++;
  }

  // Fallback to black or white if we can't meet contrast
  if (text.contrast(bgColor) < minRatio) {
    return shouldLighten ? '#ffffff' : '#000000';
  }

  return text.toHex();
}

export function generatePalettes(accent: string): Palette[] {
  const key = colord(accent);

  const lightBg = key.lighten(0.45).toHex();
  const softBg = key.desaturate(0.3).lighten(0.4).toHex();

  return [
    {
      name: 'Light',
      background: lightBg,
      accent: accent,
      text: ensureContrast(key.darken(0.4).toHex(), lightBg),
    },
    {
      name: 'Bold',
      background: '#ffffff',
      accent: accent,
      text: ensureContrast(key.rotate(180).darken(0.3).toHex(), '#ffffff'),
    },
    {
      name: 'Soft',
      background: softBg,
      accent: key.rotate(30).toHex(),
      text: ensureContrast(key.rotate(-30).darken(0.35).toHex(), softBg),
    },
  ];
}
