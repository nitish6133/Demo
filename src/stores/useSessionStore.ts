import { create } from 'zustand';
import { createSession, getSessionStatus, getSessionOutputs, startFinalVideo, getAllSessions } from '../services/sessionService';
import { Session, CaptureState, UploadProgress } from '../types';
import { useBrandingStore } from './useBrandingStore';
import { serviceBaseUrl } from '../constants/appConstants';
import {stopSession} from '../services/sessionService';

interface SessionStore {
  currentSession: Session | null;
  captureState: CaptureState;
  uploadProgress: UploadProgress;
  studentImageId?: string;
  pendingSessionData: {
    studentName: string;
    studentClass: string;
    studentImageId: string;
  } | null;

  // For generated content page
  allSessions: Session[];
  latestSession: Session | null;
  isLoadingSessions: boolean;
  sessionsError: string | null;

  startSession: (
    studentName: string,
    studentClass: string,
    profession: string,
    studentImageId: string,
    studentPhoto?: string | null
  ) => Promise<void>;
  stopSession: () => Promise<void>;

  setPendingSessionData: (studentName: string, studentClass: string, studentImageId: string) => void;
  setStudentImage: (imageId: string) => void;

  takePhoto: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  setProfession: (profession: string) => void;
  setStatus: (status: Session['status']) => void;
  setUploadProgress: (progress: number) => void;
  setOutputs: (futureImageUrl?: string, finalVideoUrl?: string) => void;
  resetSession: () => void;
  pollSessionStatus: (sessionId: string) => Promise<void>;

  // New methods for generated content
  loadAllSessions: (schoolId: string) => Promise<void>;
}

