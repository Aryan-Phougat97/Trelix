import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export const AppLayout = ({ children, showHeader = true, onSearch, onFilterClick }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-30">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-10 w-10 rounded-full shadow-lg bg-card/80 backdrop-blur-sm border-border/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Header (optional) */}
        {showHeader && <Header onSearch={onSearch} onFilterClick={onFilterClick} />}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
