/**
 * 🏠 Home Page - Grok-Inspired Landing
 * Optimized with LazyMotion for performance
 * GPU-accelerated, buttery-smooth animations
 */

import { LazyMotion, domAnimation } from 'framer-motion';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionSection';
import { ProductivityHubSection } from '@/components/landing/ProductivityHubSection';
import { PlanningSection, WellbeingSection, LedgerSection } from '@/components/landing/FeatureSections';
import { LifeOSSection, FinalCTASection, FloatingNavbar } from '@/components/landing/CTASections';

const Home = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-black text-white overflow-x-hidden smooth-scroll">
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
        <footer className="relative py-12 bg-black border-t border-white/10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-white/40 text-sm">
              © 2025 Trelix. Built with ❤️ for productivity enthusiasts.
            </p>
            <p className="text-white/30 text-xs mt-2">
              Your data stays yours. Private. Local-first. Forever free.
            </p>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
};

export default Home;
