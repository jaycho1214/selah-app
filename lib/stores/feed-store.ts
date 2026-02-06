import { create } from 'zustand';

interface FeedStore {
  activeTab: number; // 0 = For You, 1 = Following
  setActiveTab: (tab: number) => void;
}

export const useFeedStore = create<FeedStore>()((set) => ({
  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
