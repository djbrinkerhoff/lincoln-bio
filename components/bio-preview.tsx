'use client';

import { BioLink } from './bio-link';

const mockProfile = {
  name: 'Jane Creator',
  bio: 'Designer & Developer',
  avatar: null,
};

const mockLinks = [
  { id: '1', title: 'My Portfolio', url: '#', icon: 'globe' },
  { id: '2', title: 'Twitter', url: '#', icon: 'twitter' },
  { id: '3', title: 'Newsletter', url: '#', icon: 'mail' },
  { id: '4', title: 'YouTube', url: '#', icon: 'play' },
];

function LinkIcon({ type }: { type: string }) {
  switch (type) {
    case 'globe':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'mail':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'play':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      );
    default:
      return null;
  }
}

export function BioPreview() {
  return (
    <div className="h-full preview-bg flex items-center justify-center p-8">
      {/* Phone mockup */}
      <div className="phone-frame">
        <div className="phone-screen w-[320px] h-[640px] relative">
          {/* Notch */}
          <div className="phone-notch" />

          {/* Screen content */}
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{ backgroundColor: 'var(--color-background)' }}
          >
            <div className="pt-14 pb-8 px-6">
              {/* Profile section */}
              <div className="text-center space-y-3 mb-8 animate-fade-in">
                {/* Avatar */}
                <div
                  className="w-24 h-24 mx-auto rounded-full ring-4 ring-white/10 shadow-xl animate-fade-in"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 opacity-30"
                      style={{ color: 'var(--color-text)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* Name */}
                <h1
                  className="text-xl font-semibold tracking-tight animate-fade-in animate-fade-in-delay-1"
                  style={{ color: 'var(--color-text)' }}
                >
                  {mockProfile.name}
                </h1>

                {/* Bio */}
                <p
                  className="text-sm opacity-60 animate-fade-in animate-fade-in-delay-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {mockProfile.bio}
                </p>
              </div>

              {/* Links */}
              <div className="space-y-3">
                {mockLinks.map((link, index) => (
                  <div
                    key={link.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0 }}
                  >
                    <BioLink title={link.title} url={link.url} icon={<LinkIcon type={link.icon} />} />
                  </div>
                ))}
              </div>

              {/* Footer branding */}
              <div className="mt-12 text-center">
                <p
                  className="text-[10px] uppercase tracking-widest opacity-30"
                  style={{ color: 'var(--color-text)' }}
                >
                  Powered by Lincoln
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
