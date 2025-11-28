import { motion } from "framer-motion";
import { Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/contexts/FocusModeContext";

export const FocusModeToggle = () => {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFocusMode}
        className={`h-9 w-9 hover:bg-foreground/5 hover:scale-110 hover:text-primary transition-all duration-200 group active:scale-95 relative ${
          isFocusMode ? "bg-cool-blue/10" : ""
        }`}
      >
        {isFocusMode ? (
          <motion.div
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ rotate: 90, scale: 1 }}
            exit={{ rotate: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <X
              className="h-4 w-4 text-electric-red transition-all duration-200"
              strokeWidth={2}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
          >
            <Target
              className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200"
              strokeWidth={2}
            />
          </motion.div>
        )}

        {/* Active Indicator */}
        {isFocusMode && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cool-blue rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  );
};
