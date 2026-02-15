import { createMMKV, type MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

// Lazy-initialized MMKV instance — avoids calling NitroModules during
// JS bundle evaluation when the native factory may not be ready yet
// (causes SIGSEGV on TestFlight/production builds).
let _storage: MMKV | null = null;

export function getStorage(): MMKV {
  if (!_storage) {
    _storage = createMMKV({ id: "selah-storage" });
  }
  return _storage;
}

// Zustand-compatible storage adapter
export const mmkvStorage: StateStorage = {
  getItem: (name: string) => {
    const value = getStorage().getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    getStorage().set(name, value);
  },
  removeItem: (name: string) => {
    getStorage().remove(name);
  },
};
