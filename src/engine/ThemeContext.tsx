import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type ThemeId, DEFAULT_THEME } from './themes';

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

const THEME_STORAGE_KEY = 'coderobot_theme_v1';

function loadThemeFromStorage(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const validThemes: ThemeId[] = ['fresh', 'cyberpunk', 'retro', 'minimal'];
      if (validThemes.includes(stored as ThemeId)) {
        return stored as ThemeId;
      }
    }
  } catch {}
  return DEFAULT_THEME;
}

function saveThemeToStorage(theme: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

function applyThemeToDOM(theme: ThemeId): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(loadThemeFromStorage);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
    saveThemeToStorage(newTheme);
    applyThemeToDOM(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
