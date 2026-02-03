export type BlockType = 'text' | 'image' | 'button' | 'spacer' | 'divider' | 'social';

export interface BlockStyle {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  fontSize?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  fontWeight?: string;
}

export interface BlockContent {
  text?: string;
  src?: string;
  alt?: string;
  url?: string;
  label?: string;
  height?: string;
  socialNetworks?: { platform: string; url: string }[];
}

export interface EmailBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
}

export interface EmailTemplate {
  id: string;
  name: string;
  blocks: EmailBlock[];
  previewText: string;
  lastModified: number;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW'
}
