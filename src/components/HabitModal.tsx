import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Habit, HabitFrequency } from '../hooks/useHabitTracker';
import { useTheme } from '../contexts/ThemeContext';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  editingHabit?: Habit | null;
}

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#a78bfa', // Purple
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
];

export const HabitModal = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}: HabitModalProps) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description || '');
      setFrequency(editingHabit.frequency);
      setSelectedColor(editingHabit.color || PRESET_COLORS[0]);
    } else {
      setTitle('');
      setDescription('');
      setFrequency('daily');
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [editingHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      frequency,
      color: selectedColor,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setSelectedColor(PRESET_COLORS[0]);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setSelectedColor(PRESET_COLORS[0]);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
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
              className="glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">
                    {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="hover:bg-foreground/5"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="habit-title" className="text-sm font-medium">
                    Habit Title *
                  </label>
                  <input
                    id="habit-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Drink 8 glasses of water"
                    className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    autoFocus
                    maxLength={60}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="habit-description" className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <textarea
                    id="habit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a short description..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    maxLength={150}
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFrequency('daily')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        frequency === 'daily'
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 bg-background/30 hover:border-border'
                      }`}
                    >
                      <div className="text-sm font-semibold">Daily</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Every day
                      </div>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFrequency('weekly')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        frequency === 'weekly'
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 bg-background/30 hover:border-border'
                      }`}
                    >
                      <div className="text-sm font-semibold">Weekly</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Once a week
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Color picker */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accent Color</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <motion.button
                        key={color}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className="relative w-10 h-10 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: color,
                          borderColor:
                            selectedColor === color ? color : 'transparent',
                          boxShadow:
                            selectedColor === color
                              ? `0 0 0 2px var(--background), 0 0 20px ${color}60`
                              : undefined,
                        }}
                      >
                        {selectedColor === color && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 text-white absolute inset-0 m-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </motion.svg>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Privacy note */}
                <p className="text-xs text-muted-foreground italic">
                  Your habits are stored locally and remain private.
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!title.trim()}
                    className="flex-1"
                  >
                    {editingHabit ? 'Save Changes' : 'Create Habit'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
