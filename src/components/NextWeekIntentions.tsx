import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoals } from '@/hooks/useGoals';
import { toast } from 'sonner';
import type { Intention } from '@/hooks/useWeeklyReview';

interface NextWeekIntentionsProps {
  intentions: Intention[];
  onAddIntention: (text: string) => void;
  onRemoveIntention: (id: string) => void;
  onUpdateIntention: (id: string, text: string) => void;
}

export const NextWeekIntentions = ({
  intentions,
  onAddIntention,
  onRemoveIntention,
  onUpdateIntention,
}: NextWeekIntentionsProps) => {
  const [newIntention, setNewIntention] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const { addGoal } = useGoals();

  const handleAddIntention = () => {
    if (newIntention.trim()) {
      onAddIntention(newIntention.trim());
      setNewIntention('');
      toast.success('Intention added!', {
        duration: 2000,
      });
    }
  };

  const handleStartEdit = (intention: Intention) => {
    setEditingId(intention.id);
    setEditValue(intention.text);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdateIntention(id, editValue.trim());
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleConvertToGoal = (intention: Intention) => {
    addGoal({
      title: intention.text,
      category: 'weekly',
    });
    toast.success('Converted to Weekly Goal!', {
      description: 'Check The Trelix Framework to view your new goal.',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      {/* Add New Intention */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Write an intention for next week..."
          value={newIntention}
          onChange={(e) => setNewIntention(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddIntention();
            }
          }}
          className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
        />
        <Button
          onClick={handleAddIntention}
          disabled={!newIntention.trim()}
          className="bg-cool-blue hover:bg-cool-blue/90 text-white hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Intentions List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {intentions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground italic">
                Set your intentions for next week to stay focused.
              </p>
            </motion.div>
          ) : (
            intentions.map((intention, index) => (
              <motion.div
                key={intention.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all"
              >
                {editingId === intention.id ? (
                  <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(intention.id);
                      }
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditValue('');
                      }
                    }}
                    onBlur={() => handleSaveEdit(intention.id)}
                    autoFocus
                    className="flex-1 bg-background border-primary/50"
                  />
                ) : (
                  <>
                    <div
                      className="flex-1 text-sm text-foreground cursor-pointer"
                      onClick={() => handleStartEdit(intention)}
                    >
                      {intention.text}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-cool-blue/10 hover:text-cool-blue"
                        onClick={() => handleConvertToGoal(intention)}
                        title="Convert to Weekly Goal"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-electric-red/10 hover:text-electric-red"
                        onClick={() => onRemoveIntention(intention.id)}
                        title="Remove intention"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      {intentions.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center mt-4"
        >
          Click <ArrowRight className="inline h-3 w-3" /> to convert any intention to a Weekly Goal
        </motion.p>
      )}
    </div>
  );
};
