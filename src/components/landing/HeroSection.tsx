import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlowOrb, HolographicText, AnimatedFlare } from './GlowEffects';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <AnimatedFlare />
      
      {/* Multiple Glow Orbs */}
      <div className="absolute top-1/4 left-1/4">
        <GlowOrb size={500} color="#06b6d4" blur={120} opacity={0.15} />
      </div>
      <div className="absolute bottom-1/4 right-1/4">
        <GlowOrb size={400} color="#3b82f6" blur={100} opacity={0.2} />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <GlowOrb size={600} color="#8b5cf6" blur={150} opacity={0.1} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300 font-medium">Your Personal Life OS</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-cyan-400"
          />
        </motion.div>

        {/* Main Heading */}
        <HolographicText className="text-6xl md:text-8xl font-bold mb-6">
          <h1>TRELIX</h1>
        </HolographicText>

        {/* Subheading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          {/* Primary CTA */}
          <motion.button
            onClick={() => navigate('/tasks')}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-semibold text-lg text-black overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Start Your OS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full blur-xl bg-cyan-500/50 group-hover:bg-cyan-500/70 transition-all" />
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 border-2 border-cyan-500/50 rounded-full font-semibold text-lg text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Features
          </motion.button>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/60"
        >
          {['Private', 'Local-first', 'Free forever', 'No login required'].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-cyan-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  );
};
