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
