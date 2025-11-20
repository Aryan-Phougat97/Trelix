/**
 * Inspiration Snippet Type Definitions
 */

export type MoodType = 'motivational' | 'calm' | 'energizing' | 'focus';
export type PlatformType = 'youtube' | 'spotify' | 'soundcloud' | 'other';

export interface InspirationSnippet {
    id: string;
    title: string;
    artist: string;
    url: string;
    platform: PlatformType;
    timestamp?: number;        // Start time in seconds
    endTimestamp?: number;     // Optional end time in seconds
    notes?: string;
    mood: MoodType;
    tags: string[];
    createdAt: string;
    lastPlayed?: string;
    playCount: number;
}

export interface InspirationStats {
    totalSnippets: number;
    mostPlayedMood: MoodType | null;
    totalPlays: number;
    recentlyAdded: string[];   // IDs of recently added snippets
}

export interface ParsedURL {
    platform: PlatformType;
    id: string;
    timestamp?: number;
    isValid: boolean;
    embedUrl?: string;
}
