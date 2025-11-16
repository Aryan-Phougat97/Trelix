import { useState, useEffect, useMemo } from 'react';

// Types
export interface LedgerEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface CalculatorHistory {
  expression: string;
  result: number;
  timestamp: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalExpense: number;
  totalIncome: number;
  netChange: number;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
  weeklyData: WeeklySummary[];
  topCategory: string;
  dailyAverage: number;
}

export interface LedgerData {
  entries: LedgerEntry[];
  calculator: {
    history: CalculatorHistory[];
  };
}

// Categories with colors
export const EXPENSE_CATEGORIES = [
  { name: 'Food', color: '#f59e0b', icon: '🍔' },
  { name: 'Travel', color: '#3b82f6', icon: '✈️' },
  { name: 'Shopping', color: '#ec4899', icon: '🛍️' },
  { name: 'Bills', color: '#ef4444', icon: '📄' },
  { name: 'Subscriptions', color: '#8b5cf6', icon: '💳' },
  { name: 'Health', color: '#10b981', icon: '🏥' },
  { name: 'Entertainment', color: '#f97316', icon: '🎮' },
  { name: 'Other', color: '#6b7280', icon: '📦' },
];

export const INCOME_CATEGORIES = [
  { name: 'Salary', color: '#10b981', icon: '💼' },
  { name: 'Freelance', color: '#3b82f6', icon: '💻' },
  { name: 'Investment', color: '#8b5cf6', icon: '📈' },
  { name: 'Gift', color: '#ec4899', icon: '🎁' },
  { name: 'Other Income', color: '#6b7280', icon: '💰' },
];

const STORAGE_KEY = 'trelix-ledger';

// Helper functions
const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getMonthStart = (date: Date = new Date()): string => {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
};

const getMonthEnd = (date: Date = new Date()): string => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
};

const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const getWeekEnd = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 6;
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

