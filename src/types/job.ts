export type JobStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface JobCreateRequest {
  sessionId: string;
  imageUrl: string;
  profession: string;
}

export interface JobOutputs {
  futureImageUrl: string;
}

export interface Job {
  id: string;
  sessionId: string;
  imageUrl: string;
  profession: string;
  status: JobStatus;
  isDeleted: boolean;
  outputs: JobOutputs;
  executionId: string;
}

export interface JobStatusResponse {
  sessionId: string;
  imageUrl: string;
  profession: string;
  status: JobStatus;
  isDeleted: boolean;
  outputs: JobOutputs;
  executionId: string;
  id: string;
}
