import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FocusModeProvider } from "@/contexts/FocusModeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Framework from "./pages/Framework";
import Review from "./pages/Review";
import Diary from "./pages/Diary";
import MoodTracker from "./pages/MoodTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/framework" element={<Framework />} />
                <Route path="/review" element={<Review />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/mood" element={<MoodTracker />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
