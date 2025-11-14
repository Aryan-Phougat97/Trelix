import { motion } from 'framer-motion';
import { BookOpen, Pen, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'today' | 'past';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const content =
    type === 'today'
      ? {
          icon: <Pen className="h-12 w-12 text-primary/60" strokeWidth={1.5} />,
          title: 'Start writing.',
          subtitle: 'Your clarity begins here.',
          description: 'Capture your thoughts, emotions, and experiences for today.',
        }
      : {
          icon: <BookOpen className="h-12 w-12 text-primary/60" strokeWidth={1.5} />,
          title: 'Your journey is waiting',
          subtitle: 'to be documented.',
          description: 'Begin your daily diary practice and watch your insights unfold.',
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mb-6"
      >
        {/* Icon with glow effect */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
          />
          <div className="relative bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8">
            {content.icon}
          </div>
        </div>

        {/* Sparkle decoration */}
        <motion.div
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="h-6 w-6 text-primary/40" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-3 max-w-md"
      >
        <h3 className="text-2xl font-bold text-foreground">
          {content.title}
          <br />
          <span className="text-primary">{content.subtitle}</span>
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {content.description}
        </p>
      </motion.div>

      {/* Decorative line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent max-w-xs"
      />
    </motion.div>
  );
};
