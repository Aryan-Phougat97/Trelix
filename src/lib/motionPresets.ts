/**
 * 🎬 Motion Presets for Buttery-Smooth Animations
 * GPU-accelerated, spring-based, zero-lag motion system
 * Inspired by Arc Browser × Grok × Framer Motion
 */

import { Transition, Variants } from 'framer-motion';

// 🌊 Smooth cubic-bezier easing (like Arc/Framer)
export const EASING = {
  smooth: [0.16, 1, 0.3, 1] as const, // Main easing curve
  snappy: [0.34, 1.56, 0.64, 1] as const, // Bouncy feel
  soft: [0.25, 0.46, 0.45, 0.94] as const, // Gentle ease
} as const;

// 🎯 Spring Physics (buttery motion)
export const SPRING = {
  smooth: {
    type: 'spring' as const,
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 12,
    mass: 0.8,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 40,
    damping: 25,
    mass: 0.3,
  },
} as const;

// ⚡ Duration-based transitions
export const DURATION = {
  fast: {
    duration: 0.3,
    ease: EASING.smooth,
  },
  normal: {
    duration: 0.6,
    ease: EASING.smooth,
  },
  slow: {
    duration: 0.9,
    ease: EASING.smooth,
  },
} as const;

// 🎭 Preset Variants

/**
 * Fade In - GPU-accelerated opacity + transform
 */
export const fadeIn: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    // GPU acceleration
    transform: 'translate3d(0, 0, 0)',
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: DURATION.normal,
  },
};

/**
 * Fade In (No Y movement) - Pure opacity
 */
export const fadeInSimple: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: DURATION.normal,
  },
};

/**
 * Slide Up - Transform-based
 */
export const slideUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 40,
    transform: 'translate3d(0, 0, 0)',
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: DURATION.normal,
  },
};

/**
 * Pop - Spring-based scale animation
 */
export const pop = {
  whileHover: { 
    scale: 1.04,
    transition: SPRING.bouncy,
  },
  whileTap: { 
    scale: 0.98,
    transition: SPRING.bouncy,
  },
};

/**
 * Lift - Smooth hover lift with spring
 */
export const lift = {
  whileHover: { 
    y: -3,
    scale: 1.02,
    transition: SPRING.smooth,
  },
};

/**
 * Glow - Opacity-based glow (GPU-friendly)
 */
export const glow = {
  whileHover: { 
    opacity: 1,
    scale: 1.05,
    transition: DURATION.fast,
  },
};

/**
 * Drift - Infinite floating animation (GPU-accelerated)
 */
export const drift = (duration = 10) => ({
  animate: { 
    x: [0, -10, 5, 0],
    y: [0, 5, -10, 0],
    // Force GPU acceleration
    transform: 'translate3d(0, 0, 0)',
  },
  transition: {
    duration,
    ease: 'linear',
    repeat: Infinity,
    repeatType: 'loop' as const,
  },
});

/**
 * Pulse - Smooth scale pulse
 */
export const pulse = (duration = 2): any => ({
  animate: { 
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
  },
  transition: {
    duration,
    ease: 'easeInOut' as const,
    repeat: Infinity,
    repeatType: 'loop' as const,
  },
});

/**
 * Rotate - Smooth continuous rotation (GPU-accelerated)
 */
export const rotate = (duration = 20) => ({
  animate: { 
    rotate: 360,
    // Force GPU layer
    transform: 'translate3d(0, 0, 0)',
  },
  transition: {
    duration,
    ease: 'linear',
    repeat: Infinity,
    repeatType: 'loop' as const,
  },
});

/**
 * Stagger Children - For lists/grids
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger Item
 */
export const staggerItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    transform: 'translate3d(0, 0, 0)',
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: SPRING.smooth,
  },
};

/**
 * Parallax Scroll - Transform-based parallax
 */
export const createParallax = (speed = 0.5) => ({
  transform: `translate3d(0, calc(var(--scroll-y, 0) * ${speed}), 0)`,
});

/**
 * Mobile Performance Mode
 * Reduces animation complexity on mobile devices
 */
export const isMobile = () => window.innerWidth < 768;

export const mobileOptimized = (desktop: any, mobile: any) => 
  isMobile() ? mobile : desktop;

/**
 * Will-Change Helper
 * Add this to className for GPU acceleration
 */
export const gpuAccelerated = 'will-change-[transform,opacity] transform-gpu';

/**
 * Performance-optimized variants generator
 */
export const createOptimizedVariant = (
  initialState: Record<string, any>,
  animateState: Record<string, any>,
  transition: Transition = DURATION.normal
): Variants => ({
  initial: {
    ...initialState,
    transform: 'translate3d(0, 0, 0)', // Force GPU
  },
  animate: {
    ...animateState,
    transition,
  },
});

/**
 * Hover scale with spring
 */
export const hoverScale = (scale = 1.03) => ({
  whileHover: {
    scale,
    transition: SPRING.smooth,
  },
});

/**
 * Magnetic hover effect
 */
export const magneticHover = {
  whileHover: {
    scale: 1.05,
    rotate: [0, -1, 1, 0],
    transition: {
      scale: SPRING.bouncy,
      rotate: {
        duration: 0.4,
        ease: EASING.smooth,
      },
    },
  },
};
