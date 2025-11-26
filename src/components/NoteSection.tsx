import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface NoteSectionProps {
  note: string;
  onSaveNote: (note: string) => void;
}

export const NoteSection = ({ note, onSaveNote }: NoteSectionProps) => {
  const [currentNote, setCurrentNote] = useState(note);
  const [isSaved, setIsSaved] = useState(true);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    onSaveNote(currentNote);
    setIsSaved(true);
  };

  return (
    <div className="glass-card rounded-lg p-6 space-y-4 animate-fade-in sticky top-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Daily Note</h2>
        <Button
          onClick={handleSave}
          size="sm"
          variant={isSaved ? "outline-solid" : "default"}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Write your thoughts, reflections, or notes about your day
        </p>
        <Textarea
          value={currentNote}
          onChange={handleNoteChange}
          placeholder="What's on your mind today?"
          className="min-h-[300px] resize-none bg-background/50 border-border/50 focus:border-border transition-colors"
        />
        <p className="text-xs text-muted-foreground text-right">
          {currentNote.length} characters
        </p>
      </div>
    </div>
  );
};
