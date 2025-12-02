/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { startOfWeek, endOfWeek, format, parseISO, isWithinInterval } from 'date-fns';
import { useTable } from 'tinybase/ui-react';
import { store } from '../store';

// Keep interfaces for type safety
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
  id: string;
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

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  // 1. READ DATA (Reactive from TinyBase)
  const tasksTable = useTable('tasks');
  const focusSessionsTable = useTable('focus_sessions');
  const noteActivitiesTable = useTable('note_activities');

  // Convert to Arrays
  const tasks = Object.entries(tasksTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as Task[];

  const focusSessions = Object.entries(focusSessionsTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as FocusSession[];

  const noteActivities = Object.entries(noteActivitiesTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as NoteActivity[];

  // 2. CALCULATE STATS
  const weeklyStats = useMemo((): WeeklyStats => {
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
    const totalFocusMinutes = weekFocusSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageFocusDuration = weekFocusSessions.length > 0 ? totalFocusMinutes / weekFocusSessions.length : 0;
    const notesActivity = weekNoteActivities.reduce((sum, activity) => sum + (activity.wordCount || 0), 0);

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
        .reduce((sum, session) => sum + (session.duration || 0), 0);

      const dayNotesCount = weekNoteActivities
        .filter((activity) => format(parseISO(activity.date), 'yyyy-MM-dd') === dateStr)
        .reduce((sum, activity) => sum + (activity.wordCount || 0), 0);

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
  }, [tasks, focusSessions, noteActivities]);

  // 3. ACTIONS (Write to DB)
  
  // NOTE: Tasks are now managed by useTasks.ts, so this might be redundant, 
  // but we keep it compatible with existing calls.
  const recordTaskCompletion = (taskId: string, taskData: Omit<Task, 'id'>) => {
    // In the new architecture, useTasks handles the toggle. 
    // This function is kept just in case other components call it for logging purposes.
    // If we purely rely on the 'tasks' table state, we don't strictly need to do anything here
    // unless we are logging a separate "completion event" history.
    // For V1 simplicity, we assume the task update in DB is enough.
    console.log("Task completion recorded via AnalyticsContext", taskId);
  };

  const recordFocusSession = (duration: number, taskId?: string) => {
    store.addRow('focus_sessions', {
      date: new Date().toISOString(),
      duration,
      taskId: taskId || '',
    });
  };

  const recordNoteActivity = (wordCount: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Check if we already have an activity record for today
    // (Had to scan the array because TinyBase IDs are random)
    const existingActivity = noteActivities.find((a) => a.date.startsWith(today));

    if (existingActivity) {
      store.setCell('note_activities', existingActivity.id, 'wordCount', wordCount);
    } else {
      store.addRow('note_activities', {
        date: new Date().toISOString(),
        wordCount,
      });
    }
  };

  const getTasks = () => tasks;

  // won't have to manually update state
  const updateTasks = () => {};

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