import { motion } from 'framer-motion';
import { ReviewSection } from '@/components/ReviewSection';
import { CompletedTasksSection } from '@/components/CompletedTasksSection';
import { ReflectionInput } from '@/components/ReflectionInput';
import { NextWeekIntentions } from '@/components/NextWeekIntentions';
import { useWeeklyReview, getWeekOptions } from '@/hooks/useWeeklyReview';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { CheckCircle2, Lightbulb, TrendingDown, Sparkles, Award, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const Review = () => {
  const {
    currentReview,
    saveWhatWorkedWell,
    saveWhatNeedsImprovement,
    addIntention,
    removeIntention,
    updateIntention,
    completeReview,
    selectedWeek,
    setSelectedWeek,
  } = useWeeklyReview();

  const { weeklyStats } = useAnalytics();
  const weekOptions = getWeekOptions(4);

  const handleCompleteReview = () => {
    if (currentReview?.completedAt) {
      toast.info('This review has already been completed!');
      return;
    }

    completeReview();

    // Light confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['hsl(var(--primary))', 'hsl(var(--secondary))'],
    });

    toast.success('Review Completed! 🎉', {
      description: 'Great work. You just re-engineered your upcoming week.',
      duration: 4000,
    });
  };

  const isThisWeek = selectedWeek === weekOptions[0].value;
  const isCompleted = currentReview?.completedAt;

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] pointer-events-none animate-fade-in"></div>

      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-8 py-6">
          {/* Page Header */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-linear-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Weekly Review
            </h1>
            <p className="text-muted-foreground text-lg">
              Reflect. Refine. Re-engineer your week.
            </p>
          </motion.div>

          {/* Week Selector */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[200px] glass-card border-border/50 hover:border-primary/30 transition-all">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/50">
                {weekOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Weekly Highlight */}
          <motion.div
            className="glass-card rounded-xl p-6 mb-8 border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Weekly Highlight</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Tasks Completed</p>
                <p className="text-2xl font-bold text-primary">{weeklyStats.completedTasks}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                <p className="text-sm text-muted-foreground mb-1">Focus Hours</p>
                <p className="text-2xl font-bold text-secondary">
                  {(weeklyStats.totalFocusMinutes / 60).toFixed(1)}h
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-sm text-muted-foreground mb-1">Most Productive Day</p>
                <p className="text-2xl font-bold text-green-500">{weeklyStats.topProductivityDay}</p>
              </div>
            </div>
          </motion.div>

          {/* Review Sections */}
          <div className="space-y-6 mb-8">
            {/* Section 1: Completed Goals & Tasks */}
            <ReviewSection
              title="Completed Goals & Tasks"
              icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
              defaultExpanded={true}
              index={0}
            >
              <CompletedTasksSection weekOf={selectedWeek} />
            </ReviewSection>

            {/* Section 2: What Worked Well */}
            <ReviewSection
              title="What Worked Well"
              icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
              defaultExpanded={false}
              index={1}
            >
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Celebrate your wins. What habits, strategies, or moments made this week successful?
                </p>
                <ReflectionInput
                  value={currentReview?.whatWorkedWell || ''}
                  onChange={saveWhatWorkedWell}
                  placeholder="Write about your accomplishments, strong habits, and wins..."
                  minHeight="120px"
                />
              </div>
            </ReviewSection>

            {/* Section 3: What Needs Improvement */}
            <ReviewSection
              title="What Needs Improvement"
              icon={<TrendingDown className="h-5 w-5 text-orange-500" />}
              defaultExpanded={false}
              index={2}
            >
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No judgment, just growth. What obstacles, distractions, or missed opportunities can you learn from?
                </p>
                <ReflectionInput
                  value={currentReview?.whatNeedsImprovement || ''}
                  onChange={saveWhatNeedsImprovement}
                  placeholder="Reflect on obstacles, distractions, and areas for improvement..."
                  minHeight="120px"
                />
              </div>
            </ReviewSection>

            {/* Section 4: Next Week's Intentions */}
            <ReviewSection
              title="Next Week's Intentions"
              icon={<Sparkles className="h-5 w-5 text-purple-500" />}
              defaultExpanded={false}
              index={3}
            >
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Set 2-5 major intentions for next week. Focus on what truly matters.
                </p>
                <NextWeekIntentions
                  intentions={currentReview?.nextWeekIntentions || []}
                  onAddIntention={addIntention}
                  onRemoveIntention={removeIntention}
                  onUpdateIntention={updateIntention}
                />
              </div>
            </ReviewSection>
          </div>

          {/* Complete Review Button */}
          {isThisWeek && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Button
                onClick={handleCompleteReview}
                disabled={!!isCompleted}
                className="px-8 py-6 text-lg bg-linear-to-r from-primary to-secondary hover:opacity-90 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <PartyPopper className="h-5 w-5 mr-2" />
                {isCompleted ? 'Review Completed ✓' : 'Complete Review'}
              </Button>

              {isCompleted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground italic"
                >
                  Completed on {new Date(currentReview?.completedAt!).toLocaleDateString()}
                </motion.p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
