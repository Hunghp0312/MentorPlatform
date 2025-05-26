import { MentorApplicationResponse } from "./approval";
import { EnumType } from "./commonType";
import { ArenaOfExpertise } from "./mentorapplication";

export interface User {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
export interface UserProfile {
  id: string;
  photoData?: string; // Assuming base64 string for binary data
  fullName?: string;
  bio?: string;
  professionalSkill?: string;
  industryExperience?: string;
  userApplication?: MentorApplicationResponse;
}

export interface UserArenaOfExpertise {
  userId: string;
  arenaOfExpertise?: ArenaOfExpertise;
}

export interface ArenaOfExpertise {
  name: string;
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
