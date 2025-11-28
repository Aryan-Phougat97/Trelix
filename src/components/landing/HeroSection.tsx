/**
 * 🎯 Hero Section - Vercel Style
 * Clean, minimal, fast. No animations, just beautiful typography.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroSection = React.memo(() => {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background">
      {/* Subtle gradient background - no blur */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-muted/20" />

      {/* Grid pattern - subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Main Heading - Vercel style */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8"
        >
          <span className="block text-foreground">Your Personal</span>
          <span className="block bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Operating System
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Unify tasks, goals, wellbeing, habits, and finances in one place.
          <br className="hidden sm:block" />
          Your mind, <span className="text-primary font-semibold">engineered</span>.
        </motion.p>

        {/* CTA Buttons - Clean, no glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <button
            onClick={() => navigate('/tasks')}
            className="group relative px-8 py-4 bg-foreground text-background rounded-lg font-semibold text-lg hover:bg-foreground/90 transition-colors w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              Start Your OS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => navigate('/tasks')}
            className="px-8 py-4 border-2 border-border text-foreground rounded-lg font-semibold text-lg hover:border-muted-foreground hover:bg-muted transition-colors w-full sm:w-auto"
          >
            Explore Features
          </button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-16 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span>Private</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Local-first</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>No login required</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator - minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-muted-foreground rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
