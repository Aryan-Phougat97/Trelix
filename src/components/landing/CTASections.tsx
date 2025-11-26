/**
 * 🎯 CTA Sections - Vercel Style
 * Clean, minimal CTAs with no heavy animations
 */

import { useState } from 'react';
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
            <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Your Life OS
            </span>
          </h2>

          <p className="text-2xl sm:text-3xl text-gray-400 mb-6">
            One place. One system.
          </p>

          <p className="text-xl text-gray-500 mb-12">
            Your mind, <span className="text-indigo-400">engineered</span>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['Tasks', 'Goals', 'Wellbeing', 'Finance'].map((feature) => (
              <div
                key={feature}
                className="p-4 bg-white/5 border border-white/10 rounded-xl text-indigo-300 font-medium hover:bg-white/10 transition-colors"
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
    <section className="relative py-32 bg-linear-to-b from-black to-gray-900">
      {/* Vertical line accent */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-cyan-500/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 font-medium">Ready to get started?</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Start Your</span>
            <br />
            <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
    >
      <div className="px-4 sm:px-6 py-3 bg-black/80 backdrop-blur-xs border border-white/10 rounded-full flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo Text - Clickable to scroll to hero */}
        <button
          onClick={scrollToHero}
          className="hover:opacity-80 transition-opacity shrink-0"
        >
          <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            TRELIX
          </span>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('productivity')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Productivity
          </button>
          <button
            onClick={() => scrollToSection('wellbeing')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Wellbeing
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* CTA */}
        <button
          onClick={() => navigate('/tasks')}
          className="px-3 sm:px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          Get Started
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-2 p-4 bg-black/90 backdrop-blur-xs border border-white/10 rounded-2xl"
        >
          <div className="flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('productivity')}
              className="text-left text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              Productivity
            </button>
            <button
              onClick={() => scrollToSection('wellbeing')}
              className="text-left text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              Wellbeing
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
