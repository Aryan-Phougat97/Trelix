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
    <div className="glass-card rounded-lg p-8 mb-8 animate-slide-in max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Task Input - Clean Underline Style */}
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="glass-input h-16 text-xl px-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Category */}
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <Tag className="h-4 w-4 text-cool-blue" strokeWidth={2} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <Flag className="h-4 w-4 text-electric-red" strokeWidth={2} />
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <Calendar className="h-4 w-4 text-cool-blue" strokeWidth={2} />
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 text-sm"
            />
          </div>
        </div>

        {/* Add Button - Floating Glow Circle */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-full bg-cool-blue hover:bg-cool-blue/90 glow-blue hover:scale-110 transition-all duration-300 group"
          >
            <Plus className="h-6 w-6 text-black group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
          </Button>
        </div>
      </form>
    </div>
  );
};
