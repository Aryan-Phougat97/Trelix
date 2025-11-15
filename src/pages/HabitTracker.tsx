import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, ChevronDown, ChevronUp, Sparkles, Flame, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { HabitCard } from '../components/HabitCard';
import { HabitModal } from '../components/HabitModal';
import { useHabitTracker, Habit } from '../hooks/useHabitTracker';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const HabitTracker = () => {
  const { theme } = useTheme();
  const {
    dailyHabits,
    weeklyHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitStats,
    isHabitCompletedForDate,
    getTodayCompletionStatus,
    getWeekCompletionStatus,
  } = useHabitTracker();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isDailyExpanded, setIsDailyExpanded] = useState(true);
  const [isWeeklyExpanded, setIsWeeklyExpanded] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // Get completion status
  const todayStatus = getTodayCompletionStatus();
  const weekStatus = getWeekCompletionStatus();

  // Check if all daily habits are completed
  const allDailyCompleted = todayStatus.total > 0 && todayStatus.completed === todayStatus.total;

  const handleAddHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    addHabit(habit);
    toast.success('Habit created!', {
      description: `${habit.title} has been added to your ${habit.frequency} habits.`,
    });
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updates: Omit<Habit, 'id' | 'createdAt'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, updates);
      toast.success('Habit updated!');
      setEditingHabit(null);
    }
  };

  const handleDeleteHabit = (habit: Habit) => {
    if (confirm(`Are you sure you want to delete "${habit.title}"?`)) {
      deleteHabit(habit.id);
      toast.success('Habit deleted', {
        description: 'Your habit has been removed.',
      });
    }
  };

  const handleToggleCompletion = (habitId: string) => {
    const wasCompleted = isHabitCompletedForDate(habitId, today);
    toggleHabitCompletion(habitId, today);

    if (!wasCompleted) {
      // Check if this completion makes all habits complete
      const newStatus = getTodayCompletionStatus();
      if (newStatus.total > 0 && newStatus.completed === newStatus.total) {
        // Trigger confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#a78bfa', '#10b981', '#f59e0b'],
        });
        toast.success('All habits completed!', {
          description: '🎉 Amazing work! You completed all your daily habits!',
        });
      } else {
        toast.success('Habit marked complete!');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-12 px-4"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="glass-card rounded-2xl p-8 border border-border/50 relative overflow-hidden">
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-96 h-96 opacity-20 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${
                  theme === 'mirage'
                    ? '#a78bfa'
                    : theme === 'zen'
                    ? '#10b981'
                    : theme === 'solar'
                    ? '#f59e0b'
                    : '#3b82f6'
                } 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold">Habit Tracker</h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Build consistency. Strengthen discipline.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-background/40 rounded-lg p-4 border border-border/30">
                  <div className="text-sm text-muted-foreground mb-1">Today's Progress</div>
                  <div className="text-2xl font-bold">
                    {todayStatus.completed}/{todayStatus.total}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {todayStatus.total > 0
                      ? `${Math.round((todayStatus.completed / todayStatus.total) * 100)}% complete`
                      : 'No daily habits'}
                  </div>
                </div>

                <div className="bg-background/40 rounded-lg p-4 border border-border/30">
                  <div className="text-sm text-muted-foreground mb-1">This Week</div>
                  <div className="text-2xl font-bold">
                    {weekStatus.completed}/{weekStatus.total}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {weekStatus.total > 0
                      ? `${Math.round((weekStatus.completed / weekStatus.total) * 100)}% complete`
                      : 'No weekly habits'}
                  </div>
                </div>

                <div className="bg-background/40 rounded-lg p-4 border border-border/30">
                  <div className="text-sm text-muted-foreground mb-1">Total Habits</div>
                  <div className="text-2xl font-bold">
                    {dailyHabits.length + weeklyHabits.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dailyHabits.length} daily, {weeklyHabits.length} weekly
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Daily Habits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsDailyExpanded(!isDailyExpanded)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">
                  Daily Habits ({dailyHabits.length})
                </h2>
                {isDailyExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <Button
                onClick={() => {
                  setEditingHabit(null);
                  setIsModalOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </Button>
            </div>

            <AnimatePresence>
              {isDailyExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  {dailyHabits.length > 0 ? (
                    dailyHabits.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <HabitCard
                          habit={habit}
                          stats={getHabitStats(habit.id)}
                          isCompleted={isHabitCompletedForDate(habit.id, today)}
                          onToggleComplete={() => handleToggleCompletion(habit.id)}
                          onEdit={() => handleEditHabit(habit)}
                          onDelete={() => handleDeleteHabit(habit)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card rounded-xl p-12 text-center border border-border/50"
                    >
                      <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">No daily habits yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start building consistency by creating your first daily habit.
                      </p>
                      <Button
                        onClick={() => {
                          setEditingHabit(null);
                          setIsModalOpen(true);
                        }}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Habit
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Weekly Habits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsWeeklyExpanded(!isWeeklyExpanded)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Flame className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">
                  Weekly Habits ({weeklyHabits.length})
                </h2>
                {isWeeklyExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <Button
                onClick={() => {
                  setEditingHabit(null);
                  setIsModalOpen(true);
                }}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </Button>
            </div>

            <AnimatePresence>
              {isWeeklyExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  {weeklyHabits.length > 0 ? (
                    weeklyHabits.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <HabitCard
                          habit={habit}
                          stats={getHabitStats(habit.id)}
                          isCompleted={isHabitCompletedForDate(habit.id, today)}
                          onToggleComplete={() => handleToggleCompletion(habit.id)}
                          onEdit={() => handleEditHabit(habit)}
                          onDelete={() => handleDeleteHabit(habit)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card rounded-xl p-12 text-center border border-border/50"
                    >
                      <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">No weekly habits yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add habits you want to practice once a week.
                      </p>
                      <Button
                        onClick={() => {
                          setEditingHabit(null);
                          setIsModalOpen(true);
                        }}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Weekly Habit
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Privacy notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground text-center italic"
          >
            Your habits are stored locally and remain private.
          </motion.p>
        </div>
      </div>

      {/* Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={editingHabit ? handleSaveEdit : handleAddHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
};
