import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/contexts/FocusModeContext";

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export const PomodoroTimer = () => {
  const { isTimerActive, setIsTimerActive, isFocusMode } = useFocusMode();
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isExpanded, setIsExpanded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return POMODORO_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, timeRemaining, setIsTimerActive]);

  const handlePlayPause = () => {
    setIsTimerActive(!isTimerActive);
  };

  const handleReset = () => {
    setIsTimerActive(false);
    setTimeRemaining(POMODORO_DURATION);
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = ((POMODORO_DURATION - timeRemaining) / POMODORO_DURATION) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!isFocusMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="relative">
        {/* Circular Progress Ring */}
        <motion.div
          className="relative glass-card rounded-full p-3 backdrop-blur-xl border-2"
          animate={{
            boxShadow: isTimerActive
              ? [
                  "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)",
                  "0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2)",
                  "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)",
                ]
              : "0 0 20px rgba(0, 0, 0, 0.3)",
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="hsl(var(--border))"
              strokeWidth="3"
              fill="none"
              opacity="0.2"
            />
            {/* Progress circle */}
            <motion.circle
              cx="48"
              cy="48"
              r="45"
              stroke="hsl(var(--cool-blue))"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              style={{
                strokeDasharray: circumference,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="text-xl font-mono font-bold tracking-tight"
                animate={{ scale: isTimerActive ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 1, repeat: isTimerActive ? Infinity : 0 }}
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </motion.div>
              <div className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">
                Focus
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expanded Controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-3 right-0 glass-card rounded-lg p-3 backdrop-blur-xl border flex items-center gap-2 shadow-2xl"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="h-8 w-8 hover:bg-cool-blue/20 hover:text-cool-blue transition-all duration-200"
              >
                {isTimerActive ? (
                  <Pause className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" strokeWidth={2} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="h-8 w-8 hover:bg-electric-red/20 hover:text-electric-red transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2} />
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 px-2">
                <Clock className="h-3 w-3" />
                <span>Pomodoro</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
