import { useTable } from 'tinybase/ui-react';
import { store } from '../store';
import { Row } from 'tinybase';

// App Interface
export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood?: 'excellent' | 'good' | 'neutral' | 'poor' | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Database Interface 
interface DiaryRow {
  date: string;
  content: string;
  mood: string;
  tags: string; 
  createdAt: string;
  updatedAt: string;
}

export interface MonthGroup {
  month: string;
  monthKey: string;
  entries: DiaryEntry[];
}

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

const formatMonthYear = (dateStr: string): string => {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const groupEntriesByMonth = (entries: DiaryEntry[]): MonthGroup[] => {
  const groups = new Map<string, DiaryEntry[]>();
  entries.forEach(entry => {
    const monthKey = entry.date.substring(0, 7);
    if (!groups.has(monthKey)) groups.set(monthKey, []);
    groups.get(monthKey)!.push(entry);
  });
  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([monthKey, entries]) => ({
      month: formatMonthYear(monthKey + '-01'),
      monthKey,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
    }));
};

export const useDiary = () => {
  const diaryTable = useTable('diary');

  const entries: DiaryEntry[] = Object.entries(diaryTable).map(([id, row]) => {
    const dbRow = row as unknown as DiaryRow;
    return {
      id,
      date: dbRow.date,
      content: dbRow.content,
      mood: (dbRow.mood as DiaryEntry['mood']) || null,
      tags: dbRow.tags ? JSON.parse(dbRow.tags) : [],
      createdAt: dbRow.createdAt,
      updatedAt: dbRow.updatedAt,
    };
  });

  const todayDate = getTodayDate();
  const todayEntry = entries.find(entry => entry.date === todayDate) || null;
  const pastEntries = entries
    .filter(entry => entry.date < todayDate)
    .sort((a, b) => b.date.localeCompare(a.date));
  const monthGroups = groupEntriesByMonth(pastEntries);

  const addEntry = (
    date: string,
    content: string,
    tags: string[] = [],
    mood: DiaryEntry['mood'] = null
  ) => {
    const now = new Date().toISOString();
    const existing = entries.find(e => e.date === date);

    if (existing) {
      updateEntry(date, { content, tags, mood });
    } else {
      const newRow: DiaryRow = {
        date,
        content,
        mood: mood || '',
        tags: JSON.stringify(tags),
        createdAt: now,
        updatedAt: now,
      };
      store.addRow('diary', newRow as unknown as Row);
    }
  };

  const updateEntry = (
    date: string,
    updates: Partial<Pick<DiaryEntry, 'content' | 'tags' | 'mood'>>
  ) => {
    const entry = entries.find(e => e.date === date);
    if (!entry) return;

    // Explicitly map partial updates to DB row format
    const rowUpdates: Partial<DiaryRow> = {
      updatedAt: new Date().toISOString()
    };
    
    if (updates.content !== undefined) rowUpdates.content = updates.content;
    if (updates.mood !== undefined) rowUpdates.mood = updates.mood || '';
    if (updates.tags !== undefined) rowUpdates.tags = JSON.stringify(updates.tags);

    store.setPartialRow('diary', entry.id, rowUpdates);
  };

  const deleteEntry = (date: string) => {
    const entry = entries.find(e => e.date === date);
    if (entry) store.delRow('diary', entry.id);
  };

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