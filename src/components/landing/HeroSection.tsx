/**
 * 🚀 Hero Section - GPU-Optimized
 * Buttery-smooth animations with transform/opacity only
 * Reduced blur, optimized particles, spring physics
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlowOrb, HolographicText, AnimatedFlare } from './GlowEffects';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeIn, slideUp, SPRING, DURATION, gpuAccelerated, mobileOptimized } from '@/lib/motionPresets';

// Memoized background for performance
const HeroBackground = React.memo(() => (
  <>
    {/* Animated Flare */}
    <AnimatedFlare />
    
    {/* Glow Orbs - Reduced blur on mobile */}
    <div className="absolute top-1/4 left-1/4">
      <GlowOrb size={500} color="#06b6d4" blur={mobileOptimized(120, 60)} opacity={0.15} />
    </div>
    <div className="absolute bottom-1/4 right-1/4">
      <GlowOrb size={400} color="#3b82f6" blur={mobileOptimized(100, 50)} opacity={0.2} />
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <GlowOrb size={600} color="#8b5cf6" blur={mobileOptimized(150, 70)} opacity={0.1} />
    </div>

    {/* Grid Pattern - Static overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
  </>
));

HeroBackground.displayName = 'HeroBackground';

// Memoized particle component
const Particle = React.memo(({ index }: { index: number }) => {
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const duration = 3 + Math.random() * 2;
  const delay = Math.random() * 2;

  return (
    <motion.div
      className={`absolute w-1 h-1 bg-cyan-400/50 rounded-full pointer-events-none ${gpuAccelerated}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        willChange: 'transform, opacity',
        transform: 'translate3d(0, 0, 0)',
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
});

Particle.displayName = 'Particle';

export const HeroSection = React.memo(() => {
  const navigate = useNavigate();
  
  // Reduce particles on mobile
  const particleCount = mobileOptimized(20, 10);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Layer - Memoized to prevent re-renders */}
      <HeroBackground />

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge - GPU accelerated */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-8"
          style={{ willChange: 'transform, opacity' }}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300 font-medium">Your Personal Life OS</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-cyan-400"
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* Main Heading with Holographic Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...DURATION.normal, delay: 0.1 }}
        >
          <HolographicText className="text-6xl md:text-8xl font-bold mb-6">
            <h1>TRELIX</h1>
          </HolographicText>
        </motion.div>

        {/* Subheading */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ ...DURATION.normal, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white/90 mb-4">
            Productivity <span className="text-cyan-400">Re-Engineered</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto">
            One unified system for tasks, goals, wellbeing, and finance.
            <br />
            Your mind, <span className="text-blue-400">engineered</span>.
          </p>
        </motion.div>

        {/* CTA Buttons with Spring Physics */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ ...DURATION.normal, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {/* Primary CTA - Transform-based hover */}
          <motion.button
            onClick={() => navigate('/tasks')}
            className={`group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-semibold text-lg text-black overflow-hidden ${gpuAccelerated}`}
            whileHover={{ scale: 1.05, transition: SPRING.smooth }}
            whileTap={{ scale: 0.95, transition: SPRING.bouncy }}
            style={{ willChange: 'transform' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your OS
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={SPRING.smooth}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </span>
            
            {/* Reduced blur glow */}
            <motion.div 
              className="absolute -inset-2 rounded-full blur-2xl bg-cyan-500/40 -z-10"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 0.8 }}
              transition={DURATION.fast}
            />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={() => navigate('/dashboard')}
            className={`px-8 py-4 border-2 border-cyan-500/50 rounded-full font-semibold text-lg text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors ${gpuAccelerated}`}
            whileHover={{ scale: 1.05, transition: SPRING.smooth }}
            whileTap={{ scale: 0.95, transition: SPRING.bouncy }}
            style={{ willChange: 'transform' }}
          >
            Explore Features
          </motion.button>
        </motion.div>

        {/* Feature Pills - Staggered entrance */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...DURATION.normal, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/60"
        >
          {['Private', 'Local-first', 'Free forever', 'No login required'].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...DURATION.normal, delay: 0.7 + index * 0.1 }}
              className={`px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm ${gpuAccelerated}`}
              style={{ willChange: 'transform' }}
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator - Smooth loop */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ ...DURATION.slow, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-6 h-10 border-2 border-cyan-500/50 rounded-full flex items-start justify-center p-2 ${gpuAccelerated}`}
            style={{ willChange: 'transform' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-2 bg-cyan-400 rounded-full"
              style={{ willChange: 'transform, opacity' }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Particles - Reduced count on mobile */}
      {[...Array(particleCount)].map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
