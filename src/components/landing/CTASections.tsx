/**
 * 🎯 CTA Sections - Vercel Style
 * Clean, minimal CTAs with no heavy animations
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

// Life OS Section
export const LifeOSSection = () => {
  return (
    <section className="relative py-40 bg-black">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Your Life OS
            </span>
          </h2>

          <p className="text-2xl sm:text-3xl text-gray-400 mb-6">
            One place. One system.
          </p>

          <p className="text-xl text-gray-500 mb-12">
            Your mind, <span className="text-cyan-400">engineered</span>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['Tasks', 'Goals', 'Wellbeing', 'Finance'].map((feature) => (
              <div
                key={feature}
                className="p-4 bg-white/5 border border-white/10 rounded-xl text-cyan-300 font-medium hover:bg-white/10 transition-colors"
              >
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Final CTA Section
export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-gradient-to-b from-black to-gray-900">
      {/* Vertical line accent */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Ready to get started?</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Start Your</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Personal OS
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-xl sm:text-2xl text-gray-400 mb-12">
            Private. Local-first. Free forever.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/tasks')}
            className="group px-12 py-6 bg-white text-black rounded-lg font-bold text-2xl hover:bg-gray-100 transition-colors inline-flex items-center gap-3"
          >
            Launch Trelix
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Bottom Text */}
          <p className="mt-8 text-gray-500 text-sm">
            No account required • Works offline • Your data stays yours
          </p>
        </motion.div>
      </div>
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
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="px-6 py-3 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center gap-6">
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
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/tasks')}
          className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Get Started
        </button>
      </div>
    </motion.nav>
  );
};
