import { Role } from '../types';

export const ROLES: Role[] = [
  "Doctor",
  "Engineer", 
  "Teacher",
  "Police",
  "Astronaut"
];

export const ROLE_EMOJIS: Record<Role, string> = {
  "Doctor": "👩‍⚕️",
  "Engineer": "👷‍♀️",
  "Teacher": "👩‍🏫",
  "Police": "👮‍♀️",
  "Astronaut": "👩‍🚀"
};

export const ROLE_COLORS: Record<Role, string> = {
  "Doctor": "bg-red-100 text-red-800",
  "Engineer": "bg-blue-100 text-blue-800",
  "Teacher": "bg-green-100 text-green-800",
  "Police": "bg-yellow-100 text-yellow-800",
  "Astronaut": "bg-purple-100 text-purple-800"
};