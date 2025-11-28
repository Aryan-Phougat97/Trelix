/**
 * 🎯 Problem/Solution Section - Vercel Style
 * Clean side-by-side comparison, minimal animations
 */

import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export const ProblemSolutionSection = () => {
  return (
    <section id="features" className="relative py-32 bg-black">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 to-black opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">

          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white/90 mb-6">
                Fragmented
                <br />
                apps.
                <br />
                Scattered
                <br />
                focus.
              </h2>
            </div>

            <div className="space-y-4">
              {[
                '15+ apps for productivity',
                'No unified view',
                'Data everywhere',
                'Context switching hell',
              ].map((problem) => (
                <div key={problem} className="flex items-start gap-3 text-gray-400">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span className="text-lg">{problem}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Trelix
                </span>
                <br />
                <span className="text-white/90">unifies</span>
                <br />
                <span className="text-white/90">your life.</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                'One system. All features.',
                'Unified dashboard',
                'Local-first data',
                'Zero context switching',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <button className="mt-8 px-6 py-3 border-2 border-cyan-500/50 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500/10 transition-colors">
              See how it works →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
