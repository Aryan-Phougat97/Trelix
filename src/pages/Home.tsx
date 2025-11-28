import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';
import { ProductivityHubSection } from '@/components/landing/ProductivityHubSection';
import { PlanningSection, WellbeingSection, LedgerSection } from '@/components/landing/FeatureSections';
import { LifeOSSection, FinalCTASection, FloatingNavbar } from '@/components/landing/CTASections';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Problem → Solution */}
      <ProblemSolutionSection />

      {/* Productivity Hub */}
      <ProductivityHubSection />

      {/* Planning & Goals */}
      <PlanningSection />

      {/* Wellbeing Modules */}
      <WellbeingSection />

      {/* Trelix Ledger */}
      <LedgerSection />

      {/* Life OS */}
      <LifeOSSection />

      {/* Final CTA */}
      <FinalCTASection />

      {/* Footer */}
      <footer className="relative py-12 bg-background border-t border-muted-foreground/10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Trelix. Built with ❤️ for productivity enthusiasts.
          </p>
          <p className="text-muted-foreground/55 text-xs mt-2">
            Your data stays yours. Private. Local-first. Forever free.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
