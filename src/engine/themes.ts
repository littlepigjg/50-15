export type ThemeId = 'fresh' | 'cyberpunk' | 'retro' | 'minimal';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  preview: { bg: string; primary: string; accent: string };
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'fresh',
    name: '清新',
    description: '明亮柔和的渐变色调，轻松愉悦',
    icon: '🌿',
    preview: { bg: '#667eea', primary: '#3b82f6', accent: '#8b5cf6' },
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '霓虹灯光与暗色未来科技感',
    icon: '🌆',
    preview: { bg: '#0f0c29', primary: '#00f0ff', accent: '#ff0080' },
  },
  {
    id: 'retro',
    name: '复古像素',
    description: '温暖复古的像素游戏风格',
    icon: '👾',
    preview: { bg: '#8b6914', primary: '#e8a020', accent: '#c0392b' },
  },
  {
    id: 'minimal',
    name: '极简黑白',
    description: '纯粹的黑白灰，极简设计',
    icon: '◼️',
    preview: { bg: '#f5f5f5', primary: '#222222', accent: '#666666' },
  },
];

export const DEFAULT_THEME: ThemeId = 'fresh';
