import { useState, useEffect, useMemo } from 'react';

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
  habitId: string;
  date: string; // ISO date (YYYY-MM-DD)
  completed: boolean;
  completedAt?: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // percentage
}

interface UseHabitTrackerReturn {
  habits: Habit[];
  dailyHabits: Habit[];
  weeklyHabits: Habit[];
  logs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  getHabitLogs: (habitId: string) => HabitLog[];
  getHabitStats: (habitId: string) => HabitStats;
  isHabitCompletedForDate: (habitId: string, date: string) => boolean;
  getTodayCompletionStatus: () => { completed: number; total: number };
  getWeekCompletionStatus: () => { completed: number; total: number };
}

const STORAGE_KEY_HABITS = 'trelix-habits';
const STORAGE_KEY_LOGS = 'trelix-habit-logs';

// Helper functions
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
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
    let currentDate = new Date(today);

    // Check if habit was completed today or yesterday
    const lastLog = new Date(completedLogs[0].date);
    lastLog.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return 0; // Streak broken

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
    // For weekly habits, check consecutive weeks
    const currentWeekStart = getWeekStart(today);
    const lastLogWeek = getWeekStart(new Date(completedLogs[0].date));

    // If last log is not from this week or last week, streak is broken
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

export const useHabitTracker = (): UseHabitTrackerReturn => {
  // Initialize habits from localStorage
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HABITS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load habits:', error);
      return [];
    }
  });

  // Initialize logs from localStorage
  const [logs, setLogs] = useState<HabitLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load habit logs:', error);
      return [];
    }
  });

  // Sync habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  }, [habits]);

  // Sync logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save habit logs:', error);
    }
  }, [logs]);

  // Computed values
  const dailyHabits = useMemo(() =>
    habits.filter(h => h.frequency === 'daily'),
    [habits]
  );

  const weeklyHabits = useMemo(() =>
    habits.filter(h => h.frequency === 'weekly'),
    [habits]
  );

  // Methods
  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(log => log.habitId !== id));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const existingLog = logs.find(
      log => log.habitId === habitId && log.date === date
    );

    if (existingLog) {
      // Toggle completion
      setLogs(prev =>
        prev.map(log =>
          log.habitId === habitId && log.date === date
            ? { ...log, completed: !log.completed, completedAt: !log.completed ? new Date().toISOString() : undefined }
            : log
        )
      );
    } else {
      // Create new log
      const newLog: HabitLog = {
        habitId,
        date,
        completed: true,
        completedAt: new Date().toISOString(),
      };
      setLogs(prev => [...prev, newLog]);
    }
  };

  const getHabitLogs = (habitId: string): HabitLog[] => {
    return logs.filter(log => log.habitId === habitId);
  };

  const isHabitCompletedForDate = (habitId: string, date: string): boolean => {
    const log = logs.find(log => log.habitId === habitId && log.date === date);
    return log?.completed ?? false;
  };

  const getHabitStats = (habitId: string): HabitStats => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        completionRate: 0,
      };
    }

    const habitLogs = getHabitLogs(habitId);
    const completedLogs = habitLogs.filter(log => log.completed);

    const currentStreak = calculateStreak(habitLogs, habit.frequency);
    const longestStreak = calculateLongestStreak(habitLogs, habit.frequency);
    const totalCompletions = completedLogs.length;

    // Calculate completion rate based on habit age
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let expectedCompletions = 0;
    if (habit.frequency === 'daily') {
      expectedCompletions = daysSinceCreation + 1;
    } else if (habit.frequency === 'weekly') {
      expectedCompletions = Math.floor(daysSinceCreation / 7) + 1;
    }

    const completionRate = expectedCompletions > 0
      ? (totalCompletions / expectedCompletions) * 100
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
    const todayDailyHabits = dailyHabits;
    const completed = todayDailyHabits.filter(h =>
      isHabitCompletedForDate(h.id, today)
    ).length;

    return {
      completed,
      total: todayDailyHabits.length,
    };
  };

  const getWeekCompletionStatus = () => {
    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const completed = weeklyHabits.filter(h => {
      const habitLogs = getHabitLogs(h.id);
      return habitLogs.some(
        log =>
          log.completed &&
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
