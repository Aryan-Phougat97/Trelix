import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { useHabitTracker } from '@/hooks/useHabitTracker';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  FileText,
  Trophy,
  Info,
  Flame,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Dashboard = () => {
  const { weeklyStats } = useAnalytics();
  const {
    habits,
    dailyHabits,
    weeklyHabits,
    getTodayCompletionStatus,
    getWeekCompletionStatus,
    getHabitStats
  } = useHabitTracker();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Removed auto-seed for production - new users start with 0 values

  const statCards = [
    {
      icon: Target,
      label: 'Total Tasks',
      value: weeklyStats.totalTasks,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: CheckCircle2,
      label: 'Completion Rate',
      value: `${weeklyStats.completionRate.toFixed(1)}%`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Clock,
      label: 'Focus Hours',
      value: `${(weeklyStats.totalFocusMinutes / 60).toFixed(1)}h`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Avg Focus Duration',
      value: `${weeklyStats.averageFocusDuration.toFixed(0)}m`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: FileText,
      label: 'Notes Activity',
      value: weeklyStats.notesActivity,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Trophy,
      label: 'Top Day',
      value: weeklyStats.topProductivityDay,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 shadow-lg border border-border/50">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none animate-fade-in"></div>

      <div className="relative z-10">
        <Header />

        <div className="container max-w-7xl mx-auto px-8 py-6">
          {/* Page Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Productivity Dashboard
              </h1>
              <p className="text-muted-foreground">
                Your weekly performance at a glance
              </p>
            </div>

            <Dialog open={aboutModalOpen} onOpenChange={setAboutModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Info className="h-4 w-4" />
                  About v1.0
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2">
                    Trelix v1.0 - Smart Task Management SaaS
                  </DialogTitle>
                  <DialogDescription className="text-base space-y-4">
                    <div className="space-y-3 pt-4">
                      <h3 className="font-semibold text-foreground text-lg">
                        Platform Features
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>
                            <strong className="text-foreground">
                              Enterprise Task Management
                            </strong>{' '}
                            - Powerful task organization with categories, priorities, and intelligent deadline tracking for teams and individuals
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>
                            <strong className="text-foreground">
                              Focus Mode with Pomodoro
                            </strong>{' '}
                            - Boost productivity with deep work sessions, built-in Pomodoro timer, and ambient soundscapes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>
                            <strong className="text-foreground">
                              Smart Daily Notes
                            </strong>{' '}
                            - Capture insights and ideas with cloud-synced persistent storage
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>
                            <strong className="text-foreground">
                              Premium Theme Collection
                            </strong>{' '}
                            - 6 professionally designed themes: Cyber, Calm, Light, Solar, Mirage, and Zen modes for any workflow
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>
                            <strong className="text-foreground">
                              Real-time Analytics Dashboard
                            </strong>{' '}
                            - Track productivity metrics with interactive charts, trends, and actionable insights
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>
                            <strong className="text-foreground">
                              Polished User Experience
                            </strong>{' '}
                            - Fluid animations and intuitive design built with industry-leading technologies
                          </span>
                        </li>
                      </ul>

                      <div className="pt-4 border-t border-border/50">
                        <h3 className="font-semibold text-foreground mb-2">
                          Technologies Used
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {[
                            'React',
                            'TypeScript',
                            'Tailwind CSS',
                            'Framer Motion',
                            'Recharts',
                            'Radix UI',
                          ].map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Built with ❤️ for productivity enthusiasts
                        </p>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Habit Tracker Stats */}
          {habits.length > 0 && (
            <motion.div
              className="glass-card rounded-lg p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Habit Tracker Overview
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = '/habits')}
                >
                  View All Habits
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Habits */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Habits</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {habits.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dailyHabits.length} daily, {weeklyHabits.length} weekly
                  </p>
                </div>

                {/* Today's Progress */}
                <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <p className="text-2xl font-bold text-green-500">
                    {getTodayCompletionStatus().completed}/{getTodayCompletionStatus().total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getTodayCompletionStatus().total > 0
                      ? `${Math.round((getTodayCompletionStatus().completed / getTodayCompletionStatus().total) * 100)}% complete`
                      : 'No daily habits'}
                  </p>
                </div>

                {/* This Week */}
                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="h-5 w-5 text-purple-500" />
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-500">
                    {getWeekCompletionStatus().completed}/{getWeekCompletionStatus().total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getWeekCompletionStatus().total > 0
                      ? `${Math.round((getWeekCompletionStatus().completed / getWeekCompletionStatus().total) * 100)}% complete`
                      : 'No weekly habits'}
                  </p>
                </div>

                {/* Best Streak */}
                <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="h-5 w-5 text-orange-500" />
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-500">
                    {Math.max(...habits.map(h => getHabitStats(h.id).longestStreak), 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Days in a row
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Completion Chart */}
            <motion.div
              className="glass-card rounded-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Tasks Completed This Week
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStats.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="tasksCompleted"
                    fill="rgb(34, 197, 94)"
                    radius={[8, 8, 0, 0]}
                    name="Tasks"
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Focus Time Chart */}
            <motion.div
              className="glass-card rounded-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Focus Time Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyStats.dailyMetrics}>
                  <defs>
                    <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(168, 85, 247)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="rgb(168, 85, 247)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="focusMinutes"
                    stroke="rgb(168, 85, 247)"
                    fillOpacity={1}
                    fill="url(#focusGradient)"
                    name="Focus (min)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Combined Activity Chart */}
            <motion.div
              className="glass-card rounded-lg p-6 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Weekly Activity Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyStats.dailyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="currentColor" fontSize={12} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tasksCompleted"
                    stroke="rgb(34, 197, 94)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Tasks"
                  />
                  <Line
                    type="monotone"
                    dataKey="focusMinutes"
                    stroke="rgb(168, 85, 247)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Focus (min)"
                  />
                  <Line
                    type="monotone"
                    dataKey="notesCount"
                    stroke="rgb(6, 182, 212)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Notes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Insights Section */}
          <motion.div
            className="glass-card rounded-lg p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">
                  Most Productive Day
                </p>
                <p className="text-xl font-bold text-primary">
                  {weeklyStats.topProductivityDay}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">
                  Tasks to Go
                </p>
                <p className="text-xl font-bold text-green-500">
                  {weeklyStats.totalTasks - weeklyStats.completedTasks}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
