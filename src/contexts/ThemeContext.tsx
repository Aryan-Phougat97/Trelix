import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'cyber' | 'calm' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeMode;
    return savedTheme || 'cyber';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('theme-cyber', 'theme-calm', 'theme-light');

    // Add new theme class
    root.classList.add(`theme-${theme}`);

    // Store in localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme) return;

    setIsTransitioning(true);
    setThemeState(newTheme);

    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme definitions for preview
export const themeDefinitions = {
  cyber: {
    name: 'Cyber Mode',
    description: 'Black background, neon red & blue accents',
    colors: {
      primary: '#3b82f6',
      secondary: '#ff4747',
      background: '#000000',
    },
  },
  calm: {
    name: 'Calm Mode',
    description: 'Dark gray, muted blue & green',
    colors: {
      primary: '#60a5fa',
      secondary: '#10b981',
      background: '#1a1a1a',
    },
  },
  light: {
    name: 'Light Focus Mode',
    description: 'Clean white, subtle blue highlights',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#ffffff',
    },
  },
};
