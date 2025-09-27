import type { ReactNode } from "react";
import { User } from "./auth";

export interface LoginTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  buttonStyle?: React.CSSProperties;
}

export interface LoginProps {
  backendUrl?: string;
  onSuccess?: (user: User) => void;
  googleLogintheme?: LoginTheme;
  customLayout?: ReactNode;
  className?: string;
  children?: ReactNode; 
}