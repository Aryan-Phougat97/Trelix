import { CheckCircle2, Circle, Target, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsPanelProps {
  total: number;
  completed: number;
  pending: number;
}

export const StatsPanel = ({ total, completed, pending }: StatsPanelProps) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const motivationalQuotes = [
    "Focus on progress, not perfection.",
    "Small steps lead to big achievements.",
    "You're doing great! Keep going.",
    "Every completed task is a victory.",
    "Consistency is the key to success.",
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6 animate-fade-in">
      <div className="text-center mb-4">
        <p className="text-muted-foreground italic text-sm mb-2">💡 {randomQuote}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-2">
            <Circle className="h-6 w-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 mb-2">
            <Target className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{completed}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold gradient-text">{completionRate}%</span>
        </div>
        <Progress value={completionRate} className="h-3" />
      </div>

      {completionRate >= 80 && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-500 bg-green-500/10 rounded-lg p-3">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">You're on fire! 🔥</span>
        </div>
      )}
    </div>
  );
};
