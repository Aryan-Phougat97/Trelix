import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Calendar, DollarSign, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { LedgerEntry, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../hooks/useLedger';
import { useTheme } from '../contexts/ThemeContext';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<LedgerEntry, 'id' | 'createdAt'>) => void;
  editingEntry?: LedgerEntry | null;
  prefillAmount?: number;
}

export const AddEntryModal = ({
  isOpen,
  onClose,
  onSave,
  editingEntry,
  prefillAmount,
}: AddEntryModalProps) => {
  const { theme } = useTheme();

  // Form state
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      if (editingEntry) {
        setType(editingEntry.type);
        setCategory(editingEntry.category);
        setAmount(editingEntry.amount.toString());
        setDescription(editingEntry.description || '');
        setDate(editingEntry.date);
      } else {
        setType('expense');
        setCategory('');
        setAmount(prefillAmount ? prefillAmount.toString() : '');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [editingEntry, isOpen, prefillAmount]);

  // Get categories based on type
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Auto-select first category if none selected
  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [type, category, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!category || !amountNum || amountNum <= 0 || !date) {
      return;
    }

    onSave({
      type,
      category,
      amount: amountNum,
      description: description.trim(),
      date,
    });

    // Reset form
    setType('expense');
    setCategory('');
    setAmount('');
    setDescription('');
    setDate('');
    onClose();
  };

  const themeColor = type === 'income' ? 'oklch(var(--primary))' : 'oklch(var(--destructive))';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={`glass-card rounded-2xl p-6 w-full max-w-lg border-2 shadow-2xl ${
                type === 'income' ? 'border-primary/40' : 'border-destructive/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {editingEntry ? 'Edit Entry' : 'Add Entry'}
                </h2>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setType('expense')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        type === 'expense'
                          ? 'bg-destructive/10 border-destructive/50'
                          : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <TrendingDown className="w-6 h-6 mx-auto mb-2 text-destructive" />
                      <div className="font-semibold">Expense</div>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setType('income')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        type === 'income'
                          ? 'bg-primary/10 border-primary/50'
                          : 'border-border/50 hover:border-border'
                      }`}
                    >
                      <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">Income</div>
                    </motion.button>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.name}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(cat.name)}
                        className={`p-3 rounded-lg border transition-all ${
                          category === cat.name
                            ? 'border-2'
                            : 'border border-border/50 hover:border-border'
                        }`}
                        style={{
                          borderColor: category === cat.name ? cat.color : undefined,
                          backgroundColor:
                            category === cat.name ? `${cat.color}15` : undefined,
                        }}
                        title={cat.name}
                      >
                        <div className="text-2xl mb-1">{cat.icon}</div>
                        <div className="text-xs font-medium truncate">{cat.name}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <textarea
                      placeholder="Add a note..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background/50 focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      className={`w-full ${type === 'income' ? 'bg-primary hover:bg-primary/90' : 'bg-destructive hover:bg-destructive/90'}`}
                    >
                      {editingEntry ? 'Update' : 'Add Entry'}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
