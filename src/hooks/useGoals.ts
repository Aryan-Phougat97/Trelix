import { useTable } from 'tinybase/ui-react';
import { store } from '../store';

export type GoalCategory = 'yearly' | 'halfYearly' | 'monthly' | 'weekly';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  createdAt: string;
}

export const useGoals = () => {
  // 1. READ DATA (Reactive)
  const goalsTable = useTable('goals');

  // Convert TinyBase object to Array with IDs
  const goals = Object.entries(goalsTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as Goal[];

  // 2. ACTIONS
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    store.addRow('goals', {
      ...goal,
      createdAt: new Date().toISOString(),
    });
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
    store.setPartialRow('goals', id, updates);
  };

  const deleteGoal = (id: string) => {
    store.delRow('goals', id);
  };

  // 3. HELPER
  const getGoalsByCategory = (category: GoalCategory): Goal[] => {
    return goals.filter((goal) => goal.category === category);
  };

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalsByCategory,
  };
};