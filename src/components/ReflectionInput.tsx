import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

interface ReflectionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeight?: string;
}

export const ReflectionInput = ({
  value,
  onChange,
  placeholder,
  minHeight = '150px',
}: ReflectionInputProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsFocused(false);
    onChange(localValue);
  };

  const wordCount = localValue.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-2">
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px oklch(var(--primary) / 0.2)'
            : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
        className="rounded-lg overflow-hidden"
      >
        <Textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="resize-none w-full bg-background/50 border border-border/50 focus:border-primary/50 transition-all duration-200"
          style={{ minHeight }}
        />
      </motion.div>
      {localValue.trim() && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </motion.p>
      )}
    </div>
  );
};