// Private variables for recording
let recordingInterval: ReturnType<typeof setInterval> | null = null;
let recordingStartTime: number = 0;
let elapsedTimeBeforePause: number = 0;


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
  pendingSessionData: null,

  // For generated content page
  allSessions: [],
  latestSession: null,
  isLoadingSessions: false,
  sessionsError: null,

  startSession: async (studentName, studentClass, profession, studentImageId) => {
    try {
      const schoolId = useBrandingStore.getState().settings?.id;
      if (!schoolId) {
        console.error('School ID is missing from branding settings');
        return;
      }

      const response = await createSession(studentName, studentClass, profession, schoolId, studentImageId);

      if ((response.code === 200 || response.code === 3034) && response.result) {
        const session = response.result;
        set({ currentSession: { ...session, videoId: session.videoId ?? '', createdAt: new Date(session.createdAt).toISOString() } });
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
      set({ currentSession: { ...currentSession, status: 'uploading' }, uploadProgress: { percentage: 0, isUploading: true } });

      const uploadInterval = setInterval(() => {
        const { uploadProgress } = get();
        if (uploadProgress.percentage < 90) {
          set({ uploadProgress: { ...uploadProgress, percentage: uploadProgress.percentage + 10 } });
        }
      }, 200);

      const response = await stopSession(currentSession.id);

      clearInterval(uploadInterval);

      if (response.code === 200) {
        set({ uploadProgress: { percentage: 100, isUploading: false }, currentSession: { ...get().currentSession!, status: 'queued' } });

        const branding = useBrandingStore.getState().settings;
        if (!branding) {
          console.error('Branding settings not found');
          return;
        }

        const futureImageUrl = `${serviceBaseUrl}/images/${currentSession.futureImageId || currentSession.studentImageId}`;
        const teacherVideoUrl = `${serviceBaseUrl}/videos/${currentSession.id}/teacher`;

        const finalVideoResponse = await startFinalVideo(
          currentSession.id,
          currentSession.schoolId,
          teacherVideoUrl,
          futureImageUrl,
          branding.branding.logoUrl || '',
          branding.branding.tagline || ''
        );

        if (finalVideoResponse.code === 3078 || finalVideoResponse.code === 200) {
          console.log('Final video generation started successfully');
        } else {
          console.error('Failed to start final video generation:', finalVideoResponse.message);
        }

        get().pollSessionStatus(currentSession.id);
      } else {
        console.error('Failed to stop session:', response.message);
        set({ uploadProgress: { percentage: 0, isUploading: false } });
      }
    } catch (error) {
      console.error('Error stopping session:', error);
      set({ uploadProgress: { percentage: 0, isUploading: false } });
    }
  },

  pollSessionStatus: async (sessionId) => {
    try {
      const response = await getSessionStatus(sessionId);
      if (response.code === 200 && response.result) {
        const { currentSession } = get();
        if (!currentSession) return;

        set({ currentSession: { ...currentSession, status: response.result.status } });

        if (response.result.status === 'ready') {
          const outputs = await getSessionOutputs(sessionId);
          if (outputs.code === 200 && outputs.result) {
            set({
              currentSession: {
                ...get().currentSession!,
                futureImageId: outputs.result.futureImageUrl,
                finalVideoUrl: outputs.result.finalVideoUrl,
              },
            });
          }
        } else if (['processing', 'queued'].includes(response.result.status)) {
          setTimeout(() => get().pollSessionStatus(sessionId), 3000);
        }
      }
    } catch (error) {
      console.error('Error polling session status:', error);
    }
  },

  setPendingSessionData: (studentName, studentClass, studentImageId) => {
    set({ pendingSessionData: { studentName, studentClass, studentImageId } });
  },

  setStudentImage: (imageId) => {
    const { currentSession } = get();
    if (currentSession) {
      set({ currentSession: { ...currentSession, studentImageId: imageId } });
    }
  },

  takePhoto: () => {
    set({ captureState: { ...get().captureState, hasPhoto: true } });
  },

  startRecording: () => {
    recordingStartTime = Date.now();
    elapsedTimeBeforePause = 0;
    set({ captureState: { ...get().captureState, isRecording: true, recordingDuration: 0 } });

    recordingInterval = setInterval(() => {
      const { captureState } = get();
      if (captureState.isRecording) {
        const currentElapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        set({ captureState: { ...captureState, recordingDuration: elapsedTimeBeforePause + currentElapsed } });
      }
    }, 1000);
  },

  pauseRecording: () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }
    const currentElapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    elapsedTimeBeforePause += currentElapsed;
    set({ captureState: { ...get().captureState, isRecording: false } });
  },


  stopRecording: () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }

    const currentElapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    elapsedTimeBeforePause += currentElapsed;

    set({
      captureState: {
        ...get().captureState,
        isRecording: false,
        recordingDuration: elapsedTimeBeforePause,
      },
    });
  },




  setProfession: (profession) => {
    const { currentSession } = get();
    if (currentSession) set({ currentSession: { ...currentSession, profession } });
  },

  setStatus: (status) => {
    const { currentSession } = get();
    if (currentSession) set({ currentSession: { ...currentSession, status } });
  },

  setUploadProgress: (percentage) => set({ uploadProgress: { ...get().uploadProgress, percentage } }),

  setOutputs: (futureImageId, finalVideoUrl) => {
    const { currentSession } = get();
    if (currentSession) set({ currentSession: { ...currentSession, futureImageId, finalVideoUrl } });
  },

  resetSession: () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
      recordingInterval = null;
    }
    recordingStartTime = 0;
    elapsedTimeBeforePause = 0;
    set({
      currentSession: null,
      captureState: { isRecording: false, hasPhoto: false, recordingDuration: 0 },
      uploadProgress: { percentage: 0, isUploading: false },
      pendingSessionData: null,
    });
  },

 loadAllSessions: async (schoolId: string) => {
  try {
    set({ isLoadingSessions: true, sessionsError: null });

    const response = await getAllSessions(schoolId);
    console.log("response", response);

    if (!response || !response.result) {
      set({
        sessionsError: response?.message || "No session data received",
        isLoadingSessions: false,
      });
      return;
    }

    let sessions: Session[] = [];

    // ✅ Case 1: API returns array of sessions
    if (Array.isArray(response.result)) {
      sessions = response.result;
    }

    // ✅ Case 2: API returns { latest: {...} }
    else if (
      typeof response.result === "object" &&
      response.result !== null &&
      "latest" in response.result
    ) {
      sessions = [(response.result as { latest: Session }).latest];
    }

    // ✅ Case 3: Single session object directly
    else if (
      typeof response.result === "object" &&
      response.result !== null &&
      "id" in response.result
    ) {
      sessions = [response.result];
    }

    // ✅ Normalize session data
    const formattedSessions: Session[] = sessions.map((session: any) => ({
      id: session.id,
      studentName: session.studentName,
      studentClass: session.studentClass,
      profession: session.profession,
      schoolId: session.schoolId,
      studentImageId: session.studentImageId,
      futureImageId: session.futureImageId,
      videoId: session.videoId,
      outputs: session.outputs || {},
      instagramUrl: session.instagramUrl,
      status: session.status as Session['status'],
      createdAt: (() => {
        if (typeof session.createdAt === "string") {
          const dateStr = session.createdAt.substring(0, 14);
          const formatted = dateStr.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            "$1-$2-$3T$4:$5:$6"
          );
          return new Date(formatted).toISOString();
        }
        return new Date(session.createdAt).toISOString();
      })(),
    }));

    // ✅ Update store
    set({
      allSessions: formattedSessions,
      latestSession: formattedSessions[0] || null,
      isLoadingSessions: false,
    });
  } catch (error) {
    console.error("Error loading sessions:", error);
    set({
      sessionsError:
        error instanceof Error ? error.message : "Failed to load sessions",
      isLoadingSessions: false,
    });
  }
},



}));
