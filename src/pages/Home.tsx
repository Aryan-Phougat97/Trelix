import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import {
  CheckSquare,
  BarChart3,
  Focus,
  Target,
  ClipboardCheck,
  BookOpen,
  Smile,
  TrendingUp,
  Wallet,
  Settings,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: { name: string; path: string; icon: React.ReactNode }[];
  delay: number;
}

const SectionCard = ({ title, description, icon, gradient, features, delay }: SectionCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradient}`}></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <Sparkles className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-6 text-sm">{description}</p>

        {/* Features List */}
        <div className="space-y-2">
          {features.map((feature, index) => (
            <motion.button
              key={feature.name}
              onClick={() => navigate(feature.path)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.1 + index * 0.05 }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-200 group/item text-left"
            >
              <div className="text-primary">{feature.icon}</div>
              <span className="text-sm font-medium text-foreground">{feature.name}</span>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-1 transition-all duration-200" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Productivity Hub',
      description: 'Master your tasks, track your progress, and achieve peak focus.',
      icon: <CheckSquare className="h-6 w-6 text-primary" strokeWidth={2} />,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      features: [
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
        { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
        { name: 'Focus Mode', path: '/tasks', icon: <Focus className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Planning & Goals',
      description: 'Define your direction, structure your growth, and reflect on progress.',
      icon: <Target className="h-6 w-6 text-primary" strokeWidth={2} />,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      features: [
        { name: 'The Framework', path: '/framework', icon: <Target className="h-4 w-4" /> },
        { name: 'Weekly Review', path: '/review', icon: <ClipboardCheck className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Wellbeing & Habits',
      description: 'Journal your thoughts, track your moods, and build lasting habits.',
      icon: <Smile className="h-6 w-6 text-primary" strokeWidth={2} />,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      features: [
        { name: 'Diary', path: '/diary', icon: <BookOpen className="h-4 w-4" /> },
        { name: 'Mood Tracker', path: '/mood', icon: <Smile className="h-4 w-4" /> },
        { name: 'Habit Tracker', path: '/habits', icon: <TrendingUp className="h-4 w-4" /> },
      ],
    },
    {
      title: 'Financial',
      description: 'Track income, manage expenses, and gain financial insights.',
      icon: <Wallet className="h-6 w-6 text-primary" strokeWidth={2} />,
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      features: [
        { name: 'Trelix Ledger', path: '/ledger', icon: <Wallet className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="lg" showText />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <div className="container max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Your Personal Command Center</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
              Welcome to Trelix
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The all-in-one platform for productivity, personal growth, and financial wellness.
            Everything you need to succeed, in one beautiful interface.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/tasks')}
              className="group gap-2 px-8"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="gap-2 px-8"
            >
              <BarChart3 className="h-4 w-4" />
              View Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, index) => (
            <SectionCard key={section.title} {...section} delay={0.2 + index * 0.1} />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-xl bg-blue-500/10 mb-4">
              <Layers className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold mb-2">8+</h3>
            <p className="text-muted-foreground">Powerful Features</p>
          </div>

          <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-xl bg-green-500/10 mb-4">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-2">100%</h3>
            <p className="text-muted-foreground">Privacy Focused</p>
          </div>

          <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="inline-flex p-3 rounded-xl bg-purple-500/10 mb-4">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold mb-2">∞</h3>
            <p className="text-muted-foreground">Possibilities</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center p-12 rounded-3xl border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your productivity?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Start organizing your life, tracking your progress, and achieving your goals with Trelix.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/tasks')}
            className="group gap-2 px-8"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Trelix. Built with ❤️ for productivity enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
