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
