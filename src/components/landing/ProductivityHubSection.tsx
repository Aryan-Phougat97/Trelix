/**
 * 🎯 Productivity Hub Section - Vercel Style
 * Clean card grid, no 3D effects, minimal animations
 */

import { motion } from 'framer-motion';
import { CheckSquare, BarChart3, Focus, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductivityHubSection = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Tasks',
      description: 'Organize your work with smart task management',
      icon: CheckSquare,
      color: 'cyan',
      path: '/tasks',
    },
    {
      title: 'Analytics',
      description: 'Track your productivity with insightful metrics',
      icon: BarChart3,
      color: 'blue',
      path: '/analytics',
    },
    {
      title: 'Focus Mode',
      description: 'Eliminate distractions and get in the zone',
      icon: Focus,
      color: 'purple',
      path: '/focus',
    },
    {
      title: 'Ledger',
      description: 'Track income, expenses, and financial health',
      icon: Wallet,
      color: 'green',
      path: '/ledger',
    },
  ];

  const colorMap = {
    cyan: 'from-brand-cyan/20 to-brand-cyan/20 border-brand-cyan/30 hover:border-brand-cyan/50',
    blue: 'from-brand-indigo/20 to-brand-indigo/20 border-brand-indigo/30 hover:border-brand-indigo/50',
    purple: 'from-brand-purple/20 to-brand-purple/20 border-brand-purple/30 hover:border-brand-purple/50',
    green: 'from-brand-emerald/20 to-brand-emerald/20 border-brand-emerald/30 hover:border-brand-emerald/50',
  };

  const iconColorMap = {
    cyan: 'text-brand-cyan',
    blue: 'text-brand-indigo',
    purple: 'text-brand-purple',
    green: 'text-brand-emerald',
  };

  return (
    <section id="productivity" className="relative py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-secondary text-sm font-mono tracking-wider mb-4">
            // PRODUCTIVITY HUB
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Power Tools
            </span>
            <br />
            <span className="text-foreground/90">For Your Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay focused, organized, and productive.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(card.path)}
              className={`group relative p-8 bg-linear-to-br ${colorMap[card.color as keyof typeof colorMap]} border-2 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]`}
            >
              {/* Icon */}
              <div className={`mb-6 w-12 h-12 ${iconColorMap[card.color as keyof typeof iconColorMap]}`}>
                <card.icon className="w-full h-full" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground">{card.description}</p>

              {/* Arrow */}
              <div className="mt-6 text-muted-foreground group-hover:text-foreground transition-colors">
                →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
