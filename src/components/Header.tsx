import { Moon, Sun, Search, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header = ({ isDark, onToggleTheme }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-8 py-4 mb-8 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: TaskFlow-X Wordmark */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight font-mono animate-fade-in">
            <span className="minimal-wordmark">TaskFlow-X</span>
          </h1>
        </div>

        {/* Right: Icon Actions */}
        <div className="flex items-center gap-1 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
          >
            <Search className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
          >
            <Filter className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
          >
            {isDark ? (
              <Sun className="h-4 w-4 group-hover:text-electric-red transition-all duration-200 group-hover:rotate-90" strokeWidth={2} />
            ) : (
              <Moon className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:-rotate-12" strokeWidth={2} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
          >
            <Settings className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:rotate-90" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </header>
  );
};
