export interface Profile {
  id: string;
  childImageId: string; 
  futureRole: string;
  generatedImageId: string;
  childName: string;
  schoolName: string;
  schoolId: string;
  status: string;
  saved: boolean;
  createdAt?: string; 
  updatedAt?: string;  
}

export type Role = "Doctor" | "Engineer" | "Teacher" | "Police" | "Astronaut";

export interface ApiResponse<T> {
  code: number;
  result: T;
}

export interface GenerateImageRequest {
  childImageId: string;
  childName: string;
  futureRole: Role;
}
