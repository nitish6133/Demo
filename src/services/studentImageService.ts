import axios from 'axios';
import { ApiResponse, GenerateImageRequest, Profile } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Request logging
api.interceptors.request.use((config) => {
  return config;
});

// Response logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<string>>('/upload-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.result;
  },

  async generateFutureRoleImage(request: GenerateImageRequest): Promise<string> {
    const response = await api.post<ApiResponse<string>>(
      '/generateFutureProfessionImage',
      null, // no body
      {
        params: {
          childImageId: request.childImageId,
          childName: request.childName,
          futureRole: request.futureRole,
        },
      }
    );

    return response.data.result;
  },


  async saveProfile(profileId: string): Promise<Profile> {
    const response = await api.post<ApiResponse<Profile>>(
      `/saveStudentProfile?profileId=${profileId}`
    );
    return response.data.result;
  },

  async fetchProfiles(): Promise<Profile[]> {
    const response = await api.get<ApiResponse<Profile[]>>('/studentsProfile');
    return response.data.result;
  },

    async deleteProfile(studentId: string): Promise<void> {
    await api.delete(`/studentProfile/delete`, {
      params: { studentId },
    });
  },

  async deleteAllProfiles(schoolId: string): Promise<void> {
    await api.delete(`/studentProfile/deleteAll`, {
      params: { schoolId },
    })
  },

  getGeneratedImageUrl(imageId: string | number): string {
    // Handle both string and object cases
    const id = typeof imageId === 'string' ? imageId : imageId?.toString() || '';
    return `/api/static/generated/${id}`;
  },
   getImageUrl(imageId: string | number): string {
    // Handle both string and object cases
    const id = typeof imageId === 'string' ? imageId : imageId?.toString() || '';
    return `/api/static/images/${id}`;
  },
};
