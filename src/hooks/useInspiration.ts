/**
 * useInspiration Hook
 * Manages inspiration snippets with LocalStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { InspirationSnippet, InspirationStats, MoodType } from '@/types/inspiration';

const STORAGE_KEY = 'inspiration_snippets';
const STATS_KEY = 'inspiration_stats';

export const useInspiration = () => {
    const [snippets, setSnippets] = useState<InspirationSnippet[]>([]);
    const [stats, setStats] = useState<InspirationStats>({
        totalSnippets: 0,
        mostPlayedMood: null,
        totalPlays: 0,
        recentlyAdded: [],
    });

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedSnippets = localStorage.getItem(STORAGE_KEY);
        const savedStats = localStorage.getItem(STATS_KEY);

        if (savedSnippets) {
            setSnippets(JSON.parse(savedSnippets));
        }
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    // Update stats
    const updateStats = useCallback(() => {
        const totalPlays = snippets.reduce((sum, s) => sum + s.playCount, 0);

        // Find most played mood
        const moodCounts: Record<MoodType, number> = {
            motivational: 0,
            calm: 0,
            energizing: 0,
            focus: 0,
        };

        snippets.forEach(s => {
            moodCounts[s.mood] += s.playCount;
        });

        const mostPlayedMood = Object.entries(moodCounts).reduce((a, b) =>
            b[1] > a[1] ? b : a
        )[0] as MoodType;

        const recentlyAdded = snippets
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(s => s.id);

        const newStats: InspirationStats = {
            totalSnippets: snippets.length,
            mostPlayedMood: snippets.length > 0 ? mostPlayedMood : null,
            totalPlays,
            recentlyAdded,
        };

        setStats(newStats);
        localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    }, [snippets]);

    // Save to LocalStorage whenever snippets change
    useEffect(() => {
        if (snippets.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
            updateStats();
        }
    }, [snippets, updateStats]);

    // Add new snippet
    const addSnippet = useCallback((snippet: Omit<InspirationSnippet, 'id' | 'createdAt' | 'playCount'>) => {
        const newSnippet: InspirationSnippet = {
            ...snippet,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            playCount: 0,
        };

        setSnippets(prev => [newSnippet, ...prev]);
        return newSnippet;
    }, []);

    // Update existing snippet
    const updateSnippet = useCallback((id: string, updates: Partial<InspirationSnippet>) => {
        setSnippets(prev =>
            prev.map(snippet =>
                snippet.id === id ? { ...snippet, ...updates } : snippet
            )
        );
    }, []);

    // Delete snippet
    const deleteSnippet = useCallback((id: string) => {
        setSnippets(prev => prev.filter(snippet => snippet.id !== id));
    }, []);

    // Record play
    const recordPlay = useCallback((id: string) => {
        setSnippets(prev =>
            prev.map(snippet =>
                snippet.id === id
                    ? {
                        ...snippet,
                        playCount: snippet.playCount + 1,
                        lastPlayed: new Date().toISOString(),
                    }
                    : snippet
            )
        );
    }, []);

    // Get snippets by mood
    const getByMood = useCallback((mood: MoodType) => {
        return snippets.filter(s => s.mood === mood);
    }, [snippets]);

    // Get random snippets
    const getRandomSnippets = useCallback((count: number = 3) => {
        const shuffled = [...snippets].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }, [snippets]);

    // Search snippets
    const searchSnippets = useCallback((query: string) => {
        const lowerQuery = query.toLowerCase();
        return snippets.filter(s =>
            s.title.toLowerCase().includes(lowerQuery) ||
            s.artist.toLowerCase().includes(lowerQuery) ||
            s.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            s.notes?.toLowerCase().includes(lowerQuery)
        );
    }, [snippets]);

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