import { ThemeEditor } from '@/components/theme-editor';
import { BioPreview } from '@/components/bio-preview';

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0a0a0b]">
      {/* Editor Panel */}
      <aside className="w-[360px] border-r border-zinc-800/50 flex-shrink-0 shadow-2xl shadow-black/50 z-10">
        <ThemeEditor />
      </aside>

      {/* Preview Area */}
      <main className="flex-1 relative overflow-hidden">
        <BioPreview />

        {/* Ambient glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </main>
    </div>
  );
}
