import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodEntry as MoodEntryType } from '@/hooks/useMoodTracker';
import { ChevronDown, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MoodTimelineProps {
  entries: MoodEntryType[];
}

interface GroupedEntries {
  [key: string]: {
    label: string;
    entries: MoodEntryType[];
  };
}

const groupEntriesByMonth = (entries: MoodEntryType[]): GroupedEntries => {
  const grouped: GroupedEntries = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    if (!grouped[monthKey]) {
      grouped[monthKey] = {
        label: monthLabel,
        entries: [],
      };
    }

    grouped[monthKey].entries.push(entry);
  });

  return grouped;
};

const groupEntriesByWeek = (entries: MoodEntryType[]): GroupedEntries => {
  const grouped: GroupedEntries = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const weekKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
    const weekLabel = `Week ${weekNumber}, ${date.getFullYear()}`;

    if (!grouped[weekKey]) {
      grouped[weekKey] = {
        label: weekLabel,
        entries: [],
      };
    }

    grouped[weekKey].entries.push(entry);
  });

  return grouped;
};

export const MoodTimeline: React.FC<MoodTimelineProps> = ({ entries }) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const groupedEntries = useMemo(() => {
    return viewMode === 'week' ? groupEntriesByWeek(entries) : groupEntriesByMonth(entries);
  }, [entries, viewMode]);

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 border border-border/50 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-4 rounded-full bg-primary/10">
            <Calendar className="h-12 w-12 text-primary/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Mood History Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Track your first mood to begin understanding your emotional patterns.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (entries.length === 1) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Great Start!</h3>
        </motion.div>
        <p className="text-sm text-muted-foreground mb-6">
          Your mood timeline will grow with you. Keep logging to see patterns and insights.
        </p>
        {/* Show the single entry */}
        <MoodCard entry={entries[0]} index={0} />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Mood Timeline</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
              viewMode === 'week'
                ? 'bg-primary/20 text-primary'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
              viewMode === 'month'
                ? 'bg-primary/20 text-primary'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedEntries).map(([groupKey, group], groupIndex) => {
          const isCollapsed = collapsedGroups.has(groupKey);

          return (
            <motion.div
              key={groupKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
              className="relative"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(groupKey)}
                className="flex items-center gap-3 mb-4 w-full hover:opacity-80 transition-opacity group"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 0 : 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
                <h4 className="text-sm font-medium text-foreground/80">{group.label}</h4>
                <div className="h-px flex-1 bg-linear-to-r from-border to-transparent"></div>
                <span className="text-xs text-muted-foreground">
                  {group.entries.length} {group.entries.length === 1 ? 'entry' : 'entries'}
                </span>
              </button>

              {/* Entries */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative ml-2 pl-4 border-l-2 border-primary/20 space-y-3"
                  >
                    {/* Glow effect on the line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-primary/40 via-primary/20 to-transparent"></div>

                    {group.entries.map((entry, index) => (
                      <MoodCard key={entry.id} entry={entry} index={index} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

interface MoodCardProps {
  entry: MoodEntryType;
  index: number;
}

const MoodCard: React.FC<MoodCardProps> = ({ entry, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ x: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Timeline dot */}
      <div className="absolute -left-[1.3rem] top-3 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary group-hover:scale-125 group-hover:bg-primary transition-all duration-200">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:bg-primary/40"></div>
      </div>

      {/* Card */}
      <div className="glass-card rounded-xl p-4 border border-border/30 hover:border-primary/40 transition-all duration-300 bg-card/30 hover:bg-card/50">
        <div className="flex items-start gap-4">
          {/* Emoji */}
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-3xl"
          >
            {entry.emoji}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground capitalize">
                {entry.mood}
              </span>
              <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
            </div>

            {/* Intensity bar */}
            <div className="mb-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${entry.score * 10}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-full bg-linear-to-r from-primary/60 to-primary rounded-full"
                ></motion.div>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                Intensity: {entry.score}/10
              </span>
            </div>

            {/* Note */}
            {entry.note && (
              <p className="text-sm text-foreground/70 mb-2 line-clamp-2">{entry.note}</p>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {entry.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs px-2 py-0 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
