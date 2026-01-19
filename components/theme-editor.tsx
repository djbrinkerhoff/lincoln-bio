'use client';

import { useState } from 'react';
import { useThemeStore, useDerivedColors, useLiveTheme, useUrlSync } from '@/lib/theme-store';
import { ColorInput } from './color-input';

export function ThemeEditor() {
  useLiveTheme();
  useUrlSync();
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0b]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Theme Studio</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Craft your brand identity</p>
          </div>
          <button
            onClick={reset}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800/50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto editor-scroll px-6 py-6 space-y-8">
        {/* Brand Colors */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Brand Colors
            </h2>
          </div>
          <div className="space-y-2">
            <ColorInput
              label="Background"
              value={background}
              onChange={(v) => set('background', v)}
            />
            <ColorInput
              label="Primary"
              value={accent}
              onChange={(v) => set('accent', v)}
            />
            <ColorInput
              label="Text"
              value={text}
              onChange={(v) => set('text', v)}
              contrastAgainst={background}
            />
          </div>
        </section>

        <div className="section-divider" />

        {/* Derived Colors */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Derived Colors
            </h2>
          </div>
          <div className="space-y-3">
            {/* Card */}
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-lg ring-1 ring-white/10"
                  style={{ backgroundColor: background }}
                />
                <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div
                  className="w-6 h-6 rounded-lg ring-1 ring-white/10"
                  style={{ backgroundColor: overrides.card ?? derived.card }}
                />
                <span className="text-sm text-zinc-300 ml-1">Card</span>
              </div>
              {overrides.card ? (
                <button
                  onClick={() => setOverride('card', null)}
                  className="text-[10px] font-medium text-violet-400 hover:text-violet-300 px-2 py-1 rounded-md hover:bg-violet-500/10 transition-colors"
                >
                  Relink
                </button>
              ) : (
                <button
                  onClick={() => setOverride('card', derived.card)}
                  className="text-[10px] font-medium text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Unlink
                </button>
              )}
            </div>

            {/* Hover */}
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-lg ring-1 ring-white/10"
                  style={{ backgroundColor: accent }}
                />
                <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <div
                  className="w-6 h-6 rounded-lg ring-1 ring-white/10"
                  style={{ backgroundColor: overrides.accentHover ?? derived.accentHover }}
                />
                <span className="text-sm text-zinc-300 ml-1">Hover</span>
              </div>
              {overrides.accentHover ? (
                <button
                  onClick={() => setOverride('accentHover', null)}
                  className="text-[10px] font-medium text-violet-400 hover:text-violet-300 px-2 py-1 rounded-md hover:bg-violet-500/10 transition-colors"
                >
                  Relink
                </button>
              ) : (
                <button
                  onClick={() => setOverride('accentHover', derived.accentHover)}
                  className="text-[10px] font-medium text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors"
                >
                  Unlink
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Button Style */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Button Style
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['filled', 'outline', 'soft'] as const).map((style) => (
              <button
                key={style}
                onClick={() => set('buttonStyle', style)}
                className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                  buttonStyle === style
                    ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Corner Radius
            </h2>
          </div>
          <div className="flex gap-1.5">
            {(['none', 'sm', 'md', 'lg', 'full'] as const).map((radius) => (
              <button
                key={radius}
                onClick={() => set('borderRadius', radius)}
                className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg border transition-all ${
                  borderRadius === radius
                    ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {radius === 'none' ? '0' : radius === 'full' ? '∞' : radius.toUpperCase()}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800/50">
        <button
          onClick={handleCopy}
          className="btn-editor w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Theme
            </>
          )}
        </button>
      </div>
    </div>
  );
}
