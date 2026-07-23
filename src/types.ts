export type VisualStyle = 'outline' | 'glyph' | 'flat' | 'duotone' | 'glossy_jelly';

export type Resolution = '1K' | '2K' | '4K';

export type LayoutMode = 'single' | 'grid';

export interface GeneratedIcon {
  id: string;
  prompt: string;
  fullPrompt: string;
  style: VisualStyle;
  layout: LayoutMode;
  resolution: Resolution;
  imageUrl: string;
  createdAt: number;
  metadata?: {
    title: string;
    category: string;
    tags: string[];
  };
}

export interface PromptShortcut {
  category: string;
  prompts: string[];
}
