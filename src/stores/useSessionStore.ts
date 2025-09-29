import { create } from 'zustand';
import { createSession, stopSession, getSessionStatus, getSessionOutputs } from '../services/sessionService';
import { Session, CaptureState, UploadProgress } from '../types';


interface SessionStore {
  currentSession: Session | null;
  captureState: CaptureState;
  uploadProgress: UploadProgress;

  startSession: (
    studentName: string,
    studentClass: string,
    profession: string,
    schoolId: string,
    studentImageId: string,
    studentPhoto?: string | null
  ) => Promise<void>;
  stopSession: () => Promise<void>;
  takePhoto: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setProfession: (profession: string) => void;
  setStatus: (status: Session['status']) => void;
  setUploadProgress: (progress: number) => void;
  setOutputs: (futureImageUrl?: string, finalVideoUrl?: string) => void;
  resetSession: () => void;
  pollSessionStatus: (sessionId: string) => Promise<void>;
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

  startSession: async (
    studentName: string,
    studentClass: string,
    profession: string,
    schoolId: string,
    studentImageId: string,
    studentPhoto?: string | null
  ) => {
    try {
      const response = await createSession(studentName, studentClass, profession, schoolId, studentImageId, studentPhoto);
      if (response.code === 200 && response.result) {
        const session = response.result;
        set({
          currentSession: {
            ...session,
            createdAt: new Date(session.createdAt), // Ensure createdAt is a Date object
          }
        });
      } else {
        console.error('Failed to create session:', response.message);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  },


  stopSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    try {
      set({
        currentSession: { ...currentSession, status: 'uploading' },
        uploadProgress: { percentage: 0, isUploading: true }
      });

      const response = await stopSession(currentSession.id);

      if (response.code === 200) {
        set({
          uploadProgress: { percentage: 100, isUploading: false },
          currentSession: { ...get().currentSession!, status: 'queued' }
        });

        // Start polling for status updates
        get().pollSessionStatus(currentSession.id);
      } else {
        console.error('Failed to stop session:', response.message);
      }
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  },

  pollSessionStatus: async (sessionId: string) => {
    try {
      const response = await getSessionStatus(sessionId);

      if (response.code === 200 && response.result) {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: { ...currentSession, status: response.result.status }
          });

          // If processing is complete, get outputs
          if (response.result.status === 'ready') {
            const outputsResponse = await getSessionOutputs(sessionId);
            if (outputsResponse.code === 200 && outputsResponse.result) {
              set({
                currentSession: {
                  ...get().currentSession!,
                  futureImageUrl: outputsResponse.result.futureImageUrl,
                  finalVideoUrl: outputsResponse.result.finalVideoUrl
                }
              });
            }
          } else if (response.result.status === 'processing' || response.result.status === 'queued') {
            // Continue polling
            setTimeout(() => get().pollSessionStatus(sessionId), 3000);
          }
        }
      }
    } catch (error) {
      console.error('Error polling session status:', error);
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

    (get() as any).recordingInterval = interval;
  },

  stopRecording: () => {
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
