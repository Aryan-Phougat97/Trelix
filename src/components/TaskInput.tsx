import { useState } from "react";
import { Plus, Tag, Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskInputProps {
  onAddTask: (task: {
    title: string;
    category: string;
    priority: string;
    deadline: string;
  }) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({ title, category, priority, deadline });
      setTitle("");
      setDeadline("");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="glass-input h-14 text-lg pl-5 pr-5 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
            <Tag className="h-4 w-4 text-primary" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
            <Flag className="h-4 w-4 text-secondary" />
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 glass-input rounded-xl px-3 py-2">
            <Calendar className="h-4 w-4 text-neon-pink" />
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </form>
    </div>
  );
};
