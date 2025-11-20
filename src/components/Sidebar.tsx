import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
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
  Home,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Music,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Productivity Hub',
    icon: <CheckSquare className="h-4 w-4" />,
    items: [
      { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
      { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Planning & Goals',
    icon: <Target className="h-4 w-4" />,
    items: [
      { name: 'The Framework', path: '/framework', icon: <Target className="h-4 w-4" /> },
      { name: 'Weekly Review', path: '/review', icon: <ClipboardCheck className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Wellbeing & Habits',
    icon: <Smile className="h-4 w-4" />,
    items: [
      { name: 'Diary', path: '/diary', icon: <BookOpen className="h-4 w-4" /> },
      { name: 'Mood Tracker', path: '/mood', icon: <Smile className="h-4 w-4" /> },
      { name: 'Habit Tracker', path: '/habits', icon: <TrendingUp className="h-4 w-4" /> },
      { name: 'Inspiration', path: '/inspiration', icon: <Music className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Financial',
    icon: <Wallet className="h-4 w-4" />,
    items: [
      { name: 'Trelix Ledger', path: '/ledger', icon: <Wallet className="h-4 w-4" /> },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'Productivity Hub',
    'Planning & Goals',
    'Wellbeing & Habits',
    'Financial',
  ]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          x: isOpen ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border/50 z-50 overflow-hidden',
          'lg:relative lg:x-0'
        )}
      >
        <div className="flex flex-col h-full w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Logo size="sm" showText />
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              {isOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Home */}
            <Button
              variant={isActive('/') ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 mb-4',
                isActive('/') && 'bg-primary/10 text-primary hover:bg-primary/20'
              )}
              onClick={() => {
                navigate('/');
                if (window.innerWidth < 1024) onToggle();
              }}
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Button>

            {/* Sections */}
            {navSections.map((section) => {
              const isExpanded = expandedSections.includes(section.title);
              const hasActiveItem = section.items.some((item) => isActive(item.path));

              return (
                <div key={section.title} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors group',
                      hasActiveItem && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-muted-foreground group-hover:text-foreground transition-colors',
                        hasActiveItem && 'text-primary'
                      )}>
                        {section.icon}
                      </span>
                      <span className={cn(
                        'text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors',
                        hasActiveItem && 'text-primary'
                      )}>
                        {section.title}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </motion.div>
                  </button>

                  {/* Section Items */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-1 pl-2"
                      >
                        {section.items.map((item) => (
                          <Button
                            key={item.path}
                            variant={isActive(item.path) ? 'secondary' : 'ghost'}
                            className={cn(
                              'w-full justify-start gap-3 text-sm',
                              isActive(item.path) &&
                              'bg-primary/10 text-primary hover:bg-primary/20'
                            )}
                            onClick={() => {
                              navigate(item.path);
                              if (window.innerWidth < 1024) onToggle();
                            }}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                            {isActive(item.path) && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                              />
                            )}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground text-center">
              <p className="font-medium mb-1">Trelix v1.0</p>
              <p>© 2025 All rights reserved</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
