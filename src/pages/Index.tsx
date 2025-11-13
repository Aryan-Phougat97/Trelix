import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TaskInput } from "@/components/TaskInput";
import { TaskCard } from "@/components/TaskCard";
import { FilterTabs } from "@/components/FilterTabs";
import { StatsPanel } from "@/components/StatsPanel";
import { NoteSection } from "@/components/NoteSection";
import { FocusModeOverlay } from "@/components/FocusModeOverlay";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AmbientSoundPlayer } from "@/components/AmbientSoundPlayer";
import { useFocusMode } from "@/contexts/FocusModeContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

const Index = () => {
  const { isFocusMode } = useFocusMode();
  const { recordTaskCompletion, recordNoteActivity } = useAnalytics();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [dailyNote, setDailyNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load note from localStorage
    const savedNote = localStorage.getItem("dailyNote");
    if (savedNote) {
      setDailyNote(savedNote);
    }
  }, []);

  const saveNote = (note: string) => {
    setDailyNote(note);
    localStorage.setItem("dailyNote", note);
    // Track note activity
    const wordCount = note.trim().split(/\s+/).filter(Boolean).length;
    recordNoteActivity(wordCount);
    toast.success("Note saved successfully!");
  };

  const addTask = (taskData: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    toast.success("Task added successfully!", {
      description: taskData.title,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      // Track task completion in analytics
      recordTaskCompletion(id, {
        title: task.title,
        category: task.category,
        priority: task.priority,
        deadline: task.deadline,
        completed: true,
        createdAt: new Date().toISOString(),
      });
      toast.success("Task completed! 🎉");
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.info("Task deleted");
  };

  const filteredTasks = tasks.filter((task) => {
    // First apply search filter
    const matchesSearch = searchQuery.trim() === "" ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Then apply category filter
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return task.completed;
    return task.category === activeFilter && !task.completed;
  });

  const counts = {
    all: tasks.filter((t) => !t.completed).length,
    work: tasks.filter((t) => t.category === "work" && !t.completed).length,
    personal: tasks.filter((t) => t.category === "personal" && !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Minimal Grid Pattern Overlay - Very Subtle with Animation */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none animate-fade-in"></div>

      {/* Main Content - Fades when Focus Mode is active */}
      <AnimatePresence>
        <motion.div
          className="relative z-10"
          animate={{
            opacity: isFocusMode ? 0.3 : 1,
            filter: isFocusMode ? "blur(8px)" : "blur(0px)",
          }}
          transition={{ duration: 0.5 }}
        >
          <Header onSearch={setSearchQuery} />

          <div className="container max-w-7xl mx-auto px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - 2/3 Width */}
              <div className="lg:col-span-2 space-y-6">
                <TaskInput onAddTask={addTask} />
                <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

                <div className="space-y-3 pb-8">
                  {filteredTasks.length === 0 ? (
                    <div className="glass-card rounded-lg p-16 text-center animate-fade-in">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-border flex items-center justify-center animate-bounce-in">
                        <span className="text-3xl opacity-50 animate-float">✨</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 tracking-tight animate-slide-up">No tasks here</h3>
                      <p className="text-muted-foreground text-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {activeFilter === "all"
                          ? "Add your first task to get started."
                          : `No ${activeFilter} tasks yet.`}
                      </p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Stats Sidebar - 1/3 Width */}
              <div className="lg:col-span-1 space-y-6">
                <StatsPanel {...stats} />
                <NoteSection note={dailyNote} onSaveNote={saveNote} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Focus Mode Overlay */}
      <FocusModeOverlay
        tasks={tasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        dailyNote={dailyNote}
        onSaveNote={saveNote}
      />

      {/* Pomodoro Timer */}
      <PomodoroTimer />

      {/* Ambient Sound Player */}
      <AmbientSoundPlayer />
    </div>
  );
};

export default Index;
