import { Trash2, Tag, Calendar, Flag } from "lucide-react";
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
  work: "text-cool-blue border-cool-blue/30",
  personal: "text-electric-red border-electric-red/30",
  goals: "text-cool-blue border-cool-blue/30",
};

const priorityGlow = {
  low: "",
  medium: "hover:glow-blue",
  high: "hover:glow-red",
};

export const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  return (
    <div
      className={`bg-card border border-border rounded-lg p-5 mb-3 animate-scale-in transition-all duration-300 group ${
        task.completed
          ? "task-completed opacity-60"
          : `hover:border-foreground/20 hover:-translate-y-1 hover:shadow-lg ${priorityGlow[task.priority as keyof typeof priorityGlow]}`
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1.5 h-5 w-5 border-2 border-border data-[state=checked]:bg-cool-blue data-[state=checked]:border-cool-blue data-[state=checked]:text-black transition-all duration-200 hover:scale-110"
        />

        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold mb-3 tracking-tight ${
              task.completed ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`px-2 py-1 border rounded-md flex items-center gap-1.5 ${
                categoryColors[task.category as keyof typeof categoryColors]
              }`}
            >
              <Tag className="h-3 w-3" strokeWidth={2} />
              {task.category}
            </span>

            <span className={`flex items-center gap-1.5 ${
              task.priority === 'high' ? 'text-electric-red' :
              task.priority === 'medium' ? 'text-cool-blue' :
              'text-muted-foreground'
            }`}>
              <Flag className="h-3 w-3" strokeWidth={2} />
              {task.priority}
            </span>

            {task.deadline && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3 w-3" strokeWidth={2} />
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:bg-electric-red/10 hover:text-electric-red transition-all duration-200 hover:scale-110"
        >
          <Trash2 className="h-4 w-4 transition-transform group-hover:rotate-12" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};
