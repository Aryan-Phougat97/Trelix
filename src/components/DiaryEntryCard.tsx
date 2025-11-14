import { motion } from 'framer-motion';
import { Calendar, Edit3, Heart, Smile, Meh, Frown } from 'lucide-react';
import { DiaryEntry } from '@/hooks/useDiary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onEdit: (entry: DiaryEntry) => void;
  isBlurred?: boolean;
  index?: number;
}

const getMoodIcon = (mood: DiaryEntry['mood']) => {
  switch (mood) {
    case 'excellent':
      return <Heart className="h-4 w-4 text-green-400" fill="currentColor" />;
    case 'good':
      return <Smile className="h-4 w-4 text-blue-400" />;
    case 'neutral':
      return <Meh className="h-4 w-4 text-yellow-400" />;
    case 'poor':
      return <Frown className="h-4 w-4 text-red-400" />;
    default:
      return null;
  }
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({
  entry,
  onEdit,
  isBlurred = false,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <div
        className={`
          glass-card rounded-xl p-6 border border-border
          hover:border-foreground/20 transition-all duration-300
          hover:shadow-lg hover:shadow-primary/5
          ${isBlurred ? 'blur-sm' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              {formatDate(entry.date)}
            </h3>
            {entry.mood && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {getMoodIcon(entry.mood)}
              </motion.div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10"
            onClick={() => onEdit(entry)}
            title="Edit entry"
          >
            <Edit3 className="h-4 w-4 text-primary" />
          </Button>
        </div>

        {/* Content */}
        <div
          className={`
            text-foreground/80 leading-relaxed mb-4
            font-normal text-[15px]
            ${isBlurred ? 'select-none' : ''}
          `}
          style={{
            fontFamily: "'Inter', 'Poppins', sans-serif",
            lineHeight: '1.7',
          }}
        >
          {entry.content}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
