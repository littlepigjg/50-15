import React, { useState } from 'react';
import { useTheme } from '../engine/ThemeContext';
import { THEMES, type ThemeId } from '../engine/themes';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary !py-2 !px-3 flex items-center gap-2"
        title="切换主题"
      >
        <span>{currentTheme.icon}</span>
        <span className="text-sm">{currentTheme.name}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 game-card p-3 w-72 animate-pop">
            <h3 className="text-sm font-bold text-themed-text mb-3 px-1">🎨 选择主题</h3>
            <div className="space-y-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all
                    ${theme === t.id
                      ? 'bg-primary-500/15 ring-2 ring-primary-500/50'
                      : 'bg-themed-surface-alt hover:bg-themed-surface-hover'
                    }
                  `}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${t.preview.bg} 0%, ${t.preview.primary} 100%)`,
                      boxShadow: theme === t.id
                        ? `0 0 12px ${t.preview.primary}40`
                        : undefined,
                    }}
                  >
                    {t.icon}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className={`text-sm font-bold ${theme === t.id ? 'text-primary-500' : 'text-themed-text'}`}>
                      {t.name}
                      {theme === t.id && (
                        <span className="ml-2 text-xs text-primary-500">✓ 当前</span>
                      )}
                    </div>
                    <div className="text-xs text-themed-text-secondary truncate">
                      {t.description}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border border-themed-border"
                      style={{ backgroundColor: t.preview.bg }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-themed-border"
                      style={{ backgroundColor: t.preview.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-themed-border"
                      style={{ backgroundColor: t.preview.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
