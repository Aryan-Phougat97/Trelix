import { useState, useEffect } from 'react';

export interface DiaryEntry {
  id: string;
  date: string; // ISO date (YYYY-MM-DD) - one entry per day
  content: string;
  mood?: 'excellent' | 'good' | 'neutral' | 'poor' | null;
  tags?: string[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface MonthGroup {
  month: string; // e.g., "November 2025"
  monthKey: string; // e.g., "2025-11"
  entries: DiaryEntry[];
}

interface UseDiaryReturn {
  entries: DiaryEntry[];
  todayEntry: DiaryEntry | null;
  pastEntries: DiaryEntry[];
  monthGroups: MonthGroup[];
  addEntry: (date: string, content: string, tags?: string[], mood?: DiaryEntry['mood']) => void;
  updateEntry: (date: string, updates: Partial<Pick<DiaryEntry, 'content' | 'tags' | 'mood'>>) => void;
  deleteEntry: (date: string) => void;
  getEntryByDate: (date: string) => DiaryEntry | null;
}

const STORAGE_KEY = 'trelix-daily-diary';

const getTodayDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
};

const formatMonthYear = (dateStr: string): string => {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const groupEntriesByMonth = (entries: DiaryEntry[]): MonthGroup[] => {
  const groups = new Map<string, DiaryEntry[]>();

  entries.forEach(entry => {
    const monthKey = entry.date.substring(0, 7); // YYYY-MM
    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    groups.get(monthKey)!.push(entry);
  });

  // Convert to array and sort by month (newest first)
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([monthKey, entries]) => ({
      month: formatMonthYear(monthKey + '-01'),
      monthKey,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)), // Sort entries within month (newest first)
    }));
};

export const useDiary = (): UseDiaryReturn => {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert old format to new if needed
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load diary entries:', error);
      return [];
    }
  });

  // Sync to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save diary entries:', error);
    }
  }, [entries]);

  // Get today's entry
  const todayDate = getTodayDate();
  const todayEntry = entries.find(entry => entry.date === todayDate) || null;

  // Get past entries (excluding today)
  const pastEntries = entries
    .filter(entry => entry.date < todayDate)
    .sort((a, b) => b.date.localeCompare(a.date)); // Sort descending (newest first)

  // Get month groups for past entries
  const monthGroups = groupEntriesByMonth(pastEntries);

  // Add a new entry
  const addEntry = (
    date: string,
    content: string,
    tags: string[] = [],
    mood: DiaryEntry['mood'] = null
  ) => {
    const now = new Date().toISOString();
    const newEntry: DiaryEntry = {
      id: `${date}-${Date.now()}`,
      date,
      content,
      tags,
      mood,
      createdAt: now,
      updatedAt: now,
    };

    setEntries(prev => {
      // Check if entry for this date already exists
      const existingIndex = prev.findIndex(e => e.date === date);
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = {
          ...prev[existingIndex],
          content,
          tags,
          mood,
          updatedAt: now,
        };
        return updated;
      }
      // Add new entry
      return [...prev, newEntry];
    });
  };

  // Update an existing entry
  const updateEntry = (
    date: string,
    updates: Partial<Pick<DiaryEntry, 'content' | 'tags' | 'mood'>>
  ) => {
    setEntries(prev => {
      const index = prev.findIndex(e => e.date === date);
      if (index === -1) return prev;

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
  };

  // Delete an entry
  const deleteEntry = (date: string) => {
    setEntries(prev => prev.filter(entry => entry.date !== date));
  };

  // Get entry by specific date
  const getEntryByDate = (date: string): DiaryEntry | null => {
    return entries.find(entry => entry.date === date) || null;
  };

  return {
    entries,
    todayEntry,
    pastEntries,
    monthGroups,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryByDate,
  };
};
