import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Goal, GoalCategory } from '@/hooks/useGoals';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: { title: string; description?: string; category: GoalCategory }) => void;
  editingGoal?: Goal | null;
  category: GoalCategory;
}

const categoryLabels: Record<GoalCategory, string> = {
  yearly: 'Yearly Goal',
  halfYearly: 'Half-Yearly Goal',
  monthly: 'Monthly Goal',
  weekly: 'Weekly Goal',
};

export const GoalModal = ({ isOpen, onClose, onSave, editingGoal, category }: GoalModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div
              className="glass-card rounded-xl p-6 w-full max-w-md border border-border/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingGoal ? 'Edit Goal' : `New ${categoryLabels[category]}`}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-foreground/5"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="goal-title" className="block text-sm font-medium mb-2">
                    Goal Title
                  </label>
                  <Input
                    id="goal-title"
                    type="text"
                    placeholder="Enter your goal..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label htmlFor="goal-description" className="block text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="goal-description"
                    placeholder="Add more details about your goal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-cool-blue hover:bg-cool-blue/90 text-white"
                    disabled={!title.trim()}
                  >
                    {editingGoal ? 'Update' : 'Create'}
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
