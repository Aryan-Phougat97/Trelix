import { createMergeableStore, createMetrics, Row } from 'tinybase';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
import { createWsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';
import { api } from '@/lib/api'; 

// Helper type to get the Synchronizer type without guessing imports
type WsSynchronizer = Awaited<ReturnType<typeof createWsSynchronizer>>;

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
  calculator_history: {
    expression: { type: 'string' },
    result: { type: 'number' },
    timestamp: { type: 'string' },
  },
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
    tags: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
  mood_logs: {
    date: { type: 'string' },
    mood: { type: 'string' },
    emoji: { type: 'string' },
    score: { type: 'number' },
    note: { type: 'string' },
    tags: { type: 'string' },
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
    tags: { type: 'string' },
    playCount: { type: 'number', default: 0 },
    lastPlayed: { type: 'string' },
    createdAt: { type: 'string' },
  },
  weekly_reviews: {
    weekOf: { type: 'string' },
    whatWorkedWell: { type: 'string' },
    whatNeedsImprovement: { type: 'string' },
    nextWeekIntentions: { type: 'string' },
    completedAt: { type: 'string' },
  },
  focus_sessions: {
    date: { type: 'string' },
    duration: { type: 'number' },
    taskId: { type: 'string' },
  },
  note_activities: {
    date: { type: 'string' },
    wordCount: { type: 'number' },
  },
} as const;

export const store = createMergeableStore().setTablesSchema(TABLES_SCHEMA);
export const metrics = createMetrics(store);

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

// --- PERSISTENCE (Local) ---
const localPersister = createIndexedDbPersister(store, 'trelix-db');

export const initStore = async () => {
  await localPersister.startAutoLoad();
  await localPersister.startAutoSave();
};

// --- SYNC ENGINE ---
let synchronizer: WsSynchronizer | null = null;
let ws: WebSocket | null = null;
let saveTimeout: NodeJS.Timeout | null = null;

const saveToCloud = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const data = store.getJson(); 
      await api.sync.save(JSON.parse(data));
    } catch (e) {
      console.warn('☁️ Cloud save failed:', e);
    }
  }, 1000); 
};

export const initSync = async (wsUrl: string) => {
  if (synchronizer) return; 

  console.log('🔌 Connecting to Sync Server:', wsUrl);

  // Initial Cloud Merge (The Vault)
  try {
    const cloudData = await api.sync.load();
    // Check if we received a valid TinyBase array: [tables, values]
    if (Array.isArray(cloudData) && cloudData.length > 0) {
      const [tables] = cloudData;
      
      if (tables && Object.keys(tables).length > 0) {
        console.log('☁️ Merging data from Cloud...');
        
        store.transaction(() => {
          Object.entries(tables).forEach(([tableId, rows]) => {
            if (typeof rows === 'object' && rows !== null) {
              Object.entries(rows).forEach(([rowId, cellData]) => {
                store.setPartialRow(tableId, rowId, cellData as Row);
              });
            }
          });
        });
      }
    }
  } catch (e) {
    console.warn('Failed to load initial cloud data', e);
  }

  // Setup Real-time Relay (WebSocket)
  ws = new WebSocket(wsUrl);
  synchronizer = await createWsSynchronizer(store, ws);
  await synchronizer.startSync();

  // Start Cloud Auto-Save
  store.addHasTablesListener(() => saveToCloud());
};

export const stopSync = () => {
  if (synchronizer) {
    synchronizer.stopSync();
    synchronizer = null;
  }
  if (ws) {
    ws.close();
    ws = null;
  }
  console.log('🔌 Disconnected from Cloud');
};