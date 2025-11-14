import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoalCard } from './GoalCard';
import { GoalModal } from './GoalModal';
import type { Goal, GoalCategory } from '@/hooks/useGoals';

interface GoalSectionProps {
  title: string;
  category: GoalCategory;
  goals: Goal[];
  onAddGoal: (goal: { title: string; description?: string; category: GoalCategory }) => void;
  onEditGoal: (id: string, updates: { title: string; description?: string }) => void;
  onDeleteGoal: (id: string) => void;
  index: number;
}

const emptyStateMessages: Record<GoalCategory, string> = {
  yearly: 'Set your North Star.',
  halfYearly: 'Define your mid-year direction.',
  monthly: 'Give this month its purpose.',
  weekly: 'Sharpen your weekly focus.',
};

const categoryIcons: Record<GoalCategory, React.ComponentType<any>> = {
  yearly: Target,
  halfYearly: TrendingUp,
  monthly: Calendar,
  weekly: Zap,
};

export const GoalSection = ({
  title,
  category,
  goals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  index,
}: GoalSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const Icon = categoryIcons[category];

  const handleSave = (goalData: { title: string; description?: string; category: GoalCategory }) => {
    if (editingGoal) {
      onEditGoal(editingGoal.id, {
        title: goalData.title,
        description: goalData.description,
      });
    } else {
      onAddGoal(goalData);
    }
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="glass-card rounded-xl p-6 border border-border/50"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">
                {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddNew}
            className="gap-2 bg-cool-blue hover:bg-cool-blue/90 text-white hover:scale-105 transition-all duration-200"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Icon className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground italic">
                {emptyStateMessages[category]}
              </p>
            </motion.div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={onDeleteGoal}
              />
            ))
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingGoal={editingGoal}
        category={category}
      />
    </>
  );
};
