/**
 * Add/Edit Inspiration Modal
 * Form for creating and editing inspiration snippets
 */

import { useState } from 'react';
import { Link as LinkIcon, Music } from 'lucide-react';
import { InspirationSnippet, MoodType } from '@/types/inspiration';
import { parseURL, isValidMusicURL, mmssToSeconds, secondsToMMSS } from '@/utils/urlParser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AddInspirationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (snippet: Omit<InspirationSnippet, 'id' | 'createdAt' | 'playCount'>) => void;
    editingSnippet?: InspirationSnippet | null;
}

const MOODS: { value: MoodType; label: string; emoji: string; color: string }[] = [
    { value: 'motivational', label: 'Motivational', emoji: '🔥', color: 'from-red-500 to-orange-500' },
    { value: 'calm', label: 'Calm', emoji: '🌊', color: 'from-blue-500 to-teal-500' },
    { value: 'energizing', label: 'Energizing', emoji: '⚡', color: 'from-yellow-500 to-purple-500' },
    { value: 'focus', label: 'Focus', emoji: '🎯', color: 'from-cyan-500 to-blue-500' },
];

const AddInspirationForm = ({ onOpenChange, onSave, editingSnippet }: Omit<AddInspirationModalProps, 'open'>) => {
    const [url, setUrl] = useState(editingSnippet?.url || '');
    const [title, setTitle] = useState(editingSnippet?.title || '');
    const [artist, setArtist] = useState(editingSnippet?.artist || '');
    const [timestampInput, setTimestampInput] = useState(editingSnippet?.timestamp ? secondsToMMSS(editingSnippet.timestamp) : '');
    const [endTimestampInput, setEndTimestampInput] = useState(editingSnippet?.endTimestamp ? secondsToMMSS(editingSnippet.endTimestamp) : '');
    const [notes, setNotes] = useState(editingSnippet?.notes || '');
    const [mood, setMood] = useState<MoodType>(editingSnippet?.mood || 'motivational');
    const [tagsInput, setTagsInput] = useState(editingSnippet?.tags.join(', ') || '');
    const [urlError, setUrlError] = useState('');

    const handleURLChange = (value: string) => {
        setUrl(value);
        setUrlError('');

        if (value.trim()) {
            const parsed = parseURL(value);
            if (!parsed.isValid) {
                setUrlError('Invalid URL. Please use YouTube, Spotify, or SoundCloud links.');
            } else {
                // Auto-fill timestamp if found in URL
                if (parsed.timestamp) {
                    setTimestampInput(secondsToMMSS(parsed.timestamp));
                }
            }
        }
    };

    const handleSave = () => {
        // Validation
        if (!url.trim()) {
            toast.error('Please enter a URL');
            return;
        }

        if (!isValidMusicURL(url)) {
            toast.error('Invalid URL. Please use YouTube, Spotify, or SoundCloud links.');
            return;
        }

        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!artist.trim()) {
            toast.error('Please enter an artist name');
            return;
        }

        const parsed = parseURL(url);
        const timestamp = timestampInput ? mmssToSeconds(timestampInput) : undefined;
        const endTimestamp = endTimestampInput ? mmssToSeconds(endTimestampInput) : undefined;
        const tags = tagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const snippetData: Omit<InspirationSnippet, 'id' | 'createdAt' | 'playCount'> = {
            title: title.trim(),
            artist: artist.trim(),
            url: url.trim(),
            platform: parsed.platform,
            timestamp,
            endTimestamp,
            notes: notes.trim() || undefined,
            mood,
            tags,
            lastPlayed: editingSnippet?.lastPlayed,
        };

        onSave(snippetData);
        onOpenChange(false);
        toast.success(editingSnippet ? 'Inspiration updated!' : 'Inspiration added!');
    };

    return (
        <div className="space-y-6 py-4">
            {/* URL Input */}
            <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Music URL *
                </Label>
                <Input
                    id="url"
                    placeholder="https://www.youtube.com/watch?v=... or https://open.spotify.com/track/..."
                    value={url}
                    onChange={(e) => handleURLChange(e.target.value)}
                    className={urlError ? 'border-destructive' : ''}
                  />
                  {urlError && (
                    <p className="text-sm text-destructive">{urlError}</p>
                  )}
                <p className="text-xs text-muted-foreground">
                    Supports YouTube, Spotify, and SoundCloud
                </p>
            </div>

            {/* Title & Artist */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Song Title *</Label>
                    <Input
                        id="title"
                        placeholder="Eye of the Tiger"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="artist">Artist *</Label>
                    <Input
                        id="artist"
                        placeholder="Survivor"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                    />
                </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="timestamp">Start Time (MM:SS)</Label>
                    <Input
                        id="timestamp"
                        placeholder="1:30"
                        value={timestampInput}
                        onChange={(e) => setTimestampInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Optional: Jump to specific part
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endTimestamp">End Time (MM:SS)</Label>
                    <Input
                        id="endTimestamp"
                        placeholder="2:45"
                        value={endTimestampInput}
                        onChange={(e) => setEndTimestampInput(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Optional: For specific clips
                    </p>
                </div>
            </div>

            {/* Mood Selection */}
            <div className="space-y-2">
                <Label>Mood *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MOODS.map((moodOption) => (
                        <button
                            key={moodOption.value}
                            type="button"
                            onClick={() => setMood(moodOption.value)}
                            className={`p-3 rounded-lg border-2 transition-all ${mood === moodOption.value
                                    ? `border-primary bg-linear-to-r ${moodOption.color} text-foreground`
                                    : 'border-border hover:border-primary/50'
                                }`}
                        >
                            <div className="text-2xl mb-1">{moodOption.emoji}</div>
                            <div className="text-xs font-medium">{moodOption.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                    id="tags"
                    placeholder="workout, morning, pump-up (comma separated)"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    Add tags to organize your inspirations
                </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <Label htmlFor="notes">Personal Notes</Label>
                <Textarea
                    id="notes"
                    placeholder="Why this inspires you..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                    variant="outline"
                    onClick={() => {
                        onOpenChange(false);
                    }}
                >
                    Cancel
                </Button>
                <Button onClick={handleSave}>
                    {editingSnippet ? 'Update' : 'Add'} Inspiration
                </Button>
            </div>
        </div>
    );
};

export const AddInspirationModal = ({ open, onOpenChange, onSave, editingSnippet }: AddInspirationModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        {editingSnippet ? 'Edit Inspiration' : 'Add New Inspiration'}
                    </DialogTitle>
                    <DialogDescription>
                        Save your favorite music moments for quick access during work sessions
                    </DialogDescription>
                </DialogHeader>

                <AddInspirationForm 
                    key={editingSnippet ? editingSnippet.id : 'new-inspiration'}
                    onOpenChange={onOpenChange}
                    onSave={onSave}
                    editingSnippet={editingSnippet}
                />
            </DialogContent>
        </Dialog>
    );
};
