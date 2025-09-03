import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  createdDate: string;
  keycloakId: string;
  isEmailVerified: boolean;
  username: string;
  profilePicture: string | null;
  provider: string;
}

export interface LoginTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

export interface LoginProps {
  backendUrl: string;
  onSuccess?: (user: User) => void;
  theme?: LoginTheme;
  customLayout?: ReactNode;
  className?: string;
}