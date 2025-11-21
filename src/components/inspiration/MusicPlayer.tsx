/**
 * MusicPlayer Component
 * Embedded music player for YouTube, Spotify, and SoundCloud
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Loader2 } from 'lucide-react';
import { InspirationSnippet } from '@/types/inspiration';
import { parseURL } from '@/utils/urlParser';
import { Button } from '@/components/ui/button';

interface MusicPlayerProps {
    snippet: InspirationSnippet;
    onClose: () => void;
}

export const MusicPlayer = ({ snippet, onClose }: MusicPlayerProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const parsedUrl = parseURL(snippet.url);

    // Generate embed URL with timestamps
    const getEmbedUrl = () => {
        if (!parsedUrl.embedUrl) return '';

        let embedUrl = parsedUrl.embedUrl;

        // Handle YouTube timestamps
        if (parsedUrl.platform === 'youtube') {
            const params = new URLSearchParams();

            if (snippet.timestamp !== undefined) {
                params.set('start', snippet.timestamp.toString());
            }

            if (snippet.endTimestamp !== undefined) {
                params.set('end', snippet.endTimestamp.toString());
            }

            // Add autoplay and other YouTube parameters
            params.set('autoplay', '1');
            params.set('rel', '0'); // Don't show related videos
            params.set('modestbranding', '1'); // Minimal YouTube branding

            const baseUrl = embedUrl.split('?')[0];
            embedUrl = `${baseUrl}?${params.toString()}`;
        }

        // Handle Spotify with theme
        if (parsedUrl.platform === 'spotify') {
            embedUrl = `${embedUrl}?theme=0`; // Dark theme
        }

        return embedUrl;
    };

    const embedUrl = getEmbedUrl();

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const openExternal = () => {
        let playUrl = snippet.url;
        if (snippet.platform === 'youtube' && snippet.timestamp) {
            playUrl = `${snippet.url}${snippet.url.includes('?') ? '&' : '?'}t=${snippet.timestamp}`;
        }
        window.open(playUrl, '_blank');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="relative w-full bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-background/80 backdrop-blur-sm border-b border-border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium truncate">
                                Now Playing: {snippet.title}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                onClick={openExternal}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Open in new tab"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Close player"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Player Container */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        {/* Loading State */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Error State */}
                        {hasError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                                <div className="text-4xl">⚠️</div>
                                <div>
                                    <p className="font-semibold mb-1">Failed to load player</p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        The embedded player couldn't be loaded. Try opening it externally.
                                    </p>
                                    <Button onClick={openExternal} variant="outline" size="sm">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in {snippet.platform}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Iframe Player */}
                        {embedUrl && !hasError && (
                            <iframe
                                src={embedUrl}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={handleLoad}
                                onError={handleError}
                                title={`${snippet.title} - ${snippet.artist}`}
                            />
                        )}
                    </div>

                    {/* Platform Info */}
                    <div className="px-3 py-2 bg-background/80 backdrop-blur-sm border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="capitalize">
                                Playing from {snippet.platform}
                            </span>
                            {snippet.timestamp !== undefined && (
                                <span>
                                    Started at {Math.floor(snippet.timestamp / 60)}:{(snippet.timestamp % 60).toString().padStart(2, '0')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
