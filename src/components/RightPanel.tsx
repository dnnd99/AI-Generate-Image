import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { IconCard } from './IconCard';
import { 
  Sparkles, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Grid2X2, 
  Wand2
} from 'lucide-react';
import JSZip from 'jszip';

interface RightPanelProps {
  icons: GeneratedIcon[];
  onZoom: (icon: GeneratedIcon) => void;
  onOpenMetadata: (icon: GeneratedIcon) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onDownload: (icon: GeneratedIcon) => void;
  onSampleSelect: (prompt: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  icons,
  onZoom,
  onOpenMetadata,
  onDelete,
  onClearAll,
  onDownload,
  onSampleSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');
  const [isZipping, setIsZipping] = useState(false);

  // Filter icons
  const filteredIcons = icons.filter((icon) => {
    const matchesQuery = icon.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = selectedStyleFilter === 'all' || icon.style === selectedStyleFilter;
    return matchesQuery && matchesStyle;
  });

  // Download all as ZIP
  const handleDownloadZip = async () => {
    if (icons.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("icon-studio-assets");

      for (let i = 0; i < icons.length; i++) {
        const item = icons[i];
        const cleanName = item.prompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
        const fileName = `${i + 1}-${cleanName}-${item.style}-${item.resolution}.png`;

        if (item.imageUrl.startsWith('data:image')) {
          const base64Data = item.imageUrl.split(',')[1];
          folder?.file(fileName, base64Data, { base64: true });
        } else {
          // fetch blob
          const res = await fetch(item.imageUrl);
          const blob = await res.blob();
          folder?.file(fileName, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `icon-studio-batch-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const samplePrompts = [
    'Aplikasi Dompet Digital & Transaksi QR Code',
    'Gembok Keamanan Cyber & Biometrik Sidik Jari',
    'Keranjang Belanja Supermarket Diskon',
    'Grafik Pertumbuhan Penjualan & Saham'
  ];

  return (
    <main className="flex-1 bg-zinc-950 p-5 lg:p-8 overflow-y-auto flex flex-col min-h-[calc(100vh-65px)] relative">
      {/* Grid Overlay Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      {/* Top Action Toolbar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            <Grid2X2 className="w-5 h-5 text-lime-400" />
            KOLEKSI HASIL GENERATE ({icons.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hasil generasi ikon resolusi tinggi siap diunduh & dipublikasi ke microstock
          </p>
        </div>

        {icons.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(163,230,53,0.25)]"
            >
              {isZipping ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>{isZipping ? 'MEMBUAT ZIP...' : 'DOWNLOAD ALL (ZIP)'}</span>
            </button>

            <button
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Hapus Semua Koleksi"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kosongkan</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar (When items exist) */}
      {icons.length > 0 && (
        <div className="relative z-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari prompt ikon..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-lime-400/50"
            />
          </div>

          {/* Style Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            <span className="text-[11px] text-zinc-500 mr-1 flex items-center gap-1 uppercase font-bold">
              <Filter className="w-3 h-3 text-lime-400" /> Filter:
            </span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'outline', label: 'Outline' },
              { id: 'glyph', label: 'Glyph' },
              { id: 'flat', label: 'Flat 2D' },
              { id: 'duotone', label: 'Duotone' },
              { id: 'glossy_jelly', label: 'Glossy' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedStyleFilter(f.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-all ${
                  selectedStyleFilter === f.id
                    ? 'bg-zinc-800 text-lime-400 border border-lime-400/40 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {icons.length === 0 ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center mb-6">
            <Wand2 className="w-10 h-10 text-zinc-600" />
          </div>

          <h3 className="text-lg font-bold text-zinc-200 mb-2 tracking-tight">Ready to generate</h3>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
            Enter a prompt and select a visual style on the left panel to start creating microstock quality vector icons.
          </p>

          {/* Prompt Suggestions */}
          <div className="w-full max-w-lg space-y-2">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block mb-3">
              Try clicking a quick prompt:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {samplePrompts.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => onSampleSelect(sample)}
                  className="p-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-lime-400/40 rounded-xl text-xs text-zinc-300 hover:text-white transition-all text-left flex items-center justify-between group shadow-sm"
                >
                  <span className="truncate pr-2">{sample}</span>
                  <Sparkles className="w-3.5 h-3.5 text-lime-400 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : filteredIcons.length === 0 ? (
        /* NO FILTER MATCH */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-400 text-sm">Tidak ada ikon yang sesuai dengan pencarian atau filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedStyleFilter('all'); }}
            className="mt-3 px-4 py-2 bg-zinc-900 text-lime-400 rounded-xl text-xs font-semibold border border-zinc-800 hover:border-lime-400/50"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        /* GRID OF GENERATED ICONS */
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 pt-2 pb-20">
          {filteredIcons.map((item) => (
            <IconCard
              key={item.id}
              icon={item}
              onZoom={onZoom}
              onOpenMetadata={onOpenMetadata}
              onDelete={onDelete}
              onDownload={onDownload}
            />
          ))}
        </div>
      )}

      {/* Floating Quick Bar */}
      <div className="fixed bottom-6 right-8 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-6 py-2.5 rounded-2xl flex gap-6 items-center z-20 shadow-2xl">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Queue</span>
          <span className="text-xs font-mono text-zinc-200">{icons.length} Generated</span>
        </div>
        <div className="h-6 w-px bg-zinc-800" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Engine</span>
          <span className="text-xs font-mono text-lime-400">Gemini 3.1 Flash</span>
        </div>
        <div className="h-6 w-px bg-zinc-800" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">System Online</span>
        </div>
      </div>

    </main>
  );
};

