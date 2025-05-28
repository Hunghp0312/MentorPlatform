import { MentorApplicationResponse } from "./approval";
import { EnumType } from "./commonType";
import { AreaOfExpertise } from "./mentorapplication";
import { MentorApplication } from "./approval";

export interface User {
  id: string;
  email: string;
  role?: EnumType;
  userProfile?: UserProfile;
  //   userTopicOfInterests?: UserTopicOfInterest[];
  mentorApplications?: MentorApplication;
  submittedMentorApplication?: MentorApplication;
  reviewedMentorApplication?: MentorApplication;
  //   mentoredCourses?: Course[];
  userAreaOfExpertises?: UserAreaOfExpertise[];
}
export interface UserApplication {
  id: string;
  email: string;
  role?: EnumType;
  profile?: UserProfile;
  userArenaOfExpertises?: UserArenaOfExpertise[];
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
export interface UserAreaOfExpertise {
  userId: string;
  //   AreaOfExpertiseId: string;
  //user?: User;
  AreaOfExpertise?: AreaOfExpertise;
}

export interface ArenaOfExpertise {
  name: string;
  userArenaOfExpertises?: UserArenaOfExpertise[];
}
