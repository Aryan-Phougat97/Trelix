import { createStore, createMetrics } from 'tinybase';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';

export const TABLES_SCHEMA = {
  // --- PRODUCTIVITY ---
  tasks: {
    title: { type: 'string' },
    category: { type: 'string' }, 
    priority: { type: 'string' },
    deadline: { type: 'string' },
    completed: { type: 'boolean', default: false },
    completedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  // Analytic Events 
  focus_sessions: {
    date: { type: 'string' },
    duration: { type: 'number' }, // minutes
    taskId: { type: 'string' },
  },
  note_activities: {
    date: { type: 'string' },
    wordCount: { type: 'number' },
  },

  // --- PLANNING ---
  goals: {
    title: { type: 'string' },
    description: { type: 'string' },
    category: { type: 'string' }, 
    createdAt: { type: 'string' },
  },
  weekly_reviews: {
    weekOf: { type: 'string' }, // ISO Date of Monday
    whatWorkedWell: { type: 'string' },
    whatNeedsImprovement: { type: 'string' },
    nextWeekIntentions: { type: 'string' }, // JSON Array
    completedAt: { type: 'string' },
  },

  // --- FINANCIAL ---
  ledger: {
    type: { type: 'string' }, 
    category: { type: 'string' },
    amount: { type: 'number' },
    description: { type: 'string' },
    date: { type: 'string' },
    createdAt: { type: 'string' },
  },
  calculator_history: {
    expression: { type: 'string' },
    result: { type: 'number' },
    timestamp: { type: 'string' },
  },

  // --- WELLBEING ---
  habits: {
    title: { type: 'string' },
    frequency: { type: 'string' }, 
    color: { type: 'string' },
    createdAt: { type: 'string' },
  },
  habit_logs: {
    habitId: { type: 'string' },
    date: { type: 'string' },
    completed: { type: 'boolean', default: true },
    completedAt: { type: 'string' },
  },
  diary: {
    date: { type: 'string' },
    content: { type: 'string' },
    mood: { type: 'string' },
    tags: { type: 'string' }, // JSON Array
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  mood_logs: {
    date: { type: 'string' }, // YYYY-MM-DD
    mood: { type: 'string' }, 
    emoji: { type: 'string' },
    score: { type: 'number' },
    note: { type: 'string' },
    tags: { type: 'string' }, // JSON Array
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  inspiration: {
    title: { type: 'string' },
    artist: { type: 'string' },
    url: { type: 'string' },
    platform: { type: 'string' },
    timestamp: { type: 'number' },
    endTimestamp: { type: 'number' },
    notes: { type: 'string' },
    mood: { type: 'string' },
    tags: { type: 'string' }, // JSON Array
    playCount: { type: 'number', default: 0 },
    lastPlayed: { type: 'string' },
    createdAt: { type: 'string' },
  }
} as const;

export const store = createStore().setTablesSchema(TABLES_SCHEMA);
export const metrics = createMetrics(store);

// Math stuff defination
metrics.setMetricDefinition('totalIncome', 'ledger', 'sum', (getCell) => {
  const type = getCell('type');
  const amount = getCell('amount');
  return type === 'income' ? (amount as number) || 0 : 0;
});

metrics.setMetricDefinition('totalExpense', 'ledger', 'sum', (getCell) => {
  const type = getCell('type');
  const amount = getCell('amount');
  return type === 'expense' ? (amount as number) || 0 : 0;
});

const persister = createIndexedDbPersister(store, 'trelix-db');

export const initStore = async () => {
  await persister.startAutoLoad();
  await persister.startAutoSave();
};