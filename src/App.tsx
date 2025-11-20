import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FocusModeProvider } from "@/contexts/FocusModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { AppLayout } from "@/components/AppLayout";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Framework from "./pages/Framework";
import Review from "./pages/Review";
import Diary from "./pages/Diary";
import MoodTracker from "./pages/MoodTracker";
import { HabitTracker } from "./pages/HabitTracker";
import { TrelixLedger } from "./pages/TrelixLedger";
import Inspiration from "./pages/Inspiration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wrapper for Tasks page to handle search
const TasksPage = () => {
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AnalyticsProvider>
          <FocusModeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Landing Page - No Layout */}
                <Route path="/" element={<Home />} />

                {/* All other pages - With AppLayout */}
                <Route path="/tasks" element={<AppLayout><TasksPage /></AppLayout>} />
                <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/framework" element={<AppLayout><Framework /></AppLayout>} />
                <Route path="/review" element={<AppLayout><Review /></AppLayout>} />
                <Route path="/diary" element={<AppLayout><Diary /></AppLayout>} />
                <Route path="/mood" element={<AppLayout><MoodTracker /></AppLayout>} />
                <Route path="/habits" element={<AppLayout><HabitTracker /></AppLayout>} />
                <Route path="/ledger" element={<AppLayout><TrelixLedger /></AppLayout>} />
                <Route path="/inspiration" element={<AppLayout><Inspiration /></AppLayout>} />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FocusModeProvider>
        </AnalyticsProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
