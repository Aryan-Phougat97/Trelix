import { useTable } from 'tinybase/ui-react';
import { store } from '../store';

export type HabitFrequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  color?: string;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  completedAt?: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

// --- Helper Functions ---

const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const calculateStreak = (logs: HabitLog[], frequency: HabitFrequency): number => {
  if (logs.length === 0) return 0;

  const completedLogs = logs
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completedLogs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (frequency === 'daily') {
    const currentDate = new Date(today);
    // Check if habit was completed today or yesterday
    const lastLog = new Date(completedLogs[0].date);
    lastLog.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return 0;

    for (let i = 0; i < completedLogs.length; i++) {
      const logDate = new Date(completedLogs[i].date);
      logDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
  } else if (frequency === 'weekly') {
    const currentWeekStart = getWeekStart(today);
    const lastLogWeek = getWeekStart(new Date(completedLogs[0].date));
    const weekDiff = Math.floor(
      (new Date(currentWeekStart).getTime() - new Date(lastLogWeek).getTime()) / (1000 * 60 * 60 * 24 * 7)
    );

    if (weekDiff > 1) return 0;

    let previousWeek = getWeekStart(today);
    for (let i = 0; i < completedLogs.length; i++) {
      const logWeek = getWeekStart(new Date(completedLogs[i].date));
      if (logWeek === previousWeek) {
        streak++;
        const weekDate = new Date(previousWeek);
        weekDate.setDate(weekDate.getDate() - 7);
        previousWeek = getWeekStart(weekDate);
      } else {
        break;
      }
    }
  }
  return streak;
};

const calculateLongestStreak = (logs: HabitLog[], frequency: HabitFrequency): number => {
  if (logs.length === 0) return 0;

  const completedLogs = logs
    .filter(log => log.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (completedLogs.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedLogs.length; i++) {
    const prevDate = new Date(completedLogs[i - 1].date);
    const currDate = new Date(completedLogs[i].date);

    if (frequency === 'daily') {
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    } else if (frequency === 'weekly') {
      const prevWeek = getWeekStart(prevDate);
      const currWeek = getWeekStart(currDate);
      const prevWeekDate = new Date(prevWeek);
      prevWeekDate.setDate(prevWeekDate.getDate() + 7);
      const expectedNextWeek = getWeekStart(prevWeekDate);

      if (currWeek === expectedNextWeek) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (currWeek !== prevWeek) {
        currentStreak = 1;
      }
    }
  }
  return longestStreak;
};

// --- Hook Implementation ---

export const useHabitTracker = () => {
  // 1. READ DATA
  const habitsTable = useTable('habits');
  const logsTable = useTable('habit_logs');

  // Fix 1: Explicit cast to unknown then array to satisfy TypeScript
  const habits = Object.entries(habitsTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as Habit[];

  // Fix 2: Explicit cast for logs as well
  const logs = Object.entries(logsTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as HabitLog[];

  // 2. COMPUTED LISTS
  const dailyHabits = habits.filter(h => h.frequency === 'daily');
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly');

  // 3. ACTIONS
  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    store.addRow('habits', {
      ...habit,
      createdAt: new Date().toISOString(),
    });
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    store.setPartialRow('habits', id, updates);
  };

  const deleteHabit = (id: string) => {
    store.delRow('habits', id);
    // Cleanup logs
    logs
      .filter(log => log.habitId === id)
      .forEach(log => store.delRow('habit_logs', log.id));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const existingLog = logs.find(
      log => log.habitId === habitId && log.date === date
    );

    if (existingLog) {
      // Toggle off -> Delete log
      store.delRow('habit_logs', existingLog.id);
    } else {
      // Toggle on -> Create log
      store.addRow('habit_logs', {
        habitId,
        date,
        completed: true,
        completedAt: new Date().toISOString(), // This is optional in schema but good to store
      });
    }
  };

  // 4. READ HELPERS
  const getHabitLogs = (habitId: string): HabitLog[] => {
    return logs.filter(log => log.habitId === habitId);
  };

  const isHabitCompletedForDate = (habitId: string, date: string): boolean => {
    return logs.some(log => log.habitId === habitId && log.date === date);
  };

  const getHabitStats = (habitId: string): HabitStats => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { currentStreak: 0, longestStreak: 0, totalCompletions: 0, completionRate: 0 };

    const habitLogs = getHabitLogs(habitId);
    const currentStreak = calculateStreak(habitLogs, habit.frequency);
    const longestStreak = calculateLongestStreak(habitLogs, habit.frequency);
    const totalCompletions = habitLogs.length;

    // Calculate completion rate
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.max(1, Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    ));

    let expectedCompletions = 0;
    if (habit.frequency === 'daily') {
      expectedCompletions = daysSinceCreation;
    } else if (habit.frequency === 'weekly') {
      expectedCompletions = Math.max(1, Math.floor(daysSinceCreation / 7));
    }

    const completionRate = expectedCompletions > 0
      ? Math.round((totalCompletions / expectedCompletions) * 100)
      : 0;

    return {
      currentStreak,
      longestStreak,
      totalCompletions,
      completionRate: Math.min(completionRate, 100),
    };
  };

  const getTodayCompletionStatus = () => {
    const today = getTodayDate();
    const completed = dailyHabits.filter(h =>
      isHabitCompletedForDate(h.id, today)
    ).length;

    return {
      completed,
      total: dailyHabits.length,
    };
  };

  const getWeekCompletionStatus = () => {
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    // For weekly habits, we just check if there's ANY log in the current week window
    const completed = weeklyHabits.filter(h => {
      const habitLogs = getHabitLogs(h.id);
      return habitLogs.some(
        log =>
          log.date >= weekStart &&
          log.date <= weekEndStr
      );
    }).length;

    return {
      completed,
      total: weeklyHabits.length,
    };
  };

  return {
    habits,
    dailyHabits,
    weeklyHabits,
    logs,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitLogs,
    getHabitStats,
    isHabitCompletedForDate,
    getTodayCompletionStatus,
    getWeekCompletionStatus,
  };
};