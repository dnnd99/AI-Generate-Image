import React, { useState } from 'react';
import { VisualStyle, Resolution, LayoutMode } from '../types';
import { PROMPT_SHORTCUTS } from '../data/shortcuts';
import { 
  Wand2, 
  Download, 
  Grid2X2, 
  Square, 
  Sparkles, 
  Check, 
  FileText,
  RotateCcw
} from 'lucide-react';

interface LeftPanelProps {
  promptText: string;
  setPromptText: (val: string) => void;
  resolution: Resolution;
  setResolution: (val: Resolution) => void;
  layout: LayoutMode;
  setLayout: (val: LayoutMode) => void;
  style: VisualStyle;
  setStyle: (val: VisualStyle) => void;
  autoDownload: boolean;
  setAutoDownload: (val: boolean) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  batchProgress?: { current: number; total: number } | null;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  promptText,
  setPromptText,
  resolution,
  setResolution,
  layout,
  setLayout,
  style,
  setStyle,
  autoDownload,
  setAutoDownload,
  onGenerate,
  isGenerating,
  batchProgress
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(PROMPT_SHORTCUTS[0].category);

  // Parse prompts count based on non-empty lines
  const lines = promptText.split('\n').filter(l => l.trim().length > 0);
  const promptCount = lines.length || 1;

  const handleShortcutClick = (shortcutPrompt: string) => {
    if (!promptText.trim()) {
      setPromptText(shortcutPrompt);
    } else {
      setPromptText(`${promptText.trim()}\n${shortcutPrompt}`);
    }
  };

  const handleClearPrompt = () => {
    setPromptText('');
  };

  const visualStyles: { id: VisualStyle; name: string; desc: string; icon: string }[] = [
    {
      id: 'outline',
      name: 'Outline (Minimalist)',
      desc: 'Line art stroke minimalist, garis bersih uniform',
      icon: '🖊️'
    },
    {
      id: 'glyph',
      name: 'Glyph (Solid Silhouette)',
      desc: 'Monokrom silhouette padat, bentuk hitam solid',
      icon: '⬛'
    },
    {
      id: 'flat',
      name: 'Flat 2D Vector',
      desc: 'Vektor warna bersih modern, geometri tajam',
      icon: '🎨'
    },
    {
      id: 'duotone',
      name: 'Duotone Accent',
      desc: 'Dua aksen warna kontras hijau neon & dark navy',
      icon: '☯️'
    },
    {
      id: 'glossy_jelly',
      name: 'Glossy Jelly Cartoon',
      desc: 'Efek 3D kartun jelly plastik mengkilap bermuka',
      icon: '🧪'
    },
  ];

