import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { startOfWeek, endOfWeek, format, parseISO, isWithinInterval } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  date: string;
  duration: number; // in minutes
  taskId?: string;
}

export interface NoteActivity {
  date: string;
  wordCount: number;
}

export interface DayMetrics {
  date: string;
  tasksCompleted: number;
  focusMinutes: number;
  notesCount: number;
}

export interface WeeklyStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalFocusMinutes: number;
  averageFocusDuration: number;
  notesActivity: number;
  topProductivityDay: string;
  dailyMetrics: DayMetrics[];
}

interface AnalyticsContextType {
  weeklyStats: WeeklyStats;
  recordTaskCompletion: (taskId: string, task: Omit<Task, 'id'>) => void;
  recordFocusSession: (duration: number, taskId?: string) => void;
  recordNoteActivity: (wordCount: number) => void;
  getTasks: () => Task[];
  updateTasks: (tasks: Task[]) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  TASKS: 'analytics-tasks',
  FOCUS_SESSIONS: 'analytics-focus-sessions',
  NOTE_ACTIVITIES: 'analytics-note-activities',
};

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
    return stored ? JSON.parse(stored) : [];
  });

  const [noteActivities, setNoteActivities] = useState<NoteActivity[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTE_ACTIVITIES);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTE_ACTIVITIES, JSON.stringify(noteActivities));
  }, [noteActivities]);

  const calculateWeeklyStats = (): WeeklyStats => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Filter data for current week
    const weekTasks = tasks.filter((task) => {
      if (!task.createdAt) return false;
      const taskDate = parseISO(task.createdAt);
      return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
    });

    const weekCompletedTasks = weekTasks.filter((task) => {
      if (!task.completed || !task.completedAt) return false;
      const completedDate = parseISO(task.completedAt);
      return isWithinInterval(completedDate, { start: weekStart, end: weekEnd });
    });

    const weekFocusSessions = focusSessions.filter((session) => {
      const sessionDate = parseISO(session.date);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    });

    const weekNoteActivities = noteActivities.filter((activity) => {
      const activityDate = parseISO(activity.date);
      return isWithinInterval(activityDate, { start: weekStart, end: weekEnd });
    });

    // Calculate metrics
    const totalTasks = weekTasks.length;
    const completedTasks = weekCompletedTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const totalFocusMinutes = weekFocusSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageFocusDuration = weekFocusSessions.length > 0 ? totalFocusMinutes / weekFocusSessions.length : 0;
    const notesActivity = weekNoteActivities.reduce((sum, activity) => sum + activity.wordCount, 0);

    // Daily metrics for charts
    const dailyMetrics: DayMetrics[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'EEE');

      const dayTasksCompleted = weekCompletedTasks.filter((task) => {
        if (!task.completedAt) return false;
        return format(parseISO(task.completedAt), 'yyyy-MM-dd') === dateStr;
      }).length;

      const dayFocusMinutes = weekFocusSessions
        .filter((session) => format(parseISO(session.date), 'yyyy-MM-dd') === dateStr)
        .reduce((sum, session) => sum + session.duration, 0);

      const dayNotesCount = weekNoteActivities
        .filter((activity) => format(parseISO(activity.date), 'yyyy-MM-dd') === dateStr)
        .reduce((sum, activity) => sum + activity.wordCount, 0);

      dailyMetrics.push({
        date: dayName,
        tasksCompleted: dayTasksCompleted,
        focusMinutes: dayFocusMinutes,
        notesCount: dayNotesCount,
      });
    }

    // Find top productivity day
    const topDay = dailyMetrics.length > 0 ? dailyMetrics.reduce((max, day) => {
      const score = day.tasksCompleted * 2 + day.focusMinutes / 30;
      const maxScore = max.tasksCompleted * 2 + max.focusMinutes / 30;
      return score > maxScore ? day : max;
    }, dailyMetrics[0]) : null;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalFocusMinutes,
      averageFocusDuration,
      notesActivity,
      topProductivityDay: topDay?.date || 'N/A',
      dailyMetrics,
    };
  };

  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>(calculateWeeklyStats);

  // Recalculate stats when data changes
  useEffect(() => {
    setWeeklyStats(calculateWeeklyStats());
  }, [tasks, focusSessions, noteActivities]);

  const recordTaskCompletion = (taskId: string, taskData: Omit<Task, 'id'>) => {
    const now = new Date().toISOString();
    const existingTask = tasks.find((t) => t.id === taskId);

    if (existingTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, completed: true, completedAt: now }
            : t
        )
      );
    } else {
      // Add new completed task
      const newTask: Task = {
        id: taskId,
        ...taskData,
        completed: true,
        completedAt: now,
        createdAt: taskData.createdAt || now,
      };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const recordFocusSession = (duration: number, taskId?: string) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration,
      taskId,
    };
    setFocusSessions((prev) => [...prev, newSession]);
  };

  const recordNoteActivity = (wordCount: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingActivity = noteActivities.find((a) => a.date === today);

    if (existingActivity) {
      setNoteActivities((prev) =>
        prev.map((a) => (a.date === today ? { ...a, wordCount } : a))
      );
    } else {
      const newActivity: NoteActivity = {
        date: new Date().toISOString(),
        wordCount,
      };
      setNoteActivities((prev) => [...prev, newActivity]);
    }
  };

  const getTasks = () => tasks;

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        weeklyStats,
        recordTaskCompletion,
        recordFocusSession,
        recordNoteActivity,
        getTasks,
        updateTasks,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
