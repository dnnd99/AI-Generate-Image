import React, { useState, useEffect } from 'react';
import { GeneratedIcon } from '../types';
import { X, Tag, Copy, Check, Sparkles, Folder, RefreshCw } from 'lucide-react';

interface MetadataModalProps {
  icon: GeneratedIcon | null;
  onClose: () => void;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({ icon, onClose }) => {
  if (!icon) return null;

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(icon.metadata?.title || '');
  const [category, setCategory] = useState(icon.metadata?.category || '');
  const [tags, setTags] = useState<string[]>(icon.metadata?.tags || []);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const fetchMetadata = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: icon.prompt, style: icon.style }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.category) setCategory(data.category);
      if (Array.isArray(data.tags)) setTags(data.tags);
    } catch (err) {
      console.error('Failed to generate metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!icon.metadata?.tags || icon.metadata.tags.length === 0) {
      fetchMetadata();
    }
  }, [icon]);

  const handleCopyTagsOnly = () => {
    navigator.clipboard.writeText(tags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopyAllFormat = () => {
    const formatted = `TITLE:\n${title}\n\nCATEGORY:\n${category}\n\nKEYWORDS / TAGS:\n${tags.join(', ')}`;
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-zinc-800 text-lime-400 border border-lime-400/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Microstock SEO Keywords & Tags</h3>
              <p className="text-xs text-zinc-400">Siap submit ke Shutterstock, Adobe Stock & Freepik</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-lime-400 font-medium">Membuat SEO Keywords & Title dengan AI...</p>
            </div>
          ) : (
            <>
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" /> Stock Title (English)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 font-sans focus:outline-none focus:border-lime-400/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-lime-400" /> Stock Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 font-sans focus:outline-none focus:border-lime-400/50"
                />
              </div>

              {/* Tags Cloud */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-lime-400" /> Keywords ({tags.length} Tags)
                  </label>
                  <button
                    onClick={fetchMetadata}
                    className="text-[11px] text-zinc-400 hover:text-lime-400 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 max-h-48 overflow-y-auto flex flex-wrap gap-1.5">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-lime-400 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between space-x-3">
          <button
            onClick={handleCopyTagsOnly}
            disabled={loading || tags.length === 0}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {copiedTags ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
            <span>{copiedTags ? 'Tags Tersalin!' : 'Salin Tags Koma (CSV)'}</span>
          </button>

          <button
            onClick={handleCopyAllFormat}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] disabled:opacity-50"
          >
            {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedAll ? 'Semua Format Tersalin!' : 'Salin Format Lengkap'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

