import { User } from '@/types/User'; // Adjust the path based on your project structure
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  affiliate: User["affiliate"] | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoading: boolean | null;
  
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  affiliate: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  isLoading: null,
}));