export const useLedger = () => {
  // Initialize from localStorage
  const [data, setData] = useState<LedgerData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          entries: parsed.entries || [],
          calculator: {
            history: parsed.calculator?.history || [],
          },
        };
      }
      return {
        entries: [],
        calculator: { history: [] },
      };
    } catch (error) {
      console.error('Failed to load ledger:', error);
      return {
        entries: [],
        calculator: { history: [] },
      };
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save ledger:', error);
    }
  }, [data]);

  // Add entry
  const addEntry = (entry: Omit<LedgerEntry, 'id' | 'createdAt'>) => {
    const newEntry: LedgerEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));
  };

  // Update entry
  const updateEntry = (id: string, updates: Partial<LedgerEntry>) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    }));
  };

  // Delete entry
  const deleteEntry = (id: string) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== id),
    }));
  };

  // Calculator history management
  const addCalculatorHistory = (expression: string, result: number) => {
    const historyItem: CalculatorHistory = {
      expression,
      result,
      timestamp: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      calculator: {
        history: [historyItem, ...prev.calculator.history].slice(0, 10), // Keep last 10
      },
    }));
  };

  const clearCalculatorHistory = () => {
    setData((prev) => ({
      ...prev,
      calculator: { history: [] },
    }));
  };

  // Computed values
  const entries = useMemo(() => {
    return [...data.entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [data.entries]);

  const currentMonthEntries = useMemo(() => {
    const monthStart = getMonthStart();
    const monthEnd = getMonthEnd();
    return entries.filter((entry) => entry.date >= monthStart && entry.date <= monthEnd);
  }, [entries]);

  const currentWeekEntries = useMemo(() => {
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();
    return entries.filter((entry) => entry.date >= weekStart && entry.date <= weekEnd);
  }, [entries]);

  // Total calculations
  const totalIncome = useMemo(() => {
    return currentMonthEntries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthEntries]);

  const totalExpense = useMemo(() => {
    return currentMonthEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthEntries]);

  const netBalance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  const weeklyExpense = useMemo(() => {
    return currentWeekEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentWeekEntries]);

  const weeklyIncome = useMemo(() => {
    return currentWeekEntries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [currentWeekEntries]);

  // Category breakdown
  const categoryBreakdown = useMemo((): CategoryBreakdown[] => {
    const expenses = currentMonthEntries.filter((e) => e.type === 'expense');
    const total = totalExpense;

    if (total === 0) return [];

    const categoryMap = new Map<string, { amount: number; count: number }>();

    expenses.forEach((entry) => {
      const existing = categoryMap.get(entry.category) || { amount: 0, count: 0 };
      categoryMap.set(entry.category, {
        amount: existing.amount + entry.amount,
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: (data.amount / total) * 100,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthEntries, totalExpense]);

  // Top category
  const topCategory = useMemo(() => {
    if (categoryBreakdown.length === 0) return null;
    return categoryBreakdown[0];
  }, [categoryBreakdown]);

  // Weekly data for charts
  const weeklyData = useMemo((): WeeklySummary[] => {
    const weeks: WeeklySummary[] = [];
    const today = new Date();

    // Get last 4 weeks
    for (let i = 0; i < 4; i++) {
      const weekDate = new Date(today);
      weekDate.setDate(today.getDate() - i * 7);

      const weekStart = getWeekStart(weekDate);
      const weekEnd = getWeekEnd(weekDate);

      const weekEntries = entries.filter(
        (entry) => entry.date >= weekStart && entry.date <= weekEnd
      );

      const weekExpense = weekEntries
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);

      const weekIncome = weekEntries
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);

      weeks.unshift({
        weekStart,
        weekEnd,
        totalExpense: weekExpense,
        totalIncome: weekIncome,
        netChange: weekIncome - weekExpense,
      });
    }

    return weeks;
  }, [entries]);

  // Daily spending pattern (last 30 days)
  const dailySpending = useMemo(() => {
    const days: { date: string; expense: number; income: number }[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayEntries = entries.filter((entry) => entry.date === dateStr);

      const expense = dayEntries
        .filter((e) => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);

      const income = dayEntries
        .filter((e) => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0);

      days.push({ date: dateStr, expense, income });
    }

    return days;
  }, [entries]);

  // Daily average expense
  const dailyAverageExpense = useMemo(() => {
    if (currentMonthEntries.length === 0) return 0;
    const daysInMonth = new Date().getDate();
    return totalExpense / daysInMonth;
  }, [currentMonthEntries, totalExpense]);

  // Smart insights
  const insights = useMemo(() => {
    const tips: string[] = [];

    // Top category insight
    if (topCategory) {
      tips.push(
        `You spent the most on ${topCategory.category} this month (${topCategory.percentage.toFixed(1)}%).`
      );
    }

    // Weekly comparison
    const lastWeek = weeklyData[weeklyData.length - 2];
    const thisWeek = weeklyData[weeklyData.length - 1];

    if (lastWeek && thisWeek) {
      const diff = thisWeek.totalExpense - lastWeek.totalExpense;
      if (diff > 0) {
        tips.push(
          `This week's spending is ₹${diff.toFixed(0)} higher than last week.`
        );
      } else if (diff < 0) {
        tips.push(
          `You saved ₹${Math.abs(diff).toFixed(0)} compared to last week!`
        );
      }
    }

    // Subscription check
    const subscriptionCategory = categoryBreakdown.find(
      (c) => c.category === 'Subscriptions'
    );
    if (subscriptionCategory && totalExpense > 0) {
      const percentage = subscriptionCategory.percentage;
      if (percentage > 20) {
        tips.push(
          `Your subscriptions make up ${percentage.toFixed(0)}% of expenses.`
        );
      }
    }

    // Savings rate
    if (totalIncome > 0) {
      const savingsRate = (netBalance / totalIncome) * 100;
      if (savingsRate > 0) {
        tips.push(`You're saving ${savingsRate.toFixed(0)}% of your income this month.`);
      } else {
        tips.push(`You're spending more than you earn this month.`);
      }
    }

    // Daily average
    if (dailyAverageExpense > 0) {
      tips.push(`Your daily average spending is ₹${dailyAverageExpense.toFixed(0)}.`);
    }

    return tips;
  }, [
    topCategory,
    weeklyData,
    categoryBreakdown,
    totalExpense,
    totalIncome,
    netBalance,
    dailyAverageExpense,
  ]);

  // Monthly stats
  const monthlyStats: MonthlyStats = useMemo(
    () => ({
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown,
      weeklyData,
      topCategory: topCategory?.category || 'None',
      dailyAverage: dailyAverageExpense,
    }),
    [
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown,
      weeklyData,
      topCategory,
      dailyAverageExpense,
    ]
  );

  return {
    // Data
    entries,
    currentMonthEntries,
    currentWeekEntries,
    calculatorHistory: data.calculator.history,

    // Totals
    totalIncome,
    totalExpense,
    netBalance,
    weeklyExpense,
    weeklyIncome,

    // Analytics
    categoryBreakdown,
    topCategory,
    weeklyData,
    dailySpending,
    dailyAverageExpense,
    insights,
    monthlyStats,

    // CRUD methods
    addEntry,
    updateEntry,
    deleteEntry,

    // Calculator
    addCalculatorHistory,
    clearCalculatorHistory,
  };
};
