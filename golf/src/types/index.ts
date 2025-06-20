export type UserRole = 'admin' | 'member' | 'scorer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MemberMock {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: Date;
  handicap: number;
  isActive: boolean;
}

export interface AdminMember extends MemberMock {
  phone: string;
  role: 'admin' | 'member' | 'scorer';
  status: 'active' | 'blocked';
  createdAt: Date;
  lastLogin?: Date;
}

export interface Course {
  id: string;
  name: string;
  location: {
    golfClub: string;
    city: string;
  };
  holes: Hole[];
  par: number;
  totalHoles: number;
  slope: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hole {
  number: number;
  par: number;
  difficulty?: number;
}

export interface Meet {
  id: string;
  name: string;
  date: Date;
  courseId: string;
  course?: Course;
  status: 'upcoming' | 'active' | 'completed';
  participants: string[];
}

export interface Match {
  id: string;
  meetId: string;
  players: string[];
  startTime: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Score {
  id: string;
  matchId: string;
  playerId: string;
  hole: number;
  strokes: number;
  putts?: number;
  enteredBy: 'member' | 'scorer';
  isValid: boolean;
  enteredAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

export interface Prize {
  id: string;
  name: string;
  type: 'cash' | 'trophy' | 'medal' | 'gift' | 'other';
  description: string;
  meetId?: string;
  matchId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchData {
  id: string;
  meetId: string;
  type: 'singles' | 'doubles';
  holes: number;
  teeType: 'shotgun' | 'serial';
  playersPerHole: number;
  teeTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed';
  assignedPlayers: string[];
  customHoleSetup?: Hole[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerHandicapOverride {
  playerId: string;
  originalHandicap: number;
  matchHandicap: number;
}

export interface PlayerRegistration {
  playerId: string;
  status: 'confirmed' | 'waitlisted' | 'withdrawn';
  assignedMatchIds?: string[];
  registrationDate: Date;
}