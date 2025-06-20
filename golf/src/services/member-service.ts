import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants/appConstants';
import { USE_MOCK } from '@/config/config';
import { Member, CreateMemberRequest, UpdateMemberRequest, ApiResponse } from '../types/admin-member';
import { MemberMock } from '@/types';

// -------------------------------------------
// ✅ ADMIN MEMBER TYPE
// -------------------------------------------
export interface AdminMember extends MemberMock {
  phone: string;
  role: 'admin' | 'member' | 'scorer';
  status: 'active' | 'blocked';
  createdAt: Date;
  lastLogin?: Date;
}

// -------------------------------------------
// ✅ MOCK SERVICE
// -------------------------------------------
let mockMembers: AdminMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0101',
    role: 'member',
    status: 'active',
    joinDate: new Date('2023-01-15'),
    handicap: 12.5,
    isActive: true,
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0102',
    role: 'scorer',
    status: 'active',
    joinDate: new Date('2022-08-20'),
    handicap: 8.2,
    isActive: true,
    createdAt: new Date('2022-08-20'),
    lastLogin: new Date('2024-01-09')
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    phone: '+1-555-0103',
    role: 'member',
    status: 'blocked',
    joinDate: new Date('2023-03-10'),
    handicap: 15.7,
    isActive: false,
    createdAt: new Date('2023-03-10'),
    lastLogin: new Date('2023-12-15')
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1-555-0104',
    role: 'admin',
    status: 'active',
    joinDate: new Date('2022-11-05'),
    handicap: 6.4,
    isActive: true,
    createdAt: new Date('2022-11-05'),
    lastLogin: new Date('2024-01-11')
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+1-555-0105',
    role: 'member',
    status: 'active',
    joinDate: new Date('2023-06-12'),
    handicap: 18.3,
    isActive: true,
    createdAt: new Date('2023-06-12'),
    lastLogin: new Date('2024-01-08')
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockService = {
  getAll: async (): Promise<AdminMember[]> => {
    await delay(300);
    return [...mockMembers];
  },

  getById: async (id: string): Promise<AdminMember | null> => {
    await delay(200);
    return mockMembers.find(m => m.id === id) || null;
  },

  create: async (data: Omit<AdminMember, 'id' | 'createdAt' | 'isActive'>): Promise<AdminMember> => {
    await delay(500);
    const newMember: AdminMember = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: data.status === 'active',
    };
    mockMembers.push(newMember);
    return newMember;
  },

  update: async (id: string, updates: Partial<AdminMember>): Promise<AdminMember | null> => {
    await delay(400);
    const index = mockMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMembers[index] = {
        ...mockMembers[index],
        ...updates,
        isActive: updates.status ? updates.status === 'active' : mockMembers[index].isActive
      };
      return mockMembers[index];
    }
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      mockMembers.splice(index, 1);
      return true;
    }
    return false;
  },
    resetPassword: async (id: string, newPassword?: string): Promise<boolean> => {
    await delay(400);
    const member = mockMembers.find(m => m.id === id);
    if (member) {
      // In real app, this would hash and store the password
      console.log(`Password reset for ${member.email} to: ${newPassword || member.phone}`);
      return true;
    }
    return false;
  },

  // Toggle status
  toggleStatus: async (id: string): Promise<AdminMember | null> => {
    await delay(300);
    const index = mockMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      const newStatus = mockMembers[index].status === 'active' ? 'blocked' : 'active';
      mockMembers[index] = {
        ...mockMembers[index],
        status: newStatus,
        isActive: newStatus === 'active'
      };
      return mockMembers[index];
    }
    return null;
  },

  // Import from CSV
  importFromCSV: async (csvData: string): Promise<{ success: number; duplicates: number; errors: number; }> => {
    await delay(800);
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    
    let success = 0;
    let duplicates = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        const memberData: any = {};
        
        headers.forEach((header, index) => {
          memberData[header.trim()] = values[index]?.trim();
        });

        // Check for duplicates
        if (mockMembers.find(m => m.email === memberData.email)) {
          duplicates++;
          continue;
        }

        // Validate required fields
        if (!memberData.name || !memberData.email || !memberData.phone) {
          errors++;
          continue;
        }

        // Create member
        const newMember: AdminMember = {
          id: Date.now().toString() + i,
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          role: memberData.role || 'member',
          status: memberData.status || 'active',
          joinDate: new Date(),
          handicap: parseFloat(memberData.handicap) || 0,
          isActive: (memberData.status || 'active') === 'active',
          createdAt: new Date()
        };

        mockMembers.push(newMember);
        success++;
      } catch (error) {
        errors++;
      }
    }

    return { success, duplicates, errors };
  }
};

// -------------------------------------------
// ✅ REAL SERVICE
// -------------------------------------------
const request = async <T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
  };

  try {
    const response = await axios({
      url,
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

const getAllMembers = async (): Promise<Member[]> => {
  const response = await request<Member[]>('/auth/members');
  return response.result;
};

const getMemberById = async (id: string): Promise<Member> => {
  const response = await request<Member>(`/auth/members/${id}`);
  return response.result;
};

const createMember = async (memberData: CreateMemberRequest): Promise<Member> => {
  const response = await request<Member>('/auth/members', {
    method: 'POST',
    data: memberData,
  });
  return response.result;
};

const updateMember = async (id: string, memberData: UpdateMemberRequest): Promise<Member> => {
  const response = await request<Member>(`/auth/members/${id}`, {
    method: 'POST',
    data: memberData,
  });
  return response.result;
};

const patchMember = async (id: string, updates: Partial<Member>): Promise<Member> => {
  const response = await request<Member>(`/auth/members/${id}`, {
    method: 'PATCH',
    data: updates,
  });
  return response.result;
};

const deleteMember = async (id: string): Promise<void> => {
  await request(`/auth/delete/members/${id}`, {
    method: 'POST',
  });
};

const realService = {
  getAll: getAllMembers,
  getById: getMemberById,
  create: createMember,
  update: updateMember,
  patch: patchMember,
  delete: deleteMember,
};

// -------------------------------------------
// ✅ EXPORT FINAL SERVICE BASED ON FLAG
// -------------------------------------------
export const memberService = USE_MOCK ? mockService : realService;
