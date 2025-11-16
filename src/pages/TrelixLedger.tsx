import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Calculator,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLedger, LedgerEntry } from '../hooks/useLedger';
import { useTheme } from '../contexts/ThemeContext';
import { LedgerCard } from '../components/LedgerCard';
import { AddEntryModal } from '../components/AddEntryModal';
import { CalculatorModal } from '../components/CalculatorModal';
import { FinancialInsights } from '../components/FinancialInsights';
import { LedgerCharts } from '../components/LedgerCharts';
import { toast } from 'sonner';

export const TrelixLedger = () => {
  const { theme } = useTheme();
  const {
    entries,
    totalIncome,
    totalExpense,
    netBalance,
    weeklyExpense,
    weeklyIncome,
    categoryBreakdown,
    topCategory,
    weeklyData,
    dailySpending,
    insights,
    addEntry,
    updateEntry,
    deleteEntry,
    calculatorHistory,
    addCalculatorHistory,
    clearCalculatorHistory,
  } = useLedger();

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LedgerEntry | null>(null);
  const [prefillAmount, setPrefillAmount] = useState<number | undefined>(undefined);
  const [isEntriesExpanded, setIsEntriesExpanded] = useState(true);
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true);
  const [isChartsExpanded, setIsChartsExpanded] = useState(true);

  const getThemeColor = () => {
    switch (theme) {
      case 'cyber':
        return '#3b82f6';
      case 'mirage':
        return '#a78bfa';
      case 'zen':
        return '#10b981';
      case 'solar':
        return '#f59e0b';
      case 'calm':
        return '#6ee7b7';
      default:
        return '#3b82f6';
    }
  };

  const themeColor = getThemeColor();

  const handleAddEntry = (entry: Omit<LedgerEntry, 'id' | 'createdAt'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, entry);
      toast.success('Entry updated successfully');
      setEditingEntry(null);
    } else {
      addEntry(entry);
      if (entry.type === 'expense') {
        // Add to calculator history
        addCalculatorHistory(entry.amount.toString(), entry.amount);
      }
      toast.success(
        entry.type === 'expense' ? 'Expense added successfully' : 'Income added successfully'
      );
    }
    setPrefillAmount(undefined);
  };

  const handleEdit = (entry: LedgerEntry) => {
    setEditingEntry(entry);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    toast.success('Entry deleted successfully');
  };

  const handleCalculatorAddExpense = (amount: number) => {
    setPrefillAmount(amount);
    setIsAddModalOpen(true);
  };

  const budgetUsage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-8 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="glass-card rounded-2xl p-8 border-2"
            style={{
              borderColor: `${themeColor}40`,
              boxShadow:
                theme === 'cyber' || theme === 'mirage'
                  ? `0 0 60px ${themeColor}20`
                  : undefined,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-10 h-10" style={{ color: themeColor }} />
              <div>
                <h1
                  className="text-4xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Trelix Ledger
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground mb-8">
              Track your money. Re-engineer your financial clarity.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Monthly Balance */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border border-border/50 hover:border-border transition-all"
                style={{
                  background:
                    theme === 'light'
                      ? 'rgba(255,255,255,0.5)'
                      : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Monthly Balance</p>
                  <Wallet className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <h3
                  className="text-3xl font-bold"
                  style={{
                    color: netBalance >= 0 ? '#10b981' : '#ef4444',
                    textShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? `0 0 15px ${netBalance >= 0 ? '#10b98160' : '#ef444460'}`
                        : undefined,
                  }}
                >
                  {netBalance >= 0 ? '+' : ''}₹{Math.abs(netBalance).toLocaleString('en-IN')}
                </h3>
              </motion.div>

              {/* Total Income */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border border-border/50 hover:border-border transition-all"
                style={{
                  background:
                    theme === 'light'
                      ? 'rgba(255,255,255,0.5)'
                      : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3
                  className="text-3xl font-bold"
                  style={{
                    color: '#10b981',
                    textShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? '0 0 15px #10b98160'
                        : undefined,
                  }}
                >
                  ₹{totalIncome.toLocaleString('en-IN')}
                </h3>
              </motion.div>

              {/* Total Expense */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border border-border/50 hover:border-border transition-all"
                style={{
                  background:
                    theme === 'light'
                      ? 'rgba(255,255,255,0.5)'
                      : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Expense</p>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <h3
                  className="text-3xl font-bold"
                  style={{
                    color: '#ef4444',
                    textShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? '0 0 15px #ef444460'
                        : undefined,
                  }}
                >
                  ₹{totalExpense.toLocaleString('en-IN')}
                </h3>
              </motion.div>
            </div>

            {/* Budget Usage Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Budget Usage</p>
                <p className="text-sm font-semibold" style={{ color: themeColor }}>
                  {budgetUsage.toFixed(1)}%
                </p>
              </div>
              <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetUsage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${budgetUsage > 100 ? '#ef4444' : themeColor}, ${budgetUsage > 100 ? '#ef4444dd' : `${themeColor}dd`})`,
                    boxShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? `0 0 10px ${budgetUsage > 100 ? '#ef4444' : themeColor}60`
                        : undefined,
                  }}
                />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={() => {
                    setEditingEntry(null);
                    setPrefillAmount(undefined);
                    setIsAddModalOpen(true);
                  }}
                  className="w-full"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                    boxShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? `0 0 20px ${themeColor}40`
                        : undefined,
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="border-2"
                  style={{
                    borderColor: `${themeColor}40`,
                  }}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculator
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Recent Entries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsEntriesExpanded(!isEntriesExpanded)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <h2 className="text-2xl font-bold">Recent Entries</h2>
                {isEntriesExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              <p className="text-sm text-muted-foreground">{entries.length} total</p>
            </div>

            <AnimatePresence>
              {isEntriesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {entries.length > 0 ? (
                    entries.slice(0, 10).map((entry) => (
                      <LedgerCard
                        key={entry.id}
                        entry={entry}
                        onEdit={() => handleEdit(entry)}
                        onDelete={() => handleDelete(entry.id)}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card rounded-xl p-12 border border-border/50 text-center"
                    >
                      <Sparkles
                        className="w-16 h-16 mx-auto mb-4 opacity-50"
                        style={{ color: themeColor }}
                      />
                      <h3 className="text-xl font-bold mb-2">No entries yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start tracking your financial journey
                      </p>
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        style={{
                          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Entry
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Financial Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <h2 className="text-2xl font-bold">Financial Insights</h2>
                {isInsightsExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {isInsightsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FinancialInsights
                    insights={insights}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    netBalance={netBalance}
                    topCategory={topCategory}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Charts & Analytics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setIsChartsExpanded(!isChartsExpanded)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <h2 className="text-2xl font-bold">Analytics</h2>
                {isChartsExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {isChartsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LedgerCharts
                    categoryBreakdown={categoryBreakdown}
                    weeklyData={weeklyData}
                    dailySpending={dailySpending}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEntry(null);
          setPrefillAmount(undefined);
        }}
        onSave={handleAddEntry}
        editingEntry={editingEntry}
        prefillAmount={prefillAmount}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onAddToExpense={handleCalculatorAddExpense}
        history={calculatorHistory}
        onClearHistory={clearCalculatorHistory}
      />
    </div>
  );
};
