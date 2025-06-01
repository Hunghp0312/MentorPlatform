import { EnumType } from "./commonType";
import { MentorApplicationResponse } from "./approval";

export interface User {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userAreaOfExpertises?: UserAreaOfExpertise[];
}
export interface UserApplication {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userAreaOfExpertises?: UserAreaOfExpertise[];
  areaOfExpertise?: { id: number; name: string }[];
  fullName?: string;
  userGoal?: string;
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
  userGoal?: string;
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

export interface UserUpdateRequest {
  photoData?: File;
  fullName: string;
  bio?: string | null;
  professionalSkill: string | null;
  industryExperience: string | null;
  teachingApproaches: number[];
  userProfileAvailabilities: number[];
  userTopicOfInterests: number[];
  userLearningStyles: number[];
  userGoal: string | null;
  sessionFrequencyId: number;
  sessionDurationId: number;
  privacyProfile: boolean;
  messagePermission: boolean;
  notificationsEnabled: boolean;
  communicationMethod: number;
  userAreaExpertises: number[];
}
export interface UserViewResponse {
  id: string;
  photoData?: string;
  role: EnumType;
  fullName: string;
  bio?: string | null;
  professionalSkill: string | null;
  industryExperience: string | null;
  teachingApproaches: EnumType[];
  profileAvailabilities: EnumType[];
  topicOfInterests: EnumType[];
  learningStyles: EnumType[];
  userGoal: string | null;
  sessionFrequency: EnumType;
  sessionDuration: EnumType;
  privacyProfile: boolean;
  messagePermission: boolean;
  notificationsEnabled: boolean;
  communicationMethod: EnumType;
  areaOfExpertises: EnumType[];
}
