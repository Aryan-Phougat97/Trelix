import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag as TagIcon, Heart, Smile, Meh, Frown } from 'lucide-react';
import { DiaryEntry } from '@/hooks/useDiary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DiaryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, tags: string[], mood: DiaryEntry['mood']) => void;
  initialEntry?: DiaryEntry | null;
  date: string;
}

const moods: Array<{ value: DiaryEntry['mood']; icon: React.ReactNode; label: string; color: string }> = [
  { value: 'excellent', icon: <Heart className="h-5 w-5" />, label: 'Excellent', color: 'text-green-400' },
  { value: 'good', icon: <Smile className="h-5 w-5" />, label: 'Good', color: 'text-blue-400' },
  { value: 'neutral', icon: <Meh className="h-5 w-5" />, label: 'Neutral', color: 'text-yellow-400' },
  { value: 'poor', icon: <Frown className="h-5 w-5" />, label: 'Poor', color: 'text-red-400' },
];

export const DiaryEditorModal: React.FC<DiaryEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
  date,
}) => {
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState<DiaryEntry['mood']>(null);

  // Initialize form with existing entry data
  useEffect(() => {
    if (initialEntry) {
      setContent(initialEntry.content);
      setTags(initialEntry.tags || []);
      setMood(initialEntry.mood || null);
    } else {
      setContent('');
      setTags([]);
      setMood(null);
    }
  }, [initialEntry, isOpen]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content, tags, mood);
      onClose();
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border-2 border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {initialEntry ? 'Edit Entry' : 'New Entry'}
                    </h2>
                    <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-foreground/10 transition-colors"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Mood Selector */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    How are you feeling?
                  </label>
                  <div className="flex gap-3">
                    {moods.map((moodOption) => (
                      <motion.button
                        key={moodOption.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                          ${
                            mood === moodOption.value
                              ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                              : 'border-border/50 hover:border-border hover:bg-foreground/5'
                          }
                        `}
                        onClick={() => setMood(mood === moodOption.value ? null : moodOption.value)}
                      >
                        <span className={moodOption.color}>{moodOption.icon}</span>
                        <span className="text-xs text-muted-foreground">{moodOption.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Text Editor */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    Your thoughts
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing. Your clarity begins here..."
                    className="min-h-[300px] bg-background/50 border-border focus:border-primary resize-none text-[15px] leading-relaxed transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                    style={{
                      fontFamily: "'Inter', 'Poppins', sans-serif",
                      caretColor: 'hsl(var(--primary))',
                    }}
                    autoFocus
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge
                          variant="outline"
                          className="text-xs px-3 py-1 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          {tag} <X className="h-3 w-3 ml-1 inline" />
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a tag and press Enter..."
                    className="bg-background/50 border-border focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border p-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
