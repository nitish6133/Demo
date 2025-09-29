export type SessionStatus =
  | "idle"
  | "capturing"
  | "uploading"
  | "queued"
  | "processing"
  | "ready"
  | "published";

export interface SessionBase {
  studentName: string;
  studentClass: string;
  profession: string;
  schoolId: string;
  studentImageId: string;
}

export interface SessionCreate extends SessionBase {}

export interface Session extends SessionBase {
  id: string;            // always included for UI
  createdAt: string;     // ISO date string
  status: SessionStatus;
  futureImageId?: string;
  videoId?: string;
  outputs?: Record<string, any>;
  instagramUrl?: string;
}

export interface SessionUpdate {
  status?: SessionStatus;
  futureImageId?: string;
  videoId?: string;
  outputs?: Record<string, any>;
  instagramUrl?: string;
}

// Extra UI models

export interface CaptureState {
  isRecording: boolean;
  hasPhoto: boolean;
  recordingDuration: number; // seconds
}

export interface UploadProgress {
  percentage: number; // 0-100
  isUploading: boolean;
}
