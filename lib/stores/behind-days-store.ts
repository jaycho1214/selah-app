import { create } from "zustand";

interface BehindDaysStore {
  behindDaysCount: number;
  setBehindDaysCount: (count: number) => void;
}

export const useBehindDaysStore = create<BehindDaysStore>()((set) => ({
  behindDaysCount: 0,
  setBehindDaysCount: (count) => set({ behindDaysCount: count }),
}));
