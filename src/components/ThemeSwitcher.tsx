import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useTheme, ThemeMode, themeDefinitions } from '../contexts/ThemeContext';
import { Button } from './ui/button';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, isTransitioning } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95 ${
          isTransitioning ? 'animate-theme-glow-pulse' : ''
        }`}
        aria-label="Change theme"
      >
        <Palette className="h-5 w-5 transition-colors" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Selector Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-12 z-50 w-80 glass-card rounded-xl p-4 space-y-3 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Select Theme
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-lg">&times;</span>
                </button>
              </div>

              <div className="space-y-2">
                {(Object.keys(themeDefinitions) as ThemeMode[]).map((themeKey) => {
                  const themeDef = themeDefinitions[themeKey];
                  const isActive = theme === themeKey;

                  return (
                    <motion.button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-foreground/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Theme Preview Swatch */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-12 h-12 rounded-lg border border-border overflow-hidden shadow-md">
                          <div
                            className="h-1/3 w-full"
                            style={{ backgroundColor: themeDef.colors.background }}
                          />
                          <div className="h-1/3 w-full flex">
                            <div
                              className="w-1/2 h-full"
                              style={{ backgroundColor: themeDef.colors.primary }}
                            />
                            <div
                              className="w-1/2 h-full"
                              style={{ backgroundColor: themeDef.colors.secondary }}
                            />
                          </div>
                          <div
                            className="h-1/3 w-full"
                            style={{ backgroundColor: themeDef.colors.background }}
                          />
                        </div>
                      </div>

                      {/* Theme Info */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            {themeDef.name}
                          </h4>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {themeDef.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Current Theme Indicator */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Current: <span className="font-semibold text-foreground">{themeDefinitions[theme].name}</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
