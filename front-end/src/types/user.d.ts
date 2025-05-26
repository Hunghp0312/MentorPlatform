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
export interface UserApplication {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userArenaOfExpertises?: UserArenaOfExpertise[];
  // Các trường bổ sung từ console log (nếu cần đặt trực tiếp trong User)
  fullName?: string;
  avatar?: string | null;
  areaOfExpertise?: string[];
  professionalSkills?: string;
  industryExperience?: string;
  hasMentorApplication?: boolean;
}
export interface UserProfile {
  id?: string;
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