  const resolutions: { id: Resolution; label: string; desc: string; isPro?: boolean }[] = [
    { id: '1K', label: '1K', desc: '1024px' },
    { id: '2K', label: '2K', desc: '2048px' },
    { id: '4K', label: '4K', desc: '4096px', isPro: true },
  ];

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-zinc-900/40 border-r border-zinc-800 p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-65px)]">
      
      {/* SECTION 1: PROMPT TEXTAREA */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-lime-400" />
            Batch Prompt Input
          </label>
          <div className="flex items-center gap-2 text-xs">
            {promptText.trim() && (
              <button 
                onClick={handleClearPrompt}
                className="text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-[11px]"
                title="Hapus semua teks"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
            <span className="px-2 py-0.5 rounded bg-zinc-950 text-lime-400 font-mono text-[10px] font-semibold border border-lime-400/30">
              {promptCount} {promptCount > 1 ? 'ITEMS' : 'ITEM'}
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Ketik deskripsi ikon per baris (1 baris = 1 ikon)...&#10;Contoh:&#10;Aplikasi Dompet Digital&#10;Keranjang Belanja Diskon&#10;Gembok Keamanan Sidik Jari"
            rows={4}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-lime-400/60 focus:outline-none rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-600 transition-all resize-y font-sans shadow-inner leading-relaxed"
          />
          <div className="mt-1 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>💡 <strong>Tips:</strong> Multi-baris untuk batch mode otomatis.</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHORTCUT CHIPS / PILLS */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" /> Examples
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PROMPT_SHORTCUTS.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md whitespace-nowrap transition-all uppercase tracking-wider ${
                activeCategory === cat.category
                  ? 'bg-zinc-800 text-lime-400 border border-lime-400/40'
                  : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_SHORTCUTS.find(c => c.category === activeCategory)?.prompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleShortcutClick(item)}
              className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-lime-400/40 rounded-full text-[11px] text-zinc-400 hover:text-white transition-all flex items-center gap-1 group text-left"
            >
              <span className="text-lime-400 font-bold group-hover:scale-110 transition-transform">+</span>
              <span>{item}</span>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3: RESOLUTION (RADIO CARDS) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            Resolution
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">1:1 Square</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {resolutions.map((r) => {
            const isSelected = resolution === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setResolution(r.id)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-zinc-950 border-lime-400/60 shadow-[0_0_12px_rgba(163,230,53,0.12)]'
                    : 'bg-zinc-800/60 border-zinc-700/80 hover:border-zinc-600'
                }`}
              >
                <span className={`text-xs font-bold ${isSelected ? 'text-lime-400' : 'text-zinc-200'}`}>
                  {r.label}
                </span>
                <span className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-lime-400/70' : 'text-zinc-500'}`}>
                  {r.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: LAYOUT CHOICE */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Layout Mode</label>
          <div className="bg-zinc-950 p-1 rounded-lg border border-zinc-800 flex gap-1">
            <button
              type="button"
              onClick={() => setLayout('single')}
              className={`px-3 py-1 text-[10px] font-bold rounded transition-all uppercase tracking-wider ${
                layout === 'single' ? 'bg-zinc-800 text-lime-400 border border-lime-400/30' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`px-3 py-1 text-[10px] font-bold rounded transition-all uppercase tracking-wider ${
                layout === 'grid' ? 'bg-zinc-800 text-lime-400 border border-lime-400/30' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              3x3 Set
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLayout('single')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
              layout === 'single'
                ? 'bg-zinc-950 border-lime-400/60 text-white'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Square className={`w-4 h-4 ${layout === 'single' ? 'text-lime-400' : 'text-zinc-600'}`} />
            <div>
              <div className="text-xs font-bold">Ikon Tunggal</div>
              <div className="text-[10px] text-zinc-500">Aset tunggal terfokus</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
              layout === 'grid'
                ? 'bg-zinc-950 border-lime-400/60 text-white'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Grid2X2 className={`w-4 h-4 ${layout === 'grid' ? 'text-lime-400' : 'text-zinc-600'}`} />
            <div>
              <div className="text-xs font-bold">Grid Set (3x3)</div>
              <div className="text-[10px] text-zinc-500">Koleksi 9 ikon</div>
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 5: VISUAL STYLE (RADIO LIST) */}
      <section className="space-y-2.5">
        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block">
          Visual Style
        </label>

        <div className="space-y-1.5">
          {visualStyles.map((vs) => {
            const isSelected = style === vs.id;
            return (
              <label
                key={vs.id}
                onClick={() => setStyle(vs.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-lime-400/60 text-white shadow-[0_0_10px_rgba(163,230,53,0.08)]'
                    : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{vs.icon}</span>
                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {vs.name}
                    </div>
                    <div className="text-[10px] text-zinc-500">{vs.desc}</div>
                  </div>
                </div>

                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-lime-400 bg-lime-400' : 'border-zinc-700 bg-zinc-900'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: TOGGLE AUTO DOWNLOAD */}
      <section className="pt-2 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Download className={`w-4 h-4 ${autoDownload ? 'text-lime-400' : 'text-zinc-500'}`} />
          <div>
            <div className="text-xs font-semibold text-zinc-200">Auto Download PNG</div>
            <div className="text-[10px] text-zinc-500">Unduh otomatis file setelah hasil selesai</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAutoDownload(!autoDownload)}
          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
            autoDownload ? 'bg-lime-400' : 'bg-zinc-800'
          }`}
        >
          <div
            className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
              autoDownload ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </section>

      {/* SECTION 7: GENERATE BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isGenerating || !promptText.trim()}
          onClick={onGenerate}
          className={`w-full py-4 px-5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all ${
            isGenerating || !promptText.trim()
              ? 'bg-zinc-800 text-zinc-600 border border-zinc-700 cursor-not-allowed'
              : 'bg-lime-400 hover:bg-lime-300 text-black shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.45)] cursor-pointer active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>
                {batchProgress 
                  ? `GENERATING (${batchProgress.current}/${batchProgress.total})...`
                  : 'PROCESSING AI...'}
              </span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 stroke-[2.5]" />
              <span>
                GENERATE {promptCount > 1 ? `${promptCount} ICONS` : 'ICONS NOW'}
              </span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
};

