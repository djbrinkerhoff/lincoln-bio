import { ThemeEditor } from '@/components/theme-editor';
import { BioPreview } from '@/components/bio-preview';

export default function Home() {
  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r flex-shrink-0">
        <ThemeEditor />
      </aside>
      <main className="flex-1">
        <BioPreview />
      </main>
    </div>
  );
}
