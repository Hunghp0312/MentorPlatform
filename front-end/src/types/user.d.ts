import { EnumType } from "./commonType";
import { MentorApplicationResponse } from "./approval";

export interface User {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userArenaOfExpertises?: UserAreaOfExpertise[];
}
export interface UserApplication {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userArenaOfExpertises?: UserAreaOfExpertise[];
  fullName?: string;
  avatar?: string | null;
  areaOfExpertise?: string[];
  professionalSkills?: string;
  industryExperience?: string;
  hasMentorApplication?: boolean;
}
export interface UserProfile {
  id?: string;
  photoData?: string;
  fullName?: string;
  bio?: string;
  professionalSkill?: string;
  industryExperience?: string;
  userApplication?: MentorApplicationResponse;
}

export interface UserAreaOfExpertise {
  userId: string;
  arenaOfExpertise?: AreaOfExpertise;
}

export interface AreaOfExpertise {
  name: string;
  userArenaOfExpertises?: UserAreaOfExpertise[];
}
