import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user' | null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Demo credentials
const DEMO_CREDENTIALS = {
  admin: { email: 'admin@jewelry.com', password: 'admin123' },
  user: { email: 'user@jewelry.com', password: 'user123' }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check demo credentials
        if (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
          const adminUser: User = {
            id: 'admin-1',
            email: email,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          };
          set({ user: adminUser, isAuthenticated: true });
          return true;
        }

        if (email === DEMO_CREDENTIALS.user.email && password === DEMO_CREDENTIALS.user.password) {
          const regularUser: User = {
            id: 'user-1',
            email: email,
            firstName: 'John',
            lastName: 'Doe',
            role: 'user'
          };
          set({ user: regularUser, isAuthenticated: true });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);