import { create } from 'zustand';
import { brandingApi } from '../api/branding';

export interface BrandingSettings {
  schoolName: string;
  logoUrl?: string;
  tagline: string;
  address: string;
  hashtags: string[];
}

interface BrandingStore {
  settings: BrandingSettings;
  isLoading: boolean;
  error: string | null;

  // API actions
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;

  // Local actions
  updateSettings: (settings: Partial<BrandingSettings>) => void;
  addHashtag: (hashtag: string) => void;
  removeHashtag: (index: number) => void;
  clearError: () => void;
}

export const useBrandingStore = create<BrandingStore>((set, get) => ({
  settings: {
    schoolName: 'Future Frame Academy',
    logoUrl: undefined,
    tagline: 'Inspiring Tomorrow\'s Leaders',
    address: '123 Education Street, Learning City, LC 12345',
    hashtags: ['#FutureFrame', '#FutureLeaders', '#Education', '#yensisolutions'],
  },
  isLoading: false,
  error: null,

  loadSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      const settings = await brandingApi.getBrandingSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load settings',
        isLoading: false
      });
    }
  },

  saveSettings: async () => {
    try {
      set({ isLoading: true, error: null });
      const { settings } = get();
      const updatedSettings = await brandingApi.updateBrandingSettings(settings);
      set({ settings: updatedSettings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save settings',
        isLoading: false
      });
    }
  },

  uploadLogo: async (file: File) => {
    try {
      set({ isLoading: true, error: null });
      const { logoUrl } = await brandingApi.uploadLogo(file);
      const { settings } = get();
      const updatedSettings = { ...settings, logoUrl };

      // Save the updated settings with new logo
      const savedSettings = await brandingApi.updateBrandingSettings(updatedSettings);
      set({ settings: savedSettings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upload logo',
        isLoading: false
      });
    }
  },

  updateSettings: (newSettings: Partial<BrandingSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  addHashtag: (hashtag: string) => {
    const cleanHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    set((state) => ({
      settings: {
        ...state.settings,
        hashtags: [...state.settings.hashtags, cleanHashtag]
      }
    }));
  },

  removeHashtag: (index: number) => {
    const { settings } = get();
    const hashtagToRemove = settings.hashtags[index];

    // Prevent removal of #yensisolutions
    if (hashtagToRemove === '#yensisolutions') {
      return;
    }

    set((state) => ({
      settings: {
        ...state.settings,
        hashtags: state.settings.hashtags.filter((_, i) => i !== index)
      }
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));