import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

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
    return savedTheme || 'dark';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Add new theme class first, then remove the old one
    // This prevents the white flash during transition
    root.classList.add(theme);

    // Remove the opposite theme class
    const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
    root.classList.remove(oppositeTheme);

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
  dark: {
    name: '🌙 Dark Mode',
    description: 'Professional dark theme with indigo & cyan accents',
    colors: {
      primary: '#6366f1',      // Indigo
      secondary: '#06b6d4',    // Cyan
      background: '#09090b',   // Deep dark blue-black
    },
  },
  light: {
    name: '☀️ Light Mode',
    description: 'Clean light theme with indigo & cyan highlights',
    colors: {
      primary: '#6366f1',      // Indigo
      secondary: '#06b6d4',    // Cyan
      background: '#ffffff',   // Pure white
    },
  },
};
