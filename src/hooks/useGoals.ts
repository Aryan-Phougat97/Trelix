import { useState, useEffect } from 'react';

export type GoalCategory = 'yearly' | 'halfYearly' | 'monthly' | 'weekly';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  createdAt: string;
}

interface UseGoalsReturn {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;
  deleteGoal: (id: string) => void;
  getGoalsByCategory: (category: GoalCategory) => Goal[];
}

const STORAGE_KEY = 'trelix-framework-goals';

export const useGoals = (): UseGoalsReturn => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load goals from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals to localStorage:', error);
    }
  }, [goals]);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

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
