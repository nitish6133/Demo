import { create } from 'zustand';
import { adminService } from '../services/adminService';
import type { SubscribedUser, AllUser, NotificationResponse, EmailRequest, AdminTabType } from '../types/admin';
import { areSubscribedUsersEqual, areAllUsersEqual } from '../utils/userUtils';

interface AdminState {
    // State
    subscribedUsers: SubscribedUser[];
    allUsers: AllUser[];
    isLoading: boolean;
    error: string | null;
    activeTab: AdminTabType;

    // Actions
    setActiveTab: (tab: AdminTabType) => void;
    fetchAllUsers: () => Promise<void>;
    fetchSubscribedUsers: () => Promise<SubscribedUser[]>;
    sendNotificationToAll: (message: string) => Promise<NotificationResponse>;
    sendNotificationToUser: (recipientId: string, message: string) => Promise<NotificationResponse>;
    sendEmailToUser: (emailData: EmailRequest) => Promise<NotificationResponse>;
    clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    // Initial state
    subscribedUsers: [],
    allUsers: [],
    isLoading: false,
    error: null,
    activeTab: (typeof window !== 'undefined' && localStorage.getItem('adminActiveTab') as AdminTabType) || 'pushNotification',

    setActiveTab: (tab: AdminTabType) => {
        set({ activeTab: tab });
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminActiveTab', tab);
        }
    },

    fetchAllUsers: async () => {
        try {
            const newUsers = await adminService.getAllUsers();
            const currentUsers = get().allUsers;

            if (!areAllUsersEqual(currentUsers, newUsers)) {
                set({ allUsers: newUsers });
            }
        } catch (error) {
            const errorMessage = (error as Error).message || 'Failed to fetch all users';
            set({ error: errorMessage });
        }
    },

    fetchSubscribedUsers: async () => {
        try {
            const newUsers = await adminService.getSubscribedUsers();
            const currentUsers = get().subscribedUsers;
            if (!areSubscribedUsersEqual(currentUsers, newUsers)) {
                set({ subscribedUsers: newUsers });
            }
            return newUsers;
        } catch (error) {
            const errorMessage = (error as Error).message || 'Failed to fetch subscribed users';
            set({ error: errorMessage });
            return [];
        }
    },

    sendNotificationToAll: async (message: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await adminService.sendNotificationToAll(message);
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMessage = (error as Error).message || 'Failed to send notification';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    sendNotificationToUser: async (recipientId: string, message: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await adminService.sendNotificationToUser(recipientId, message);
            set({ isLoading: false });
            return response;
        } catch (error) {
            const errorMessage = (error as Error).message || 'Failed to send notification';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    sendEmailToUser: async (emailData: EmailRequest): Promise<NotificationResponse> => {
        set({ isLoading: true, error: null })
        try {
            const response = await adminService.sendEmail(emailData);
            if (response.code === 1051) {
                set({ isLoading: false });
            } else {
                const errorMessage = response.message || "Failed to send email";
                set({ error: errorMessage, isLoading: false });
            }
            return response;
        } catch (error) {
            const errorMessage = (error as Error).message || "Failed to send email";
            set({ error: errorMessage, isLoading: false });
            return { code: 1052, message: errorMessage };
        }
    },

    clearError: () => set({ error: null })
}));