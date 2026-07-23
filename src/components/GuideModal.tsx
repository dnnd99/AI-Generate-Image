import React from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Panduan Sukses Microstock Icon Studio</h3>
              <p className="text-xs text-zinc-400">Tips memproduksi & menjual ikon AI di Shutterstock & Adobe Stock</p>
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
        <div className="p-6 overflow-y-auto space-y-5 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-zinc-950 border border-lime-400/30 space-y-2">
            <h4 className="font-bold text-lime-400 flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4" /> Mengapa Niche Ikon Vektor Sangat Laris?
            </h4>
            <p className="text-zinc-300 text-xs">
              Ikon vektor dibutuhkan jutaan desainer UI/UX, pengembang aplikasi, dan pemasar digital setiap hari. Mengunggah set ikon yang konsisten secara rutin dapat memberikan passive income jangka panjang.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-lime-400" /> Fitur Utama Icon Studio AI:
            </h4>

            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-white">Batch Mode (1 Baris = 1 Ikon):</strong> Masukkan banyak baris prompt di textarea untuk generate puluhan ikon dalam sekali klik.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-white">Pilihan Resolusi 1K - 4K:</strong> Menghasilkan aset jernih berkualitas HD hingga 4096px untuk detail vektor tajam.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-white">5 Gaya Visual Microstock populer:</strong> Outline, Glyph (Silhouette), Flat 2D, Duotone, dan Glossy Jelly Cartoon.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <div>
                  <strong className="text-white">Microstock SEO Tag Generator:</strong> Otomatis menghasilkan judul bahasa Inggris dan 30+ keywords relevan untuk memaksimalkan ranking pencarian di agen stock.
                </div>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-lime-400" /> Tips Submission Microstock:
            </h4>
            <p className="text-xs text-zinc-400">
              Saat submit di Adobe Stock atau Freepik, pastikan menandai opsi "Generative AI" jika diperlukan. Gunakan tombol "Tags SEO" pada setiap ikon untuk mendapatkan kata kunci yang siap disalin secara langsung!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-black uppercase transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
          >
            Paham & Mulai Generate
          </button>
        </div>
      </div>
    </div>
  );
};

