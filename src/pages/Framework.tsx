import { motion } from 'framer-motion';
import { GoalSection } from '@/components/GoalSection';
import { useGoals } from '@/hooks/useGoals';

const Framework = () => {
  const { addGoal, updateGoal, deleteGoal, getGoalsByCategory } = useGoals();

  const yearlyGoals = getGoalsByCategory('yearly');
  const halfYearlyGoals = getGoalsByCategory('halfYearly');
  const monthlyGoals = getGoalsByCategory('monthly');
  const weeklyGoals = getGoalsByCategory('weekly');

  const handleEditGoal = (id: string, updates: { title: string; description?: string }) => {
    updateGoal(id, updates);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] pointer-events-none animate-fade-in"></div>

      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-8 py-6">
          {/* Page Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              The Trelix Framework
            </h1>
            <p className="text-muted-foreground text-lg">
              Define your direction. Structure your growth.
            </p>
          </motion.div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalSection
              title="Yearly Goals"
              category="yearly"
              goals={yearlyGoals}
              onAddGoal={addGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={deleteGoal}
              index={0}
            />
            <GoalSection
              title="Half-Yearly Goals"
              category="halfYearly"
              goals={halfYearlyGoals}
              onAddGoal={addGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={deleteGoal}
              index={1}
            />
            <GoalSection
              title="Monthly Goals"
              category="monthly"
              goals={monthlyGoals}
              onAddGoal={addGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={deleteGoal}
              index={2}
            />
            <GoalSection
              title="Weekly Goals"
              category="weekly"
              goals={weeklyGoals}
              onAddGoal={addGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={deleteGoal}
              index={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Framework;
