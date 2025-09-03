import { create } from "zustand";
import { persist } from "zustand/middleware";
import { verifyTokenService, logoutService, verifyTokenForLoginService } from "../services/authService";
import type { User } from "../types";

interface LoginState {
  isLoading: boolean;
  user: User | null;
  backendUrl: string;
  loginWithProvider: (provider: string) => void;
  verifyTokenAfterLogin: () => Promise<void>;
  verifySessionPeriodically: () => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setBackendUrl: (url: string) => void;
}

// Create a unique store name to avoid conflicts with host app
const STORE_NAME = `react-login-component-auth-${Date.now()}`;

export const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      user: null,
      backendUrl: '',

      setBackendUrl: (url: string) => {
        set({ backendUrl: url });
      },

      loginWithProvider: (provider: string) => {
        const { backendUrl: storeBackendUrl } = get();
        const backendUrl = storeBackendUrl || import.meta.env.VITE_API_BASE_URL;
        if (!backendUrl) {
          console.error('Backend URL not available');
          return;
        }

        set({ isLoading: true });
        try {
          const redirectUrl = `${backendUrl}/auth/provider?provider=${provider}`;
          window.location.href = redirectUrl;
          set({ isLoading: false });
        } catch (error) {
          console.error("Error during login redirection:", error);
          set({ isLoading: false });
        }
      },

      verifyTokenAfterLogin: async () => {
        const { backendUrl: storeBackendUrl } = get();
        const backendUrl = storeBackendUrl || import.meta.env.VITE_API_BASE_URL;
        if (!backendUrl) {
          console.error('Backend URL not available');
          return;
        }

        try {
          const data = await verifyTokenForLoginService(backendUrl);
          if (data?.code === 1040 && data?.result) {
            const user: User = data.result;
            set({ user, isLoading: false });
            console.log("User verified and stored after login:", user);
          } else {
            set({ user: null, isLoading: false });
            console.log("Login verification failed");
          }
        } catch (error) {
          console.error("Error verifying token after login:", error);
          set({ user: null, isLoading: false });
        }
      },

      verifySessionPeriodically: async () => {
        const { backendUrl: storeBackendUrl, user: currentUser } = get();
        const backendUrl = storeBackendUrl || import.meta.env.VITE_API_BASE_URL;
        if (!currentUser || !backendUrl) return;
        
        try {
          const data = await verifyTokenService(backendUrl);
          if (data.code !== 1040) {
            console.warn(`Session invalid (code: ${data.code}), logging out...`);
            get().logout();
          }
        } catch (error) {
          console.error("Error in periodic session verification:", error);
          get().logout();
        }
      },

      logout: async () => {
        const { backendUrl: storeBackendUrl } = get();
        const backendUrl = storeBackendUrl || import.meta.env.VITE_API_BASE_URL;
        set({ user: null, isLoading: false });
        
        try {
          if (backendUrl) {
            const responseCode = await logoutService(backendUrl);
            console.log("Logout service response:", responseCode);
          }
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          // Clear only this component's storage
          useLoginStore.persist.clearStorage();
        }
      },

      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: STORE_NAME,
      partialize: (state) => ({ user: state.user }),
    }
  )
);