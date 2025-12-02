import { useTable } from 'tinybase/ui-react';
import { store } from '../store';
import { InspirationSnippet, InspirationStats, MoodType, PlatformType } from '@/types/inspiration';
import { Row } from 'tinybase';

// DB Shape
interface InspirationRow {
  title: string;
  artist: string;
  url: string;
  platform: string;
  timestamp?: number;
  endTimestamp?: number;
  notes?: string;
  mood: string;
  tags: string; // Serialized
  playCount: number;
  lastPlayed?: string;
  createdAt: string;
}

export const useInspiration = () => {
  const inspirationTable = useTable('inspiration');

  const snippets: InspirationSnippet[] = Object.entries(inspirationTable).map(([id, row]) => {
    const dbRow = row as unknown as InspirationRow;
    return {
      id,
      title: dbRow.title,
      artist: dbRow.artist,
      url: dbRow.url,
      platform: dbRow.platform as PlatformType, // Cast to union type defined in types/inspiration
      timestamp: dbRow.timestamp,
      endTimestamp: dbRow.endTimestamp,
      notes: dbRow.notes,
      mood: dbRow.mood as MoodType,
      tags: dbRow.tags ? JSON.parse(dbRow.tags) : [],
      playCount: dbRow.playCount || 0,
      lastPlayed: dbRow.lastPlayed,
      createdAt: dbRow.createdAt,
    };
  });

  const totalPlays = snippets.reduce((sum, s) => sum + s.playCount, 0);
  
  const moodCounts: Record<string, number> = {};
  snippets.forEach(s => { moodCounts[s.mood] = (moodCounts[s.mood] || 0) + s.playCount; });
  
  const mostPlayedMoodEntry = Object.entries(moodCounts).reduce((a, b) => 
    b[1] > a[1] ? b : a, ['none', 0] as [string, number]
  );
  
  const mostPlayedMood = mostPlayedMoodEntry[0] === 'none' ? null : mostPlayedMoodEntry[0] as MoodType;

  const stats: InspirationStats = {
    totalSnippets: snippets.length,
    mostPlayedMood,
    totalPlays,
    recentlyAdded: snippets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(s => s.id),
  };

  const addSnippet = (snippet: Omit<InspirationSnippet, 'id' | 'createdAt' | 'playCount'>) => {
    const newRow: InspirationRow = {
      ...snippet,
      tags: JSON.stringify(snippet.tags),
      playCount: 0,
      createdAt: new Date().toISOString(),
    };
    store.addRow('inspiration', newRow as unknown as Row);
  };

  const updateSnippet = (id: string, updates: Partial<InspirationSnippet>) => {
    const rowUpdates: Partial<InspirationRow> = {};
    
    // Manual mapping for strict safety
    if (updates.title !== undefined) rowUpdates.title = updates.title;
    if (updates.artist !== undefined) rowUpdates.artist = updates.artist;
    if (updates.url !== undefined) rowUpdates.url = updates.url;
    if (updates.notes !== undefined) rowUpdates.notes = updates.notes;
    if (updates.mood !== undefined) rowUpdates.mood = updates.mood;
    if (updates.playCount !== undefined) rowUpdates.playCount = updates.playCount;
    if (updates.lastPlayed !== undefined) rowUpdates.lastPlayed = updates.lastPlayed;
    
    if (updates.tags !== undefined) {
      rowUpdates.tags = JSON.stringify(updates.tags);
    }

    store.setPartialRow('inspiration', id, rowUpdates);
  };

  const deleteSnippet = (id: string) => store.delRow('inspiration', id);

  const recordPlay = (id: string) => {
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
      store.setPartialRow('inspiration', id, {
        playCount: (snippet.playCount || 0) + 1,
        lastPlayed: new Date().toISOString()
      });
    }
  };

  const getByMood = (mood: MoodType) => snippets.filter(s => s.mood === mood);

  const getRandomSnippets = (count: number = 3) => {
    return [...snippets].sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const searchSnippets = (query: string) => {
    const lower = query.toLowerCase();
    return snippets.filter(s => 
      s.title.toLowerCase().includes(lower) || 
      s.artist.toLowerCase().includes(lower) ||
      s.tags.some(t => t.toLowerCase().includes(lower))
    );
  };

  return {
    snippets,
    stats,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    recordPlay,
    getByMood,
    getRandomSnippets,
    searchSnippets,
  };
};