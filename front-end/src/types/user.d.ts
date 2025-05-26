import { EnumType } from "./commonType";
import { ArenaOfExpertise } from "./mentorapplication";
import { MentorApplication } from "./approval";

export interface User {
  id: string;
  email: string;
  //   passwordHash: string;
  //   lastLogin?: string; // ISO string for DateTime
  //   passwordResetToken?: string;
  //   passwordResetExpiry?: string; // ISO string for DateTime
  //   refreshToken?: string;
  //   refreshTokenExpiryTime?: string; // ISO string for DateTime
  role?: EnumType;
  userProfile?: UserProfile;
  //   userTopicOfInterests?: UserTopicOfInterest[];
  mentorApplications?: MentorApplication;
  submittedMentorApplication?: MentorApplication;
  reviewedMentorApplication?: MentorApplication;
  //   mentoredCourses?: Course[];
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
export interface UserProfile {
  id: string;
  photoData?: string; // Assuming base64 string for binary data
  fullName?: string;
  bio?: string;
  professionalSkill?: string;
  industryExperience?: string;
  availabilityData?: EnumType[];
  //   userGoal?: string;
  //   sessionFrequency?: number;
  //   sessionDuration?: number;
  //   learningStyle?: number;
  //   teachingApproach?: number;
  //   privacyProfile: boolean;
  //   messagePermission: boolean;
  //   notificationsEnabled: boolean;
  communicationMethod?: EnumType;
  user?: User;
}
// export interface UserTopicOfInterest {
//   //   userId: string;
//   //   topicId: string;
//   user?: User;
//   topic?: Topic;
// }
export interface UserArenaOfExpertise {
  userId: string;
  //   arenaOfExpertiseId: string;
  //user?: User;
  arenaOfExpertise?: ArenaOfExpertise;
}
// export interface Topic {
//   id: string;
//   name: string;
//   userTopicOfInterests?: UserTopicOfInterest[];
// }
