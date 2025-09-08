//discountStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DiscountCode, CreateDiscountCodeRequest, UpdateDiscountCodeRequest } from '../types/discount';
import { discountService, adminLogin } from '../services/discountService';
import { User } from '../types/auth';
import { useUserMetadataStore } from './userMetadataStore';
import { useAuthStore } from './useAuthStore';

interface DiscountStore {
    // State
    discountCodes: DiscountCode[];
    isLoading: boolean;
    error: string | null;
    authState: "notChecked" | "checking" | "valid" | "invalid";
    isAdminAuthenticated: boolean;
    // Actions
    adminLogin: (username: string, password: string) => Promise<boolean>;
    fetchDiscountCodes: () => Promise<void>;
    createDiscountCode: (discountCode: CreateDiscountCodeRequest) => Promise<boolean>;
    updateDiscountCode: (code: string, discountCode: UpdateDiscountCodeRequest) => Promise<boolean>;
    deleteDiscountCode: (code: string) => Promise<boolean>;
    validateDiscountCode: (code: string) => Promise<{ valid: boolean; discount?: DiscountCode; error?: string }>;
    clearError: () => void;
    logout: () => void;
}

export const useDiscountStore = create<DiscountStore>()(
    persist(
        (set, get) => ({
            // Initial state
            discountCodes: [],
            isLoading: false,
            error: null,
            authState: "notChecked",
            isAdminAuthenticated: false,

            // Admin login
            adminLogin: async (username: string, password: string) => {
                set({ isLoading: true, error: null, authState: "checking" });

                try {
                    const result = await adminLogin(username, password);

                    if (result.success) {
                             const authStore = useAuthStore.getState();
                        await authStore.verifyTokenAfterLogin();
                        set({
                            authState: "valid",
                            isLoading: false,
                            isAdminAuthenticated: true
                        });
                        return true;
                    } else {
                        set({
                            error: result.error || 'Login failed',
                            isLoading: false,
                            authState: "invalid",
                            isAdminAuthenticated: false
                        });
                        return false;
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message || 'Login failed',
                        isLoading: false,
                        authState: "invalid",
                        isAdminAuthenticated: false
                    });
                    return false;
                }
            },

            // Fetch all discount codes
            fetchDiscountCodes: async () => {
                if (get().authState !== 'valid') {
                    // Prevent API call if not authenticated
                    set({ isLoading: false, error: 'Not authenticated' });
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const result = await discountService.getAllDiscountCodes();

                    if (result.success && result.data) {
                        set({
                            discountCodes: result.data,
                            isLoading: false
                        });
                    } else {
                        set({
                            error: result.error || 'Failed to fetch discount codes',
                            isLoading: false
                        });
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message || 'Failed to fetch discount codes',
                        isLoading: false
                    });
                }
            },

            // Create new discount code
            createDiscountCode: async (discountCode: CreateDiscountCodeRequest) => {
                if (get().authState !== 'valid') return false;

                set({ isLoading: true, error: null });

                try {
                    const result = await discountService.createDiscountCode(discountCode);

                    if (result.success && result.data) {
                        const currentCodes = get().discountCodes || [];
                        set({
                            discountCodes: [...currentCodes, result.data],
                            isLoading: false
                        });
                        return true;
                    } else {
                        set({
                            error: result.error || 'Failed to create discount code',
                            isLoading: false
                        });
                        return false;
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message || 'Failed to create discount code',
                        isLoading: false
                    });
                    return false;
                }
            },

            // Update existing discount code
            updateDiscountCode: async (code: string, discountCode: UpdateDiscountCodeRequest) => {
                if (get().authState !== 'valid') return false;

                set({ isLoading: true, error: null });

                try {
                    const result = await discountService.updateDiscountCode(code, discountCode);

                    if (result.success) {
                        await get().fetchDiscountCodes(); // Re-fetch to get the latest state
                        set({ isLoading: false });
                        return true;
                    } else {
                        set({
                            error: result.error || 'Failed to update discount code',
                            isLoading: false
                        });
                        return false;
                    }
                } catch (error) {
                    console.error('Update discount code error:', error);
                    set({
                        error: (error as Error).message || 'Failed to update discount code',
                        isLoading: false
                    });
                    return false;
                }
            },

            deleteDiscountCode: async (code: string) => {
                if (get().authState !== 'valid') return false;

                set({ isLoading: true, error: null });

                try {
                    const result = await discountService.deleteDiscountCode(code);

                    if (result.success) {
                        const currentCodes = get().discountCodes;
                        const filteredCodes = currentCodes.filter(dc => dc.code !== code);
                        set({
                            discountCodes: filteredCodes,
                            isLoading: false
                        });
                        return true;
                    } else {
                        set({
                            error: result.error || 'Failed to delete discount code',
                            isLoading: false
                        });
                        return false;
                    }
                } catch (error) {
                    set({
                        error: (error as Error).message || 'Failed to delete discount code',
                        isLoading: false
                    });
                    return false;
                }
            },

            validateDiscountCode: async (code: string) => {
                try {
                    const { selectedCurrency } = useUserMetadataStore.getState();
                    const result = await discountService.validateDiscountCode(code, 0, selectedCurrency);
                    return result;
                } catch (error) {
                    return {
                        valid: false,
                        error: (error as Error).message || 'Failed to validate discount code'
                    };
                }
            },

            clearError: () => {
                set({ error: null });
            },

            logout: () => {
                set({
                    authState: "invalid",
                    discountCodes: [],
                    error: null,
                    isAdminAuthenticated: false
                });
            }
        }),
        {
            name: "discount-storage",
            partialize: (state) => ({
                authState: state.authState
            }),
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);