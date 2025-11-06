import { Moon, Sun, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header = ({ isDark, onToggleTheme }: HeaderProps) => {
  return (
    <header className="glass-card rounded-2xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="TaskFlow-X Logo"
            className="w-12 h-12 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300"
          />
          <img
            src="/namelogo.png"
            alt="TaskFlow-X"
            className="h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
