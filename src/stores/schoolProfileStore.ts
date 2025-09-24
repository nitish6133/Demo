import { create } from "zustand";
import { schoolProfileService } from "../services/schoolProfileService";
import type { SchoolProfile } from "../types/schoolProfile";

interface SchoolProfileState {
  profiles: SchoolProfile[];
  loading: boolean;
  error: string | null;
  createSchoolProfile: (profile: SchoolProfile) => Promise<void>;
  fetchAllSchoolProfiles: () => Promise<void>;
  fetchSchoolProfile: () => Promise<void>;
  updateProfile: (schoolId: string, profile: Partial<SchoolProfile>) => Promise<void>;
  deleteProfile: (schoolId: string) => Promise<void>;
}

export const useSchoolProfileStore = create<SchoolProfileState>((set) => ({
  profiles: [],
  loading: false,
  error: null,

  createSchoolProfile: async (profile) => {
    set({ loading: true, error: null });
    try {
      const res = await schoolProfileService.createSchoolProfile(profile);
      // After creating, the profiles will be refreshed by the component
      set({ profiles: [res.result as SchoolProfile] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllSchoolProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await schoolProfileService.getAllSchoolProfiles();
      set({ profiles: Array.isArray(res.result) ? res.result : res.result ? [res.result] : [] });
    } catch (err: any) {
      // If no profiles found, set empty array
      set({ profiles: [], error: null });
    } finally {
      set({ loading: false });
    }
  },

    fetchSchoolProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await schoolProfileService.getSchoolProfile();
      set({ profiles: Array.isArray(res.result) ? res.result : res.result ? [res.result] : [] });
    } catch (err: any) {
      // If no profiles found, set empty array
      set({ profiles: [], error: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (schoolId, profile) => {
    set({ loading: true, error: null });
    try {
      await schoolProfileService.updateSchoolProfile(schoolId, profile);
      // Update the profile in the state
      set((state) => ({
        profiles: state.profiles.map((p) =>
          p.id === schoolId ? { ...p, ...profile } : p
        )
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteProfile: async (schoolId) => {
    set({ loading: true, error: null });
    try {
      await schoolProfileService.deleteSchoolProfile(schoolId);
      // Clear all profiles after delete (since we're managing single profile)
      set({ profiles: [] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  }
}));
