import { ApiResponse } from "../types/apiResponse";
import { Job, JobCreateRequest, JobStatusResponse } from "../types/job";
import { apiClient } from "./authService";

export const createJob = async (
  sessionId: string,
  imageUrl: string,
  profession: string
): Promise<ApiResponse<Job>> => {
  try {
    const payload: JobCreateRequest = {
      sessionId,
      imageUrl,
      profession
    };

    const response = await apiClient.post('/jobs', payload);
    return response.data;
  } catch (error: any) {
    return {
      result: null,
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to create job'
    };
  }
};

export const getJobStatus = async (
  jobId: string
): Promise<ApiResponse<JobStatusResponse>> => {
  try {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error: any) {
    return {
      result: null,
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to get job status'
    };
  }
};
