/**
 * 🎯 Feature Sections - Vercel Style
 * Clean, minimal feature showcases
 */

import { motion } from 'framer-motion';
import { Target, BookOpen, Smile, TrendingUp, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Planning & Goals Section
export const PlanningSection = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Yearly Goals', icon: Target },
    { title: 'Monthly Goals', icon: Target },
    { title: 'Weekly Review', icon: Target },
  ];

  return (
    <section className="relative py-32 bg-linear-to-b from-background to-brand-indigo/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-cyan text-sm font-mono tracking-wider mb-4">
            // PLANNING & GOALS
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-brand-purple to-destructive-foreground bg-clip-text text-transparent">
              The Trelix Framework
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structure your growth. Define your direction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate('/framework')}
              className="group p-8 bg-muted border-2 border-foreground/10 rounded-2xl hover:border-brand-purple/80 hover:bg-forgeound/10 transition-all cursor-pointer"
            >
              <feature.icon className="w-10 h-10 text-brand-purple mb-4" />
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Wellbeing Section
export const WellbeingSection = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Diary',
      description: 'Daily journaling with mood tracking',
      icon: BookOpen,
      path: '/diary',
      color: 'green',
    },
    {
      title: 'Mood Tracker',
      description: 'Understand your emotional patterns',
      icon: Smile,
      path: '/mood',
      color: 'yellow',
    },
    {
      title: 'Habit Tracker',
      description: 'Build lasting positive habits',
      icon: TrendingUp,
      path: '/habits',
      color: 'pink',
    },
  ];

  const colorMap = {
    green: 'border-green-400/30 hover:border-green-400/50',
    yellow: 'border-yellow-300/30 hover:border-yellow-300/50',
    pink: 'border-destructive-foreground/30 hover:border-destructive-foreground/50',
  };

  const iconColorMap = {
    green: 'text-green-400',
    yellow: 'text-yellow-200',
    pink: 'text-destructive-foreground',
  };

  return (
    <section id="wellbeing" className="relative py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-brand-purple text-sm font-mono tracking-wider mb-4">
            // WELLBEING & HABITS
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mind & Body
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your wellbeing. Build better habits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(module.path)}
              className={`group p-8 bg-muted/5 border-2 ${colorMap[module.color as keyof typeof colorMap]} rounded-2xl hover:bg-muted/10 transition-all cursor-pointer text-center`}
            >
              <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center">
                <module.icon className={`w-full h-full ${iconColorMap[module.color as keyof typeof iconColorMap]}`} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{module.title}</h3>
              <p className="text-muted-foreground">{module.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Ledger Section
export const LedgerSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-linear-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-brand-emerald text-sm font-mono tracking-wider mb-4">
              // FINANCIAL
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-brand-emerald to-brand-cyan bg-clip-text text-transparent">
                Trelix Ledger
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Track income, manage expenses, and gain financial insights.
            </p>

            <button
              onClick={() => navigate('/ledger')}
              className="px-8 py-4 border-2 border-brand-emerald/50 text-brand-emerald rounded-lg font-semibold hover:bg-brand-emerald/10 transition-colors"
            >
              Explore Ledger
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-8 bg-linear-to-br from-brand-emerald/10 to-brand-cyan/10 border-2 border-brand-emerald/30 rounded-2xl"
          >
            <div className="flex items-center justify-center">
              <Wallet className="w-32 h-32 text-brand-emerald" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
