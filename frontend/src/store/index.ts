import { create } from 'zustand';

interface StoreState {
  // Add your global state here
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<StoreState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
