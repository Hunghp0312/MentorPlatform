export interface User {
  id: string;
  email: string;
  passwordHash: string;
  roleId: number;
  lastLogin?: string; // ISO string for DateTime
  passwordResetToken?: string;
  passwordResetExpiry?: string; // ISO string for DateTime
  refreshToken?: string;
  refreshTokenExpiryTime?: string; // ISO string for DateTime
  role?: Role;
  userProfile?: UserProfile;
  userTopicOfInterests?: UserTopicOfInterest[];
  submittedMentorApplication?: MentorApplication;
  reviewedMentorApplication?: MentorApplication;
  mentoredCourses?: Course[];
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
export interface UserProfile {
  id: string;
  photoData?: string; // Assuming base64 string for binary data
  fullName?: string;
  bio?: string;
  professionalSkill?: string;
  industryExperience?: string;
  availabilityData?: number;
  userGoal?: string;
  sessionFrequency?: number;
  sessionDuration?: number;
  learningStyle?: number;
  teachingApproach?: number;
  privacyProfile: boolean;
  messagePermission: boolean;
  notificationsEnabled: boolean;
  communicationMethod?: number;
  user?: User;
}
export interface UserTopicOfInterest {
  userId: string;
  topicId: string;
  user?: User;
  topic?: Topic;
}
export interface UserArenaOfExpertise {
  userId: string;
  arenaOfExpertiseId: string;
  user?: User;
  arenaOfExpertise?: ArenaOfExpertise;
}
