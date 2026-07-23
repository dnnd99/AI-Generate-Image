import React, { useState, useEffect } from 'react';
import { GeneratedIcon, VisualStyle, Resolution, LayoutMode } from './types';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { ZoomModal } from './components/ZoomModal';
import { MetadataModal } from './components/MetadataModal';
import { GuideModal } from './components/GuideModal';

const LOCAL_STORAGE_KEY = 'icon_studio_ai_collection_v1';

export default function App() {
  const [promptText, setPromptText] = useState<string>(
    'Aplikasi Dompet Digital & Transaksi QR Code\nKeranjang Belanja Supermarket & Diskon'
  );
  const [resolution, setResolution] = useState<Resolution>('2K');
  const [layout, setLayout] = useState<LayoutMode>('single');
  const [style, setStyle] = useState<VisualStyle>('flat');
  const [autoDownload, setAutoDownload] = useState<boolean>(false);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  const [icons, setIcons] = useState<GeneratedIcon[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load icons from local storage', e);
    }
    return [];
  });

  const [zoomIcon, setZoomIcon] = useState<GeneratedIcon | null>(null);
  const [metadataIcon, setMetadataIcon] = useState<GeneratedIcon | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(icons));
    } catch (e) {
      console.warn('Failed to save icons to local storage', e);
    }
  }, [icons]);

  // Helper to trigger client file download
  const triggerDownload = (icon: GeneratedIcon) => {
    try {
      const cleanPrompt = icon.prompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
      const filename = `icon-studio-${cleanPrompt}-${icon.style}-${icon.resolution}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = icon.imageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to trigger file download:', err);
    }
  };

  // Generation Handler
  const handleGenerate = async () => {
    const rawLines = promptText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length === 0) return;

    setIsGenerating(true);
    setBatchProgress({ current: 0, total: rawLines.length });

    const generatedBatch: GeneratedIcon[] = [];

    for (let i = 0; i < rawLines.length; i++) {
      const linePrompt = rawLines[i];
      setBatchProgress({ current: i + 1, total: rawLines.length });

      try {
        const response = await fetch('/api/generate-icon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: linePrompt,
            style,
            layout,
            resolution,
          }),
        });

        const data = await response.json();

        if (data.success && data.imageUrl) {
          const newIcon: GeneratedIcon = {
            id: `icon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            prompt: linePrompt,
            fullPrompt: data.fullPrompt || linePrompt,
            style,
            layout,
            resolution,
            imageUrl: data.imageUrl,
            createdAt: Date.now(),
          };

          generatedBatch.push(newIcon);

          // Update icons state immediately
          setIcons(prev => [newIcon, ...prev]);

          // Trigger Auto Download if toggled ON
          if (autoDownload) {
            triggerDownload(newIcon);
          }
        } else {
          console.error('Generation response error:', data.error);
        }
      } catch (err) {
        console.error('Failed to generate icon for prompt:', linePrompt, err);
      }
    }

    setIsGenerating(false);
    setBatchProgress(null);
  };

  const handleDeleteIcon = (id: string) => {
    setIcons(prev => prev.filter(i => i.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua koleksi ikon?')) {
      setIcons([]);
    }
  };

  const handleSampleSelect = (samplePrompt: string) => {
    setPromptText(samplePrompt);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Header Bar */}
      <Header 
        totalGenerated={icons.length} 
        onOpenGuide={() => setIsGuideOpen(true)} 
      />

      {/* Main Studio Workspace Split (Left & Right Panels) */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Control Form & Settings */}
        <LeftPanel
          promptText={promptText}
          setPromptText={setPromptText}
          resolution={resolution}
          setResolution={setResolution}
          layout={layout}
          setLayout={setLayout}
          style={style}
          setStyle={setStyle}
          autoDownload={autoDownload}
          setAutoDownload={setAutoDownload}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          batchProgress={batchProgress}
        />

        {/* Right Panel: Results Grid Collection */}
        <RightPanel
          icons={icons}
          onZoom={(icon) => setZoomIcon(icon)}
          onOpenMetadata={(icon) => setMetadataIcon(icon)}
          onDelete={handleDeleteIcon}
          onClearAll={handleClearAll}
          onDownload={triggerDownload}
          onSampleSelect={handleSampleSelect}
        />

      </main>

      {/* Modals */}
      <ZoomModal
        icon={zoomIcon}
        onClose={() => setZoomIcon(null)}
        onDownload={triggerDownload}
        onOpenMetadata={(icon) => {
          setZoomIcon(null);
          setMetadataIcon(icon);
        }}
      />

      <MetadataModal
        icon={metadataIcon}
        onClose={() => setMetadataIcon(null)}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
