import { useTable, useMetric } from 'tinybase/ui-react';
import { Row } from 'tinybase';
import { store } from '../store';

export interface LedgerEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  createdAt: string;
}

// DB Shape for Calculator
interface CalcRow {
  expression: string;
  result: number;
  timestamp: string;
}

export interface CalculatorHistory {
  id: string;
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

// --- Helpers ---
const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

export const useLedger = () => {
  // 1. READ DATA
  const ledgerTable = useTable('ledger');
  const calculatorTable = useTable('calculator_history');

  const entries = Object.entries(ledgerTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as LedgerEntry[];

  const calculatorHistory = Object.entries(calculatorTable)
    .map(([id, data]) => {
      const row = data as unknown as CalcRow;
      return {
        id,
        expression: row.expression,
        result: row.result,
        timestamp: row.timestamp
      };
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Keep last 10

  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 2. METRICS
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

  const deleteEntry = (id: string) => store.delRow('ledger', id);

  const addCalculatorHistory = (expression: string, result: number) => {
    const newRow: CalcRow = {
      expression,
      result,
      timestamp: new Date().toISOString()
    };
    store.addRow('calculator_history', newRow as unknown as Row);
  };

  const clearCalculatorHistory = () => {
    // Delete all rows in the table
    Object.keys(calculatorTable).forEach(id => store.delRow('calculator_history', id));
  };

  // 4. ANALYTICS LOGIC
  
  // Weekly Stats (Current Week)
  const currentWeekStart = getWeekStart(new Date());
  const currentWeekEntries = entries.filter(e => {
    const entryWeek = getWeekStart(new Date(e.date));
    return entryWeek === currentWeekStart;
  });
  
  const weeklyExpense = currentWeekEntries
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const weeklyIncome = currentWeekEntries
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  // Category Breakdown
  const categoryMap = entries
    .filter(e => e.type === 'expense')
    .reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { category: curr.category, amount: 0, count: 0, percentage: 0 };
      }
      acc[curr.category].amount += curr.amount;
      acc[curr.category].count += 1;
      return acc;
    }, {} as Record<string, CategoryBreakdown>);

  const categoryBreakdown = Object.values(categoryMap)
    .map(cat => ({
      ...cat,
      percentage: totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryBreakdown[0] || null;

  // Weekly Data for Charts (Last 4 weeks)
  const weeklyData: WeeklySummary[] = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    const weekStart = getWeekStart(date);
    
    // Calculate week end
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    const weekEnd = end.toISOString().split('T')[0];

    const weekEntries = entries.filter(e => e.date >= weekStart && e.date <= weekEnd);
    
    const wExpense = weekEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const wIncome = weekEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);

    weeklyData.unshift({
      weekStart,
      weekEnd,
      totalExpense: wExpense,
      totalIncome: wIncome,
      netChange: wIncome - wExpense
    });
  }

  // Daily Spending (Last 30 days)
  const dailySpending: { date: string; expense: number; income: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayEntries = entries.filter(e => e.date === dateStr);
    const expense = dayEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const income = dayEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);

    dailySpending.push({ date: dateStr, expense, income });
  }

  // Insights Generation
  const insights: string[] = [];
  if (topCategory) {
    insights.push(`You spend the most on ${topCategory.category} (${topCategory.percentage.toFixed(0)}%).`);
  }
  
  const lastWeekExpense = weeklyData[weeklyData.length - 2]?.totalExpense || 0;
  const thisWeekExpense = weeklyData[weeklyData.length - 1]?.totalExpense || 0;
  
  if (thisWeekExpense > lastWeekExpense) {
    insights.push(`Spending is up ₹${(thisWeekExpense - lastWeekExpense).toFixed(0)} from last week.`);
  } else if (lastWeekExpense > 0) {
    insights.push(`You've saved ₹${(lastWeekExpense - thisWeekExpense).toFixed(0)} compared to last week!`);
  }

  if (totalIncome > 0) {
    const savingsRate = (netBalance / totalIncome) * 100;
    if (savingsRate > 20) {
      insights.push(`Great job! You're saving ${savingsRate.toFixed(0)}% of your income.`);
    } else if (savingsRate < 0) {
      insights.push(`Warning: You are spending more than you earn.`);
    }
  }

  return {
    entries,
    totalIncome,
    totalExpense,
    netBalance,
    weeklyExpense,
    weeklyIncome,
    categoryBreakdown,
    topCategory,
    weeklyData,
    dailySpending,
    insights,
    addEntry,
    updateEntry,
    deleteEntry,
    calculatorHistory,
    addCalculatorHistory,
    clearCalculatorHistory,
  };
};