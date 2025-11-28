/**
 * 🎯 Productivity Hub Section - Vercel Style
 * Clean card grid, no 3D effects, minimal animations
 */

import { motion } from 'framer-motion';
import { CheckSquare, BarChart3, Focus } from 'lucide-react';
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
  ];

  const colorMap = {
    cyan: 'from-secondary/20 to-secondary/20 border-secondary/30 hover:border-secondary/50',
    blue: 'from-primary/20 to-primary/20 border-primary/30 hover:border-primary/50',
    purple: 'from-primary/20 to-primary/20 border-primary/30 hover:border-primary/50',
  };

  const iconColorMap = {
    cyan: 'text-secondary',
    blue: 'text-primary',
    purple: 'text-primary',
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
            <span className="text-white/90">For Your Work</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to stay focused, organized, and productive.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-gray-400">{card.description}</p>

              {/* Arrow */}
              <div className="mt-6 text-gray-500 group-hover:text-gray-300 transition-colors">
                →
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
