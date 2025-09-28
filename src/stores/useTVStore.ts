import { create } from 'zustand';
import { TVState } from '../types';

interface TVStore extends TVState {
  pollLatest: () => void;
  setLatest: (futureImageUrl?: string, studentName?: string, studentClass?: string, profession?: string) => void;
  setStatus: (status: TVState['status']) => void;
}

export const useTVStore = create<TVStore>((set, get) => ({
  latestFutureImageUrl: undefined,
  studentName: undefined,
  studentClass: undefined,
  profession: undefined,
  status: 'waiting',

  pollLatest: () => {
    // Simulate polling for latest content
    const mockContent = {
      futureImageUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
      studentName: 'Alex Johnson',
      studentClass: '5th Grade',
      profession: 'Astronaut'
    };

    setTimeout(() => {
      set({
        latestFutureImageUrl: mockContent.futureImageUrl,
        studentName: mockContent.studentName,
        studentClass: mockContent.studentClass,
        profession: mockContent.profession,
        status: 'playing'
      });
    }, 2000);
  },

  setLatest: (futureImageUrl?: string, studentName?: string, studentClass?: string, profession?: string) => {
    set({
      latestFutureImageUrl: futureImageUrl,
      studentName,
      studentClass,
      profession,
      status: studentName ? 'playing' : 'waiting'
    });
  },

  setStatus: (status: TVState['status']) => {
    set({ status });
  },
}));