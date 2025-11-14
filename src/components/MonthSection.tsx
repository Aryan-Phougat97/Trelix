import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { MonthGroup, DiaryEntry } from '@/hooks/useDiary';
import { DiaryEntryCard } from './DiaryEntryCard';

interface MonthSectionProps {
  monthGroup: MonthGroup;
  onEdit: (entry: DiaryEntry) => void;
  isBlurred?: boolean;
}

export const MonthSection: React.FC<MonthSectionProps> = ({
  monthGroup,
  onEdit,
  isBlurred = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      {/* Month Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-border/50 hover:border-border transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.div>
          <h3 className="text-lg font-semibold text-foreground">{monthGroup.month}</h3>
          <span className="text-sm text-muted-foreground">
            ({monthGroup.entries.length} {monthGroup.entries.length === 1 ? 'entry' : 'entries'})
          </span>
        </div>
      </button>

      {/* Month Entries */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 pl-4">
              {monthGroup.entries.map((entry, index) => (
                <DiaryEntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={onEdit}
                  isBlurred={isBlurred}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
