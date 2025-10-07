import type { ReactNode } from "react";
import { User } from "./auth";

export interface LoginTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  buttonStyle?: React.CSSProperties;
}

export interface LoginProps {
  backendUrl?: string;
  onSuccess?: (user: User) => void;
  googleLogintheme?: LoginTheme;
  customLayout?: ReactNode;
  className?: string;
  children?: ReactNode; 
}

export interface Session {
  id: string;
  studentName: string;
  studentClass: string;
  studentPhoto?: string | null;
  profession: string;
  status: 'idle' | 'capturing' | 'uploading' | 'queued' | 'processing' | 'ready' | 'published';
  createdAt: Date;
  futureImageUrl?: string;
  finalVideoUrl?: string;
  studentImageId?: string;
  futureImageId?: string;
  schoolId: string;
}

export interface CaptureState {
  isRecording: boolean;
  hasPhoto: boolean;
  recordingDuration: number;
}

export interface UploadProgress {
  percentage: number;
  isUploading: boolean;
}

export interface TVState {
  latestFutureImageUrl?: string;
  studentName?: string;
  studentClass?: string;
  profession?: string;
  status: 'idle' | 'playing' | 'waiting';
}

