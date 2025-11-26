import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Plus, History, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { CalculatorHistory } from '../hooks/useLedger';
import { toast } from 'sonner';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToExpense: (amount: number) => void;
  history: CalculatorHistory[];
  onClearHistory: () => void;
}

export const CalculatorModal = ({
  isOpen,
  onClose,
  onAddToExpense,
  history,
  onClearHistory,
}: CalculatorModalProps) => {
  const { theme } = useTheme();

  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplay('0');
      setExpression('');
      setLastResult(null);
      setShowHistory(false);
    }
  }, [isOpen]);

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

  const handleNumber = (num: string) => {
    if (display === '0' || lastResult !== null) {
      setDisplay(num);
      setExpression(num);
      setLastResult(null);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    if (lastResult !== null) {
      setExpression(lastResult.toString() + op);
      setDisplay(lastResult.toString());
      setLastResult(null);
    } else {
      setExpression(expression + op);
      setDisplay(op);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setExpression(expression + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  };

  const handleBackspace = () => {
    if (lastResult !== null) {
      handleClear();
    } else if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else {
      handleClear();
    }
  };

  const handleEquals = () => {
    try {
      // Safe eval using Function constructor
      const result = Function(`'use strict'; return (${expression})`)();
      const roundedResult = Math.round(result * 100) / 100;
      setDisplay(roundedResult.toString());
      setLastResult(roundedResult);
      setExpression(expression);
    } catch (error) {
      toast.error('Invalid expression');
      handleClear();
    }
  };

  const handleCopy = () => {
    const valueToCopy = lastResult !== null ? lastResult.toString() : display;
    navigator.clipboard.writeText(valueToCopy);
    toast.success('Copied to clipboard');
  };

  const handleAddExpense = () => {
    const amount = lastResult !== null ? lastResult : parseFloat(display);
    if (!isNaN(amount) && amount > 0) {
      onAddToExpense(amount);
      onClose();
      toast.success('Opening expense form with amount');
    } else {
      toast.error('Invalid amount');
    }
  };

  const handleHistoryClick = (item: CalculatorHistory) => {
    setExpression(item.expression);
    setDisplay(item.result.toString());
    setLastResult(item.result);
    setShowHistory(false);
  };

  const buttons = [
    { label: 'C', action: handleClear, variant: 'secondary' as const },
    { label: '⌫', action: handleBackspace, variant: 'secondary' as const },
    { label: '%', action: () => handleOperator('%'), variant: 'secondary' as const },
    { label: '÷', action: () => handleOperator('/'), variant: 'operator' as const },
    { label: '7', action: () => handleNumber('7'), variant: 'default' as const },
    { label: '8', action: () => handleNumber('8'), variant: 'default' as const },
    { label: '9', action: () => handleNumber('9'), variant: 'default' as const },
    { label: '×', action: () => handleOperator('*'), variant: 'operator' as const },
    { label: '4', action: () => handleNumber('4'), variant: 'default' as const },
    { label: '5', action: () => handleNumber('5'), variant: 'default' as const },
    { label: '6', action: () => handleNumber('6'), variant: 'default' as const },
    { label: '-', action: () => handleOperator('-'), variant: 'operator' as const },
    { label: '1', action: () => handleNumber('1'), variant: 'default' as const },
    { label: '2', action: () => handleNumber('2'), variant: 'default' as const },
    { label: '3', action: () => handleNumber('3'), variant: 'default' as const },
    { label: '+', action: () => handleOperator('+'), variant: 'operator' as const },
    { label: '00', action: () => handleNumber('00'), variant: 'default' as const },
    { label: '0', action: () => handleNumber('0'), variant: 'default' as const },
    { label: '.', action: handleDecimal, variant: 'default' as const },
    { label: '=', action: handleEquals, variant: 'equals' as const },
  ];

  const getButtonStyle = (variant: string) => {
    const baseStyle = 'h-14 text-lg font-semibold rounded-xl transition-all border';

    switch (variant) {
      case 'operator':
        return `${baseStyle} bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary`;
      case 'equals':
        return `${baseStyle} border-2`;
      case 'secondary':
        return `${baseStyle} bg-muted/50 hover:bg-muted border-border`;
      default:
        return `${baseStyle} bg-background/50 hover:bg-foreground/5 border-border/50`;
    }
  };

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="glass-card rounded-2xl p-6 w-full max-w-md border-2"
              style={{
                borderColor: `${themeColor}40`,
                boxShadow:
                  theme === 'cyber' || theme === 'mirage'
                    ? `0 0 40px ${themeColor}20, 0 20px 60px rgba(0,0,0,0.3)`
                    : '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Calculator</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="History"
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* History Panel */}
              <AnimatePresence>
                {showHistory && history.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="bg-background/50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground font-medium">
                          Recent calculations
                        </span>
                        <button
                          onClick={onClearHistory}
                          className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Clear
                        </button>
                      </div>
                      {history.map((item) => (
                        <motion.button
                          key={item.timestamp}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleHistoryClick(item)}
                          className="w-full text-left p-2 rounded border border-border/50 hover:border-border hover:bg-foreground/5 transition-all"
                        >
                          <div className="text-sm text-muted-foreground">
                            {item.expression}
                          </div>
                          <div className="text-sm font-semibold text-foreground">
                            = {item.result}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Display */}
              <div
                className="mb-4 p-4 rounded-xl border-2"
                style={{
                  borderColor: `${themeColor}40`,
                  backgroundColor:
                    theme === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.2)',
                  boxShadow:
                    theme === 'cyber' || theme === 'mirage'
                      ? `inset 0 0 20px ${themeColor}10`
                      : undefined,
                }}
              >
                {/* Expression */}
                <div className="text-sm text-muted-foreground mb-1 h-6 truncate">
                  {expression || ' '}
                </div>
                {/* Display */}
                <div
                  className="text-3xl font-bold text-right truncate"
                  style={{
                    color: themeColor,
                    textShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? `0 0 10px ${themeColor}60`
                        : undefined,
                  }}
                >
                  {display}
                </div>
              </div>

              {/* Button Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {buttons.map((btn, index) => (
                  <motion.button
                    key={`${btn.label}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={btn.action}
                    className={getButtonStyle(btn.variant)}
                    style={
                      btn.variant === 'equals'
                        ? {
                            borderColor: themeColor,
                            backgroundColor: `${themeColor}20`,
                            color: themeColor,
                            boxShadow:
                              theme === 'cyber' || theme === 'mirage'
                                ? `0 0 15px ${themeColor}30`
                                : undefined,
                          }
                        : undefined
                    }
                  >
                    {btn.label}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopy}
                  className="flex-1 py-3 rounded-lg border border-border hover:bg-foreground/5 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddExpense}
                  className="flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 font-medium"
                  style={{
                    borderColor: themeColor,
                    backgroundColor: `${themeColor}20`,
                    color: themeColor,
                    boxShadow:
                      theme === 'cyber' || theme === 'mirage'
                        ? `0 0 15px ${themeColor}30`
                        : undefined,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add as Expense
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
