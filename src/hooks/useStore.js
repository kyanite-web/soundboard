import { useCallback } from 'react';

export function useStore() {
  const get = useCallback(async (key) => {
    if (window.electronAPI) {
      return window.electronAPI.store.get(key);
    }
    // Fallback for non-electron env
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : undefined;
  }, []);

  const set = useCallback(async (key, value) => {
    if (window.electronAPI) {
      return window.electronAPI.store.set(key, value);
    }
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

  return { get, set };
}
