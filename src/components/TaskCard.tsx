import { Trash2, Check, Tag, Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  completed: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryColors = {
  work: "bg-blue-500/20 text-blue-400 border-blue-400/30",
  personal: "bg-purple-500/20 text-purple-400 border-purple-400/30",
  goals: "bg-pink-500/20 text-pink-400 border-pink-400/30",
};

const priorityColors = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

export const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  return (
    <div
      className={`glass-card rounded-xl p-4 mb-3 animate-fade-in hover:scale-[1.02] transition-all duration-300 ${
        task.completed ? "opacity-60" : "neon-glow-cyan"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium mb-2 ${
              task.completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`px-2 py-1 rounded-lg border flex items-center gap-1 ${
                categoryColors[task.category as keyof typeof categoryColors]
              }`}
            >
              <Tag className="h-3 w-3" />
              {task.category}
            </span>

            <span className={`flex items-center gap-1 ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
              <Flag className="h-3 w-3" />
              {task.priority}
            </span>

            {task.deadline && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
