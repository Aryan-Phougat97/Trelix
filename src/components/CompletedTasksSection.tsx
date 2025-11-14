import { motion } from 'framer-motion';
import { CheckCircle2, Tag, Flag } from 'lucide-react';
import { useAnalytics, Task } from '@/contexts/AnalyticsContext';
import { useGoals } from '@/hooks/useGoals';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';

interface CompletedTasksSectionProps {
  weekOf: string;
}

export const CompletedTasksSection = ({ weekOf }: CompletedTasksSectionProps) => {
  const { getTasks } = useAnalytics();
  const { getGoalsByCategory } = useGoals();

  const weekStart = startOfWeek(parseISO(weekOf), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(parseISO(weekOf), { weekStartsOn: 1 });

  // Get completed tasks for the week
  const completedTasks = getTasks().filter((task: Task) => {
    if (!task.completed || !task.completedAt) return false;
    const completedDate = parseISO(task.completedAt);
    return isWithinInterval(completedDate, { start: weekStart, end: weekEnd });
  });

  // Get weekly goals (assuming they were completed in this week)
  const weeklyGoals = getGoalsByCategory('weekly');

  const categoryColors: Record<string, string> = {
    work: 'text-cool-blue border-cool-blue/30',
    personal: 'text-electric-red border-electric-red/30',
    goals: 'text-cool-blue border-cool-blue/30',
  };

  const priorityColors: Record<string, string> = {
    high: 'text-electric-red',
    medium: 'text-cool-blue',
    low: 'text-muted-foreground',
  };

  if (completedTasks.length === 0 && weeklyGoals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground italic">
          No completed tasks or goals to display for this week.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Completed Tasks ({completedTasks.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
            {completedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">{task.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 border rounded flex items-center gap-1 ${
                        categoryColors[task.category] || 'text-muted-foreground border-border'
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      {task.category}
                    </span>
                    <span
                      className={`flex items-center gap-1 ${
                        priorityColors[task.priority] || 'text-muted-foreground'
                      }`}
                    >
                      <Flag className="h-3 w-3" />
                      {task.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Goals Achieved */}
      {weeklyGoals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Weekly Goals ({weeklyGoals.length})
          </h4>
          <div className="space-y-2">
            {weeklyGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{goal.title}</p>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
