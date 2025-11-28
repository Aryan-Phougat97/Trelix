/**
 * Inspiration Page
 * Main page for managing music inspiration snippets
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Shuffle, Music } from 'lucide-react';
import { useInspiration } from '@/hooks/useInspiration';
import { InspirationCard } from '@/components/inspiration/InspirationCard';
import { AddInspirationModal } from '@/components/inspiration/AddInspirationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InspirationSnippet, MoodType } from '@/types/inspiration';
import { getMoodEmoji } from '@/utils/urlParser';
import { toast } from 'sonner';

const MOOD_FILTERS: { value: 'all' | MoodType; label: string; emoji: string }[] = [
    { value: 'all', label: 'All', emoji: '🎵' },
    { value: 'motivational', label: 'Motivational', emoji: '🔥' },
    { value: 'calm', label: 'Calm', emoji: '🌊' },
    { value: 'energizing', label: 'Energizing', emoji: '⚡' },
    { value: 'focus', label: 'Focus', emoji: '🎯' },
];

const Inspiration = () => {
    const {
        snippets,
        stats,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        recordPlay,
        getByMood,
        getRandomSnippets,
        searchSnippets,
    } = useInspiration();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSnippet, setEditingSnippet] = useState<InspirationSnippet | null>(null);
    const [activeMood, setActiveMood] = useState<'all' | MoodType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter snippets
    const getFilteredSnippets = () => {
        let filtered = snippets;

        // Apply mood filter
        if (activeMood !== 'all') {
            filtered = getByMood(activeMood);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = searchSnippets(searchQuery);
        }

        return filtered;
    };

    const filteredSnippets = getFilteredSnippets();

    const handlePlay = (id: string) => {
        recordPlay(id);
        toast.success('Playing inspiration! 🎵');
    };

    const handleEdit = (snippet: InspirationSnippet) => {
        setEditingSnippet(snippet);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteSnippet(id);
        toast.success('Inspiration deleted');
    };

    const handleSave = (snippetData: Omit<InspirationSnippet, 'id' | 'createdAt' | 'playCount'>) => {
        if (editingSnippet) {
            updateSnippet(editingSnippet.id, snippetData);
        } else {
            addSnippet(snippetData);
        }
        setEditingSnippet(null);
    };

    const handleShuffle = () => {
        const random = getRandomSnippets(1)[0];
        if (random) {
            handlePlay(random.id);
        } else {
            toast.error('No inspirations saved yet!');
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] pointer-events-none animate-fade-in" />

            <div className="relative z-10 container max-w-7xl mx-auto px-8 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                            <Music className="w-8 h-8 text-primary" />
                            Inspiration Vault
                        </h1>
                        <p className="text-muted-foreground">
                            Your personal collection of motivational music moments
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleShuffle}
                            variant="outline"
                            className="gap-2"
                            disabled={snippets.length === 0}
                        >
                            <Shuffle className="w-4 h-4" />
                            Random
                        </Button>
                        <Button
                            onClick={() => {
                                setEditingSnippet(null);
                                setModalOpen(true);
                            }}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Inspiration
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                {stats.totalSnippets > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="glass-card rounded-lg p-6 mb-8"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-primary">{stats.totalSnippets}</p>
                                <p className="text-sm text-muted-foreground">Total Inspirations</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-brand-purple">{stats.totalPlays}</p>
                                <p className="text-sm text-muted-foreground">Total Plays</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-brand-cyan">
                                    {stats.mostPlayedMood ? getMoodEmoji(stats.mostPlayedMood) : '-'}
                                </p>
                                <p className="text-sm text-muted-foreground">Most Played Mood</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary">{stats.recentlyAdded.length}</p>
                                <p className="text-sm text-muted-foreground">Recently Added</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4 mb-8"
                >
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title, artist, tags, or notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Mood Filters */}
                    <div className="flex flex-wrap gap-2">
                        {MOOD_FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveMood(filter.value)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${activeMood === filter.value
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <span className="mr-2">{filter.emoji}</span>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Snippets Grid */}
                <AnimatePresence mode="popLayout">
                    {filteredSnippets.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card rounded-lg p-16 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-border flex items-center justify-center">
                                <Music className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                {searchQuery || activeMood !== 'all' ? 'No inspirations found' : 'No inspirations yet'}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery || activeMood !== 'all'
                                    ? 'Try adjusting your filters or search query'
                                    : 'Add your first music inspiration to get started'}
                            </p>
                            {!searchQuery && activeMood === 'all' && (
                                <Button
                                    onClick={() => {
                                        setEditingSnippet(null);
                                        setModalOpen(true);
                                    }}
                                    className="gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Your First Inspiration
                                </Button>
                            )}
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSnippets.map((snippet) => (
                                <InspirationCard
                                    key={snippet.id}
                                    snippet={snippet}
                                    onPlay={handlePlay}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add/Edit Modal */}
            <AddInspirationModal
                open={modalOpen}
                onOpenChange={(open) => {
                    setModalOpen(open);
                    if (!open) setEditingSnippet(null);
                }}
                onSave={handleSave}
                editingSnippet={editingSnippet}
            />
        </div>
    );
};

export default Inspiration;
