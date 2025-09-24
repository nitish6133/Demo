export interface SchoolProfile {
  id?: string;           
  schoolName: string;
  schoolLogo?: string;
  address: string;
  professions: string[];
  createdAt?: string;
  userId?: string;
  isDeleted?: boolean;
}

export interface SchoolProfileResponse {
  code: number;
  message: string;
  result: SchoolProfile | SchoolProfile[];
}
