'use client';

import { useThemeStore, type ButtonStyle } from '@/lib/theme-store';
import { ReactNode } from 'react';

const BUTTON_STYLES: Record<ButtonStyle, React.CSSProperties> = {
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
};

interface BioLinkProps {
  title: string;
  url: string;
  icon?: ReactNode;
}

export function BioLink({ title, url, icon }: BioLinkProps) {
  const buttonStyle = useThemeStore((s) => s.buttonStyle);

  return (
    <a
      href={url}
      className={`bio-link-${buttonStyle} group relative block w-full py-3.5 px-4 text-center font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
      style={{
        ...BUTTON_STYLES[buttonStyle],
        borderRadius: 'var(--button-radius)',
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
        {title}
      </span>
    </a>
  );
}
