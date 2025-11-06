import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TaskInput } from "@/components/TaskInput";
import { TaskCard } from "@/components/TaskCard";
import { FilterTabs } from "@/components/FilterTabs";
import { StatsPanel } from "@/components/StatsPanel";
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
  const [isDark, setIsDark] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
      toast.success("Task completed! 🎉");
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.info("Task deleted");
  };

  const filteredTasks = tasks.filter((task) => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-pink/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s", transform: "translate(-50%, -50%)" }}></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
        <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskInput onAddTask={addTask} />
            <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl">✨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No tasks here!</h3>
                  <p className="text-muted-foreground">
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

          <div className="lg:col-span-1">
            <StatsPanel {...stats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
