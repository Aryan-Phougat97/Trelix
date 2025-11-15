import { motion } from 'framer-motion';
import { Trash2, Edit, Flame, Award, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Habit, HabitStats } from '../hooks/useHabitTracker';
import { useTheme } from '../contexts/ThemeContext';

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const HabitCard = ({
  habit,
  stats,
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Determine glow color based on theme
  const getGlowColor = () => {
    if (habit.color) return habit.color;
    switch (theme) {
      case 'cyber':
        return '#3b82f6';
      case 'mirage':
        return '#a78bfa';
      case 'zen':
        return '#10b981';
      case 'solar':
        return '#f59e0b';
      case 'calm':
        return '#60a5fa';
      default:
        return '#3b82f6';
    }
  };

  const glowColor = getGlowColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-4 border border-border/50 relative overflow-hidden"
      style={{
        borderColor: isCompleted ? `${glowColor}40` : undefined,
      }}
    >
      {/* Glow effect for completed habits */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}10 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Left side: Checkbox and content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Custom checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleComplete}
            className="flex-shrink-0 mt-0.5"
          >
            <motion.div
              animate={{
                scale: isCompleted ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isCompleted
                  ? 'border-transparent'
                  : 'border-border hover:border-primary'
              }`}
              style={{
                backgroundColor: isCompleted ? glowColor : 'transparent',
                boxShadow: isCompleted
                  ? `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}30`
                  : undefined,
              }}
            >
              {isCompleted && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </motion.div>
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-base transition-all duration-200 ${
                isCompleted
                  ? 'line-through text-muted-foreground'
                  : 'text-foreground'
              }`}
            >
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {habit.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {/* Current streak */}
              {stats.currentStreak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Flame
                    className="w-4 h-4"
                    style={{ color: glowColor }}
                  />
                  <span className="text-sm font-semibold" style={{ color: glowColor }}>
                    {stats.currentStreak}
                  </span>
                </motion.div>
              )}

              {/* Longest streak */}
              {stats.longestStreak > 0 && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Best: {stats.longestStreak}
                  </span>
                </div>
              )}

              {/* Completion rate */}
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {stats.completionRate.toFixed(0)}%
                </span>
              </div>

              {/* Frequency badge */}
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-primary/5 border-primary/20 text-primary"
              >
                {habit.frequency}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${glowColor}80, ${glowColor})`,
                  boxShadow: isDark ? `0 0 10px ${glowColor}60` : undefined,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-start gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 hover:bg-foreground/5"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
