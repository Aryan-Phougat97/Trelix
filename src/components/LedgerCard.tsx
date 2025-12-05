import { motion } from 'framer-motion';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LedgerEntry, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../hooks/useLedger';
import { useTheme } from '../contexts/ThemeContext';

interface LedgerCardProps {
  entry: LedgerEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export const LedgerCard = ({ entry, onEdit, onDelete }: LedgerCardProps) => {
  const { theme } = useTheme();

  // Get category info
  const categories = entry.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const categoryInfo = categories.find((c) => c.name === entry.category);
  const categoryColor = categoryInfo?.color || '#6b7280';
  const categoryIcon = categoryInfo?.icon || '💰';

  // Get theme-aware glow color
  const glowColor = entry.type === 'income' ? 'oklch(var(--primary))' : 'oklch(var(--destructive))';

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-xl p-4 border border-border/50 hover:border-border transition-all"
      style={{
        borderColor: `${glowColor}20`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            backgroundColor: `${categoryColor}20`,
            border: `2px solid ${categoryColor}40`,
          }}
        >
          {categoryIcon}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {entry.description || entry.category}
                </h3>
                {entry.type === 'income' ? (
                  <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: `${categoryColor}40`,
                    color: categoryColor,
                  }}
                >
                  {entry.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col items-end gap-1">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`font-bold text-lg whitespace-nowrap ${entry.type === 'income' ? 'text-primary' : 'text-destructive'}`}
              >
                {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString('en-IN')}
              </motion.div>

              {/* Action buttons */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onEdit}
                  title="Edit entry"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:text-destructive"
                  onClick={onDelete}
                  title="Delete entry"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Description (if different from category) */}
          {entry.description && entry.description !== entry.category && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {entry.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
