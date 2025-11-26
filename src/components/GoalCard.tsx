import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Goal } from '@/hooks/useGoals';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard = ({ goal, onEdit, onDelete }: GoalCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-4 border border-border/50 hover:border-foreground/20 transition-all duration-300 group hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base font-semibold text-foreground truncate">
              {goal.title}
            </h4>
            {goal.description && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(goal.createdAt)}</span>
          </div>

          <AnimatePresence>
            {isExpanded && goal.description && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50">
                  {goal.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-cool-blue/10 hover:text-cool-blue transition-all duration-200 hover:scale-110"
            onClick={() => onEdit(goal)}
            title="Edit goal"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-electric-red/10 hover:text-electric-red transition-all duration-200 hover:scale-110"
            onClick={() => onDelete(goal.id)}
            title="Delete goal"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
