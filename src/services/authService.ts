import axios from "axios";

export const createAuthService = (baseUrl: string) => {
  const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  return {
    verifyTokenForLogin: async () => {
      const res = await api.post('/verifyToken', {});
      return res.data;
    },

    verifyToken: async () => {
      const res = await api.post('/verifyToken', {});
      return res.data;
    },

    logout: async () => {
      try {
        const response = await api.post('/logout');
        return response.data.code;
      } catch (error) {
        throw error;
      }
    },

    getProviderLoginUrl: (provider: string) => {
      return `${baseUrl}/auth/provider?provider=${provider}`;
    }
  };
};