'use client';

import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const contrast = contrastAgainst ? getContrastRatio(value, contrastAgainst) : null;
  const passesAA = contrastAgainst ? isReadable(value, contrastAgainst, 'AA') : null;

  return (
    <div className="space-y-3">
      {/* Header row with swatch */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 group"
      >
        <div
          className="color-swatch w-10 h-10 rounded-xl shadow-lg ring-1 ring-white/10"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-zinc-100">{label}</div>
          <div className="font-mono text-xs text-zinc-500 uppercase tracking-wide">
            {value}
          </div>
        </div>
        {contrast !== null && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500">
              {contrast.toFixed(1)}:1
            </span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                passesAA
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {passesAA ? 'AA' : 'FAIL'}
            </span>
          </div>
        )}
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable picker */}
      {isExpanded && (
        <div className="space-y-3 animate-fade-in">
          <HexColorPicker color={value} onChange={onChange} />
          <div className="relative">
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-100 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 uppercase tracking-wider"
            />
          </div>
        </div>
      )}
    </div>
  );
}
