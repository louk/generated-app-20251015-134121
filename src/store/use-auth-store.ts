import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { User } from '@shared/types';
import { api } from '@/lib/api-client';
interface AuthState {
  user: User | null;
  token: string | null; // In a real app, this would be a JWT
  login: (credentials: Pick<User, 'name' | 'password'>) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (credentials) => {
        const response = await api<{ user: User; token: string }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        set(produce((state) => {
          state.user = response.user;
          state.token = response.token;
        }));
      },
      register: async (userData) => {
        await api<User>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);