import { useState, useEffect } from 'react';

export type MoodType = 'happy' | 'calm' | 'neutral' | 'confused' | 'low' | 'frustrated' | 'tired' | 'motivated';

export interface MoodEntry {
  id: string;
  date: string; // ISO date (YYYY-MM-DD)
  mood: MoodType;
  emoji: string;
  score: number; // 1-10 intensity scale
  note?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MoodFrequency {
  mood: MoodType;
  emoji: string;
  count: number;
  percentage: number;
}

export interface WeeklyTrend {
  date: string;
  score: number;
  mood: MoodType;
  emoji: string;
}

export interface UseMoodTrackerReturn {
  entries: MoodEntry[];
  todayEntry: MoodEntry | null;
  addOrUpdateEntry: (mood: MoodType, emoji: string, score: number, note?: string, tags?: string[]) => void;
  updateEntry: (date: string, updates: Partial<Omit<MoodEntry, 'id' | 'date' | 'createdAt'>>) => void;
  deleteEntry: (date: string) => void;
  getWeekEntries: () => MoodEntry[];
  getMonthEntries: () => MoodEntry[];
  getMoodFrequency: (period: 'week' | 'month') => MoodFrequency[];
  getWeeklyTrend: () => WeeklyTrend[];
  getDominantMood: (period: 'week' | 'month') => { mood: MoodType; emoji: string; count: number } | null;
}

const STORAGE_KEY = 'trelix-mood-tracker';

// Mood to emoji mapping
export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  calm: '🙂',
  neutral: '😐',
  confused: '😕',
  low: '😔',
  frustrated: '😡',
  tired: '😴',
  motivated: '🔥',
};

// Mood to score mapping (default intensity)
export const MOOD_SCORES: Record<MoodType, number> = {
  happy: 8,
  calm: 7,
  neutral: 5,
  confused: 4,
  low: 3,
  frustrated: 2,
  tired: 4,
  motivated: 9,
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const useMoodTracker = (): UseMoodTrackerReturn => {
  // Initialize entries from localStorage
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Sort by date descending (newest first)
        return parsed.sort((a: MoodEntry, b: MoodEntry) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
      return [];
    } catch (error) {
      console.error('Failed to load mood entries:', error);
      return [];
    }
  });

  // Sync to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save mood entries:', error);
    }
  }, [entries]);

  // Get today's entry
  const todayEntry = entries.find(entry => entry.date === getTodayDate()) || null;

  // Add or update mood entry for today
  const addOrUpdateEntry = (
    mood: MoodType,
    emoji: string,
    score: number,
    note?: string,
    tags?: string[]
  ) => {
    const today = getTodayDate();
    const now = new Date().toISOString();

    setEntries(prev => {
      const existingIndex = prev.findIndex(entry => entry.date === today);

      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          mood,
          emoji,
          score,
          note,
          tags,
          updatedAt: now,
        };
        return updated;
      }

      // Add new entry
      const newEntry: MoodEntry = {
        id: `mood-${Date.now()}`,
        date: today,
        mood,
        emoji,
        score,
        note,
        tags,
        createdAt: now,
        updatedAt: now,
      };

      return [newEntry, ...prev].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  };

  // Update any entry by date
  const updateEntry = (
    date: string,
    updates: Partial<Omit<MoodEntry, 'id' | 'date' | 'createdAt'>>
  ) => {
    setEntries(prev => {
      const index = prev.findIndex(entry => entry.date === date);
      if (index < 0) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
  };

  // Delete entry by date
  const deleteEntry = (date: string) => {
    setEntries(prev => prev.filter(entry => entry.date !== date));
  };

  // Get entries from the last 7 days
  const getWeekEntries = (): MoodEntry[] => {
    const weekAgo = getDateDaysAgo(7);
    return entries.filter(entry => entry.date >= weekAgo);
  };

  // Get entries from the last 30 days
  const getMonthEntries = (): MoodEntry[] => {
    const monthAgo = getDateDaysAgo(30);
    return entries.filter(entry => entry.date >= monthAgo);
  };

  // Calculate mood frequency for a period
  const getMoodFrequency = (period: 'week' | 'month'): MoodFrequency[] => {
    const periodEntries = period === 'week' ? getWeekEntries() : getMonthEntries();
    const total = periodEntries.length;

    if (total === 0) return [];

    const frequencyMap = new Map<MoodType, number>();

    periodEntries.forEach(entry => {
      frequencyMap.set(entry.mood, (frequencyMap.get(entry.mood) || 0) + 1);
    });

    const frequencies: MoodFrequency[] = Array.from(frequencyMap.entries()).map(([mood, count]) => ({
      mood,
      emoji: MOOD_EMOJIS[mood],
      count,
      percentage: Math.round((count / total) * 100),
    }));

    // Sort by count descending
    return frequencies.sort((a, b) => b.count - a.count);
  };

  // Get 7-day trend with scores
  const getWeeklyTrend = (): WeeklyTrend[] => {
    const trend: WeeklyTrend[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = getDateDaysAgo(i);
      const entry = entries.find(e => e.date === date);

      if (entry) {
        trend.push({
          date,
          score: entry.score,
          mood: entry.mood,
          emoji: entry.emoji,
        });
      } else {
        // Fill missing days with null data for continuity
        trend.push({
          date,
          score: 0,
          mood: 'neutral',
          emoji: '',
        });
      }
    }

    return trend;
  };

  // Get dominant mood for a period
  const getDominantMood = (period: 'week' | 'month'): { mood: MoodType; emoji: string; count: number } | null => {
    const frequencies = getMoodFrequency(period);

    if (frequencies.length === 0) return null;

    const dominant = frequencies[0];
    return {
      mood: dominant.mood,
      emoji: dominant.emoji,
      count: dominant.count,
    };
  };

  return {
    entries,
    todayEntry,
    addOrUpdateEntry,
    updateEntry,
    deleteEntry,
    getWeekEntries,
    getMonthEntries,
    getMoodFrequency,
    getWeeklyTrend,
    getDominantMood,
  };
};
