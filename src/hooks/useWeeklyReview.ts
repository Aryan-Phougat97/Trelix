import { useState } from 'react';
import { useTable } from 'tinybase/ui-react';
import { store } from '../store';
import { Row } from 'tinybase';

export interface Intention {
  id: string;
  text: string;
  createdAt: string;
}

export interface WeeklyReview {
  weekOf: string;
  whatWorkedWell: string;
  whatNeedsImprovement: string;
  nextWeekIntentions: Intention[];
  completedAt?: string;
}

// DB Shape
interface ReviewRow {
  weekOf: string;
  whatWorkedWell: string;
  whatNeedsImprovement: string;
  nextWeekIntentions: string; // Serialized
  completedAt?: string;
}

const getMonday = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

export const useWeeklyReview = () => {
  const [selectedWeek, setSelectedWeek] = useState<string>(() => getMonday(new Date()));
  const reviewsTable = useTable('weekly_reviews');

  const reviews = Object.entries(reviewsTable).map(([id, row]) => {
    const dbRow = row as unknown as ReviewRow;
    return {
      weekOf: dbRow.weekOf,
      whatWorkedWell: dbRow.whatWorkedWell,
      whatNeedsImprovement: dbRow.whatNeedsImprovement,
      nextWeekIntentions: dbRow.nextWeekIntentions ? JSON.parse(dbRow.nextWeekIntentions) : [],
      completedAt: dbRow.completedAt,
      _rowId: id 
    };
  }) as (WeeklyReview & { _rowId: string })[];

  const currentReview = reviews.find(r => r.weekOf === selectedWeek) || {
    weekOf: selectedWeek,
    whatWorkedWell: '',
    whatNeedsImprovement: '',
    nextWeekIntentions: [],
    _rowId: null
  };

  const saveReviewUpdate = (updates: Partial<WeeklyReview>) => {
    const existing = reviews.find(r => r.weekOf === selectedWeek);
    
    const rowUpdate: Partial<ReviewRow> = {};
    if (updates.whatWorkedWell !== undefined) rowUpdate.whatWorkedWell = updates.whatWorkedWell;
    if (updates.whatNeedsImprovement !== undefined) rowUpdate.whatNeedsImprovement = updates.whatNeedsImprovement;
    if (updates.completedAt !== undefined) rowUpdate.completedAt = updates.completedAt;
    if (updates.nextWeekIntentions !== undefined) {
        rowUpdate.nextWeekIntentions = JSON.stringify(updates.nextWeekIntentions);
    }

    if (existing) {
      store.setPartialRow('weekly_reviews', existing._rowId, rowUpdate);
    } else {
      // For new rows, we must provide all required fields
      const newRow: ReviewRow = {
        weekOf: selectedWeek,
        whatWorkedWell: rowUpdate.whatWorkedWell || '',
        whatNeedsImprovement: rowUpdate.whatNeedsImprovement || '',
        nextWeekIntentions: rowUpdate.nextWeekIntentions || '[]',
        completedAt: rowUpdate.completedAt
      };
      store.addRow('weekly_reviews', newRow as unknown as Row);
    }
  };

  const saveWhatWorkedWell = (text: string) => saveReviewUpdate({ whatWorkedWell: text });
  const saveWhatNeedsImprovement = (text: string) => saveReviewUpdate({ whatNeedsImprovement: text });

  const addIntention = (text: string) => {
    const newIntention = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
    const currentIntentions = currentReview.nextWeekIntentions || [];
    saveReviewUpdate({ nextWeekIntentions: [...currentIntentions, newIntention] });
  };

  const removeIntention = (id: string) => {
    const filtered = currentReview.nextWeekIntentions.filter(i => i.id !== id);
    saveReviewUpdate({ nextWeekIntentions: filtered });
  };

  const updateIntention = (id: string, text: string) => {
    const updated = currentReview.nextWeekIntentions.map(i => i.id === id ? { ...i, text } : i);
    saveReviewUpdate({ nextWeekIntentions: updated });
  };

  const completeReview = () => saveReviewUpdate({ completedAt: new Date().toISOString() });

  const getWeekOptions = (count: number = 4) => {
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

  return {
    currentReview,
    saveWhatWorkedWell,
    saveWhatNeedsImprovement,
    addIntention,
    removeIntention,
    updateIntention,
    completeReview,
    getAllReviews: () => reviews.sort((a, b) => b.weekOf.localeCompare(a.weekOf)),
    selectedWeek,
    setSelectedWeek,
    getWeekOptions,
  };
};

export const getWeekOptions = (count: number = 4) => {
    const today = new Date();
    const options = [];
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 7);
        const monday = getMonday(date);
        options.push({ 
            label: i === 0 ? 'This Week' : i === 1 ? 'Last Week' : `${i} Weeks Ago`, 
            value: monday 
        });
    }
    return options;
};