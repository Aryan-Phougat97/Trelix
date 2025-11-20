import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useIsMobile, useReducedMotion } from '@/hooks/useMediaQuery';

interface GlowOrbProps {
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  animate?: boolean;
}

export const GlowOrb = ({
  size = 400,
  color = '#3b82f6',
  blur = 50, // Reduced from 100px default
  opacity = 0.3,
  animate = true
}: GlowOrbProps) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Reduce blur on mobile for better performance
  const effectiveBlur = isMobile ? Math.min(blur * 0.4, 30) : blur;
  const effectiveOpacity = isMobile ? opacity * 0.7 : opacity;

  // Disable animation if user prefers reduced motion
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none will-change-[opacity] transform-gpu"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${effectiveBlur}px)`,
        opacity: effectiveOpacity,
        willChange: shouldAnimate ? 'opacity' : 'auto',
      }}
      animate={shouldAnimate ? {
        scale: [1, 1.2, 1],
        opacity: [effectiveOpacity, effectiveOpacity * 0.7, effectiveOpacity],
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

interface AnimatedFlareProps {
  className?: string;
}

export const AnimatedFlare = ({ className = '' }: AnimatedFlareProps) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Disable on mobile or if user prefers reduced motion
  if (isMobile || prefersReducedMotion) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }} // Reduced max opacity from 1 to 0.5
        transition={{
          duration: 4, // Slower for smoother effect
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-2xl" /> {/* Reduced from /20 to /10 */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl" />
      </motion.div>
    </div>
  );
};

interface HolographicTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export const HolographicText = ({ children, className = '', animate = true }: HolographicTextProps) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Glow behind text - reduced blur */}
      <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30" />

      {/* Main text */}
      <div className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        {children}
      </div>

      {/* Animated scan line - only if motion is allowed */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
          initial={{ y: '-100%' }}
          animate={{ y: '200%' }}
          transition={{
            duration: 3, // Slower for smoother effect
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
};

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hoverScale?: boolean;
}

export const GlassPanel = ({
  children,
  className = '',
  glowColor = 'cyan',
  hoverScale = true
}: GlassPanelProps) => {
  const glowColors = {
    cyan: 'hover:shadow-cyan-500/50',
    blue: 'hover:shadow-blue-500/50',
    purple: 'hover:shadow-purple-500/50',
    pink: 'hover:shadow-pink-500/50',
  };

  return (
    <motion.div
      className={`relative backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 transition-all duration-300 ${glowColors[glowColor as keyof typeof glowColors] || glowColors.cyan} hover:shadow-2xl ${className}`}
      whileHover={hoverScale ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500/50 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/50 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50 rounded-br-2xl" />

      {children}
    </motion.div>
  );
};

interface NeonBorderProps {
  children: ReactNode;
  color?: 'cyan' | 'blue' | 'purple' | 'pink';
  className?: string;
}

export const NeonBorder = ({ children, color = 'cyan', className = '' }: NeonBorderProps) => {
  const colors = {
    cyan: 'from-cyan-500 to-blue-500',
    blue: 'from-blue-500 to-purple-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
  };

  return (
    <div className={`relative p-[2px] bg-gradient-to-r ${colors[color]} rounded-2xl ${className}`}>
      <div className="bg-black rounded-2xl">
        {children}
      </div>
    </div>
  );
};

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
  yOffset = 20
}: FloatingElementProps) => {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

interface PulsingDotProps {
  size?: number;
  color?: string;
  className?: string;
}

export const PulsingDot = ({ size = 12, color = 'cyan', className = '' }: PulsingDotProps) => {
  const colorClasses = {
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute inset-0 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
