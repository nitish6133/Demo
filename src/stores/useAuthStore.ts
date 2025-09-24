import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Login, logoutService, registerUser, verifyTokenForLoginService, verifyTokenService } from '../services/authService';
import { RegisterData, User } from '../types/auth';
import { ApiResponseBlank } from '../types/apiResponse';

interface AuthState {
    isLoading: boolean;
    username: string | null;
    email: string | null;
    isLoggedIn: boolean;
    error: string | null;
    authState: "notChecked" | "checking" | "valid" | "invalid";
    isAuthenticated: boolean;
    user: User | null;
    successMessage: string | null;
    verifyTokenAfterLogin: () => Promise<void>;
    verifySessionPeriodically: () => Promise<void>;
    registerUser: (credentials: RegisterData) => Promise<ApiResponseBlank>;
    Login: (username: string, password: string) => Promise<boolean>;
    clearError: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            discountCodes: [],
            isLoading: false,
            error: null,
            authState: "notChecked",
            isAuthenticated: false,
            successMessage: null,
            user: null,
            username: null,
            email: null,
            isLoggedIn: true,

            Login: async (username: string, password: string) => {
                set({ isLoading: true, error: null, authState: "checking" });

                try {
                    const result = await Login(username, password);
                    console.log("result", result);

                    if (result.success && result.data) {
                        const user: User = result.data;

                        set({
                            authState: "valid",
                            isLoading: false,
                            isAuthenticated: true,
                            isLoggedIn: true,
                            user,
                            username: user.username,
                            email: user.email,
                        });

                        return true;
                    } else {
                        set({
                            isLoading: false,
                            authState: "invalid",
                            isAuthenticated: false,
                            isLoggedIn: false,
                            user: null,
                            username: null,
                            email: null,
                        });
                        return false;
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message || "Login failed",
                        isLoading: false,
                        authState: "invalid",
                        isAuthenticated: false,
                        isLoggedIn: false,
                        user: null,
                        username: null,
                        email: null,
                    });
                    return false;
                }
            },


            verifyTokenAfterLogin: async () => {
                try {
                    set({ isLoading: true, authState: "checking" });
                    const data = await verifyTokenForLoginService();

                    if (data?.code === 1040 && data?.result) {
                        const user: User = data.result;

                        set({
                            user,
                            username: user.username,
                            email: user.email,
                            isLoading: false,
                            authState: "valid",
                            isAuthenticated: true,
                            isLoggedIn: true,
                        });
                    } else {
                        set({
                            user: null,
                            username: null,
                            email: null,
                            isLoading: false,
                            authState: "invalid",
                            isAuthenticated: false,
                            isLoggedIn: false,
                        });
                        console.log("Login verification failed");
                    }
                } catch (error) {
                    console.error("Error verifying token after login:", error);
                    set({
                        user: null,
                        username: null,
                        email: null,
                        isLoading: false,
                        authState: "invalid",
                        isAuthenticated: false,
                        isLoggedIn: false,
                    });
                }
            },


            registerUser: async (credentials: RegisterData): Promise<ApiResponseBlank> => {
                set({ isLoading: true, authState: "checking" });
                try {
                    const response = await registerUser(credentials);
                    if (response.code === 1001) {
                        set({
                            user: response.result,
                            isAuthenticated: true,
                            authState: "valid",
                            successMessage: response.message,
                        });
                    } else {
                        set({
                            isAuthenticated: false,
                            authState: "invalid",
                            error: response.message,
                        });
                    }
                    set({ isLoading: false });
                    return response;
                } catch (error: any) {
                    set({
                        isAuthenticated: false,
                        authState: "invalid",
                        isLoading: false,
                        error: error.message || "Registration failed.",
                    });
                    return {
                        code: 999,
                        message: error.message || "Registration failed due to an issue.",
                    };
                }
            },

            verifySessionPeriodically: async () => {
                const currentUser = get().user;
                if (!currentUser) return;

                try {
                    const data = await verifyTokenService();
                    if (data.code !== 1040) {
                        get().logout();
                    }
                } catch (error) {
                    console.error("Error in periodic session verification:", error);
                    get().logout();
                }
            },

            clearError: () => {
                set({ error: null });
            },

            logout: async () => {
                set({ user: null, isLoading: false, authState: "invalid" });
                try {
                    const responseCode = await logoutService();
                    console.log("Logout service response:", responseCode);
                    set({ authState: "invalid", isAuthenticated: false, isLoggedIn: false });
                } catch (error) {
                    console.error("Logout failed:", error);
                } finally {
                    useAuthStore.persist.clearStorage();
                    sessionStorage.clear();
                    localStorage.clear();
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
            }),
        }
    )
);