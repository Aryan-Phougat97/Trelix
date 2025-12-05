import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Lock, Unlock, Info } from 'lucide-react';
import { useDiary, DiaryEntry } from '@/hooks/useDiary';
import { DiaryEntryCard } from '@/components/DiaryEntryCard';
import { DiaryEditorModal } from '@/components/DiaryEditorModal';
import { MonthSection } from '@/components/MonthSection';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';

const Diary = () => {
  const { todayEntry, monthGroups, addEntry, updateEntry } = useDiary();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [editingDate, setEditingDate] = useState<string>('');
  const [isPrivateMode, setIsPrivateMode] = useState(false);

  const getTodayDate = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const handleNewEntry = () => {
    setEditingEntry(todayEntry);
    setEditingDate(getTodayDate());
    setIsEditorOpen(true);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setEditingDate(entry.date);
    setIsEditorOpen(true);
  };

  const handleSaveEntry = (content: string, tags: string[], mood: DiaryEntry['mood']) => {
    if (editingDate === getTodayDate() && todayEntry) {
      // Update existing today's entry
      updateEntry(editingDate, { content, tags, mood });
    } else {
      // Add new entry or update past entry
      addEntry(editingDate, content, tags, mood);
    }
    setIsEditorOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--primary)/0.03)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none animate-fade-in"></div>

      <div className="relative z-10">
        <div className="container max-w-6xl mx-auto px-6 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
                  Daily Diary
                </h1>
                <p className="text-muted-foreground text-lg">
                  Capture your thoughts. Clarify your mind.
                </p>
              </div>

              {/* Private Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className={`
                  flex items-center gap-2 transition-all duration-300
                  ${isPrivateMode ? 'bg-primary/10 text-primary border border-primary/30' : 'border border-border'}
                `}
                onClick={() => setIsPrivateMode(!isPrivateMode)}
              >
                {isPrivateMode ? (
                  <>
                    <Lock className="h-4 w-4" />
                    Private Mode
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4" />
                    Public View
                  </>
                )}
              </Button>
            </div>

            {/* Privacy Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 text-xs text-muted-foreground bg-foreground/5 border border-border/50 rounded-lg px-4 py-3"
            >
              <Info className="h-4 w-4 shrink-0" />
              <p>
                Your diary entries are stored locally on your device and never leave your computer.
                Complete privacy, always.
              </p>
            </motion.div>
          </motion.div>

          {/* Today's Entry Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Today's Entry</h2>
              <Button
                onClick={handleNewEntry}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                {todayEntry ? 'Edit Entry' : 'New Entry'}
              </Button>
            </div>

            <div className="glass-card rounded-2xl p-8 border-2 border-border">
              {todayEntry ? (
                <DiaryEntryCard
                  entry={todayEntry}
                  onEdit={handleEditEntry}
                  isBlurred={false}
                />
              ) : (
                <EmptyState type="today" />
              )}
            </div>
          </motion.div>

          {/* Past Entries Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Past Entries</h2>

            {monthGroups.length > 0 ? (
              <div className="space-y-4">
                {monthGroups.map((monthGroup) => (
                  <MonthSection
                    key={monthGroup.monthKey}
                    monthGroup={monthGroup}
                    onEdit={handleEditEntry}
                    isBlurred={isPrivateMode}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8 border-2 border-border">
                <EmptyState type="past" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Editor Modal */}
      <DiaryEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
        date={editingDate}
      />
    </div>
  );
};

export default Diary;
