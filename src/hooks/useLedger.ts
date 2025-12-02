import { useTable, useMetric } from 'tinybase/ui-react';
import { store } from '../store';

// Keep your interfaces (I modified them slightly for TinyBase)
export interface LedgerEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface CalculatorHistory {
  expression: string;
  result: number;
  timestamp: string;
}
export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalExpense: number;
  totalIncome: number;
  netChange: number;
}

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

export const useLedger = () => {
  // 1. READ DATA
  // This automatically re-renders when the 'ledger' table changes
  const ledgerTable = useTable('ledger');
  
  // Convert the TinyBase object to an Array 
  const entries = Object.entries(ledgerTable).map(([id, data]) => ({
    id,
    ...data,
  })) as LedgerEntry[];

  // Sort by date (Newest first)
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 2. READ METRICS
  // These update instantly using the definitions in store.ts
  const totalIncome = useMetric('totalIncome') || 0;
  const totalExpense = useMetric('totalExpense') || 0;
  const netBalance = totalIncome - totalExpense;

  // 3. ACTIONS
  const addEntry = (entry: Omit<LedgerEntry, 'id' | 'createdAt'>) => {
    store.addRow('ledger', {
      ...entry,
      createdAt: new Date().toISOString(),
    });
  };

  const updateEntry = (id: string, updates: Partial<LedgerEntry>) => {
    store.setPartialRow('ledger', id, updates);
  };

  const deleteEntry = (id: string) => {
    store.delRow('ledger', id);
  };

  // 4. DERIVED STATS (Simple JS is fine here for jugaad)
  // Calculate weekly stats from the raw entries array
  const weeklyExpense = entries
    .filter(e => {
        const date = new Date(e.date);
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        return e.type === 'expense' && date >= oneWeekAgo;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const weeklyIncome = entries
    .filter(e => {
        const date = new Date(e.date);
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        return e.type === 'income' && date >= oneWeekAgo;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Category Breakdown logic (Group by category)
  const categoryBreakdown = Object.values(
    entries
      .filter(e => e.type === 'expense')
      .reduce((acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = { category: curr.category, amount: 0, count: 0, percentage: 0 };
        }
        acc[curr.category].amount += curr.amount;
        acc[curr.category].count += 1;
        return acc;
      }, {} as Record<string, CategorySummary>)
  ).map((cat) => ({
    ...cat,
    percentage: totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0
  })).sort((a, b) => b.amount - a.amount);

  const topCategory = categoryBreakdown[0] || null;

  // Return the API expected by TrelixLedger.tsx
  return {
    entries,
    totalIncome,
    totalExpense,
    netBalance,
    weeklyExpense,
    weeklyIncome,
    categoryBreakdown,
    topCategory,
    addEntry,
    updateEntry,
    deleteEntry,
    
    // Placeholders for things I haven't migrated yet to prevent errors
    dailySpending: [], 
    insights: [],
    addCalculatorHistory: () => {}, 
    clearCalculatorHistory: () => {}, 
  };
};