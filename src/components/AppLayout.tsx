import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { FocusModeOverlay } from '@/components/FocusModeOverlay'; 
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useFocusMode } from '@/contexts/FocusModeContext';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { AmbientSoundPlayer } from '@/components/AmbientSoundPlayer';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export const AppLayout = ({ children, showHeader = true, onSearch, onFilterClick }: AppLayoutProps) => {
  const [userSidebarOpen, setUserSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const location = useLocation();
  const { isFocusMode } = useFocusMode();

  const sidebarOpen = isFocusMode ? false : userSidebarOpen;
  const handleSidebarToggle = () => {
    if (!isFocusMode) {
      setUserSidebarOpen(!userSidebarOpen);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setUserSidebarOpen(false);
      } else {
        setUserSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setUserSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onToggle={handleSidebarToggle} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden fixed top-4 left-4 z-60">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSidebarToggle}
            className="h-12 w-12 rounded-full shadow-lg bg-card/90 backdrop-blur-xs border-border/50 hover:bg-card"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {showHeader && <Header onSearch={onSearch} onFilterClick={onFilterClick} />}

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <FocusModeOverlay />
      <PomodoroTimer />
      <AmbientSoundPlayer />
    </div>
  );
};