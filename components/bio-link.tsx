'use client';

import { useThemeStore, type ButtonStyle } from '@/lib/theme-store';

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
