import axios from "axios";

// Create axios instance that will be configured with the backend URL
const createAuthService = (baseURL: string) => {
  return axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000
  });
};

export const verifyTokenForLoginService = async (backendUrl: string) => {
  const authService = createAuthService(backendUrl);
  const res = await authService.post('/verifyToken', {});
  return res.data;
};

export const verifyTokenService = async (backendUrl: string) => {
  const authService = createAuthService(backendUrl);
  const res = await authService.post('/verifyToken', {});
  return res.data;
};

export const logoutService = async (backendUrl: string): Promise<any> => {
  try {
    const authService = createAuthService(backendUrl);
    const response = await authService.post('/logout');
    return response.data.code;
  } catch (error) {
    throw error;
  }
};