import { format, subDays } from 'date-fns';

/**
 * Seeds sample analytics data for demo/testing purposes
 * Call this function to populate the dashboard with realistic data
 */
export const seedSampleAnalyticsData = () => {
  const now = new Date();

  // Sample tasks for the week
  const sampleTasks = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(now, i);
    const numTasks = Math.floor(Math.random() * 3) + 1; // 1-3 tasks per day

    for (let j = 0; j < numTasks; j++) {
      sampleTasks.push({
        id: `task-${i}-${j}`,
        title: `Sample Task ${i}-${j}`,
        category: Math.random() > 0.5 ? 'work' : 'personal',
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        deadline: format(date, 'yyyy-MM-dd'),
        completed: true,
        completedAt: date.toISOString(),
        createdAt: subDays(date, 1).toISOString(),
      });
    }
  }

  // Sample focus sessions
  const sampleFocusSessions = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(now, i);
    const numSessions = Math.floor(Math.random() * 4) + 1; // 1-4 sessions per day

    for (let j = 0; j < numSessions; j++) {
      sampleFocusSessions.push({
        id: `session-${i}-${j}`,
        date: date.toISOString(),
        duration: [15, 25, 30, 45][Math.floor(Math.random() * 4)], // Random durations
      });
    }
  }

  // Sample note activities
  const sampleNoteActivities = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(now, i);
    if (Math.random() > 0.3) {
      // 70% chance of note activity
      sampleNoteActivities.push({
        date: date.toISOString(),
        wordCount: Math.floor(Math.random() * 150) + 50, // 50-200 words
      });
    }
  }

  // Store in localStorage
  localStorage.setItem('analytics-tasks', JSON.stringify(sampleTasks));
  localStorage.setItem('analytics-focus-sessions', JSON.stringify(sampleFocusSessions));
  localStorage.setItem('analytics-note-activities', JSON.stringify(sampleNoteActivities));

  console.log('✅ Sample analytics data seeded successfully!');
  console.log(`📊 Generated: ${sampleTasks.length} tasks, ${sampleFocusSessions.length} focus sessions, ${sampleNoteActivities.length} note activities`);
};

/**
 * Clears all analytics data
 */
export const clearAnalyticsData = () => {
  localStorage.removeItem('analytics-tasks');
  localStorage.removeItem('analytics-focus-sessions');
  localStorage.removeItem('analytics-note-activities');
  console.log('🗑️ Analytics data cleared');
};
