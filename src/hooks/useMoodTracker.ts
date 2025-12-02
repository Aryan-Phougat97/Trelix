import { useTable } from 'tinybase/ui-react';
import { store } from '../store';

export type MoodType = 'happy' | 'calm' | 'neutral' | 'confused' | 'low' | 'frustrated' | 'tired' | 'motivated';

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  emoji: string;
  score: number;
  note?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// DB Shape
interface MoodRow {
  date: string;
  mood: string;
  emoji: string;
  score: number;
  note: string;
  tags: string; // Serialized
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

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊', calm: '🙂', neutral: '😐', confused: '😕',
  low: '😔', frustrated: '😡', tired: '😴', motivated: '🔥',
};

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

const getTodayDate = (): string => new Date().toISOString().split('T')[0];
const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const useMoodTracker = () => {
  const moodTable = useTable('mood_logs');

  const entries: MoodEntry[] = Object.entries(moodTable).map(([id, row]) => {
    const dbRow = row as unknown as MoodRow;
    return {
      id,
      date: dbRow.date,
      mood: dbRow.mood as MoodType,
      emoji: dbRow.emoji,
      score: dbRow.score,
      note: dbRow.note || undefined,
      tags: dbRow.tags ? JSON.parse(dbRow.tags) : [],
      createdAt: dbRow.createdAt,
      updatedAt: dbRow.updatedAt,
    };
  });

  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const todayEntry = entries.find(entry => entry.date === getTodayDate()) || null;

  const addOrUpdateEntry = (
    mood: MoodType, emoji: string, score: number, note?: string, tags?: string[]
  ) => {
    const today = getTodayDate();
    const now = new Date().toISOString();
    const existing = entries.find(e => e.date === today);

    const rowData: Omit<MoodRow, 'createdAt'> = {
      date: today,
      mood,
      emoji,
      score,
      note: note || '',
      tags: JSON.stringify(tags || []),
      updatedAt: now,
    };

    if (existing) {
      store.setPartialRow('mood_logs', existing.id, rowData);
    } else {
      store.addRow('mood_logs', { ...rowData, createdAt: now });
    }
  };

  const getWeekEntries = () => {
    const weekAgo = getDateDaysAgo(7);
    return entries.filter(entry => entry.date >= weekAgo);
  };

  const getMonthEntries = () => {
    const monthAgo = getDateDaysAgo(30);
    return entries.filter(entry => entry.date >= monthAgo);
  };

  const getMoodFrequency = (period: 'week' | 'month'): MoodFrequency[] => {
    const periodEntries = period === 'week' ? getWeekEntries() : getMonthEntries();
    const total = periodEntries.length;
    if (total === 0) return [];

    const frequencyMap = new Map<MoodType, number>();
    periodEntries.forEach(entry => {
      frequencyMap.set(entry.mood, (frequencyMap.get(entry.mood) || 0) + 1);
    });

    return Array.from(frequencyMap.entries()).map(([mood, count]) => ({
      mood,
      emoji: MOOD_EMOJIS[mood],
      count,
      percentage: Math.round((count / total) * 100),
    })).sort((a, b) => b.count - a.count);
  };

  const getWeeklyTrend = (): WeeklyTrend[] => {
    const trend: WeeklyTrend[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = getDateDaysAgo(i);
      const entry = entries.find(e => e.date === date);
      trend.push({
        date,
        score: entry ? entry.score : 0,
        mood: entry ? entry.mood : ('neutral' as MoodType),
        emoji: entry ? entry.emoji : '',
      });
    }
    return trend;
  };

  const getDominantMood = (period: 'week' | 'month') => {
    const frequencies = getMoodFrequency(period);
    return frequencies.length > 0 ? { ...frequencies[0] } : null;
  };

  return {
    entries,
    todayEntry,
    addOrUpdateEntry,
    updateEntry: () => {},
    deleteEntry: () => {},
    getWeekEntries,
    getMonthEntries,
    getMoodFrequency,
    getWeeklyTrend,
    getDominantMood,
  };
};