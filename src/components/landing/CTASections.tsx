import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GlowOrb } from './GlowEffects';

// Life OS Section with 3D Sphere
export const LifeOSSection = () => {
  return (
    <section className="relative py-40 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <GlowOrb size={600} color="#3b82f6" blur={150} opacity={0.2} />
        </div>
      </div>

      {/* Rotating Grid Sphere */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Sphere lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`vertical-${i}`}
            className="absolute top-1/2 left-1/2 w-px h-96 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent transform -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translateX(-50%) translateY(-50%) rotateY(${i * 30}deg) translateZ(150px)`,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`horizontal-${i}`}
            className="absolute top-1/2 left-1/2 w-96 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent transform -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translateX(-50%) translateY(-50%) rotateX(${i * 22.5}deg) translateZ(150px)`,
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8"
          >
            <h2 className="text-6xl md:text-8xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Life OS
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl text-white/80 mb-6"
          >
            One place. One system.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/60 mb-12"
          >
            Your mind, <span className="text-cyan-400">engineered</span>.
          </motion.p>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {['Tasks', 'Goals', 'Wellbeing', 'Finance'].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="p-4 bg-white/5 backdrop-blur-sm border border-cyan-500/30 rounded-xl text-cyan-300 font-medium"
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Final CTA Section
export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Vertical Gradient Beam */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent transform -translate-x-1/2"
      />

      {/* Multiple beams */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
        className="absolute left-1/2 top-0 bottom-0 w-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent transform -translate-x-1/2 blur-2xl"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Ready to get started?</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-white">Start Your</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Personal OS
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/60 mb-12"
          >
            Private. Local-first. Free forever.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative inline-block"
          >
            {/* Outer glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            
            {/* Button */}
            <motion.button
              onClick={() => navigate('/tasks')}
              className="relative group px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold text-2xl text-black overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                Launch Trelix
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          {/* Bottom Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-white/40 text-sm"
          >
            No account required • Works offline • Your data stays yours
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

// Floating Navbar
export const FloatingNavbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="px-6 py-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-6">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
        >
          TRELIX
        </button>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-4">
          {['Features', 'Pricing', 'About'].map((item) => (
            <button
              key={item}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-sm font-medium text-black hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
};
