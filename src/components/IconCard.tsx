import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { 
  Download, 
  Maximize2, 
  Tag, 
  Copy, 
  Trash2, 
  Check, 
  Sparkles
} from 'lucide-react';

interface IconCardProps {
  icon: GeneratedIcon;
  onZoom: (icon: GeneratedIcon) => void;
  onOpenMetadata: (icon: GeneratedIcon) => void;
  onDelete: (id: string) => void;
  onDownload: (icon: GeneratedIcon) => void;
}

export const IconCard: React.FC<IconCardProps> = ({
  icon,
  onZoom,
  onOpenMetadata,
  onDelete,
  onDownload
}) => {
  const [copied, setCopied] = useState(false);
  const [bgChecker, setBgChecker] = useState(true);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(icon.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styleNames: Record<string, string> = {
    outline: 'Outline',
    glyph: 'Glyph',
    flat: 'Flat 2D',
    duotone: 'Duotone',
    glossy_jelly: 'Glossy Jelly'
  };

  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-lime-400/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-lime-400/5">
      
      {/* Top Bar inside Card */}
      <div className="px-3.5 py-2.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 font-medium text-zinc-300 truncate max-w-[70%]">
          <Sparkles className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
          <span className="truncate" title={icon.prompt}>{icon.prompt}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setBgChecker(!bgChecker)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
              bgChecker ? 'bg-zinc-800 text-lime-400' : 'bg-zinc-950 text-zinc-400'
            }`}
            title="Toggle Latar Belakang Transparan / Putih"
          >
            {bgChecker ? 'Grid' : 'Putih'}
          </button>
        </div>
      </div>

      {/* Image Preview Area */}
      <div 
        className={`relative aspect-square w-full flex items-center justify-center p-6 overflow-hidden cursor-pointer ${
          bgChecker 
            ? 'bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] bg-white' 
            : 'bg-white'
        }`}
        onClick={() => onZoom(icon)}
      >
        <img
          src={icon.imageUrl}
          alt={icon.prompt}
          referrerPolicy="no-referrer"
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onZoom(icon); }}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:text-lime-400 hover:border-lime-400 transition-all shadow-lg"
            title="Perbesar Preview (Zoom)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(icon); }}
            className="p-2.5 rounded-xl bg-lime-400 text-black font-extrabold hover:bg-lime-300 transition-all shadow-lg"
            title="Download PNG File"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-zinc-900/90 text-lime-400 backdrop-blur-md border border-lime-400/30 shadow-sm">
            {styleNames[icon.style] || icon.style}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900/90 text-zinc-300 backdrop-blur-md border border-zinc-700/60 shadow-sm">
            {icon.resolution}
          </span>
          {icon.layout === 'grid' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-900/90 text-lime-300 backdrop-blur-md border border-lime-400/50 shadow-sm">
              3x3 Set
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Action Bar */}
      <div className="p-3 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-xs space-x-2">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onOpenMetadata(icon)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-lime-400 border border-lime-400/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            title="Generate Microstock SEO Title & Tags"
          >
            <Tag className="w-3 h-3" />
            <span>Tags SEO</span>
          </button>

          <button
            onClick={handleCopyPrompt}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title="Salin Prompt Teks"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onDownload(icon)}
            className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black font-black uppercase text-[11px] flex items-center gap-1 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>PNG</span>
          </button>

          <button
            onClick={() => onDelete(icon.id)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900 transition-colors"
            title="Hapus Ikon Ini"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

