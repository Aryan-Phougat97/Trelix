import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoodEntry } from '@/components/MoodEntry';
import { MoodTimeline } from '@/components/MoodTimeline';
import { MoodInsights } from '@/components/MoodInsights';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Heart } from 'lucide-react';

export const MoodTracker = () => {
  const {
    entries,
    todayEntry,
    addOrUpdateEntry,
    getWeekEntries,
    getMonthEntries,
    getMoodFrequency,
    getWeeklyTrend,
    getDominantMood,
  } = useMoodTracker();

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--border))_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none animate-fade-in opacity-20"></div>

      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-xs">
                <Heart className="h-7 w-7 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Mood Tracker</h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Understand your emotions. Observe your patterns.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Today's Entry + Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Mood Entry */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <MoodEntry
                  todayEntry={todayEntry}
                  onSave={addOrUpdateEntry}
                />
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <MoodTimeline entries={entries} />
              </motion.div>
            </div>

            {/* Right Column: Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <MoodInsights
                weekEntries={getWeekEntries()}
                monthEntries={getMonthEntries()}
                weekFrequency={getMoodFrequency('week')}
                monthFrequency={getMoodFrequency('month')}
                weeklyTrend={getWeeklyTrend()}
                dominantWeekMood={getDominantMood('week')}
                dominantMonthMood={getDominantMood('month')}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
