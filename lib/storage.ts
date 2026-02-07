import { createMMKV, type MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

// Single MMKV instance for all settings
export const storage: MMKV = createMMKV({ id: "selah-storage" });

// Zustand-compatible storage adapter
export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
