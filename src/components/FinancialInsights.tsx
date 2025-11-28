import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, Target, PiggyBank, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FinancialInsightsProps {
  insights: string[];
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  topCategory: { category: string; amount: number; percentage: number } | null;
}

export const FinancialInsights = ({
  insights,
  totalIncome,
  totalExpense,
  netBalance,
  topCategory,
}: FinancialInsightsProps) => {
  const { theme } = useTheme();

  const themeColor = 'oklch(var(--primary))';

  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
  const isOverspending = netBalance < 0;

  const getInsightIcon = (insight: string) => {
    if (insight.includes('saved') || insight.includes('saving')) {
      return <PiggyBank className="w-5 h-5" />;
    }
    if (insight.includes('higher') || insight.includes('spending more')) {
      return <AlertTriangle className="w-5 h-5" />;
    }
    if (insight.includes('most on')) {
      return <Target className="w-5 h-5" />;
    }
    return <Lightbulb className="w-5 h-5" />;
  };

  const getInsightColorClass = (insight: string) => {
    if (insight.includes('saved') || insight.includes('saving')) {
      return 'text-primary';
    }
    if (insight.includes('higher') || insight.includes('spending more')) {
      return 'text-brand-amber';
    }
    return 'text-primary';
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Savings Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass-card rounded-xl p-5 border border-border/50 ${isOverspending ? 'border-destructive/40' : 'border-primary/40'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Savings Rate</p>
              <h3
                className={`text-2xl font-bold ${isOverspending ? 'text-destructive' : 'text-primary'}`}
              >
                {savingsRate.toFixed(1)}%
              </h3>
            </div>
            {isOverspending ? (
              <TrendingDown className="w-6 h-6 text-destructive" />
            ) : (
              <TrendingUp className="w-6 h-6 text-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isOverspending
              ? 'Spending exceeds income'
              : 'Of income saved this month'}
          </p>
        </motion.div>

        {/* Top Spending Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-5 border border-primary/40"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Top Category</p>
              <h3
                className="text-xl font-bold truncate text-primary"
              >
                {topCategory?.category || 'None'}
              </h3>
            </div>
            <Target className="w-6 h-6 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory
              ? `₹${topCategory.amount.toLocaleString('en-IN')} (${topCategory.percentage.toFixed(1)}%)`
              : 'No expenses yet'}
          </p>
        </motion.div>

        {/* Monthly Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass-card rounded-xl p-5 border border-border/50 ${netBalance >= 0 ? 'border-primary/40' : 'border-destructive/40'}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
              <h3
                className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}
              >
                {netBalance >= 0 ? '+' : ''}₹{Math.abs(netBalance).toLocaleString('en-IN')}
              </h3>
            </div>
            <PiggyBank
              className={`w-6 h-6 ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}
            />
          </div>
          <p className="text-xs text-muted-foreground">This month's surplus/deficit</p>
        </motion.div>
      </div>

      {/* Smart Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Smart Insights</h3>
          </div>

          <div className="space-y-3">
            {insights.map((insight, index) => {
              const icon = getInsightIcon(insight);
              const colorClass = getInsightColorClass(insight);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:border-border/60 transition-all bg-background/30"
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-muted ${colorClass}`}
                  >
                    {icon}
                  </div>
                  <p className="text-sm text-foreground/90 pt-1">{insight}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {insights.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-8 border border-border/50 text-center"
        >
          <Lightbulb
            className="w-12 h-12 mx-auto mb-3 opacity-50 text-primary"
          />
          <p className="text-muted-foreground">
            Start tracking your expenses to see smart insights
          </p>
        </motion.div>
      )}
    </div>
  );
};
