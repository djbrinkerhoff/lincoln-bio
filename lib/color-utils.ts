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
