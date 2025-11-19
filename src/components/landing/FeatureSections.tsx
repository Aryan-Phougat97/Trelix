import { motion } from 'framer-motion';
import { Target, ClipboardCheck, BookOpen, Smile, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassPanel, PulsingDot, FloatingElement } from './GlowEffects';

// Planning & Goals Timeline Section
export const PlanningSection = () => {
  const navigate = useNavigate();
  
  const goals = [
    { title: 'Yearly Goals', icon: Target, color: 'cyan', path: '/framework' },
    { title: 'Monthly Goals', icon: Target, color: 'blue', path: '/framework' },
    { title: 'Weekly Review', icon: ClipboardCheck, color: 'purple', path: '/review' },
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-cyan-400 text-sm font-mono">// PLANNING & GOALS</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Trelix Framework
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Structure your growth. Define your direction.
          </p>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="max-w-4xl mx-auto">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex items-center gap-8 mb-12 last:mb-0"
            >
              {/* Timeline Line */}
              {index < goals.length - 1 && (
                <div className="absolute left-8 top-20 w-px h-24 bg-gradient-to-b from-cyan-500/50 to-transparent" />
              )}

              {/* Pulsing Node */}
              <FloatingElement delay={index * 0.3}>
                <PulsingDot size={16} color={goal.color} />
              </FloatingElement>

              {/* Content Card */}
              <div 
                onClick={() => navigate(goal.path)}
                className="flex-1 cursor-pointer"
              >
                <GlassPanel glowColor={goal.color} className="flex items-center gap-6">
                  <div className={`p-4 rounded-xl bg-${goal.color}-500/20`}>
                    <goal.icon className={`w-8 h-8 text-${goal.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{goal.title}</h3>
                    <p className="text-white/60">Set and track your long-term objectives</p>
                  </div>
                </GlassPanel>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Wellbeing Modules Section
export const WellbeingSection = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Diary',
      description: 'Daily journaling with mood tracking',
      icon: BookOpen,
      path: '/diary',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
      glowColor: 'cyan' as const,
    },
    {
      title: 'Mood Tracker',
      description: 'Understand your emotional patterns',
      icon: Smile,
      path: '/mood',
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
      glowColor: 'blue' as const,
    },
    {
      title: 'Habit Tracker',
      description: 'Build lasting positive habits',
      icon: TrendingUp,
      path: '/habits',
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
      glowColor: 'purple' as const,
    },
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-purple-400 text-sm font-mono">// WELLBEING & HABITS</span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Mind & Body
            </span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Track your wellbeing. Build better habits. Understand yourself.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <FloatingElement key={module.title} delay={index * 0.2} yOffset={15}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onClick={() => navigate(module.path)}
                className="cursor-pointer"
              >
                <GlassPanel glowColor={module.glowColor} className="h-full text-center">
                  <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-6`}>
                    <module.icon className={`w-10 h-10 ${module.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{module.title}</h3>
                  <p className="text-white/60">{module.description}</p>
                </GlassPanel>
              </motion.div>
            </FloatingElement>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trelix Ledger Section
export const LedgerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-yellow-400 text-sm font-mono">// FINANCIAL</span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Trelix Ledger
                </span>
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Track income, manage expenses, and gain financial insights with built-in calculator and smart analytics.
              </p>
              
              <button
                onClick={() => navigate('/ledger')}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-full text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
              >
                Explore Ledger
              </button>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassPanel glowColor="purple" className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <Wallet className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">Financial Overview</span>
                </div>
                
                {/* Mock Chart */}
                <div className="space-y-4">
                  {[70, 45, 80, 55, 90].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex items-end gap-2"
                    >
                      <div className={`h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full`} style={{ width: `${height}%` }} />
                      <span className="text-xs text-white/40">Day {i + 1}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
