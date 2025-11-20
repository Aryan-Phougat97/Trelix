/**
 * URL Parser Utility for Music Platforms
 * Supports YouTube, Spotify, and SoundCloud
 */

import { ParsedURL, PlatformType } from '@/types/inspiration';

/**
 * Parse YouTube URL and extract video ID and timestamp
 * Supports formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&t=45s
 */
const parseYouTubeURL = (url: string): ParsedURL | null => {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            const id = match[1];

            // Extract timestamp if present
            let timestamp: number | undefined;
            const timeMatch = url.match(/[?&]t=(\d+)s?/);
            if (timeMatch) {
                timestamp = parseInt(timeMatch[1]);
            }

            return {
                platform: 'youtube',
                id,
                timestamp,
                isValid: true,
                embedUrl: `https://www.youtube.com/embed/${id}${timestamp ? `?start=${timestamp}` : ''}`,
            };
        }
    }

    return null;
};

/**
 * Parse Spotify URL and extract track ID
 * Supports formats:
 * - https://open.spotify.com/track/TRACK_ID
 * - https://open.spotify.com/track/TRACK_ID?si=...
 */
const parseSpotifyURL = (url: string): ParsedURL | null => {
    const pattern = /spotify\.com\/track\/([a-zA-Z0-9]{22})/;
    const match = url.match(pattern);

    if (match) {
        const id = match[1];
        return {
            platform: 'spotify',
            id,
            isValid: true,
            embedUrl: `https://open.spotify.com/embed/track/${id}`,
        };
    }

    return null;
};

/**
 * Parse SoundCloud URL
 * Note: SoundCloud URLs are more complex, this is a basic implementation
 */
const parseSoundCloudURL = (url: string): ParsedURL | null => {
    if (url.includes('soundcloud.com/')) {
        return {
            platform: 'soundcloud',
            id: url,
            isValid: true,
            embedUrl: url,
        };
    }
    return null;
};

/**
 * Main URL parser - detects platform and parses accordingly
 */
export const parseURL = (url: string): ParsedURL => {
    const trimmedUrl = url.trim();

    // Try YouTube
    const youtube = parseYouTubeURL(trimmedUrl);
    if (youtube) return youtube;

    // Try Spotify
    const spotify = parseSpotifyURL(trimmedUrl);
    if (spotify) return spotify;

    // Try SoundCloud
    const soundcloud = parseSoundCloudURL(trimmedUrl);
    if (soundcloud) return soundcloud;

    // Unknown/invalid URL
    return {
        platform: 'other',
        id: '',
        isValid: false,
    };
};

/**
 * Validate if URL is from a supported platform
 */
export const isValidMusicURL = (url: string): boolean => {
    const parsed = parseURL(url);
    return parsed.isValid;
};

/**
 * Convert seconds to MM:SS format
 */
export const secondsToMMSS = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert MM:SS format to seconds
 */
export const mmssToSeconds = (mmss: string): number => {
    const parts = mmss.split(':');
    if (parts.length !== 2) return 0;

    const mins = parseInt(parts[0]) || 0;
    const secs = parseInt(parts[1]) || 0;

    return mins * 60 + secs;
};

/**
 * Get platform icon/emoji
 */
export const getPlatformIcon = (platform: PlatformType): string => {
    const icons: Record<PlatformType, string> = {
        youtube: '📺',
        spotify: '🎵',
        soundcloud: '☁️',
        other: '🔗',
    };
    return icons[platform];
};

/**
 * Get mood color classes
 */
export const getMoodColor = (mood: string): string => {
    const colors: Record<string, string> = {
        motivational: 'from-red-500 to-orange-500',
        calm: 'from-blue-500 to-teal-500',
        energizing: 'from-yellow-500 to-purple-500',
        focus: 'from-cyan-500 to-blue-500',
    };
    return colors[mood] || 'from-gray-500 to-gray-600';
};

/**
 * Get mood emoji
 */
export const getMoodEmoji = (mood: string): string => {
    const emojis: Record<string, string> = {
        motivational: '🔥',
        calm: '🌊',
        energizing: '⚡',
        focus: '🎯',
    };
    return emojis[mood] || '🎵';
};
