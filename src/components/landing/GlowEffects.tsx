/**
 * 🌟 Glow Effects Library for Grok-inspired Design
 * GPU-accelerated, transform-based, buttery-smooth animations
 * Optimized for 60fps with zero-lag motion
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pulse, SPRING, DURATION, gpuAccelerated, mobileOptimized } from '@/lib/motionPresets';

interface GlowOrbProps {
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  animate?: boolean;
  className?: string;
}

/**
 * GlowOrb - GPU-accelerated radial gradient orb
 * Uses transform + opacity for smooth animation
 */
export const GlowOrb = React.memo(({ 
  size = 400, 
  color = '#3b82f6', 
  blur = 100, 
  opacity = 0.3,
  animate = true,
  className = '',
}: GlowOrbProps) => {
  // Reduce blur on mobile for better performance
  const optimizedBlur = mobileOptimized(blur, Math.min(blur, 60));
  
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${gpuAccelerated} ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${optimizedBlur}px)`,
        opacity,
        willChange: 'transform, opacity',
        transform: 'translate3d(0, 0, 0)', // Force GPU layer
      }}
      {...(animate ? pulse(4) : {})}
    />
  );
});

GlowOrb.displayName = 'GlowOrb';

interface AnimatedFlareProps {
  className?: string;
}

/**
 * AnimatedFlare - Moving light flare using transform
 * Optimized with translate3d for GPU acceleration
 */
export const AnimatedFlare = React.memo(({ className = '' }: AnimatedFlareProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className={`absolute w-full h-full ${gpuAccelerated}`}
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.1) 40%, rgba(147, 51, 234, 0.1) 60%, transparent 100%)',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
        animate={{
          x: ['-100%', '100%'],
          y: ['-50%', '50%'],
        }}
        transition={{
          duration: 15,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </div>
  );
});

AnimatedFlare.displayName = 'AnimatedFlare';

interface HolographicTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * HolographicText - Gradient text with scan line
 * Uses CSS background-clip for GPU rendering
 */
export const HolographicText = React.memo(({ children, className = '' }: HolographicTextProps) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span 
        className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient"
        style={{
          backgroundSize: '200% 100%',
          willChange: 'background-position',
        }}
      >
        {children}
      </span>
      
      {/* Scan line effect - GPU optimized */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
        animate={{
          y: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </div>
  );
});

HolographicText.displayName = 'HolographicText';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * GlassPanel - Glassmorphism with corner accents
 * Transform-based hover for smooth interaction
 */
export const GlassPanel = React.memo(({ children, className = '', hover = true }: GlassPanelProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 ${gpuAccelerated} ${className}`}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
      whileHover={hover ? {
        scale: 1.02,
        y: -4,
        transition: SPRING.smooth,
      } : undefined}
    >
      {/* Corner accents - Pure CSS */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-blue-400/50 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-400/50 rounded-br-2xl" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
});

GlassPanel.displayName = 'GlassPanel';

interface NeonBorderProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

/**
 * NeonBorder - Animated neon border using pseudo-element
 * GPU-accelerated opacity animation
 */
export const NeonBorder = React.memo(({ children, className = '', color = '#3b82f6' }: NeonBorderProps) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Neon glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}40, inset 0 0 20px ${color}20`,
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
        }}
        transition={DURATION.fast}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

NeonBorder.displayName = 'NeonBorder';

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * FloatingElement - Smooth floating animation
 * Uses transform3d for GPU acceleration
 */
export const FloatingElement = React.memo(({ 
  children, 
  duration = 6, 
  delay = 0,
  className = '',
}: FloatingElementProps) => {
  return (
    <motion.div
      className={`${gpuAccelerated} ${className}`}
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {children}
    </motion.div>
  );
});

FloatingElement.displayName = 'FloatingElement';

interface PulsingDotProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * PulsingDot - Smooth pulsing indicator
 * Scale + opacity for buttery motion
 */
export const PulsingDot = React.memo(({ 
  size = 12, 
  color = '#3b82f6',
  className = '',
}: PulsingDotProps) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          opacity: 0.3,
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)',
        }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          ease: 'easeOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
      
      {/* Inner dot */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  );
});

PulsingDot.displayName = 'PulsingDot';
