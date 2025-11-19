import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { CheckSquare, BarChart3, Focus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NeonBorder } from './GlowEffects';

interface ProductivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'cyan' | 'blue' | 'purple';
  path: string;
  index: number;
}

const ProductivityCard = ({ title, description, icon, color, path, index }: ProductivityCardProps) => {
  const navigate = useNavigate();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = (centerX - x) / 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const colorClasses = {
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/50',
      icon: 'bg-cyan-500/20',
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/50',
      icon: 'bg-blue-500/20',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/50',
      icon: 'bg-purple-500/20',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(path)}
      className="cursor-pointer perspective-1000"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease',
      }}
    >
      <div className={`relative group h-full bg-gradient-to-br ${colors.bg} backdrop-blur-xl border-2 ${colors.border} rounded-2xl p-8 hover:${colors.glow} hover:shadow-2xl transition-all duration-300`}>
        {/* Corner Neon Accents */}
        <div className={`absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 ${colors.border} rounded-tl-2xl`} />
        <div className={`absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 ${colors.border} rounded-br-2xl`} />

        {/* Scan Line Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-${color}-400/10 to-transparent`}
          animate={{
            y: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Icon */}
        <div className={`relative z-10 mb-6 w-16 h-16 ${colors.icon} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <div className={colors.text}>{icon}</div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className={`text-2xl font-bold ${colors.text} mb-3 group-hover:translate-x-1 transition-transform duration-300`}>
            {title}
          </h3>
          <p className="text-white/60 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover Glow */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`} />
      </div>
    </motion.div>
  );
};

export const ProductivityHubSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const cards = [
    {
      title: 'Tasks',
      description: 'Intelligent task management with focus mode, priorities, and smart filtering.',
      icon: <CheckSquare className="w-8 h-8" />,
      color: 'cyan' as const,
      path: '/tasks',
    },
    {
      title: 'Dashboard',
      description: 'Real-time analytics, productivity insights, and completion tracking.',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'blue' as const,
      path: '/dashboard',
    },
    {
      title: 'Focus Mode',
      description: 'Pomodoro timer, ambient sounds, and distraction-free environment.',
      icon: <Focus className="w-8 h-8" />,
      color: 'purple' as const,
      path: '/tasks',
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-black overflow-hidden">
      {/* Background Grid with Parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"
      />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-cyan-400 text-sm font-mono tracking-wider">// PRODUCTIVITY HUB</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Power Tools
            </span>
            <br />
            <span className="text-white/90">For Your Work</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Everything you need to stay focused, organized, and productive. All in one place.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {cards.map((card, index) => (
            <ProductivityCard key={card.title} {...card} index={index} />
          ))}
        </div>

        {/* Feature Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Task Categories', value: '∞' },
            { label: 'Focus Sessions', value: 'Unlimited' },
            { label: 'Analytics', value: 'Real-time' },
            { label: 'Integrations', value: 'Coming Soon' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
