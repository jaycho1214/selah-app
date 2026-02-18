import { create } from "zustand";

export interface PlanReading {
  id: string;
  book: string;
  startChapter: number;
  startVerse?: number | null;
  endChapter?: number | null;
  endVerse?: number | null;
}

interface ReadingPlanStore {
  // Active plan session (set when navigating from plan detail to Bible reader)
  activePlanId: string | null;
  activeDayId: string | null;
  activeDayNumber: number | null;
  planTitle: string | null;
  planDayCount: number | null;
  readings: PlanReading[];
  currentReadingIndex: number;
  completedReadingIds: Set<string>;

  // Scroll progress for circular indicator (0-1)
  scrollProgress: number;

  // Day completion celebration trigger
  dayJustCompleted: boolean;

  // Actions
  startPlanSession: (data: {
    planId: string;
    dayId: string;
    dayNumber: number;
    planTitle: string;
    planDayCount: number;
    readings: PlanReading[];
    completedReadingIds: Set<string>;
  }) => void;
  clearPlanSession: () => void;
  setCurrentReadingIndex: (index: number) => void;
  markReadingComplete: (readingId: string) => void;
  markReadingUncomplete: (readingId: string) => void;
  setScrollProgress: (progress: number) => void;
  setDayJustCompleted: (completed: boolean) => void;
}

export const useReadingPlanStore = create<ReadingPlanStore>()((set) => ({
  activePlanId: null,
  activeDayId: null,
  activeDayNumber: null,
  planTitle: null,
  planDayCount: null,
  readings: [],
  currentReadingIndex: 0,
  completedReadingIds: new Set(),
  scrollProgress: 0,
  dayJustCompleted: false,

  startPlanSession: (data) =>
    set({
      activePlanId: data.planId,
      activeDayId: data.dayId,
      activeDayNumber: data.dayNumber,
      planTitle: data.planTitle,
      planDayCount: data.planDayCount,
      readings: data.readings,
      currentReadingIndex: 0,
      completedReadingIds: data.completedReadingIds,
      scrollProgress: 0,
      dayJustCompleted: false,
    }),

  clearPlanSession: () =>
    set({
      activePlanId: null,
      activeDayId: null,
      activeDayNumber: null,
      planTitle: null,
      planDayCount: null,
      readings: [],
      currentReadingIndex: 0,
      completedReadingIds: new Set(),
      scrollProgress: 0,
      dayJustCompleted: false,
    }),

  setCurrentReadingIndex: (index) => set({ currentReadingIndex: index }),

  markReadingComplete: (readingId) =>
    set((state) => ({
      completedReadingIds: new Set([...state.completedReadingIds, readingId]),
    })),

  markReadingUncomplete: (readingId) =>
    set((state) => {
      const next = new Set(state.completedReadingIds);
      next.delete(readingId);
      return { completedReadingIds: next };
    }),

  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  setDayJustCompleted: (completed) => set({ dayJustCompleted: completed }),
}));
