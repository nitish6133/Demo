import axios from 'axios';
import { MatchSettings } from '../types';
import { USE_DUMMY_DATA, API_CONFIG } from '../config/appConfig';

const { baseUrl } = API_CONFIG;

const defaultSettings: MatchSettings = {
  playersPerTeam: 11,
  noBallReball: true,
  noBallRun: 1,
  wideBallReball: true,
  wideBallRun: 1,
};

export const getMatchSettings = async (): Promise<MatchSettings> => {
  if (USE_DUMMY_DATA) {
    const storedSettings = localStorage.getItem('matchSettings');
    return Promise.resolve(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
  }
  
  try {
    const response = await axios.get(`${baseUrl}/settings`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    const storedSettings = localStorage.getItem('matchSettings');
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  }
};

export const saveMatchSettings = async (settings: MatchSettings): Promise<void> => {
  if (USE_DUMMY_DATA) {
    localStorage.setItem('matchSettings', JSON.stringify(settings));
    return Promise.resolve();
  }
  
  try {
    await axios.post(`${baseUrl}/settings`, settings);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    localStorage.setItem('matchSettings', JSON.stringify(settings));
  }
};