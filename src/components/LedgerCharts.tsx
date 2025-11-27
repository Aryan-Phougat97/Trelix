import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { CategoryBreakdown, WeeklySummary } from '../hooks/useLedger';

interface LedgerChartsProps {
  categoryBreakdown: CategoryBreakdown[];
  weeklyData: WeeklySummary[];
  dailySpending: { date: string; expense: number; income: number }[];
}

export const LedgerCharts = ({
  categoryBreakdown,
  weeklyData,
  dailySpending,
}: LedgerChartsProps) => {
  const { theme } = useTheme();

  // Theme-aware colors
  const getThemeColors = () => {
    switch (theme) {
      case 'light':
        return {
          primary: '#3b82f6',
          secondary: '#ef4444',
          grid: '#00000010',
          text: '#1a1a1a',
          mutedText: '#1a1a1a60',
        };
      case 'dark':
      default:
        return {
          primary: '#3b82f6',
          secondary: '#ef4444',
          grid: '#ffffff10',
          text: '#ffffff',
          mutedText: '#ffffff60',
        };
    }
  };

  const colors = getThemeColors();

  // Category colors
  const categoryColors = [
    '#f59e0b', // Food
    '#3b82f6', // Travel
    '#ec4899', // Shopping
    '#ef4444', // Bills
    '#8b5cf6', // Subscriptions
    '#10b981', // Health
    '#f97316', // Entertainment
    '#6b7280', // Other
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="glass-card p-3 rounded-lg border border-border/50 shadow-lg"
          style={{
            backgroundColor:
              theme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-xs"
              style={{ color: entry.color || colors.primary }}
            >
              {entry.name}: ₹{typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format week label
  const formatWeekLabel = (weekStart: string) => {
    const date = new Date(weekStart);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format day label
  const formatDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Doughnut Chart - Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 border border-border/50"
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            Category Breakdown
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={categoryColors[index % categoryColors.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ color: colors.text, fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Line Chart - Daily Spending Pattern */}
      {dailySpending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6 border border-border/50"
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            Daily Spending Pattern (Last 30 Days)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDayLabel}
                  stroke={colors.mutedText}
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke={colors.mutedText}
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: colors.text, fontSize: '12px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke={colors.secondary}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: colors.secondary,
                    stroke: colors.secondary,
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke={colors.primary}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: colors.primary,
                    stroke: colors.primary,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Bar Chart - Weekly Breakdown */}
      {weeklyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 border border-border/50"
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
            Weekly Breakdown (Last 4 Weeks)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis
                  dataKey="weekStart"
                  tickFormatter={formatWeekLabel}
                  stroke={colors.mutedText}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke={colors.mutedText}
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: colors.text, fontSize: '12px' }}
                  iconType="square"
                />
                <Bar
                  dataKey="totalIncome"
                  name="Income"
                  fill={colors.primary}
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="totalExpense"
                  name="Expense"
                  fill={colors.secondary}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {categoryBreakdown.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 border border-border/50 text-center"
        >
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
            No Data to Display
          </h3>
          <p className="text-sm" style={{ color: colors.mutedText }}>
            Start adding expenses to see beautiful analytics
          </p>
        </motion.div>
      )}
    </div>
  );
};