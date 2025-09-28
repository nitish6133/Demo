import { create } from 'zustand';
import { Session, CaptureState, UploadProgress } from '../types';

interface SessionStore {
  currentSession: Session | null;
  captureState: CaptureState;
  uploadProgress: UploadProgress;

  // Actions
  startSession: (studentName: string, studentClass: string, studentPhoto?: string | null) => void;
  stopSession: () => void;
  takePhoto: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setProfession: (profession: string) => void;
  setStatus: (status: Session['status']) => void;
  setUploadProgress: (progress: number) => void;
  setOutputs: (futureImageUrl?: string, finalVideoUrl?: string) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  captureState: {
    isRecording: false,
    hasPhoto: false,
    recordingDuration: 0,
  },
  uploadProgress: {
    percentage: 0,
    isUploading: false,
  },

  startSession: (studentName: string, studentClass: string, studentPhoto?: string | null) => {
    const session: Session = {
      id: `session-${Date.now()}`,
      studentName,
      studentClass,
      studentPhoto,
      profession: '', // Will be set during recording
      status: 'idle',
      createdAt: new Date(),
    };
    set({ currentSession: session });
  },

  stopSession: () => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: { ...currentSession, status: 'uploading' },
        uploadProgress: { percentage: 0, isUploading: true }
      });

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          set({
            uploadProgress: { percentage: 100, isUploading: false },
            currentSession: { ...get().currentSession!, status: 'queued' }
          });

          // Simulate processing
          setTimeout(() => {
            set({
              currentSession: { ...get().currentSession!, status: 'processing' }
            });
          }, 1000);

          // Simulate completion
          setTimeout(() => {
            set({
              currentSession: {
                ...get().currentSession!,
                status: 'ready',
                futureImageUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
                finalVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
              }
            });
          }, 3000);
        } else {
          set({ uploadProgress: { percentage: progress, isUploading: true } });
        }
      }, 200);
    }
  },

  takePhoto: () => {
    set({
      captureState: { ...get().captureState, hasPhoto: true }
    });
  },

  startRecording: () => {
    set({
      captureState: { ...get().captureState, isRecording: true, recordingDuration: 0 }
    });

    // Simulate recording timer
    const startTime = Date.now();
    const interval = setInterval(() => {
      const { captureState } = get();
      if (captureState.isRecording) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        set({
          captureState: { ...captureState, recordingDuration: elapsed }
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    // Store interval ID for cleanup
    (get() as any).recordingInterval = interval;
  },

  stopRecording: () => {
    // Clear the recording interval
    const interval = (get() as any).recordingInterval;
    if (interval) {
      clearInterval(interval);
    }

    set({
      captureState: { ...get().captureState, isRecording: false }
    });
  },

  setProfession: (profession: string) => {
    const { currentSession } = get();
    if (currentSession) {
      set({ currentSession: { ...currentSession, profession } });
    }
  },

  setStatus: (status: Session['status']) => {
    const { currentSession } = get();
    if (currentSession) {
      set({ currentSession: { ...currentSession, status } });
    }
  },

  setUploadProgress: (percentage: number) => {
    set({
      uploadProgress: { ...get().uploadProgress, percentage }
    });
  },

  setOutputs: (futureImageUrl?: string, finalVideoUrl?: string) => {
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: { ...currentSession, futureImageUrl, finalVideoUrl }
      });
    }
  },

  resetSession: () => {
    set({
      currentSession: null,
      captureState: {
        isRecording: false,
        hasPhoto: false,
        recordingDuration: 0,
      },
      uploadProgress: {
        percentage: 0,
        isUploading: false,
      }
    });
  },
}));