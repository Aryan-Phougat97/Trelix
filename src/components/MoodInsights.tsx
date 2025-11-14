import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoodEntry,
  MoodFrequency,
  WeeklyTrend,
  MoodType,
} from '@/hooks/useMoodTracker';
import { BarChart3, TrendingUp, Target, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface MoodInsightsProps {
  weekEntries: MoodEntry[];
  monthEntries: MoodEntry[];
  weekFrequency: MoodFrequency[];
  monthFrequency: MoodFrequency[];
  weeklyTrend: WeeklyTrend[];
  dominantWeekMood: { mood: MoodType; emoji: string; count: number } | null;
  dominantMonthMood: { mood: MoodType; emoji: string; count: number } | null;
}

const MOOD_COLORS: Record<MoodType, string> = {
  happy: '#f59e0b',
  calm: '#3b82f6',
  neutral: '#6b7280',
  confused: '#a855f7',
  low: '#4f46e5',
  frustrated: '#ef4444',
  tired: '#64748b',
  motivated: '#f97316',
};

export const MoodInsights: React.FC<MoodInsightsProps> = ({
  weekEntries,
  monthEntries,
  weekFrequency,
  monthFrequency,
  weeklyTrend,
  dominantWeekMood,
  dominantMonthMood,
}) => {
  const { theme } = useTheme();
  const [frequencyPeriod, setFrequencyPeriod] = useState<'week' | 'month'>('week');

  const isDark = theme !== 'light';

  // Calculate average intensity for the week
  const weekAverage =
    weekEntries.length > 0
      ? (weekEntries.reduce((sum, entry) => sum + entry.score, 0) / weekEntries.length).toFixed(1)
      : '0';

  // Calculate average intensity for the month
  const monthAverage =
    monthEntries.length > 0
      ? (monthEntries.reduce((sum, entry) => sum + entry.score, 0) / monthEntries.length).toFixed(1)
      : '0';

  const currentFrequency = frequencyPeriod === 'week' ? weekFrequency : monthFrequency;
  const dominantMood = frequencyPeriod === 'week' ? dominantWeekMood : dominantMonthMood;

  // Format weekly trend data for chart
  const trendData = weeklyTrend.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: day.score,
    mood: day.mood,
  }));

  if (weekEntries.length === 0 && monthEntries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Insights</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          Log more moods to see insights and trends.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dominant Mood Card */}
      {dominantMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Dominant Mood</h3>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">{dominantMood.emoji}</div>
            <p className="text-lg font-semibold text-foreground capitalize mb-1">
              {dominantMood.mood}
            </p>
            <p className="text-sm text-muted-foreground">
              This {frequencyPeriod} you felt mostly{' '}
              <span className="text-primary font-medium">{dominantMood.mood}</span>
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setFrequencyPeriod('week')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  frequencyPeriod === 'week'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setFrequencyPeriod('month')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  frequencyPeriod === 'month'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly Trend Chart */}
      {weeklyTrend.some((day) => day.score > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">7-Day Trend</h3>
              <p className="text-xs text-muted-foreground">Mood intensity over time</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#ffffff10' : '#00000010'}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke={isDark ? '#ffffff40' : '#00000040'}
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke={isDark ? '#ffffff40' : '#00000040'}
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#000000cc' : '#ffffffcc',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorScore)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Week Avg</p>
              <p className="text-lg font-semibold text-foreground">{weekAverage}/10</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Logs</p>
              <p className="text-lg font-semibold text-foreground">{weekEntries.length}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mood Frequency Bar Chart */}
      {currentFrequency.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Mood Frequency</h3>
              <p className="text-xs text-muted-foreground">
                How often each mood occurred this {frequencyPeriod}
              </p>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentFrequency} layout="horizontal">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#ffffff10' : '#00000010'}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke={isDark ? '#ffffff40' : '#00000040'}
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="emoji"
                  type="category"
                  stroke={isDark ? '#ffffff40' : '#00000040'}
                  style={{ fontSize: '16px' }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#000000cc' : '#ffffffcc',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} times (${props.payload.percentage}%)`,
                    props.payload.mood,
                  ]}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} animationDuration={1000}>
                  {currentFrequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood]} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Monthly Summary */}
      {monthEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Monthly Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground mb-2">Total Logs</p>
              <p className="text-2xl font-bold text-foreground">{monthEntries.length}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/5 border border-secondary/10">
              <p className="text-xs text-muted-foreground mb-2">Month Avg</p>
              <p className="text-2xl font-bold text-foreground">{monthAverage}/10</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
