import { motion, AnimatePresence } from "framer-motion";
import { useFocusMode } from "@/contexts/FocusModeContext";
import { TaskCard } from "@/components/TaskCard";
import { NoteSection } from "@/components/NoteSection";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

interface FocusModeOverlayProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  dailyNote: string;
  onSaveNote: (note: string) => void;
}

export const FocusModeOverlay = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  dailyNote,
  onSaveNote,
}: FocusModeOverlayProps) => {
  const { isFocusMode, currentTaskId, setCurrentTaskId, toggleFocusMode } = useFocusMode();

  // Get active tasks (not completed)
  const activeTasks = tasks.filter((task) => !task.completed);

  // Get current focused task or first active task
  const focusedTask = currentTaskId
    ? tasks.find((task) => task.id === currentTaskId)
    : activeTasks[0];

  // Set current task if not set and there are active tasks
  if (!currentTaskId && activeTasks.length > 0 && isFocusMode) {
    setCurrentTaskId(activeTasks[0].id);
  }

  return (
    <AnimatePresence>
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-40 pointer-events-none"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ backdropFilter: "blur(0px) brightness(1)" }}
            animate={{ backdropFilter: "blur(12px) brightness(0.4)" }}
            exit={{ backdropFilter: "blur(0px) brightness(1)" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-black/60"
          />

          {/* Vignette Effect */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 100%)",
            }}
          />

          {/* Close Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-8 right-8 z-50 pointer-events-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFocusMode}
              className="h-12 w-12 rounded-full bg-background/10 backdrop-blur-xl border border-border/50 hover:bg-background/20 hover:border-cool-blue/50 transition-all duration-200 hover:scale-110 group"
              title="Exit Focus Mode (Esc)"
            >
              <X className="h-5 w-5 text-foreground group-hover:text-cool-blue transition-colors" />
            </Button>
          </motion.div>

          {/* Focused Content */}
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-auto overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="w-full max-w-4xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Task Section */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <Sparkles className="h-5 w-5 text-cool-blue" strokeWidth={2} />
                    <h2 className="text-2xl font-bold tracking-tight">Focus Task</h2>
                  </motion.div>

                  {focusedTask ? (
                    <motion.div
                      key={focusedTask.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                      style={{
                        filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.3))",
                      }}
                    >
                      <TaskCard
                        task={focusedTask}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                      />

                      {/* Glow Effect */}
                      <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-cool-blue/20 to-electric-red/20 rounded-xl -z-10 blur-2xl"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-lg p-12 text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-border/50 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-muted-foreground animate-pulse" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
                      <p className="text-muted-foreground text-sm">
                        No active tasks to focus on. Add a task to get started.
                      </p>
                    </motion.div>
                  )}

                  {/* Other Active Tasks */}
                  {activeTasks.length > 1 && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8"
                    >
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Up Next ({activeTasks.length - 1})
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {activeTasks
                          .filter((task) => task.id !== focusedTask?.id)
                          .map((task, index) => (
                            <motion.button
                              key={task.id}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              onClick={() => setCurrentTaskId(task.id)}
                              className="w-full text-left glass-card rounded-lg p-3 hover:bg-cool-blue/10 transition-all duration-200 border hover:border-cool-blue/50 group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-cool-blue group-hover:scale-150 transition-transform" />
                                <span className="text-sm font-medium group-hover:text-cool-blue transition-colors">
                                  {task.title}
                                </span>
                              </div>
                            </motion.button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Notes Section */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(59, 130, 246, 0.2))",
                  }}
                >
                  <NoteSection note={dailyNote} onSaveNote={onSaveNote} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
