import React from 'react';
import { Sparkles, Layers, Info, Zap } from 'lucide-react';

interface HeaderProps {
  totalGenerated: number;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ totalGenerated, onOpenGuide }) => {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-lime-400 text-black flex items-center justify-center font-black shadow-[0_0_15px_rgba(163,230,53,0.3)]">
          <Layers className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-lg lg:text-xl tracking-tight text-white flex items-center gap-2">
              ICON STUDIO <span className="text-lime-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-lime-400 border border-lime-400/40 tracking-wider">
              Microstock Edition
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Generator Ikon Vektor High-Resolution untuk Shutterstock, Adobe Stock & Freepik
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-zinc-300">
          <Zap className="w-3.5 h-3.5 text-lime-400" />
          <span>Engine: <strong className="text-lime-400 font-medium">Gemini 3.1 Flash Image</strong></span>
        </div>

        <div className="flex items-center space-x-1.5 bg-zinc-900 border border-lime-400/30 px-3 py-1.5 rounded-lg text-xs text-lime-400 font-semibold font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{totalGenerated} Ikon</span>
        </div>

        <button
          onClick={onOpenGuide}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
          title="Panduan penggunaan & Microstock SEO"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

