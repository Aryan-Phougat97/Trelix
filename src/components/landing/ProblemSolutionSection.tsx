import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

export const ProblemSolutionSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-20 bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Abstract Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-32 h-32 border border-red-500/20 rounded-lg"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-cyan-500/20"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
      />

      <motion.div className="container mx-auto px-6" style={{ opacity }}>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Problem Side - LEFT */}
          <motion.div
            style={{ x: leftX }}
            className="relative"
          >
            {/* Glitch Effect Container */}
            <div className="relative">
              {/* Multiple offset layers for glitch */}
              <motion.div
                animate={{
                  x: [0, -5, 5, -3, 3, 0],
                  opacity: [1, 0.8, 1, 0.7, 1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="absolute inset-0 text-red-500/30 text-4xl md:text-6xl font-bold"
              >
                <h2>Fragmented</h2>
                <h2>apps.</h2>
                <h2>Scattered</h2>
                <h2>focus.</h2>
              </motion.div>

              {/* Main text */}
              <div className="relative text-4xl md:text-6xl font-bold text-white/80">
                <h2 className="flex items-center gap-3">
                  <X className="text-red-500 w-8 h-8" />
                  Fragmented
                </h2>
                <h2>apps.</h2>
                <h2 className="flex items-center gap-3">
                  <X className="text-red-500 w-8 h-8" />
                  Scattered
                </h2>
                <h2>focus.</h2>
              </div>
            </div>

            {/* Problem Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              {[
                '15+ apps for productivity',
                'No unified view',
                'Data everywhere',
                'Context switching hell',
              ].map((problem, index) => (
                <motion.div
                  key={problem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 text-red-400/80"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-lg">{problem}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Solution Side - RIGHT */}
          <motion.div
            style={{ x: rightX }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Glow behind text */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl" />

              {/* Main text */}
              <div className="relative text-4xl md:text-6xl font-bold">
                <h2 className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
                  <Check className="text-cyan-400 w-8 h-8" />
                  Trelix
                </h2>
                <h2 className="text-white/90">unifies</h2>
                <h2 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  your life.
                </h2>
              </div>
            </motion.div>

            {/* Solution Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 space-y-4"
            >
              {[
                'One system. All features.',
                'Unified dashboard',
                'Local-first data',
                'Zero context switching',
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 text-cyan-400/90"
                >
                  <Check className="w-5 h-5" />
                  <span className="text-lg">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-full text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all">
                See how it works
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Central Divider Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block absolute top-1/2 left-1/2 w-px h-64 bg-gradient-to-b from-red-500/50 via-purple-500/50 to-cyan-500/50 transform -translate-x-1/2 -translate-y-1/2"
        />

        {/* Arrow Transform */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center bg-black border-2 border-cyan-500/50 rounded-full z-10"
        >
          <ArrowRight className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};
