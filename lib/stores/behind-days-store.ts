import { create } from "zustand";

interface BehindDaysStore {
  behindDaysCount: number;
  isLoading: boolean;
  hasError: boolean;
  setBehindDaysCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
}

export const useBehindDaysStore = create<BehindDaysStore>()((set) => ({
  behindDaysCount: 0,
  isLoading: true,
  hasError: false,
  setBehindDaysCount: (count) =>
    set({ behindDaysCount: count, isLoading: false, hasError: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (hasError) => set({ hasError, isLoading: false }),
}));
