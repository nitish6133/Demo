import { create } from "zustand";
import { persist } from "zustand/middleware";
import { verifyTokenService, logoutService, verifyTokenForLoginService } from "../services/authService";
import { serviceBaseUrl } from "../constants/appConstants";
import { User } from "../types/auth";

interface AuthState {
  isAuthenticated: boolean;
  authState: "notChecked" | "checking" | "valid" | "invalid";
  isLoading: boolean;
  user: User | null;
  loginWithProvider: (provider: string) => void;
  verifyTokenAfterLogin: () => Promise<void>;
  verifySessionPeriodically: () => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      authState: "notChecked",
      isLoading: false,
      user: null,

      loginWithProvider: (provider: string) => {
        try {
          const redirectUrl = `${serviceBaseUrl}/auth/provider?provider=${provider}`;
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("Error during login redirection:", error);
          set({ isLoading: false });
        }
      },

      verifyTokenAfterLogin: async () => {
        try {
          set({ isLoading: true });
          const data = await verifyTokenForLoginService();
          if (data?.code === 1040 && data?.result) {
            const user: User = data.result;
            set({
              user,
              isLoading: false,
              authState: "valid",
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isLoading: false,
              authState: "invalid",
              isAuthenticated: false,
            });
            console.log("Login verification failed");
          }
        } catch (error) {
          console.error("Error verifying token after login:", error);
          set({ user: null, isLoading: false, authState: "invalid" });
        }
      },

      verifySessionPeriodically: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          const data = await verifyTokenService();
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
        set({ user: null, isLoading: false, authState: "invalid" });
        try {
          const responseCode = await logoutService();
          console.log("Logout service response:", responseCode);
          set({ authState: "invalid", isAuthenticated: false, });
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          useAuthStore.persist.clearStorage();
          sessionStorage.clear();
          localStorage.clear();
        }
      },

      setUser: (user: User | null) =>
        set({
          user,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

