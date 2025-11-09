import { useEffect, useState } from "react";

interface StatsPanelProps {
  total: number;
  completed: number;
  pending: number;
}

export const StatsPanel = ({ total, completed, pending }: StatsPanelProps) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const [prevStats, setPrevStats] = useState({ total, completed, pending });

  useEffect(() => {
    setPrevStats({ total, completed, pending });
  }, [total, completed, pending]);

  return (
    <div className="glass-card rounded-lg p-6 space-y-8 animate-slide-up sticky top-24">
      {/* Minimal Metrics Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center border-r border-border/50 last:border-0">
          <p className={`text-3xl font-bold text-foreground tracking-tight transition-all duration-300 ${prevStats.total !== total ? 'animate-number-change' : ''}`}>
            {total}
          </p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Total</p>
        </div>

        <div className="text-center border-r border-border/50 last:border-0">
          <p className={`text-3xl font-bold text-cool-blue tracking-tight transition-all duration-300 ${prevStats.pending !== pending ? 'animate-number-change' : ''}`}>
            {pending}
          </p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Active</p>
        </div>

        <div className="text-center">
          <p className={`text-3xl font-bold text-electric-red tracking-tight transition-all duration-300 ${prevStats.completed !== completed ? 'animate-number-change' : ''}`}>
            {completed}
          </p>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">Done</p>
        </div>
      </div>

      {/* Progress Bar with Gradient */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-bold gradient-text transition-all duration-300">{completionRate}%</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-electric-red to-cool-blue transition-all duration-700 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* On Fire Indicator */}
      {completionRate >= 80 && (
        <div className="text-center pt-4 border-t border-border/50 animate-bounce-in">
          <p className="text-sm text-electric-red font-semibold tracking-tight animate-pulse">
            🔥 ON FIRE
          </p>
        </div>
      )}
    </div>
  );
};
