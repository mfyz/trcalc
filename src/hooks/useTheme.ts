import { useEffect, useState, useCallback } from 'react';
import { Theme, Settings, DEFAULT_SETTINGS, STORAGE_KEYS } from '@/types';

function getThemeFromStorage(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    if (stored) {
      const settings: Settings = JSON.parse(stored);
      return settings.theme || 'system';
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS.theme;
}

export function useTheme() {
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const updateTheme = useCallback(() => {
    const theme = getThemeFromStorage();
    let isDark = false;

    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setResolvedTheme(isDark ? 'dark' : 'light');

    const bgColor = isDark ? '#111827' : '#f9fafb';

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update background colors for iOS safe area
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;

    // Update theme-color meta tag for browser chrome
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', bgColor);
    }
  }, []);

  useEffect(() => {
    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => updateTheme();
    mediaQuery.addEventListener('change', handleMediaChange);

    // Listen for storage changes (from other tabs or when settings change)
    const handleStorageChange = () => updateTheme();
    window.addEventListener('storage', handleStorageChange);

    // Also poll for changes since storage event doesn't fire in same tab
    const interval = setInterval(updateTheme, 100);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [updateTheme]);

  return resolvedTheme;
}
