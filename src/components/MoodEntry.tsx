import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit3, Check, X, Plus } from 'lucide-react';
import { MoodType, MoodEntry as MoodEntryType, MOOD_EMOJIS, MOOD_SCORES } from '@/hooks/useMoodTracker';
import { toast } from 'sonner';

interface MoodEntryProps {
  todayEntry: MoodEntryType | null;
  onSave: (mood: MoodType, emoji: string, score: number, note?: string, tags?: string[]) => void;
}

const MOOD_OPTIONS: Array<{ mood: MoodType; label: string; color: string }> = [
  { mood: 'happy', label: 'Happy', color: 'from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30' },
  { mood: 'calm', label: 'Calm', color: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30' },
  { mood: 'neutral', label: 'Neutral', color: 'from-gray-500/20 to-slate-500/20 hover:from-gray-500/30 hover:to-slate-500/30' },
  { mood: 'confused', label: 'Confused', color: 'from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30' },
  { mood: 'low', label: 'Low', color: 'from-indigo-500/20 to-blue-600/20 hover:from-indigo-500/30 hover:to-blue-600/30' },
  { mood: 'frustrated', label: 'Frustrated', color: 'from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30' },
  { mood: 'tired', label: 'Tired', color: 'from-slate-500/20 to-gray-600/20 hover:from-slate-500/30 hover:to-gray-600/30' },
  { mood: 'motivated', label: 'Motivated', color: 'from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30' },
];

export const MoodEntry: React.FC<MoodEntryProps> = ({ todayEntry, onSave }) => {
  const [isEditing, setIsEditing] = useState(!todayEntry);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(todayEntry?.mood || null);
  const [note, setNote] = useState(todayEntry?.note || '');
  const [tags, setTags] = useState<string[]>(todayEntry?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [intensity, setIntensity] = useState(todayEntry?.score || 5);

  useEffect(() => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note || '');
      setTags(todayEntry.tags || []);
      setIntensity(todayEntry.score);
      setIsEditing(false);
    }
  }, [todayEntry]);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setIntensity(MOOD_SCORES[mood]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    onSave(
      selectedMood,
      MOOD_EMOJIS[selectedMood],
      intensity,
      note.trim() || undefined,
      tags.length > 0 ? tags : undefined
    );

    setIsEditing(false);
    toast.success(todayEntry ? 'Mood updated successfully' : 'Mood logged successfully');
  };

  const handleCancel = () => {
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note || '');
      setTags(todayEntry.tags || []);
      setIntensity(todayEntry.score);
      setIsEditing(false);
    } else {
      setSelectedMood(null);
      setNote('');
      setTags([]);
      setIntensity(5);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 hover:border-foreground/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            {todayEntry ? "Today's Mood" : 'Log Your Mood'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {todayEntry && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="hover:bg-foreground/5"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {/* Mood Grid */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground/80 mb-3 block">
          How are you feeling today?
        </label>
        <div className="grid grid-cols-4 gap-3">
          {MOOD_OPTIONS.map((option, index) => (
            <motion.button
              key={option.mood}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: isEditing ? 1.05 : 1 }}
              whileTap={{ scale: isEditing ? 0.95 : 1 }}
              onClick={() => isEditing && handleMoodSelect(option.mood)}
              disabled={!isEditing}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2
                ${isEditing ? 'cursor-pointer' : 'cursor-default'}
                ${
                  selectedMood === option.mood
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-border/50 hover:border-foreground/30'
                }
                bg-linear-to-br ${option.color}
              `}
            >
              {/* Emoji */}
              <span className="text-3xl">{MOOD_EMOJIS[option.mood]}</span>
              {/* Label */}
              <span className="text-xs font-medium text-foreground/80">{option.label}</span>
              {/* Selected Indicator */}
              <AnimatePresence>
                {selectedMood === option.mood && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <label className="text-sm font-medium text-foreground/80 mb-3 block">
            Intensity: {intensity}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            disabled={!isEditing}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </motion.div>
      )}

      {/* Note Input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground/80 mb-2 block">
          Quick Reflection (optional)
        </label>
        <Input
          placeholder="What's on your mind?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!isEditing}
          className="glass-input bg-background/50"
          maxLength={200}
        />
        {note && (
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {note.length}/200
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="text-sm font-medium text-foreground/80 mb-2 block">
          Tags (optional)
        </label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {tags.map((tag, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge
                variant="secondary"
                className="px-3 py-1 flex items-center gap-1 bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                {tag}
                {isEditing && (
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  />
                )}
              </Badge>
            </motion.div>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="glass-input bg-background/50"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <Button
            onClick={handleSave}
            disabled={!selectedMood}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4 mr-2" />
            Save Mood
          </Button>
          {todayEntry && (
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};
