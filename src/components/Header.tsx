import { Search, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusModeToggle } from "@/components/FocusModeToggle";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export const Header = ({ onSearch, onFilterClick }: HeaderProps = {}) => {
  const location = useLocation();
  const isOnTasksPage = location.pathname === '/tasks' || location.pathname === '/';
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (!isOnTasksPage) {
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
    if (!isOnTasksPage) {
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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-3 animate-slide-up">
      <div className="flex items-center justify-end gap-2">
        {/* Utility Actions - Search, Filter, Focus Mode, Theme, Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
          onClick={handleSearch}
          title="Search tasks"
        >
          <Search className="h-4 w-4 group-hover:text-primary transition-all duration-200" strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-foreground/5 hover:scale-110 transition-all duration-200 group active:scale-95"
          onClick={handleFilter}
          title="Filter tasks"
        >
          <Filter className="h-4 w-4 group-hover:text-primary transition-all duration-200" strokeWidth={2} />
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
          <Settings className="h-4 w-4 group-hover:text-primary transition-all duration-200 group-hover:rotate-90" strokeWidth={2} />
        </Button>
      </div>

      {/* Search Bar - Slides in when search is active */}
      {showSearch && isOnTasksPage && (
        <div className="mt-3 animate-slide-up">
          <Input
            type="text"
            placeholder="Search tasks by title, category, or priority..."
            value={searchValue}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            autoFocus
          />
        </div>
      )}
    </header>
  );
};
