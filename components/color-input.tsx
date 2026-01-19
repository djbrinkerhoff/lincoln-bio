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
