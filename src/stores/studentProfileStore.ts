import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Profile, Role } from '../types';
import { apiService } from '../services/studentImageService';

interface StudentProfileState {
  // Form data
  childName: string;
  schoolName: string;
  futureRole: Role | null;

  // Image states
  childImageFile: File | null;
  childImagePreview: string | null;
  childImageId: string | null;
  generatedImageId: any;

  // Profiles
  profiles: Profile[];
  currentProfile: Profile | null;

  // UI states
  loading: boolean;
  error: string | null;

  // Actions
  setChildName: (name: string) => void;
  setFutureRole: (role: Role) => void;
  setSchoolName: (name: string) => void;
  setChildImage: (file: File | null) => void;
  clearForm: () => void;

  // API actions
  uploadFile: () => Promise<void>;
  generateFutureRoleImage: () => Promise<void>;
  saveProfile: () => Promise<void>;
  fetchProfiles: () => Promise<void>;
  deleteProfile: (studentId: string) => Promise<void>;
  deleteAllProfiles: (schoolId: string) => Promise<void>;

  // Utility actions
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useStudentProfileStore = create<StudentProfileState>()(
  devtools(
    (set, get) => ({
      // Initial state
      childName: '',
      schoolName: '',
      futureRole: null,
      childImageFile: null,
      childImagePreview: null,
      childImageId: null,
      generatedImageId: null,
      profiles: [],
      currentProfile: null,
      loading: false,
      error: null,

      // Actions
      setChildName: (name) => set({ childName: name }),

      setSchoolName: (name) => set({ schoolName: name }),

      setFutureRole: (role) => {
        set({ futureRole: role });
        // Clear generated image when role changes
        set({ generatedImageId: null });
      },

      setChildImage: (file: File | null) => {
        const { childImagePreview } = get();
        if (childImagePreview) {
          URL.revokeObjectURL(childImagePreview);
        }

        set({
          childImageFile: file,
          childImagePreview: file ? URL.createObjectURL(file) : null,
          childImageId: null,
          generatedImageId: null,
        });
      },

      clearForm: () => {
        const { childImagePreview } = get();
        if (childImagePreview) {
          URL.revokeObjectURL(childImagePreview);
        }
        set({
          childName: '',
          schoolName: '',
          futureRole: null,
          childImageFile: null,
          childImagePreview: null,
          childImageId: null,
          generatedImageId: null,
          error: null
        });
      },

      // API actions
      uploadFile: async () => {
        const { childImageFile } = get();
        if (!childImageFile) {
          set({ error: 'No image file selected' });
          return;
        }

        set({ loading: true, error: null });

        try {
          const childImageId = await apiService.uploadFile(childImageFile);
          set({ childImageId });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to upload image' });
        } finally {
          set({ loading: false });
        }
      },

      generateFutureRoleImage: async () => {
        const { childImageId, childName, futureRole } = get();

        if (!childImageId || !childName || !futureRole) {
          set({ error: 'Missing required information for image generation' });
          return;
        }

        set({ loading: true, error: null });

        try {
          const generatedImageId = await apiService.generateFutureRoleImage({
            childImageId,
            childName,
            futureRole
          });
          set({ generatedImageId });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to generate image' });
        } finally {
          set({ loading: false });
        }
      },

      saveProfile: async () => {
        const { generatedImageId } = get();

        const profileId =
          typeof generatedImageId === "object" && generatedImageId !== null
            ? (generatedImageId as { id: string }).id || (generatedImageId as any).generatedImageId
            : generatedImageId;

        if (!profileId) {
          set({ error: "Missing profileId for saving profile" });
          return;
        }

        set({ loading: true, error: null });

        try {
          const profile = await apiService.saveProfile(profileId);

          set((state) => ({
            profiles: [profile, ...state.profiles],
            currentProfile: profile,
            // ✅ mark generatedImageId as saved instead of nulling it
            generatedImageId: {
              ...(typeof generatedImageId === "object"
                ? generatedImageId
                : { generatedImageId }),
              saved: true,
            },
          }));

          get().fetchProfiles();
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to save profile",
          });
        } finally {
          set({ loading: false });
        }
      },




      fetchProfiles: async () => {
        set({ loading: true, error: null });

        try {
          const profiles = await apiService.fetchProfiles();
          set({ profiles });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch profiles' });
        } finally {
          set({ loading: false });
        }
      },

      deleteProfile: async (studentId: string) => {
        set({ loading: true, error: null });
        try {
          await apiService.deleteProfile(studentId);
          // Update local state (remove deleted profile)
          set((state) => ({
            profiles: state.profiles.filter((p) => p.id !== studentId),
          }));
        } catch (err: any) {
          set({ error: err.message || 'Failed to delete profile' });
        } finally {
          set({ loading: false });
        }
      },

      deleteAllProfiles: async (schoolId: string) => {
        set({ loading: true, error: null });
        try {
          await apiService.deleteAllProfiles(schoolId);
          // Clear all profiles from state
          set({ profiles: [] });
        } catch (err: any) {
          set({ error: err.message || 'Failed to delete all profiles' });
        } finally {
          set({ loading: false });
        }
      },

      // Utility actions
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
    }),
    { name: 'student-profile-store' }
  )
);