import { ApiResponse } from "../types/apiResponse";
import { Session } from "../types/session";
import { apiClient } from "./authService";

export const createSession = async (
  studentName: string,
  studentClass: string,
  profession: string,
  schoolId: string,
  studentImageId: string,
  studentPhoto?: string | null
): Promise<ApiResponse<Session>> => {
  try {
    const response = await apiClient.post('/sessions', {
      studentName,
      studentClass,
      profession,
      schoolId,
      studentImageId,
      studentPhoto
    });
    return response.data;
  } catch (error: any) {
    return {
      result: null,
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to create session'
    };
  }
};

export const stopSession = async (sessionId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.post(`/sessions/${sessionId}/stop`);
    return response.data;
  } catch (error: any) {
    return {
      result: null,  // ✅ Add this
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to stop session'
    };
  }
};

export const getSessionStatus = async (
  sessionId: string
): Promise<ApiResponse<{ status: Session['status'] }>> => {
  try {
    const response = await apiClient.get(`/sessions/${sessionId}/status`);
    return response.data;
  } catch (error: any) {
    return {
      result: null,  // ✅ Add this
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to get session status'
    };
  }
};

export const getSessionOutputs = async (
  sessionId: string
): Promise<ApiResponse<{ futureImageUrl?: string; finalVideoUrl?: string }>> => {
  try {
    const response = await apiClient.get(`/sessions/${sessionId}/outputs`);
    return response.data;
  } catch (error: any) {
    return {
      result: null,  // ✅ Add this
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to get session outputs'
    };
  }
};
