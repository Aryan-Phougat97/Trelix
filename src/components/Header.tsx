import { Search, Settings, Filter, BarChart3, CheckSquare, Network, ClipboardCheck, BookOpen, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusModeToggle } from "@/components/FocusModeToggle";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Logo } from "@/components/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export const Header = ({ onSearch, onFilterClick }: HeaderProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnDashboard = location.pathname === '/dashboard';
  const isOnFramework = location.pathname === '/framework';
  const isOnReview = location.pathname === '/review';
  const isOnDiary = location.pathname === '/diary';
  const isOnMood = location.pathname === '/mood';
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (isOnDashboard || isOnFramework || isOnReview || isOnDiary || isOnMood) {
      toast.info("Search is available on the Tasks page");
      return;
    }
    setShowSearch(!showSearch);
    if (showSearch && onSearch) {
      onSearch("");
      setSearchValue("");
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilter = () => {
    if (isOnDashboard || isOnFramework || isOnReview || isOnDiary || isOnMood) {
      toast.info("Filters are available on the Tasks page");
      return;
    }
    if (onFilterClick) {
      onFilterClick();
    } else {
      toast.info("Use the tabs below to filter tasks");
    }
  };

  const handleSettings = () => {
    toast.info("Settings coming soon!", {
      description: "Customization options will be available in the next update"
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-8 py-4 mb-8 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Trelix Logo */}
          <div className="flex items-center gap-2 animate-fade-in">
            <Logo size="md" showText />
          </div>

          {/* Right: Icon Actions */}
          <div className="flex items-center gap-1 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={() => navigate(isOnDashboard ? '/' : '/dashboard')}
            title={isOnDashboard ? 'Go to Tasks' : 'Go to Dashboard'}
          >
            {isOnDashboard ? (
              <CheckSquare className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
            ) : (
              <BarChart3 className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={() => navigate('/framework')}
            title="The Trelix Framework"
          >
            <Network className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={() => navigate('/review')}
            title="Weekly Review"
          >
            <ClipboardCheck className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={() => navigate('/diary')}
            title="Daily Diary"
          >
            <BookOpen className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={() => navigate('/mood')}
            title="Mood Tracker"
          >
            <Smile className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={handleSearch}
            title="Search tasks"
          >
            <Search className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={handleFilter}
            title="Advanced filters"
          >
            <Filter className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:scale-110" strokeWidth={2} />
          </Button>
          <FocusModeToggle />
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
            onClick={handleSettings}
            title="Settings"
          >
            <Settings className="h-4 w-4 group-hover:text-cool-blue transition-all duration-200 group-hover:rotate-90" strokeWidth={2} />
          </Button>
          </div>
        </div>

        {/* Search Bar - Slides in when search is active */}
        {showSearch && !isOnDashboard && !isOnFramework && !isOnReview && !isOnDiary && !isOnMood && (
          <div className="mt-4 animate-slide-up">
            <Input
              type="text"
              placeholder="Search tasks by title, category, or priority..."
              value={searchValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full glass-input bg-background/50 border border-border rounded-lg px-4 py-2 focus:border-cool-blue focus:ring-2 focus:ring-cool-blue/20 transition-all"
              autoFocus
            />
          </div>
        )}
      </div>
    </header>
  );
};
