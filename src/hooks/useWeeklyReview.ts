import { useState, useEffect } from 'react';

export interface WeeklyReview {
  weekOf: string; // ISO date string of Monday of that week
  whatWorkedWell: string;
  whatNeedsImprovement: string;
  nextWeekIntentions: Intention[];
  completedAt?: string;
}

export interface Intention {
  id: string;
  text: string;
  createdAt: string;
}

interface UseWeeklyReviewReturn {
  currentReview: WeeklyReview | null;
  saveWhatWorkedWell: (text: string) => void;
  saveWhatNeedsImprovement: (text: string) => void;
  addIntention: (text: string) => void;
  removeIntention: (id: string) => void;
  updateIntention: (id: string, text: string) => void;
  completeReview: () => void;
  getReviewForWeek: (weekOf: string) => WeeklyReview | null;
  getAllReviews: () => WeeklyReview[];
  selectedWeek: string;
  setSelectedWeek: (weekOf: string) => void;
}

const STORAGE_KEY = 'trelix-weekly-reviews';

const getMonday = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

export const useWeeklyReview = (): UseWeeklyReviewReturn => {
  const [reviews, setReviews] = useState<WeeklyReview[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load weekly reviews:', error);
      return [];
    }
  });

  const [selectedWeek, setSelectedWeek] = useState<string>(() => getMonday(new Date()));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Failed to save weekly reviews:', error);
    }
  }, [reviews]);

  const getCurrentOrCreateReview = (): WeeklyReview => {
    const existing = reviews.find((r) => r.weekOf === selectedWeek);
    if (existing) return existing;

    const newReview: WeeklyReview = {
      weekOf: selectedWeek,
      whatWorkedWell: '',
      whatNeedsImprovement: '',
      nextWeekIntentions: [],
    };
    return newReview;
  };

  const currentReview = getCurrentOrCreateReview();

  const updateReview = (updates: Partial<WeeklyReview>) => {
    setReviews((prev) => {
      const existing = prev.find((r) => r.weekOf === selectedWeek);
      if (existing) {
        return prev.map((r) =>
          r.weekOf === selectedWeek ? { ...r, ...updates } : r
        );
      } else {
        return [...prev, { ...getCurrentOrCreateReview(), ...updates }];
      }
    });
  };

  const saveWhatWorkedWell = (text: string) => {
    updateReview({ whatWorkedWell: text });
  };

  const saveWhatNeedsImprovement = (text: string) => {
    updateReview({ whatNeedsImprovement: text });
  };

  const addIntention = (text: string) => {
    const newIntention: Intention = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };
    updateReview({
      nextWeekIntentions: [...currentReview.nextWeekIntentions, newIntention],
    });
  };

  const removeIntention = (id: string) => {
    updateReview({
      nextWeekIntentions: currentReview.nextWeekIntentions.filter((i) => i.id !== id),
    });
  };

  const updateIntention = (id: string, text: string) => {
    updateReview({
      nextWeekIntentions: currentReview.nextWeekIntentions.map((i) =>
        i.id === id ? { ...i, text } : i
      ),
    });
  };

  const completeReview = () => {
    updateReview({
      completedAt: new Date().toISOString(),
    });
  };

  const getReviewForWeek = (weekOf: string): WeeklyReview | null => {
    return reviews.find((r) => r.weekOf === weekOf) || null;
  };

  const getAllReviews = (): WeeklyReview[] => {
    return reviews.sort((a, b) => b.weekOf.localeCompare(a.weekOf));
  };

  return {
    currentReview,
    saveWhatWorkedWell,
    saveWhatNeedsImprovement,
    addIntention,
    removeIntention,
    updateIntention,
    completeReview,
    getReviewForWeek,
    getAllReviews,
    selectedWeek,
    setSelectedWeek,
  };
};

// Helper to get week options for dropdown
export const getWeekOptions = (count: number = 4): { label: string; value: string }[] => {
  const options: { label: string; value: string }[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    const monday = getMonday(date);
    const label = i === 0 ? 'This Week' : i === 1 ? 'Last Week' : `${i} Weeks Ago`;
    options.push({ label, value: monday });
  }

  return options;
};
