import { useState } from 'react';
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

const GoalForm = ({
  onClose,
  onSave,
  editingGoal,
  category,
}: Omit<GoalModalProps, 'isOpen'>) => {
  const [title, setTitle] = useState(editingGoal?.title || '');
  const [description, setDescription] = useState(editingGoal?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      });
      onClose();
    }
  };

  return (
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
          onClick={onClose}
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!title.trim()}
          >
            {editingGoal ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const GoalModal = ({ isOpen, onClose, onSave, editingGoal, category }: GoalModalProps) => {
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <GoalForm 
              key={editingGoal ? editingGoal.id : 'new-goal'}
              onClose={onClose}
              onSave={onSave}
              editingGoal={editingGoal}
              category={category}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
