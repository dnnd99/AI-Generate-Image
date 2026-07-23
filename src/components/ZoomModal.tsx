import React, { useState } from 'react';
import { GeneratedIcon } from '../types';
import { X, Download, Copy, Check, Sparkles, Tag, Eye } from 'lucide-react';

interface ZoomModalProps {
  icon: GeneratedIcon | null;
  onClose: () => void;
  onDownload: (icon: GeneratedIcon) => void;
  onOpenMetadata: (icon: GeneratedIcon) => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({
  icon,
  onClose,
  onDownload,
  onOpenMetadata
}) => {
  if (!icon) return null;

  const [bgColor, setBgColor] = useState<'white' | 'dark' | 'grid'>('grid');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(icon.fullPrompt || icon.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-zinc-800 text-lime-400 border border-lime-400/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base capitalize">{icon.prompt}</h3>
              <p className="text-xs text-zinc-400">Preview High-Resolution Vector Asset ({icon.resolution})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Background Toggle Controls */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Latar Belakang Test Vector:</span>
            <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setBgColor('grid')}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  bgColor === 'grid' ? 'bg-zinc-800 text-lime-400 border border-lime-400/40' : 'text-zinc-400'
                }`}
              >
                Transparan Grid
              </button>
              <button
                onClick={() => setBgColor('white')}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  bgColor === 'white' ? 'bg-zinc-800 text-lime-400 border border-lime-400/40' : 'text-zinc-400'
                }`}
              >
                Putih Bersih
              </button>
              <button
                onClick={() => setBgColor('dark')}
                className={`px-3 py-1 rounded-lg transition-all font-medium ${
                  bgColor === 'dark' ? 'bg-zinc-800 text-lime-400 border border-lime-400/40' : 'text-zinc-400'
                }`}
              >
                Dark Canvas
              </button>
            </div>
          </div>

          {/* Large Image Box */}
          <div className={`w-full aspect-square max-h-[460px] rounded-2xl flex items-center justify-center p-8 transition-colors ${
            bgColor === 'grid' 
              ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-100'
              : bgColor === 'white' ? 'bg-white' : 'bg-zinc-950 border border-zinc-800'
          }`}>
            <img
              src={icon.imageUrl}
              alt={icon.prompt}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain filter drop-shadow-md"
            />
          </div>

          {/* Details Box */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" /> Full Prompt String:
              </span>
              <button
                onClick={handleCopyPrompt}
                className="text-xs text-lime-400 hover:text-lime-300 flex items-center gap-1 font-medium"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt'}</span>
              </button>
            </div>
            <p className="text-xs text-zinc-400 font-mono bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 leading-relaxed">
              {icon.fullPrompt || icon.prompt}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <button
            onClick={() => { onClose(); onOpenMetadata(icon); }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Tag className="w-4 h-4 text-lime-400" />
            <span>Generate Microstock Metadata</span>
          </button>

          <button
            onClick={() => onDownload(icon)}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};

