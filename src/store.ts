import { createStore, createMetrics } from 'tinybase';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';

// 1. Define Schema
export const TABLES_SCHEMA = {
  tasks: {
    title: { type: 'string' },
    category: { type: 'string' }, 
    priority: { type: 'string' },
    deadline: { type: 'string' },
    completed: { type: 'boolean', default: false },
    completedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  goals: {
    title: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string' }, 
    createdAt: { type: 'string' },
  },
  ledger: {
    type: { type: 'string' }, 
    category: { type: 'string' },
    amount: { type: 'number' },
    description: { type: 'string' },
    date: { type: 'string' },
    createdAt: { type: 'string' },
  },
  habits: {
    title: { type: 'string' },
    frequency: { type: 'string' }, 
    createdAt: { type: 'string' },
  },
  habit_logs: {
    habitId: { type: 'string' },
    date: { type: 'string' },
    completed: { type: 'boolean', default: true },
  },
  mood_logs: {
    date: { type: 'string' },
    mood: { type: 'string' },
    score: { type: 'number' },
    note: { type: 'string' },
  }
} as const;

// 2. Create the Store
export const store = createStore().setTablesSchema(TABLES_SCHEMA);

// 3. Create & Configure Metrics
export const metrics = createMetrics(store);

metrics.setMetricDefinition(
  'totalIncome',
  'ledger',
  'sum',
  (getCell) => {
    const type = getCell('type');
    const amount = getCell('amount');
    // Explicitly cast amount to number to satisfy TypeScript
    return type === 'income' ? (amount as number) || 0 : 0;
  }
);

metrics.setMetricDefinition(
  'totalExpense',
  'ledger', 
  'sum',
  (getCell) => {
    const type = getCell('type');
    const amount = getCell('amount');
    // Explicitly cast amount to number to satisfy TypeScript
    return type === 'expense' ? (amount as number) || 0 : 0;
  }
);

// 4. Persist to browser storage
const persister = createIndexedDbPersister(store, 'trelix-db');

export const initStore = async () => {
  await persister.startAutoLoad();
  await persister.startAutoSave();
};