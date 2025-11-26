/**
 * Inspiration Card Component
 * Displays a single inspiration snippet with play/edit/delete actions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Edit, Trash2, ExternalLink, Pause } from 'lucide-react';
import { InspirationSnippet } from '@/types/inspiration';
import { getMoodColor, getMoodEmoji, getPlatformIcon, secondsToMMSS } from '@/utils/urlParser';
import { Button } from '@/components/ui/button';
import { MusicPlayer } from './MusicPlayer';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InspirationCardProps {
    snippet: InspirationSnippet;
    onPlay: (id: string) => void;
    onEdit: (snippet: InspirationSnippet) => void;
    onDelete: (id: string) => void;
}

export const InspirationCard = ({ snippet, onPlay, onEdit, onDelete }: InspirationCardProps) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);

    const handlePlayToggle = () => {
        if (!showPlayer) {
            onPlay(snippet.id);
        }
        setShowPlayer(!showPlayer);
    };

    const handlePlayExternal = () => {
        onPlay(snippet.id);
        // Open URL in new tab with timestamp
        let playUrl = snippet.url;
        if (snippet.platform === 'youtube' && snippet.timestamp) {
            playUrl = `${snippet.url}${snippet.url.includes('?') ? '&' : '?'}t=${snippet.timestamp}`;
        }
        window.open(playUrl, '_blank');
    };

    const moodGradient = getMoodColor(snippet.mood);
    const moodEmoji = getMoodEmoji(snippet.mood);
    const platformIcon = getPlatformIcon(snippet.platform);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: showPlayer ? 1 : 1.02 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{platformIcon}</span>
                            <h3 className="font-semibold text-lg truncate">{snippet.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{snippet.artist}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full bg-linear-to-r ${moodGradient} text-white text-xs font-medium flex items-center gap-1`}>
                        <span>{moodEmoji}</span>
                        <span className="capitalize">{snippet.mood}</span>
                    </div>
                </div>

                {/* Timestamp */}
                {snippet.timestamp !== undefined && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>⏱️</span>
                        <span>Starts at {secondsToMMSS(snippet.timestamp)}</span>
                        {snippet.endTimestamp && (
                            <span> - {secondsToMMSS(snippet.endTimestamp)}</span>
                        )}
                    </div>
                )}

                {/* Notes */}
                {snippet.notes && (
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                        "{snippet.notes}"
                    </p>
                )}

                {/* Tags */}
                {snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {snippet.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>🎧 {snippet.playCount} plays</span>
                    {snippet.lastPlayed && (
                        <span>Last played: {new Date(snippet.lastPlayed).toLocaleDateString()}</span>
                    )}
                </div>

                {/* Embedded Player */}
                {showPlayer && (
                    <MusicPlayer
                        snippet={snippet}
                        onClose={() => setShowPlayer(false)}
                    />
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button
                        onClick={handlePlayToggle}
                        className="flex-1 gap-2"
                        size="sm"
                        variant={showPlayer ? "secondary" : "default"}
                    >
                        {showPlayer ? (
                            <>
                                <Pause className="w-4 h-4" />
                                Hide Player
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Play Embedded
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => onEdit(snippet)}
                        variant="outline"
                        size="sm"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => setShowDeleteDialog(true)}
                        variant="outline"
                        size="sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={handlePlayExternal}
                        variant="ghost"
                        size="sm"
                        title="Open in new tab"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Inspiration?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{snippet.title}" by {snippet.artist}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(snippet.id);
                                setShowDeleteDialog(false);
                            }}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
